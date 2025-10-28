# Open Questions

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft (Awaiting Human Review)
**Part of:** Fidus Solution Architecture
**Author:** AI-Generated

---

## Overview

This document lists **open questions** and **clarifications needed** from the architecture documentation. These questions arose during the creation of the solution architecture and require human architect review for final decisions.

**Format:**
- **Question:** The question or uncertainty
- **Context:** Why this matters
- **Options:** Possible alternatives (if applicable)
- **Recommendation:** AI's suggested approach
- **Decision Needed:** What needs to be decided

---

## Critical Questions (High Priority)

### Q1: LangGraph State Persistence Strategy

**Question:** Where should LangGraph state be persisted for agent memory across requests?

**Context:**
- Each agent (Supervisor) uses LangGraph for multi-step reasoning
- State needs to persist across user requests (conversation context)
- Options range from in-memory (fast, volatile) to database (persistent, slower)

**Options:**

| Option | Storage | Persistence | Performance | Complexity |
|--------|---------|-------------|-------------|------------|
| **A: In-Memory** | Agent process memory | Lost on restart | Fastest | Simplest |
| **B: Redis** | Redis with TTL | Survives restart | Fast | Medium |
| **C: PostgreSQL** | Dedicated state table | Permanent | Slower | Higher |
| **D: Hybrid** | Redis (hot) + PostgreSQL (cold) | Best of both | Medium | Highest |

**Current Implementation (from clarification):**
- Orchestrator provides shared context storage
- Each Supervisor has its own namespace
- Suggested: Redis with structured keys (`context:{supervisorId}:{sessionId}:state`)

**Recommendation:** **Option B (Redis)** with 24h TTL for active sessions

**Rationale:**
- Fast access for agent reasoning
- Survives orchestrator/agent restarts
- TTL-based cleanup (no manual cleanup needed)
- If session expires, user just starts new conversation

**Decision Needed:**
- ✅ Confirm Redis is correct choice
- ⏳ Define TTL policy (24h? Configurable?)
- ⏳ Define cleanup strategy for expired sessions
- ⏳ Do we need cold storage (PostgreSQL) for long-term history?

---

### Q2: Multi-Agent Coordination Strategies

**Question:** How should the Orchestrator coordinate agents for complex multi-domain tasks?

**Context:**
- Some user requests require multiple agents (e.g., "Book flight and hotel, add to calendar")
- Orchestrator must decide: Sequential? Parallel? Conditional?

**Coordination Strategies:**

**1. Sequential:**
```
Travel Agent (book flight) → Calendar Agent (add to calendar) → Finance Agent (record expense)
```
- Simple, predictable
- Longer latency (sum of all agent times)

**2. Parallel:**
```
Travel Agent (book flight) ║ Finance Agent (check budget)
↓
Orchestrator merges results
```
- Faster (max of agent times, not sum)
- More complex error handling

**3. Conditional (LLM-Driven):**
```
Orchestrator (LLM decides):
→ If budget allows: Travel Agent
→ Else: Notify user
```
- Most flexible
- LLM determines strategy dynamically

**Recommendation:** **Hybrid Approach**
- Orchestrator uses LLM to determine strategy (Principle 1: LLM-Driven Logic)
- LLM analyzes request and decides: sequential, parallel, or conditional
- Implements based on decision

**Example:**
```typescript
const strategy = await orchestratorLLM.complete({
  system: "Analyze this multi-agent request and determine coordination strategy",
  user: `Request: ${userMessage}
         Available agents: ${agents}
         What strategy should I use?`,
  schema: CoordinationStrategySchema
});

// strategy = { type: 'sequential', agents: ['travel', 'calendar', 'finance'] }
// OR
// strategy = { type: 'parallel', groups: [['travel', 'finance'], ['calendar']] }
```

**Decision Needed:**
- ⏳ Confirm hybrid (LLM-driven) approach
- ⏳ Define strategy schema (what options should LLM have?)
- ⏳ Error handling: If one agent fails in parallel, what happens?

---

### Q3: Event Delivery Guarantees vs. Performance

**Question:** Should we guarantee exactly-once delivery for critical domain events, or accept at-least-once with idempotency?

**Context:**
- BullMQ provides at-least-once delivery
- Exactly-once is theoretically impossible in distributed systems
- Trade-off between guarantees and complexity

**Options:**

| Delivery Guarantee | Implementation | Complexity | Performance |
|-------------------|----------------|------------|-------------|
| **At-most-once** | Redis Pub/Sub | Lowest | Fastest |
| **At-least-once** | BullMQ (current) | Medium | Fast |
| **Exactly-once (simulated)** | Idempotency keys + deduplication | Highest | Slower |

**Current Architecture:**
- Critical events → BullMQ (at-least-once)
- Non-critical → Redis Pub/Sub (at-most-once)

**Recommendation:** **At-least-once + Idempotency**
- Accept that events may be delivered multiple times
- Make all event handlers idempotent
- Use idempotency keys for critical operations

**Idempotency Example:**
```typescript
class CalendarAgent {
  async onAppointmentCreated(event: DomainEvent) {
    // Check if already processed
    const processed = await this.idempotencyStore.has(event.id);
    if (processed) {
      console.log(`Event ${event.id} already processed, skipping`);
      return;
    }

    // Process event
    await this.createAppointment(event.payload);

    // Mark as processed
    await this.idempotencyStore.set(event.id, true, { ttl: 86400 }); // 24h
  }
}
```

**Decision Needed:**
- ✅ Confirm at-least-once is acceptable
- ⏳ Define idempotency patterns for all critical handlers
- ⏳ Idempotency store: Redis? PostgreSQL?

---

### Q4: Agent Deployment Model for Production

**Question:** Should agents be deployed as separate processes (microservices) or co-located in a monolith?

**Context:**
- MVP simplicity vs. production scalability
- Community Edition (Docker Compose) vs. Cloud/Enterprise (Kubernetes)

**Options:**

**Option A: Monolith (All agents in one process)**
```
fidus-backend:
  ├─ Orchestrator
  ├─ Calendar Agent
  ├─ Finance Agent
  ├─ Travel Agent
  └─ ... (8 agents total)
```
- Pros: Simple deployment, shared resources
- Cons: Scaling all-or-nothing, failure affects all

**Option B: Microservices (Each agent separate)**
```
orchestrator:3000
calendar-agent:3001
finance-agent:3002
travel-agent:3003
...
```
- Pros: Independent scaling, failure isolation
- Cons: Complex orchestration, more overhead

**Option C: Hybrid (Recommended)**
```
Community Edition:
  ├─ fidus-core (Orchestrator + Core agents)

Cloud Edition:
  ├─ orchestrator:3000
  ├─ core-agents:3001 (Calendar, Finance, Travel)
  ├─ lifestyle-agents:3002 (Health, Home, Shopping, Learning)

Enterprise Edition:
  ├─ orchestrator:3000
  ├─ calendar-agent:3001
  ├─ finance-agent:3002
  ├─ ... (separate per domain)
```

**Recommendation:** **Option C (Hybrid)**
- Community: Monolith for simplicity
- Cloud: Grouped microservices (core + lifestyle)
- Enterprise: Full microservices for max flexibility

**Decision Needed:**
- ⏳ Confirm hybrid approach
- ⏳ Define grouping strategy for Cloud Edition
- ⏳ Migration path: Monolith → Microservices

---

## Medium Priority Questions

### Q5: MCP Connection Pooling Strategy

**Question:** How many persistent SSE connections should the Orchestrator maintain per agent?

**Context:**
- Persistent connections = fast (no reconnect overhead)
- Too many connections = resource waste
- Connection pooling balances performance vs. resources

**Options:**
- **1 connection per agent:** Simple, but contention if concurrent requests
- **N connections per agent (pool):** Better concurrency, more complex
- **Connection per request:** No pooling, reconnect overhead

**Recommendation:** **Connection pool (N=3 per agent)**
- Orchestrator maintains 3 connections to each agent
- Concurrent requests use available connection from pool
- If all busy, wait or create temporary connection

**Decision Needed:**
- ⏳ Pool size per agent (3? 5? configurable?)
- ⏳ What happens if pool exhausted? (wait vs. temp connection vs. reject)

---

### Q6: Agent Capability Caching

**Question:** How often should the Orchestrator refresh agent capabilities (tools/resources)?

**Context:**
- Capabilities fetched via `tools/list`, `resources/list`
- Agents may update capabilities (new tools added)
- Caching improves performance, but may be stale

**Options:**
- **Cache forever:** Fast, but never reflects updates
- **TTL (e.g., 5 minutes):** Balance staleness vs. performance
- **Event-based invalidation:** Agent notifies Orchestrator of changes
- **No caching:** Always fresh, but slower

**Recommendation:** **Event-based invalidation + TTL fallback**
- Agent emits `capabilities.updated` event when tools change
- Orchestrator invalidates cache for that agent
- Fallback: 1 hour TTL (in case event missed)

**Decision Needed:**
- ⏳ Confirm event-based approach
- ⏳ Define TTL fallback duration
- ⏳ Should capabilities be versioned?

---

### Q7: External MCP Server Authentication

**Question:** How should agents authenticate to external MCP servers (Google Calendar, Stripe, etc.)?

**Context:**
- External MCPs may require OAuth, API keys, or other auth methods
- Users need to grant permission (OAuth flow)
- Credentials must be stored securely

**Options:**

**Option A: Agent-Level Credentials**
- Admin configures credentials once for entire agent
- All users share same credentials
- Simple but violates privacy (all users share Google account)

**Option B: Per-User Credentials**
- Each user has their own OAuth tokens
- Stored encrypted in database
- Agent looks up user's credentials at runtime
- Complex but privacy-preserving

**Recommendation:** **Option B (Per-User Credentials)**

**Flow:**
```
1. User clicks "Connect Google Calendar" in UI
2. OAuth flow: User authorizes Fidus
3. OAuth token stored encrypted in DB (per user)
4. Calendar Agent looks up user's token when calling Google MCP
5. Passes token to Google Calendar MCP Server
```

**Decision Needed:**
- ✅ Confirm per-user credentials
- ⏳ Credential storage schema
- ⏳ Token refresh mechanism (OAuth tokens expire)
- ⏳ Revocation flow (user disconnects service)

---

### Q8: Agent Error Recovery Strategies

**Question:** If an agent fails during a multi-agent scenario, how should the system recover?

**Context:**
- Multi-step flows: Travel Agent → Calendar Agent → Finance Agent
- If Calendar Agent fails, should we rollback Travel Agent's booking?

**Options:**

**Option A: No Rollback (Eventual Consistency)**
- Each agent operates independently
- If Calendar fails, travel booking remains
- User notified: "Flight booked, but couldn't add to calendar"
- Manual recovery (user adds to calendar later)

**Option B: Compensating Transactions (Saga Pattern)**
- Each agent can undo its action
- If Calendar fails, Orchestrator calls Travel Agent's `cancel_booking`
- Complex but maintains consistency

**Option C: Ask User (LLM-Driven)**
- Orchestrator asks LLM: "Calendar failed, should I cancel the flight?"
- LLM considers context and asks user
- User decides

**Recommendation:** **Option C (Ask User)**
- Aligns with Principle 1 (LLM-Driven Logic)
- Respects user autonomy
- Simpler than Saga Pattern

**Example:**
```
User: "Book flight and add to calendar"
→ Travel Agent: Flight booked ✓
→ Calendar Agent: Failed ✗

Orchestrator (LLM): "I booked your flight (LH123) but couldn't add it to your calendar due to a sync error. Would you like me to:
1. Keep the flight and you'll add it manually
2. Cancel the flight"

User: "Keep the flight"
→ Done
```

**Decision Needed:**
- ⏳ Confirm "ask user" approach
- ⏳ When to use compensating transactions vs. ask user?
- ⏳ Timeout for user response (what if user doesn't respond?)

---

## Low Priority Questions

### Q9: Prometheus Metrics Naming Convention

**Question:** What naming convention should we use for Prometheus metrics?

**Context:**
- Need consistent naming for observability
- Prometheus has conventions (e.g., `_total` suffix for counters)

**Recommendation:** Follow Prometheus conventions

**Examples:**
```
# Counters
fidus_agent_requests_total{agent="calendar",status="success"}
fidus_events_published_total{event_type="appointment.created"}

# Histograms
fidus_agent_request_duration_seconds{agent="calendar"}

# Gauges
fidus_agent_connections_active{agent="calendar"}
```

**Decision Needed:**
- ⏳ Review and approve naming convention
- ⏳ Define full list of metrics to track

---

### Q10: Log Retention Policy

**Question:** How long should logs be retained?

**Context:**
- EU AI Act requires audit logs for AI decisions (minimum 6 months)
- Application logs for debugging
- Trade-off between compliance and storage costs

**Recommendation:**

| Log Type | Retention | Reasoning |
|----------|-----------|-----------|
| **AI Decision Logs** | 6 months | EU AI Act requirement |
| **Application Logs** | 30 days | Debugging recent issues |
| **Audit Logs** | 1 year | Security compliance |
| **Event Store** | Permanent (append-only) | Event sourcing, system of record |

**Decision Needed:**
- ⏳ Confirm retention policies
- ⏳ Define cleanup automation (cron jobs?)
- ⏳ Archive strategy (S3 Glacier for old logs?)

---

## Contradictions Found

### C1: Local-First vs. Cloud-First for MVP

**Contradiction:**
- Architecture Decisions Doc says: "Cloud LLM for Free Tier, Local LLM for Starter+"
- Privacy Principle says: "Local LLM as default"

**Clarification Needed:**
- Which is the MVP default?
- Is this a phased approach (Cloud for MVP, Local for Phase 2)?

**Resolution (from user clarification):**
- ✅ Free Tier → Cloud LLM (ease of onboarding)
- ✅ Starter+ → Local LLM option (privacy upgrade)
- ✅ Architecture Decisions Doc is correct

---

### C2: Supervisor vs. Agent Terminology

**Contradiction:**
- Some docs call them "Supervisors"
- Other docs call them "AI Agents"

**Clarification:**
- ✅ **Supervisor = AI Agent embedded in MCP Server**
- ✅ Use "Supervisor" in technical docs (matches DDD terminology)
- ✅ Use "AI Agent" in user-facing docs (clearer for users)
- ✅ Both terms refer to the same component

---

## Next Steps for Review

### For Human Architect

1. **Review Critical Questions (Q1-Q4):** These impact core architecture decisions
2. **Decide on Medium Priority (Q5-Q8):** Important for implementation
3. **Confirm Resolutions (C1-C2):** Ensure no remaining contradictions
4. **Prioritize Open Questions:** Which need immediate answers for MVP?

### For Development Team

- Wait for architect decisions on Q1-Q4 before implementing agent state management
- Implement idempotency patterns (Q3) proactively
- Design hybrid deployment (Q4) to support all editions

---

## References

**Source Documents:**
- All architecture documents in [../architecture/](../architecture/)
- All domain model documents in [../domain-model/](../domain-model/)
- Solution architecture documents in this directory

**Related:**
- [12-review-checklist.md](12-review-checklist.md) - Review checklist for completeness

---

**Version History:**
- v1.0 (2025-10-27): Initial draft

---

**End of Open Questions**
