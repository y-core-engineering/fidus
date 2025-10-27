# Fidus API

FastAPI backend for the Fidus AI Assistant.

## Architecture

This package implements the backend services using:

- **FastAPI** - REST API framework
- **LangGraph** - State machine framework for agent orchestration
- **LangChain** - LLM integration abstraction
- **SQLAlchemy** - ORM for PostgreSQL
- **Redis** - Event bus and caching
- **Neo4j** - Graph database for relationships

## Project Structure

```
fidus/
├── api/              # API layer (REST endpoints)
│   ├── routes/       # Route handlers
│   ├── middleware/   # Custom middleware
│   └── dependencies/ # Dependency injection
├── domain/           # Domain layer (DDD)
│   ├── calendar/     # Calendar bounded context
│   ├── finance/      # Finance bounded context
│   ├── orchestration/# Orchestration bounded context
│   └── ...           # Other domains
└── infrastructure/   # Infrastructure layer
    ├── database/     # Database connections
    ├── redis/        # Redis client
    ├── neo4j/        # Neo4j client
    └── llm/          # LLM providers
```

## Development

### Setup

```bash
# Install dependencies
poetry install

# Run migrations
alembic upgrade head

# Start development server
poetry run uvicorn fidus.main:app --reload
```

### Testing

```bash
# Run tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=fidus --cov-report=html
```

### Code Quality

```bash
# Format code
poetry run black .

# Lint code
poetry run ruff check .

# Type check
poetry run mypy .
```

## Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/fidus
REDIS_URL=redis://localhost:6379/0
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# LLM Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
DEBUG=true
LOG_LEVEL=INFO
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
