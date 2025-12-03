# Decksnap

One-click slide generation from text.

## Quick Start

```bash
# Install dependencies
make install

# Start infrastructure (PostgreSQL + Redis)
docker run -d --name decksnap-postgres -e POSTGRES_USER=decksnap -e POSTGRES_PASSWORD=decksnap -e POSTGRES_DB=decksnap -p 5432:5432 postgres:15
docker run -d --name decksnap-redis -p 6379:6379 redis:7-alpine

# Create .env and add your OpenRouter API key
cp .env.example .env

# Run migrations
make migrate

# Start development
make dev
```

- Frontend: http://localhost:13000
- API Docs: http://localhost:18000/docs
