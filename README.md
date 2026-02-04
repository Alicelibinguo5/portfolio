# Portfolio Website

Personal portfolio with a modern React frontend and a FastAPI backend.

## What’s included
- Frontend (Vite + React + TS + Tailwind)
  - Home with value proposition and social links
  - Projects page (GitHub repo fetch, starred-only filter, tags, featured pin)
  - Blog with create/edit/delete, formatting toolbar (bold/italic/code), paste‑to‑image, and optional S3 image upload
  - About with embedded resume (bundled PDF)
  - Contact form (to FastAPI) and visible email/LinkedIn/GitHub
  - GitHub Pages friendly (hash routing, base path configured)
- Backend (FastAPI)
  - `/api/health` health check
  - `/api/github/*` GitHub proxy for repos
  - `/api/contact/*` contact submission endpoint
  - `/api/resume` serve resume PDF (optional if using bundled PDF)
  - `/api/blog/*` Postgres‑backed blog CRUD (sync SQLAlchemy + psycopg binary)
  - `/api/uploads/presign` S3 presigned upload for images




## Get started (local)

**Prereqs:** Python 3.13+ and Node.js 18+

### 1. Backend

From the project root:

```bash
cd backend
```

**Option A – uv (recommended)**

```bash
uv sync
```

**Option B – pip + venv**

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

**Postgres (required for blog)**

```bash
# Start Postgres in Docker (run once). Uses 5434 to avoid clashing with other Postgres on 5433.
docker run --name portfolio-pg \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portfolio \
  -p 5434:5432 -d postgres:16
```

If you see “port is already allocated”, either use the existing container (`docker start portfolio-pg`) or pick another host port (e.g. `-p 5435:5432`) and set `DATABASE_URL` to that port.

Set env and start the API. **Run uvicorn from the `backend/` directory** (so Python can find the `app` package):

```bash
export DATABASE_URL=postgresql://postgres:postgres@localhost:5434/portfolio
export SEED_BLOG=true   # optional: seed two demo blog posts if table is empty

# From backend/ (you should already be there after the steps above).
# Use "uv run" so uvicorn runs with the project's deps (e.g. pdfminer.six).
uv run uvicorn app.main:app --reload --port 8000
```

Or from the project root in one go:

```bash
cd backend && export DATABASE_URL=postgresql://postgres:postgres@localhost:5434/portfolio && uv run uvicorn app.main:app --reload --port 8000
```

If you use pip/venv instead of uv, activate the venv first, then run `uvicorn app.main:app --reload --port 8000` (deps must be installed with `pip install -e ".[dev]"`).

Backend will be at **http://localhost:8000**. Check **http://localhost:8000/api/health**.

### 2. Frontend (dev server)

In a new terminal, from the project root:

```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

Open the URL Vite prints (e.g. **http://localhost:5173/#/**). The app will talk to your local backend.

### 3. Testing locally

**Backend tests**

From `backend/`:

```bash
uv run pytest
# or with venv:  pytest
```

Uses an in-memory SQLite DB; no Postgres needed for tests.

**Frontend**

```bash
cd frontend
npm run build
```

To try the production build locally:

```bash
npm run preview
# Open http://localhost:5173
```

**Full stack (backend serves built frontend)**

From repo root: `make dev` (builds frontend, then runs backend at http://localhost:8000).

Or manually:

```bash
cd frontend && npm run build
cd ../backend && uv run uvicorn app.main:app --reload --port 8000
```

Visit **http://localhost:8000/#/** (backend serves the built SPA).

## Deploy
- **Frontend:** GitHub Pages via Actions (hash routing; set Vite base to your repo path)
- **Backend:** Railway

### Backend on Railway

1. Create a new project on [Railway](https://railway.app) and add a **service** from your GitHub repo.
2. Set the service **Root Directory** to `backend` (Settings → General → Root Directory).
3. Railway uses the **Railpack** builder (see `backend/railway.json`): it will run `uv sync` from `backend/` (using `pyproject.toml` and `uv.lock`) and start with `uv run uvicorn ...`. No `requirements.txt` needed.
4. Add a **Postgres** plugin in the same project (or use an external Postgres) and connect it. Railway will set `DATABASE_URL` automatically if you use their Postgres plugin.
5. In the backend service, set **Variables** (env):

```
DATABASE_URL=postgresql://...   # from Railway Postgres or your own
SEED_BLOG=true                 # optional: seed demo posts once
AWS_REGION=<region>
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
S3_BUCKET=<bucket-name>
S3_PUBLIC_BASE=https://...     # optional
```

6. Under **Networking**, generate a **public domain** (e.g. `https://your-backend.up.railway.app`). Use this URL as `VITE_API_URL` when building the frontend.

### Frontend (GitHub Pages) repo secrets

Set these in the repo **Settings → Secrets and variables → Actions** so the Pages workflow can build with the correct API URL:

```
VITE_API_URL=https://<your-backend>.up.railway.app
VITE_LINKEDIN_URL=https://www.linkedin.com/in/libinguo/
VITE_CONTACT_EMAIL=libinguo89@gmail.com
```

## Folder structure
- `backend/`: FastAPI application
- `frontend/`: React + Vite + TypeScript + Tailwind