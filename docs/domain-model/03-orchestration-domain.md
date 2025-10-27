# Orchestration Domain - Detailed Model

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft
**Context:** Orchestration Context (Core Domain)

## Overview

The Orchestration Domain is a **Core Domain** responsible for coordinating all user interactions and routing requests to appropriate Domain Supervisors. It serves as the central intelligence hub that understands user intent, selects the right Supervisor(s), and synthesizes responses from multiple domains.

**Key Responsibility:** Transform natural language user requests into coordinated multi-agent workflows.

## Core Concepts

### Orchestration Architecture

```
User Request → Intent Detection → Supervisor Selection → Execution → Response Synthesis
     │              │                    │                  │              │
     │              │                    │                  │              │
     ▼              ▼                    ▼                  ▼              ▼
 Natural       LLM analyzes      Registry lookup     Tool calling    Aggregate
 Language      context + tools   for Supervisor      via LangGraph   responses
```

---

## Domain Entities

### 1. OrchestrationSession (Aggregate Root)

**Description:** Represents a single user interaction session with the orchestrator, potentially involving multiple Supervisor calls.

**Invariants:**
- Must have at least one Intent
- Cannot modify completed sessions
- Multi-domain sessions must coordinate results
- Session must timeout after inactivity (default: 30 minutes)

**State:**
```typescript
class OrchestrationSession {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // User request
  private originalRequest: string;
  private detectedIntents: Intent[] = []; // Value Object

  // Routing decisions
  private routingDecisions: RoutingDecision[] = []; // Value Object
  private selectedSupervisors: string[] = []; // Supervisor names

  // Execution
  private supervisorCalls: SupervisorCall[] = []; // Entity
  private executionMode: ExecutionMode; // SEQUENTIAL | PARALLEL | HYBRID

  // Results
  private intermediateResults: Record<string, any> = {};
  private finalResponse?: string;
  private responseQuality: ResponseQuality; // Value Object

  // Context
  private userContext: UserContextSnapshot; // Value Object
  private conversationHistory: Message[] = [];

  // Lifecycle
  private status: SessionStatus;
  private startedAt: Date;
  private completedAt?: Date;
  private durationMs?: number;

  // Metadata
  private createdAt: Date;
}

enum ExecutionMode {
  SEQUENTIAL = 'sequential',  // One after another
  PARALLEL = 'parallel',       // All at once
  HYBRID = 'hybrid'            // Some parallel, some sequential
}

enum SessionStatus {
  INITIALIZING = 'initializing',
  INTENT_DETECTION = 'intent_detection',
  ROUTING = 'routing',
  EXECUTING = 'executing',
  SYNTHESIZING = 'synthesizing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIMEOUT = 'timeout'
}
```

**Commands:**

```typescript
// Start new session
static start(
  userId: string,
  tenantId: string,
  request: string,
  userContext: UserContext
): OrchestrationSession {
  const session = new OrchestrationSession(
    generateId(),
    userId,
    tenantId
  );

  session.originalRequest = request;
  session.userContext = UserContextSnapshot.from(userContext);
  session.status = SessionStatus.INITIALIZING;
  session.startedAt = new Date();

  return session;
}

// Detect intent
async detectIntent(llmService: LLMService): Promise<IntentDetected> {
  this.status = SessionStatus.INTENT_DETECTION;

  const intents = await llmService.detectIntent(
    this.originalRequest,
    this.userContext.toJSON()
  );

  this.detectedIntents = intents.map(i => Intent.from(i));

  return new IntentDetected({
    sessionId: this.id,
    userId: this.userId,
    request: this.originalRequest,
    intents: this.detectedIntents.map(i => i.toJSON()),
    detectedAt: new Date()
  });
}

// Route to supervisors
async route(
  supervisorRegistry: SupervisorRegistry
): Promise<SupervisorRouted> {
  this.status = SessionStatus.ROUTING;

  for (const intent of this.detectedIntents) {
    const decision = await this.makeRoutingDecision(
      intent,
      supervisorRegistry
    );
    this.routingDecisions.push(decision);
    this.selectedSupervisors.push(decision.supervisorName);
  }

  // Determine execution mode
  this.executionMode = this.determineExecutionMode();

  return new SupervisorRouted({
    sessionId: this.id,
    intents: this.detectedIntents.map(i => i.type),
    supervisors: this.selectedSupervisors,
    executionMode: this.executionMode
  });
}

// Execute supervisor calls
async execute(): Promise<OrchestrationExecuting> {
  this.status = SessionStatus.EXECUTING;

  if (this.executionMode === ExecutionMode.PARALLEL) {
    await this.executeParallel();
  } else if (this.executionMode === ExecutionMode.SEQUENTIAL) {
    await this.executeSequential();
  } else {
    await this.executeHybrid();
  }

  return new OrchestrationExecuting({
    sessionId: this.id,
    supervisorCallCount: this.supervisorCalls.length
  });
}

// Synthesize final response
async synthesize(llmService: LLMService): Promise<OrchestrationCompleted> {
  this.status = SessionStatus.SYNTHESIZING;

  // Aggregate results from all supervisor calls
  const results = this.supervisorCalls.map(call => ({
    supervisor: call.supervisorName,
    result: call.result
  }));

  // LLM synthesizes user-friendly response
  this.finalResponse = await llmService.synthesizeResponse(
    this.originalRequest,
    results
  );

  // Evaluate response quality
  this.responseQuality = ResponseQuality.evaluate(
    this.finalResponse,
    this.detectedIntents
  );

  this.status = SessionStatus.COMPLETED;
  this.completedAt = new Date();
  this.durationMs = this.completedAt.getTime() - this.startedAt.getTime();

  return new OrchestrationCompleted({
    sessionId: this.id,
    userId: this.userId,
    finalResponse: this.finalResponse,
    supervisorsInvolved: this.selectedSupervisors,
    durationMs: this.durationMs,
    quality: this.responseQuality.score
  });
}

// Handle failure
fail(error: Error): OrchestrationFailed {
  this.status = SessionStatus.FAILED;
  this.completedAt = new Date();

  return new OrchestrationFailed({
    sessionId: this.id,
    userId: this.userId,
    error: error.message,
    failedAt: this.completedAt
  });
}

private async makeRoutingDecision(
  intent: Intent,
  registry: SupervisorRegistry
): Promise<RoutingDecision> {
  // Find best supervisor for this intent
  const candidates = await registry.findByCapability(intent.domain);

  if (candidates.length === 0) {
    throw new Error(`No supervisor found for domain: ${intent.domain}`);
  }

  // Select best match (could use LLM for complex cases)
  const supervisor = candidates[0];

  return RoutingDecision.create(
    intent,
    supervisor.name,
    supervisor.tools.find(t => t.matches(intent))
  );
}

private determineExecutionMode(): ExecutionMode {
  // If intents are independent → PARALLEL
  // If intents depend on each other → SEQUENTIAL
  // Mixed → HYBRID

  const hasDataDependencies = this.routingDecisions.some((decision, i) =>
    this.routingDecisions.slice(i + 1).some(other =>
      other.dependsOn(decision)
    )
  );

  if (hasDataDependencies) {
    return ExecutionMode.SEQUENTIAL;
  }

  return this.routingDecisions.length > 1
    ? ExecutionMode.PARALLEL
    : ExecutionMode.SEQUENTIAL;
}

private async executeParallel(): Promise<void> {
  const promises = this.routingDecisions.map(decision =>
    this.executeSupervisorCall(decision)
  );

  const results = await Promise.allSettled(promises);

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      this.supervisorCalls.push(result.value);
    } else {
      // Log error but don't fail entire session
      console.error(`Supervisor call ${i} failed:`, result.reason);
    }
  });
}

private async executeSequential(): Promise<void> {
  for (const decision of this.routingDecisions) {
    const call = await this.executeSupervisorCall(decision);
    this.supervisorCalls.push(call);

    // Store result for next call (may need it)
    this.intermediateResults[decision.supervisorName] = call.result;
  }
}

private async executeSupervisorCall(
  decision: RoutingDecision
): Promise<SupervisorCall> {
  const call = SupervisorCall.create(
    decision.supervisorName,
    decision.toolName,
    decision.parameters
  );

  await call.execute();

  return call;
}
```

**Queries:**

```typescript
// Check if session is still active
isActive(): boolean {
  return this.status !== SessionStatus.COMPLETED &&
         this.status !== SessionStatus.FAILED &&
         this.status !== SessionStatus.TIMEOUT;
}

// Check if timed out
hasTimedOut(timeoutMs: number = 30 * 60 * 1000): boolean {
  if (this.completedAt) return false;

  const now = Date.now();
  const elapsed = now - this.startedAt.getTime();
  return elapsed > timeoutMs;
}

// Get success metrics
getMetrics(): SessionMetrics {
  return {
    durationMs: this.durationMs,
    supervisorCount: this.selectedSupervisors.length,
    intentCount: this.detectedIntents.length,
    executionMode: this.executionMode,
    quality: this.responseQuality?.score
  };
}
```

---

### 2. SupervisorCall (Entity)

**Description:** Represents a single call to a Domain Supervisor.

**State:**
```typescript
class SupervisorCall {
  // Identity
  public readonly id: string;

  // Target
  public readonly supervisorName: string;
  public readonly toolName: string;
  public readonly parameters: Record<string, any>;

  // Execution
  private status: CallStatus;
  private startedAt?: Date;
  private completedAt?: Date;
  private durationMs?: number;

  // Result
  public result?: any;
  public error?: Error;

  // Retry
  private retryCount: number = 0;
  private maxRetries: number = 3;
}

enum CallStatus {
  PENDING = 'pending',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  RETRYING = 'retrying'
}
```

---

## Value Objects

### Intent

```typescript
class Intent {
  constructor(
    public readonly type: IntentType,
    public readonly domain: string,
    public readonly action: string,
    public readonly entities: Entity[],
    public readonly confidence: number
  ) {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }
  }

  static from(data: any): Intent {
    return new Intent(
      data.type,
      data.domain,
      data.action,
      data.entities || [],
      data.confidence
    );
  }

  toJSON(): any {
    return {
      type: this.type,
      domain: this.domain,
      action: this.action,
      entities: this.entities,
      confidence: this.confidence
    };
  }
}

enum IntentType {
  QUERY = 'query',           // User wants information
  COMMAND = 'command',       // User wants action
  COMPOUND = 'compound',     // Multiple intents
  CLARIFICATION = 'clarification' // User responding to clarification request
}

interface Entity {
  type: string;  // 'date', 'person', 'location', etc.
  value: any;
  text: string;  // Original text
}
```

### RoutingDecision

```typescript
class RoutingDecision {
  constructor(
    public readonly intent: Intent,
    public readonly supervisorName: string,
    public readonly toolName: string,
    public readonly parameters: Record<string, any>,
    public readonly reasoning: string
  ) {}

  static create(
    intent: Intent,
    supervisorName: string,
    tool?: Tool
  ): RoutingDecision {
    return new RoutingDecision(
      intent,
      supervisorName,
      tool?.name || 'default',
      this.extractParameters(intent, tool),
      `Intent ${intent.type} best handled by ${supervisorName}`
    );
  }

  dependsOn(other: RoutingDecision): boolean {
    // Check if this decision needs data from the other
    // E.g., "book a flight" depends on "find available flights"
    return this.parameters.dependsOn?.includes(other.supervisorName);
  }

  private static extractParameters(
    intent: Intent,
    tool?: Tool
  ): Record<string, any> {
    const params: Record<string, any> = {};

    // Map intent entities to tool parameters
    for (const entity of intent.entities) {
      params[entity.type] = entity.value;
    }

    return params;
  }
}
```

### UserContextSnapshot

```typescript
class UserContextSnapshot {
  constructor(
    public readonly userId: string,
    public readonly tenantId: string,
    public readonly currentActivity: string,
    public readonly location?: string,
    public readonly doNotDisturb: boolean,
    public readonly preferences: Record<string, any>,
    public readonly timestamp: Date
  ) {}

  static from(userContext: UserContext): UserContextSnapshot {
    return new UserContextSnapshot(
      userContext.userId,
      userContext.tenantId,
      userContext.currentActivity,
      userContext.location,
      userContext.doNotDisturb,
      userContext.preferences,
      new Date()
    );
  }

  toJSON(): any {
    return {
      userId: this.userId,
      tenantId: this.tenantId,
      currentActivity: this.currentActivity,
      location: this.location,
      doNotDisturb: this.doNotDisturb,
      preferences: this.preferences
    };
  }
}
```

### ResponseQuality

```typescript
class ResponseQuality {
  constructor(
    public readonly score: number, // 0-100
    public readonly metrics: QualityMetrics
  ) {}

  static evaluate(
    response: string,
    intents: Intent[]
  ): ResponseQuality {
    const metrics = {
      completeness: this.checkCompleteness(response, intents),
      clarity: this.checkClarity(response),
      relevance: this.checkRelevance(response, intents),
      conciseness: this.checkConciseness(response)
    };

    const score = (
      metrics.completeness * 0.4 +
      metrics.clarity * 0.2 +
      metrics.relevance * 0.3 +
      metrics.conciseness * 0.1
    );

    return new ResponseQuality(score, metrics);
  }

  private static checkCompleteness(
    response: string,
    intents: Intent[]
  ): number {
    // Check if all intents were addressed
    // Simplified: check length
    return Math.min(response.length / 100, 1);
  }

  private static checkClarity(response: string): number {
    // Check readability (simplified)
    return 0.8;
  }

  private static checkRelevance(response: string, intents: Intent[]): number {
    // Check if response matches intent domains
    return 0.9;
  }

  private static checkConciseness(response: string): number {
    // Penalize overly long responses
    return response.length < 500 ? 1.0 : 0.7;
  }
}

interface QualityMetrics {
  completeness: number;
  clarity: number;
  relevance: number;
  conciseness: number;
}
```

---

## Domain Events

```typescript
interface SessionStarted extends DomainEvent {
  eventType: 'SessionStarted';
  aggregateType: 'OrchestrationSession';
  payload: {
    sessionId: string;
    userId: string;
    request: string;
    startedAt: Date;
  };
}

interface IntentDetected extends DomainEvent {
  eventType: 'IntentDetected';
  aggregateType: 'OrchestrationSession';
  payload: {
    sessionId: string;
    userId: string;
    request: string;
    intents: any[];
    detectedAt: Date;
  };
}

interface SupervisorRouted extends DomainEvent {
  eventType: 'SupervisorRouted';
  aggregateType: 'OrchestrationSession';
  payload: {
    sessionId: string;
    intents: IntentType[];
    supervisors: string[];
    executionMode: ExecutionMode;
  };
}

interface OrchestrationExecuting extends DomainEvent {
  eventType: 'OrchestrationExecuting';
  aggregateType: 'OrchestrationSession';
  payload: {
    sessionId: string;
    supervisorCallCount: number;
  };
}

interface OrchestrationCompleted extends DomainEvent {
  eventType: 'OrchestrationCompleted';
  aggregateType: 'OrchestrationSession';
  payload: {
    sessionId: string;
    userId: string;
    finalResponse: string;
    supervisorsInvolved: string[];
    durationMs: number;
    quality: number;
  };
}

interface OrchestrationFailed extends DomainEvent {
  eventType: 'OrchestrationFailed';
  aggregateType: 'OrchestrationSession';
  payload: {
    sessionId: string;
    userId: string;
    error: string;
    failedAt: Date;
  };
}
```

---

## Domain Services

### IntentDetectionService

```typescript
class IntentDetectionService {
  constructor(
    private llmService: LLMService,
    private supervisorRegistry: SupervisorRegistry
  ) {}

  async detectIntents(
    request: string,
    userContext: UserContext
  ): Promise<Intent[]> {
    // Generate prompt with available supervisors
    const availableSupervisors = await this.supervisorRegistry.getAll();

    const prompt = `
Analyze this user request and detect intents:

Request: "${request}"

User Context:
${JSON.stringify(userContext, null, 2)}

Available Supervisors:
${availableSupervisors.map(s => `- ${s.name}: ${s.description}`).join('\n')}

For each intent, provide:
1. type (query | command | compound)
2. domain (which supervisor handles this?)
3. action (what specific action?)
4. entities (extracted data: dates, names, etc.)
5. confidence (0.0-1.0)

Format: JSON array of intents.
    `;

    const response = await this.llmService.complete(prompt);
    const intents = JSON.parse(response);

    return intents.map((i: any) => Intent.from(i));
  }
}
```

### MultiDomainCoordinationService

```typescript
class MultiDomainCoordinationService {
  async coordinateActions(
    decisions: RoutingDecision[]
  ): Promise<ExecutionPlan> {
    // Determine dependencies between decisions
    const graph = this.buildDependencyGraph(decisions);

    // Topological sort to find execution order
    const executionOrder = this.topologicalSort(graph);

    // Identify parallel groups
    const plan: ExecutionPlan = {
      sequential: [],
      parallel: []
    };

    for (const decision of executionOrder) {
      const deps = graph.get(decision) || [];

      if (deps.length === 0) {
        // No dependencies → can run in parallel with others
        plan.parallel.push(decision);
      } else {
        // Has dependencies → must run sequentially
        plan.sequential.push(decision);
      }
    }

    return plan;
  }

  private buildDependencyGraph(
    decisions: RoutingDecision[]
  ): Map<RoutingDecision, RoutingDecision[]> {
    const graph = new Map<RoutingDecision, RoutingDecision[]>();

    for (const decision of decisions) {
      const dependencies = decisions.filter(other =>
        decision.dependsOn(other)
      );
      graph.set(decision, dependencies);
    }

    return graph;
  }

  private topologicalSort(
    graph: Map<RoutingDecision, RoutingDecision[]>
  ): RoutingDecision[] {
    // Standard topological sort algorithm
    // Returns decisions in execution order
    const sorted: RoutingDecision[] = [];
    const visited = new Set<RoutingDecision>();

    const visit = (decision: RoutingDecision) => {
      if (visited.has(decision)) return;
      visited.add(decision);

      const deps = graph.get(decision) || [];
      for (const dep of deps) {
        visit(dep);
      }

      sorted.push(decision);
    };

    for (const decision of graph.keys()) {
      visit(decision);
    }

    return sorted;
  }
}

interface ExecutionPlan {
  sequential: RoutingDecision[];
  parallel: RoutingDecision[];
}
```

---

## Business Rules

### Rule 1: Intent Confidence Threshold
**Description:** Intents with confidence < 0.7 trigger clarification
**Rationale:** Avoid acting on uncertain interpretations

### Rule 2: Session Timeout
**Description:** Sessions timeout after 30 minutes of inactivity
**Rationale:** Free up resources

### Rule 3: Max Supervisor Calls
**Description:** Maximum 5 supervisor calls per session
**Rationale:** Prevent infinite loops and excessive complexity

### Rule 4: Fallback Mechanism
**Description:** If LLM-based routing fails, use keyword-based routing
**Rationale:** Graceful degradation

---

## Use Cases

### UC1: Simple Single-Domain Request

**User:** "What's on my calendar today?"

**Flow:**
1. Start OrchestrationSession
2. Detect Intent (type: QUERY, domain: calendar, action: list_events)
3. Route to CalendarSupervisor
4. Execute: calendarSupervisor.list_events()
5. Synthesize response
6. Complete session

### UC2: Multi-Domain Request

**User:** "Find a 2-hour slot tomorrow and book a meeting with John"

**Flow:**
1. Start OrchestrationSession
2. Detect 2 Intents:
   - Intent 1: Find free slot (calendar)
   - Intent 2: Book meeting (calendar)
3. Route both to CalendarSupervisor
4. ExecutionMode: SEQUENTIAL (intent 2 depends on intent 1)
5. Execute sequentially:
   - Find free slots
   - Book meeting with result from step 1
6. Synthesize: "I found a slot tomorrow 2-4 PM and booked your meeting with John"
7. Complete session

### UC3: Cross-Domain Coordination

**User:** "Book a flight to Berlin next week and add it to my calendar"

**Flow:**
1. Start OrchestrationSession
2. Detect 2 Intents:
   - Intent 1: Book flight (travel)
   - Intent 2: Add to calendar (calendar)
3. Route to TravelSupervisor and CalendarSupervisor
4. ExecutionMode: SEQUENTIAL (calendar depends on flight booking)
5. Execute:
   - TravelSupervisor.book_flight() → flight details
   - CalendarSupervisor.add_event(flight details)
6. Synthesize: "Booked Lufthansa LH123 to Berlin on [date] and added to your calendar"
7. Complete session

---

## Multi-Tenancy Considerations

### Tenant-Level Orchestration Settings

```typescript
interface TenantOrchestrationSettings {
  tenantId: string;

  // Intent detection
  minIntentConfidence: number; // Default: 0.7
  enableMultiIntentDetection: boolean;

  // Supervisor access
  allowedSupervisors: string[]; // Whitelist for enterprise
  disallowedSupervisors: string[]; // Blacklist

  // Execution
  maxSupervisorCallsPerSession: number; // Default: 5
  sessionTimeoutMs: number; // Default: 30 minutes

  // Fallback
  enableKeywordFallback: boolean;
}
```

---

## Persistence

### OrchestrationSession Repository

```typescript
interface OrchestrationSessionRepository {
  save(session: OrchestrationSession): Promise<void>;
  findById(id: string): Promise<OrchestrationSession | null>;
  findByUserId(userId: string): Promise<OrchestrationSession[]>;
  findActive(userId: string): Promise<OrchestrationSession[]>;
  findTimedOut(): Promise<OrchestrationSession[]>; // Cleanup job
}
```

---

## Testing Strategy

```typescript
describe('OrchestrationSession', () => {
  it('should detect multiple intents from complex request', async () => {
    const session = OrchestrationSession.start(
      'user-1',
      'tenant-1',
      'Find a slot tomorrow and book meeting with John',
      userContext
    );

    await session.detectIntent(llmService);

    expect(session.detectedIntents.length).toBe(2);
    expect(session.detectedIntents[0].action).toBe('find_free_slot');
    expect(session.detectedIntents[1].action).toBe('book_meeting');
  });

  it('should execute supervisors sequentially when data dependencies exist', async () => {
    const session = OrchestrationSession.start(/* ... */);
    await session.detectIntent(llmService);
    await session.route(supervisorRegistry);

    expect(session.executionMode).toBe(ExecutionMode.SEQUENTIAL);
  });
});
```

---

**End of Document**
