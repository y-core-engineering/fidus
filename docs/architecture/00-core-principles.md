# Fidus Architecture: Core Principles

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Current

---

## Overview

This document outlines the fundamental architectural principles that guide all design and implementation decisions in Fidus. These principles ensure the system remains flexible, maintainable, privacy-focused, and truly intelligent.

---

## 1. LLM-Driven Logic Over Hard-Coded Rules

### Principle

**Business logic and decision-making must be driven by LLM reasoning, not hard-coded rules.**

### Rationale

- Traditional rule-based systems become rigid and unmaintainable
- LLMs provide flexible, context-aware decision making
- Rules can be expressed in natural language prompts
- System adapts to edge cases without code changes

### Implementation

**❌ DON'T: Hard-coded rules**
```python
def should_suggest_appointment(user, calendar):
    if len(calendar.today) < 3:
        return False
    if user.stress_level > 0.7:
        return False
    if calendar.has_conflict():
        return True
    return False
```

**✅ DO: LLM-driven decisions**
```python
async def should_suggest_appointment(user, calendar):
    context = {
        "today_appointments": calendar.today,
        "user_preferences": user.preferences,
        "stress_indicators": user.stress_level,
        "conflicts": calendar.conflicts
    }

    prompt = f"""
    Given the user's context:
    {json.dumps(context)}

    Should we suggest rescheduling? Consider:
    - User's current workload
    - Stress indicators
    - Scheduling conflicts
    - User's typical preferences

    Respond with reasoning and decision.
    """

    return await llm.decide(prompt)
```

### Exceptions

Hard-coded logic is acceptable for:
- **Security checks** (authentication, authorization)
- **Data validation** (type checking, schema validation)
- **Performance-critical paths** (hot loops, real-time operations)
- **Infrastructure concerns** (networking, database connections)

---

## 2. Dynamic Registry Over Static Configuration

### Principle

**All components, capabilities, and integrations must register dynamically. No hard-coded component discovery.**

### Rationale

- New agents/plugins can be added without code changes
- System prompts auto-regenerate when capabilities change
- True extensibility through plugin architecture
- Simplified testing and development

### Implementation

**❌ DON'T: Hard-coded component lists**
```python
AVAILABLE_SUPERVISORS = [
    CalendarSupervisor,
    FinanceSupervisor,
    TravelSupervisor,
    # Need to edit code to add new supervisor!
]

def get_orchestrator_prompt():
    return f"You have access to: Calendar, Finance, Travel"
```

**✅ DO: Dynamic registry**
```python
class SupervisorRegistry:
    def __init__(self):
        self._supervisors = {}

    def register(self, name: str, supervisor: Supervisor):
        """Any supervisor can register at runtime."""
        self._supervisors[name] = supervisor
        self._regenerate_orchestrator_prompt()

    def _regenerate_orchestrator_prompt(self):
        """Auto-generate prompt from registered supervisors."""
        capabilities = [
            f"- {name}: {sup.description}"
            for name, sup in self._supervisors.items()
        ]
        return f"Available tools:\n" + "\n".join(capabilities)
```

### Registry Types

1. **Supervisor Registry** - All domain supervisors
2. **Signal Registry** - All proactive signals
3. **Event Registry** - All domain events
4. **MCP Registry** - All MCP servers
5. **Preference Registry** - All user preference types

---

## 3. Privacy-First by Design

### Principle

**Privacy is not a feature—it's a foundational requirement. Data ownership belongs to the user.**

### Rationale

- User trust is paramount
- Regulatory compliance (GDPR, CCPA)
- Competitive differentiation
- Ethical responsibility

### Implementation

**Core Privacy Guarantees:**

1. **Local-First Processing**
   ```python
   # Default to local LLM
   llm_service = LocalLLMService()  # Ollama, LocalAI

   # Cloud LLM only if explicitly enabled
   if user.preferences.allow_cloud_llm:
       llm_service = CloudLLMService()
   ```

2. **Zero-Knowledge Cloud Sync** (Optional)
   ```python
   # All data encrypted before leaving device
   encrypted_data = encrypt_with_user_key(user_data)
   await cloud_sync.upload(encrypted_data)
   # Server cannot decrypt data
   ```

3. **Explicit Consent**
   ```python
   @require_permission("calendar.read")
   async def access_calendar(user_id):
       # Can only access if user granted permission
       pass
   ```

4. **No Telemetry in Community Edition**
   ```python
   # Community Edition: NO tracking
   if is_community_edition():
       telemetry.disable()

   # Cloud Edition: Opt-in only
   if user.preferences.allow_analytics:
       telemetry.enable(minimal=True)
   ```

### Privacy Checklist

Every feature must answer:
- ✅ Can this work offline?
- ✅ Is cloud sync optional?
- ✅ Is user consent explicit?
- ✅ Can user delete all data?
- ✅ Is data encrypted at rest?
- ✅ Is telemetry minimal/opt-in?

---

## 4. MCP-Based Extensibility

### Principle

**All external integrations and extensions must use the Model Context Protocol (MCP) standard.**

### Rationale

- Community can extend without forking
- Standardized plugin interface
- Language-agnostic integration
- Security through sandboxing

### Implementation

**Every Supervisor = MCP Server**
```python
class CalendarSupervisor(MCPServer):
    """Supervisor implements MCP server interface."""

    def get_tools(self) -> List[Tool]:
        return [
            Tool(name="create_appointment", ...),
            Tool(name="find_free_slots", ...),
        ]

    def get_prompts(self) -> List[Prompt]:
        return [
            Prompt(name="scheduling_advice", ...),
        ]

    def get_resources(self) -> List[Resource]:
        return [
            Resource(uri="calendar://today", ...),
        ]
```

**Community Extensions**
```python
# User installs community MCP server
mcp_registry.install_from_marketplace("mcp-notion-integration")

# Automatically available to supervisors
orchestrator.refresh_capabilities()
# "You now have access to: ..., Notion integration"
```

### MCP Benefits

- **No Vendor Lock-in** - Switch providers easily
- **Community Marketplace** - 1000s of integrations
- **Security Isolation** - Sandboxed execution
- **Standard Protocol** - Works with any MCP client

---

## 5. Proactive Over Reactive

### Principle

**The system should anticipate user needs and act proactively, not just respond to requests.**

### Rationale

- True personal assistant behavior
- Reduces cognitive load
- Catches issues before they become problems
- Differentiation from chatbots

### Implementation

**Target: >50% Proactive Interactions**

```python
# Continuous opportunity detection
class ProactivityEngine:
    async def detect_opportunities(self):
        """Run every 5 minutes."""

        # Collect signals from all domains
        signals = await signal_registry.collect_all()

        # LLM analyzes for opportunities
        opportunities = await llm.analyze(
            signals=signals,
            user_context=user.context,
            prompt="Identify opportunities for proactive assistance"
        )

        # Deliver at appropriate time
        for opp in opportunities:
            await notification_service.deliver_smart(opp)
```

**Proactive Triggers:**

1. **Time-Based**
   ```python
   # Daily morning briefing
   cron: "0 7 * * *"
   prompt: "Prepare daily briefing with priorities"
   ```

2. **Event-Based**
   ```python
   # React to domain events
   @event_handler("appointment.created")
   async def check_travel_needed(event):
       # Proactively suggest travel booking
       pass
   ```

3. **User-Custom**
   ```python
   # User defines own triggers
   {
     "name": "Focus time check",
     "trigger": {"type": "cron", "schedule": "0 9 * * *"},
     "prompt": "Analyze my day, suggest focus blocks"
   }
   ```

### Proactive Examples

- 🚗 "You have an appointment in 1 hour. Traffic is heavy. Leave 15 min early?"
- 💰 "You're at 90% of your dining budget. Should I alert you at restaurants?"
- ✈️ "Your passport expires in 3 months. Your Paris trip is in 4 months."
- 🏥 "You haven't logged exercise in 5 days. Want to schedule a workout?"

---

## 6. Multi-Agent Coordination Over Monolithic Logic

### Principle

**Complex tasks should be handled by coordinating multiple specialized agents, not a single monolithic system.**

### Rationale

- Separation of concerns
- Each agent is domain expert
- Parallel execution
- Easier to maintain and extend

### Implementation

**Tool-Based Orchestration**
```python
class Orchestrator:
    async def handle_request(self, user_input: str):
        """LLM decides which supervisors to invoke."""

        # Intent detection via LLM
        plan = await self.llm.plan(
            input=user_input,
            available_tools=self.get_supervisor_tools()
        )

        # Execute plan (can be parallel)
        results = []
        for step in plan.steps:
            if step.parallel:
                results.extend(await asyncio.gather(*step.calls))
            else:
                results.append(await step.call())

        # Synthesize response
        return await self.llm.synthesize(results)
```

**Example: Complex Request**
```
User: "I need to visit my client in Berlin next Tuesday.
       Book flight, hotel, and schedule the meeting."

Orchestrator analyzes and coordinates:
├── Travel Supervisor
│   ├── Search flights to Berlin
│   └── Book hotel near client office
├── Calendar Supervisor
│   ├── Check availability Tuesday
│   └── Create meeting appointment
└── Communication Supervisor
    └── Send meeting invite to client
```

### Agent Patterns

1. **Sequential**: Step 2 depends on Step 1
2. **Parallel**: Independent steps run concurrently
3. **Hierarchical**: Supervisors can invoke sub-agents
4. **Federated**: Supervisors make autonomous decisions

---

## 7. Preference Learning Over Manual Configuration

### Principle

**The system should learn user preferences through observation, not require extensive manual configuration.**

### Rationale

- Better user experience (no complex setup)
- Adapts to changing preferences
- Discovers implicit preferences
- Reduces onboarding friction

### Implementation

**Schema-less Preferences**
```python
class PreferenceSystem:
    async def learn_preference(
        self,
        context: dict,
        user_action: str,
        outcome: str
    ):
        """Learn from user behavior."""

        # Store as vector embedding
        embedding = await self.embed({
            "context": context,
            "action": user_action,
            "outcome": outcome
        })

        await self.vector_store.add(embedding)

    async def infer_preference(self, current_context: dict):
        """Find similar past situations."""

        similar = await self.vector_store.search(
            query=current_context,
            top_k=5
        )

        return await self.llm.infer_preference(similar)
```

**Preference Types:**

1. **Explicit** - User states directly
   ```python
   user.set_preference("notification_time", "morning_only")
   ```

2. **Learned** - Observed from behavior
   ```python
   # User consistently declines evening appointments
   # System learns: prefer morning meetings
   ```

3. **Inferred** - Derived from context
   ```python
   # User books budget hotels for business trips
   # System infers: cost-conscious for work travel
   ```

### Learning Examples

- 📧 Email: User always archives newsletters → auto-archive
- 🍽️ Restaurants: User prefers Italian on weekends → suggest Italian
- ⏰ Meetings: User declines 8am meetings → don't suggest early
- 💰 Finance: User always splits bills 50/50 → auto-suggest split

---

## 8. Event-Driven Architecture

### Principle

**System components communicate through events, not direct coupling.**

### Rationale

- Loose coupling between components
- Enables reactive behavior
- Supports proactive features
- Easier to extend and maintain

### Implementation

**Event Bus Pattern**
```python
# Publisher (Calendar Supervisor)
class CalendarSupervisor:
    async def create_appointment(self, appt: Appointment):
        # Create appointment
        await self.repository.save(appt)

        # Emit event
        await event_bus.publish(
            "calendar.appointment.created",
            AppointmentCreated(
                appointment_id=appt.id,
                start_time=appt.start,
                end_time=appt.end,
                location=appt.location
            )
        )

# Subscriber (Travel Supervisor)
class TravelSupervisor:
    @event_handler("calendar.appointment.created")
    async def check_travel_needed(self, event: AppointmentCreated):
        """React to new appointments."""

        # Check if travel booking needed
        if event.location.distance > 50_km:
            await self.suggest_travel_booking(event)
```

**Event Types:**

1. **Domain Events** - Business-relevant state changes
2. **Proactive Triggers** - Opportunity detection signals
3. **System Events** - Infrastructure events (startup, shutdown)

### Event Benefits

- **Decoupling** - Components don't know about each other
- **Scalability** - Easy to add new subscribers
- **Auditability** - Complete event log
- **Debugging** - Trace event flows

---

## 9. Explainability and Transparency

### Principle

**All AI decisions must be explainable and transparent to the user.**

### Rationale

- EU AI Act compliance (Article 50)
- User trust and control
- Debugging and improvement
- Ethical AI practices

### Implementation

**Decision Logging**
```python
class ExplainableDecision:
    async def make_decision(
        self,
        context: dict,
        options: List[Option]
    ) -> Decision:
        """Make decision with full audit trail."""

        # Log input
        decision_id = uuid4()
        await self.log_input(decision_id, context, options)

        # Make decision
        result = await self.llm.decide(context, options)

        # Log reasoning
        await self.log_reasoning(
            decision_id=decision_id,
            reasoning=result.reasoning,
            confidence=result.confidence,
            factors=result.considered_factors
        )

        # Log output
        await self.log_output(decision_id, result.decision)

        return result

# User can always ask "Why?"
async def explain_decision(decision_id: str) -> Explanation:
    """Retrieve full decision context."""
    return await decision_log.get(decision_id)
```

**Transparency Features:**

1. **Decision Logs** - Why was this action taken?
2. **Data Usage** - What data was accessed?
3. **LLM Interactions** - What prompts were sent?
4. **Confidence Scores** - How certain is the system?

### Explainability UI

```
┌─────────────────────────────────────────┐
│ 🤖 Fidus suggested:                     │
│ "Decline this meeting"                  │
│                                         │
│ [Why?] ← User clicks                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💡 Reasoning:                           │
│                                         │
│ 1. Meeting overlaps with high-priority │
│    project deadline (Project X)         │
│                                         │
│ 2. You have 3 meetings today already   │
│    (above your typical max of 2)        │
│                                         │
│ 3. This topic can be handled async     │
│    via email (based on past patterns)  │
│                                         │
│ Confidence: 85%                         │
│                                         │
│ Data used:                              │
│ - Calendar (today's schedule)           │
│ - Project deadlines                     │
│ - Past meeting patterns                 │
└─────────────────────────────────────────┘
```

---

## 10. Security by Design

### Principle

**Security and permissions are not added later—they are fundamental to the architecture.**

### Rationale

- Protect user data
- Prevent privilege escalation
- Support multi-tenancy
- Enable safe plugin ecosystem

### Implementation

**Permission Model**
```python
class PermissionGuard:
    @require_permission("calendar.read", "calendar.write")
    async def create_appointment(self, user_id, data):
        """Permission checked before execution."""

        # Also check tenant isolation
        if data.tenant_id != current_user.tenant_id:
            raise TenantIsolationError()

        return await self.repository.create(data)
```

**Security Layers:**

1. **Authentication** - Who are you?
   ```python
   @require_auth
   async def endpoint(request):
       user = request.user  # Authenticated user
   ```

2. **Authorization** - What can you do?
   ```python
   @require_role("admin")
   async def admin_action(request):
       pass
   ```

3. **Tenant Isolation** - Multi-tenancy
   ```python
   # All queries scoped to tenant
   query = query.filter(tenant_id=current_tenant.id)
   ```

4. **Plugin Sandboxing** - Untrusted code
   ```python
   # Plugins run in isolated environment
   plugin_result = await sandbox.execute(
       plugin_code,
       max_memory=100_MB,
       max_cpu_time=5_seconds,
       network_access=False
   )
   ```

### Security Checklist

- ✅ All API endpoints authenticated
- ✅ All data access authorized
- ✅ All user data encrypted at rest
- ✅ All network traffic encrypted (TLS 1.3)
- ✅ All plugins sandboxed
- ✅ All LLM interactions logged
- ✅ All secrets in secure vault

---

## 11. Testability and Observability

### Principle

**The system must be designed for testing and observability from day one.**

### Rationale

- Catch bugs early
- Monitor production health
- Debug issues quickly
- Ensure reliability

### Implementation

**Testability:**
```python
# Dependency injection for testing
class CalendarSupervisor:
    def __init__(
        self,
        repository: CalendarRepository,
        llm_service: LLMService,
        event_bus: EventBus
    ):
        self.repository = repository
        self.llm = llm_service
        self.events = event_bus

# Easy to test with mocks
def test_create_appointment():
    mock_repo = Mock(CalendarRepository)
    mock_llm = Mock(LLMService)
    mock_bus = Mock(EventBus)

    supervisor = CalendarSupervisor(mock_repo, mock_llm, mock_bus)
    await supervisor.create_appointment(...)

    assert mock_repo.save.called
    assert mock_bus.publish.called
```

**Observability:**
```python
# Structured logging
import structlog

logger = structlog.get_logger()

async def process_request(request):
    logger.info(
        "processing_request",
        request_id=request.id,
        user_id=request.user_id,
        supervisor="calendar"
    )

    # Metrics
    metrics.increment("requests.processed", tags=["supervisor:calendar"])

    # Tracing
    with tracer.span("calendar.create_appointment"):
        result = await self.create_appointment(request.data)

    return result
```

**Observability Stack:**

1. **Logs** - Structured logs (JSON)
2. **Metrics** - Prometheus/StatsD
3. **Traces** - OpenTelemetry
4. **Alerts** - PagerDuty/Opsgenie

---

## 12. Performance: Efficient by Default

### Principle

**The system should be efficient and performant without requiring manual optimization.**

### Rationale

- Good user experience
- Cost efficiency (LLM calls expensive)
- Scalability
- Energy efficiency (local LLM)

### Implementation

**Caching Strategy:**
```python
# Cache LLM responses
@cache(ttl=3600)  # 1 hour
async def get_llm_decision(prompt: str, context: dict):
    # Expensive LLM call
    return await llm.generate(prompt, context)

# Cache expensive computations
@cache_per_user(ttl=300)  # 5 min
async def get_user_preferences(user_id: str):
    # Expensive vector similarity search
    return await preference_store.infer(user_id)
```

**Lazy Loading:**
```python
# Don't load all supervisors at startup
class SupervisorRegistry:
    async def get_supervisor(self, name: str):
        if name not in self._loaded:
            self._loaded[name] = await self._load_supervisor(name)
        return self._loaded[name]
```

**Batching:**
```python
# Batch multiple LLM calls
async def process_opportunities(signals: List[Signal]):
    # Single LLM call for all domains
    batch_prompt = self._build_batch_prompt(signals)
    results = await llm.generate(batch_prompt)
    return self._split_results(results)
```

### Performance Targets

- **Response Time**: < 200ms (cached), < 2s (LLM)
- **Proactive Check**: < 5s (per domain)
- **Memory**: < 500MB (resident)
- **Startup Time**: < 3s

---

## 13. Graceful Degradation

### Principle

**The system should degrade gracefully when components fail, not crash completely.**

### Rationale

- Better user experience
- Partial functionality better than none
- Resilience to failures
- Easier debugging

### Implementation

**Fallback Strategies:**
```python
class ResilientLLMService:
    async def generate(self, prompt: str):
        try:
            # Try primary LLM (local)
            return await self.local_llm.generate(prompt)
        except LocalLLMError:
            logger.warning("Local LLM failed, trying cloud")
            try:
                # Fallback to cloud LLM
                return await self.cloud_llm.generate(prompt)
            except CloudLLMError:
                logger.error("All LLMs failed, using rule-based fallback")
                # Fallback to simple rules
                return self.rule_based_fallback(prompt)
```

**Circuit Breaker:**
```python
class CircuitBreaker:
    async def call(self, func):
        if self.is_open:
            # Fast fail if circuit open
            raise ServiceUnavailableError()

        try:
            result = await func()
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            if self.failure_count > threshold:
                self.open()
            raise
```

### Degradation Examples

- 🔌 **LLM Offline** → Use cached responses, simple rules
- 📡 **Network Down** → Offline mode, queue for later
- 🗄️ **Database Slow** → Read from cache, write async
- 🔧 **Plugin Error** → Disable plugin, continue with core features

---

## Principle Hierarchy

When principles conflict, follow this priority:

1. **Privacy & Security** - Non-negotiable
2. **User Experience** - Core value proposition
3. **Maintainability** - Long-term sustainability
4. **Performance** - Important, but not at expense of above

---

## Anti-Patterns to Avoid

### ❌ Hard-Coded Business Logic
```python
# BAD: Can't change without code deployment
if user.country == "DE" and transaction.amount > 1000:
    require_verification = True
```

### ❌ Monolithic Services
```python
# BAD: Single service doing everything
class MegaService:
    def handle_calendar(self): pass
    def handle_finance(self): pass
    def handle_travel(self): pass
```

### ❌ Synchronous Blocking
```python
# BAD: Blocks entire system
result = requests.get(external_api)  # Blocking!
```

### ❌ Implicit Coupling
```python
# BAD: CalendarService directly imports FinanceService
from finance import FinanceService
finance_service = FinanceService()
```

### ❌ God Objects
```python
# BAD: One object knows everything
class UserContext:
    # 500 fields, 1000 methods
    pass
```

---

## Validation Checklist

For every new feature or component, verify:

- [ ] Is business logic in LLM prompts, not code?
- [ ] Does it register dynamically (no hard-coding)?
- [ ] Is user privacy protected?
- [ ] Does it use MCP standard?
- [ ] Is it proactive where appropriate?
- [ ] Does it coordinate with other agents?
- [ ] Does it learn from user behavior?
- [ ] Is it event-driven?
- [ ] Is it explainable?
- [ ] Are permissions enforced?
- [ ] Is it testable?
- [ ] Is it observable?
- [ ] Is it performant?
- [ ] Does it degrade gracefully?

---

## Conclusion

These principles are not suggestions—they are the foundation of Fidus architecture. Every design decision, every line of code, every feature must align with these principles.

**Remember:**
- **LLM-driven** over rule-based
- **Dynamic** over static
- **Privacy-first** always
- **MCP-standard** for extensions
- **Proactive** not just reactive
- **Multi-agent** coordination
- **Learning** not configuring
- **Event-driven** communication
- **Explainable** decisions
- **Secure** by design
- **Observable** and testable
- **Performant** by default
- **Resilient** in failure

When in doubt, ask: *"Does this align with our core principles?"*

---

**Next Steps:**
- Review this document with all team members
- Reference these principles in architecture reviews
- Include principle alignment in PR descriptions
- Update this document as we learn and evolve

**Questions or Suggestions?**
Open an issue or discussion in the repository.
