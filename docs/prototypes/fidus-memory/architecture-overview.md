# Fidus Memory - Standalone Memory Service Architecture

**Status:** Prototype Complete (Phase 1-4)
**Date:** November 2025
**Version:** 2.2.0

## Executive Summary

**Fidus Memory** is a **standalone, privacy-first memory service** that enables any LLM (GPT, Claude, Gemini, local models) to remember user preferences and understand situational context across conversations. While built as part of the Fidus ecosystem, it is designed as an **independent service** that can be installed and used by anyone to add persistent memory to their AI interactions—keeping all data local even when using cloud-based LLMs.

**Key Achievement:** A working memory layer that learns from interactions and maintains contextual awareness, exposing its capabilities through **MCP (Model Context Protocol)** for standardized integration with any MCP-compatible LLM client.

**Key Differentiator:** Run your own memory service locally while using cloud LLMs (OpenAI, Anthropic), ensuring your learned preferences and conversation history never leave your infrastructure.

## Table of Contents

- [Core Concepts](#core-concepts)
- [System Architecture](#system-architecture)
- [Memory Service Components](#memory-service-components)
- [MCP Integration](#mcp-integration)
- [Database Architecture](#database-architecture)
- [Using Fidus Memory with LLMs](#using-fidus-memory-with-llms)
- [Fidus Ecosystem Integration](#fidus-ecosystem-integration)
- [Technology Stack](#technology-stack)
- [Deployment](#deployment)
- [Future Evolution](#future-evolution)

## Core Concepts

### 🧠 The Core Principle: AI-Driven, Schema-Free Learning

**Fidus Memory does NOT use predefined schemas or rigid categorization.**

Unlike traditional systems with fixed fields and categories, Fidus Memory is **truly agnostic**:

- **No predefined preference categories** - The LLM generates categories dynamically based on what it learns
- **No fixed situational factors** - The AI extracts contextually relevant dimensions from each message
- **No rigid data models** - The system adapts to any domain the user discusses
- **LLM is the classifier** - Not rule-based logic or hardcoded templates

**Example of True Agnosticism:**

```
User discussing coffee:
→ AI generates: "food.beverages.coffee", "schedule.morning_routine"

User discussing remote work:
→ AI generates: "work.location.remote", "productivity.environment"

User discussing hobbies:
→ AI generates: "hobbies.outdoor.hiking", "social.weekend_activities"

User discussing anything else:
→ AI generates: appropriate categories specific to that domain
```

**The system doesn't "know" about coffee, work, or hobbies beforehand** - it learns and categorizes organically based on conversation context.

---

### What are Preferences?

**Preferences** are learned user likes, dislikes, and patterns extracted from natural conversation.

**IMPORTANT: AI-Driven, Not Rigid Categories**

Preferences are **not predefined or classified into rigid schemas**. The LLM dynamically:
- Analyzes each message for expressed preferences
- Generates appropriate categories on-the-fly (e.g., "food.beverages", "work.meetings", "hobbies.outdoor")
- Assigns confidence scores based on how explicit the preference is
- Adapts to any domain without predefined templates

**There is no fixed schema** - the system learns organically from whatever the user talks about.

**Examples:**
```
User: "I love coffee, especially in the morning"

Learned Preferences (AI-generated categories):
1. food.beverages.coffee → "loves it" (confidence: 0.95)
2. food.beverages.timing → "prefers morning" (confidence: 0.85)
3. schedule.morning_routine → "includes coffee" (confidence: 0.75)

Note: These categories are examples of what the AI might generate.
      Different LLMs or contexts might produce different categorizations.
```

**Structure:**
```typescript
interface Preference {
  id: string;
  user_id: string;
  category: string;        // AI-generated, not predefined (e.g., "food.beverages")
  subcategory: string;     // AI-generated (e.g., "coffee")
  value: string;           // AI-interpreted (e.g., "loves it")
  confidence: number;      // 0.0 - 1.0 (LLM-assessed)
  context: string;         // How it was learned
  created_at: timestamp;
  updated_at: timestamp;
}
```

**How AI Determines Categories:**

The LLM analyzes context and generates categories that make semantic sense:
```python
# Example LLM decision process (internal)
message = "I prefer working from home on Mondays"

AI Analysis:
→ Domain: work preferences
→ Specific aspect: location preference
→ Temporal factor: day-specific
→ Generated category: "work.location.remote"
→ Generated value: "prefers on Mondays"
→ Confidence: 0.90 (explicit statement)
```

**Why Graph Database (Neo4j)?**
- Preferences form natural relationships (coffee → morning routine → productivity)
- Easy to traverse related preferences
- Flexible schema - **no predefined structure needed**, adapts to any category
- Graph algorithms for discovering patterns across AI-generated categories

### What are Situations?

**Situations** are captured contextual snapshots of conversations, stored as semantic vectors for similarity search.

**IMPORTANT: AI-Driven Context Extraction, Not Predefined Factors**

Situational factors are **not rigidly classified**. The LLM dynamically:
- Analyzes the conversational context to extract relevant factors
- Generates factor names and values that make sense for that specific message
- Adapts to any domain - work, personal, creative, technical, etc.
- Decides which factors are relevant (not all factors appear in every situation)

**There are no mandatory fields or predefined factor lists** - the AI determines what's contextually relevant.

**Examples:**
```
User: "I need coffee before my 9am meeting"

Captured Situation (AI-extracted factors):
{
  message: "I need coffee before my 9am meeting",
  factors: {
    time_of_day: "morning",
    activity: "preparing for meeting",
    mood: "focused",
    social: "alone",
    location: "office",
    environment: "work setting"
  },
  embedding: [0.123, -0.456, ..., 0.789]  // 1536-dim vector
}

Note: These factors are examples. The AI might extract different factors
      based on context (e.g., "urgency: high", "routine: pre-meeting").
```

**Structure:**
```typescript
interface Situation {
  id: string;
  user_id: string;
  message: string;
  factors: Record<string, string>;  // AI-generated key-value pairs (flexible)
  embedding: number[];              // Vector representation
  timestamp: timestamp;
}

// Common factor examples the AI might generate (not exhaustive):
// - time_of_day, location, mood, activity, social, environment
// - urgency, complexity, familiarity, emotional_state, goal
// - weather, season, day_of_week, physical_state
// - Any contextually relevant dimension the LLM identifies
```

**How AI Determines Factors:**

The LLM analyzes messages and extracts contextually relevant dimensions:
```python
# Example LLM decision process (internal)
message = "Feeling stressed about the presentation tomorrow"

AI Analysis:
→ Emotional context detected: mood = "stressed"
→ Future event: activity = "preparing for presentation"
→ Temporal context: time_frame = "tomorrow"
→ Complexity indicator: stress_source = "public speaking"

Generated Factors:
{
  "mood": "stressed",
  "activity": "preparing for presentation",
  "time_frame": "tomorrow",
  "stress_source": "public speaking",
  "goal": "mental preparation"
}

Note: Another message might have completely different factors!
```

**Why Vector Database (Qdrant)?**
- Find similar past situations ("When did user last discuss coffee?")
- Semantic search beats keyword matching (finds "espresso", "caffeine", "morning drink")
- Fast nearest-neighbor search (millions of vectors)
- Filter by user_id and AI-generated factors for precise retrieval

### What are Embeddings?

**Embeddings** are numerical representations of text that capture semantic meaning. Similar concepts have similar vectors.

**How Fidus Uses Embeddings:**

1. **Text → Vector Conversion**
   ```python
   # User message
   message = "I need coffee before my 9am meeting"

   # Convert to 1536-dimensional vector using OpenAI
   embedding = openai.embeddings.create(
       model="text-embedding-3-small",
       input=message
   )
   # Result: [0.123, -0.456, 0.789, ..., 0.321]  # 1536 numbers
   ```

2. **Similarity Search**
   ```python
   # Later, user asks: "What should I drink?"
   query_embedding = embed("What should I drink?")

   # Find similar past situations
   results = qdrant.search(
       query_vector=query_embedding,
       limit=3
   )
   # Returns: [
   #   {message: "I need coffee before 9am meeting", similarity: 0.87},
   #   {message: "Love my morning coffee", similarity: 0.82},
   #   {message: "Coffee helps me focus", similarity: 0.79}
   # ]
   ```

**Why OpenAI Embeddings?**
- **Current:** `text-embedding-3-small` (1536 dimensions)
- High quality semantic understanding
- Consistent across updates
- **Alternative:** Local models (Ollama `nomic-embed-text` with 768 dimensions)

### How Memory Flows Back into Chat

```mermaid
sequenceDiagram
    participant User
    participant LLM as LLM (GPT/Claude)
    participant Memory as Fidus Memory

    User->>LLM: "I love coffee"
    LLM->>Memory: store_preference("food.beverages.coffee", "loves it")
    Memory-->>LLM: ✓ Stored
    LLM->>User: "I've learned you love coffee!"

    Note over User,Memory: Later...

    User->>LLM: "What should I drink?"
    LLM->>Memory: get_preferences(category="food.beverages")
    Memory-->>LLM: ["coffee: loves it"]
    LLM->>Memory: search_situations("what should I drink")
    Memory-->>LLM: ["I need coffee before 9am" (0.87 similarity)]
    LLM->>LLM: Generate contextual response
    LLM->>User: "Given you love coffee, especially in<br/>the morning, how about a nice cup?"
```

**Key Point:** The LLM **actively uses** Memory tools to:
1. Store what it learns during conversation
2. Retrieve preferences before answering
3. Search past situations for context
4. Generate personalized responses

## System Architecture

### High-Level Overview

```mermaid
graph TB
    subgraph "LLM Clients (Any MCP-compatible client)"
        GPT[ChatGPT<br/>with MCP Plugin]
        Claude[Claude Desktop]
        Cursor[Cursor IDE]
        VSC[VS Code<br/>+ Extension]
        Custom[Custom App]
    end

    subgraph "Fidus Memory Service (Standalone)"
        API[REST API<br/>Port 8000]
        MCP[MCP Interface<br/>TCP/SSE]
        Agent[Memory Agent]
    end

    subgraph "Data Storage (Local)"
        Neo4j[(Neo4j<br/>Preferences)]
        Qdrant[(Qdrant<br/>Situations)]
        PG[(PostgreSQL<br/>History)]
        Redis[(Redis<br/>Cache)]
    end

    GPT -->|MCP Protocol| MCP
    Claude -->|MCP Protocol| MCP
    Cursor -->|MCP Protocol| MCP
    VSC -->|MCP Protocol| MCP
    Custom -->|REST API| API

    MCP --> Agent
    API --> Agent

    Agent -->|Direct Access| Neo4j
    Agent -->|Direct Access| Qdrant
    Agent --> PG
    Agent --> Redis

    style GPT fill:#e1f5ff
    style Claude fill:#e1f5ff
    style Cursor fill:#e1f5ff
    style VSC fill:#e1f5ff
    style MCP fill:#ffe1f5
    style Agent fill:#f5e1ff
```

**Key Architectural Decisions:**

1. **Standalone Service** - Can run independently, not tied to Fidus ecosystem
2. **Dual Interface** - REST API for custom apps, MCP for LLM clients
3. **Local Data** - All storage runs locally (privacy-first)
4. **LLM Agnostic** - Works with OpenAI, Anthropic, Google, local models
5. **Multi-User** - Supports multiple users with data isolation

### Component Breakdown

| Component | Purpose | Interface | Port |
|-----------|---------|-----------|------|
| **REST API** | HTTP endpoints for custom applications | HTTP/SSE | 8000 |
| **MCP Interface** | Standardized protocol for LLM clients | TCP/SSE | 8001 |
| **Memory Agent** | Core logic: learning, retrieval, context extraction | Internal | - |
| **Neo4j** | Graph database for preferences | Bolt Protocol | 7687 |
| **Qdrant** | Vector database for situations | gRPC/HTTP | 6333 |
| **PostgreSQL** | Conversation history | PostgreSQL Protocol | 5432 |
| **Redis** | Session cache | Redis Protocol | 6379 |

## Memory Service Components

### 1. Memory Agent (Core Logic)

The Memory Agent is the brain of the service. It **does not use MCP internally** - it directly accesses databases for performance.

```mermaid
graph TB
    subgraph "Memory Agent"
        Entry[Entry Point]
        PL[Preference Learner]
        CE[Context Extractor]
        RG[Response Generator]
    end

    subgraph "Data Access"
        Neo4j[(Neo4j)]
        Qdrant[(Qdrant)]
        PG[(PostgreSQL)]
    end

    Entry --> PL
    Entry --> CE
    Entry --> RG

    PL -->|Direct SQL/Cypher| Neo4j
    CE -->|Direct gRPC| Qdrant
    RG -->|Query both| Neo4j
    RG -->|Query both| Qdrant
    RG -->|History| PG

    style Entry fill:#fff4e1
    style PL fill:#f5e1ff
    style CE fill:#f5e1ff
    style RG fill:#f5e1ff
```

**Why Direct Database Access (not MCP)?**

The Memory Agent uses **direct database access** because:
- **Performance**: ~1ms vs ~10-50ms network call
- **Reliability**: No network failures break core functionality
- **Simplicity**: Standard database drivers (asyncpg, py2neo, qdrant-client)
- **Transaction Support**: Can use database transactions

**MCP is for External Access**: The MCP interface is exposed **externally** so other services and LLM clients can access memory through a standardized protocol.

### 2. REST API Interface

**Purpose:** HTTP endpoints for custom applications (like the Fidus web UI)

**Endpoints:**
```python
POST /memory/chat              # Streaming chat with memory
GET  /memory/preferences       # Get user preferences
POST /memory/preferences       # Store preference
GET  /memory/situations        # Get past situations
POST /memory/situations/search # Semantic search
GET  /memory/config            # Get service configuration
GET  /health                   # Health check
```

**Example Usage:**
```bash
# Chat with memory (streaming)
curl -X POST http://localhost:8000/memory/chat \
  -H 'Content-Type: application/json' \
  -H 'X-User-ID: user-123' \
  -d '{"message": "I love coffee"}' \
  --no-buffer

# Get preferences
curl http://localhost:8000/memory/preferences \
  -H 'X-User-ID: user-123'
```

### 3. MCP Interface

**Purpose:** Standardized protocol for LLM clients (Claude Desktop, ChatGPT plugins, VS Code extensions)

**Why MCP?**
- Standard protocol supported by major LLM clients
- Tool discovery (clients can query available tools)
- Type-safe schemas
- Versioning support

**MCP Tools Exposed:**

```typescript
// Tool 1: Store Preference
store_preference(
  category: string,      // e.g., "food.beverages"
  value: string,         // e.g., "loves coffee"
  confidence: number     // 0.0 - 1.0
) → { preference_id: string }

// Tool 2: Get Preferences
get_preferences(
  category?: string,     // Optional filter
  min_confidence: number = 0.5
) → Preference[]

// Tool 3: Store Situation
store_situation(
  message: string,
  factors: SituationFactors
) → { situation_id: string }

// Tool 4: Search Situations
search_situations(
  query: string,
  limit: number = 5,
  min_similarity: number = 0.7
) → Situation[]
```

**Implementation:**
```python
# packages/api/fidus/mcp_server.py
from mcp import FastMCP

mcp = FastMCP("Fidus Memory", version="1.0.0")

@mcp.tool()
async def store_preference(
    category: str,
    value: str,
    confidence: float,
    user_id: str = None  # Injected from MCP context
) -> dict:
    """Store user preference in memory."""
    pref_id = await memory_agent.store_preference(
        user_id=user_id,
        category=category,
        value=value,
        confidence=confidence
    )
    return {"preference_id": pref_id}

# Run MCP server on TCP/SSE
if __name__ == "__main__":
    mcp.run(transport="sse", host="0.0.0.0", port=8001)
```

### 4. Preference Learner

**Purpose:** Extracts preferences from natural language using AI-driven categorization

**How it Works:**
```python
async def learn_preferences(message: str, user_id: str):
    """
    1. Send message to LLM with structured prompt
    2. LLM DYNAMICALLY GENERATES categories (not from predefined list)
    3. Extract preferences with confidence scores
    4. Store in Neo4j graph database
    5. Update existing preferences if conflicts
    """

    # LLM extraction - NO PREDEFINED CATEGORIES
    prompt = f"""
    Extract user preferences from this message:
    "{message}"

    IMPORTANT: Generate appropriate categories based on the semantic content.
    Do NOT use a predefined list - create categories that make sense.

    Return JSON array of preferences:
    [
      {{
        "category": "...",  // Generate semantically meaningful category
        "value": "...",     // Extract the preference value
        "confidence": 0.0-1.0,
        "reasoning": "Why this preference was extracted"
      }}
    ]
    """

    prefs = await llm.structured_output(prompt, PreferenceSchema)

    # Store in Neo4j (flexible schema accepts any category)
    for pref in prefs:
        await neo4j.merge_preference(
            user_id=user_id,
            category=pref.category,    # AI-generated
            value=pref.value,          # AI-interpreted
            confidence=pref.confidence # AI-assessed
        )
```

**Example:**
```
Input: "I love coffee, especially in the morning"

AI-Extracted Preferences (categories generated by LLM):
[
  {category: "food.beverages.coffee", value: "loves it", confidence: 0.95},
  {category: "schedule.morning_routine", value: "includes coffee", confidence: 0.85}
]

Note: A different LLM or different context might generate:
[
  {category: "drinks.hot.coffee", value: "strong preference", confidence: 0.95},
  {category: "daily_habits.morning", value: "coffee ritual", confidence: 0.80}
]

Both are valid - the system adapts to the LLM's categorization approach.

Stored in Neo4j (no schema constraints):
(:Preference {user_id: "user-123", category: "food.beverages.coffee", value: "loves it"})
  -[:RELATES_TO]->
(:Preference {user_id: "user-123", category: "schedule.morning_routine", value: "includes coffee"})
```

### 5. Context Extractor

**Purpose:** Captures situational factors dynamically and stores as semantic vectors

**How it Works:**
```python
async def extract_context(message: str, user_id: str):
    """
    1. LLM analyzes message and DYNAMICALLY IDENTIFIES relevant contextual factors
    2. Generate embedding vector (1536 dimensions)
    3. Store in Qdrant with AI-extracted metadata
    """

    # Extract factors with LLM - NO PREDEFINED FACTOR LIST
    prompt = f"""
    Analyze this message and extract contextually relevant factors:
    "{message}"

    IMPORTANT: Identify factors that are meaningful for THIS specific message.
    Do NOT force-fit into predefined categories.
    Only include factors that are actually present or inferable.

    Return factors as key-value pairs.
    """

    factors = await llm.extract_factors(message, prompt)
    # → AI generates relevant factors dynamically
    # Example: {time_of_day: "morning", mood: "focused", urgency: "high"}

    # Generate embedding
    embedding = await openai.embeddings.create(
        model="text-embedding-3-small",
        input=f"{message} | {factors}"
    )
    # → [0.123, -0.456, ..., 0.789]  # 1536 numbers

    # Store in Qdrant (accepts any factor structure)
    await qdrant.upsert(
        collection="situations",
        points=[{
            "id": str(uuid4()),
            "vector": embedding.data[0].embedding,
            "payload": {
                "user_id": user_id,
                "message": message,
                "factors": factors,  # AI-generated, flexible structure
                "timestamp": datetime.now().isoformat()
            }
        }]
    )
```

**Example:**
```
Input: "I need coffee before my 9am meeting"

AI-Extracted Factors (dynamically generated):
{
  time_of_day: "morning",
  activity: "preparing for meeting",
  mood: "focused",
  location: "office"
}

Note: Different messages might have completely different factor keys:

Input: "Brainstorming creative ideas on a rainy Sunday"
AI-Extracted Factors:
{
  day_of_week: "Sunday",
  activity: "brainstorming",
  creative_mode: "active",
  weather: "rainy",
  pace: "relaxed"
}

The system doesn't force all situations into the same factor schema!

Generated Embedding:
[0.123, -0.456, 0.789, ..., 0.321]  # 1536 dimensions

Stored in Qdrant with:
- Vector for similarity search
- Original message for context
- AI-generated factors (flexible structure)
- Timestamp for temporal patterns
```

### 6. Response Generator

**Purpose:** Creates contextual responses using preferences and situations

**Status:** ✅ **Implemented and Working**

**Location:** `packages/api/fidus/memory/agent.py` (integrated in Memory Agent)

**How it Works:**
```python
async def generate_response(message: str, user_id: str):
    """
    1. Retrieve relevant preferences from Neo4j
    2. Search similar situations in Qdrant
    3. Get recent conversation history
    4. Build context-aware prompt
    5. Stream response from LLM
    """

    # Get preferences
    preferences = await neo4j.get_preferences(
        user_id=user_id,
        min_confidence=0.5
    )

    # Search similar situations
    query_embedding = await embed(message)
    situations = await qdrant.search(
        vector=query_embedding,
        filter={"user_id": user_id},
        limit=3
    )

    # Get conversation history
    history = await postgres.get_recent_messages(user_id, limit=10)

    # Build context
    context = f"""
    User Preferences:
    {format_preferences(preferences)}

    Similar Past Situations:
    {format_situations(situations)}

    Recent Conversation:
    {format_history(history)}
    """

    # Generate response
    async for chunk in llm.stream(
        system=f"You are a helpful assistant with memory. Use this context:\n{context}",
        messages=[{"role": "user", "content": message}]
    ):
        yield chunk
```

**Integration in Chat Flow:**
```
/memory/chat endpoint
  ↓
Memory Agent receives message
  ↓
1. Store message in PostgreSQL
2. Learn preferences (Preference Learner)
3. Extract context (Context Extractor)
4. Generate response (Response Generator) ← Uses preferences + situations
  ↓
Stream response to user
```

**Example:**
```
User: "What should I drink?"

Response Generator:
1. Fetches preferences: ["coffee: loves it", "morning: prefers coffee"]
2. Searches situations: ["I need coffee before 9am" (0.87 similarity)]
3. Gets history: Previous 10 messages for continuity
4. Generates: "Given that you love coffee and it's morning,
                how about a nice cup of coffee to start your day?"
```

## MCP Integration

### The Challenge: External LLMs Need Learning

**Problem:** When using Claude CLI, VS Code extensions, or other external LLM clients, they don't have built-in Preference Learner or Context Extractor skills. But we want them to:
1. **Learn** from every conversation (Preferences + Situations)
2. **Use** learned memory in responses

**Solution:** **Passive Learning via `get_context()` Tool**

Instead of requiring the LLM to call separate `observe_message()` and `get_context()` tools, we combine them into a **single tool that does both**:

```python
@mcp.tool()
async def get_context(
    query: str,
    user_id: str = None,
    auto_learn: bool = True  # ← Learning happens automatically!
) -> dict:
    """
    Get relevant memory context for a query.

    **Passive Learning:** If auto_learn=True (default), this tool will
    automatically analyze and learn from the query in the background
    while retrieving context.

    Returns:
    {
      "preferences": [...],      # Relevant user preferences
      "situations": [...],       # Similar past situations
      "summary": "...",          # Human-readable summary
      "learned": true            # Whether learning was triggered
    }
    """
    # Start passive learning in background (non-blocking)
    if auto_learn:
        asyncio.create_task(
            _learn_from_query(query, user_id)
        )

    # Active retrieval (immediate)
    preferences = await neo4j.get_preferences(
        user_id=user_id,
        min_confidence=0.5
    )

    situations = await qdrant.search_similar(
        query=query,
        user_id=user_id,
        limit=3
    )

    return {
        "preferences": preferences,
        "situations": situations,
        "summary": _generate_summary(preferences, situations),
        "learned": auto_learn
    }

async def _learn_from_query(query: str, user_id: str):
    """Background task: Learn from query."""
    # Preference Learner
    await preference_learner.learn(query, user_id)

    # Context Extractor
    await context_extractor.extract(query, user_id)
```

**Why This Works:**

✅ **Single Tool Call** - Claude only needs to call `get_context()`, not two separate tools
✅ **Non-Blocking** - Learning happens in background, doesn't slow down response
✅ **Automatic** - Claude doesn't need to "remember" to learn, it happens automatically
✅ **Simple Instructions** - Just tell Claude: "ALWAYS call get_context() before responding"

### How LLMs Access Memory

**Important:** MCP is exposed over **TCP/IP with SSE transport**, not through Docker commands.

```mermaid
graph LR
    subgraph "User's Machine"
        Claude[Claude Desktop]
        MCP_CFG[MCP Config<br/>~/.claude/config]
    end

    subgraph "Memory Service (localhost or remote)"
        MCP_Server[MCP Interface<br/>Port 8001]
        Agent[Memory Agent]
        Neo4j[(Neo4j)]
        Qdrant[(Qdrant)]
    end

    Claude -->|Read config| MCP_CFG
    MCP_CFG -.->|TCP Connection| MCP_Server
    Claude -->|MCP Protocol<br/>over TCP/SSE| MCP_Server
    MCP_Server --> Agent
    Agent --> Neo4j
    Agent --> Qdrant

    style Claude fill:#e1f5ff
    style MCP_Server fill:#ffe1f5
```

### Correct MCP Configuration

**For Claude Desktop:**

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fidus-memory": {
      "transport": "sse",
      "url": "http://localhost:8001/sse",
      "headers": {
        "X-User-ID": "my-user-id"
      }
    }
  }
}
```

**For ChatGPT (with MCP plugin):**
```json
{
  "mcp": {
    "servers": {
      "fidus-memory": {
        "endpoint": "http://localhost:8001/sse",
        "auth": {
          "type": "header",
          "key": "X-User-ID",
          "value": "my-user-id"
        }
      }
    }
  }
}
```

**For VS Code Extension:**
```json
// .vscode/settings.json
{
  "mcp.servers": {
    "fidus-memory": {
      "url": "http://localhost:8001/sse",
      "description": "Local memory service",
      "headers": {
        "X-User-ID": "${USER_ID}"
      }
    }
  }
}
```

**Why This Configuration?**
- **SSE Transport**: Server-Sent Events over HTTP - standard web protocol
- **No Docker knowledge needed**: Client just connects to HTTP endpoint
- **No database details needed**: MCP interface abstracts away Neo4j/Qdrant
- **Simple URL**: Just `http://localhost:8001/sse` or your server's IP

### How External LLMs Use Memory (Practical Example)

**Real-World Use Case: Claude CLI for Software Development**

```mermaid
sequenceDiagram
    participant User
    participant Claude as Claude CLI
    participant MCP as Fidus Memory<br/>(MCP)
    participant Agent as Memory Agent
    participant DBs as Neo4j + Qdrant

    User->>Claude: "I love coffee"

    Note over Claude: Claude calls get_context()<br/>automatically

    Claude->>MCP: get_context("I love coffee", auto_learn=true)

    rect rgb(255, 240, 240)
        Note over MCP,DBs: PASSIVE LEARNING (background)
        MCP->>Agent: _learn_from_query() (async task)
        Agent->>Agent: Preference Learner extracts
        Agent->>Agent: Context Extractor analyzes
        Agent->>DBs: Store preferences + situation
    end

    rect rgb(240, 255, 240)
        Note over MCP,DBs: ACTIVE RETRIEVAL (immediate)
        MCP->>DBs: Get existing preferences + situations
        DBs-->>MCP: Return memory context
    end

    MCP-->>Claude: {preferences: [...], situations: [...], summary: "..."}

    Note over Claude: Claude generates response<br/>using memory context

    Claude->>User: "Great! I'll remember you love coffee."

    Note over User,DBs: Later...

    User->>Claude: "What should I drink right now?"
    Claude->>MCP: get_context("What should I drink?", auto_learn=true)
    MCP-->>Claude: {preferences: ["coffee: loves it"], ...}
    Claude->>User: "Given you love coffee, how about<br/>a nice cup to start your day?"
```

**Available MCP Tools:**

When Claude connects, it discovers these tools:

```json
{
  "tools": [
    {
      "name": "get_context",
      "description": "Get relevant memory context for a query. Automatically learns from the query in background.",
      "parameters": {
        "query": {"type": "string", "required": true},
        "auto_learn": {"type": "boolean", "default": true},
        "include_preferences": {"type": "boolean", "default": true},
        "include_situations": {"type": "boolean", "default": true}
      }
    }
  ]
}
```

**Key Advantage:** Only **ONE tool** to call, learning happens automatically!

### Making LLMs Use Memory Effectively

Since external LLMs (Claude CLI, VS Code extensions) don't have automatic hooks, you need to **instruct them** to use the `get_context()` tool.

**Method 1: Claude Desktop Global Instructions**

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fidus-memory": {
      "transport": "sse",
      "url": "http://localhost:8001/sse",
      "headers": {
        "X-User-ID": "sebastian"
      }
    }
  },
  "globalInstructions": "CRITICAL: You have access to Fidus Memory via MCP.\n\nBEFORE responding to ANY user message:\n1. ALWAYS call get_context(user_message) to retrieve relevant preferences and past context\n2. Use the returned memory to personalize your response\n3. Learning happens automatically in the background\n\nExample:\nUser: 'What should I drink?'\n→ [call get_context('What should I drink?')]\n→ Use returned preferences to answer\n\nNEVER skip calling get_context()!"
}
```

**Method 2: Custom Instructions (User-Side)**

In Claude Settings → Custom Instructions:

```
You have access to Fidus Memory via MCP tools.

MANDATORY WORKFLOW:
Before responding to ANY message, ALWAYS call:
→ get_context(user_message)

This tool will:
✓ Retrieve relevant preferences
✓ Find similar past situations
✓ Automatically learn from the current message (background)

Then use the returned context to personalize your response.

Example:
User: "Help me debug this Python function"
1. Call: get_context("Help me debug this Python function")
2. Receive: {preferences: ["prefers detailed explanations", "uses Python 3.11"], ...}
3. Respond with personalized, detailed Python 3.11 advice
```

**Method 3: Per-Conversation Reminder**

If the above methods don't work, you can manually remind Claude at the start of each conversation:

```
Before we start: Remember to use get_context() for every message to personalize your responses with my preferences and past context. Learning happens automatically.
```

## Database Architecture

### Why Multiple Databases?

Each database serves a specific purpose based on **data access patterns**:

| Database | Data Type | Access Pattern | Why This DB? |
|----------|-----------|----------------|--------------|
| **Neo4j** | Preferences | Graph traversal, relationships | Preferences form natural graphs |
| **Qdrant** | Situations | Similarity search | Find "similar past situations" |
| **PostgreSQL** | Conversations | Time-series queries | ACID compliance for history |
| **Redis** | Sessions | Fast key-value lookup | Sub-millisecond cache access |

### 1. Neo4j - Preference Graph

**Data Model:**
```cypher
// Node: Preference
(:Preference {
  id: "uuid",
  user_id: "user-123",
  category: "food.beverages",
  subcategory: "coffee",
  value: "loves it",
  confidence: 0.95,
  created_at: timestamp(),
  context: "User said 'I love coffee'"
})

// Relationships: RELATES_TO
(:Preference {category: "food.beverages", value: "loves coffee"})
  -[:RELATES_TO {strength: 0.85}]->
(:Preference {category: "schedule.morning_routine", value: "includes coffee"})
  -[:RELATES_TO {strength: 0.75}]->
(:Preference {category: "productivity", value: "coffee helps focus"})
```

**Why Graph?**
- Discover related preferences automatically
- Graph algorithms (PageRank, community detection)
- Flexible schema (easy to add new preference types)

**Example Query:**
```cypher
// Get all coffee-related preferences
MATCH (p:Preference {user_id: $user_id})
WHERE p.category STARTS WITH "food.beverages"
  AND p.confidence >= 0.5
MATCH path = (p)-[:RELATES_TO*1..2]-(related)
RETURN p, related, path
```

### 2. Qdrant - Situation Vectors

**Data Model:**
```python
# Collection: situations
{
  "id": "uuid",
  "vector": [0.123, -0.456, ..., 0.789],  # 1536 dimensions
  "payload": {
    "user_id": "user-123",
    "message": "I need coffee before my 9am meeting",
    "factors": {
      "time_of_day": "morning",
      "activity": "preparing for meeting",
      "mood": "focused"
    },
    "timestamp": "2025-11-05T08:30:00Z"
  }
}
```

**Why Vectors?**
- Semantic search: "coffee" matches "espresso", "caffeine", "morning drink"
- Similarity scores: 0.87 = very similar, 0.42 = somewhat similar
- Fast at scale: Can handle millions of vectors

**Example Query:**
```python
# Find similar situations
results = qdrant.search(
    collection_name="situations",
    query_vector=embed("What should I drink?"),
    query_filter={
        "must": [
            {"key": "user_id", "match": {"value": "user-123"}},
            {"key": "factors.time_of_day", "match": {"value": "morning"}}
        ]
    },
    limit=5
)
# Returns situations about morning drinks, sorted by similarity
```

### 3. PostgreSQL - Conversation History

**Schema:**
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(50) NOT NULL,  -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conv_user ON conversations(user_id);
CREATE INDEX idx_msg_conv ON messages(conversation_id);
CREATE INDEX idx_msg_created ON messages(created_at DESC);
```

**Why PostgreSQL?**
- ACID transactions (reliable message storage)
- Time-series queries (get last N messages)
- JSON support (flexible metadata)
- Battle-tested scalability

### 4. Redis - Session Cache

**Data Model:**
```python
# Key: session:{user_id}
{
  "user_id": "user-123",
  "created_at": "2025-11-05T10:30:00Z",
  "last_active": "2025-11-05T10:45:00Z",
  "cached_preferences": [...]  # Recently accessed
}

# TTL: 1 hour (auto-expire inactive sessions)
```

**Why Redis?**
- Sub-millisecond access (100x faster than disk)
- Automatic expiration (TTL)
- Pub/Sub for real-time updates (future)

## Using Fidus Memory with LLMs

### Setup Guide

#### 1. Install and Run Fidus Memory

```bash
# Clone repository
git clone https://github.com/y-core-engineering/fidus
cd fidus

# Start all services
docker-compose up -d

# Verify services are healthy
docker-compose ps
```

**Services Running:**
- REST API: `http://localhost:8000`
- MCP Interface: `http://localhost:8001/sse`
- Neo4j Browser: `http://localhost:7474`
- Qdrant Dashboard: `http://localhost:6333/dashboard`

#### 2. Configure Your LLM Client

**Claude Desktop:**
```json
{
  "mcpServers": {
    "fidus-memory": {
      "transport": "sse",
      "url": "http://localhost:8001/sse",
      "headers": {
        "X-User-ID": "claude-user-sebastian"
      }
    }
  }
}
```

**ChatGPT (future MCP plugin):**
```json
{
  "mcp": {
    "servers": {
      "fidus-memory": {
        "endpoint": "http://localhost:8001/sse",
        "userId": "chatgpt-user-sebastian"
      }
    }
  }
}
```

**Custom Application:**
```python
import httpx

# Call REST API
async with httpx.AsyncClient() as client:
    response = await client.post(
        "http://localhost:8000/memory/chat",
        json={"message": "I love coffee"},
        headers={"X-User-ID": "app-user-123"}
    )
```

#### 3. Use Memory in Conversations

**Example 1: Learning Preferences**
```
You: "I love coffee, especially espresso"
Claude: [calls store_preference] "I've learned you love coffee,
        with a preference for espresso!"

You: "I'm not a fan of decaf"
Claude: [calls store_preference] "Got it, I'll remember you
        dislike decaf coffee."
```

**Example 2: Recalling Preferences**
```
You: "What's a good drink for me right now?"
Claude: [calls get_preferences(category="food.beverages")]
        [calls search_situations("morning drink")]
        "Given that you love espresso and it's morning,
        how about a double shot? You mentioned before
        that coffee helps you focus for meetings."
```

**Example 3: Contextual Awareness**
```
You: "Feeling stressed about the presentation"
Claude: [calls search_situations("stress")]
        [calls get_preferences(category="relaxation")]
        "I see you're stressed. In the past, you've
        found that taking a short walk helps. Would
        that work now?"
```

### Standalone Use Cases

**1. Personal Memory for Any LLM**

Install Fidus Memory locally, use with:
- ChatGPT (web or app)
- Claude (Desktop or web with MCP plugin)
- Local LLMs (Ollama, LM Studio)

**Benefits:**
- Keep preferences local even when using cloud LLMs
- Cross-LLM memory (learn in ChatGPT, recall in Claude)
- Own your data completely

**2. Team Memory Service**

Run on shared server, team members connect:
```
Team Memory Server: http://memory.team.com:8001/sse

Team Member A: X-User-ID: alice@team.com
Team Member B: X-User-ID: bob@team.com
```

**3. Development Assistant**

Integrate with IDE (VS Code, Cursor):
- Remember project conventions
- Recall past solutions to similar problems
- Track learning about codebase

## Fidus Ecosystem Integration

While Fidus Memory is **standalone**, it's designed to integrate with the broader Fidus ecosystem:

### Current: Standalone Prototype

```
┌──────────────────────────────┐
│   Fidus Memory Service       │
│                              │
│  ┌─────────┐   ┌──────────┐ │
│  │REST API │   │   MCP    │ │
│  └────┬────┘   └────┬─────┘ │
│       │             │        │
│    ┌──┴─────────────┴─────┐ │
│    │   Memory Agent        │ │
│    └──┬──────────┬─────────┘ │
│       │          │            │
│   ┌───▼────┐ ┌──▼──────┐    │
│   │ Neo4j  │ │ Qdrant  │    │
│   └────────┘ └─────────┘    │
└──────────────────────────────┘
```

### Future: Fidus Multi-Domain System

```mermaid
graph TB
    subgraph "Orchestration Layer"
        OS[Orchestration Supervisor<br/>Intent Routing]
    end

    subgraph "Domain Services"
        MS[Memory Service]
        CS[Calendar Service]
        FS[Finance Service]
        TS[Travel Service]
    end

    subgraph "External Clients"
        Web[Fidus Web App]
        Mobile[Mobile App]
        Voice[Voice Assistant]
    end

    Web --> OS
    Mobile --> OS
    Voice --> OS

    OS -->|Route intent| MS
    OS -->|Route intent| CS
    OS -->|Route intent| FS
    OS -->|Route intent| TS

    CS -->|MCP: get_preferences| MS
    FS -->|MCP: get_preferences| MS
    TS -->|MCP: get_preferences| MS

    style MS fill:#ffe1f5
    style CS fill:#e1f5ff
    style FS fill:#e1f5ff
    style TS fill:#e1f5ff
```

**How Other Domains Use Memory:**

```python
# Calendar Service
preferences = await mcp_client.get_preferences(
    category="calendar.meeting_times"
)
# → "prefers morning meetings", "dislikes Friday afternoons"
best_time = schedule_meeting_at_preferred_time(preferences)

# Finance Service
preferences = await mcp_client.get_preferences(
    category="finance.spending"
)
# → "careful with entertainment", "willing to spend on education"
budget = suggest_budget_with_preferences(preferences)

# Travel Service
preferences = await mcp_client.get_preferences(
    category="travel.accommodations"
)
# → "prefers quiet hotels", "dislikes touristy areas"
hotel = recommend_hotel(location, preferences)
```

### Package Structure in Monorepo

Fidus Memory is independently packageable:

```
packages/
├── memory/                    # Standalone Memory Service
│   ├── api/                   # REST + MCP interfaces
│   ├── agent/                 # Core memory logic
│   ├── integrations/          # Database clients
│   ├── tests/
│   ├── Dockerfile
│   ├── pyproject.toml         # Poetry dependencies
│   └── README.md              # Standalone docs
│
├── web/                       # Fidus Web UI (optional)
├── cli/                       # Fidus CLI (optional)
└── orchestration/             # Fidus Orchestrator (future)
```

**Standalone Installation:**
```bash
# Install just memory service
cd packages/memory
poetry install
poetry run uvicorn fidus.main:app

# Or via Docker
docker run -p 8000:8000 -p 8001:8001 fidus/memory:latest
```

## Technology Stack

### Core Services

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **API Framework** | FastAPI 0.115.x | REST endpoints, async support |
| **MCP Server** | FastMCP | MCP protocol implementation |
| **Agent Framework** | LangChain 0.3.x | LLM orchestration |
| **LLM (Cloud)** | OpenAI GPT-4o-mini | Text generation |
| **LLM (Local)** | Ollama (optional) | Privacy-first alternative |
| **Embeddings** | OpenAI text-embedding-3-small | 1536-dim vectors |

### Databases

| Database | Version | Purpose | Data Size |
|----------|---------|---------|-----------|
| **Neo4j** | 5.15.0 | Preferences | ~1MB/1K users |
| **Qdrant** | Latest | Situations | ~6GB/1M messages |
| **PostgreSQL** | 15-alpine | History | ~1GB/1M messages |
| **Redis** | 7-alpine | Cache | ~1MB/1K users (in RAM) |

### Infrastructure

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local orchestration |
| **Poetry** | Python dependencies |
| **pytest** | Testing |
| **mypy** | Type checking |

## Deployment

### Local Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f memory-api

# Stop services
docker-compose down

# Full cleanup (removes data)
docker-compose down -v
```

### Production Deployment

**Option 1: Single Server**
```bash
# On your server
git clone https://github.com/y-core-engineering/fidus
cd fidus
cp .env.memory.example .env.memory
# Edit .env.memory with your configuration
docker-compose up -d
```

**Option 2: Kubernetes**
```yaml
# Helm chart (future)
helm install fidus-memory ./charts/memory \
  --set neo4j.persistence.size=10Gi \
  --set qdrant.persistence.size=50Gi
```

**Option 3: Cloud (AWS/GCP/Azure)**
- Deploy as container service (ECS/Cloud Run/ACI)
- Use managed databases (optional):
  - Amazon Neptune (Neo4j alternative)
  - ElastiCache (Redis)
  - RDS PostgreSQL

### Scaling Considerations

**Current Capacity (Single Instance):**
- 1000 concurrent users
- 10M preferences
- 100M situations (semantic search)
- ~50GB total storage

**Horizontal Scaling (Future):**
- Multiple API instances (load balanced)
- Neo4j cluster (read replicas)
- Qdrant cluster (sharding)
- PostgreSQL replicas (streaming replication)

## Future Evolution

### Short-Term (0-3 months)

1. **Enhanced UI for Preferences**
   - Edit/delete preferences
   - Visualize preference graph
   - Confidence adjustment

2. **Advanced Embeddings**
   - Local embedding models (no OpenAI dependency)
   - Multi-modal embeddings (images, audio)
   - Fine-tuned models for specific domains

3. **Memory Analytics**
   - User memory dashboard
   - Preference trends over time
   - Most referenced situations

### Medium-Term (3-6 months)

4. **Multi-LLM Support**
   - Built-in LLM switching (OpenAI ↔ Anthropic ↔ Local)
   - LLM comparison mode
   - Cost optimization

5. **Advanced Memory Features**
   - Preference confidence decay over time
   - Conflict resolution (contradicting preferences)
   - Memory consolidation (merge similar)

6. **Federated Memory** (Privacy-Preserving)
   - Run locally, share anonymized patterns (opt-in)
   - Collaborative filtering without data sharing
   - Privacy-first recommendations

### Long-Term (6-12 months)

7. **Fidus Ecosystem Integration**
   - Calendar service integration
   - Finance service integration
   - Travel service integration

8. **Enterprise Features**
   - Team memory spaces
   - Role-based access control
   - Audit logging
   - Compliance reports (GDPR, CCPA)

9. **Advanced AI Features**
   - Proactive suggestions based on memory
   - Memory-guided task automation
   - Predictive preference learning

## Conclusion

**Fidus Memory** is a **production-ready, standalone memory service** that brings persistent, contextual memory to any LLM—keeping your data local while using cloud AI.

**Key Achievements:**

✅ **Standalone Service** - Run independently, no Fidus ecosystem required
✅ **LLM Agnostic** - Works with GPT, Claude, Gemini, local models
✅ **Privacy-First** - All data stored locally, even when using cloud LLMs
✅ **MCP Standard** - Industry-standard protocol for LLM integration
✅ **Multi-Database** - Right tool for each job (graph, vector, relational, cache)
✅ **Production Ready** - Type-safe, tested, documented, containerized

**What Makes This Different:**

- **Not just RAG**: Structured preferences + semantic situations + graph relationships
- **Not cloud-dependent**: Run your own memory, control your data
- **Not LLM-specific**: Works with any MCP-compatible client
- **Not Fidus-specific**: Standalone service anyone can use

**Get Started:**

```bash
# 1. Clone and run
git clone https://github.com/y-core-engineering/fidus
cd fidus
docker-compose up -d

# 2. Configure your LLM client
# Add http://localhost:8001/sse to Claude/ChatGPT MCP config

# 3. Start chatting with memory!
```

---

**Document Version:** 2.2.0
**Last Updated:** November 2025
**Authors:** Sebastian Herden, Claude Code
**License:** Sustainable Use License (see LICENSE.md)
**Repository:** https://github.com/y-core-engineering/fidus

**Changelog:**
- **v2.2.0** - Added MCP passive learning strategy via `get_context()` tool. Explained how external LLMs (Claude CLI, VS Code) can use memory without built-in learning skills. Single-tool approach with automatic background learning.
- **v2.1.0** - Emphasized AI-driven, schema-free learning. Clarified that preferences and situations use dynamic categorization, not rigid schemas.
- **v2.0.0** - Complete rewrite: clarified standalone nature, corrected MCP integration, removed misleading naming, positioned as universal service.
- **v1.0.0** - Initial architecture documentation.
