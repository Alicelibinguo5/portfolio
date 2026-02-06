# Overview

**[Libin Guo's Portfolio](https://libinguo.vercel.app/)**

Personal portfolio with Home, Projects (GitHub), Blog (Postgres), About, and Contact.

## Preview

[![Website preview](https://image.thum.io/get/width/1200/https://libinguo.vercel.app/)](https://libinguo.vercel.app/)

## Tech stack

| Layer    | Stack                          |
|----------|--------------------------------|
| Frontend | Next.js, React, TypeScript, Tailwind |
| Backend  | FastAPI, Python 3.13, UV, SQLAlchemy |
| Data     | PostgreSQL (blog), S3 (images) |
| Cache    | Redis (optional; speeds up GETs for signed-in users) |
| Deploy   | Vercel (frontend), Railway (backend) |

## Local setup

```bash
make install      # backend + frontend deps
make postgres     # start Postgres (Docker)
make dev          # run full stack at http://localhost:8000
```

## Optional: Redis cache

Set `REDIS_URL` (e.g. `redis://localhost:6379` or Redis Cloud URL) to enable caching for GET `/api/blog/`, GET `/api/blog/{slug}`, and GET `/api/github/repos`. Requests with `Cookie` or `Authorization` get a longer TTL (signed-in user experience). Without Redis, the API works as before.

## Deploy

- **Vercel** — frontend
- **Railway** — backend

## Commands

```bash
make help         # list targets
make test         # backend + frontend checks
make build        # frontend production build
```
