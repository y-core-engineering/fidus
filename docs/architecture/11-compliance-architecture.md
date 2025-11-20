# Compliance Architecture: EU AI Act & Transparency

**Version:** 1.0
**Date:** 2025-10-27

> **Navigation:** [← Overview](01-overview.md) | [Back to README →](README.md)

---

## 1. AI Transparency & Logging Model

### 1.1 Basic Principle

**Every AI decision must be traceable and explainable.**

This is not just a technical requirement, but a **legal obligation** according to EU AI Act (in force since February 2, 2025).

**Core Requirement (Article 50 EU AI Act):**
> Users must be informed that they are interacting with an AI system and must be able to understand at any time how decisions were made.

---

### 1.2 Log Entry Model (Logical Structure)

**Conceptual interface:**

```typescript
interface AIDecisionLog {
  // ════════════════════════════════════════
  // IDENTIFICATION
  // ════════════════════════════════════════
  id: string;                    // Unique log ID (UUID)
  timestamp: Date;               // Time of decision
  userId: string;                // Affected user
  tenantId?: string;             // Tenant (for multi-tenancy)

  // ════════════════════════════════════════
  // CONTEXT
  // ════════════════════════════════════════
  action: string;                // Which action? (e.g. "calendar.create_event")
  supervisor: string;            // Which supervisor? (e.g. "calendar-supervisor")
  sessionId: string;             // Session ID (for related requests)

  // ════════════════════════════════════════
  // INPUT/OUTPUT
  // ════════════════════════════════════════
  userRequest: string;           // Original user request
  agentResponse: string;         // Agent response to user

  // ════════════════════════════════════════
  // TRANSPARENCY (EU AI Act Requirements)
  // ════════════════════════════════════════
  reasoning: string;             // Human-readable reasoning
                                 // Example: "I created an appointment because you asked for a free slot and 2 PM was available."

  signalsUsed: string[];         // Which signals were used?
                                 // Example: ["calendar.free_slots", "user.preferences.meeting_duration"]

  llmModel: string;              // Which LLM model? (e.g. "llama-3.1-8b", "gpt-4o")

  llmPrompt?: string;            // Optional: Full prompt (only for debugging/audit)
                                 // Privacy note: Can contain sensitive data!

  // ════════════════════════════════════════
  // CONFIDENCE & METADATA
  // ════════════════════════════════════════
  confidenceScore?: number;      // Optional: 0-1 (How confident is agent?)

  toolCallsMade?: ToolCall[];    // Which tools were called?
                                 // Example: [{ tool: "google_calendar.create_event", params: {...} }]

  // ════════════════════════════════════════
  // COMPLIANCE FLAGS
  // ════════════════════════════════════════
  userFacing: boolean;           // Is this a user-visible action?
  proactive: boolean;            // Was this a proactive suggestion?
  riskLevel?: 'minimal' | 'limited' | 'high'; // EU AI Act Risk Category
}
```

**Example log entry:**

```typescript
{
  id: "log-a3f9d8e2-1234-5678-abcd-ef1234567890",
  timestamp: "2025-10-27T14:30:00Z",
  userId: "user-123",
  tenantId: null,

  action: "calendar.create_event",
  supervisor: "calendar-supervisor",
  sessionId: "session-xyz789",

  userRequest: "Find a 2h slot tomorrow for team meeting",
  agentResponse: "I created an appointment: Tomorrow 2-4 PM 'Team Meeting'. All team members are available.",

  reasoning: "I created an appointment because you asked for a free slot. I analyzed your calendar data and found that tomorrow 2-4 PM all team members are available. Your preference for afternoon meetings was considered.",

  signalsUsed: [
    "calendar.free_slots",
    "user.preferences.meeting_time_preference",
    "calendar.team_members_availability"
  ],

  llmModel: "llama-3.1-8b",
  llmPrompt: null, // Not logged (only for debugging)

  confidenceScore: 0.92,

  toolCallsMade: [
    {
      tool: "google_calendar.list_events",
      params: { calendarId: "user-123", timeMin: "2025-10-28T00:00:00Z", timeMax: "2025-10-28T23:59:59Z" }
    },
    {
      tool: "google_calendar.create_event",
      params: { title: "Team Meeting", start: "2025-10-28T14:00:00Z", duration: 120 }
    }
  ],

  userFacing: true,
  proactive: false,
  riskLevel: 'limited'
}
```

---

### 1.3 Logging Scope (What Gets Logged?)

**Architecture decisions:**

| Category | Logging? | Reasoning |
|-----------|----------|------------|
| **User-facing Actions** | ✅ YES | All responses to user must be traceable (EU AI Act) |
| **Proactive Suggestions** | ✅ YES | Opportunity detection must be transparent |
| **Internal Reasoning Steps** | ❌ NO | Only final decision, not every intermediate step |
| **Background Jobs** | ⚠️ PARTIAL | Only if they lead to user-facing action |
| **LLM Prompts** | ⚠️ OPTIONAL | Only for debugging/audit (privacy-sensitive!) |

**Process: When is logging done?**

```
1. User sends request to Orchestrator
   +- Create log entry (status: in_progress)

2. Orchestrator delegates to Supervisor
   +- Update log entry (supervisor, action)

3. Supervisor executes LangGraph
   +- Collect reasoning (written to reasoning field)
   +- Collect signals (written to signalsUsed array)
   +- Collect tool calls (written to toolCallsMade array)

4. Supervisor returns response
   +- Finalize log entry:
      - Set agentResponse
      - Set reasoning
      - Set confidenceScore
      - Status: completed

5. Store log entry (Database)
   +- User can retrieve logs anytime
```

**Example flow:**

```
User: "Find a 2h slot tomorrow"
  ↓
[Log entry created]
  ↓
Orchestrator → Calendar Supervisor
  ↓
Calendar Supervisor:
  - LangGraph Node: analyze_request
    → reasoning += "User wants 2h slot tomorrow"
  - LangGraph Node: check_availability
    → signalsUsed.push("calendar.free_slots")
    → toolCallsMade.push({ tool: "google_calendar.list_events", ... })
  - LangGraph Node: create_event
    → toolCallsMade.push({ tool: "google_calendar.create_event", ... })
  - LangGraph Node: respond
    → agentResponse = "I created an appointment: ..."
  ↓
[Log entry finalized and stored]
  ↓
User receives response + can retrieve log
```

---

### 1.4 Retention & User Rights

**Architecture decisions:**

| Aspect | Decision | Reasoning |
|--------|--------------|------------|
| **Default Retention** | 90 days | Balance between traceability and privacy |
| **User-Configurable** | 30-365 days | User can decide themselves |
| **Right to be Forgotten** | Deletable anytime | GDPR Article 17 |
| **Anonymization after Retention** | Automatic | Privacy-by-design |

**Retention flow:**

```
1. Log entry is created
   +- expiresAt = timestamp + retention_days

2. Daily cleanup job
   +- Finds all logs with expiresAt < now()
   +- Options:
      a) Delete (default)
      b) Anonymize (userId → "anonymized-user")

3. User can delete anytime
   +- API: DELETE /api/logs?userId=...
   +- Immediate deletion (no waiting for retention)
```

**User rights interface:**

```typescript
interface LogRetentionSettings {
  userId: string;
  retentionDays: number;        // 30-365
  anonymizeAfterRetention: boolean;  // true = anonymize instead of delete
  includePrompts: boolean;      // false = never log prompts (more privacy)
}

interface UserLogAccess {
  // User can retrieve own logs
  getLogs(userId: string, filters?: LogFilters): Promise<AIDecisionLog[]>;

  // User can delete single log
  deleteLog(userId: string, logId: string): Promise<void>;

  // User can delete all logs
  deleteAllLogs(userId: string): Promise<void>;

  // User can configure retention
  setRetention(userId: string, settings: LogRetentionSettings): Promise<void>;
}
```

---

### 1.5 Explainability (How Does "Why Did You Do That?" Work?)

**Problem:**
User asks: "Why did you create an appointment at 2 PM and not at 10 AM?"

**Solution:**
System generates human-readable explanation from log entry.

**Process:**

```
1. User asks: "Why?" (or clicks "Explain" button)
   +- UI sends request with logId

2. System retrieves log entry from database
   +- log = db.logs.findById(logId)

3. LLM generates explanation from log data
   Prompt:
   "
   You are an explaining assistant. Explain to the user why this decision was made.

   Decision: {log.action}
   Reasoning: {log.reasoning}
   Used signals: {log.signalsUsed.join(', ')}
   Tool calls: {log.toolCallsMade.map(t => t.tool).join(', ')}

   Formulate an understandable, friendly explanation in 2-3 sentences.
   "

4. LLM response:
   "
   I created the appointment at 2 PM because I analyzed your calendar data and
   found that you prefer afternoon meetings. Additionally, all team members
   were available at 2 PM, while at 10 AM two people already had appointments.
   "

5. User receives explanation
   +- Optional: "Used data" link → shows signalsUsed details
```

**UI example:**

```
+----------------------------------------------+
| Fidus                                        |
+----------------------------------------------+
| ✅ Appointment created:                      |
|    Tomorrow 2-4 PM "Team Meeting"           |
|                                              |
| [Why?] [Details]                            |
+----------------------------------------------+

[User clicks "Why?"]

+----------------------------------------------+
| Explanation                                  |
+----------------------------------------------+
| I created the appointment at 2 PM because   |
| I analyzed your calendar data and found     |
| that you prefer afternoon meetings.         |
| Additionally, all team members were         |
| available at 2 PM.                          |
|                                              |
| [Show used data]                            |
+----------------------------------------------+

[User clicks "Show used data"]

+----------------------------------------------+
| Used Data                                    |
+----------------------------------------------+
| • Calendar: Free slots (tomorrow)           |
| • Preferences: Meeting time preference      |
| • Calendar: Team availability               |
|                                              |
| Confidence: 92%                              |
| LLM Model: Llama 3.1 8B                     |
| Timestamp: 27.10.2025 14:30                 |
+----------------------------------------------+
```

---

### 1.6 Integration in Supervisor Architecture

**Logging is part of Supervisor execution:**

```typescript
// Conceptual example (logical level)
class CalendarSupervisor {
  async execute(userMessage: string, userContext: UserContext): Promise<string> {
    // 1. Create log entry
    const logEntry = await this.createLogEntry({
      userId: userContext.userId,
      userRequest: userMessage,
      action: 'calendar.scheduling',
      supervisor: 'calendar-supervisor'
    });

    try {
      // 2. Execute LangGraph state machine
      const state = await this.compiledGraph.invoke({
        messages: [{ role: 'user', content: userMessage }],
        userContext,
        logEntry  // Pass log entry through!
      });

      // 3. Collect reasoning & signals from state
      logEntry.reasoning = state.reasoning;
      logEntry.signalsUsed = state.signalsUsed;
      logEntry.toolCallsMade = state.toolCalls;

      // 4. Response
      const response = state.messages[state.messages.length - 1].content;
      logEntry.agentResponse = response;
      logEntry.confidenceScore = state.confidence;

      // 5. Finalize log entry
      await this.finalizeLogEntry(logEntry);

      return response;

    } catch (error) {
      // Log errors too
      logEntry.error = error.message;
      await this.finalizeLogEntry(logEntry);
      throw error;
    }
  }

  // Helper methods
  private async createLogEntry(data: Partial<AIDecisionLog>): Promise<AIDecisionLog> {
    return await db.logs.create({
      id: generateUUID(),
      timestamp: new Date(),
      status: 'in_progress',
      ...data
    });
  }

  private async finalizeLogEntry(logEntry: AIDecisionLog): Promise<void> {
    logEntry.status = 'completed';
    await db.logs.update(logEntry.id, logEntry);
  }
}
```

**LangGraph nodes collect reasoning:**

```typescript
// LangGraph Node: analyze_request
async function analyzeRequest(state: CalendarState): Promise<CalendarState> {
  const analysis = await llm.complete({ prompt: "..." });

  // Collect reasoning
  state.logEntry.reasoning += `Analyzed: ${analysis.reasoning}. `;

  return state;
}

// LangGraph Node: check_availability
async function checkAvailability(state: CalendarState): Promise<CalendarState> {
  // Signal is used
  state.logEntry.signalsUsed.push('calendar.free_slots');

  const freeSlots = await signalRegistry.collect('calendar.free_slots', state.userContext);

  // Tool call is made
  state.logEntry.toolCallsMade.push({
    tool: 'google_calendar.list_events',
    params: { ... }
  });

  state.logEntry.reasoning += `Available slots: ${freeSlots.length}. `;

  return state;
}
```

---

## 2. EU AI Act Compliance

### 2.1 Transparency Obligation (Article 50)

**Legal requirement (since February 2, 2025):**
> "Providers of AI systems intended for interaction with natural persons must ensure that natural persons are informed that they are interacting with an AI system."

**Our implementation:**

1. **Initial information during onboarding:**
   ```
   +----------------------------------------+
   | Welcome to Fidus                       |
   +----------------------------------------+
   | ℹ️ Fidus is an AI-based                |
   |    personal assistant that uses        |
   |    artificial intelligence to          |
   |    proactively support you.            |
   |                                        |
   | [ ] I understand                       |
   | [Continue]                             |
   +----------------------------------------+
   ```

2. **Visible labeling in UI:**
   - Badge/Icon: "🤖 AI Assistant"
   - Footer: "Powered by AI (Llama 3.1 8B)" or "Powered by AI (GPT-4o)"

3. **Available anytime:**
   - Settings → "About Fidus" → "AI Model: Llama 3.1 8B"
   - Settings → "AI Transparency" → Logs & Explanations

**Documentation:**
- Website: "What is Fidus? An AI agent..."
- FAQ: "Does Fidus use AI? Yes, Fidus is based on..."

---

### 2.2 High-Risk Boundary (Risk Classification)

**Our classification: Limited Risk**

Fidus is classified as **"Limited Risk"** AI system because:
- ✅ It is a conversational AI (chatbot)
- ✅ It uses generative AI (LLMs)
- ❌ It is **not** a high-risk system (no HR, credit scoring, medicine, etc.)

**High-Risk Use Cases (NOT supported):**

| Use Case | Status | Reasoning |
|----------|--------|------------|
| **Recruiting/HR** | ❌ Not supported | Would be high-risk → No HR functions |
| **Credit scoring** | ❌ Not supported | Would be high-risk → No financial decisions |
| **Medical diagnosis** | ❌ Not supported | Would be high-risk → Only health tracking |
| **Educational assessment** | ❌ Not supported | Would be high-risk → Only learning tracking |

**If user attempts high-risk use case:**

```typescript
// Conceptual example (logical level)
class ComplianceGuard {
  async checkRequest(request: string): Promise<RiskAssessment> {
    // LLM-based risk detection
    const risk = await llm.complete({
      prompt: `
        Is this request a high-risk use case according to EU AI Act?
        Request: "${request}"

        High-Risk categories:
        - Recruiting/HR (candidate selection, employee evaluation)
        - Credit scoring (financial decisions)
        - Medical diagnosis (health decisions)
        - Educational assessment (grades, exams)

        JSON: { risk: "high" | "limited" | "minimal", reason: "..." }
      `
    });

    if (risk.risk === 'high') {
      throw new HighRiskError(
        'This use case requires extended compliance and is currently not supported.'
      );
    }

    return risk;
  }
}
```

**User receives warning:**
```
+----------------------------------------+
| ⚠️ Use case not supported              |
+----------------------------------------+
| This request involves an area          |
| (Recruiting/HR) that has extended      |
| compliance requirements and is         |
| currently not supported.               |
|                                        |
| [Understood]                           |
+----------------------------------------+
```

---

### 2.3 General-Purpose AI (GPAI) Compliance

**Our situation:**

| Scenario | Status | Obligations |
|----------|--------|-----------|
| **Only use Ollama/Llama** | ✅ We are **Deployer** | Fewer obligations, no GPAI documentation |
| **Fine-tune own LLM** | ⚠️ We become **GPAI Provider** | More obligations, technical documentation required |

**Recommendation:**
- ✅ Use open-source LLMs (Llama, Mistral) without fine-tuning → **Deployer** status
- ⚠️ Avoid training from scratch → GPAI compliance burden

**If fine-tuning needed (Phase 3+):**
- Create technical documentation
- Publish transparency report
- Document training data summary
- Ensure copyright compliance

---

## 3. GDPR Alignment

### 3.1 Logging + GDPR

**Challenge:**
AI Act requires logging, GDPR requires data minimization → Conflict?

**Solution:**

| GDPR Principle | Our Implementation |
|--------------|------------------|
| **Data Minimization** | Only log necessary data (no full prompt by default) |
| **Purpose Limitation** | Use logs only for transparency/explainability |
| **Storage Limitation** | 90 days retention (configurable) |
| **Right to be Forgotten** | User can delete all logs anytime |
| **Transparency** | User sees all logs about themselves |

**Justification for logging:**
- **Legal basis:** Legitimate interest (Article 6(1)(f) GDPR)
- **Purpose:** Transparency & traceability (EU AI Act compliance)
- **Balancing:** Interest in transparency > minimal privacy restriction

---

### 3.2 Right to be Forgotten

**GDPR Article 17: User can request deletion**

**Our implementation:**

```typescript
interface DataDeletionService {
  // User can delete all data (incl. logs)
  async deleteAllUserData(userId: string): Promise<void> {
    // 1. Delete AI decision logs
    await db.logs.deleteMany({ userId });

    // 2. Delete user preferences
    await db.preferences.deleteMany({ userId });

    // 3. Graph DB: Delete user node
    await graphDB.deleteNode(userId);

    // 4. Vector DB: Delete user embeddings
    await vectorDB.delete('user_context', { userId });

    // 5. Cache: Delete user sessions
    await cache.del(`session:${userId}`);

    // Complete deletion confirmed
    return;
  }

  // User can delete only logs (keep rest)
  async deleteLogsOnly(userId: string): Promise<void> {
    await db.logs.deleteMany({ userId });
  }
}
```

**UI:**

```
Settings → Privacy → Delete data

[ ] Delete only AI logs (keep preferences)
[ ] Delete all data (account will be deleted)

[Delete]
```

---

## 4. Summary

### 4.1 Compliance Status

| Requirement | Status | Notes |
|-------------|--------|----------|
| **EU AI Act Transparency** | ✅ Fully implemented | Logging + Explainability |
| **Limited Risk Classification** | ✅ Correct | No high-risk use cases |
| **GPAI Compliance** | ✅ As Deployer OK | If fine-tuning: Extra docs needed |
| **GDPR Alignment** | ✅ Complete | Right to be forgotten implemented |

---

### 4.2 Key Features

- ✅ **Complete Logging:** All user-facing AI decisions are logged
- ✅ **Explainability:** "Why?" function with LLM-generated explanation
- ✅ **User Control:** User can view and delete logs
- ✅ **Retention Management:** 90 days default, user-configurable
- ✅ **Privacy-by-Design:** Minimal data, no prompts (default)
- ✅ **High-Risk Detection:** Warning for unsupported use cases

---

**Navigation:** [← Overview](01-overview.md) | [Back to README →](README.md)

**Version History:**
- v1.0 (2025-10-27): Initial version (Architecture Completion)
