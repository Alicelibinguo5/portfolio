import os
import sys
from collections.abc import Iterator
from pathlib import Path
from urllib.parse import urlparse

import httpx

import pytest
import respx
from fastapi.testclient import TestClient

# Ensure we can import from backend/app
THIS_DIR = Path(__file__).resolve().parent
BACKEND_DIR = THIS_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.config import get_settings  # noqa: E402
from app.main import create_app  # noqa: E402
from app.routers import blog as blog_router  # noqa: E402


@pytest.fixture()
def client(tmp_path: Path) -> Iterator[TestClient]:
    db_path = tmp_path / "test.db"
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"
    os.environ["SEED_BLOG"] = "false"
    get_settings.cache_clear()
    # Reset module-level engine/table between tests
    blog_router.Db.engine = None
    blog_router.Db.table = None

    app = create_app()
    with TestClient(app) as client:
        yield client


def test_empty_list_and_headers(client: TestClient) -> None:
    res = client.get("/api/blog/?page=1&page_size=20")
    assert res.status_code == 200
    assert res.json() == []
    # Pagination headers
    assert res.headers.get("X-Total-Count") == "0"
    assert res.headers.get("Content-Range") is not None


def test_create_get_and_lightweight_list(client: TestClient) -> None:
    # Create a post
    payload = {"title": "Hello World", "summary": "intro", "content": "Body"}
    created = client.post("/api/blog/", json=payload)
    assert created.status_code == 200
    created_json = created.json()
    assert created_json["slug"] == "hello-world"
    assert created_json["content"] == "Body"

    # List should not include content
    listed = client.get("/api/blog/?page=1&page_size=20")
    assert listed.status_code == 200
    items = listed.json()
    assert isinstance(items, list) and len(items) == 1
    item = items[0]
    assert set(item.keys()) == {"slug", "title", "summary", "created_at"}
    assert item["slug"] == "hello-world"

    # Get detail should include content
    detail = client.get("/api/blog/hello-world")
    assert detail.status_code == 200
    assert detail.json()["content"] == "Body"


def test_pagination(client: TestClient) -> None:
    for i in range(1, 4):
        payload = {"title": f"Post {i}", "summary": f"s{i}", "content": f"c{i}"}
        assert client.post("/api/blog/", json=payload).status_code == 200

    page1 = client.get("/api/blog/?page=1&page_size=2")
    assert page1.status_code == 200
    assert len(page1.json()) == 2

    page2 = client.get("/api/blog/?page=2&page_size=2")
    assert page2.status_code == 200
    assert len(page2.json()) == 1


def test_etag_last_modified_and_304(client: TestClient) -> None:
    # Seed one post
    payload = {"title": "Cache Test", "summary": "sum", "content": "content"}
    assert client.post("/api/blog/", json=payload).status_code == 200

    first = client.get("/api/blog/?page=1&page_size=20")
    assert first.status_code == 200
    etag = first.headers.get("ETag")
    assert etag is not None

    second = client.get(
        "/api/blog/?page=1&page_size=20",
        headers={"If-None-Match": etag},
    )
    assert second.status_code == 304

    # After adding a new post, ETag should change and return 200
    payload2 = {"title": "Cache Miss", "summary": "sum2", "content": "content2"}
    assert client.post("/api/blog/", json=payload2).status_code == 200

    third = client.get("/api/blog/?page=1&page_size=20", headers={"If-None-Match": etag})
    assert third.status_code == 200
    assert third.headers.get("ETag") is not None
    assert third.headers.get("ETag") != etag


def test_backup_and_delete(client: TestClient) -> None:
    payload = {"title": "Backup Me", "summary": "sum", "content": "full"}
    assert client.post("/api/blog/", json=payload).status_code == 200

    backup = client.get("/api/blog/backup")
    assert backup.status_code == 200
    data = backup.json()
    assert isinstance(data, list)
    assert any(p.get("content") == "full" for p in data)

    # Delete
    assert client.delete("/api/blog/backup-me").status_code == 200
    missing = client.get("/api/blog/backup-me")
    assert missing.status_code == 404


# Medium article HTML sample (simplified realistic structure)
MEDIUM_HTML = """<!DOCTYPE html>
<html>
<head>
    <meta property="og:title" content="How to Build Scalable Microservices" />
    <title>How to Build Scalable Microservices - Medium</title>
</head>
<body>
    <article>
        <h1>How to Build Scalable Microservices</h1>
        <p>This is a comprehensive guide on building microservices that scale.</p>
        <h2>Introduction</h2>
        <p>Microservices architecture has become increasingly popular...</p>
        <h2>Key Principles</h2>
        <ul>
            <li>Service isolation</li>
            <li>API-first design</li>
            <li>DevOps automation</li>
        </ul>
        <p>Follow these principles to build robust systems.</p>
    </article>
    <script>console.log("ads");</script>
    <footer>Copyright 2024</footer>
</body>
</html>
"""

# Medium HTML with alternative structure (data-field body)
MEDIUM_HTML_ALT = """<!DOCTYPE html>
<html>
<head>
    <title>Advanced TypeScript Patterns</title>
</head>
<body>
    <section data-field="body">
        <h1>Advanced TypeScript Patterns</h1>
        <p>Explore advanced TypeScript patterns for better type safety.</p>
        <h2>Generic Types</h2>
        <p>Learn how to use generic types effectively.</p>
    </section>
    <nav>Navigation menu</nav>
</body>
</html>
"""

# Medium HTML with role=article
MEDIUM_HTML_ROLE = """<!DOCTYPE html>
<html>
<head>
    <meta property="og:title" content="Building Reactive Systems" />
</head>
<body>
    <div role="article">
        <h1>Building Reactive Systems</h1>
        <p>Reactive programming is a paradigm...</p>
        <h2>Core Concepts</h2>
        <p>Streams, observers, and schedulers.</p>
    </div>
</body>
</html>
"""

# Substack article HTML sample
SUBSTACK_HTML = """<!DOCTYPE html>
<html>
<head>
    <meta property="og:title" content="The Future of AI in 2024" />
    <title>The Future of AI in 2024 - My Newsletter</title>
</head>
<body>
    <div class="available-content">
        <h1>The Future of AI in 2024</h1>
        <p>Artificial intelligence is evolving rapidly...</p>
        <h2>Large Language Models</h2>
        <p>LLMs have transformed the landscape.</p>
        <h2>What's Next</h2>
        <p>Multi-modal systems and agent-based AI.</p>
    </div>
    <div class="comments">Comments section</div>
</body>
</html>
"""

# Substack HTML with alternative structure
SUBSTACK_HTML_ALT = """<!DOCTYPE html>
<html>
<head>
    <title>Understanding Distributed Systems</title>
</head>
<body>
    <div class="post-content">
        <h1>Understanding Distributed Systems</h1>
        <p>Distributed systems are fundamental to modern computing.</p>
        <h2>CAP Theorem</h2>
        <p>Consistency, Availability, Partition tolerance.</p>
    </div>
</body>
</html>
"""

# HTML without platform-specific content (fallback to main)
GENERIC_HTML = """<!DOCTYPE html>
<html>
<head>
    <title>Generic Article Title</title>
</head>
<body>
    <main>
        <h1>Generic Article Title</h1>
        <p>This is a generic article with no platform-specific structure.</p>
        <h2>Section One</h2>
        <p>Content for section one.</p>
    </main>
</body>
</html>
"""

# HTML with missing title (should fail)
HTML_NO_TITLE = """<!DOCTYPE html>
<html>
<body>
    <article>
        <p>Content without a title</p>
    </article>
</body>
</html>
"""

# HTML with empty content (should fail)
HTML_EMPTY_CONTENT = """<!DOCTYPE html>
<html>
<head>
    <meta property="og:title" content="Empty Article" />
    <title>Empty Article</title>
</head>
<body>
    <article>
        <!-- No actual content besides comments -->
    </article>
</body>
</html>
"""


@pytest.mark.parametrize("url,html,expected_title,expected_content_prefix", [
    (
        "https://medium.com/@user/how-to-build-scalable-microservices-abc123",
        MEDIUM_HTML,
        "How to Build Scalable Microservices",
        "# How to Build Scalable Microservices",
    ),
    (
        "https://medium.com/p/advanced-typescript-patterns-def456",
        MEDIUM_HTML_ALT,
        "Advanced TypeScript Patterns",
        "# Advanced TypeScript Patterns",
    ),
    (
        "https://medium.com/@user/building-reactive-systems-ghi789",
        MEDIUM_HTML_ROLE,
        "Building Reactive Systems",
        "# Building Reactive Systems",
    ),
])
def test_import_from_medium_variations(
    client: TestClient,
    url: str,
    html: str,
    expected_title: str,
    expected_content_prefix: str,
) -> None:
    """Test importing from Medium with various HTML structures."""
    import httpx
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=html))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == expected_title
        assert data["content"].startswith(expected_content_prefix)
        assert data["slug"] == "how-to-build-scalable-microservices" or data["slug"] == "advanced-typescript-patterns" or data["slug"] == "building-reactive-systems"


@pytest.mark.parametrize("url,html,expected_title", [
    (
        "https://substack.com/@newsletter/p/the-future-of-ai-in-2024",
        SUBSTACK_HTML,
        "The Future of AI in 2024",
    ),
    (
        "https://example.substack.com/p/understanding-distributed-systems",
        SUBSTACK_HTML_ALT,
        "Understanding Distributed Systems",
    ),
])
def test_import_from_substack_variations(
    client: TestClient,
    url: str,
    html: str,
    expected_title: str,
) -> None:
    """Test importing from Substack with various HTML structures."""
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=html))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == expected_title
        assert data["content"].startswith(f"# {expected_title}")


def test_import_generic_article(client: TestClient) -> None:
    """Test importing a generic article without platform-specific structure."""
    url = "https://example.com/blog/generic-article"
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=GENERIC_HTML))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Generic Article Title"
        assert data["slug"] == "generic-article-title"


def test_import_error_http_failure(client: TestClient) -> None:
    """Test import fails when URL returns HTTP error."""
    url = "https://medium.com/@user/non-existent-article"
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(404))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 422
        assert "Could not fetch URL" in response.json()["detail"]


def test_import_error_missing_title(client: TestClient) -> None:
    """Test import fails when article has no title."""
    url = "https://example.com/no-title"
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=HTML_NO_TITLE))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 422
        assert "Could not extract title" in response.json()["detail"]


def test_import_error_empty_content(client: TestClient) -> None:
    """Test import fails when article content is empty after conversion."""
    url = "https://example.com/empty-content"
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=HTML_EMPTY_CONTENT))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 422
        assert "empty" in response.json()["detail"].lower()


def test_import_duplicate_slug(client: TestClient) -> None:
    """Test importing an article with a title that results in duplicate slug."""
    # First create a post directly
    payload = {"title": "Test Duplicate", "summary": "original", "content": "original content"}
    assert client.post("/api/blog/", json=payload).status_code == 200

    # Try to import an article with the same title
    url = "https://medium.com/@user/test-duplicate"
    html = """<!DOCTYPE html>
<html>
<head><title>Test Duplicate</title></head>
<body><article><h1>Test Duplicate</h1><p>New content from import.</p></article>
</body>
</html>
"""
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=html))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 400
        assert "Slug already exists" in response.json()["detail"]


def test_import_summary_generation(client: TestClient) -> None:
    """Test that summary is generated from first 300 characters of content."""
    url = "https://medium.com/@user/long-article"
    long_html = """<!DOCTYPE html>
<html>
<head><meta property="og:title" content="Long Article" /></head>
<body>
    <article>
        <h1>Long Article</h1>
        <p>This is a very long first paragraph that should be included in the summary. """ + "x" * 200 + """</p>
        <p>This is the second paragraph that should be truncated from the summary.</p>
    </article>
</body>
</html>
"""
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=long_html))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 200
        data = response.json()
        # Summary should be truncated with ellipsis
        assert len(data["summary"]) <= 303  # 300 + "..."
        assert data["summary"].endswith("...")


def test_import_removes_unwanted_elements(client: TestClient) -> None:
    """Test that script, style, nav, header, footer, comments are removed."""
    url = "https://medium.com/@user/clean-article"
    html_with_clutter = """<!DOCTYPE html>
<html>
<head><title>Clean Article</title></head>
<body>
    <header>Site Header</header>
    <nav>Navigation</nav>
    <article>
        <h1>Clean Article</h1>
        <script>alert('malicious');</script>
        <style>.hidden { display: none; }</style>
        <p>This is the actual content.</p>
        <div class="comments">User comments</div>
    </article>
    <footer>Site Footer</footer>
</body>
</html>
"""
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=html_with_clutter))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 200
        data = response.json()
        # Should not contain script content
        assert "alert" not in data["content"]
        assert "malicious" not in data["content"]
        # Should contain actual article content
        assert "actual content" in data["content"]


def test_import_follows_redirects(client: TestClient) -> None:
    """Test that import follows HTTP redirects."""
    final_url = "https://medium.com/@user/final-article"
    redirect_url = "https://medium.com/p/redirect-abc"

    final_html = """<!DOCTYPE html>
<html>
<head><meta property="og:title" content="Redirected Article" /></head>
<body>
    <article><h1>Redirected Article</h1><p>Content after redirect.</p></article>
</body>
</html>
"""

    with respx.mock:
        # Set up redirect chain
        respx.get(redirect_url).mock(
            return_value=httpx.Response(301, headers={"Location": final_url})
        )
        respx.get(final_url).mock(return_value=httpx.Response(200, text=final_html))
        response = client.post("/api/blog/import", json={"url": redirect_url})
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Redirected Article"


def test_import_creates_readable_slug(client: TestClient) -> None:
    """Test that slug is properly slugified from title."""
    url = "https://medium.com/@user/complex-title"
    html = """<!DOCTYPE html>
<html>
<head><meta property="og:title" content="Hello World: This IS A Complex Title! 123" /></head>
<body>
    <article><h1>Hello World: This IS A Complex Title! 123</h1><p>Content.</p></article>
</body>
</html>
"""
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=html))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 200
        data = response.json()
        # Slug should be lowercase with hyphens, no consecutive hyphens
        assert data["slug"] == "hello-world-this-is-a-complex-title-123"


def test_import_preserves_markdown_headings(client: TestClient) -> None:
    """Test that HTML headings are converted to Markdown ATX style."""
    url = "https://medium.com/@user/headings-article"
    html = """<!DOCTYPE html>
<html>
<head><title>Headings Article</title></head>
<body>
    <article>
        <h1>Main Title</h1>
        <p>Intro paragraph.</p>
        <h2>Section One</h2>
        <p>Section one content.</p>
        <h3>Subsection</h3>
        <p>Subsection content.</p>
    </article>
</body>
</html>
"""
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=html))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 200
        data = response.json()
        assert "# Main Title" in data["content"]
        assert "## Section One" in data["content"]
        assert "### Subsection" in data["content"]


def test_import_duplicate_slug_after_import(client: TestClient) -> None:
    """Test that imported post is stored and retrievable."""
    url = "https://medium.com/@user/first-import"
    html = """<!DOCTYPE html>
<html>
<head><meta property="og:title" content="First Import" /></head>
<body>
    <article><h1>First Import</h1><p>Imported content.</p></article>
</body>
</html>
"""
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=html))
        import_response = client.post("/api/blog/import", json={"url": url})
        assert import_response.status_code == 200
        import_data = import_response.json()
        slug = import_data["slug"]

        # Verify we can retrieve the imported post
        get_response = client.get(f"/api/blog/{slug}")
        assert get_response.status_code == 200
        get_data = get_response.json()
        assert get_data["title"] == "First Import"
        assert "Imported content" in get_data["content"]


def test_import_handles_special_characters(client: TestClient) -> None:
    """Test that special characters in title are handled correctly."""
    url = "https://medium.com/@user/special-chars"
    html = """<!DOCTYPE html>
<html>
<head><meta property="og:title" content="Café &amp; Restaurant: A Guide" /></head>
<body>
    <article>
        <h1>Café & Restaurant: A Guide</h1>
        <p>Content with special characters: é, &, ©, etc.</p>
    </article>
</body>
</html>
"""
    with respx.mock:
        respx.get(url).mock(return_value=httpx.Response(200, text=html))
        response = client.post("/api/blog/import", json={"url": url})
        assert response.status_code == 200
        data = response.json()
        # Title should be properly decoded
        assert "Café" in data["title"]
        assert "Restaurant" in data["title"]


# Substack RSS feed sample (modern Substack uses JS rendering, RSS has actual content)
SUBSTACK_RSS_XML = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Practical AI for Data</title>
    <link>https://aliceguo.substack.com</link>
    <item>
      <title>Test Post from RSS</title>
      <link>https://aliceguo.substack.com/p/test-post-from-rss</link>
      <description><![CDATA[<p>This is actual content from the RSS feed.</p>]]></description>
      <content:encoded><![CDATA[<p>This is actual content from the RSS feed.</p><h2>Key Points</h2><p>RSS feeds contain the full article content.</p>]]></content:encoded>
    </item>
  </channel>
</rss>
"""


def test_import_from_substack_rss_preferred(client: TestClient) -> None:
    """Test that Substack import prefers RSS feed over HTML parsing."""
    article_url = "https://aliceguo.substack.com/p/test-post-from-rss"
    rss_url = "https://aliceguo.substack.com/feed"

    with respx.mock:
        # Mock the RSS feed with actual content
        rss_route = respx.get(rss_url).mock(return_value=httpx.Response(200, text=SUBSTACK_RSS_XML))

        # Also mock the article URL (won't be called if RSS works, but respx requires it)
        article_route = respx.get(article_url).mock(
            return_value=httpx.Response(200, text="<html><body>Profile content</body></html>")
        )

        response = client.post("/api/blog/import", json={"url": article_url})
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Post from RSS"
        # Should have content from RSS
        assert "actual content from the RSS feed" in data["content"]
        assert "Key Points" in data["content"]
        # Should NOT have the profile content
        assert "Profile content" not in data["content"]
        # RSS route should have been called
        assert rss_route.call_count >= 1


# ==================== DELETE POST TESTS ====================

def test_delete_post_success(client: TestClient) -> None:
    """Test successfully deleting an existing post."""
    # Create a post
    payload = {"title": "Delete Me", "summary": "Will be deleted", "content": "Content"}
    create_response = client.post("/api/blog/", json=payload)
    assert create_response.status_code == 200
    slug = create_response.json()["slug"]

    # Verify post exists
    get_response = client.get(f"/api/blog/{slug}")
    assert get_response.status_code == 200

    # Delete the post
    delete_response = client.delete(f"/api/blog/{slug}")
    assert delete_response.status_code == 200
    assert delete_response.json() == {"ok": True}

    # Verify post is gone
    missing = client.get(f"/api/blog/{slug}")
    assert missing.status_code == 404
    assert "Post not found" in missing.json()["detail"]


def test_delete_nonexistent_post(client: TestClient) -> None:
    """Test deleting a post that doesn't exist returns 404."""
    response = client.delete("/api/blog/nonexistent-post")
    assert response.status_code == 404
    assert "Post not found" in response.json()["detail"]


def test_delete_post_removes_from_list(client: TestClient) -> None:
    """Test that deleting a post removes it from the list endpoint."""
    # Create two posts
    client.post("/api/blog/", json={"title": "Post A", "summary": "A", "content": "A content"})
    client.post("/api/blog/", json={"title": "Post B", "summary": "B", "content": "B content"})

    # Get initial count
    list_response = client.get("/api/blog/?page_size=50")
    initial_count = int(list_response.headers.get("X-Total-Count", "0"))
    assert initial_count >= 2

    # Delete one post
    delete_response = client.delete("/api/blog/post-b")
    assert delete_response.status_code == 200

    # Verify count decreased
    list_response_after = client.get("/api/blog/?page_size=50")
    final_count = int(list_response_after.headers.get("X-Total-Count", "0"))
    assert final_count == initial_count - 1

    # Verify deleted post is not in the list
    posts = list_response_after.json()
    assert not any(p.get("slug") == "post-b" for p in posts)


def test_delete_post_with_special_characters_slug(client: TestClient) -> None:
    """Test deleting a post with special characters in the title."""
    payload = {"title": "Test: Special! @#$ Characters", "summary": "test", "content": "content"}
    create_response = client.post("/api/blog/", json=payload)
    assert create_response.status_code == 200
    slug = create_response.json()["slug"]

    # Verify we can delete it
    delete_response = client.delete(f"/api/blog/{slug}")
    assert delete_response.status_code == 200

    # Verify it's gone
    missing = client.get(f"/api/blog/{slug}")
    assert missing.status_code == 404


def test_delete_post_twice_returns_404(client: TestClient) -> None:
    """Test that deleting the same post twice returns 404 the second time."""
    # Create a post
    payload = {"title": "Delete Twice", "summary": "test", "content": "content"}
    create_response = client.post("/api/blog/", json=payload)
    slug = create_response.json()["slug"]

    # First delete should succeed
    delete1 = client.delete(f"/api/blog/{slug}")
    assert delete1.status_code == 200

    # Second delete should return 404
    delete2 = client.delete(f"/api/blog/{slug}")
    assert delete2.status_code == 404


def test_delete_post_idempotency(client: TestClient) -> None:
    """Test that delete is idempotent - deleting non-existent post always returns 404."""
    # Try deleting a post that never existed
    response1 = client.delete("/api/blog/never-existed")
    assert response1.status_code == 404

    # Try again - should still return 404 consistently
    response2 = client.delete("/api/blog/never-existed")
    assert response2.status_code == 404
    assert response1.json() == response2.json()


def test_delete_then_recreate_same_slug(client: TestClient) -> None:
    """Test that we can delete and then recreate a post with the same slug."""
    # Create a post
    payload = {"title": "Recreate Test", "summary": "test", "content": "content"}
    create_response = client.post("/api/blog/", json=payload)
    slug = create_response.json()["slug"]
    assert slug == "recreate-test"

    # Delete it
    delete_response = client.delete(f"/api/blog/{slug}")
    assert delete_response.status_code == 200

    # Verify it's gone
    assert client.get(f"/api/blog/{slug}").status_code == 404

    # Recreate with same title - should get the same slug
    recreate_response = client.post("/api/blog/", json=payload)
    assert recreate_response.status_code == 200
    new_slug = recreate_response.json()["slug"]
    assert new_slug == slug

    # Verify the new post exists
    get_response = client.get(f"/api/blog/{new_slug}")
    assert get_response.status_code == 200
    assert get_response.json()["title"] == "Recreate Test"


def test_delete_all_posts_empty_list(client: TestClient) -> None:
    """Test deleting all posts results in empty list."""
    # Create multiple posts
    for i in range(3):
        client.post("/api/blog/", json={"title": f"Post {i}", "summary": f"sum{i}", "content": f"content{i}"})

    # Delete all posts
    list_response = client.get("/api/blog/?page_size=50")
    posts = list_response.json()
    for post in posts:
        slug = post["slug"]
        delete_response = client.delete(f"/api/blog/{slug}")
        assert delete_response.status_code == 200

    # Verify list is empty
    final_list = client.get("/api/blog/?page_size=50")
    assert final_list.json() == []
    assert final_list.headers.get("X-Total-Count") == "0"


