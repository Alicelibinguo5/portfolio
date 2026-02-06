from __future__ import annotations

import re
from datetime import UTC
from typing import TYPE_CHECKING, Annotated
from urllib.parse import urlparse, urljoin

import feedparser
import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from markdownify import markdownify as md
from pydantic import BaseModel, HttpUrl
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
from app.services import cache as cache_svc

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


def _user_cache_hint(request: Request | None) -> str | None:
    """Hint for cache key when request looks like a signed-in user (Cookie or Authorization). Longer TTL used."""
    if not request:
        return None
    if request.headers.get("Authorization") or request.headers.get("Cookie"):
        return request.headers.get("Authorization") or request.headers.get("Cookie") or None
    return None


@router.get("/")
def list_posts(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
) -> Response:
    # Redis cache: skip if conditional request (we'd need to return 304 from cache)
    if not request.headers.get("if-none-match") and not request.headers.get("if-modified-since"):
        user_hint = _user_cache_hint(request)
        key = cache_svc.cache_key("blog:list", str(page), str(page_size), user_hint=user_hint)
        ttl = 300 if user_hint else 60
        cached = cache_svc.get_cached(key)
        if cached is not None:
            return JSONResponse(
                content=cached["items"],
                headers={
                    "X-Total-Count": str(cached["total"]),
                    "Content-Range": cached["content_range"],
                    "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
                }
            )

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
    headers = {}
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
        inm = request.headers.get("if-none-match")
        ims = request.headers.get("if-modified-since")
        if inm == etag or (last_mod_http and ims == last_mod_http):
            # Not modified
            return JSONResponse(
                content=[],
                status_code=304,
                headers={
                    "ETag": etag,
                    "Last-Modified": last_mod_http,
                }
            )
        headers["ETag"] = etag
        if last_mod_http:
            headers["Last-Modified"] = last_mod_http

    # Pagination and caching headers
    end_index = offset + len(items) - 1 if items else offset
    headers["X-Total-Count"] = str(total)
    headers["Content-Range"] = f"posts {offset}-{end_index}/{total}"
    headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=120"

    # Store in Redis for next time (signed-in user gets longer TTL)
    if not request.headers.get("if-none-match") and not request.headers.get("if-modified-since"):
        user_hint = _user_cache_hint(request)
        key = cache_svc.cache_key("blog:list", str(page), str(page_size), user_hint=user_hint)
        ttl = 300 if user_hint else 60
        items_dict = [i.model_dump() for i in items]
        cache_svc.set_cached(key, {"items": items_dict, "total": total, "content_range": headers["Content-Range"]}, ttl)

    return JSONResponse(content=[i.model_dump() for i in items], headers=headers)


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


class BlogImportRequest(BaseModel):
    url: HttpUrl


def _fetch_from_substack_rss(url: str) -> tuple[str, str, str] | None:
    """Try to fetch article from Substack RSS feed. Returns None if not found."""
    parsed = urlparse(url)
    # Extract the newsletter name from URL
    # e.g., https://aliceguo.substack.com/p/iceberg-ahead -> aliceguo
    # or https://substack.com/@aliceguo/p/iceberg-ahead -> aliceguo
    host = (parsed.netloc or "").lower()

    newsletter_name = None
    if host.endswith(".substack.com"):
        newsletter_name = host.replace(".substack.com", "")
    elif "/@" in url:
        match = re.search(r'/@([^/]+)', url)
        if match:
            newsletter_name = match.group(1)

    if not newsletter_name:
        return None
    # Try both formats: newsletter.substack.com/feed and substack.com/@newsletter/feed
    rss_urls = [
        f"https://{newsletter_name}.substack.com/feed",
        f"https://substack.com/@{newsletter_name}/feed",
    ]

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    }

    with httpx.Client(follow_redirects=True, timeout=10.0) as client:
        for rss_url in rss_urls:
            try:
                resp = client.get(rss_url, headers=headers)
                if resp.status_code != 200:
                    continue
                feed = feedparser.parse(resp.text)

                # Find the matching entry by comparing link
                for entry in feed.entries:
                    entry_link = entry.get('link', '')
                    if url in entry_link or entry_link in url:
                        title = entry.get('title', '')
                        # Get content from content or description
                        content = ''
                        if 'content' in entry and entry['content']:
                            content = entry['content'][0].get('value', '')
                        elif 'description' in entry:
                            content = entry['description']
                        elif 'summary' in entry:
                            content = entry['summary']

                        if not content:
                            continue

                        # Convert HTML content to markdown
                        content_soup = BeautifulSoup(content, "html.parser")
                        # Remove script/style tags
                        for tag in content_soup.select("script, style"):
                            tag.decompose()

                        content_html = str(content_soup)
                        content_md = md(
                            content_html,
                            heading_style="ATX",
                            strip=["script", "style"],
                            escape_asterisks=False,
                            escape_underscores=False,
                        )
                        content_md = re.sub(r"\n{3,}", "\n\n", content_md).strip()

                        if not content_md:
                            continue

                        # Generate summary from content
                        plain = re.sub(r"\s+", " ", content_soup.get_text(separator=" ", strip=True))
                        summary = (plain[:297] + "...") if len(plain) > 300 else plain
                        if not summary:
                            summary = title[:200]

                        return (title, summary, content_md)
            except Exception:
                continue

    return None


def _fetch_and_parse_article(url: str) -> tuple[str, str, str]:
    """Fetch URL, parse HTML, return (title, summary, content_markdown). Raises ValueError on failure."""

    # For Substack, try RSS feed first (better content quality, avoids JS rendering issues)
    parsed = urlparse(url)
    if "substack.com" in (parsed.netloc or "").lower():
        rss_result = _fetch_from_substack_rss(url)
        if rss_result:
            return rss_result
        # Fall through to HTML parsing if RSS fails

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
    }
    with httpx.Client(follow_redirects=True, timeout=20.0) as client:
        resp = client.get(url, headers=headers)
        resp.raise_for_status()
        html = resp.text

    soup = BeautifulSoup(html, "html.parser")

    # Title: og:title, then <title>, then first h1
    title = ""
    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        title = og_title["content"].strip()
    if not title and soup.title and soup.title.string:
        title = soup.title.string.strip()
    if not title:
        h1 = soup.find("h1")
        if h1 and h1.get_text(strip=True):
            title = h1.get_text(strip=True)
    if not title:
        raise ValueError("Could not extract title from page")

    # Main content: platform-specific selectors then fallbacks
    article_body = None
    host = (parsed.netloc or "").lower()

    if "medium.com" in host:
        # Medium: article body is often in article section with specific structure
        article_body = (
            soup.find("article")
            or soup.find("section", attrs={"data-field": "body"})
            or soup.select_one("[role='article']")
        )
    elif "substack.com" in host:
        # Substack: try more specific selectors for modern layout
        article_body = (
            soup.select_one(".available-content")
            or soup.select_one(".post-content")
            or soup.select_one("div[data-testid=\"post-content\"]")
            or soup.select_one(".body")
            or soup.select_one(".post-body")
            or soup.find("article")
        )

    if not article_body:
        article_body = soup.find("main") or soup.find(attrs={"role": "article"}) or soup.find("article")
    if not article_body:
        article_body = soup.find("body")

    if not article_body:
        raise ValueError("Could not find article content on page")

    # Strip script/style and convert to markdown
    for tag in article_body.select("script, style, nav, header, footer, .comments"):
        tag.decompose()
    content_html = str(article_body)
    content_md = md(
        content_html,
        heading_style="ATX",
        strip=["script", "style"],
        escape_asterisks=False,
        escape_underscores=False,
    )
    content_md = re.sub(r"\n{3,}", "\n\n", content_md).strip()
    if not content_md:
        raise ValueError("Article content was empty after conversion")

    # Summary: first 300 chars of plain text
    plain = re.sub(r"\s+", " ", BeautifulSoup(content_html, "html.parser").get_text(separator=" ", strip=True))
    summary = (plain[:297] + "...") if len(plain) > 300 else plain
    if not summary:
        summary = title[:200]

    return (title, summary, content_md)


@router.post("/import", response_model=BlogPost)
def import_post(payload: BlogImportRequest, request: Request) -> BlogPost:
    """Import a single post from a Medium or Substack article URL."""
    url_str = str(payload.url)
    try:
        title, summary, content_md = _fetch_and_parse_article(url_str)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=422, detail=f"Could not fetch URL: {e!s}")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return create_post(BlogPostCreate(title=title, summary=summary, content=content_md), request=request)


@router.get("/{slug}")
def get_post(slug: str, request: Request) -> BlogPost:
    user_hint = _user_cache_hint(request) if request else None
    key = cache_svc.cache_key("blog:post", slug, user_hint=user_hint)
    ttl = 300 if user_hint else 60
    cached = cache_svc.get_cached(key)
    if cached is not None:
        return BlogPost(**cached)

    engine = _get_engine()
    table = _get_table()
    with engine.connect() as conn:
        row = conn.execute(table.select().where(table.c.slug == slug)).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Post not found")
        post = BlogPost(**{**row, "created_at": row["created_at"].isoformat() if row["created_at"] else ""})
    cache_svc.set_cached(key, post.model_dump(), ttl)
    return post


@router.post("/", response_model=BlogPost)
def create_post(payload: BlogPostCreate, request: Request) -> BlogPost:
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
    cache_svc.invalidate_pattern("blog:")
    return get_post(slug, request)
def update_post(slug: str, payload: BlogPostUpdate, request: Request | None = None) -> BlogPost:
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
    cache_svc.invalidate_pattern("blog:")
    return get_post(slug, request)


@router.delete("/{slug}", response_model=dict)
def delete_post(slug: str) -> dict:
    engine = _get_engine()
    table = _get_table()
    with engine.begin() as conn:
        exists = conn.execute(select(table.c.slug).where(table.c.slug == slug)).first()
        if not exists:
            raise HTTPException(status_code=404, detail="Post not found")
        conn.execute(table.delete().where(table.c.slug == slug))
    cache_svc.invalidate_pattern("blog:")
    return {"ok": True}





