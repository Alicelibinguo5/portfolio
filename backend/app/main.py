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

    frontend_dist = (Path(__file__).resolve().parents[2] / "frontend" / "dist").resolve()
    if frontend_dist.exists():
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
            # Serve static files from dist root (e.g. me.png from public/)
            static_file = (frontend_dist / full_path).resolve()
            if static_file.is_file() and static_file.parent == frontend_dist:
                return FileResponse(str(static_file))
            # SPA fallback
            index_file = frontend_dist / "index.html"
            if not index_file.exists():
                raise HTTPException(status_code=404, detail="index.html not found")
            return FileResponse(str(index_file))

    return app


app = create_app()
