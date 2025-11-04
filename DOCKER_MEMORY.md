# Fidus Memory - Docker Setup (Isolated Test Environment)

This guide explains how to run the Fidus Memory prototype in a **fully isolated Docker environment** without any local filesystem dependencies.

> **Note:** This setup is optimized for testing and production use. All code is baked into the Docker images - no volume mounts to your local filesystem.

## Quick Start

1. **Copy the environment file:**
```bash
cp .env.memory.example .env.memory
```

2. **Build and start the services:**
```bash
docker-compose -f docker-compose.memory.yml --env-file .env.memory up -d --build
```

3. **Pull the Ollama model (first time only):**
```bash
docker exec -it fidus-memory-ollama ollama pull llama3.2:3b
```

4. **Access the application:**
   - **Web Frontend:** [http://localhost:3001](http://localhost:3001) or [http://localhost:3001/fidus-memory](http://localhost:3001/fidus-memory)
   - **API:** [http://localhost:8000](http://localhost:8000)

5. **Check the logs:**
```bash
# Backend logs
docker-compose -f docker-compose.memory.yml logs -f memory-api

# Frontend logs
docker-compose -f docker-compose.memory.yml logs -f memory-web
```

## Important: Isolated Environment

This Docker setup is **completely isolated** from your local filesystem:

- ✅ **No volume mounts** - All code is baked into the images
- ✅ **Production builds** - Frontend uses Next.js production build
- ✅ **Port 3001** - UI runs on port 3001 (safe port, not browser-blocked)
- ✅ **Self-contained** - Perfect for testing and deployment

**To update code:** Rebuild the images with `--build` flag:
```bash
docker-compose -f docker-compose.memory.yml up -d --build
```

## Using Different LLM Providers

### Option 1: Local Ollama (Default)

This is the default configuration and requires no API keys.

**Models:**
- `ollama/llama3.2:3b` - Good balance (default)
- `ollama/llama3.2:1b` - Fastest, uses less RAM
- `ollama/qwen2.5:3b` - Alternative model

**After starting, pull the model:**
```bash
docker exec -it fidus-memory-ollama ollama pull llama3.2:3b
```

### Option 2: OpenAI

1. Get an API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

2. Edit `.env.memory`:
```bash
FIDUS_LLM_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-your-key-here
```

3. Restart the service:
```bash
docker-compose -f docker-compose.memory.yml restart memory-api
```

### Option 3: Anthropic Claude

1. Get an API key from [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

2. Edit `.env.memory`:
```bash
FIDUS_LLM_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

3. Restart the service:
```bash
docker-compose -f docker-compose.memory.yml restart memory-api
```

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Chat (Streaming)
```bash
curl -X POST http://localhost:8000/memory/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "message": "I love cappuccino"
  }'
```

### Get Preferences
```bash
curl http://localhost:8000/memory/preferences
```

### Get AI Configuration
```bash
curl http://localhost:8000/memory/config
```

## Stopping the Services

```bash
docker-compose -f docker-compose.memory.yml down
```

To also remove volumes (this will delete the downloaded Ollama models):
```bash
docker-compose -f docker-compose.memory.yml down -v
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose -f docker-compose.memory.yml logs memory-api
```

### Ollama model not found

Pull the model manually:
```bash
docker exec -it fidus-memory-ollama ollama pull llama3.2:3b
```

List available models:
```bash
docker exec -it fidus-memory-ollama ollama list
```

### Out of memory

If using Ollama locally, try a smaller model:
```bash
# In .env.memory
FIDUS_LLM_MODEL=ollama/llama3.2:1b
```

### API returns errors

Check if the LLM service is healthy:
```bash
docker-compose -f docker-compose.memory.yml ps
```

All services should show "healthy" status.

## Making Code Changes

Since this is an **isolated environment**, code changes require rebuilding the Docker images:

```bash
# After making changes to the code
docker-compose -f docker-compose.memory.yml up -d --build

# Or rebuild specific service
docker-compose -f docker-compose.memory.yml build memory-web
docker-compose -f docker-compose.memory.yml up -d memory-web
```

## Production Deployment

This setup is already configured for production-like deployment:

- ✅ **Production builds** - Next.js standalone build, optimized Python app
- ✅ **No dev dependencies** - Minimal image sizes
- ✅ **Health checks** - All services have health monitoring
- ✅ **Isolated** - No local file dependencies

For actual production:

1. **Use a cloud LLM provider** (OpenAI or Anthropic) instead of Ollama
2. **Set proper CORS origins** in `.env.memory`
3. **Use secure secrets** (not the default dev secrets)
4. **Enable HTTPS** with a reverse proxy (nginx, traefik)
5. **Set up monitoring** (Prometheus, Grafana)

## Architecture

```
┌─────────────────┐      ┌─────────────────┐
│  Fidus Memory   │      │  Fidus Memory   │
│   Web Frontend  │─────▶│      API        │
│  (Port 3001)    │      │   (Port 8000)   │
│  Next.js + React│      │ FastAPI+LiteLLM │
└─────────────────┘      └────────┬────────┘
                                  │
                         ├────────┴─────────┐
                         │                  │
                    ┌────▼─────┐      ┌────▼──────┐
                    │  Ollama  │      │  OpenAI   │
                    │ (local)  │      │  (cloud)  │
                    └──────────┘      └───────────┘
```

## Services Overview

- **memory-web** - Next.js production build (Port 3001 → 3000 internal)
- **memory-api** - FastAPI backend with in-memory agent (Port 8000)
- **ollama** - Local LLM server (Port 11434, optional)

## Port Mapping

| Service | Internal Port | External Port | URL |
|---------|--------------|---------------|-----|
| Frontend | 3000 | **3001** | http://localhost:3001 |
| Backend API | 8000 | 8000 | http://localhost:8000 |
| Ollama | 11434 | 11434 | http://localhost:11434 |

> **Note:** Port 3001 is used instead of other common ports to avoid browser security restrictions. Some browsers block certain ports (like 6000) for security reasons.

## Next Steps

- See [docs/fidus-memory/README.md](docs/fidus-memory/README.md) for feature documentation
- Explore the web interface at [http://localhost:3001](http://localhost:3001)
- Try different LLM providers (Ollama, OpenAI, Anthropic)
- Explore Phase 2 features (persistent storage, vector embeddings)
