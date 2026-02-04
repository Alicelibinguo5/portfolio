"""Portfolio FastAPI application."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.routers import blog, contact, github, projects, resume, uploads


def _init_blog_db() -> None:
    """Initialize blog DB tables and optional seeding. Called at startup."""
    try:
        blog.init_blog_db()
    except RuntimeError:
        pass  # DATABASE_URL not configured; other routers still work


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    """Application lifespan: startup and shutdown."""
    _init_blog_db()
    yield


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]

    app = FastAPI(
        title="Portfolio API",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins if origins else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
    app.include_router(contact.router, prefix="/api/contact", tags=["contact"])
    app.include_router(github.router, prefix="/api/github", tags=["github"])
    app.include_router(blog.router, prefix="/api/blog", tags=["blog"])
    app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
    app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])

    @app.get("/api/health")
    def health() -> dict:
        return {"status": "ok"}

    # Next.js static export outputs to "out"; Vite uses "dist"
    _frontend_root = Path(__file__).resolve().parents[2] / "frontend"
    frontend_dist = (_frontend_root / "out").resolve() if (_frontend_root / "out").exists() else (_frontend_root / "dist").resolve()
    if frontend_dist.exists():
        # Next.js: mount _next for JS/CSS
        next_static = frontend_dist / "_next"
        if next_static.exists():
            app.mount("/_next", StaticFiles(directory=str(next_static)), name="next")
        # Vite: mount assets
        assets_dir = frontend_dist / "assets"
        if assets_dir.exists():
            app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

        @app.get("/")
        def index_root() -> FileResponse:
            index_file = frontend_dist / "index.html"
            if not index_file.exists():
                raise HTTPException(status_code=404, detail="index.html not found")
            return FileResponse(str(index_file))

        @app.get("/{full_path:path}")
        def serve_static_or_spa(full_path: str) -> FileResponse:
            safe_path = (frontend_dist / full_path).resolve()
            # Serve existing files (me.png, resume.pdf, _next/...)
            if safe_path.is_file() and str(safe_path).startswith(str(frontend_dist)):
                return FileResponse(str(safe_path))
            # Next.js: try {path}.html or {path}/index.html
            html_file = frontend_dist / f"{full_path}.html"
            if html_file.is_file():
                return FileResponse(str(html_file))
            index_in_path = frontend_dist / full_path / "index.html"
            if index_in_path.is_file():
                return FileResponse(str(index_in_path))
            # SPA fallback (client-side routing)
            index_file = frontend_dist / "index.html"
            if not index_file.exists():
                raise HTTPException(status_code=404, detail="index.html not found")
            return FileResponse(str(index_file))

    return app


app = create_app()
