# Overview

**[Libin Guo's Portfolio](https://libinguo.vercel.app/)**

Personal portfolio with Home, Projects (GitHub), Blog (Postgres), About, and Contact.

## Tech stack

| Layer    | Stack                          |
|----------|--------------------------------|
| Frontend | Next.js, React, TypeScript, Tailwind |
| Backend  | FastAPI, Python 3.13, UV, SQLAlchemy |
| Data     | PostgreSQL (blog), S3 (images) |
| Deploy   | Vercel (frontend), Railway (backend) |

## Local setup

```bash
make install      # backend + frontend deps
make postgres     # start Postgres (Docker)
make dev          # run full stack at http://localhost:8000
```

## Deploy

- **Vercel** — frontend
- **Railway** — backend

## Commands

```bash
make help         # list targets
make test         # backend + frontend checks
make build        # frontend production build
```
