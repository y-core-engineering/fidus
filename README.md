# Fidus - Privacy-First AI Personal Assistant

[![License: Sustainable Use](https://img.shields.io/badge/License-Sustainable%20Use-blue.svg)](LICENSE.md)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js 20+](https://img.shields.io/badge/node.js-20+-green.svg)](https://nodejs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Latest-green.svg)](https://github.com/langchain-ai/langgraph)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

> **A privacy-first, fair-code AI personal assistant that helps you manage your life across calendars, finances, travel, health, and more.**

Fidus is built on a modular, agentic architecture where specialized AI agents (called "Supervisors") handle different aspects of your life. Your data stays local, you maintain full control, and the assistant proactively helps you stay organized.

---

## 🌟 Key Features

### Privacy-First Design
- **Local-first architecture** - Your data stays on your machine
- **End-to-end encryption** - All sensitive data encrypted
- **Zero-knowledge cloud sync** - Optional cloud backup without exposing data
- **GDPR compliant** - Full data subject rights (access, erasure, portability)

### Intelligent Life Management

**📅 Calendar Management**
- Smart scheduling with conflict detection
- Integration with Google Calendar, Outlook, Apple Calendar
- Automatic travel time calculation
- Meeting preparation reminders

**💰 Financial Intelligence**
- Transaction tracking and categorization
- Budget monitoring with alerts
- Bank account sync (Plaid, FinAPI)
- Spending insights and anomaly detection

**✈️ Travel Coordination**
- Trip planning and itinerary management
- Flight tracking and check-in reminders
- Document expiration alerts (passport, visa)
- Weather and travel advisory monitoring

**💬 Communication Assistant**
- Email prioritization and filtering
- Smart message drafting
- Action item extraction
- Response time tracking

**🏥 Health & Wellness**
- Medical appointment tracking
- Medication reminders
- Fitness activity logging
- Health metrics monitoring

**🏠 Smart Home Integration**
- Device control and automation
- Energy usage tracking
- Maintenance task management

**🛒 Shopping & Learning**
- Shopping list management with price tracking
- Course progress tracking
- Study schedule optimization

### Proactive Assistance

Fidus doesn't just respond to commands - it **proactively helps** by:
- Detecting double-bookings and scheduling conflicts
- Alerting about budget overages
- Reminding about upcoming deadlines
- Suggesting optimal times for tasks
- Identifying cost-saving opportunities

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and pnpm 8+
- **Python** 3.11+
- **PostgreSQL** 15+
- **Redis** 7+
- (Optional) **Neo4j** 5+ for relationship graphs

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fidus.git
cd fidus

# Install dependencies (monorepo)
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers (all packages)
pnpm dev
```

This will start:
- **API** - http://localhost:8000 (FastAPI backend)
- **Web** - http://localhost:3000 (Next.js frontend)
- **CLI** - Available via `pnpm --filter @fidus/cli start`

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Package-Specific Setup

#### API Package (Backend)

```bash
cd packages/api

# Install Python dependencies
poetry install

# Run database migrations
poetry run alembic upgrade head

# Start API server
poetry run uvicorn fidus.main:app --reload
```

#### Web Package (Frontend)

```bash
cd packages/web

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

#### CLI Package

```bash
cd packages/cli

# Build CLI
pnpm build

# Run CLI
pnpm start
# or
npx fidus chat
```

### First Steps

1. **Create an account:**
   ```bash
   npx @fidus/cli login
   # Enter email and password
   ```

2. **Connect your calendar:**
   - Visit http://localhost:3000/settings/integrations
   - Click "Connect Google Calendar"
   - Authorize Fidus to access your calendar

3. **Ask Fidus for help:**
   ```bash
   # Via CLI
   npx @fidus/cli chat
   > "What's on my calendar today?"
   > "Schedule a meeting with Sarah tomorrow at 2pm"
   > "How much did I spend on restaurants this month?"

   # Or via Web UI
   # Visit http://localhost:3000
   ```

---

## 🏗️ Architecture

Fidus is built as a **monorepo** with multiple packages:

```
packages/
├── api/       - FastAPI backend (Python + LangGraph)
├── web/       - Next.js frontend (React + TypeScript)
├── cli/       - Command-line interface (Node.js)
└── shared/    - Shared types and utilities (TypeScript)
```

### Multi-Agent Architecture

Built on [LangGraph](https://github.com/langchain-ai/langgraph):

```
User Interface (Web/CLI)
    ↓
FastAPI Backend
    ↓
Orchestration Supervisor (Intent Detection & Routing)
    ↓
Domain Supervisors (Calendar, Finance, Travel, etc.)
    ↓
MCP Tools (External Integrations)
    ↓
Response + Proactive Suggestions
```

### Core Technologies

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Python 3.11+, FastAPI, LangGraph, LangChain |
| **CLI** | Node.js 20+, Commander.js, Inquirer |
| **Database** | PostgreSQL 15+ (primary), Neo4j 5+ (relationships) |
| **Cache/Events** | Redis 7+ (pub/sub + caching) |
| **API Protocol** | Model Context Protocol (MCP) |
| **Monorepo** | pnpm workspaces, Turbo |

See [Architecture Documentation](docs/architecture/README.md) for details.

---

## 📚 Documentation

- **[Architecture Overview](docs/architecture/README.md)** - System design and patterns
- **[Domain Models](docs/domain-model/README.md)** - Complete DDD documentation
- **[API Reference](docs/api/README.md)** - REST API documentation
- **[Setup Guide](docs/guides/setup.md)** - Detailed installation instructions
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Claude.ai Integration](CLAUDE.md)** - Using Fidus with Claude.ai

---

## 🤝 Contributing

We welcome contributions! Fidus is open-source (AGPL-3.0) and built by the community.

**Ways to contribute:**
- 🐛 Report bugs and request features via [Issues](https://github.com/yourusername/fidus/issues)
- 💻 Submit pull requests for bug fixes or new features
- 📖 Improve documentation
- 🌐 Translate to other languages
- ⭐ Star the project to show support

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🗺️ Roadmap

### Community Edition (Open Source)

- [x] Core Supervisors (Calendar, Finance, Travel, Communication, Health, Home, Shopping, Learning)
- [x] Local-first deployment
- [x] Plugin system (MCP)
- [x] Basic integrations (Google, Microsoft, Apple)
- [ ] Voice interface
- [ ] Mobile apps (iOS, Android)
- [ ] Advanced LLM support (Ollama, local models)
- [ ] Plugin marketplace

### Cloud Edition (€29/month)

- [ ] Cloud deployment
- [ ] Multi-device sync
- [ ] Family sharing (up to 5 users)
- [ ] Extended integrations (10 plugins)
- [ ] Advanced analytics
- [ ] Email support

### Enterprise Edition (Custom pricing)

- [ ] SSO integration
- [ ] Custom integrations
- [ ] Compliance features (SOC 2, HIPAA)
- [ ] Priority support + SLA
- [ ] On-premise deployment
- [ ] Multi-tenant admin panel

---

## 💡 Use Cases

### For Individuals
- "Never miss an appointment or deadline"
- "Stay on budget without manual tracking"
- "Get reminded about important tasks proactively"

### For Families
- "Shared calendar with automatic conflict detection"
- "Family budget tracking"
- "Coordinate travel plans together"

### For Small Businesses (Cloud Edition)
- "Team calendar coordination"
- "Expense tracking and approval"
- "Travel management for team"

### For Enterprises (Enterprise Edition)
- "Corporate travel policy enforcement"
- "Compliance-ready audit trails"
- "SSO integration with existing systems"

---

## 📊 Business Model: Open Core

Fidus follows an **Open Core** business model:

| **Feature** | **Community (Free)** | **Cloud (€29/mo)** | **Enterprise (Custom)** |
|------------|---------------------|-------------------|----------------------|
| Core Features | ✅ All | ✅ All | ✅ All |
| Local Deployment | ✅ | ✅ | ✅ |
| Cloud Sync | ❌ | ✅ | ✅ |
| Users | 1 | 5 (family) | Unlimited |
| Integrations | 3 | 10 | Unlimited |
| Support | Community | Email | Priority + SLA |
| SSO | ❌ | ❌ | ✅ |

**Community Edition is 100% free and open-source** - No feature restrictions, no time limits, no "enterprise-only" core functionality.

---

## 🔒 Security & Privacy

### Security Measures

- **Encryption at Rest:** AES-256-GCM for all sensitive data
- **Encryption in Transit:** TLS 1.3 for all network communication
- **Password Hashing:** bcrypt with cost factor 12
- **Authentication:** JWT tokens (short-lived access, long-lived refresh)
- **Authorization:** Role-based access control (RBAC)

### Privacy Commitments

- **No telemetry** in Community Edition
- **Minimal data collection** - Only what's necessary for functionality
- **No third-party tracking**
- **GDPR compliance** - Full data subject rights
- **Data portability** - Export all data in machine-readable format
- **Right to erasure** - Delete all personal data on request

---

## 🛠️ Tech Stack

### Frontend (Web Package)

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand |
| Data Fetching | React Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | Framer Motion |

### Backend (API Package)

| Component | Technology |
|-----------|-----------|
| Language | Python 3.11+ |
| Agent Framework | LangGraph |
| LLM Integration | LangChain |
| API Framework | FastAPI |
| Database ORM | SQLAlchemy 2.0 |
| Authentication | JWT (python-jose) |
| Password Hashing | bcrypt |
| Testing | pytest + pytest-cov |
| Code Quality | ruff + black + mypy |

### CLI Package

| Component | Technology |
|-----------|-----------|
| Language | TypeScript (Node.js 20+) |
| CLI Framework | Commander.js |
| Interactive Prompts | Inquirer |
| Output Formatting | Chalk, Boxen, Table |

### Infrastructure

| Component | Technology |
|-----------|-----------|
| Database | PostgreSQL 15+ |
| Graph DB | Neo4j 5+ (optional) |
| Cache/Events | Redis 7+ |
| Monorepo | pnpm workspaces + Turbo |
| CI/CD | GitHub Actions |
| Containerization | Docker + Docker Compose |

---

## 📜 License

Fidus Community Edition is licensed under the **Sustainable Use License** (fair-code).

**What is fair-code?**
Fair-code is not open-source, but source-available with usage rights:
- ✅ **Source Available** - All code is public and auditable
- ✅ **Self-Hostable** - Deploy anywhere you want
- ✅ **Extensible** - Build your own plugins and modifications
- ✅ **Free for personal and internal business use** (any company size!)
- ⚠️  **Commercial license required** for offering Fidus-as-a-Service

**You CAN:**
- Use Fidus internally in your company (unlimited employees)
- Modify Fidus for your own needs
- Self-host on your infrastructure
- Build custom plugins for internal use

**You CANNOT** (without commercial license):
- Offer Fidus as a hosted service to customers
- Resell Fidus or modified versions
- White-label Fidus for commercial customers

See [LICENSE.md](LICENSE.md) for full details and [Licensing FAQ](docs/licensing/FAQ.md) for common questions.

**Why Sustainable Use License?**
We chose this license (like n8n) to ensure sustainable development while protecting against unfair commercial exploitation. This allows us to maintain Fidus long-term while keeping it free for individual and business internal use.

For commercial licensing: enterprise@fidus.ai

Learn more about fair-code: https://faircode.io

---

## 🌐 Community

- **GitHub Discussions:** [Ask questions, share ideas](https://github.com/yourusername/fidus/discussions)
- **Discord:** [Join our community](https://discord.gg/fidus)
- **Twitter:** [@FidusAI](https://twitter.com/FidusAI)
- **Blog:** [blog.fidus.ai](https://blog.fidus.ai)

---

## 🙏 Acknowledgments

Fidus is built on the shoulders of giants:

- [LangGraph](https://github.com/langchain-ai/langgraph) - Agent framework
- [LangChain](https://github.com/langchain-ai/langchain) - LLM integration
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [PostgreSQL](https://www.postgresql.org/) - Reliable database
- [Redis](https://redis.io/) - Fast caching and pub/sub
- [Neo4j](https://neo4j.com/) - Graph database

Special thanks to all [contributors](https://github.com/yourusername/fidus/graphs/contributors)!

---

## 📞 Support

### Community Edition
- 📖 [Documentation](docs/)
- 💬 [GitHub Discussions](https://github.com/yourusername/fidus/discussions)
- 🐛 [Report Issues](https://github.com/yourusername/fidus/issues)

### Cloud Edition
- 📧 Email: support@fidus.ai
- 📚 [Knowledge Base](https://help.fidus.ai)

### Enterprise Edition
- 📞 Priority Support
- 💼 Dedicated Account Manager
- 🎯 Custom SLA

---

**Built with ❤️ by the Fidus community**

*Privacy-first. User-owned. Proactively helpful.*
