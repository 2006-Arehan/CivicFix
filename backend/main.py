import os
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parent
DATA_COLLECTION_DIR = BASE_DIR / "training_data_enrichment"
DATA_COLLECTION_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="CivicFix ML Backend", version="1.0.0")

# GitHub Pages and local development are separate origins. Configure a
# comma-separated FRONTEND_ORIGINS value in production when possible.
configured_origins = os.getenv("FRONTEND_ORIGINS", "")
allowed_origins = [
    origin.strip().rstrip("/")
    for origin in configured_origins.split(",")
    if origin.strip()
]
allowed_origins.extend(["http://localhost:5173", "http://localhost:4173"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(set(allowed_origins)),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Do not silently fall back to a COCO model. COCO has no road-damage classes,
# so a successful request with that model would produce misleading results.
MODEL_PATH = Path(
    os.getenv("ROAD_DAMAGE_MODEL_PATH", str(BASE_DIR / "road_damage_best.pt"))
)
model = None
model_error = None

try:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file does not exist: {MODEL_PATH}")
    model = YOLO(str(MODEL_PATH))
    print(f"[INFO] Using specialized road-damage model: {MODEL_PATH}")
except Exception as exc:
    model_error = str(exc)
    print(f"[ERROR] Could not load road-damage model: {model_error}")

# Strict Allow-List for Road Damage (Classes from RDD2022 dataset + Generic types)
ALLOWED_ROAD_CLASSES = [
    "pothole", "longitudinal crack", "transverse crack", "alligator crack", 
    "crack", "surface damage", "d00", "d10", "d20", "d40", "d43", "d44", "d11", "d50",
    "manhole", "drainage", "water", "edge crack"
]

@app.get("/")
async def root():
    return {"service": "civicfix-backend", "status": "ok"}


@app.get("/health")
async def health():
    """A deployment-friendly health check that also reports model readiness."""
    return {
        "status": "ok" if model is not None else "degraded",
        "model_ready": model is not None,
        "model_path": str(MODEL_PATH),
        "model_error": model_error,
    }

@app.post("/detect")
async def detect_damage(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Road-damage model is unavailable. Check the backend deployment logs.",
        )

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Only image uploads are supported.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be smaller than 10 MB.")

    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")

    try:
        # imgsz=640 and lower conf can help catch smaller/faded potholes.
        results = model.predict(img, imgsz=640, conf=0.20, verbose=False)
    except Exception as exc:
        print(f"[ERROR] Inference failed: {exc}")
        raise HTTPException(status_code=500, detail="Road-damage detection failed.") from exc
    
    detections = []
    save_for_training = False
    
    for result in results:
        boxes = result.boxes
        for box in boxes:
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            names = result.names
            raw_name = names.get(cls_id, "unknown") if isinstance(names, dict) else names[cls_id]
            label = str(raw_name).lower()
            
            # If we detect something with low confidence (0.1 to 0.3), 
            # we mark it to be saved for future training (Active Learning).
            if 0.1 <= conf <= 0.3:
                save_for_training = True
            
            if not any(target in label for target in ALLOWED_ROAD_CLASSES):
                continue
            
            label_map = {
                "d00": "Longitudinal Crack",
                "d10": "Transverse Crack",
                "d20": "Alligator Crack",
                "d40": "Pothole",
                "d43": "Surface Damage",
                "d44": "Drainage Issue",
                "d11": "Edge Crack",
                "d50": "Manhole Issue",
                "longitudinal crack": "Longitudinal Crack",
                "transverse crack": "Transverse Crack",
                "alligator crack": "Alligator Crack",
                "pothole": "Pothole",
                "other corruption": "Surface Damage"
            }
            raw_label = label_map.get(label, label)
            display_label = str(raw_label).capitalize() if raw_label else "Unknown"
            
            detections.append({
                "box": [float(value) for value in box.xyxy[0].tolist()],
                "confidence": conf,
                "label": display_label,
                "class_id": cls_id
            })

    # ACTIVE LEARNING: Save difficult cases for future "Better Training"
    if save_for_training:
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        filepath = DATA_COLLECTION_DIR / f"training_sample_{timestamp}_{uuid4().hex[:8]}.jpg"
        cv2.imwrite(filepath, img)

    return {
        "detections": detections,
        "is_specialized": True,
        "summary": {
            "count": len(detections),
            "classes": list(set([d["label"] for d in detections]))
        }
    }

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
