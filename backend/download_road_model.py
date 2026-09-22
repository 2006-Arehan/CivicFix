from pathlib import Path

import requests
from tqdm import tqdm


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "road_damage_best.pt"


def download_model():
    # URL to a specialized YOLOv8 Road Damage model (RDD2022)
    # This model is specifically trained to detect potholes and cracks while ignoring everything else.
    url = "https://huggingface.co/ozair23/yolov8-road-damage-detector/resolve/main/best.pt"
    if MODEL_PATH.exists() and MODEL_PATH.stat().st_size > 1024:
        print(f"✅ Model already exists: {MODEL_PATH}")
        return
    
    print(f"🚀 Downloading specialized Road Damage model from HuggingFace...")
    print(f"🔗 Source: {url}")
    
    response = requests.get(url, stream=True, timeout=(15, 300))
    response.raise_for_status()
    total_size = int(response.headers.get('content-length', 0))
    block_size = 1024 * 1024
    temporary_path = MODEL_PATH.with_suffix(".pt.download")
    
    progress_bar = tqdm(total=total_size, unit='iB', unit_scale=True)
    
    with temporary_path.open('wb') as file:
        for data in response.iter_content(block_size):
            if not data:
                continue
            progress_bar.update(len(data))
            file.write(data)
    
    progress_bar.close()
    
    if total_size != 0 and progress_bar.n != total_size:
        temporary_path.unlink(missing_ok=True)
        raise RuntimeError("Model download was incomplete.")

    temporary_path.replace(MODEL_PATH)
    print(f"✅ SUCCESS: Model saved as {MODEL_PATH}")

if __name__ == "__main__":
    download_model()
