.PHONY: help install setup dev frontend backend lint format test migrate migrate-create clean

# Colors for terminal output
BLUE := \033[34m
GREEN := \033[32m
RESET := \033[0m

help:
	@echo "$(BLUE)Decksnap - Available Commands$(RESET)"
	@echo "=============================="
	@echo ""
	@echo "$(GREEN)Setup:$(RESET)"
	@echo "  make install       - Install all dependencies"
	@echo "  make setup         - Initial setup (install + create .env)"
	@echo ""
	@echo "$(GREEN)Development:$(RESET)"
	@echo "  make dev           - Start all services (frontend + API)"
	@echo "  make frontend      - Start frontend only"
	@echo "  make backend       - Start API only"
	@echo ""
	@echo "$(GREEN)Database:$(RESET)"
	@echo "  make migrate       - Run database migrations"
	@echo "  make migrate-create- Create new migration (usage: make migrate-create name=migration_name)"
	@echo ""
	@echo "$(GREEN)Code Quality:$(RESET)"
	@echo "  make lint          - Run linters"
	@echo "  make format        - Format code"
	@echo "  make test          - Run tests"

install:
	@echo "$(BLUE)Installing Python dependencies...$(RESET)"
	poetry install
	@echo "$(BLUE)Installing frontend dependencies...$(RESET)"
	cd apps/frontend && npm install
	@echo "$(GREEN)Done!$(RESET)"

setup: install
	@echo "$(BLUE)Creating .env file...$(RESET)"
	@if [ ! -f .env ]; then cp .env.example .env; echo "$(GREEN).env created from .env.example$(RESET)"; else echo ".env already exists"; fi

dev:
	@echo "$(BLUE)Starting Decksnap...$(RESET)"
	poetry run honcho start -f Procfile.dev

frontend:
	cd apps/frontend && npm run dev -- --port 13000

backend:
	poetry run uvicorn apps.slides_api.main:app --host 0.0.0.0 --port 18000 --reload

lint:
	poetry run ruff check packages apps
	cd apps/frontend && npm run lint

format:
	poetry run ruff format packages apps
	poetry run ruff check --fix packages apps

test:
	poetry run pytest

migrate:
	poetry run alembic upgrade head

migrate-create:
	@if [ -z "$(name)" ]; then echo "Usage: make migrate-create name=migration_name"; exit 1; fi
	poetry run alembic revision --autogenerate -m "$(name)"

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".next" -exec rm -rf {} + 2>/dev/null || true
