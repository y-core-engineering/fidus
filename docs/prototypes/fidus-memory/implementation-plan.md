# Fidus Memory - Implementation Plan (v2)

**Version:** 2.0
**Date:** 2025-11-03
**Status:** Planning Phase
**Prototype:** Fidus Memory

---

## Executive Summary

**Fidus Memory** is a domain-agnostic conversational learning agent that demonstrates the core learning capabilities of the Fidus system. It learns user preferences implicitly from conversations, stores them with confidence scores, and adapts to situational context.

**Key Value Proposition:**
- Chat with the bot about ANYTHING (domain-agnostic)
- Bot learns your preferences automatically (no explicit questions)
- Bot suggests learned preferences in future conversations
- Situational awareness (context-dependent preferences)
- Complete control: "Delete All Memories" button

**Technology Stack:**
```yaml
Backend:
  - FastAPI (Python)
  - LangGraph (State Machine)
  - LiteLLM (Unified LLM Gateway)
    - Ollama (default: Llama 3.1 8B + nomic-embed-text)
    - OpenAI (optional: GPT-4o)
    - Anthropic (optional: Claude 3.5 Sonnet)

Databases:
  - Neo4j (Preference Graph - permanent)
  - Qdrant (Situational Context - embeddings)
  - PostgreSQL (Conversations - 7 days)
  - Redis (Session Cache)

Frontend:
  - Next.js 14 (App Router)
  - React 18
  - @fidus/ui (Design System)
  - Tailwind CSS

Deployment:
  - Docker Compose
  - Local-first (Privacy)
```

---

## Reusability in Fidus System

**This prototype is architected for seamless integration into the full Fidus system.**

### Core Components → Fidus System Mapping

| Fidus Memory Component | Reuse in Full System | Integration Method |
|------------------------|----------------------|-------------------|
| **Preference Storage (Neo4j)** | User Profile Service (MCP Server) | Expose as MCP tools: `user.get_preferences`, `user.update_preference` |
| **Implicit Learning Service** | Core Learning Engine | Used by all domain supervisors to update confidence |
| **Situational Context (Qdrant)** | Shared Context Service | Domain supervisors query for context-relevant preferences |
| **LiteLLM Integration** | Orchestrator LLM Gateway | Reuse exact configuration and provider abstraction |
| **Preference Extraction** | Generic across all domains | Calendar/Finance/Travel supervisors use same extraction logic |
| **Confidence Scoring** | Proactivity Engine input | Confidence feeds into opportunity scoring |

### Architecture Alignment

**Fidus Memory already implements key Fidus principles:**

✅ **LLM-Driven Logic** - No hardcoded preference rules, LLM extracts from natural conversation
✅ **Schema-less Design** - Neo4j graph with `domain/key/value` works for ANY domain
✅ **Event-Driven** - Preference updates can emit domain events (added in Phase 3)
✅ **Privacy-First** - Local-first with Ollama, optional cloud providers
✅ **MCP-Ready** - Preference Service designed to expose MCP interface (added in Phase 4)

### Migration Path

```mermaid
graph LR
    A[Fidus Memory<br/>Prototype] --> B[User Profile<br/>Bounded Context]
    B --> C[Full Fidus System]

    A1[Preference Storage] -.-> B1[MCP Server]
    A2[Implicit Learning] -.-> B2[Learning Engine]
    A3[Chat Interface] -.-> C1[Multi-modal UI]

    B --> D[Calendar Supervisor]
    B --> E[Finance Supervisor]
    B --> F[Travel Supervisor]

    D & E & F -.MCP.-> B1

    style A fill:#00ff94
    style B fill:#4caf50
    style C fill:#2196f3
```

**No Throwaway Code:** All core logic is designed for production use in the full Fidus system.

---

## Learning Strategy & Architecture

### When Does the System Learn?

Fidus Memory uses an **Intelligent Hybrid Learning Approach** that balances response time with learning quality.

#### Three Learning Modes

**Mode 1: IMMEDIATE LEARNING (Synchronous)**

```mermaid
graph TD
    A[User Message] --> B[Lightweight Intent Detection<br/>less than 50ms]
    B --> C{Is Explicit<br/>Preference?}
    C -->|Yes| D[Learn NOW<br/>Store Preference]
    C -->|No| E[Store in History]
    D --> F[Generate Response<br/>less than 200ms total]
    E --> F

    style A fill:#e3f2fd
    style D fill:#c8e6c9
    style F fill:#fff9c4
```

**Trigger:** Explicit preference statements
**Timing:** During conversation (<200ms)
**Use Case:** "I always drink cappuccino in morning"

---

**Mode 2: DEFERRED LEARNING (Asynchronous)**

```mermaid
graph TD
    A[Conversation Ends<br/>10min timeout or bye] --> B[Enqueue Background Job]
    B --> C[Analyze Entire Conversation]
    C --> D[Extract Implicit Preferences]
    C --> E[Update Confidence Scores]
    C --> F[Detect Behavioral Patterns]
    D --> G[Store Results]
    E --> G
    F --> G

    style A fill:#e3f2fd
    style B fill:#fff9c4
    style G fill:#c8e6c9
```

**Trigger:** Conversation end (10min timeout or bye)
**Timing:** Background job after conversation
**Use Case:** Implicit patterns, confidence updates

---

**Mode 3: PATTERN RECOGNITION (Event-Triggered)**

```mermaid
graph TD
    A[Message Count % 20 == 0] --> D[Quick Pattern Check]
    B[Context Change > 50%] --> E[Deep Pattern Analysis]
    C[Preference Rejected 3x] --> F[Revalidate Preference]

    D --> G[Detect Keywords<br/>Time Patterns<br/>Sentiment]
    E --> H[LLM Analysis<br/>Situational Patterns<br/>Conflicts]
    F --> I[LLM Re-evaluation<br/>Keep, Modify, or Delete]

    style A fill:#e3f2fd
    style B fill:#e3f2fd
    style C fill:#e3f2fd
    style G fill:#c8e6c9
    style H fill:#c8e6c9
    style I fill:#c8e6c9
```

**Triggers:**
- Every 20 messages: Quick pattern check
- Context change (>50% different): Deep analysis
- Confidence drift (3+ rejections): Re-validate

**Examples:**
- User orders cappuccino 5x between 7-10 AM → Create habit: `morning_coffee_preference`
- Preference rejected 3 times in new context → Trigger re-validation
- Monday behavior ≠ Sunday behavior → Discover day-of-week patterns

---

### Learning Orchestration

```python
# packages/api/fidus/memory/learning_orchestrator.py

class LearningOrchestrator:
    """Orchestrates different learning strategies based on triggers."""

    def __init__(
        self,
        llm_client,
        preference_store,
        conversation_store,
        background_jobs
    ):
        self.llm = llm_client
        self.preferences = preference_store
        self.conversations = conversation_store
        self.jobs = background_jobs

    # ═══════════════════════════════════════════════════════
    # MODE 1: IMMEDIATE LEARNING (Synchronous)
    # ═══════════════════════════════════════════════════════

    async def on_message(self, user_id: str, message: str) -> dict:
        """Called for every user message. Returns response immediately."""

        # 1. Lightweight Intent Detection (<50ms)
        is_explicit = self._is_explicit_preference(message)

        if is_explicit:
            # SOFORT: Extract and learn
            preference = await self._extract_preference(message)
            await self.preferences.store(user_id, preference)

            # User feedback
            response = f"Got it! I'll remember: {preference.summary}"
        else:
            # Normal conversation
            response = await self._generate_response(user_id, message)

        # 2. Store in conversation history (always)
        await self.conversations.append(user_id, message, response)

        # 3. Check triggers for pattern recognition
        await self._check_pattern_triggers(user_id)

        return {"response": response}

    def _is_explicit_preference(self, message: str) -> bool:
        """Fast heuristic check for explicit preferences."""

        # Regex patterns for explicit statements
        patterns = [
            r"\b(I always|I never|I prefer|I like|I love|I hate)\b",
            r"\b(immer|nie|bevorzuge|mag|liebe)\b",  # German
            r"\b(every time|whenever)\b",
        ]

        for pattern in patterns:
            if re.search(pattern, message, re.IGNORECASE):
                return True

        return False

    async def _extract_preference(self, message: str) -> Preference:
        """Extract preference from explicit statement."""

        # Lightweight LLM call with structured output
        prompt = f"""Extract preference from: "{message}"

Return JSON:
{{
  "domain": "coffee|food|work|general",
  "key": "descriptive_key",
  "value": "preference_value",
  "confidence": 0.8
}}"""

        result = await self.llm.completion(
            prompt=prompt,
            response_format={"type": "json_object"},
            max_tokens=100  # Keep it fast
        )

        return Preference.from_dict(json.loads(result.content))

    # ═══════════════════════════════════════════════════════
    # MODE 2: DEFERRED LEARNING (Asynchronous)
    # ═══════════════════════════════════════════════════════

    async def on_conversation_end(self, user_id: str):
        """Called when conversation ends (timeout or explicit bye)."""

        # Background job - user is not waiting
        self.jobs.enqueue(
            'analyze_conversation',
            user_id=user_id,
            priority='high'  # User just left, analyze soon
        )

    # ═══════════════════════════════════════════════════════
    # MODE 3: PATTERN RECOGNITION (Event-Triggered)
    # ═══════════════════════════════════════════════════════

    async def _check_pattern_triggers(self, user_id: str):
        """Check if pattern analysis should be triggered."""

        message_count = await self.conversations.count(user_id)

        # TRIGGER 1: Every 20 messages
        if message_count % 20 == 0:
            self.jobs.enqueue(
                'quick_pattern_check',
                user_id=user_id,
                priority='low'
            )

        # TRIGGER 2: Context change detection
        current_context = await self._get_current_context(user_id)
        last_context = await self._get_last_analyzed_context(user_id)

        if self._context_similarity(current_context, last_context) < 0.5:
            # Significant context change!
            self.jobs.enqueue(
                'deep_pattern_analysis',
                user_id=user_id,
                context=current_context,
                priority='medium'
            )

    async def on_preference_rejected(
        self,
        user_id: str,
        preference_id: str
    ):
        """Called when user rejects a suggestion."""

        preference = await self.preferences.get(preference_id)
        preference.rejection_count += 1
        await self.preferences.update(preference)

        # TRIGGER 3: Confidence drift
        if preference.rejection_count >= 3:
            self.jobs.enqueue(
                'revalidate_preference',
                preference_id=preference_id,
                priority='high'  # User keeps rejecting, urgent!
            )
```

---

### Background Job Handlers

```python
# packages/api/fidus/memory/background_jobs.py

from rq import Queue
from redis import Redis

# Use Redis Queue (RQ) for background jobs
redis_conn = Redis(host='localhost', port=6379)
job_queue = Queue('fidus-memory', connection=redis_conn)

# ═══════════════════════════════════════════════════════
# JOB 1: Conversation Analysis (after conversation ends)
# ═══════════════════════════════════════════════════════

@job_queue.job(timeout=60)
def analyze_conversation(user_id: str):
    """Analyze entire conversation for implicit preferences."""

    # Get conversation history
    conversation = get_conversation_history(user_id)

    # LLM analysis for implicit preferences
    implicit_prefs = extract_implicit_preferences(conversation)

    # Store preferences
    for pref in implicit_prefs:
        store_preference(user_id, pref, confidence=0.5)  # Lower confidence

    # Update confidence scores
    update_confidence_scores(user_id, conversation)

    print(f"✅ Analyzed conversation for {user_id}: {len(implicit_prefs)} preferences")

# ═══════════════════════════════════════════════════════
# JOB 2: Quick Pattern Check (every 20 messages)
# ═══════════════════════════════════════════════════════

@job_queue.job(timeout=30)
def quick_pattern_check(user_id: str):
    """Quick pattern recognition without heavy LLM."""

    recent_messages = get_recent_messages(user_id, limit=20)

    # Lightweight pattern detection
    patterns = {
        'repeated_words': detect_repeated_keywords(recent_messages),
        'time_patterns': detect_time_patterns(recent_messages),
        'sentiment': analyze_sentiment(recent_messages)
    }

    # Store patterns
    update_user_patterns(user_id, patterns)

    print(f"✅ Quick pattern check for {user_id}")

# ═══════════════════════════════════════════════════════
# JOB 3: Deep Pattern Analysis (context change)
# ═══════════════════════════════════════════════════════

@job_queue.job(timeout=300)
def deep_pattern_analysis(user_id: str, context: dict):
    """Deep LLM-based pattern analysis for new context."""

    # Get all messages in this context
    messages = get_messages_for_context(user_id, context)

    # Heavy LLM analysis
    prompt = f"""Analyze these {len(messages)} messages for behavioral patterns:

Context: {context}

Messages:
{format_messages(messages)}

Find:
1. Repeated preferences
2. Situational patterns
3. Time-based behaviors
4. Conflicting preferences

Return JSON."""

    patterns = llm_extract_patterns(prompt)

    # Store insights
    store_patterns(user_id, context, patterns)

    print(f"✅ Deep analysis for {user_id} in context {context}")

# ═══════════════════════════════════════════════════════
# JOB 4: Preference Re-validation (confidence drift)
# ═══════════════════════════════════════════════════════

@job_queue.job(timeout=120)
def revalidate_preference(preference_id: str):
    """Re-validate preference after multiple rejections."""

    preference = get_preference(preference_id)
    user_id = preference.user_id

    # Check if preference is still valid
    recent_behavior = get_recent_behavior(user_id, preference.domain)

    # LLM re-evaluation
    prompt = f"""The user has rejected this preference 3 times:

Preference: {preference.key} = {preference.value}
Recent behavior: {recent_behavior}

Should we:
1. Keep it (adjust confidence)
2. Modify it (new value)
3. Delete it (no longer valid)

Return JSON with decision and reasoning."""

    decision = llm_decide(prompt)

    if decision['action'] == 'delete':
        delete_preference(preference_id)
    elif decision['action'] == 'modify':
        update_preference(preference_id, decision['new_value'])
    else:
        adjust_confidence(preference_id, decision['new_confidence'])

    print(f"✅ Revalidated preference {preference_id}: {decision['action']}")
```

---

### Conversation End Detection

```python
# packages/api/fidus/memory/conversation_tracker.py

import asyncio
from datetime import datetime, timedelta

class ConversationTracker:
    """Tracks active conversations and detects when they end."""

    def __init__(self, timeout_minutes: int = 10):
        self.timeout = timedelta(minutes=timeout_minutes)
        self.active_conversations = {}  # user_id -> last_activity
        self.orchestrator = None

    async def on_message(self, user_id: str):
        """Update last activity timestamp."""

        self.active_conversations[user_id] = datetime.now()

        # Start timeout watcher if not running
        if not hasattr(self, '_watcher_task'):
            self._watcher_task = asyncio.create_task(self._watch_timeouts())

    async def on_explicit_end(self, user_id: str):
        """User explicitly ended conversation (said bye)."""

        if user_id in self.active_conversations:
            del self.active_conversations[user_id]

            # Trigger conversation analysis
            await self.orchestrator.on_conversation_end(user_id)

    async def _watch_timeouts(self):
        """Background task that checks for conversation timeouts."""

        while True:
            await asyncio.sleep(60)  # Check every minute

            now = datetime.now()
            timed_out_users = []

            for user_id, last_activity in self.active_conversations.items():
                if now - last_activity > self.timeout:
                    timed_out_users.append(user_id)

            # Process timeouts
            for user_id in timed_out_users:
                del self.active_conversations[user_id]
                await self.orchestrator.on_conversation_end(user_id)
                print(f"⏰ Conversation timeout for {user_id}")
```

---

### Phase Implementation Strategy

**Phase 1-2: Immediate Learning Only**
- Implement `LearningOrchestrator.on_message()` with explicit preference detection
- No background jobs yet (keep it simple)
- Store preferences immediately when detected

**Phase 3: Add Deferred Learning**
- Implement conversation end detection
- Add background job queue (Redis + RQ)
- Implement `analyze_conversation()` job
- Add context change detection

**Phase 4: Full Pattern Recognition**
- Add all trigger types (20 messages, context change, confidence drift)
- Implement all background jobs
- Add monitoring and job status UI

---

## Implementation Phases (Vertical Slices)

**Principle:** Each phase delivers a working, demonstrable end-to-end feature.

---

### Phase 1: Basic Chat with In-Memory Learning

**Deliverable:** Working chat where bot learns and suggests preferences (session-only, resets on reload)

**What You Can Demo:**
- Chat about any topic
- Bot extracts preferences from conversation
- Bot suggests previously mentioned preferences
- All happens in-memory (no database yet)

**Example Interaction:**
```
User: "I'm working on a project today"
Bot: "What kind of project are you working on?"
User: "It's a coding project. I prefer to code in the morning"
Bot: "Got it! Morning coding sessions work best for you."

[Later in same session]
User: "I need to focus"
Bot: "Based on what you told me, you prefer morning coding.
     Would you like to plan that for tomorrow morning?"
```

**Technical Stack:**
- Frontend: Next.js + @fidus/ui (ChatInterface, MessageBubble)
- Backend: FastAPI + Python dict (in-memory)
- LLM: LiteLLM → Ollama Llama 3.1 8B
- No databases yet

**Implementation Tasks:**

**1.1 Create @fidus/ui Components**
- [ ] `MessageBubble` - Display user/AI messages
- [ ] `ChatInterface` - Chat layout with input
- [ ] Tests for both components

**1.2 Create Minimal Backend**
```python
# packages/api/fidus/memory/simple_agent.py

class InMemoryAgent:
    """Simple chat agent with in-memory preference learning."""

    def __init__(self, llm_client):
        self.llm = llm_client
        self.preferences = {}  # {domain.key: {value, confidence}}
        self.conversation_history = []

    async def chat(self, user_message: str) -> str:
        # 1. Add to history
        self.conversation_history.append({"role": "user", "content": user_message})

        # 2. Extract preferences from message
        extracted = await self._extract_preferences(user_message)
        self._update_preferences(extracted)

        # 3. Build system prompt with learned preferences
        system_prompt = self._build_prompt()

        # 4. Generate response
        response = await self.llm.chat([
            {"role": "system", "content": system_prompt},
            *self.conversation_history
        ])

        self.conversation_history.append({"role": "assistant", "content": response})
        return response

    async def _extract_preferences(self, text: str) -> list:
        """Use LLM to extract preferences from text."""
        prompt = f"""Extract user preferences from this text.

        Text: "{text}"

        Return JSON array of preferences:
        [{{"domain": "...", "key": "...", "value": "...", "confidence": 0.0-1.0}}]

        If no preferences found, return empty array [].
        """

        result = await self.llm.chat([{"role": "user", "content": prompt}])
        return json.loads(result)

    def _update_preferences(self, extracted: list):
        """Update in-memory preference dict."""
        for pref in extracted:
            key = f"{pref['domain']}.{pref['key']}"
            self.preferences[key] = {
                "value": pref['value'],
                "confidence": pref['confidence']
            }

    def _build_prompt(self) -> str:
        """Build system prompt with learned preferences."""
        base = "You are Fidus Memory, a conversational AI that learns user preferences.\n\n"

        if self.preferences:
            base += "What you've learned about the user:\n"
            for key, pref in self.preferences.items():
                base += f"- {key}: {pref['value']} (confidence: {pref['confidence']:.0%})\n"

        return base
```

**1.3 Connect Frontend to Backend**
- [ ] Next.js API route: `/api/memory/chat`
- [ ] React hook: `useChatAgent()`
- [ ] Page: `/fidus-memory`

**1.4 Setup LiteLLM + Ollama**
```yaml
# docker-compose.yml (minimal for Phase 1)

version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    ports:
      - "4000:4000"
    volumes:
      - ./litellm_config.yaml:/app/config.yaml

  api:
    build: ./packages/api
    ports:
      - "8000:8000"
    environment:
      - LITELLM_URL=http://litellm:4000
    depends_on:
      - litellm
      - ollama

  web:
    build: ./packages/web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - api

volumes:
  ollama_data:
```

**Success Criteria:**
- ✅ User can chat with bot
- ✅ Bot extracts at least 1 preference from conversation
- ✅ Bot mentions learned preference in subsequent messages
- ✅ Chat interface is responsive and usable

**Time Estimate:** 3-4 days

---

### Phase 2: Persistent Preferences with Neo4j

**Deliverable:** Preferences persist across sessions, confidence scores update on reinforcement/rejection

**What You Can Demo:**
- Preferences survive page reload
- View all learned preferences in sidebar
- Confidence increases when user accepts suggestion
- Confidence decreases when user rejects suggestion
- "Delete All Memories" button works

**New Capabilities vs Phase 1:**
- ✅ Preferences stored in Neo4j (permanent)
- ✅ Confidence scoring with reinforcement logic
- ✅ Preference viewer UI
- ✅ User-controlled deletion

**Technical Additions:**
- Database: Neo4j (graph)
- Backend: Implicit Learning Service with Neo4j client
- Frontend: PreferenceViewer component + ConfidenceIndicator

**Implementation Tasks:**

**2.1 Neo4j Schema & Client**
```python
# packages/api/fidus/infrastructure/neo4j_client.py

class Neo4jPreferenceStore:
    """Neo4j client for preference storage."""

    def __init__(self, uri: str, user: str, password: str):
        self.driver = neo4j.GraphDatabase.driver(uri, auth=(user, password))

    async def create_preference(self, user_id: str, pref: dict) -> str:
        """Create new preference node."""
        query = """
        MATCH (u:User {id: $user_id})
        CREATE (p:Preference {
            id: randomUUID(),
            domain: $domain,
            key: $key,
            value: $value,
            confidence: $confidence,
            learned_at: datetime(),
            last_reinforced: datetime(),
            reinforcement_count: 1,
            rejection_count: 0
        })
        CREATE (u)-[:HAS_PREFERENCE]->(p)
        RETURN p.id AS id
        """

        result = await self.driver.execute_query(
            query,
            user_id=user_id,
            domain=pref['domain'],
            key=pref['key'],
            value=pref['value'],
            confidence=pref['confidence']
        )
        return result[0]['id']

    async def reinforce_preference(self, pref_id: str) -> None:
        """Increase confidence on acceptance."""
        query = """
        MATCH (p:Preference {id: $pref_id})
        SET p.confidence = CASE
            WHEN p.confidence + 0.1 > 0.95 THEN 0.95
            ELSE p.confidence + 0.1
        END,
        p.last_reinforced = datetime(),
        p.reinforcement_count = p.reinforcement_count + 1
        """
        await self.driver.execute_query(query, pref_id=pref_id)

    async def weaken_preference(self, pref_id: str) -> None:
        """Decrease confidence on rejection."""
        query = """
        MATCH (p:Preference {id: $pref_id})
        SET p.confidence = CASE
            WHEN p.confidence - 0.15 < 0 THEN 0
            ELSE p.confidence - 0.15
        END,
        p.rejection_count = p.rejection_count + 1
        """
        await self.driver.execute_query(query, pref_id=pref_id)

    async def get_all_preferences(self, user_id: str) -> list:
        """Get all preferences for user."""
        query = """
        MATCH (u:User {id: $user_id})-[:HAS_PREFERENCE]->(p:Preference)
        RETURN p
        ORDER BY p.confidence DESC, p.last_reinforced DESC
        """
        result = await self.driver.execute_query(query, user_id=user_id)
        return [dict(record['p']) for record in result]

    async def delete_all_preferences(self, user_id: str) -> None:
        """Delete all user preferences."""
        query = """
        MATCH (u:User {id: $user_id})-[:HAS_PREFERENCE]->(p:Preference)
        DETACH DELETE p
        """
        await self.driver.execute_query(query, user_id=user_id)
```

**2.2 Update Agent to Use Neo4j**
```python
# packages/api/fidus/memory/persistent_agent.py

class PersistentAgent:
    """Chat agent with Neo4j preference persistence."""

    def __init__(self, llm_client, neo4j_store):
        self.llm = llm_client
        self.store = neo4j_store

    async def chat(self, user_id: str, message: str) -> dict:
        """Process message and return response with suggestions."""

        # 1. Load existing preferences
        preferences = await self.store.get_all_preferences(user_id)

        # 2. Build system prompt with preferences
        system_prompt = self._build_prompt(preferences)

        # 3. Generate response
        response = await self.llm.chat([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ])

        # 4. Extract new preferences
        extracted = await self._extract_preferences(message)

        # 5. Store new preferences
        for pref in extracted:
            await self.store.create_preference(user_id, pref)

        # 6. Identify suggestions in response
        suggestions = self._identify_suggestions(response, preferences)

        return {
            "response": response,
            "suggestions": suggestions,
            "learned_preferences": extracted
        }

    async def accept_suggestion(self, user_id: str, pref_id: str):
        """User accepted suggestion - reinforce preference."""
        await self.store.reinforce_preference(pref_id)

    async def reject_suggestion(self, user_id: str, pref_id: str):
        """User rejected suggestion - weaken preference."""
        await self.store.weaken_preference(pref_id)
```

**2.3 Preference Viewer UI**
```typescript
// packages/web/app/fidus-memory/components/preference-viewer.tsx

import { Stack, DetailCard, ConfidenceIndicator, EmptyCard, Divider } from '@fidus/ui';

export function PreferenceViewer({ preferences }: { preferences: Preference[] }) {
  if (preferences.length === 0) {
    return (
      <EmptyCard
        title="No Preferences Yet"
        message="Start chatting to teach Fidus Memory about your preferences"
      />
    );
  }

  // Group by domain
  const grouped = groupBy(preferences, 'domain');

  return (
    <Stack spacing="lg">
      <div>
        <h2>Learned Preferences</h2>
        <p>{preferences.length} preferences across {Object.keys(grouped).length} domains</p>
      </div>

      <Divider />

      {Object.entries(grouped).map(([domain, prefs]) => (
        <Stack key={domain} spacing="md">
          <h3>{domain}</h3>

          {prefs.map(pref => (
            <DetailCard key={pref.id} title={pref.key} description={pref.value}>
              <ConfidenceIndicator
                confidence={pref.confidence}
                variant="detailed"
                size="sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Learned {formatDate(pref.learned_at)} •
                Reinforced {pref.reinforcement_count}x
              </p>
            </DetailCard>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
```

**2.4 Add ConfidenceIndicator Component to @fidus/ui**
- [ ] Create `ConfidenceIndicator` component
- [ ] Support `minimal` and `detailed` variants
- [ ] Color-coded by confidence level
- [ ] Add tests

**Success Criteria:**
- ✅ Preferences persist after page reload
- ✅ User can view all learned preferences grouped by domain
- ✅ Accepting suggestion increases confidence (+0.1)
- ✅ Rejecting suggestion decreases confidence (-0.15)
- ✅ "Delete All Memories" clears all preferences

**Time Estimate:** 4-5 days

---

### Phase 3: Dynamic Situational Context with Qdrant

**Deliverable:** Bot learns context-dependent preferences with dynamically discovered context factors

**What You Can Demo:**
- Same preference has different values in different situations
- Bot discovers relevant context factors organically
- Context factors are not predefined - LLM extracts them from conversation
- Embedding-based similarity finds preferences for similar situations

**Example Interaction:**
```
Week 1:
User: "I always have cappuccino in the morning before work"
LLM Extracts: {time_of_day: "morning", activity: "pre_work"}
→ Stored with context

Week 2:
User: "I already had 3 coffees today, but I need another one"
LLM Discovers NEW factor: {coffees_consumed: 3}
→ System learns new dimension organically!

Week 3:
User: "Coffee?"
Current Context: {time_of_day: "afternoon", coffees_consumed: 2}
→ System finds similar contexts (afternoon + multiple coffees)
→ Suggests based on context similarity
```

**Key Innovation: Schema-less Context**
- No fixed "temporal", "spatial" dimensions
- LLM extracts ANY context factors mentioned or implied
- New factors can emerge: "first_coffee_of_day", "post_workout", "deadline_pressure"
- Context dimensions discovered organically through conversation

**New Capabilities vs Phase 2:**
- ✅ Dynamic context extraction (LLM-based, no fixed schema)
- ✅ Situational embeddings in Qdrant
- ✅ Context-aware preference retrieval
- ✅ Multiple contexts per preference
- ✅ Semantic context similarity matching

**Technical Additions:**
- Database: Qdrant (vector search)
- Embedding Model: nomic-embed-text via Ollama (768-dim vectors)
- Backend Services:
  - DynamicContextExtractor (LLM-based factor discovery)
  - SystemContextProvider (time, date, device context)
  - ContextMerger (combines LLM + system context)
  - ContextEmbeddingService (generates embeddings)
  - ContextStorageService (Neo4j + Qdrant)
  - ContextRetrievalService (similarity search)
  - ContextAwareAgent (integrates context into agent logic)

**Architecture References:**
- [Conceptual Architecture](../../architecture/08-situational-context-architecture.md)
- [Solution Architecture](../../solution-architecture/14-situational-context.md)

---

#### Implementation Tasks

**Task 3.1: Setup Qdrant + Embedding Model**

**Goal:** Add vector database and embedding model to infrastructure

**3.1.1 Add Qdrant to Docker Compose:**
```yaml
# docker-compose.yml

services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: fidus-qdrant
    ports:
      - "6333:6333"
      - "6334:6334"  # GRPC port
    volumes:
      - qdrant_data:/qdrant/storage
    networks:
      - fidus-network

volumes:
  qdrant_data:
    driver: local

networks:
  fidus-network:
    driver: bridge
```

**3.1.2 Pull Embedding Model:**
```bash
# Pull nomic-embed-text via Ollama
docker exec fidus-ollama ollama pull nomic-embed-text
```

**3.1.3 Create Qdrant Collection:**
```python
# packages/api/fidus/memory/context/setup_qdrant.py

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

async def setup_qdrant_collection():
    """Initialize Qdrant collection for situations."""
    client = QdrantClient(host="localhost", port=6333)

    # Create collection with 768-dim vectors (nomic-embed-text)
    client.create_collection(
        collection_name="situations",
        vectors_config=VectorParams(
            size=768,
            distance=Distance.COSINE
        )
    )

    print("✅ Qdrant collection 'situations' created")

if __name__ == "__main__":
    import asyncio
    asyncio.run(setup_qdrant_collection())
```

**Time:** 0.5 days

---

**Task 3.2: Dynamic Context Extraction**

**Goal:** LLM extracts context factors from conversation

**3.2.1 Implement DynamicContextExtractor:**
```python
# packages/api/fidus/memory/context/extractor.py

from typing import Dict, Any
from litellm import acompletion
import json

class DynamicContextExtractor:
    """Extracts context factors from conversation using LLM."""

    EXTRACTION_PROMPT = """Extract all relevant situational context factors from this conversation.

Conversation: "{conversation}"

Extract ANY context factors that might influence user preferences.

Common categories (NOT exhaustive - invent new factors if relevant):
- Temporal: time_of_day, day_of_week, is_weekend, season
- Spatial: location_type, is_familiar, indoors
- Social: alone, with_people, group_size
- Activity: current_activity, intensity, duration
- Cognitive: energy_level, stress_level, mood, focus_required
- Physical: weather, temperature, noise_level

IMPORTANT: You can create NEW factor names!
Examples: "coffee_already_consumed", "first_task_of_day", "deadline_pressure"

Return as JSON object. Only include factors clearly stated or implied.
Use snake_case for keys.

Example output:
{{
  "time_of_day": "morning",
  "activity": "working",
  "energy_level": "low",
  "first_coffee": false
}}
"""

    def __init__(self, litellm_model: str = "ollama/llama3.2"):
        self.model = litellm_model

    async def extract(self, conversation_snippet: str) -> Dict[str, Any]:
        """Extract context factors from conversation."""

        prompt = self.EXTRACTION_PROMPT.format(conversation=conversation_snippet)

        response = await acompletion(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a context extraction assistant. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        extracted = json.loads(response.choices[0].message.content)

        # Validate snake_case keys
        for key in extracted.keys():
            if not key.islower() or not key.replace("_", "").isalnum():
                raise ValueError(f"Invalid factor key: {key}. Must be snake_case.")

        return extracted
```

**3.2.2 Add Unit Tests:**
```python
# packages/api/tests/memory/context/test_extractor.py

import pytest
from fidus.memory.context.extractor import DynamicContextExtractor

@pytest.mark.asyncio
async def test_extract_temporal_context():
    """Should extract time-related factors."""
    extractor = DynamicContextExtractor()

    conversation = "I always drink cappuccino in the morning before work"

    result = await extractor.extract(conversation)

    assert "time_of_day" in result
    assert result["time_of_day"] == "morning"
    assert "activity" in result
    assert result["activity"] == "pre_work"

@pytest.mark.asyncio
async def test_extract_custom_factors():
    """Should extract novel context factors."""
    extractor = DynamicContextExtractor()

    conversation = "I already had 3 coffees today, but I need another one"

    result = await extractor.extract(conversation)

    # LLM should invent new factor
    assert "coffees_consumed" in result or "coffee_count" in result
    assert isinstance(result.get("coffees_consumed", result.get("coffee_count")), int)

@pytest.mark.asyncio
async def test_returns_empty_dict_for_no_context():
    """Should return empty dict if no context factors found."""
    extractor = DynamicContextExtractor()

    conversation = "Hello"

    result = await extractor.extract(conversation)

    assert isinstance(result, dict)
```

**Time:** 1 day

---

**Task 3.3: System Context Provider**

**Goal:** Provide system-level context (time, device, etc.)

**3.3.1 Implement SystemContextProvider:**
```python
# packages/api/fidus/memory/context/system_provider.py

from datetime import datetime
from typing import Dict, Any

class SystemContextProvider:
    """Provides system-level context factors."""

    def get_current_context(self) -> Dict[str, Any]:
        """Get current system context."""
        now = datetime.now()

        return {
            "time_of_day": self._classify_time(now.hour),
            "day_of_week": now.strftime("%A").lower(),
            "hour": now.hour,
            "is_weekend": now.weekday() >= 5,
            "is_work_hours": 9 <= now.hour < 17 and now.weekday() < 5,
            "season": self._get_season(now.month)
        }

    def _classify_time(self, hour: int) -> str:
        """Classify hour into time of day."""
        if 5 <= hour < 12:
            return "morning"
        elif 12 <= hour < 17:
            return "afternoon"
        elif 17 <= hour < 21:
            return "evening"
        else:
            return "night"

    def _get_season(self, month: int) -> str:
        """Get season from month (Northern Hemisphere)."""
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        else:
            return "autumn"
```

**3.3.2 Add Unit Tests:**
```python
# packages/api/tests/memory/context/test_system_provider.py

import pytest
from fidus.memory.context.system_provider import SystemContextProvider
from unittest.mock import patch
from datetime import datetime

def test_get_current_context():
    """Should return system context."""
    provider = SystemContextProvider()

    with patch('fidus.memory.context.system_provider.datetime') as mock_datetime:
        mock_datetime.now.return_value = datetime(2025, 11, 3, 10, 30)  # Monday morning

        context = provider.get_current_context()

        assert context["time_of_day"] == "morning"
        assert context["day_of_week"] == "monday"
        assert context["hour"] == 10
        assert context["is_weekend"] is False
        assert context["is_work_hours"] is True
        assert context["season"] == "autumn"

def test_classify_time_morning():
    """Should classify 9 AM as morning."""
    provider = SystemContextProvider()
    assert provider._classify_time(9) == "morning"

def test_classify_time_afternoon():
    """Should classify 2 PM as afternoon."""
    provider = SystemContextProvider()
    assert provider._classify_time(14) == "afternoon"

def test_weekend_detection():
    """Should detect Saturday as weekend."""
    provider = SystemContextProvider()

    with patch('fidus.memory.context.system_provider.datetime') as mock_datetime:
        mock_datetime.now.return_value = datetime(2025, 11, 8, 10, 0)  # Saturday

        context = provider.get_current_context()

        assert context["is_weekend"] is True
        assert context["is_work_hours"] is False
```

**Time:** 0.5 days

---

**Task 3.4: Context Merger**

**Goal:** Combine LLM-extracted and system context

**3.4.1 Implement ContextMerger:**
```python
# packages/api/fidus/memory/context/merger.py

from typing import Dict, Any

class ContextMerger:
    """Merges context from multiple sources."""

    def merge(
        self,
        llm_context: Dict[str, Any],
        system_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Merge contexts, preferring LLM-extracted values."""

        # Start with system context as base
        merged = system_context.copy()

        # Override with LLM context (more specific)
        for key, value in llm_context.items():
            if key in merged:
                # LLM extracted it explicitly - trust that over system
                merged[key] = value
            else:
                # New factor from LLM
                merged[key] = value

        return merged

    def format_for_display(self, context: Dict[str, Any]) -> str:
        """Format context as human-readable string."""
        parts = []
        for key, value in context.items():
            # Convert snake_case to Title Case
            label = key.replace("_", " ").title()
            parts.append(f"{label}: {value}")

        return ", ".join(parts)
```

**3.4.2 Add Unit Tests:**
```python
# packages/api/tests/memory/context/test_merger.py

import pytest
from fidus.memory.context.merger import ContextMerger

def test_merge_contexts():
    """Should merge LLM and system contexts."""
    merger = ContextMerger()

    system = {
        "time_of_day": "morning",
        "is_weekend": False,
        "hour": 10
    }

    llm = {
        "time_of_day": "early_morning",  # More specific
        "activity": "commuting",  # New factor
        "stress_level": "high"  # New factor
    }

    result = merger.merge(llm, system)

    # LLM context should override
    assert result["time_of_day"] == "early_morning"

    # New factors should be added
    assert result["activity"] == "commuting"
    assert result["stress_level"] == "high"

    # System context should be preserved
    assert result["is_weekend"] is False
    assert result["hour"] == 10

def test_format_for_display():
    """Should format context as readable string."""
    merger = ContextMerger()

    context = {
        "time_of_day": "morning",
        "activity": "working",
        "stress_level": "low"
    }

    result = merger.format_for_display(context)

    assert "Time Of Day: morning" in result
    assert "Activity: working" in result
    assert "Stress Level: low" in result
```

**Time:** 0.5 days

---

**Task 3.5: Context Embedding Service**

**Goal:** Generate embeddings for context via nomic-embed-text

**3.5.1 Implement ContextEmbeddingService:**
```python
# packages/api/fidus/memory/context/embedding_service.py

from typing import Dict, Any, List
from litellm import aembedding

class ContextEmbeddingService:
    """Generates embeddings for situational contexts."""

    def __init__(self, embedding_model: str = "ollama/nomic-embed-text"):
        self.embedding_model = embedding_model

    def format_context_as_text(self, context: Dict[str, Any]) -> str:
        """Convert context dict to text for embedding."""

        # Sort keys for consistency
        sorted_keys = sorted(context.keys())

        parts = []
        for key in sorted_keys:
            value = context[key]
            # Convert snake_case to natural language
            label = key.replace("_", " ")
            parts.append(f"{label}: {value}")

        return "\n".join(parts)

    async def generate_embedding(self, context: Dict[str, Any]) -> List[float]:
        """Generate 768-dim embedding for context."""

        text = self.format_context_as_text(context)

        response = await aembedding(
            model=self.embedding_model,
            input=[text]
        )

        embedding = response.data[0]["embedding"]

        # Validate dimensionality
        if len(embedding) != 768:
            raise ValueError(f"Expected 768-dim embedding, got {len(embedding)}")

        return embedding
```

**3.5.2 Add Unit Tests:**
```python
# packages/api/tests/memory/context/test_embedding_service.py

import pytest
from fidus.memory.context.embedding_service import ContextEmbeddingService

def test_format_context_as_text():
    """Should format context as text."""
    service = ContextEmbeddingService()

    context = {
        "time_of_day": "morning",
        "activity": "working",
        "stress_level": "low"
    }

    text = service.format_context_as_text(context)

    # Should be sorted and formatted
    assert "activity: working" in text
    assert "stress level: low" in text
    assert "time of day: morning" in text

@pytest.mark.asyncio
async def test_generate_embedding():
    """Should generate 768-dim embedding."""
    service = ContextEmbeddingService()

    context = {
        "time_of_day": "morning",
        "activity": "working"
    }

    embedding = await service.generate_embedding(context)

    # nomic-embed-text produces 768-dim vectors
    assert len(embedding) == 768
    assert all(isinstance(x, float) for x in embedding)

@pytest.mark.asyncio
async def test_similar_contexts_have_similar_embeddings():
    """Should produce similar embeddings for similar contexts."""
    service = ContextEmbeddingService()

    context1 = {"time_of_day": "morning", "activity": "working"}
    context2 = {"time_of_day": "early_morning", "activity": "working"}
    context3 = {"time_of_day": "night", "activity": "sleeping"}

    emb1 = await service.generate_embedding(context1)
    emb2 = await service.generate_embedding(context2)
    emb3 = await service.generate_embedding(context3)

    # Cosine similarity
    def cosine(a, b):
        import numpy as np
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

    # Similar contexts should have high similarity
    assert cosine(emb1, emb2) > 0.8

    # Different contexts should have lower similarity
    assert cosine(emb1, emb3) < 0.6
```

**Time:** 1 day

---

**Task 3.6: Context Storage Service**

**Goal:** Store contexts in Neo4j + Qdrant

**3.6.1 Update Neo4j Schema:**
```cypher
// Add Situation node type

CREATE CONSTRAINT situation_id_unique IF NOT EXISTS
FOR (s:Situation) REQUIRE s.situation_id IS UNIQUE;

// Situation node structure:
// (:Situation {
//   situation_id: string,
//   user_id: string,
//   embedding_id: string,  // Points to Qdrant
//   factors: json,
//   description: string,
//   created_at: datetime
// })

// Relationship: Preference applies in Situation
// (:Preference)-[:IN_SITUATION {
//   added_at: datetime,
//   confidence_at_time: float
// }]->(:Situation)
```

**3.6.2 Implement ContextStorageService:**
```python
# packages/api/fidus/memory/context/storage_service.py

from typing import Dict, Any
from uuid import uuid4
from datetime import datetime
from qdrant_client import QdrantClient
from neo4j import AsyncGraphDatabase

class ContextStorageService:
    """Stores situational contexts in Neo4j + Qdrant."""

    def __init__(self, neo4j_driver, qdrant_client: QdrantClient):
        self.neo4j = neo4j_driver
        self.qdrant = qdrant_client

    async def store_situation(
        self,
        user_id: str,
        factors: Dict[str, Any],
        embedding: list[float],
        description: str
    ) -> str:
        """Store situation in both Neo4j and Qdrant."""

        situation_id = str(uuid4())
        embedding_id = str(uuid4())

        # 1. Store embedding in Qdrant
        self.qdrant.upsert(
            collection_name="situations",
            points=[{
                "id": embedding_id,
                "vector": embedding,
                "payload": {
                    "user_id": user_id,
                    "situation_id": situation_id,
                    "factors": factors
                }
            }]
        )

        # 2. Store situation in Neo4j
        async with self.neo4j.session() as session:
            await session.run(
                """
                CREATE (s:Situation {
                    situation_id: $situation_id,
                    user_id: $user_id,
                    embedding_id: $embedding_id,
                    factors: $factors,
                    description: $description,
                    created_at: datetime()
                })
                """,
                situation_id=situation_id,
                user_id=user_id,
                embedding_id=embedding_id,
                factors=factors,
                description=description
            )

        return situation_id

    async def link_preference_to_situation(
        self,
        preference_id: str,
        situation_id: str,
        confidence: float
    ):
        """Create relationship between preference and situation."""
        async with self.neo4j.session() as session:
            await session.run(
                """
                MATCH (p:Preference {preference_id: $preference_id})
                MATCH (s:Situation {situation_id: $situation_id})
                CREATE (p)-[:IN_SITUATION {
                    added_at: datetime(),
                    confidence_at_time: $confidence
                }]->(s)
                """,
                preference_id=preference_id,
                situation_id=situation_id,
                confidence=confidence
            )
```

**3.6.3 Add Integration Tests:**
```python
# packages/api/tests/memory/context/test_storage_service.py

import pytest
from fidus.memory.context.storage_service import ContextStorageService
from qdrant_client import QdrantClient

@pytest.mark.asyncio
async def test_store_situation(neo4j_driver, qdrant_client):
    """Should store situation in both databases."""
    service = ContextStorageService(neo4j_driver, qdrant_client)

    factors = {
        "time_of_day": "morning",
        "activity": "working"
    }
    embedding = [0.1] * 768  # Mock embedding
    description = "Morning work context"

    situation_id = await service.store_situation(
        user_id="user123",
        factors=factors,
        embedding=embedding,
        description=description
    )

    # Verify in Neo4j
    async with neo4j_driver.session() as session:
        result = await session.run(
            "MATCH (s:Situation {situation_id: $sid}) RETURN s",
            sid=situation_id
        )
        record = await result.single()
        assert record is not None
        assert record["s"]["user_id"] == "user123"
        assert record["s"]["description"] == description

    # Verify in Qdrant
    points = qdrant_client.scroll(
        collection_name="situations",
        scroll_filter={"must": [{"key": "situation_id", "match": {"value": situation_id}}]},
        limit=1
    )
    assert len(points[0]) == 1
    assert points[0][0].payload["user_id"] == "user123"

@pytest.mark.asyncio
async def test_link_preference_to_situation(neo4j_driver, qdrant_client):
    """Should create relationship between preference and situation."""
    service = ContextStorageService(neo4j_driver, qdrant_client)

    # Setup
    preference_id = "pref123"
    situation_id = "sit456"

    # Create nodes first
    async with neo4j_driver.session() as session:
        await session.run(
            """
            CREATE (p:Preference {preference_id: $pid, domain: 'coffee', key: 'type', value: 'cappuccino'})
            CREATE (s:Situation {situation_id: $sid, user_id: 'user123'})
            """,
            pid=preference_id,
            sid=situation_id
        )

    # Link them
    await service.link_preference_to_situation(preference_id, situation_id, 0.8)

    # Verify relationship
    async with neo4j_driver.session() as session:
        result = await session.run(
            """
            MATCH (p:Preference {preference_id: $pid})-[r:IN_SITUATION]->(s:Situation {situation_id: $sid})
            RETURN r
            """,
            pid=preference_id,
            sid=situation_id
        )
        record = await result.single()
        assert record is not None
        assert record["r"]["confidence_at_time"] == 0.8
```

**Time:** 1.5 days

---

**Task 3.7: Context Retrieval Service**

**Goal:** Find similar situations using vector search

**3.7.1 Implement ContextRetrievalService:**
```python
# packages/api/fidus/memory/context/retrieval_service.py

from typing import Dict, Any, List, Tuple
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

class ContextRetrievalService:
    """Retrieves similar situations from Qdrant."""

    def __init__(self, qdrant_client: QdrantClient):
        self.qdrant = qdrant_client

    async def find_similar_situations(
        self,
        user_id: str,
        current_embedding: List[float],
        min_similarity: float = 0.7,
        limit: int = 5
    ) -> List[Tuple[str, float]]:
        """
        Find situations similar to current context.

        Returns: List of (situation_id, similarity_score) tuples
        """

        # Search Qdrant with user_id filter
        results = self.qdrant.search(
            collection_name="situations",
            query_vector=current_embedding,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="user_id",
                        match=MatchValue(value=user_id)
                    )
                ]
            ),
            limit=limit,
            score_threshold=min_similarity
        )

        return [
            (hit.payload["situation_id"], hit.score)
            for hit in results
        ]

    async def get_situation_factors(
        self,
        situation_id: str
    ) -> Dict[str, Any]:
        """Retrieve factors for a specific situation."""

        results = self.qdrant.scroll(
            collection_name="situations",
            scroll_filter=Filter(
                must=[
                    FieldCondition(
                        key="situation_id",
                        match=MatchValue(value=situation_id)
                    )
                ]
            ),
            limit=1
        )

        if not results[0]:
            raise ValueError(f"Situation {situation_id} not found")

        return results[0][0].payload["factors"]
```

**3.7.2 Add Unit Tests:**
```python
# packages/api/tests/memory/context/test_retrieval_service.py

import pytest
from fidus.memory.context.retrieval_service import ContextRetrievalService
from qdrant_client import QdrantClient

@pytest.mark.asyncio
async def test_find_similar_situations(qdrant_client):
    """Should find similar situations."""
    service = ContextRetrievalService(qdrant_client)

    # Setup: Add situations to Qdrant
    qdrant_client.upsert(
        collection_name="situations",
        points=[
            {
                "id": "emb1",
                "vector": [0.9] * 768,  # Very similar
                "payload": {"user_id": "user123", "situation_id": "sit1"}
            },
            {
                "id": "emb2",
                "vector": [0.8] * 768,  # Similar
                "payload": {"user_id": "user123", "situation_id": "sit2"}
            },
            {
                "id": "emb3",
                "vector": [-0.9] * 768,  # Very different
                "payload": {"user_id": "user123", "situation_id": "sit3"}
            }
        ]
    )

    # Query with similar vector
    current_embedding = [0.85] * 768

    results = await service.find_similar_situations(
        user_id="user123",
        current_embedding=current_embedding,
        min_similarity=0.7,
        limit=5
    )

    # Should find sit1 and sit2 (not sit3)
    assert len(results) == 2
    assert results[0][0] in ["sit1", "sit2"]
    assert all(score >= 0.7 for _, score in results)

@pytest.mark.asyncio
async def test_filters_by_user_id(qdrant_client):
    """Should only return situations for specified user."""
    service = ContextRetrievalService(qdrant_client)

    # Setup: Add situations for different users
    qdrant_client.upsert(
        collection_name="situations",
        points=[
            {
                "id": "emb1",
                "vector": [0.9] * 768,
                "payload": {"user_id": "user123", "situation_id": "sit1"}
            },
            {
                "id": "emb2",
                "vector": [0.9] * 768,  # Same vector
                "payload": {"user_id": "user456", "situation_id": "sit2"}
            }
        ]
    )

    results = await service.find_similar_situations(
        user_id="user123",
        current_embedding=[0.9] * 768,
        min_similarity=0.7,
        limit=5
    )

    # Should only find sit1
    assert len(results) == 1
    assert results[0][0] == "sit1"
```

**Time:** 1 day

---

**Task 3.8: Update Agent for Context-Awareness**

**Goal:** Integrate contextual retrieval into agent logic

**3.8.1 Implement ContextAwareAgent:**
```python
# packages/api/fidus/memory/context_aware_agent.py

from typing import Dict, Any, List
from fidus.memory.context.extractor import DynamicContextExtractor
from fidus.memory.context.system_provider import SystemContextProvider
from fidus.memory.context.merger import ContextMerger
from fidus.memory.context.embedding_service import ContextEmbeddingService
from fidus.memory.context.storage_service import ContextStorageService
from fidus.memory.context.retrieval_service import ContextRetrievalService
from fidus.memory.neo4j_client import Neo4jClient

class ContextAwareAgent:
    """Agent with situational awareness."""

    def __init__(
        self,
        extractor: DynamicContextExtractor,
        system_provider: SystemContextProvider,
        merger: ContextMerger,
        embedding_service: ContextEmbeddingService,
        storage_service: ContextStorageService,
        retrieval_service: ContextRetrievalService,
        neo4j_client: Neo4jClient
    ):
        self.extractor = extractor
        self.system_provider = system_provider
        self.merger = merger
        self.embedding_service = embedding_service
        self.storage_service = storage_service
        self.retrieval_service = retrieval_service
        self.neo4j = neo4j_client

    async def get_relevant_preferences(
        self,
        user_id: str,
        conversation_snippet: str,
        min_confidence: float = 0.3
    ) -> List[Dict[str, Any]]:
        """Get preferences relevant to current context."""

        # 1. Extract context from conversation
        llm_context = await self.extractor.extract(conversation_snippet)

        # 2. Get system context
        system_context = self.system_provider.get_current_context()

        # 3. Merge contexts
        merged_context = self.merger.merge(llm_context, system_context)

        # 4. Generate embedding for current context
        current_embedding = await self.embedding_service.generate_embedding(merged_context)

        # 5. Find similar situations
        similar_situations = await self.retrieval_service.find_similar_situations(
            user_id=user_id,
            current_embedding=current_embedding,
            min_similarity=0.7,
            limit=5
        )

        if not similar_situations:
            return []

        # 6. Query Neo4j for preferences in those situations
        situation_ids = [sit_id for sit_id, _ in similar_situations]

        preferences = await self.neo4j.get_preferences_for_situations(
            user_id=user_id,
            situation_ids=situation_ids,
            min_confidence=min_confidence
        )

        return preferences

    async def record_preference_with_context(
        self,
        user_id: str,
        domain: str,
        key: str,
        value: Any,
        conversation_snippet: str,
        confidence: float = 0.75
    ) -> str:
        """Record a preference with situational context."""

        # 1. Extract and merge context
        llm_context = await self.extractor.extract(conversation_snippet)
        system_context = self.system_provider.get_current_context()
        merged_context = self.merger.merge(llm_context, system_context)

        # 2. Generate embedding
        embedding = await self.embedding_service.generate_embedding(merged_context)

        # 3. Generate description
        description = self.merger.format_for_display(merged_context)

        # 4. Store situation
        situation_id = await self.storage_service.store_situation(
            user_id=user_id,
            factors=merged_context,
            embedding=embedding,
            description=description
        )

        # 5. Store preference in Neo4j
        preference_id = await self.neo4j.create_preference(
            user_id=user_id,
            domain=domain,
            key=key,
            value=value,
            confidence=confidence,
            source="conversation"
        )

        # 6. Link preference to situation
        await self.storage_service.link_preference_to_situation(
            preference_id=preference_id,
            situation_id=situation_id,
            confidence=confidence
        )

        return preference_id
```

**3.8.2 Add Integration Tests:**
```python
# packages/api/tests/memory/test_context_aware_agent.py

import pytest
from fidus.memory.context_aware_agent import ContextAwareAgent

@pytest.mark.asyncio
async def test_get_relevant_preferences_for_morning_context(
    context_aware_agent,
    neo4j_client,
    qdrant_client
):
    """Should retrieve morning preferences when context is morning."""

    # Setup: Create morning situation with preference
    user_id = "user123"

    # Record a morning coffee preference
    await context_aware_agent.record_preference_with_context(
        user_id=user_id,
        domain="coffee",
        key="type",
        value="cappuccino",
        conversation_snippet="I always drink cappuccino in the morning",
        confidence=0.8
    )

    # Query in morning context
    preferences = await context_aware_agent.get_relevant_preferences(
        user_id=user_id,
        conversation_snippet="Coffee?",  # Will extract morning context from system
        min_confidence=0.3
    )

    # Should find the cappuccino preference
    assert len(preferences) > 0
    assert any(p["key"] == "type" and p["value"] == "cappuccino" for p in preferences)

@pytest.mark.asyncio
async def test_different_preferences_for_different_contexts(
    context_aware_agent
):
    """Should retrieve different preferences for different contexts."""

    user_id = "user123"

    # Record morning preference
    await context_aware_agent.record_preference_with_context(
        user_id=user_id,
        domain="coffee",
        key="type",
        value="cappuccino",
        conversation_snippet="I drink cappuccino in the morning before work",
        confidence=0.8
    )

    # Record afternoon preference
    await context_aware_agent.record_preference_with_context(
        user_id=user_id,
        domain="coffee",
        key="type",
        value="espresso",
        conversation_snippet="I prefer espresso in the afternoon when I'm tired",
        confidence=0.8
    )

    # Query in morning context
    morning_prefs = await context_aware_agent.get_relevant_preferences(
        user_id=user_id,
        conversation_snippet="Coffee? It's 9 AM",
        min_confidence=0.3
    )

    # Query in afternoon context
    afternoon_prefs = await context_aware_agent.get_relevant_preferences(
        user_id=user_id,
        conversation_snippet="Coffee? It's 3 PM and I'm exhausted",
        min_confidence=0.3
    )

    # Should get different preferences
    morning_coffee = next((p for p in morning_prefs if p["domain"] == "coffee"), None)
    afternoon_coffee = next((p for p in afternoon_prefs if p["domain"] == "coffee"), None)

    assert morning_coffee["value"] == "cappuccino"
    assert afternoon_coffee["value"] == "espresso"
```

**Time:** 1 day

---

#### Success Criteria

Phase 3 is complete when:

- ✅ **Dynamic Context Extraction:**
  - LLM extracts context factors from conversation
  - New factors can be discovered (not predefined schema)
  - Factors are validated (snake_case, reasonable values)

- ✅ **Context Storage:**
  - Situations stored in Neo4j with factors
  - Embeddings stored in Qdrant (768-dim vectors)
  - Preferences linked to multiple situations

- ✅ **Context Retrieval:**
  - Vector similarity search finds similar situations (>70% cosine similarity)
  - User isolation enforced (user_id filter)
  - Top-K similar situations retrieved

- ✅ **Context-Aware Suggestions:**
  - Bot suggests different preferences based on context
  - Morning vs afternoon preferences distinguished
  - Weekday vs weekend preferences distinguished
  - User can explicitly state situational preferences ("I like X when Y")

- ✅ **Testing:**
  - Unit tests for all services (>80% coverage)
  - Integration tests for context-aware agent
  - Example: "Coffee?" returns cappuccino in morning, espresso in afternoon

**Time Estimate:** 5-6 days

**Breakdown:**
- Task 3.1 (Qdrant setup): 0.5 days
- Task 3.2 (Dynamic extraction): 1 day
- Task 3.3 (System provider): 0.5 days
- Task 3.4 (Context merger): 0.5 days
- Task 3.5 (Embedding service): 1 day
- Task 3.6 (Storage service): 1.5 days
- Task 3.7 (Retrieval service): 1 day
- Task 3.8 (Context-aware agent): 1 day

---

### Phase 4: MCP Interface & Multi-User Support

**Deliverable:** Fidus Memory exposed as MCP server, ready for integration into full Fidus system

**What You Can Demo:**
- External tools can query preferences via MCP
- Multiple users with isolated data
- Basic authentication (user ID)
- Preference Service acts as standalone MCP server

**New Capabilities vs Phase 3:**
- ✅ MCP server interface
- ✅ Multi-user support (tenant isolation)
- ✅ PostgreSQL for conversation history
- ✅ Redis for session caching
- ✅ Ready for integration with domain supervisors

**Technical Additions:**
- MCP Server implementation
- PostgreSQL (conversation storage)
- Redis (caching)
- User authentication (simple for prototype)

**Implementation Tasks:**

**4.1 MCP Server Interface**
```python
# packages/api/fidus/memory/mcp_server.py

from mcp import MCPServer, Tool, Resource

class PreferenceMCPServer(MCPServer):
    """MCP server for preference service."""

    def __init__(self, preference_service):
        super().__init__(name="fidus-memory", version="1.0.0")
        self.service = preference_service

        self.register_tools()
        self.register_resources()

    def register_tools(self):
        """Register MCP tools."""

        @self.tool("user.get_preferences")
        async def get_preferences(user_id: str, domain: str = None, min_confidence: float = 0.3):
            """Get user preferences, optionally filtered by domain."""
            preferences = await self.service.get_preferences(
                user_id=user_id,
                domain=domain,
                min_confidence=min_confidence
            )
            return {"preferences": preferences}

        @self.tool("user.record_interaction")
        async def record_interaction(user_id: str, preference_id: str, accepted: bool):
            """Record user interaction with preference suggestion."""
            if accepted:
                await self.service.reinforce_preference(preference_id)
            else:
                await self.service.weaken_preference(preference_id)

            return {"status": "recorded"}

        @self.tool("user.learn_preference")
        async def learn_preference(user_id: str, domain: str, key: str, value: str, context: dict = None):
            """Manually add a preference."""
            pref_id = await self.service.create_preference(
                user_id=user_id,
                preference={
                    "domain": domain,
                    "key": key,
                    "value": value,
                    "confidence": 0.5
                },
                context=context or {}
            )
            return {"preference_id": pref_id}

    def register_resources(self):
        """Register MCP resources."""

        @self.resource("user://{user_id}/preferences")
        async def user_preferences(user_id: str):
            """Get all preferences for a user."""
            preferences = await self.service.get_all_preferences(user_id)
            return {"preferences": preferences}
```

**4.2 Multi-User Support**
```python
# packages/api/fidus/api/middleware/auth.py

class SimpleAuthMiddleware:
    """Simple user authentication for prototype."""

    async def __call__(self, request: Request, call_next):
        # For prototype: user_id in header or create guest user
        user_id = request.headers.get("X-User-ID")

        if not user_id:
            user_id = f"guest-{uuid.uuid4()}"
            # Store in session

        request.state.user_id = user_id

        response = await call_next(request)
        response.headers["X-User-ID"] = user_id

        return response
```

**4.3 Conversation Storage (PostgreSQL)**
```python
# packages/api/fidus/infrastructure/postgres_client.py

class ConversationStore:
    """Store conversation history in PostgreSQL."""

    async def save_message(self, user_id: str, role: str, content: str, metadata: dict = None):
        """Save message to conversation history."""
        query = """
        INSERT INTO conversations (id, user_id, role, content, metadata, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
        """
        await self.pool.execute(query, user_id, role, content, json.dumps(metadata or {}))

    async def get_conversation_history(self, user_id: str, limit: int = 50):
        """Get recent conversation history."""
        query = """
        SELECT role, content, created_at
        FROM conversations
        WHERE user_id = $1
        AND created_at > NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
        LIMIT $2
        """
        rows = await self.pool.fetch(query, user_id, limit)
        return [dict(row) for row in reversed(rows)]

    async def cleanup_old_conversations(self):
        """Delete conversations older than 7 days."""
        query = """
        DELETE FROM conversations
        WHERE created_at < NOW() - INTERVAL '7 days'
        """
        await self.pool.execute(query)
```

**4.4 Redis Session Cache**
```python
# packages/api/fidus/infrastructure/redis_client.py

class SessionCache:
    """Redis cache for session data."""

    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)

    async def cache_preferences(self, user_id: str, preferences: list, ttl: int = 300):
        """Cache user preferences (5 min TTL)."""
        key = f"prefs:{user_id}"
        await self.redis.setex(key, ttl, json.dumps(preferences))

    async def get_cached_preferences(self, user_id: str) -> list | None:
        """Get cached preferences."""
        key = f"prefs:{user_id}"
        data = await self.redis.get(key)
        return json.loads(data) if data else None

    async def invalidate_preferences(self, user_id: str):
        """Invalidate preference cache."""
        key = f"prefs:{user_id}"
        await self.redis.delete(key)
```

**Success Criteria:**
- ✅ MCP server responds to tool calls
- ✅ Multiple users can use system simultaneously with isolated data
- ✅ Conversation history persists for 7 days
- ✅ Preference queries cached for performance
- ✅ External system can integrate via MCP

**Time Estimate:** 4-5 days

---

## Success Metrics

### Prototype Goals

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Learning Accuracy** | >80% preferences correctly extracted | Manual review of 50 conversations |
| **Confidence Calibration** | Suggestions at >0.5 confidence accepted >70% | Track acceptance rate per confidence level |
| **Context Accuracy** | Similar contexts retrieve relevant preferences >80% | Cosine similarity >0.7 |
| **Response Time** | <2s per message | API latency monitoring |
| **Multi-User Isolation** | 100% data isolation between users | Security audit |

### Demonstration Goals

- ✅ Domain-agnostic learning (works with ANY preferences)
- ✅ Implicit learning (no explicit questions)
- ✅ Confidence evolution (accept/reject adjustments)
- ✅ Situational awareness (context-dependent preferences)
- ✅ Privacy (local-first, user-controlled deletion)
- ✅ MCP-ready (can be called by external supervisors)

---

## Deployment Architecture

### Development (Docker Compose)

```yaml
version: '3.8'

services:
  # LLM Services
  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"

  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    volumes:
      - ./litellm_config.yaml:/app/config.yaml
    ports:
      - "4000:4000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY:-}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}

  # Databases
  neo4j:
    image: neo4j:5.13
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/fidus_memory
      - NEO4J_PLUGINS=["apoc"]
    volumes:
      - neo4j_data:/data

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=fidus
      - POSTGRES_PASSWORD=fidus_memory
      - POSTGRES_DB=fidus_memory
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Application
  api:
    build: ./packages/api
    ports:
      - "8000:8000"
    environment:
      - LITELLM_URL=http://litellm:4000
      - NEO4J_URI=bolt://neo4j:7687
      - QDRANT_URL=http://qdrant:6333
      - POSTGRES_URL=postgresql://fidus:fidus_memory@postgres:5432/fidus_memory
      - REDIS_URL=redis://redis:6379
    depends_on:
      - litellm
      - ollama
      - neo4j
      - qdrant
      - postgres
      - redis

  web:
    build: ./packages/web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - api

volumes:
  ollama_data:
  neo4j_data:
  qdrant_data:
  postgres_data:
  redis_data:
```

### Setup Script

```bash
#!/bin/bash
# scripts/setup-fidus-memory.sh

echo "🚀 Setting up Fidus Memory..."

# Start services
docker-compose up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 15

# Pull Ollama models
echo "📦 Pulling Ollama models..."
docker exec fidus-ollama ollama pull llama3.1:8b
docker exec fidus-ollama ollama pull nomic-embed-text

# Initialize databases
echo "🔧 Initializing databases..."
python scripts/init_neo4j.py
python scripts/init_qdrant.py
python scripts/init_postgres.py

echo "✅ Fidus Memory is ready!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API: http://localhost:8000"
echo "🧠 Neo4j Browser: http://localhost:7474"
```

---

## File Structure

```
fidus/
├── packages/
│   ├── api/                                    # Python Backend
│   │   ├── fidus/
│   │   │   ├── main.py                        # FastAPI app
│   │   │   ├── config.py
│   │   │   ├── memory/                        # Fidus Memory module
│   │   │   │   ├── simple_agent.py           # Phase 1: In-memory
│   │   │   │   ├── persistent_agent.py       # Phase 2: Neo4j
│   │   │   │   ├── context_aware_agent.py    # Phase 3: Qdrant
│   │   │   │   ├── preference_extractor.py
│   │   │   │   ├── implicit_learning.py
│   │   │   │   ├── situational_context.py
│   │   │   │   └── mcp_server.py             # Phase 4: MCP
│   │   │   ├── infrastructure/
│   │   │   │   ├── neo4j_client.py
│   │   │   │   ├── qdrant_client.py
│   │   │   │   ├── postgres_client.py
│   │   │   │   ├── redis_client.py
│   │   │   │   └── litellm_client.py
│   │   │   └── api/
│   │   │       ├── routes/
│   │   │       │   └── memory.py
│   │   │       └── middleware/
│   │   │           └── auth.py
│   │   ├── tests/
│   │   ├── docker-compose.yml
│   │   ├── litellm_config.yaml
│   │   └── pyproject.toml
│   │
│   ├── web/                                    # Next.js Frontend
│   │   ├── app/
│   │   │   └── fidus-memory/
│   │   │       ├── page.tsx
│   │   │       └── components/
│   │   │           └── preference-viewer.tsx
│   │   └── hooks/
│   │       └── use-chat-agent.ts
│   │
│   └── ui/                                     # @fidus/ui (Design System)
│       └── src/
│           └── components/
│               ├── chat-interface/            # Phase 1
│               ├── message-bubble/            # Phase 1
│               └── confidence-indicator/      # Phase 2
│
├── docs/
│   ├── fidus-memory-implementation-plan-v2.md # This document
│   └── fidus-memory-ui-components.md
│
└── scripts/
    ├── setup-fidus-memory.sh
    ├── init_neo4j.py
    ├── init_qdrant.py
    └── init_postgres.py
```

---

## Known Limitations (Acceptable for Prototype)

**Prototype-only features:**
- Simple user authentication (header-based)
- Desktop-only UI
- English only
- Single-language support
- Basic "Delete All" (no granular forgetting)
- 7-day conversation retention (hardcoded)

**NOT acceptable:**
- Learning accuracy <70%
- Response time >3s
- Crashes or data loss
- Cannot delete memories
- Data leaks between users

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 1** | 3-4 days | In-memory chat with preference learning |
| **Phase 2** | 4-5 days | Persistent preferences with Neo4j, confidence scoring |
| **Phase 3** | 5-6 days | Situational context with Qdrant |
| **Phase 4** | 4-5 days | MCP interface, multi-user support |
| **Polish** | 2-3 days | Bug fixes, documentation, testing |

**Total:** ~20 days (4 weeks)

---

**End of Implementation Plan v2**

**Key Changes from v1:**
- ✅ Removed specific demo scenarios (domain-agnostic)
- ✅ Removed "Next Steps" section
- ✅ Phases are now vertically sliced (each delivers working feature)
- ✅ Added explicit reusability section
- ✅ Architecture aligned with full Fidus system
- ✅ No throwaway code
