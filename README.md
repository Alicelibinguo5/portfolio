# Portfolio Website

Personal portfolio with a modern React frontend and a FastAPI backend.

## What's included

- **Frontend** (Vite + React + TS + Tailwind)
  - Home with value proposition and social links
  - Projects page (GitHub repo fetch, starred-only filter, tags, featured pin)
  - Blog with create/edit/delete, formatting toolbar (bold/italic/code), paste‑to‑image, and optional S3 image upload
  - About with embedded resume (bundled PDF)
  - Contact form (to FastAPI) and visible email/LinkedIn/GitHub
  - Deployed on Vercel (hash routing)

- **Backend** (FastAPI)
  - `/api/health` health check
  - `/api/github/*` GitHub proxy for repos
  - `/api/contact/*` contact submission endpoint
  - `/api/resume` serve resume PDF (optional if using bundled PDF)
  - `/api/blog/*` Postgres‑backed blog CRUD (sync SQLAlchemy + psycopg binary)
  - `/api/uploads/presign` S3 presigned upload for images

## Prerequisites

- Python 3.13+
- Node.js 18+
- Docker (for Postgres, required for blog)

## Get started (local)

All commands are run from the project root.

### 1. Install dependencies

```bash
make install
```

Or install separately:

```bash
make install-backend   # uv sync
make install-frontend  # npm install
```

### 2. Start Postgres (required for blog)

```bash
make postgres
```

Starts Postgres in Docker on port 5434 (or `make postgres PG_PORT=5435` for another port).

### 3. Run the app

**Full stack (recommended)** – backend serves the built frontend at http://localhost:8000:

```bash
make dev
```

Visit **http://localhost:8000/#/**

**Or run backend and frontend separately:**

```bash
# Terminal 1: backend at http://localhost:8000
make backend

# Terminal 2: frontend dev server at http://localhost:5173
make frontend
```

### 4. Other useful commands

```bash
make help              # List all targets
make test              # Run backend + frontend checks
make test-backend      # Backend tests only (pytest)
make test-frontend     # Frontend typecheck + build
make build             # Build frontend for production (GitHub Pages)
make build-dev         # Build frontend for local backend
make preview           # Serve built frontend on port 5173
make clean             # Remove frontend dist and Python caches
```

## Deploy

- **Frontend:** GitHub Pages via Actions (hash routing; set Vite base to your repo path)
- **Backend:** Railway

### Backend on Railway

1. Create a new project on [Railway](https://railway.app) and add a **service** from your GitHub repo.
2. Set the service **Root Directory** to `backend` (Settings → General → Root Directory).
3. Railway uses **Railpack**: it runs `uv sync` and starts with `uv run uvicorn ...`. No `requirements.txt` needed.
4. Add a **Postgres** plugin and connect it. Railway sets `DATABASE_URL` automatically.
5. Set **Variables** in the backend service:

   ```
   DATABASE_URL=postgresql://...   # from Railway Postgres
   SEED_BLOG=true                 # optional: seed demo posts
   AWS_REGION=<region>
   AWS_ACCESS_KEY_ID=<key>
   AWS_SECRET_ACCESS_KEY=<secret>
   S3_BUCKET=<bucket-name>
   S3_PUBLIC_BASE=https://...     # optional
   ```

6. Under **Networking**, generate a **public domain**. Use this URL as `VITE_API_URL` for the frontend.

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com), sign in with GitHub, and **Add New** → **Project**.
2. Import your repo. Set **Root Directory** to `frontend` (Edit → set to `frontend` and Save).
3. Vercel will detect Vite from `frontend/vercel.json`. No need to change Build Command or Output Directory unless you prefer.
4. In **Settings → Environment Variables**, add (for Production, and optionally Preview):

   | Name            | Value                                      |
   |-----------------|--------------------------------------------|
   | `VITE_BASE`     | `/`                                        |
   | `VITE_API_URL`  | `https://<your-backend>.up.railway.app`    |
   | `VITE_LINKEDIN_URL` | `https://www.linkedin.com/in/libinguo/` |
   | `VITE_CONTACT_EMAIL` | your email                            |

5. Deploy. Every push to `main` will deploy; you’ll get a URL like `https://your-project.vercel.app`.

## Folder structure

- `backend/` – FastAPI application
- `frontend/` – React + Vite + TypeScript + Tailwind
