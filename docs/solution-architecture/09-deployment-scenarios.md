# Deployment Scenarios

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft (Awaiting Human Review)
**Part of:** Fidus Solution Architecture
**Author:** AI-Generated

---

## Table of Contents

1. [Overview](#overview)
2. [Deployment Editions](#deployment-editions)
3. [Community Edition (Docker Compose)](#community-edition-docker-compose)
4. [Starter Edition (Single Server)](#starter-edition-single-server)
5. [Pro Edition (Multi-Server)](#pro-edition-multi-server)
6. [Enterprise Edition (Kubernetes)](#enterprise-edition-kubernetes)
7. [Development Environment](#development-environment)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Backup & Restore](#backup--restore)
10. [Disaster Recovery](#disaster-recovery)
11. [Migration Procedures](#migration-procedures)
12. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Overview

Fidus supports **four deployment editions**, each optimized for different scales and requirements. This document provides detailed deployment procedures for each edition.

### Deployment Matrix

```mermaid
graph TD
    Editions[Deployment Editions]

    Editions --> Community[Community Edition<br/>Docker Compose<br/>Free & Open Source]
    Editions --> Starter[Starter Edition<br/>Single Server<br/>€49/month]
    Editions --> Pro[Pro Edition<br/>Multi-Server<br/>€199/month]
    Editions --> Enterprise[Enterprise Edition<br/>Kubernetes<br/>Custom Pricing]

    Community --> Use1[Personal Use<br/>1-5 users<br/>Single server]
    Starter --> Use2[Small Teams<br/>5-50 users<br/>VPS]
    Pro --> Use3[Medium Business<br/>50-500 users<br/>Load balanced]
    Enterprise --> Use4[Large Enterprise<br/>500+ users<br/>Multi-region]

    style Community fill:#90be6d
    style Starter fill:#4ecdc4
    style Pro fill:#f9c74f
    style Enterprise fill:#ff6b6b
```

### Edition Comparison

| Feature | Community | Starter | Pro | Enterprise |
|---------|-----------|---------|-----|------------|
| **Max Users** | 5 | 50 | 500 | Unlimited |
| **Infrastructure** | Docker Compose | Single VPS | Multi-server | Kubernetes |
| **High Availability** | ❌ No | ❌ No | ✅ Active-Passive | ✅ Active-Active |
| **Auto-Scaling** | ❌ No | ❌ No | ⚠️ Manual | ✅ Yes |
| **Multi-Region** | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Support** | Community | Email (48h) | Email (24h) + Slack | Dedicated |
| **Uptime SLA** | None | None | 99.9% | 99.99% |
| **Backup Frequency** | Manual | Daily | Hourly | Continuous |
| **Price** | Free | €49/month | €199/month | Custom |

---

## Community Edition (Docker Compose)

Fidus Community Edition bietet **fünf Deployment-Varianten**:

1. **Standard (All-in-Docker):** Alle Services inklusive Ollama laufen in Docker
2. **Hybrid (Ollama Native):** Ollama läuft nativ auf Host für optimale LLM-Performance
3. **Hybrid (LM Studio):** LM Studio als GUI-basierte LLM-Alternative mit OpenAI-kompatibler API
4. **Development Setup:** Lokale Entwicklung mit Hot-Reload, nur Dependencies in Docker
5. **Development mit Cloud LLM:** Entwicklung mit ChatGPT/Claude via LiteLLM Gateway

### Variante 1: Standard Architecture (All-in-Docker)

```mermaid
flowchart TD
    subgraph "Single Server"
        Web[Web UI<br/>Next.js :3000]
        API[API Server<br/>FastAPI :8000]
        Postgres[(PostgreSQL<br/>:5432)]
        Redis[(Redis<br/>:6379)]
        Ollama[Ollama<br/>:11434<br/>Docker]
    end

    Internet[Internet] --> Nginx[Nginx<br/>:80/443]
    Nginx --> Web
    Nginx --> API

    API --> Postgres
    API --> Redis
    API --> Ollama

    style Internet fill:#4ecdc4
    style Nginx fill:#f9c74f
    style Postgres fill:#90be6d
    style Ollama fill:#ffd93d
```

**Vorteile:**
- Einfache Installation (ein Command)
- Alle Services isoliert
- Einfaches Backup/Restore

**Nachteile:**
- LLM-Performance ca. 10-20% langsamer
- GPU-Zugriff komplexer
- Höherer Memory Overhead

### Variante 2: Hybrid Architecture (Ollama Native)

```mermaid
flowchart TD
    subgraph "Docker Network"
        Web[Web UI<br/>Next.js :3000]
        API[API Server<br/>FastAPI :8000]
        Postgres[(PostgreSQL<br/>:5432)]
        Redis[(Redis<br/>:6379)]
    end

    subgraph "Host System"
        OllamaNative[Ollama<br/>:11434<br/>Native]
    end

    Internet[Internet] --> Nginx[Nginx<br/>:80/443]
    Nginx --> Web
    Nginx --> API

    API --> Postgres
    API --> Redis
    API -->|host.docker.internal| OllamaNative

    style Internet fill:#4ecdc4
    style Nginx fill:#f9c74f
    style Postgres fill:#90be6d
    style OllamaNative fill:#90be6d
```

**Vorteile:**
- ✅ **Optimale LLM-Performance** (10-20% schneller)
- ✅ **Direkter GPU-Zugriff** (kein Docker GPU Passthrough)
- ✅ **Geringerer Memory Overhead**
- ✅ **Einfachere GPU-Treiber-Installation**

**Nachteile:**
- Zusätzliche Host-Installation nötig
- Ollama läuft außerhalb Docker-Isolation

### Prerequisites

- **Hardware:**
  - CPU: 4 cores minimum (8 cores recommended for LLM)
  - RAM: 16GB minimum (32GB recommended)
  - Disk: 100GB SSD minimum
  - GPU: Optional (NVIDIA for faster LLM inference)

- **Software:**
  - Linux (Ubuntu 22.04 LTS recommended)
  - Docker 24.0+
  - Docker Compose 2.20+
  - Git

### Installation Steps (Variante 1: All-in-Docker)

#### 1. Clone Repository

```bash
# Clone Fidus repository
git clone https://github.com/y-core-engineering/fidus.git
cd fidus

# Checkout stable version
git checkout v1.0.0
```

#### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**

```bash
# Database
DATABASE_URL=postgresql://fidus:CHANGE_ME@postgres:5432/fidus
POSTGRES_PASSWORD=CHANGE_ME

# Redis
REDIS_URL=redis://redis:6379

# JWT (generate with: openssl rand -base64 32)
JWT_SECRET=CHANGE_ME_GENERATE_RANDOM_STRING

# Encryption (generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
ENCRYPTION_KEY=CHANGE_ME_GENERATE_RANDOM_KEY

# Auth Provider (choose one)
AUTH_PROVIDER=auth0  # or keycloak
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# LLM
LLM_PROVIDER=ollama  # or openai
OLLAMA_BASE_URL=http://ollama:11434
# Optional: OpenAI API key (if users opt-in)
OPENAI_API_KEY=sk-proj-xxx

# Domain
DOMAIN=localhost
# For production: DOMAIN=fidus.yourdomain.com
```

#### 3. Generate SSL Certificates (Production)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d fidus.yourdomain.com

# Certificates will be in:
# /etc/letsencrypt/live/fidus.yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/fidus.yourdomain.com/privkey.pem
```

#### 4. Deploy with Docker Compose

```bash
# Pull latest images
docker-compose pull

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Wait for services to be healthy
docker-compose ps
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  # Web UI
  web:
    image: fidus/web:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api

  # API Server
  api:
    image: fidus/api:latest
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - OLLAMA_BASE_URL=${OLLAMA_BASE_URL}
    depends_on:
      - postgres
      - redis
      - ollama
    volumes:
      - ./data/uploads:/app/uploads

  # PostgreSQL Database
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_DB=fidus
      - POSTGRES_USER=fidus
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fidus"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Ollama (Local LLM)
  ollama:
    image: ollama/ollama:latest
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    # Uncomment if GPU available
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - web
      - api

volumes:
  postgres_data:
  redis_data:
  ollama_data:
```

#### 5. Initialize Database

```bash
# Run database migrations
docker-compose exec api alembic upgrade head

# Create first admin user
docker-compose exec api python -m fidus.cli create-admin \
  --email admin@yourdomain.com \
  --name "Admin User" \
  --password "CHANGE_ME"
```

#### 6. Download LLM Models

```bash
# Download Llama 3.1 8B (recommended for Community Edition)
docker-compose exec ollama ollama pull llama3.1:8b

# Optional: Download larger model for better quality
# docker-compose exec ollama ollama pull llama3.1:70b
```

#### 7. Verify Deployment

```bash
# Check all services are running
docker-compose ps

# Test API health
curl http://localhost:8000/health

# Test Web UI
curl http://localhost:3000

# Access web interface
open http://localhost:3000
```

---

### Installation Steps (Variante 2: Hybrid - Ollama Native)

**Empfohlen für optimale Performance!**

#### 1. Ollama Native auf Host installieren

```bash
# Download und Installation (Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Verify Installation
ollama --version

# Ollama als System Service starten
sudo systemctl enable ollama
sudo systemctl start ollama
sudo systemctl status ollama

# Test Ollama
curl http://localhost:11434/api/tags
```

**Für GPU-Support (NVIDIA):**

```bash
# NVIDIA Driver installieren
sudo apt-get update
sudo apt-get install nvidia-driver-535

# CUDA Toolkit (optional, aber empfohlen)
sudo apt-get install nvidia-cuda-toolkit

# Verify GPU detection
nvidia-smi

# Ollama sollte GPU automatisch erkennen
```

#### 2. Modelle herunterladen (Native Ollama)

```bash
# Empfohlen für Community Edition: Llama 3.1 8B
ollama pull llama3.1:8b

# Optional: Größere Modelle (wenn genug RAM/VRAM)
# ollama pull llama3.1:70b
# ollama pull mistral:7b

# Verify downloaded models
ollama list
```

#### 3. Repository klonen

```bash
git clone https://github.com/y-core-engineering/fidus.git
cd fidus
git checkout v1.0.0
```

#### 4. Environment konfigurieren

```bash
cp .env.example .env.hybrid
nano .env.hybrid
```

**Wichtig: Ollama URL anpassen:**

```bash
# Database
DATABASE_URL=postgresql://fidus:CHANGE_ME@postgres:5432/fidus
POSTGRES_PASSWORD=CHANGE_ME

# Redis
REDIS_URL=redis://redis:6379

# JWT & Encryption
JWT_SECRET=CHANGE_ME_GENERATE_RANDOM_STRING
ENCRYPTION_KEY=CHANGE_ME_GENERATE_RANDOM_KEY

# Auth Provider
AUTH_PROVIDER=auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# LLM - Native Ollama auf Host
LLM_PROVIDER=ollama

# Linux/MacOS: host.docker.internal funktioniert automatisch
OLLAMA_BASE_URL=http://host.docker.internal:11434

# Alternative (wenn host.docker.internal nicht funktioniert):
# Finde Host IP: ip addr show docker0 | grep -Po 'inet \K[\d.]+'
# OLLAMA_BASE_URL=http://172.17.0.1:11434

# Domain
DOMAIN=localhost
```

#### 5. Docker Compose für Hybrid-Modus

Erstelle `docker-compose.hybrid.yml`:

```yaml
version: '3.8'

services:
  # Web UI
  web:
    image: fidus/web:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api

  # API Server
  api:
    image: fidus/api:latest
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - OLLAMA_BASE_URL=${OLLAMA_BASE_URL}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./data/uploads:/app/uploads
    # Docker auf Host-Netzwerk zugreifen lassen
    extra_hosts:
      - "host.docker.internal:host-gateway"

  # PostgreSQL Database
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_DB=fidus
      - POSTGRES_USER=fidus
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fidus"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - web
      - api

volumes:
  postgres_data:
  redis_data:
```

#### 6. Deployment starten

```bash
# Services starten (ohne Ollama Container)
docker-compose -f docker-compose.hybrid.yml --env-file .env.hybrid up -d

# Logs prüfen
docker-compose -f docker-compose.hybrid.yml logs -f

# Status prüfen
docker-compose -f docker-compose.hybrid.yml ps
```

#### 7. Konnektivität testen

```bash
# Von Host: Ollama direkt testen
curl http://localhost:11434/api/tags

# Von Docker Container: Host-Zugriff testen
docker-compose -f docker-compose.hybrid.yml exec api curl http://host.docker.internal:11434/api/tags

# Erwartete Ausgabe: JSON mit installierten Modellen
```

#### 8. Database initialisieren

```bash
# Migrations ausführen
docker-compose -f docker-compose.hybrid.yml exec api alembic upgrade head

# Admin User erstellen
docker-compose -f docker-compose.hybrid.yml exec api python -m fidus.cli create-admin \
  --email admin@yourdomain.com \
  --name "Admin User" \
  --password "CHANGE_ME"
```

#### 9. Verify Deployment

```bash
# API Health Check
curl http://localhost:8000/health

# LLM Connectivity Check
curl http://localhost:8000/api/v1/llm/status

# Web UI
open http://localhost:3000
```

### Performance-Vergleich

| Metrik | All-in-Docker | Hybrid (Native Ollama) |
|--------|---------------|------------------------|
| **Token Generation Speed** | ~20 tokens/s | ~25 tokens/s |
| **Inference Latency (P95)** | 2.5s | 2.0s |
| **GPU Utilization** | 70-80% | 90-95% |
| **Memory Overhead** | +2GB (Docker) | +0.5GB |
| **Cold Start Time** | 15s | 8s |
| **Setup Complexity** | ⭐⭐ (Einfach) | ⭐⭐⭐ (Mittel) |

**Empfehlung:** Nutze **Hybrid-Modus (Ollama)** wenn:
- GPU vorhanden ist (NVIDIA empfohlen)
- Maximale LLM-Performance benötigt wird
- Häufige LLM-Anfragen erwartet werden
- >16GB RAM verfügbar sind

---

### Installation Steps (Variante 3: Hybrid - LM Studio)

**Für User, die eine grafische Oberfläche bevorzugen!**

LM Studio ist eine Desktop-Anwendung mit GUI zum Verwalten und Ausführen von LLMs. Sie bietet eine OpenAI-kompatible API, die Fidus direkt nutzen kann.

```mermaid
flowchart TD
    subgraph "Docker Network"
        Web[Web UI<br/>Next.js :3000]
        API[API Server<br/>FastAPI :8000]
        Postgres[(PostgreSQL<br/>:5432)]
        Redis[(Redis<br/>:6379)]
    end

    subgraph "Host System"
        LMStudio[LM Studio<br/>:1234<br/>GUI + API Server]
    end

    Internet[Internet] --> Nginx[Nginx<br/>:80/443]
    Nginx --> Web
    Nginx --> API

    API --> Postgres
    API --> Redis
    API -->|OpenAI-compatible API| LMStudio

    style Internet fill:#4ecdc4
    style Nginx fill:#f9c74f
    style Postgres fill:#90be6d
    style LMStudio fill:#a78bfa
```

**Vorteile:**
- ✅ **Grafische Benutzeroberfläche** - Einfaches Modell-Management
- ✅ **OpenAI-kompatible API** - Standardisiertes Interface
- ✅ **Multi-Plattform** - Windows, macOS, Linux
- ✅ **Model Marketplace** - Einfaches Durchsuchen und Herunterladen
- ✅ **Performance Monitoring** - GPU/CPU-Auslastung in Echtzeit
- ✅ **Chat-Testing** - Direkt mit Modellen chatten

**Nachteile:**
- Desktop-Anwendung erforderlich (kein Headless-Betrieb)
- Etwas höherer Memory-Overhead als Ollama

#### 1. LM Studio installieren

**Download:**
- Website: https://lmstudio.ai/
- Verfügbar für: Windows, macOS (Intel & Apple Silicon), Linux

```bash
# Linux Installation (AppImage)
wget https://releases.lmstudio.ai/linux/latest/LM_Studio-linux-x86_64.AppImage
chmod +x LM_Studio-linux-x86_64.AppImage
./LM_Studio-linux-x86_64.AppImage

# macOS Installation (DMG)
# Download und installiere LM Studio.dmg von lmstudio.ai

# Windows Installation (EXE)
# Download und installiere LM-Studio-Setup.exe von lmstudio.ai
```

#### 2. Modell in LM Studio herunterladen

1. **LM Studio öffnen**
2. **"Discover" Tab** → Modelle durchsuchen
3. **Empfohlene Modelle für Fidus:**
   - `TheBloke/Llama-2-7B-Chat-GGUF` (7B, schnell)
   - `TheBloke/Mistral-7B-Instruct-v0.2-GGUF` (7B, gut)
   - `TheBloke/Llama-2-13B-Chat-GGUF` (13B, besser, mehr RAM)
   - `TheBloke/openchat-3.5-GGUF` (7B, sehr gut für Assistenten)

4. **Quantization wählen:**
   - `Q4_K_M` - Gute Balance (empfohlen, ~4GB RAM)
   - `Q5_K_M` - Bessere Qualität (~5GB RAM)
   - `Q8_0` - Beste Qualität (~8GB RAM)

5. **Download** → Warten bis fertig

#### 3. LM Studio Server starten

1. **"Local Server" Tab** in LM Studio
2. **Model laden:**
   - Select your downloaded model
   - Set context length: `4096` (oder höher wenn genug VRAM)
   - GPU Offload: `Max` (für beste Performance)
3. **Server Configuration:**
   - Port: `1234` (Standard)
   - CORS: `Enabled` (wichtig!)
   - API Key: `Optional` (leer lassen für lokalen Zugriff)
4. **"Start Server"** klicken

**Verify Server läuft:**

```bash
# Test OpenAI-compatible API
curl http://localhost:1234/v1/models

# Expected Output:
# {
#   "object": "list",
#   "data": [
#     {
#       "id": "llama-2-7b-chat",
#       "object": "model",
#       ...
#     }
#   ]
# }
```

#### 4. Fidus für LM Studio konfigurieren

```bash
cd fidus
cp .env.example .env.lmstudio
nano .env.lmstudio
```

**LM Studio Configuration:**

```bash
# Database
DATABASE_URL=postgresql://fidus:CHANGE_ME@postgres:5432/fidus
POSTGRES_PASSWORD=CHANGE_ME

# Redis
REDIS_URL=redis://redis:6379

# JWT & Encryption
JWT_SECRET=CHANGE_ME_GENERATE_RANDOM_STRING
ENCRYPTION_KEY=CHANGE_ME_GENERATE_RANDOM_KEY

# Auth Provider
AUTH_PROVIDER=auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# LLM - LM Studio (OpenAI-compatible)
LLM_PROVIDER=openai  # LM Studio ist OpenAI-kompatibel!

# LM Studio API Endpoint
OPENAI_API_BASE=http://host.docker.internal:1234/v1
OPENAI_API_KEY=lm-studio  # Beliebiger Wert (wird ignoriert)

# Model Name (wie in LM Studio angezeigt)
OPENAI_MODEL_NAME=llama-2-7b-chat  # Anpassen an dein Modell

# Domain
DOMAIN=localhost
```

#### 5. Docker Compose Hybrid Deployment

Nutze die gleiche `docker-compose.hybrid.yml` wie für Ollama (Variante 2), nur mit anderem `.env` File:

```bash
# Services starten mit LM Studio Config
docker-compose -f docker-compose.hybrid.yml --env-file .env.lmstudio up -d

# Logs prüfen
docker-compose -f docker-compose.hybrid.yml logs -f api

# API sollte "Connected to LLM provider: openai" zeigen
```

#### 6. Connectivity testen

```bash
# Von Host: LM Studio direkt testen
curl http://localhost:1234/v1/models

# Von Docker: LM Studio über host.docker.internal
docker-compose -f docker-compose.hybrid.yml exec api \
  curl http://host.docker.internal:1234/v1/models

# Test Chat Completion
curl http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-2-7b-chat",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

#### 7. Database und Admin User

```bash
# Migrations
docker-compose -f docker-compose.hybrid.yml exec api alembic upgrade head

# Admin erstellen
docker-compose -f docker-compose.hybrid.yml exec api python -m fidus.cli create-admin \
  --email admin@yourdomain.com \
  --name "Admin User" \
  --password "CHANGE_ME"
```

#### 8. Fidus Web UI testen

```bash
# API Health
curl http://localhost:8000/health

# LLM Status
curl http://localhost:8000/api/v1/llm/status

# Web UI öffnen
open http://localhost:3000
```

### LM Studio vs Ollama - Vergleich

| Feature | Ollama | LM Studio |
|---------|--------|-----------|
| **GUI** | ❌ CLI only | ✅ Full GUI |
| **Model Management** | CLI commands | Visual browser |
| **API Standard** | Ollama API | OpenAI API |
| **Performance** | ⚡⚡⚡ Optimal | ⚡⚡ Sehr gut |
| **Memory Overhead** | ~500MB | ~800MB |
| **Platform Support** | Linux, macOS, Windows | Linux, macOS, Windows |
| **Headless Support** | ✅ Yes | ❌ Desktop App |
| **Model Testing** | CLI only | ✅ Built-in Chat UI |
| **GPU Monitoring** | CLI tools | ✅ Real-time GUI |
| **Setup Complexity** | ⭐⭐ Einfach | ⭐ Sehr einfach |
| **Ideal für** | Server/Production | Desktop/Development |

### Deployment-Varianten Empfehlung

```mermaid
graph TD
    Start[Welche Variante?]

    Start -->|Einfachste Installation| Docker[Variante 1: All-in-Docker]
    Start -->|Beste Performance| Hybrid[Hybrid Deployment?]

    Hybrid -->|Server/Headless| Ollama[Variante 2: Ollama Native]
    Hybrid -->|Desktop/GUI| LMStudio[Variante 3: LM Studio]

    Docker --> Use1[✅ Schnellstart<br/>✅ Alle Services isoliert<br/>⚠️ 10-20% langsamere LLM]
    Ollama --> Use2[✅ Optimale Performance<br/>✅ Production-ready<br/>✅ Headless-fähig]
    LMStudio --> Use3[✅ Grafische Oberfläche<br/>✅ Einfaches Model-Management<br/>✅ OpenAI-kompatibel]

    style Docker fill:#90be6d
    style Ollama fill:#4ecdc4
    style LMStudio fill:#a78bfa
```

**Empfehlungen:**
- **Development/Testing:** LM Studio (GUI ist hilfreich)
- **Production/Server:** Ollama Native (headless, optimal)
- **Quick Start:** All-in-Docker (einfachste Installation)

---

### LLM Abstraction Layer: LiteLLM (Empfohlen)

**Problem:** Fidus muss mehrere LLM-Provider unterstützen (Ollama, LM Studio, OpenAI, Anthropic) mit unterschiedlichen APIs.

**Lösung:** [LiteLLM](https://github.com/BerriAI/litellm) als unified API Gateway für alle LLM-Provider.

```mermaid
flowchart TD
    subgraph Fidus["Fidus API"]
        API[FastAPI Server]
    end

    subgraph LiteLLM["LiteLLM Proxy"]
        Proxy[LiteLLM<br/>OpenAI-compatible API<br/>:4000]
        Router[Smart Router]
    end

    subgraph Providers["LLM Providers"]
        Ollama[Ollama<br/>localhost:11434]
        LMStudio[LM Studio<br/>localhost:1234]
        OpenAI[OpenAI Cloud<br/>api.openai.com]
        Anthropic[Anthropic Cloud<br/>api.anthropic.com]
    end

    API -->|Single API| Proxy
    Proxy --> Router
    Router -->|Route based on<br/>model/cost/latency| Ollama
    Router --> LMStudio
    Router --> OpenAI
    Router --> Anthropic

    style Proxy fill:#a78bfa
    style Router fill:#fbbf24
    style Ollama fill:#90be6d
```

#### Vorteile von LiteLLM

✅ **Unified API:** Ein einziges OpenAI-kompatibles Interface für alle Provider
✅ **Load Balancing:** Automatisches Load Balancing zwischen mehreren Ollama-Instanzen
✅ **Fallback:** Automatischer Fallback wenn ein Provider ausfällt
✅ **Cost Tracking:** Eingebautes Budget-Management und Cost-Tracking
✅ **Rate Limiting:** Provider-übergreifendes Rate Limiting
✅ **Caching:** Response-Caching für identische Requests
✅ **Logging:** Zentrales Logging aller LLM-Requests
✅ **Multi-Model:** Einfaches Switchen zwischen Modellen
✅ **Privacy Proxy:** Kann als Privacy-Layer vor Cloud-LLMs dienen

#### Installation: LiteLLM in Docker Compose

Erstelle `docker-compose.litellm.yml`:

```yaml
version: '3.8'

services:
  # Web UI
  web:
    image: fidus/web:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api

  # API Server
  api:
    image: fidus/api:latest
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      # Point to LiteLLM instead of direct provider
      - LLM_PROVIDER=openai
      - OPENAI_API_BASE=http://litellm:4000
      - OPENAI_API_KEY=sk-1234  # LiteLLM internal key
    depends_on:
      - postgres
      - redis
      - litellm
    volumes:
      - ./data/uploads:/app/uploads

  # LiteLLM Proxy
  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      - LITELLM_MASTER_KEY=sk-1234
      - DATABASE_URL=${DATABASE_URL}  # For request logging
    volumes:
      - ./litellm-config.yaml:/app/config.yaml
    command: ["--config", "/app/config.yaml", "--port", "4000"]
    extra_hosts:
      - "host.docker.internal:host-gateway"

  # PostgreSQL Database
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_DB=fidus
      - POSTGRES_USER=fidus
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis Cache
  redis:
    image: redis:7
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  # Nginx
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - web
      - api

volumes:
  postgres_data:
  redis_data:
```

#### LiteLLM Configuration

Erstelle `litellm-config.yaml`:

```yaml
model_list:
  # Local Ollama (Primary - Free)
  - model_name: llama-3.1-8b
    litellm_params:
      model: ollama/llama3.1:8b
      api_base: http://host.docker.internal:11434
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.0  # Free

  # Local Ollama (Secondary - Larger model)
  - model_name: llama-3.1-70b
    litellm_params:
      model: ollama/llama3.1:70b
      api_base: http://host.docker.internal:11434
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.0

  # LM Studio (Alternative Local)
  - model_name: lmstudio
    litellm_params:
      model: openai/llama-2-7b-chat
      api_base: http://host.docker.internal:1234/v1
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.0

  # OpenAI GPT-4 (Cloud Fallback - Optional)
  - model_name: gpt-4
    litellm_params:
      model: gpt-4
      api_key: os.environ/OPENAI_API_KEY
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.00003  # $0.03 per 1K tokens

  # Anthropic Claude (Cloud Alternative - Optional)
  - model_name: claude-3-sonnet
    litellm_params:
      model: claude-3-sonnet-20240229
      api_key: os.environ/ANTHROPIC_API_KEY
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.000003  # $0.003 per 1K tokens

# Routing Rules
router_settings:
  routing_strategy: least-busy  # or: simple-shuffle, latency-based-routing

  # Fallback chain
  fallbacks:
    - llama-3.1-8b:
        - llama-3.1-70b
        - lmstudio
        - gpt-4  # Only if user opted-in

  # Budget limits (optional)
  max_budget: 100.0  # $100 per month
  budget_duration: 30d

  # Rate limiting
  rpm: 60  # Requests per minute
  tpm: 100000  # Tokens per minute

# Caching
litellm_settings:
  cache: true
  cache_params:
    type: redis
    host: redis
    port: 6379

  # Success callbacks (logging)
  success_callback: ["langfuse"]  # Optional: Track all requests

  # Set default model
  default_model: llama-3.1-8b

  # Enable streaming
  stream: true

  # Drop params not supported by provider
  drop_params: true
```

#### Environment Configuration

`.env.litellm`:

```bash
# Database
DATABASE_URL=postgresql://fidus:CHANGE_ME@postgres:5432/fidus
POSTGRES_PASSWORD=CHANGE_ME

# Redis
REDIS_URL=redis://redis:6379

# JWT & Encryption
JWT_SECRET=CHANGE_ME_GENERATE_RANDOM_STRING
ENCRYPTION_KEY=CHANGE_ME_GENERATE_RANDOM_KEY

# Auth
AUTH_PROVIDER=auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# LLM via LiteLLM Proxy
LLM_PROVIDER=openai
OPENAI_API_BASE=http://litellm:4000
OPENAI_API_KEY=sk-1234  # LiteLLM master key

# Default model (matches litellm-config.yaml)
OPENAI_MODEL_NAME=llama-3.1-8b

# Optional: Cloud Provider Keys (only if users opt-in)
# OPENAI_API_KEY=sk-proj-xxx
# ANTHROPIC_API_KEY=sk-ant-xxx

# Domain
DOMAIN=localhost
```

#### Deployment mit LiteLLM

```bash
# 1. Ollama auf Host starten (wie Variante 2)
ollama pull llama3.1:8b
ollama serve

# 2. Fidus mit LiteLLM starten
docker-compose -f docker-compose.litellm.yml --env-file .env.litellm up -d

# 3. Verify LiteLLM
curl http://localhost:4000/v1/models

# 4. Test Chat Completion
curl http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-1234" \
  -d '{
    "model": "llama-3.1-8b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# 5. Fidus Web UI
open http://localhost:3000
```

#### LiteLLM Admin Dashboard (Optional)

LiteLLM bietet ein Admin-Dashboard für Monitoring:

```yaml
# Add to docker-compose.litellm.yml
services:
  litellm-ui:
    image: ghcr.io/berriai/litellm-ui:main-latest
    restart: unless-stopped
    ports:
      - "4001:4001"
    environment:
      - LITELLM_PROXY_URL=http://litellm:4000
      - LITELLM_MASTER_KEY=sk-1234
    depends_on:
      - litellm
```

Access Dashboard: `http://localhost:4001`

**Features:**
- Real-time request monitoring
- Cost tracking per model
- Token usage analytics
- Error rate monitoring
- Model performance comparison

#### Warum LiteLLM für Fidus?

**Hauptgründe:**

1. **Privacy-First mit Cloud-Fallback:**
   - Primär lokale LLMs (Ollama)
   - Cloud nur bei Opt-in und als Fallback
   - LiteLLM kann PII-Daten herausfiltern

2. **Multi-Model-Support:**
   - User können zwischen Modellen wählen
   - Automatischer Fallback bei Überlastung
   - A/B-Testing verschiedener Modelle

3. **Cost Control:**
   - Budget-Limits für Cloud-LLMs
   - Cost-Tracking pro User/Tenant
   - Warnung bei Budget-Überschreitung

4. **Performance:**
   - Response-Caching spart Tokens
   - Load-Balancing zwischen Ollama-Instanzen
   - Latency-based routing zum schnellsten Provider

5. **Observability:**
   - Zentrale Logging aller LLM-Requests
   - Performance-Metriken pro Modell
   - Error-Tracking und Debugging

**Empfehlung:** Nutze LiteLLM für **Production Deployments**, besonders wenn:
- Multiple LLM-Provider unterstützt werden sollen
- Cloud-LLMs als optionaler Fallback gewünscht
- Cost-Tracking und Budget-Control wichtig sind
- Enterprise-Kunden Multi-Tenancy benötigen

---

### Installation Steps (Variante 4: Development Setup)

**Für Fidus-Entwickler, die an der Codebase arbeiten!**

Diese Variante ist optimiert für aktive Entwicklung mit **Hot-Reload**, **Source Debugging** und minimalen Rebuild-Zyklen.

```mermaid
flowchart TD
    subgraph Host["Host System - Development"]
        IDE[VS Code / IDE<br/>mit Debugger]
        WebDev[Web Dev Server<br/>Next.js :3000<br/>Hot Reload]
        APIDev[API Dev Server<br/>FastAPI :8000<br/>Auto Reload]
        OllamaDev[Ollama / LM Studio<br/>:11434 / :1234]
    end

    subgraph Docker["Docker - Dependencies Only"]
        Postgres[(PostgreSQL<br/>:5432)]
        Redis[(Redis<br/>:6379)]
        Neo4j[(Neo4j<br/>:7474)]
        Qdrant[(Qdrant<br/>:6333)]
    end

    IDE -.->|Edit & Debug| WebDev
    IDE -.->|Edit & Debug| APIDev

    WebDev -->|API Calls| APIDev
    APIDev --> Postgres
    APIDev --> Redis
    APIDev --> Neo4j
    APIDev --> Qdrant
    APIDev -->|LLM Calls| OllamaDev

    style IDE fill:#a78bfa
    style WebDev fill:#4ecdc4
    style APIDev fill:#f9c74f
    style OllamaDev fill:#90be6d
```

**Vorteile:**
- ✅ **Instant Hot-Reload** - Änderungen sofort sichtbar (Next.js Fast Refresh)
- ✅ **Source-Level Debugging** - Breakpoints in VS Code/PyCharm
- ✅ **Schnelle Iteration** - Keine Docker-Rebuilds für Code-Änderungen
- ✅ **Native Performance** - Kein Docker-Overhead für App-Code
- ✅ **Test-Driven Development** - Tests laufen direkt auf Host
- ✅ **Einfaches Profiling** - CPU/Memory Profiling ohne Container-Layer

**Nachteile:**
- Mehr lokale Dependencies zu installieren
- Nicht 1:1 Production-Environment

#### Prerequisites

**System Requirements:**
- **OS:** macOS, Linux, oder WSL2 (Windows)
- **RAM:** 16GB minimum (32GB empfohlen)
- **CPU:** 8 cores empfohlen
- **Disk:** 100GB freier Speicher

**Required Software:**

```bash
# 1. Node.js & pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh
pnpm env use --global lts

# 2. Python & Poetry
curl -sSL https://install.python-poetry.org | python3 -
poetry --version

# 3. Docker & Docker Compose (nur für Dependencies)
# https://docs.docker.com/get-docker/

# 4. Git
git --version

# 5. Optional: Ollama (empfohlen) oder LM Studio
curl -fsSL https://ollama.com/install.sh | sh
```

#### 1. Repository Setup

```bash
# Clone Repository
git clone https://github.com/y-core-engineering/fidus.git
cd fidus

# Checkout development branch
git checkout develop

# Install Git Hooks (pre-commit, pre-push)
pnpm install:hooks
```

#### 2. Dependencies in Docker starten

Erstelle `docker-compose.dev-deps.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_DB=fidus_dev
      - POSTGRES_USER=fidus_dev
      - POSTGRES_PASSWORD=dev_password_change_me
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fidus_dev"]
      interval: 5s
      timeout: 3s
      retries: 5

  # Redis Cache & Queue
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_dev_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # Neo4j Graph Database
  neo4j:
    image: neo4j:5
    restart: unless-stopped
    environment:
      - NEO4J_AUTH=neo4j/dev_password_change_me
      - NEO4J_PLUGINS=["apoc", "graph-data-science"]
    volumes:
      - neo4j_dev_data:/data
    ports:
      - "7474:7474"  # HTTP
      - "7687:7687"  # Bolt
    healthcheck:
      test: ["CMD", "cypher-shell", "-u", "neo4j", "-p", "dev_password_change_me", "RETURN 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Qdrant Vector Database
  qdrant:
    image: qdrant/qdrant:latest
    restart: unless-stopped
    volumes:
      - qdrant_dev_data:/qdrant/storage
    ports:
      - "6333:6333"  # HTTP API
      - "6334:6334"  # gRPC API
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_dev_data:
  redis_dev_data:
  neo4j_dev_data:
  qdrant_dev_data:
```

**Starten:**

```bash
# Dependencies starten
docker-compose -f docker-compose.dev-deps.yml up -d

# Status prüfen
docker-compose -f docker-compose.dev-deps.yml ps

# Logs ansehen
docker-compose -f docker-compose.dev-deps.yml logs -f
```

#### 3. Ollama oder LM Studio starten

**Option A: Ollama (empfohlen für CLI-Entwickler)**

```bash
# Ollama starten
ollama serve

# In neuem Terminal: Modell herunterladen
ollama pull llama3.1:8b

# Verify
curl http://localhost:11434/api/tags
```

**Option B: LM Studio (empfohlen für GUI-Präferenz)**

```bash
# 1. LM Studio öffnen
# 2. Model herunterladen (z.B. llama-2-7b-chat)
# 3. Local Server Tab → Start Server (Port 1234)

# Verify
curl http://localhost:1234/v1/models
```

#### 4. Backend (API) Development Setup

```bash
# In packages/api/
cd packages/api

# Install dependencies
poetry install

# Setup development environment
cp .env.example .env.dev
nano .env.dev
```

**`.env.dev` Configuration:**

```bash
# Environment
ENVIRONMENT=development
LOG_LEVEL=DEBUG

# Database
DATABASE_URL=postgresql://fidus_dev:dev_password_change_me@localhost:5432/fidus_dev

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=dev_password_change_me

# Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333

# JWT & Encryption (development keys)
JWT_SECRET=dev_jwt_secret_change_in_production
JWT_ALGORITHM=HS256
ENCRYPTION_KEY=dev_encryption_key_32_bytes_long

# Auth Provider (use Auth0 dev tenant or mock)
AUTH_PROVIDER=mock  # or auth0
AUTH0_DOMAIN=your-dev-tenant.auth0.com
AUTH0_CLIENT_ID=your_dev_client_id
AUTH0_CLIENT_SECRET=your_dev_client_secret

# LLM
LLM_PROVIDER=ollama  # or openai for LM Studio
OLLAMA_BASE_URL=http://localhost:11434
# For LM Studio: OPENAI_API_BASE=http://localhost:1234/v1

# Development Features
ENABLE_DEBUG_TOOLBAR=true
ENABLE_HOT_RELOAD=true
ENABLE_PROFILING=true
```

**Run Database Migrations:**

```bash
# Create tables
poetry run alembic upgrade head

# Create dev admin user
poetry run python -m fidus.cli create-admin \
  --email dev@fidus.local \
  --name "Dev Admin" \
  --password "dev123"
```

**Start Development Server:**

```bash
# Mit Auto-Reload (empfohlen)
poetry run uvicorn fidus.main:app --reload --host 0.0.0.0 --port 8000

# Mit Debugger (VS Code/PyCharm)
# Nutze Launch Configuration (siehe unten)
```

**API läuft auf:** `http://localhost:8000`
**API Docs:** `http://localhost:8000/docs`

#### 5. Frontend (Web) Development Setup

```bash
# In packages/web/
cd packages/web

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
nano .env.local
```

**`.env.local` Configuration:**

```bash
# API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000

# Auth (same as backend)
NEXT_PUBLIC_AUTH_PROVIDER=mock  # or auth0
NEXT_PUBLIC_AUTH0_DOMAIN=your-dev-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_dev_client_id

# Feature Flags (development)
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_ENABLE_DEBUG=true
```

**Start Development Server:**

```bash
# Next.js Development Server mit Turbopack (schneller)
pnpm dev

# Oder mit Standard Webpack
pnpm dev:webpack
```

**Web UI läuft auf:** `http://localhost:3000`

#### 6. VS Code Setup (Empfohlen)

**`.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "fidus.main:app",
        "--reload",
        "--host", "0.0.0.0",
        "--port", "8000"
      ],
      "cwd": "${workspaceFolder}/packages/api",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/packages/api"
      },
      "console": "integratedTerminal"
    },
    {
      "name": "Next.js: Web",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}/packages/web",
      "console": "integratedTerminal"
    },
    {
      "name": "Python: Tests",
      "type": "python",
      "request": "launch",
      "module": "pytest",
      "args": ["-v", "tests/"],
      "cwd": "${workspaceFolder}/packages/api",
      "console": "integratedTerminal"
    }
  ],
  "compounds": [
    {
      "name": "Full Stack",
      "configurations": ["Python: FastAPI", "Next.js: Web"]
    }
  ]
}
```

**`.vscode/settings.json`:**

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/packages/api/.venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.mypyEnabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  }
}
```

**Extensions (`.vscode/extensions.json`):**

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-azuretools.vscode-docker"
  ]
}
```

#### 7. Development Workflow

**Täglicher Start:**

```bash
# Terminal 1: Dependencies
docker-compose -f docker-compose.dev-deps.yml up

# Terminal 2: Ollama (falls nicht als Service)
ollama serve

# Terminal 3: Backend
cd packages/api
poetry run uvicorn fidus.main:app --reload

# Terminal 4: Frontend
cd packages/web
pnpm dev

# Oder in VS Code: F5 → "Full Stack" Compound Launch
```

**Code Changes:**

```bash
# Backend: Änderungen werden automatisch neu geladen (--reload)
# Frontend: Next.js Fast Refresh aktualisiert Browser automatisch

# Keine Docker-Rebuilds nötig!
```

**Running Tests:**

```bash
# Backend Tests
cd packages/api
poetry run pytest tests/ -v

# Frontend Tests
cd packages/web
pnpm test

# E2E Tests (benötigt beide Server)
pnpm test:e2e
```

**Code Quality:**

```bash
# Linting (gesamtes Monorepo)
pnpm lint

# Type Checking
pnpm typecheck

# Formatting
pnpm format

# Pre-Commit Hooks laufen automatisch
git commit -m "feat: neue feature"
```

#### 8. Debugging

**Backend (Python):**

1. Setze Breakpoints in VS Code
2. F5 → "Python: FastAPI"
3. Request an API senden
4. Debugger stoppt an Breakpoints

**Frontend (Next.js):**

1. Chrome DevTools öffnen
2. Setze Breakpoints in Browser oder VS Code
3. F5 → "Next.js: Web" (mit `--inspect`)
4. Debugger stoppt an Breakpoints

**LLM Calls debuggen:**

```bash
# Backend Logs zeigen alle LLM Calls
LOG_LEVEL=DEBUG poetry run uvicorn fidus.main:app --reload

# Oder: LiteLLM Proxy mit Logging
docker-compose -f docker-compose.litellm.yml up
# Logs: http://localhost:4001
```

#### 9. Database Management

**PostgreSQL:**

```bash
# Connect to database
psql postgresql://fidus_dev:dev_password_change_me@localhost:5432/fidus_dev

# Or use GUI tool:
# - TablePlus (macOS/Windows)
# - DBeaver (Cross-platform)
# - pgAdmin (Cross-platform)
```

**Migrations:**

```bash
cd packages/api

# Create new migration
poetry run alembic revision --autogenerate -m "add new table"

# Apply migrations
poetry run alembic upgrade head

# Rollback
poetry run alembic downgrade -1
```

**Neo4j:**

```bash
# Web UI
open http://localhost:7474

# Credentials: neo4j / dev_password_change_me
```

**Qdrant:**

```bash
# Web UI
open http://localhost:6333/dashboard
```

#### 10. Cleanup & Reset

**Reset Development Databases:**

```bash
# Stop und remove containers mit volumes
docker-compose -f docker-compose.dev-deps.yml down -v

# Fresh start
docker-compose -f docker-compose.dev-deps.yml up -d

# Re-run migrations
cd packages/api
poetry run alembic upgrade head
poetry run python -m fidus.cli create-admin --email dev@fidus.local --name "Dev Admin" --password "dev123"
```

**Clean Build Artifacts:**

```bash
# Root
pnpm clean

# Backend
cd packages/api
poetry run pyclean .

# Frontend
cd packages/web
pnpm clean
```

### Development vs Production Comparison

| Aspekt | Development Setup | Production Setup |
|--------|-------------------|------------------|
| **App Code** | Läuft auf Host | Läuft in Docker |
| **Dependencies** | In Docker | In Docker |
| **LLM** | Native (Ollama/LM Studio) | Native oder Docker |
| **Hot-Reload** | ✅ Ja (instant) | ❌ Nein |
| **Debugging** | ✅ Full IDE support | ⚠️ Remote Debugging |
| **Performance** | ⚡⚡⚡ Sehr schnell | ⚡⚡ Schnell |
| **Setup Zeit** | 15-30 min | 5 min |
| **Rebuild Zeit** | 0s (Hot-Reload) | 2-5 min |
| **Test Iteration** | Sehr schnell | Langsamer |
| **Production Parity** | ⚠️ 90% | ✅ 100% |
| **Ideal für** | Aktive Entwicklung | Testing, Deployment |

### Development Setup Empfehlung

**Nutze Development Setup wenn:**
- ✅ Du aktiv an Fidus-Code arbeitest
- ✅ Du häufig iterierst und testest
- ✅ Du Debugging mit IDE-Features brauchst
- ✅ Du TDD (Test-Driven Development) praktizierst
- ✅ Du schnelle Feedback-Loops willst

**Nutze Production Setup (Docker) wenn:**
- ✅ Du Fidus nur nutzen willst (nicht entwickeln)
- ✅ Du Production-Deployment testest
- ✅ Du CI/CD Pipeline testest
- ✅ Du exaktes Production Environment brauchst

---

### Installation Steps (Variante 5: Development mit Cloud LLM)

**Für Entwickler, die Cloud-LLMs (ChatGPT, Claude) nutzen wollen!**

Diese Variante kombiniert das Development Setup mit LiteLLM als Gateway zu Cloud-LLMs. Ideal für Entwickler die:
- Schnelle LLM-Responses ohne lokale GPU brauchen
- Höchste Modell-Qualität (GPT-4, Claude 3.5 Sonnet) wollen
- Zwischen verschiedenen Cloud-LLMs wechseln möchten
- Cost-Tracking und Budget-Control benötigen

```mermaid
flowchart TD
    subgraph Host["Host System - Development"]
        IDE[VS Code / IDE<br/>mit Debugger]
        WebDev[Web Dev Server<br/>Next.js :3000<br/>Hot Reload]
        APIDev[API Dev Server<br/>FastAPI :8000<br/>Auto Reload]
    end

    subgraph Docker["Docker - Dependencies + LiteLLM"]
        LiteLLM[LiteLLM Gateway<br/>:4000]
        Postgres[(PostgreSQL<br/>:5432)]
        Redis[(Redis<br/>:6379)]
        Neo4j[(Neo4j<br/>:7474)]
        Qdrant[(Qdrant<br/>:6333)]
    end

    subgraph Cloud["Cloud LLM Providers"]
        OpenAI[OpenAI<br/>GPT-4/GPT-4o]
        Anthropic[Anthropic<br/>Claude 3.5 Sonnet]
        Others[Weitere Provider<br/>Gemini, etc.]
    end

    IDE -.->|Edit & Debug| WebDev
    IDE -.->|Edit & Debug| APIDev

    WebDev -->|API Calls| APIDev
    APIDev -->|LLM Requests| LiteLLM
    LiteLLM -->|Route + Track| OpenAI
    LiteLLM -->|Route + Track| Anthropic
    LiteLLM -->|Route + Track| Others

    APIDev --> Postgres
    APIDev --> Redis
    APIDev --> Neo4j
    APIDev --> Qdrant

    style IDE fill:#a78bfa
    style WebDev fill:#4ecdc4
    style APIDev fill:#f9c74f
    style LiteLLM fill:#ff6b6b
    style OpenAI fill:#10a37f
    style Anthropic fill:#d4a373
```

**Vorteile:**
- ✅ **Keine lokale GPU nötig** - Cloud-LLMs laufen remote
- ✅ **Beste Modell-Qualität** - GPT-4, Claude 3.5 Sonnet
- ✅ **Schnelle Responses** - Keine lokale Modell-Ladezeit
- ✅ **Multi-Provider** - Einfacher Wechsel zwischen LLMs
- ✅ **Cost Tracking** - Budget-Control via LiteLLM
- ✅ **Fallback-Chains** - Automatischer Fallback bei Provider-Ausfall
- ✅ **Hot-Reload** - Voller Development-Komfort
- ✅ **Caching** - Response-Caching spart API-Kosten

**Nachteile:**
- ⚠️ API-Kosten (ca. $5-20/Monat für Development)
- ⚠️ Internet-Verbindung erforderlich
- ⚠️ Daten gehen zu Cloud-Providern (Privacy-Tradeoff)

#### Prerequisites

**System:**
- Node.js 20+ & pnpm 8+
- Python 3.11+ & Poetry
- Docker & Docker Compose

**API Keys (mindestens einer):**
- [OpenAI API Key](https://platform.openai.com/api-keys) (empfohlen für Start)
- [Anthropic API Key](https://console.anthropic.com/) (optional)
- [Google AI API Key](https://makersuite.google.com/app/apikey) (optional)

#### 1. Repository Setup

```bash
# Clone Repository
git clone https://github.com/y-core-engineering/fidus.git
cd fidus

# Checkout development branch
git checkout develop

# Install Git Hooks
pnpm install:hooks
```

#### 2. API Keys beschaffen

**OpenAI (empfohlen für Start):**

```bash
# 1. Registrieren: https://platform.openai.com/signup
# 2. API Key erstellen: https://platform.openai.com/api-keys
# 3. Guthaben aufladen: https://platform.openai.com/account/billing
#    Empfehlung: $10 für Start (reicht für 1-2 Monate Development)

# Kosten-Übersicht:
# - GPT-4o: $2.50 / 1M input tokens, $10 / 1M output tokens
# - GPT-4o-mini: $0.15 / 1M input tokens, $0.60 / 1M output tokens
# - GPT-3.5-turbo: $0.50 / 1M input tokens, $1.50 / 1M output tokens

# Geschätzte Dev-Kosten: $5-20/Monat (je nach Nutzung)
```

**Anthropic Claude (optional):**

```bash
# 1. Registrieren: https://console.anthropic.com/
# 2. API Key erstellen
# 3. Guthaben: $5 gratis für neue Accounts

# Kosten:
# - Claude 3.5 Sonnet: $3 / 1M input, $15 / 1M output
# - Claude 3 Haiku: $0.25 / 1M input, $1.25 / 1M output
```

#### 3. Docker Compose für Dev mit LiteLLM

Erstelle `docker-compose.dev-cloud.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_DB=fidus_dev
      - POSTGRES_USER=fidus_dev
      - POSTGRES_PASSWORD=dev_password_change_me
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fidus_dev"]
      interval: 5s
      timeout: 3s
      retries: 5

  # Redis Cache & Queue
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_dev_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # Neo4j Graph Database
  neo4j:
    image: neo4j:5
    restart: unless-stopped
    environment:
      - NEO4J_AUTH=neo4j/dev_password_change_me
      - NEO4J_PLUGINS=["apoc", "graph-data-science"]
    volumes:
      - neo4j_dev_data:/data
    ports:
      - "7474:7474"
      - "7687:7687"
    healthcheck:
      test: ["CMD", "cypher-shell", "-u", "neo4j", "-p", "dev_password_change_me", "RETURN 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Qdrant Vector Database
  qdrant:
    image: qdrant/qdrant:latest
    restart: unless-stopped
    volumes:
      - qdrant_dev_data:/qdrant/storage
    ports:
      - "6333:6333"
      - "6334:6334"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 5s
      timeout: 3s
      retries: 5

  # LiteLLM Gateway
  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      - LITELLM_MASTER_KEY=dev_litellm_key_change_me
      - DATABASE_URL=postgresql://fidus_dev:dev_password_change_me@postgres:5432/fidus_dev
      # API Keys (aus .env)
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}
      - GEMINI_API_KEY=${GEMINI_API_KEY:-}
    volumes:
      - ./litellm-dev.yaml:/app/config.yaml
    command: ["--config", "/app/config.yaml", "--port", "4000", "--detailed_debug"]
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  # LiteLLM Admin UI (optional, aber empfohlen)
  litellm-ui:
    image: ghcr.io/berriai/litellm-ui:main-latest
    restart: unless-stopped
    ports:
      - "4001:4001"
    environment:
      - LITELLM_PROXY_URL=http://litellm:4000
      - LITELLM_MASTER_KEY=dev_litellm_key_change_me
    depends_on:
      - litellm

volumes:
  postgres_dev_data:
  redis_dev_data:
  neo4j_dev_data:
  qdrant_dev_data:
```

#### 4. LiteLLM Configuration für Development

Erstelle `litellm-dev.yaml`:

```yaml
model_list:
  # OpenAI GPT-4o (empfohlen - beste Balance)
  - model_name: gpt-4o
    litellm_params:
      model: gpt-4o
      api_key: os.environ/OPENAI_API_KEY
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.0000025  # $2.50 / 1M input tokens

  # OpenAI GPT-4o-mini (günstig für Testing)
  - model_name: gpt-4o-mini
    litellm_params:
      model: gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.00000015  # $0.15 / 1M input tokens

  # OpenAI GPT-3.5 Turbo (backup)
  - model_name: gpt-3.5-turbo
    litellm_params:
      model: gpt-3.5-turbo
      api_key: os.environ/OPENAI_API_KEY
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.0000005  # $0.50 / 1M input tokens

  # Anthropic Claude 3.5 Sonnet (optional)
  - model_name: claude-3-5-sonnet
    litellm_params:
      model: claude-3-5-sonnet-20241022
      api_key: os.environ/ANTHROPIC_API_KEY
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.000003  # $3 / 1M input tokens

  # Anthropic Claude 3 Haiku (günstig)
  - model_name: claude-3-haiku
    litellm_params:
      model: claude-3-haiku-20240307
      api_key: os.environ/ANTHROPIC_API_KEY
      stream: true
    model_info:
      mode: chat
      cost_per_token: 0.00000025  # $0.25 / 1M input tokens

# Routing & Fallback
router_settings:
  routing_strategy: simple-shuffle  # Für Development

  # Fallback Chain (wichtig!)
  fallbacks:
    - gpt-4o:
        - claude-3-5-sonnet
        - gpt-4o-mini
    - claude-3-5-sonnet:
        - gpt-4o
        - claude-3-haiku

  # Development Budget (Warnung bei Überschreitung)
  max_budget: 50.0  # $50 pro Monat
  budget_duration: 30d

  # Rate Limiting (großzügig für Dev)
  rpm: 500  # Requests per minute
  tpm: 500000  # Tokens per minute

# Caching (spart Kosten!)
litellm_settings:
  cache: true
  cache_params:
    type: redis
    host: redis
    port: 6379
    ttl: 3600  # 1 Stunde Cache

  # Default Model für Development
  default_model: gpt-4o-mini  # Günstig für Development

  # Logging & Monitoring
  success_callback: ["langfuse"]  # Optional: Request Tracking

  # Streaming aktiviert
  stream: true

  # Drop unsupported params
  drop_params: true

  # Detailed Debug Logging (Development)
  set_verbose: true
```

#### 5. Environment Setup

Erstelle `.env.dev.cloud`:

```bash
# Environment
ENVIRONMENT=development
LOG_LEVEL=DEBUG

# Database
DATABASE_URL=postgresql://fidus_dev:dev_password_change_me@localhost:5432/fidus_dev

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=dev_password_change_me

# Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333

# JWT & Encryption (development keys)
JWT_SECRET=dev_jwt_secret_change_in_production
JWT_ALGORITHM=HS256
ENCRYPTION_KEY=dev_encryption_key_32_bytes_long

# Auth Provider (mock für Development)
AUTH_PROVIDER=mock
AUTH0_DOMAIN=your-dev-tenant.auth0.com
AUTH0_CLIENT_ID=your_dev_client_id
AUTH0_CLIENT_SECRET=your_dev_client_secret

# LLM via LiteLLM Gateway
LLM_PROVIDER=openai  # LiteLLM ist OpenAI-kompatibel
OPENAI_API_BASE=http://localhost:4000  # LiteLLM Gateway
OPENAI_API_KEY=dev_litellm_key_change_me  # LiteLLM Master Key
OPENAI_MODEL_NAME=gpt-4o-mini  # Default für Development

# API Keys für LiteLLM (WICHTIG!)
# Hole deine Keys von:
# - OpenAI: https://platform.openai.com/api-keys
# - Anthropic: https://console.anthropic.com/
OPENAI_API_KEY=sk-proj-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here  # Optional

# Development Features
ENABLE_DEBUG_TOOLBAR=true
ENABLE_HOT_RELOAD=true
ENABLE_PROFILING=true
```

**WICHTIG: API Keys schützen!**

```bash
# Füge .env.dev.cloud zu .gitignore hinzu
echo ".env.dev.cloud" >> .gitignore

# NIEMALS API Keys in Git committen!
```

#### 6. Services starten

```bash
# Terminal 1: Dependencies + LiteLLM in Docker
docker-compose -f docker-compose.dev-cloud.yml --env-file .env.dev.cloud up

# Warte bis alle Services healthy sind
# LiteLLM Dashboard: http://localhost:4001
```

**LiteLLM testen:**

```bash
# Test Connection
curl http://localhost:4000/health

# Test Chat Completion
curl http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev_litellm_key_change_me" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Hello! Say hi in one sentence."}
    ]
  }'

# Expected: JSON Response von GPT-4o-mini
```

#### 7. Backend starten

```bash
# Terminal 2: Backend Development Server
cd packages/api
poetry install
poetry run alembic upgrade head

# Load environment
export $(cat ../../.env.dev.cloud | xargs)

# Start with hot-reload
poetry run uvicorn fidus.main:app --reload --host 0.0.0.0 --port 8000

# API läuft auf: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### 8. Frontend starten

```bash
# Terminal 3: Frontend Development Server
cd packages/web
pnpm install

# Environment für Frontend
cat > .env.local <<EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_PROVIDER=mock
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_ENABLE_DEBUG=true
EOF

# Start with Turbopack
pnpm dev

# Web UI läuft auf: http://localhost:3000
```

#### 9. Development Workflow

**Täglicher Start:**

```bash
# Terminal 1: Dependencies + LiteLLM
docker-compose -f docker-compose.dev-cloud.yml --env-file .env.dev.cloud up

# Terminal 2: Backend
cd packages/api
export $(cat ../../.env.dev.cloud | xargs)
poetry run uvicorn fidus.main:app --reload

# Terminal 3: Frontend
cd packages/web
pnpm dev

# Browser: http://localhost:3000
# LiteLLM Dashboard: http://localhost:4001
```

**LLM-Model wechseln:**

```python
# In deinem Code (Backend)
response = await llm_client.chat(
    model="gpt-4o",  # oder "claude-3-5-sonnet" oder "gpt-4o-mini"
    messages=[...]
)

# LiteLLM routet automatisch zum richtigen Provider!
```

**Cost Tracking:**

```bash
# LiteLLM Dashboard öffnen
open http://localhost:4001

# Features:
# - Real-time Cost Tracking
# - Request Count per Model
# - Token Usage
# - Latency Metrics
# - Error Rates
```

#### 10. Kosten optimieren

**Best Practices:**

```yaml
# 1. Günstigeres Default-Model für Development
default_model: gpt-4o-mini  # Statt gpt-4o

# 2. Caching aktivieren (spart 50-80% Kosten)
cache: true
cache_params:
  ttl: 3600  # 1 Stunde

# 3. Budget Alert setzen
max_budget: 20.0  # Warnung bei $20/Monat
```

**Cost-Saving Tips:**

```bash
# 1. Nutze gpt-4o-mini für die meisten Tests
#    (~10x günstiger als gpt-4o)

# 2. Response Caching nutzt LiteLLM automatisch
#    Identische Requests werden aus Cache beantwortet

# 3. Nutze gpt-4o/claude nur für finale Tests

# 4. Tracke Kosten im Dashboard:
open http://localhost:4001

# 5. Rate Limiting verhindert Kostenexplosion bei Bugs
```

**Geschätzte Monatliche Kosten:**

| Nutzung | Model | Est. Kosten |
|---------|-------|-------------|
| **Light Development** (500 requests/Monat) | gpt-4o-mini | $2-5 |
| **Normal Development** (2000 requests/Monat) | gpt-4o-mini | $8-15 |
| **Heavy Development** (5000 requests/Monat) | mix (mini + gpt-4o) | $20-40 |
| **With Caching** | Any | -50-80% |

#### 11. VS Code Integration

**`.vscode/launch.json` erweitern:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI (Cloud LLM)",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "fidus.main:app",
        "--reload",
        "--host", "0.0.0.0",
        "--port", "8000"
      ],
      "cwd": "${workspaceFolder}/packages/api",
      "envFile": "${workspaceFolder}/.env.dev.cloud",
      "console": "integratedTerminal"
    },
    {
      "name": "Next.js: Web (Cloud LLM)",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}/packages/web",
      "console": "integratedTerminal"
    }
  ]
}
```

### Variante 4 vs Variante 5: Vergleich

| Aspekt | Variante 4 (Local LLM) | Variante 5 (Cloud LLM) |
|--------|------------------------|------------------------|
| **LLM** | Ollama/LM Studio (lokal) | GPT-4/Claude (Cloud) |
| **GPU nötig** | ✅ Ja (empfohlen) | ❌ Nein |
| **Internet** | ❌ Optional | ✅ Erforderlich |
| **Kosten** | ✅ Kostenlos | ⚠️ $5-40/Monat |
| **LLM Qualität** | ⚡⚡ Gut (7B-70B) | ⚡⚡⚡ Exzellent |
| **Response Speed** | ⚡⚡ 1-5s (je nach GPU) | ⚡⚡⚡ 0.5-2s |
| **Privacy** | ✅ 100% Lokal | ⚠️ Daten → Cloud |
| **Setup** | ⭐⭐⭐ Mittel | ⭐⭐ Einfach |
| **Multi-Model** | ⚠️ Model Wechsel langsam | ✅ Instant Switch |
| **Cost Tracking** | ❌ Nicht nötig | ✅ Via LiteLLM |
| **Offline Work** | ✅ Ja | ❌ Nein |
| **Ideal für** | Privacy, keine GPU-Kosten | Schnelligkeit, Qualität |

### Wann welche Variante?

**Nutze Variante 4 (Local LLM) wenn:**
- ✅ Du Privacy-First entwickeln willst
- ✅ Du eine gute GPU hast (NVIDIA empfohlen)
- ✅ Du keine monatlichen Kosten willst
- ✅ Du offline arbeiten musst
- ✅ Du die lokale LLM-Architektur testen willst

**Nutze Variante 5 (Cloud LLM) wenn:**
- ✅ Du keine GPU hast oder sparen willst
- ✅ Du schnellste/beste LLM-Qualität brauchst
- ✅ Du zwischen verschiedenen Modellen testen willst
- ✅ Du Cost-Tracking und Budget-Control brauchst
- ✅ $5-40/Monat akzeptabel sind
- ✅ Du Cloud-Provider-Features testen willst

**Hybrid Approach (Best of Both):**

Viele Entwickler nutzen beide:
- **Variante 5 (Cloud)** für tägliche Development
- **Variante 4 (Local)** für Privacy-Features und Testing

```bash
# Einfacher Switch via Environment Variable:
# Cloud LLM:
export OPENAI_API_BASE=http://localhost:4000  # LiteLLM

# Local LLM:
export OPENAI_API_BASE=http://localhost:11434  # Ollama
```

---

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream web {
        server web:3000;
    }

    upstream api {
        server api:8000;
    }

    # HTTP -> HTTPS redirect
    server {
        listen 80;
        server_name fidus.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name fidus.yourdomain.com;

        # SSL configuration
        ssl_certificate /etc/letsencrypt/live/fidus.yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/fidus.yourdomain.com/privkey.pem;
        ssl_protocols TLSv1.3;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;

        # Web UI
        location / {
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API
        location /api/ {
            proxy_pass http://api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # SSE support
            proxy_buffering off;
            proxy_cache off;
            proxy_set_header Connection '';
            proxy_http_version 1.1;
            chunked_transfer_encoding off;
        }
    }
}
```

### Backup Strategy

```bash
# Create backup script
cat > backup.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/fidus"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker-compose exec -T postgres pg_dump -U fidus fidus | gzip > $BACKUP_DIR/postgres_$DATE.sql.gz

# Backup Redis
docker-compose exec -T redis redis-cli --rdb /data/dump.rdb
docker cp $(docker-compose ps -q redis):/data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ./data/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Schedule daily backups (cron)
crontab -e
# Add line:
# 0 2 * * * /path/to/fidus/backup.sh
```

---

## Starter Edition (Single Server)

### Architecture

```mermaid
flowchart TD
    subgraph "VPS (Hetzner/DigitalOcean)"
        LB[Nginx<br/>Load Balancer]
        API1[API Server 1]
        API2[API Server 2]
        Web[Web UI]
        Postgres[(PostgreSQL)]
        Redis[(Redis)]
        Ollama[Ollama]
    end

    Internet[Internet] --> LB
    LB --> Web
    LB --> API1
    LB --> API2

    API1 --> Postgres
    API2 --> Postgres
    API1 --> Redis
    API2 --> Redis
    API1 --> Ollama
    API2 --> Ollama

    style Internet fill:#4ecdc4
    style LB fill:#f9c74f
```

### Infrastructure Requirements

**Recommended VPS Specifications:**
- **Provider:** Hetzner CPX41 or DigitalOcean Droplet
- **CPU:** 8 vCPUs
- **RAM:** 32GB
- **Disk:** 240GB NVMe SSD
- **Network:** 1 Gbps
- **Cost:** ~€40-50/month

### Installation

```bash
# Deploy with multiple API workers
docker-compose up -d --scale api=2

# Nginx will load balance between API instances
```

**Nginx Load Balancing Configuration:**

```nginx
http {
    upstream api_backend {
        least_conn;  # Load balancing algorithm
        server api_1:8000 max_fails=3 fail_timeout=30s;
        server api_2:8000 max_fails=3 fail_timeout=30s;
    }

    server {
        listen 443 ssl http2;
        server_name fidus.yourdomain.com;

        location /api/ {
            proxy_pass http://api_backend/;
            # ... rest of proxy config
        }
    }
}
```

### Monitoring

```bash
# Install Prometheus + Grafana
docker-compose -f docker-compose.monitoring.yml up -d

# Access Grafana
open http://localhost:3001
# Default credentials: admin / admin
```

**docker-compose.monitoring.yml:**

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'

  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    depends_on:
      - prometheus

volumes:
  prometheus_data:
  grafana_data:
```

---

## Pro Edition (Multi-Server)

### Architecture

```mermaid
flowchart TD
    Internet[Internet] --> DNS[DNS<br/>CloudFlare]
    DNS --> LB[Load Balancer<br/>Nginx/Traefik]

    subgraph "Application Servers"
        API1[API Server 1]
        API2[API Server 2]
        API3[API Server 3]
    end

    subgraph "Database Cluster"
        PG_Primary[(PostgreSQL<br/>Primary)]
        PG_Replica[(PostgreSQL<br/>Read Replica)]
    end

    subgraph "Cache Cluster"
        Redis_Master[(Redis Master)]
        Redis_Replica[(Redis Replica)]
    end

    LB --> API1
    LB --> API2
    LB --> API3

    API1 --> PG_Primary
    API2 --> PG_Primary
    API3 --> PG_Primary

    API1 --> PG_Replica
    API2 --> PG_Replica
    API3 --> PG_Replica

    PG_Primary -.->|Streaming<br/>Replication| PG_Replica

    API1 --> Redis_Master
    API2 --> Redis_Master
    API3 --> Redis_Master

    Redis_Master -.->|Replication| Redis_Replica

    style DNS fill:#4ecdc4
    style LB fill:#f9c74f
    style PG_Primary fill:#90be6d
    style Redis_Master fill:#ff6b6b
```

### Infrastructure Setup

**Server Allocation:**
1. **Load Balancer:** 1x server (2 vCPU, 4GB RAM)
2. **API Servers:** 3x servers (8 vCPU, 16GB RAM each)
3. **PostgreSQL Primary:** 1x server (8 vCPU, 32GB RAM, SSD)
4. **PostgreSQL Replica:** 1x server (8 vCPU, 32GB RAM, SSD)
5. **Redis Master:** 1x server (4 vCPU, 16GB RAM)
6. **Redis Replica:** 1x server (4 vCPU, 16GB RAM)

**Total Cost:** ~€200/month (Hetzner)

### PostgreSQL Replication Setup

**Primary Server:**

```bash
# postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB
hot_standby = on

# pg_hba.conf
# Allow replication from replica server
host replication fidus_replication <replica_ip>/32 scram-sha-256

# Create replication user
CREATE ROLE fidus_replication WITH REPLICATION LOGIN PASSWORD 'xxx';
```

**Replica Server:**

```bash
# Stop PostgreSQL on replica
sudo systemctl stop postgresql

# Remove data directory
sudo rm -rf /var/lib/postgresql/16/main

# Create base backup from primary
sudo -u postgres pg_basebackup \
  -h <primary_ip> \
  -D /var/lib/postgresql/16/main \
  -U fidus_replication \
  -P \
  -R

# Start replica
sudo systemctl start postgresql

# Verify replication
sudo -u postgres psql -c "SELECT * FROM pg_stat_replication;"
```

### Redis Replication Setup

**Master Server (redis.conf):**

```conf
bind 0.0.0.0
protected-mode yes
requirepass CHANGE_ME
masterauth CHANGE_ME
```

**Replica Server (redis.conf):**

```conf
bind 0.0.0.0
protected-mode yes
replicaof <master_ip> 6379
masterauth CHANGE_ME
requirepass CHANGE_ME
replica-read-only yes
```

### Failover Configuration

**PostgreSQL Automatic Failover (Patroni):**

```yaml
# patroni.yml
scope: fidus
namespace: /db/
name: postgres_1

restapi:
  listen: 0.0.0.0:8008
  connect_address: <node_ip>:8008

etcd:
  host: <etcd_ip>:2379

bootstrap:
  dcs:
    ttl: 30
    loop_wait: 10
    retry_timeout: 10
    maximum_lag_on_failover: 1048576

postgresql:
  listen: 0.0.0.0:5432
  connect_address: <node_ip>:5432
  data_dir: /var/lib/postgresql/16/main
  pgpass: /tmp/pgpass
  authentication:
    replication:
      username: fidus_replication
      password: xxx
    superuser:
      username: postgres
      password: xxx
  parameters:
    max_connections: 200
    shared_buffers: 8GB
    effective_cache_size: 24GB
    maintenance_work_mem: 2GB
    checkpoint_completion_target: 0.9
    wal_buffers: 16MB
    default_statistics_target: 100
    random_page_cost: 1.1
    effective_io_concurrency: 200
    work_mem: 20MB
    min_wal_size: 2GB
    max_wal_size: 8GB
```

### Load Balancer Configuration (Traefik)

```yaml
# traefik.yml
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"

providers:
  docker:
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@yourdomain.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

# docker-compose.yml
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt

  api:
    image: fidus/api:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.fidus.yourdomain.com`)"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"
    deploy:
      replicas: 3
```

---

## Enterprise Edition (Kubernetes)

### Architecture

```mermaid
flowchart TD
    Internet[Internet] --> Ingress[Ingress Controller<br/>Nginx/Traefik]

    subgraph "Kubernetes Cluster"
        subgraph "Namespace: fidus-prod"
            API[API Deployment<br/>3-10 replicas]
            Web[Web Deployment<br/>2-5 replicas]
            Worker[Worker Deployment<br/>5-20 replicas]
        end

        subgraph "Namespace: fidus-data"
            PG[(PostgreSQL<br/>StatefulSet)]
            Redis[(Redis<br/>StatefulSet)]
        end

        subgraph "Namespace: monitoring"
            Prometheus[Prometheus]
            Grafana[Grafana]
        end
    end

    Ingress --> Web
    Ingress --> API

    API --> PG
    API --> Redis
    Worker --> PG
    Worker --> Redis

    API -.->|Metrics| Prometheus
    Worker -.->|Metrics| Prometheus
    Prometheus --> Grafana

    style Ingress fill:#4ecdc4
    style API fill:#90be6d
    style PG fill:#f9c74f
```

### Infrastructure Requirements

**Kubernetes Cluster:**
- **Nodes:** 5+ nodes minimum (3 for control plane, 2+ for workloads)
- **Node Size:** 8 vCPU, 32GB RAM per node
- **Storage:** Persistent volumes (SSD)
- **Network:** Load balancer support
- **Provider:** AWS EKS, GCP GKE, Azure AKS, or self-hosted

### Helm Chart Installation

```bash
# Add Fidus Helm repository
helm repo add fidus https://charts.fidus.ai
helm repo update

# Create namespace
kubectl create namespace fidus-prod

# Install with Helm
helm install fidus fidus/fidus \
  --namespace fidus-prod \
  --set domain=fidus.yourdomain.com \
  --set replicas.api=3 \
  --set replicas.web=2 \
  --set replicas.worker=5 \
  --set postgresql.enabled=true \
  --set postgresql.primary.persistence.size=100Gi \
  --set redis.enabled=true \
  --set ingress.enabled=true \
  --set ingress.className=nginx \
  --set ingress.tls.enabled=true \
  --set ingress.tls.secretName=fidus-tls

# Check deployment status
kubectl get pods -n fidus-prod

# View logs
kubectl logs -n fidus-prod -l app=fidus-api --tail=100 -f
```

### Kubernetes Manifests

**API Deployment:**

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fidus-api
  namespace: fidus-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fidus-api
  template:
    metadata:
      labels:
        app: fidus-api
    spec:
      containers:
      - name: api
        image: fidus/api:1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: fidus-secrets
              key: database-url
        - name: REDIS_URL
          value: redis://redis:6379
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: fidus-api
  namespace: fidus-prod
spec:
  selector:
    app: fidus-api
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
```

**Horizontal Pod Autoscaler:**

```yaml
# k8s/api-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fidus-api-hpa
  namespace: fidus-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fidus-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
```

**PostgreSQL StatefulSet:**

```yaml
# k8s/postgres-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: fidus-data
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: fidus
        - name: POSTGRES_USER
          value: fidus
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "8Gi"
            cpu: "4000m"
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 100Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: fidus-data
spec:
  selector:
    app: postgres
  ports:
  - protocol: TCP
    port: 5432
    targetPort: 5432
  type: ClusterIP
```

**Ingress:**

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fidus-ingress
  namespace: fidus-prod
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - fidus.yourdomain.com
    secretName: fidus-tls
  rules:
  - host: fidus.yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: fidus-api
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: fidus-web
            port:
              number: 3000
```

### Multi-Region Deployment

```mermaid
flowchart TD
    DNS[Global DNS<br/>Route53/CloudFlare]

    DNS --> Region1[Region 1: EU-West<br/>Frankfurt]
    DNS --> Region2[Region 2: US-East<br/>Virginia]

    subgraph "EU-West (Primary)"
        K8s1[Kubernetes Cluster]
        PG1[(PostgreSQL Primary)]
    end

    subgraph "US-East (Secondary)"
        K8s2[Kubernetes Cluster]
        PG2[(PostgreSQL Replica)]
    end

    Region1 --> K8s1
    Region2 --> K8s2

    K8s1 --> PG1
    K8s2 --> PG2

    PG1 -.->|Async Replication| PG2

    style DNS fill:#4ecdc4
    style Region1 fill:#90be6d
    style Region2 fill:#f9c74f
```

---

## Development Environment

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/y-core-engineering/fidus.git
cd fidus

# Install dependencies
pnpm install

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Run database migrations
pnpm --filter @fidus/api migrate

# Start dev servers
pnpm dev
```

**docker-compose.dev.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: fidus_dev
      POSTGRES_USER: fidus
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_dev:/data

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_dev:/root/.ollama

volumes:
  postgres_dev:
  redis_dev:
  ollama_dev:
```

### Hot Reloading

```bash
# Terminal 1: API (auto-reload on code changes)
cd packages/api
poetry run uvicorn fidus.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Web (auto-reload on code changes)
cd packages/web
pnpm dev

# Terminal 3: Watch shared types
cd packages/shared
pnpm dev
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Build and push Docker images
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push API image
        uses: docker/build-push-action@v4
        with:
          context: ./packages/api
          push: true
          tags: ghcr.io/y-core-engineering/fidus-api:${{ github.sha }},ghcr.io/y-core-engineering/fidus-api:latest

      - name: Build and push Web image
        uses: docker/build-push-action@v4
        with:
          context: ./packages/web
          push: true
          tags: ghcr.io/y-core-engineering/fidus-web:${{ github.sha }},ghcr.io/y-core-engineering/fidus-web:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Deploy to Kubernetes
      - uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/fidus-api \
            api=ghcr.io/y-core-engineering/fidus-api:${{ github.sha }} \
            -n fidus-prod

          kubectl set image deployment/fidus-web \
            web=ghcr.io/y-core-engineering/fidus-web:${{ github.sha }} \
            -n fidus-prod

          kubectl rollout status deployment/fidus-api -n fidus-prod
          kubectl rollout status deployment/fidus-web -n fidus-prod
```

---

## Backup & Restore

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

set -e

BACKUP_DIR="/var/backups/fidus"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

echo "Starting backup: $DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
kubectl exec -n fidus-data postgres-0 -- \
  pg_dump -U fidus fidus | gzip > $BACKUP_DIR/postgres_$DATE.sql.gz

# Backup Redis
echo "Backing up Redis..."
kubectl exec -n fidus-data redis-0 -- redis-cli SAVE
kubectl cp fidus-data/redis-0:/data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# Upload to S3 (optional)
if [ -n "$AWS_S3_BUCKET" ]; then
  echo "Uploading to S3..."
  aws s3 sync $BACKUP_DIR s3://$AWS_S3_BUCKET/backups/
fi

# Clean old backups
echo "Cleaning old backups..."
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.rdb" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
```

### Restore Procedure

```bash
# Restore PostgreSQL
kubectl exec -n fidus-data postgres-0 -- psql -U fidus -c "DROP DATABASE fidus;"
kubectl exec -n fidus-data postgres-0 -- psql -U fidus -c "CREATE DATABASE fidus;"

gunzip < /var/backups/fidus/postgres_20251027_020000.sql.gz | \
  kubectl exec -i -n fidus-data postgres-0 -- psql -U fidus fidus

# Restore Redis
kubectl cp /var/backups/fidus/redis_20251027_020000.rdb fidus-data/redis-0:/data/dump.rdb
kubectl exec -n fidus-data redis-0 -- redis-cli SHUTDOWN SAVE
kubectl rollout restart statefulset/redis -n fidus-data
```

---

## Disaster Recovery

### Recovery Time Objective (RTO) & Recovery Point Objective (RPO)

| Edition | RTO | RPO | Strategy |
|---------|-----|-----|----------|
| **Community** | 4 hours | 24 hours | Manual restore from daily backup |
| **Starter** | 2 hours | 12 hours | Manual restore from daily backup |
| **Pro** | 30 minutes | 1 hour | Automated failover + hourly backup |
| **Enterprise** | 5 minutes | 0 (synchronous replication) | Multi-region + continuous backup |

### Disaster Recovery Plan

**1. Database Failure:**

```bash
# Detect failure
kubectl get pods -n fidus-data

# If primary PostgreSQL is down:
# 1. Promote replica to primary (if using streaming replication)
# 2. Update connection string in API
# 3. Restart API pods

# Or restore from backup
kubectl apply -f k8s/postgres-restore-job.yaml
```

**2. Complete Region Failure:**

```bash
# Switch DNS to secondary region
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://dns-failover.json

# dns-failover.json
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "fidus.yourdomain.com",
      "Type": "A",
      "TTL": 60,
      "ResourceRecords": [{"Value": "<secondary_region_ip>"}]
    }
  }]
}

# Promote secondary region database to primary
# Update replication configuration
# Verify all services are operational
```

---

## Migration Procedures

### Zero-Downtime Deployment

```bash
# Blue-Green Deployment
kubectl apply -f k8s/api-deployment-green.yaml

# Wait for green to be ready
kubectl wait --for=condition=available deployment/fidus-api-green -n fidus-prod --timeout=300s

# Switch traffic to green
kubectl patch service fidus-api -n fidus-prod -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor for issues
kubectl logs -f deployment/fidus-api-green -n fidus-prod

# If successful, remove blue deployment
kubectl delete deployment fidus-api-blue -n fidus-prod
```

### Database Migration

```bash
# Create database backup before migration
./backup.sh

# Run migration
kubectl exec -n fidus-prod fidus-api-xxxxx -- alembic upgrade head

# Verify migration
kubectl exec -n fidus-prod fidus-api-xxxxx -- alembic current

# If migration fails, rollback
kubectl exec -n fidus-prod fidus-api-xxxxx -- alembic downgrade -1
```

---

## Monitoring & Maintenance

### Health Check Dashboard

```bash
# Check cluster health
kubectl get nodes
kubectl get pods --all-namespaces

# Check resource usage
kubectl top nodes
kubectl top pods -n fidus-prod

# View logs
kubectl logs -n fidus-prod -l app=fidus-api --tail=100 -f

# Access Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
open http://localhost:3000
```

### Regular Maintenance Tasks

| Task | Frequency | Command |
|------|-----------|---------|
| **Backup verification** | Weekly | Restore to test environment |
| **Security updates** | Monthly | `kubectl set image...` |
| **Certificate renewal** | Automatic (cert-manager) | Check: `kubectl get certificates` |
| **Database vacuum** | Weekly | `kubectl exec... VACUUM ANALYZE;` |
| **Log rotation** | Daily (automatic) | Check disk usage |
| **Performance review** | Monthly | Analyze Grafana dashboards |

---

## Conclusion

This document provides comprehensive deployment procedures for all Fidus editions, from simple Docker Compose deployments to enterprise-grade Kubernetes clusters.

### Edition Selection Guide

- **Community Edition:** Personal use, learning, development
- **Starter Edition:** Small teams, basic monitoring
- **Pro Edition:** Medium businesses, high availability
- **Enterprise Edition:** Large enterprises, multi-region, SLA

### Next Steps

For related documentation, see:
- [06-technology-decisions.md](06-technology-decisions.md) - Infrastructure technology choices
- [07-security-compliance.md](07-security-compliance.md) - Security hardening for production
- [08-quality-attributes.md](08-quality-attributes.md) - Performance and reliability targets

---

**Version History:**
- v1.0 (2025-10-27): Initial comprehensive deployment scenarios documentation

---

**End of Deployment Scenarios Document**
