# Architecture Decision Record: Vision Document Improvement

**Date:** 2025-10-26
**Project:** Personal AI Agent with Hybrid UI
**Context:** Review-based improvements (vision-review-2025-10-26.md)

---

## Decisions

### Decision 1: Privacy Model for LLM Integration (🔴 HIGH)

**Question:** How do we resolve the contradiction between "Zero-Knowledge" and "Cloud-LLM Integration"?

**Decision Made:** **Option B + Migration Path (UPDATED 2025-10-26)**

**Original Decision:**
- Local LLM as default, Cloud-LLM optional

**Revised Decision (after user feedback):**
- **MVP + Free Tier:** Cloud-LLM (OpenAI/Anthropic) as default
- **Cloud Starter (€29/month):** Local LLM (Ollama) as privacy upgrade
- **Migration:** Easy switch Cloud ↔ Local

**Details:**
- **Free Tier:** Cloud-LLM (faster start, lower infrastructure costs)
- **Cloud Starter (€29/month):** Local LLM for true privacy
- **Privacy-Level System:**
  - Free Tier: Cloud-LLM with privacy proxy
  - Starter+: Local LLM (Zero-Knowledge)
  - Enterprise: User chooses (Cloud or On-Premise)

**Rationale:**
- Lower barrier to entry for new users (no local setup)
- Faster MVP development (no Ollama integration in Phase 1)
- Privacy upgrade as selling point for Starter Tier
- Flexible architecture (LLM-Provider-Interface) enables both modes

**Impact on Documents:**
- **Vision Document:** "Cloud-LLM for Free, Local LLM from Starter (Privacy Upgrade)"
- **Technical Concept:** Cloud-LLM in Phase 1, Local LLM in Phase 2
- **API Specs:** LLM-Provider-Interface (abstracts local/cloud)
- **Roadmap Phase 1:** Cloud-LLM integration (OpenAI/Anthropic)
- **Roadmap Phase 2:** Local LLM as premium feature

---

### Decision 2: Mobile First vs. Docker Development (🟡 MEDIUM)

**Question:** Is "Mobile First" contradictory to "Docker-First Development"?

**Decision Made:** **Clarification - No Contradiction**

**Details:**
- **Mobile First** = User Experience principle (PWA optimized for smartphones)
- **Docker First** = Development setup principle (backend services in containers)
- **Interaction:** User uses PWA on phone ↔ Backend runs in Docker

**Rationale:**
- Different layers (UX vs. DevOps)
- Both coexist without conflict
- Clarification in glossary is sufficient

**Impact on Documents:**
- **Technical Concept:** Glossary section with term definitions
- **Vision Document:** "Mobile-First User Experience" (without Docker mention)

---

### Decision 3: Home Agent Architecture (🟡 MEDIUM)

**Question:** Is the Home Agent an internal domain agent or a wrapper around external MCP services?

**Decision Made:** **Hybrid - Internal Agent with External Backends**

**Details:**
- **Home Agent (internal):** Domain agent like Calendar, Finance, Travel, Health
- **Home Automation MCPs (external):** Home Assistant, HomeKit, SmartThings
- **Relationship:** Home Agent orchestrates external smart home systems via MCP
- **Logic:** Family coordination, location awareness, automation rules → internal
- **Hardware integration:** Concrete smart home systems → external via MCP

**Rationale:**
- Consistent with other agents (e.g., Calendar Agent → Google Calendar MCP)
- Clear separation: Business logic internal, hardware integration external
- Maximum flexibility (different smart home backends)

**Impact on Documents:**
- **Vision Document:** "Home Agent orchestrates your smart home"
- **Technical Concept:** Architecture diagram (Home Agent → MCP Layer → Home Assistant/HomeKit)
- **API Specs:** Home Agent Interface + MCP Integration Patterns

---

### Decision 4: Document Structure (🔴 HIGH)

**Question:** One document or split into multiple?

**Decision Made:** **3 Documents**

**Details:**

#### Document 1: Vision Document (`vision-persoenlicher-agent-v3.md`)
- **Target Audience:** CEO, Investors, Product Manager, Marketing
- **Scope:** ~800-1000 lines
- **Style:** Inspiring, strategic, no code examples
- **Content:**
  - Executive Summary
  - The Vision (What, Why)
  - A Day with Your Agent (Use Cases)
  - Differentiation from Competitors
  - Core Principles (Privacy, Mobile, Multi-User, MCP)
  - Business Model & Pricing
  - Roadmap (high-level, 4 phases)
  - Success Metrics

#### Document 2: Technical Concept (`technical-concept.md`)
- **Target Audience:** Tech Lead, Solution Architect, Senior Engineers
- **Scope:** ~1000-1500 lines
- **Style:** Architecture diagrams, concept descriptions, minimal code
- **Content:**
  - System Architecture (Orchestrator, Agents, MCP)
  - Technology Stack (PWA, Docker, Vector DB, local LLM)
  - Domain Agents Overview (functions, no API details)
  - Location Integration (geofencing concept)
  - Smart Home Integration (MCP architecture)
  - Privacy Architecture (Zero-Knowledge, Encryption, LLM modes)
  - Multi-User Environments (concept)

#### Document 3: API Specifications (`api-specifications.md`)
- **Target Audience:** Software Engineers, Implementers
- **Scope:** ~1000-2000 lines
- **Style:** Code-heavy, technical specifications
- **Content:**
  - Agent Interfaces (all TypeScript definitions)
  - MCP Tool Definitions
  - Geofencing API
  - Home Automation API
  - Data Models & Schemas
  - Code Examples & Implementation Patterns

**Rationale:**
- Perfect audience separation
- Vision Document usable for stakeholder pitches
- Technical Concept for MVP architecture planning
- API Specs for concrete implementation (versionable later)

**Impact:**
- Current document split into 3 parts
- Cross-references between documents
- All 3 documents must be maintained

---

## Implementation Plan

**Based on Decisions:**

### Phase 1: Document Split (Priority 1)
1. ✅ Create Vision Document v3.0 (~1000 lines, business-ready)
2. ✅ Create Technical Concept (~1500 lines, architecture-focused)
3. ✅ Create API Specifications (~1500 lines, code-heavy)
4. ✅ Cross-references between documents

**Effort:** ~8-10 hours

### Phase 2: Privacy Architecture (Priority 1)
1. ✅ Document privacy model (Local LLM + Cloud migration)
2. ✅ Describe privacy level system (3 levels)
3. ✅ Define LLM-Provider-Interface (abstracts local/cloud)
4. ✅ Document migration path for users

**Effort:** ~2-3 hours

### Phase 3: Clarifications (Priority 1)
1. ✅ Create glossary (Mobile First / Docker First)
2. ✅ Home Agent architecture diagram
3. ✅ MCP integration patterns

**Effort:** ~2 hours

**Total Priority 1:** ~12-15 hours

---

## Quality Criteria (Definition of Done)

### Vision Document is complete when:
- ✅ No TypeScript interfaces included
- ✅ Focus on "What" and "Why" (not "How")
- ✅ Understandable for business stakeholders
- ✅ Privacy positioning clear ("Local LLM first")
- ✅ ~1000 lines (readability)
- ✅ Pitch-ready for investors

### Technical Concept is complete when:
- ✅ Architecture diagrams present
- ✅ Privacy architecture detailed (Local LLM + Cloud)
- ✅ Home Agent architecture clarified (internal + external)
- ✅ Glossary (Mobile First / Docker First)
- ✅ Understandable for architects
- ✅ Minimal code (concept level)

### API Specifications is complete when:
- ✅ All agent interfaces (TypeScript) included
- ✅ LLM-Provider-Interface (local + cloud)
- ✅ MCP Tool Definitions
- ✅ Geofencing API
- ✅ Home Automation API
- ✅ Implementable for developers

---

## Next Steps

**Immediate:**
1. ✅ Create Vision Document v3.0
2. ✅ Create Technical Concept
3. ✅ Create API Specifications

**After Document Split:**
4. ⏳ Increase abstraction level (Vision Document without code)
5. ⏳ Document privacy architecture
6. ⏳ Clarify Home Agent architecture

---

**Decisions made by:** Sebastian Herden
**Documented by:** AI Assistant
**Status:** ✅ All decisions made - Ready for Implementation
