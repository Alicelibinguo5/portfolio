import os
import sys
from pathlib import Path
from typing import Iterator

import pytest
from fastapi.testclient import TestClient


# Ensure we can import from backend/app
THIS_DIR = Path(__file__).resolve().parent
BACKEND_DIR = THIS_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import create_app  # noqa: E402
from app.routers import blog as blog_router  # noqa: E402


@pytest.fixture()
def client(tmp_path: Path) -> Iterator[TestClient]:
    db_path = tmp_path / "test.db"
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"
    os.environ["SEED_BLOG"] = "false"
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
    last_mod = first.headers.get("Last-Modified")
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


