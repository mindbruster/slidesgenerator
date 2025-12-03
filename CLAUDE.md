# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Decksnap is a one-click slide generator that transforms text into polished presentations using AI.

## Tech Stack

- **Frontend**: Next.js 15.1, React 19, TypeScript, Tailwind CSS 4
- **Backend**: FastAPI 0.115, SQLAlchemy 2.0 (async), PostgreSQL with asyncpg
- **AI**: OpenRouter API (Claude/GPT models via openai client)
- **PDF**: WeasyPrint for export

## Directory Structure

```
apps/
├── frontend/              # Next.js app (port 13000)
│   ├── components/        # Atomic design: atoms/ → molecules/ → organisms/
│   ├── contexts/          # React Context (SlidesContext)
│   └── lib/api/           # APIClient + repositories pattern
└── slides_api/            # FastAPI backend (port 18000)
    └── api/v1/            # Versioned routes (slides, presentations, export)

packages/common/           # Shared Python code (DRY principle)
├── core/                  # Config, database, logging
├── models/                # SQLAlchemy ORM models
├── schemas/               # Pydantic request/response validation
├── services/              # Business logic layer
└── providers/llm/         # OpenRouter integration

infra/alembic/             # Database migrations
```

## Commands

```bash
make install              # Install Poetry + npm dependencies
make dev                  # Start all services via Honcho
make frontend             # Frontend only (port 13000, Turbopack)
make backend              # API only (port 18000, auto-reload)
make migrate              # Run Alembic migrations
make migrate-create name=foo  # Create new migration
make lint                 # Ruff + ESLint
make format               # Ruff format + fix
make test                 # pytest
```

Single test: `poetry run pytest tests/path/test_file.py::test_name -v`

## Code Conventions

**Python**: 100 char lines, double quotes, type hints required (mypy strict), async throughout

**TypeScript**: Strict mode, `@/` path alias, single quotes

**Components**: Atomic Design hierarchy - atoms (Button, TextArea) → molecules (SlideCard) → organisms (SlideCarousel)

## Architecture Patterns

1. **Shared Code**: All reusable Python code lives in `packages/common/` - never duplicate between apps
2. **Service Layer**: Business logic in `packages/common/services/`, route handlers stay thin
3. **Repository Pattern**: Frontend uses `SlidesRepository` class for typed API calls
4. **Pydantic Schemas**: Every API endpoint has request/response schemas with validation
5. **Async SQLAlchemy**: Full async with `asyncpg`, proper session lifecycle via FastAPI `Depends()`

## Design System

- **Style**: Soft neobrutalism (Gumroad-inspired)
- **Colors**: Cream bg (#f4f4f0), pink accent (#ff90e8), black text (#0f0f0f)
- **Components**: 8-12px radius, 2px solid borders, offset shadows (2-4px black)

## Ports

- Frontend: 13000
- Slides API: 18000
- PostgreSQL: 5432
