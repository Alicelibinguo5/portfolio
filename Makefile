# Portfolio website – common tasks from repo root
# Prereqs: Python 3.13+, Node.js 18+, Docker (for Postgres)

.PHONY: install install-backend install-frontend postgres backend frontend build build-dev test test-backend test-frontend preview dev clean help

# Override if needed (e.g. make postgres PG_PORT=5435)
PG_NAME   := portfolio-pg
PG_PORT   := 5434
API_PORT  := 8000
API_URL   := http://localhost:$(API_PORT)
VITE_PORT := 5173

DATABASE_URL := postgresql://postgres:postgres@localhost:$(PG_PORT)/portfolio

help:
	@echo "Portfolio website – common targets:"
	@echo "  install          Install backend (uv) + frontend (npm) deps"
	@echo "  install-backend  Backend only (uv sync)"
	@echo "  install-frontend Frontend only (npm install)"
	@echo "  postgres        Start Postgres in Docker (port $(PG_PORT))"
	@echo "  backend         Run backend API at $(API_URL) (requires postgres + install-backend)"
	@echo "  frontend        Run frontend dev server (requires install-frontend)"
	@echo "  build           Build frontend for production (GitHub Pages: base /portfolio/)"
	@echo "  build-dev       Build frontend with base / for local backend (used by dev)"
	@echo "  test            Run backend + frontend checks"
	@echo "  test-backend    Backend tests (pytest)"
	@echo "  test-frontend   Frontend typecheck + build"
	@echo "  preview         Serve built frontend on port $(VITE_PORT)"
	@echo "  dev             Build frontend, then run backend serving it at $(API_URL)"
	@echo "  clean           Remove frontend dist and Python caches"

install: install-backend install-frontend

install-backend:
	cd backend && uv sync

install-frontend:
	cd frontend && npm install

postgres:
	@docker start $(PG_NAME) 2>/dev/null || \
	docker run --name $(PG_NAME) \
	  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portfolio \
	  -p $(PG_PORT):5432 -d postgres:16
	@echo "Postgres at localhost:$(PG_PORT). DATABASE_URL=$(DATABASE_URL)"

backend:
	cd backend && \
	  export DATABASE_URL="$(DATABASE_URL)" SEED_BLOG=true && \
	  uv run uvicorn app.main:app --reload --port $(API_PORT)

frontend:
	cd frontend && VITE_API_URL=$(API_URL) npm run dev

build:
	cd frontend && npm run build

build-dev:
	cd frontend && VITE_BASE=/ npm run build

test: test-backend test-frontend

test-backend:
	cd backend && uv run pytest

test-frontend:
	cd frontend && npm run build

preview:
	cd frontend && npm run preview -- --port $(VITE_PORT)

dev: build-dev
	cd backend && \
	  export DATABASE_URL="$(DATABASE_URL)" SEED_BLOG=true && \
	  uv run uvicorn app.main:app --reload --port $(API_PORT)
	@echo "Visit $(API_URL)/#/ to use the app"

clean:
	rm -rf frontend/dist
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
