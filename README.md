# CivicFix

CivicFix is a React/Vite dashboard with a FastAPI + YOLO road-damage detection
service. The frontend is deployable to GitHub Pages and the backend is
deployable to Render.

## What was fixed

- The backend no longer imports undeclared packages or silently falls back to a
  model that cannot detect road damage.
- Model and training-data paths are resolved relative to `backend/`, so they
  work on Render and when the command is run from the repository root.
- Added `/health` for deployment checks and clear 4xx/5xx responses for invalid
  uploads and inference failures.
- Replaced the conflicting GUI OpenCV dependency in the Render build with the
  headless package required by a server.
- The frontend API URL is configurable with `VITE_API_URL`.
- The frontend now passes lint and production build checks.

## Run locally

### Backend

Use Python 3.11 for the most predictable Ultralytics installation:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Ultralytics can install GUI OpenCV as a transitive dependency. A server
# should use the headless build instead.
pip uninstall -y opencv-python
pip install --no-deps opencv-python-headless

python main.py
```

Check that the model loaded:

```bash
curl http://localhost:8000/health
```

The response must contain `"model_ready": true`.

### Frontend

In a second terminal:

```bash
npm install
cp .env.example .env
npm run dev
```

The local frontend uses `http://localhost:8000` by default. The current
GitHub Pages hostname defaults to `https://civicfix-backend.onrender.com`.
Set `VITE_API_URL` in `.env` or in the production build environment if your
Render service has a different URL.

## Deploy the backend to Render

1. Create a Render Blueprint from this repository.
2. Render will use `render.yaml`, which sets `backend/` as the service root,
   installs the dependencies, downloads the model if it is missing, and starts
   Uvicorn on Render's `$PORT`.
3. Open `https://<your-render-service>.onrender.com/health`.
4. Continue only when the response says `"model_ready": true`.

The `FRONTEND_ORIGINS` value in `render.yaml` allows the current GitHub Pages
origin. If you use a custom frontend domain, change that value in Render.

## Deploy the frontend to GitHub Pages

Replace the URL below with the actual Render service URL:

```bash
VITE_API_URL=https://<your-render-service>.onrender.com npm run build
npm run deploy
```

Do not leave `VITE_API_URL` pointing at `localhost` in the production build.
The browser runs the frontend on GitHub Pages, so `localhost` means the
visitor's own computer, not the Render server.

## Current product scope

The AI detection endpoint is real and tested. The dashboards, demo accounts,
charts, and map data are still client-side demo data; login currently stores a
user in browser local storage and report submission is not yet persisted by a
database. For a production civic reporting system, the next implementation
should add database-backed users/reports, real authentication, image storage,
and admin/maintenance APIs.