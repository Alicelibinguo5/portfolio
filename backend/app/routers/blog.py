from __future__ import annotations

from datetime import UTC
from typing import TYPE_CHECKING

from fastapi import APIRouter, HTTPException, Query, Request, Response
from pydantic import BaseModel
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    MetaData,
    String,
    Table,
    Text,
    create_engine,
    func,
    select,
    text,
)

from app.config import get_settings
from app.models import BlogPost, BlogPostCreate, BlogPostListItem, BlogPostUpdate

if TYPE_CHECKING:
    from sqlalchemy import Engine

router = APIRouter()


class Db:
    engine: Engine | None = None
    table: Table | None = None


def _get_engine() -> Engine:
    if Db.engine is None:
        settings = get_settings()
        dsn = settings.dsn
        if not dsn:
            raise RuntimeError("DATABASE_URL not configured")
        Db.engine = create_engine(dsn, pool_pre_ping=True, future=True)
    return Db.engine


def _get_table() -> Table:
    if Db.table is None:
        metadata = MetaData()
        Db.table = Table(
            "blog_posts",
            metadata,
            Column("slug", String(200), primary_key=True),
            Column("title", String(300), nullable=False),
            Column("summary", String(1000), nullable=False),
            Column("content", Text, nullable=False),
            Column("tags", JSON, nullable=True),
            Column("published", Boolean, server_default=text("true")),
            Column("created_at", DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP")),
            Column(
                "updated_at",
                DateTime(timezone=True),
                server_default=text("CURRENT_TIMESTAMP"),
                onupdate=text("CURRENT_TIMESTAMP"),
            ),
        )
    return Db.table


def init_blog_db() -> None:
    """Initialize blog DB tables and optional seeding. Called from app lifespan."""
    engine = _get_engine()
    table = _get_table()
    settings = get_settings()
    with engine.begin() as conn:
        table.metadata.create_all(conn)
        try:
            conn.exec_driver_sql(
                "CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at)"
            )
        except Exception:
            pass
        if settings.seed_blog:
            count = conn.execute(select(func.count()).select_from(table)).scalar_one()
            if count == 0:
                conn.execute(
                    table.insert().values([
                        {
                            "slug": "hello-world",
                            "title": "Hello, world",
                            "summary": "Welcome to my blog — first post seeded for demo.",
                            "content": "This is a sample post created during initial seeding.",
                        },
                        {
                            "slug": "real-time-ads-metrics-pipeline",
                            "title": "A Minimal Real‑Time Ads Metrics Pipeline",
                            "summary": "Kafka → Flink → Iceberg → Superset: pragmatic baseline.",
                            "content": "Notes on design trade‑offs, checkpoints, and dashboarding.",
                        },
                    ])
                )


def _slugify(title: str) -> str:
    s = "".join(ch.lower() if ch.isalnum() else "-" for ch in title).strip("-")
    while "--" in s:
        s = s.replace("--", "-")
    return s


@router.get("/", response_model=list[BlogPostListItem])
def list_posts(
    request: Request,
    response: Response,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
) -> list[BlogPostListItem]:
    engine = _get_engine()
    table = _get_table()
    offset = (page - 1) * page_size
    with engine.connect() as conn:
        total = conn.execute(select(func.count()).select_from(table)).scalar_one()
        # Compute validators for conditional caching
        max_created_at = conn.execute(select(func.max(table.c.created_at))).scalar()
        query = (
            select(table.c.slug, table.c.title, table.c.summary, table.c.created_at)
            .order_by(table.c.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        rows = conn.execute(query).mappings().all()
        items = [
            BlogPostListItem(
                slug=row["slug"],
                title=row["title"],
                summary=row["summary"],
                created_at=row["created_at"].isoformat() if row["created_at"] else "",
            )
            for row in rows
        ]
    # Conditional caching: ETag/Last-Modified
    if response is not None:
        if max_created_at is not None:
            try:
                # Ensure aware datetime for consistent formatting
                if getattr(max_created_at, "tzinfo", None) is None:
                    max_created_at = max_created_at.replace(tzinfo=UTC)
                # Format Last-Modified as RFC 1123
                last_mod_http = max_created_at.strftime("%a, %d %b %Y %H:%M:%S GMT")
            except Exception:
                last_mod_http = ""
            # timestamp may not be available on some backends; fallback to iso hash
            try:
                ts_int = int(max_created_at.timestamp())  # type: ignore[attr-defined]
            except Exception:
                ts_int = 0
            etag = f'W/"{total}-{ts_int}"'
            # Check If-None-Match / If-Modified-Since
            inm = request.headers.get("if-none-match") if request is not None else None
            ims = request.headers.get("if-modified-since") if request is not None else None
            if inm == etag or (last_mod_http and ims == last_mod_http):
                # Not modified
                response.headers["ETag"] = etag
                if last_mod_http:
                    response.headers["Last-Modified"] = last_mod_http
                response.status_code = 304
                return []
            response.headers["ETag"] = etag
            if last_mod_http:
                response.headers["Last-Modified"] = last_mod_http

    # Pagination and caching headers
    end_index = offset + len(items) - 1 if items else offset
    if response is not None:
        response.headers["X-Total-Count"] = str(total)
        response.headers["Content-Range"] = f"posts {offset}-{end_index}/{total}"
        response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=120"
    return items


@router.get("/backup", response_model=list[BlogPost])
def backup_posts() -> list[BlogPost]:
    engine = _get_engine()
    table = _get_table()
    with engine.connect() as conn:
        rows = conn.execute(table.select().order_by(table.c.created_at.desc())).mappings().all()
        return [
            BlogPost(
                **{
                    **row,
                    "created_at": row["created_at"].isoformat() if row["created_at"] else "",
                }
            )
            for row in rows
        ]


class RestoreItem(BaseModel):
    slug: str
    title: str
    summary: str
    content: str
    created_at: str | None = None


@router.post("/restore", response_model=dict)
def restore_posts(payload: list[RestoreItem]) -> dict:
    engine = _get_engine()
    table = _get_table()
    with engine.begin() as conn:
        conn.execute(table.delete())
        for p in payload:
            conn.execute(table.insert().values(
                slug=p.slug,
                title=p.title,
                summary=p.summary,
                content=p.content,
            ))
    return {"ok": True, "count": len(payload)}


@router.get("/{slug}", response_model=BlogPost)
def get_post(slug: str) -> BlogPost:
    engine = _get_engine()
    table = _get_table()
    with engine.connect() as conn:
        row = conn.execute(table.select().where(table.c.slug == slug)).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Post not found")
        return BlogPost(**{**row, "created_at": row["created_at"].isoformat() if row["created_at"] else ""})


@router.post("/", response_model=BlogPost)
def create_post(payload: BlogPostCreate) -> BlogPost:
    engine = _get_engine()
    table = _get_table()
    slug = _slugify(payload.title)
    with engine.begin() as conn:
        exists = conn.execute(table.select().where(table.c.slug == slug)).first()
        if exists:
            raise HTTPException(status_code=400, detail="Slug already exists")
        conn.execute(table.insert().values(
            slug=slug,
            title=payload.title,
            summary=payload.summary,
            content=payload.content,
        ))
    return get_post(slug)


@router.put("/{slug}", response_model=BlogPost)
def update_post(slug: str, payload: BlogPostUpdate) -> BlogPost:
    engine = _get_engine()
    table = _get_table()
    with engine.begin() as conn:
        row = conn.execute(table.select().where(table.c.slug == slug)).first()
        if not row:
            raise HTTPException(status_code=404, detail="Post not found")
        update_values = {}
        if payload.title is not None:
            update_values["title"] = payload.title
        if payload.summary is not None:
            update_values["summary"] = payload.summary
        if payload.content is not None:
            update_values["content"] = payload.content
        if update_values:
            conn.execute(table.update().where(table.c.slug == slug).values(**update_values))
    return get_post(slug)


@router.delete("/{slug}", response_model=dict)
def delete_post(slug: str) -> dict:
    engine = _get_engine()
    table = _get_table()
    with engine.begin() as conn:
        exists = conn.execute(select(table.c.slug).where(table.c.slug == slug)).first()
        if not exists:
            raise HTTPException(status_code=404, detail="Post not found")
        conn.execute(table.delete().where(table.c.slug == slug))
    return {"ok": True}





