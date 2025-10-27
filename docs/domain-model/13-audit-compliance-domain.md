# Audit & Compliance Domain Model

## Overview

The **Audit & Compliance Context** is a **Supporting Domain** in Fidus that ensures regulatory compliance (GDPR, CCPA, etc.), maintains comprehensive audit logs, manages data retention policies, and provides transparency into system operations. It is critical for Enterprise customers and required for certifications (SOC 2, ISO 27001).

**Relationship to Bounded Context:**
- This **domain model** defines WHAT the Audit & Compliance Context does (aggregates, events, rules)
- The **AuditSupervisor** (architecture) defines HOW it's implemented (immutable event store, retention policies, export formats)

---

## Multi-Tenancy Considerations

The Audit & Compliance Context operates with **tenant-level isolation** and **plan-based feature access**:

| **Tenant Type** | **Audit & Compliance Capabilities** |
|-----------------|-----------------------------------|
| **INDIVIDUAL** | Basic audit logs (authentication, profile changes) |
| **FAMILY** | Family-level audit visibility, parental controls logging |
| **TEAM** | Team audit logs, admin action tracking, export capability |
| **COMPANY** | Comprehensive audit, compliance reports, retention policies, legal hold |

**Tenant-Specific Features:**
- **Community Tier:** 90-day audit log retention, no export
- **Cloud Tier:** 1-year retention, CSV export, GDPR data requests
- **Enterprise Tier:** 7-year retention, compliance reports, legal hold, custom retention policies, SOC 2 support

**Data Isolation:**
- All audit logs scoped to `tenantId`
- Cross-tenant queries prohibited
- Export limited to tenant's own data
- Compliance reports aggregated per tenant

---

## Core Bounded Context

**Name:** Audit & Compliance Context

**Type:** Supporting Domain (serves all contexts, especially Identity and Data Management)

**Responsibility:** Record all significant system events, enforce data retention policies, enable compliance reporting, and provide audit trails for security and legal requirements.

**Domain Language:**
- **Audit Log:** Immutable record of a system event
- **Audit Trail:** Sequence of related audit logs
- **Data Subject:** Person whose data is processed (GDPR term)
- **Data Processing Activity:** Activity involving personal data
- **Retention Policy:** Rules for how long data is kept
- **Legal Hold:** Suspension of retention policy for legal reasons
- **Right to Access:** GDPR right to obtain copy of personal data
- **Right to Erasure:** GDPR right to be forgotten
- **Consent:** Explicit permission for data processing
- **Data Breach:** Unauthorized access or disclosure of data

---

## Aggregates

### 1. AuditLog (Aggregate Root)

The **AuditLog** is an immutable record of a significant system event.

**Identity:**
- `auditId: string` - Unique identifier (UUID)
- `tenantId: string` - Tenant scope
- `timestamp: Date` - When event occurred (microsecond precision)

**Event Information:**
- `eventType: AuditEventType` - Type of event
- `eventCategory: EventCategory` - Category for filtering
- `severity: Severity` - Importance level
- `actor: Actor` - Who performed the action
- `resource: Resource` - What was affected
- `action: string` - What happened
- `outcome: Outcome` - Success or failure

**Context:**
- `ipAddress: string` - Source IP address
- `userAgent?: string` - Browser/client info
- `location?: GeoLocation` - Geographic location
- `sessionId?: string` - Session identifier
- `requestId?: string` - Request correlation ID

**Details:**
- `details: Record<string, any>` - Event-specific data
- `changes?: Change[]` - Before/after for updates
- `metadata: Metadata` - Additional context

**Compliance:**
- `retentionPolicy: RetentionPolicy` - How long to keep
- `legalHold: boolean` - Protected from deletion
- `exported: boolean` - Included in data export

**Invariants:**
1. Audit logs are immutable after creation
2. Timestamp must be in UTC
3. Actor must be identified (user, system, or anonymous)
4. Retention policy must be set on creation
5. Logs under legal hold cannot be deleted

**Commands:**

```typescript
class AuditLog {
  // Core aggregate root
  private readonly auditId: string;
  private readonly tenantId: string;
  private readonly timestamp: Date;

  private readonly eventType: AuditEventType;
  private readonly eventCategory: EventCategory;
  private readonly severity: Severity;
  private readonly actor: Actor;
  private readonly resource: Resource;
  private readonly action: string;
  private readonly outcome: Outcome;

  private readonly ipAddress: string;
  private readonly userAgent?: string;
  private readonly location?: GeoLocation;
  private readonly sessionId?: string;
  private readonly requestId?: string;

  private readonly details: Record<string, any>;
  private readonly changes?: Change[];
  private readonly metadata: Metadata;

  private retentionPolicy: RetentionPolicy;
  private legalHold: boolean = false;
  private exported: boolean = false;

  // Command: Create audit log (factory method)
  static create(
    tenantId: string,
    eventType: AuditEventType,
    actor: Actor,
    resource: Resource,
    action: string,
    outcome: Outcome,
    context: AuditContext,
    details?: Record<string, any>
  ): AuditLog {
    const auditId = generateUUID();
    const timestamp = new Date();
    const eventCategory = this.categorizeEvent(eventType);
    const severity = this.determineSeverity(eventType, outcome);
    const retentionPolicy = this.determineRetentionPolicy(eventCategory, tenantId);

    const metadata = Metadata.create({
      createdBy: 'AuditSupervisor',
      version: '1.0'
    });

    return new AuditLog(
      auditId,
      tenantId,
      timestamp,
      eventType,
      eventCategory,
      severity,
      actor,
      resource,
      action,
      outcome,
      context.ipAddress,
      context.userAgent,
      context.location,
      context.sessionId,
      context.requestId,
      details || {},
      undefined,
      metadata,
      retentionPolicy,
      false,
      false
    );
  }

  // Command: Create audit log with changes (for updates)
  static createWithChanges(
    tenantId: string,
    eventType: AuditEventType,
    actor: Actor,
    resource: Resource,
    action: string,
    outcome: Outcome,
    context: AuditContext,
    before: Record<string, any>,
    after: Record<string, any>
  ): AuditLog {
    const changes = Change.diff(before, after);
    const log = this.create(tenantId, eventType, actor, resource, action, outcome, context, {});
    log.changes = changes;
    return log;
  }

  // Command: Place legal hold
  placeLegalHold(reason: string, caseId: string): LegalHoldPlaced {
    if (this.legalHold) {
      throw new Error('Legal hold already placed');
    }

    this.legalHold = true;

    return new LegalHoldPlaced({
      auditId: this.auditId,
      tenantId: this.tenantId,
      reason,
      caseId,
      timestamp: new Date()
    });
  }

  // Command: Release legal hold
  releaseLegalHold(reason: string): LegalHoldReleased {
    if (!this.legalHold) {
      throw new Error('No legal hold to release');
    }

    this.legalHold = false;

    return new LegalHoldReleased({
      auditId: this.auditId,
      tenantId: this.tenantId,
      reason,
      timestamp: new Date()
    });
  }

  // Command: Mark as exported
  markExported(exportId: string): void {
    this.exported = true;
    this.metadata.addTag(`exported:${exportId}`);
  }

  // Query: Should be retained?
  shouldBeRetained(): boolean {
    if (this.legalHold) return true;

    const age = Date.now() - this.timestamp.getTime();
    const retentionMs = this.retentionPolicy.getDurationMs();

    return age < retentionMs;
  }

  // Query: Can be deleted?
  canBeDeleted(): boolean {
    return !this.legalHold && !this.shouldBeRetained();
  }

  // Private: Categorize event type
  private static categorizeEvent(eventType: AuditEventType): EventCategory {
    // Map event types to categories
    const authEvents = [
      AuditEventType.USER_LOGIN,
      AuditEventType.USER_LOGOUT,
      AuditEventType.PASSWORD_CHANGED,
      AuditEventType.MFA_ENABLED
    ];

    const dataEvents = [
      AuditEventType.DATA_ACCESSED,
      AuditEventType.DATA_CREATED,
      AuditEventType.DATA_UPDATED,
      AuditEventType.DATA_DELETED
    ];

    const adminEvents = [
      AuditEventType.USER_CREATED,
      AuditEventType.USER_DELETED,
      AuditEventType.ROLE_ASSIGNED,
      AuditEventType.SETTINGS_CHANGED
    ];

    if (authEvents.includes(eventType)) return EventCategory.AUTHENTICATION;
    if (dataEvents.includes(eventType)) return EventCategory.DATA_ACCESS;
    if (adminEvents.includes(eventType)) return EventCategory.ADMIN_ACTION;

    return EventCategory.SYSTEM;
  }

  // Private: Determine severity
  private static determineSeverity(eventType: AuditEventType, outcome: Outcome): Severity {
    if (outcome === Outcome.FAILURE) {
      // Failed auth attempts are high severity
      if (eventType === AuditEventType.USER_LOGIN) return Severity.HIGH;
      return Severity.MEDIUM;
    }

    // Successful security events are medium
    const securityEvents = [
      AuditEventType.PASSWORD_CHANGED,
      AuditEventType.MFA_ENABLED,
      AuditEventType.API_KEY_CREATED,
      AuditEventType.DATA_EXPORTED
    ];

    if (securityEvents.includes(eventType)) return Severity.MEDIUM;

    return Severity.LOW;
  }

  // Private: Determine retention policy
  private static determineRetentionPolicy(
    category: EventCategory,
    tenantId: string
  ): RetentionPolicy {
    const tenantPlan = getTenantPlan(tenantId);

    // Enterprise default: 7 years
    // Cloud default: 1 year
    // Community default: 90 days

    let defaultDays: number;
    switch (tenantPlan) {
      case PlanTier.ENTERPRISE:
        defaultDays = 7 * 365;
        break;
      case PlanTier.CLOUD:
        defaultDays = 365;
        break;
      default:
        defaultDays = 90;
    }

    // Security events always retained longer
    if (category === EventCategory.AUTHENTICATION || category === EventCategory.ADMIN_ACTION) {
      defaultDays = Math.max(defaultDays, 365); // Minimum 1 year
    }

    return RetentionPolicy.days(defaultDays);
  }
}
```

**Domain Events:**
- `AuditLogCreated` - New audit log recorded
- `LegalHoldPlaced` - Legal hold applied to log
- `LegalHoldReleased` - Legal hold removed
- `AuditLogExported` - Log included in export
- `AuditLogDeleted` - Log deleted (retention expired)

---

### 2. DataSubjectRequest (Aggregate Root)

The **DataSubjectRequest** represents a GDPR/CCPA data subject request (access, erasure, portability).

**Identity:**
- `requestId: string` - Unique identifier
- `tenantId: string` - Tenant scope
- `userId: string` - Data subject

**Request Information:**
- `requestType: RequestType` - Type of request
- `status: RequestStatus` - Current state
- `requestedAt: Date` - When submitted
- `requester: Actor` - Who submitted (usually the user)

**Processing:**
- `assignedTo?: string` - Admin handling request
- `startedAt?: Date` - When processing began
- `completedAt?: Date` - When completed
- `verificationMethod: VerificationMethod` - How identity verified
- `verifiedAt?: Date` - When identity confirmed

**Outcome:**
- `outcome?: RequestOutcome` - Result of request
- `outputUrl?: string` - Download link for data export
- `notes: string[]` - Processing notes
- `deletionSummary?: DeletionSummary` - What was deleted

**Compliance:**
- `legalBasis: LegalBasis` - Justification for processing
- `deadline: Date` - GDPR 30-day deadline
- `extensionRequested: boolean` - 2-month extension requested
- `extensionReason?: string`

**Invariants:**
1. Request must be verified before processing
2. Must complete within deadline (30 days, or 90 days with extension)
3. Completed requests cannot be modified
4. Erasure requests must verify no legal hold on data

**Commands:**

```typescript
class DataSubjectRequest {
  // Core aggregate root
  private readonly requestId: string;
  private readonly tenantId: string;
  private readonly userId: string;

  private readonly requestType: RequestType;
  private status: RequestStatus = RequestStatus.PENDING;
  private readonly requestedAt: Date;
  private readonly requester: Actor;

  private assignedTo?: string;
  private startedAt?: Date;
  private completedAt?: Date;
  private verificationMethod?: VerificationMethod;
  private verifiedAt?: Date;

  private outcome?: RequestOutcome;
  private outputUrl?: string;
  private notes: string[] = [];
  private deletionSummary?: DeletionSummary;

  private readonly legalBasis: LegalBasis;
  private deadline: Date;
  private extensionRequested: boolean = false;
  private extensionReason?: string;

  // Command: Verify identity
  verifyIdentity(
    method: VerificationMethod,
    verifier: Actor
  ): IdentityVerified | IdentityVerificationFailed {
    if (this.status !== RequestStatus.PENDING) {
      return new IdentityVerificationFailed({
        requestId: this.requestId,
        reason: 'Request not in PENDING state',
        timestamp: new Date()
      });
    }

    // Verification logic would check email confirmation, ID upload, etc.
    this.verificationMethod = method;
    this.verifiedAt = new Date();
    this.status = RequestStatus.VERIFIED;
    this.addNote(`Identity verified by ${verifier.name} using ${method}`);

    return new IdentityVerified({
      requestId: this.requestId,
      userId: this.userId,
      tenantId: this.tenantId,
      method,
      verifier: verifier.id,
      timestamp: new Date()
    });
  }

  // Command: Assign to admin
  assignTo(adminId: string, adminName: string): RequestAssigned {
    if (this.status !== RequestStatus.VERIFIED) {
      throw new Error('Request must be verified before assignment');
    }

    this.assignedTo = adminId;
    this.status = RequestStatus.IN_PROGRESS;
    this.startedAt = new Date();
    this.addNote(`Assigned to ${adminName}`);

    return new RequestAssigned({
      requestId: this.requestId,
      assignedTo: adminId,
      timestamp: new Date()
    });
  }

  // Command: Request extension
  requestExtension(reason: string): ExtensionRequested {
    if (this.extensionRequested) {
      throw new Error('Extension already requested');
    }

    const daysUntilDeadline = (this.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysUntilDeadline < 5) {
      throw new Error('Too late to request extension');
    }

    this.extensionRequested = true;
    this.extensionReason = reason;
    this.deadline = new Date(this.deadline.getTime() + 60 * 24 * 60 * 60 * 1000); // +60 days
    this.addNote(`Extension requested: ${reason}`);

    return new ExtensionRequested({
      requestId: this.requestId,
      reason,
      newDeadline: this.deadline,
      timestamp: new Date()
    });
  }

  // Command: Complete access request
  completeAccessRequest(
    dataPackage: DataPackage,
    storageService: StorageService
  ): Promise<RequestCompleted> {
    if (this.requestType !== RequestType.ACCESS) {
      throw new Error('Not an access request');
    }

    if (this.status !== RequestStatus.IN_PROGRESS) {
      throw new Error('Request not in IN_PROGRESS state');
    }

    // Upload data package
    const url = await storageService.upload(
      dataPackage,
      `data-requests/${this.requestId}.zip`
    );

    this.status = RequestStatus.COMPLETED;
    this.completedAt = new Date();
    this.outcome = RequestOutcome.FULFILLED;
    this.outputUrl = url;
    this.addNote(`Data package generated: ${dataPackage.fileCount} files, ${dataPackage.sizeBytes} bytes`);

    return new RequestCompleted({
      requestId: this.requestId,
      userId: this.userId,
      tenantId: this.tenantId,
      requestType: this.requestType,
      outcome: this.outcome,
      outputUrl: this.outputUrl,
      timestamp: new Date()
    });
  }

  // Command: Complete erasure request
  async completeErasureRequest(
    deletionService: DeletionService
  ): Promise<RequestCompleted> {
    if (this.requestType !== RequestType.ERASURE) {
      throw new Error('Not an erasure request');
    }

    if (this.status !== RequestStatus.IN_PROGRESS) {
      throw new Error('Request not in IN_PROGRESS state');
    }

    // Execute deletion across all contexts
    const summary = await deletionService.deleteUserData(this.userId, this.tenantId);

    this.status = RequestStatus.COMPLETED;
    this.completedAt = new Date();
    this.outcome = RequestOutcome.FULFILLED;
    this.deletionSummary = summary;
    this.addNote(`Data deleted: ${summary.totalRecords} records across ${summary.contexts.length} contexts`);

    return new RequestCompleted({
      requestId: this.requestId,
      userId: this.userId,
      tenantId: this.tenantId,
      requestType: this.requestType,
      outcome: this.outcome,
      deletionSummary: summary,
      timestamp: new Date()
    });
  }

  // Command: Reject request
  reject(reason: string, rejector: Actor): RequestRejected {
    if (this.status === RequestStatus.COMPLETED) {
      throw new Error('Cannot reject completed request');
    }

    this.status = RequestStatus.REJECTED;
    this.completedAt = new Date();
    this.outcome = RequestOutcome.REJECTED;
    this.addNote(`Rejected by ${rejector.name}: ${reason}`);

    return new RequestRejected({
      requestId: this.requestId,
      userId: this.userId,
      tenantId: this.tenantId,
      requestType: this.requestType,
      reason,
      rejector: rejector.id,
      timestamp: new Date()
    });
  }

  // Query: Is overdue?
  isOverdue(): boolean {
    return Date.now() > this.deadline.getTime() && this.status !== RequestStatus.COMPLETED;
  }

  // Query: Days until deadline
  daysUntilDeadline(): number {
    const ms = this.deadline.getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }

  // Private: Add note
  private addNote(note: string): void {
    this.notes.push(`[${new Date().toISOString()}] ${note}`);
  }
}
```

**Domain Events:**
- `DataSubjectRequestCreated` - New request submitted
- `IdentityVerified` - Identity confirmed
- `IdentityVerificationFailed` - Identity could not be verified
- `RequestAssigned` - Assigned to admin
- `ExtensionRequested` - 2-month extension requested
- `RequestCompleted` - Request fulfilled
- `RequestRejected` - Request rejected

---

### 3. RetentionPolicy (Entity)

**RetentionPolicy** defines how long data should be retained.

**Attributes:**
- `policyId: string` - Unique identifier
- `tenantId: string` - Tenant scope
- `name: string` - Policy name
- `duration: Duration` - How long to keep data
- `applies To: DataCategory[]` - What data this applies to
- `priority: number` - For conflict resolution
- `legalBasis: LegalBasis` - Why data is retained
- `autoDelete: boolean` - Automatically delete when expired

**Methods:**

```typescript
class RetentionPolicy {
  static days(days: number): RetentionPolicy {
    return new RetentionPolicy(
      generateId(),
      'system',
      `${days} days`,
      Duration.days(days),
      [DataCategory.ALL],
      0,
      LegalBasis.LEGITIMATE_INTEREST,
      true
    );
  }

  getDurationMs(): number {
    return this.duration.toMilliseconds();
  }

  isExpired(createdAt: Date): boolean {
    const age = Date.now() - createdAt.getTime();
    return age > this.getDurationMs();
  }
}
```

---

## Value Objects

### 1. Actor

Represents who performed an action.

```typescript
class Actor {
  constructor(
    public readonly id: string,
    public readonly type: ActorType,
    public readonly name: string,
    public readonly email?: string
  ) {}

  static user(userId: string, name: string, email: string): Actor {
    return new Actor(userId, ActorType.USER, name, email);
  }

  static system(componentName: string): Actor {
    return new Actor('system', ActorType.SYSTEM, componentName);
  }

  static anonymous(): Actor {
    return new Actor('anonymous', ActorType.ANONYMOUS, 'Anonymous');
  }
}

enum ActorType {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  ANONYMOUS = 'ANONYMOUS',
  API_KEY = 'API_KEY'
}
```

### 2. Resource

Represents what was affected.

```typescript
class Resource {
  constructor(
    public readonly type: ResourceType,
    public readonly id: string,
    public readonly name?: string
  ) {}

  static user(userId: string): Resource {
    return new Resource(ResourceType.USER, userId);
  }

  static profile(profileId: string): Resource {
    return new Resource(ResourceType.PROFILE, profileId);
  }

  static document(documentId: string, name: string): Resource {
    return new Resource(ResourceType.DOCUMENT, documentId, name);
  }
}

enum ResourceType {
  USER = 'USER',
  TENANT = 'TENANT',
  PROFILE = 'PROFILE',
  PLUGIN_CONNECTION = 'PLUGIN_CONNECTION',
  DOCUMENT = 'DOCUMENT',
  CALENDAR_EVENT = 'CALENDAR_EVENT',
  EMAIL = 'EMAIL',
  FINANCIAL_ACCOUNT = 'FINANCIAL_ACCOUNT',
  HEALTH_RECORD = 'HEALTH_RECORD',
  SYSTEM_SETTING = 'SYSTEM_SETTING'
}
```

### 3. Change

Represents before/after state for update events.

```typescript
class Change {
  constructor(
    public readonly field: string,
    public readonly oldValue: any,
    public readonly newValue: any
  ) {}

  static diff(before: Record<string, any>, after: Record<string, any>): Change[] {
    const changes: Change[] = [];

    // Find changed and new fields
    for (const key in after) {
      if (before[key] !== after[key]) {
        // Redact sensitive fields
        const oldValue = this.redactIfSensitive(key, before[key]);
        const newValue = this.redactIfSensitive(key, after[key]);
        changes.push(new Change(key, oldValue, newValue));
      }
    }

    // Find deleted fields
    for (const key in before) {
      if (!(key in after)) {
        const oldValue = this.redactIfSensitive(key, before[key]);
        changes.push(new Change(key, oldValue, null));
      }
    }

    return changes;
  }

  private static redactIfSensitive(field: string, value: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'ssn'];
    if (sensitiveFields.some(f => field.toLowerCase().includes(f))) {
      return '[REDACTED]';
    }
    return value;
  }
}
```

### 4. GeoLocation

Geographic location from IP address.

```typescript
class GeoLocation {
  constructor(
    public readonly country: string,
    public readonly region?: string,
    public readonly city?: string,
    public readonly latitude?: number,
    public readonly longitude?: number
  ) {}

  static fromIP(ipAddress: string): GeoLocation {
    // Use GeoIP service to lookup location
    const lookup = geoipLookup(ipAddress);
    return new GeoLocation(
      lookup.country,
      lookup.region,
      lookup.city,
      lookup.latitude,
      lookup.longitude
    );
  }
}
```

### 5. DataPackage

Export package for data access requests.

```typescript
class DataPackage {
  constructor(
    public readonly userId: string,
    public readonly tenantId: string,
    public readonly files: DataFile[],
    public readonly format: ExportFormat,
    public readonly generatedAt: Date
  ) {}

  get fileCount(): number {
    return this.files.length;
  }

  get sizeBytes(): number {
    return this.files.reduce((sum, f) => sum + f.sizeBytes, 0);
  }

  async toZip(): Promise<Buffer> {
    // Create ZIP archive with all files
    const zip = new JSZip();

    for (const file of this.files) {
      zip.file(file.path, file.content);
    }

    return await zip.generateAsync({ type: 'nodebuffer' });
  }
}

interface DataFile {
  path: string;
  content: Buffer | string;
  sizeBytes: number;
}

enum ExportFormat {
  JSON = 'JSON',
  CSV = 'CSV',
  XML = 'XML'
}
```

### 6. DeletionSummary

Summary of data erasure request.

```typescript
class DeletionSummary {
  constructor(
    public readonly totalRecords: number,
    public readonly contexts: ContextDeletion[],
    public readonly retainedRecords: RetainedRecord[],
    public readonly deletedAt: Date
  ) {}

  toJSON(): Record<string, any> {
    return {
      totalRecords: this.totalRecords,
      contexts: this.contexts.map(c => ({
        context: c.contextName,
        deletedCount: c.deletedCount,
        tables: c.tables
      })),
      retainedRecords: this.retainedRecords.map(r => ({
        context: r.contextName,
        recordType: r.recordType,
        reason: r.reason
      })),
      deletedAt: this.deletedAt.toISOString()
    };
  }
}

interface ContextDeletion {
  contextName: string;
  deletedCount: number;
  tables: string[];
}

interface RetainedRecord {
  contextName: string;
  recordType: string;
  reason: string; // e.g., "Legal hold", "Financial regulation"
}
```

---

## Domain Events

### 1. AuditLogCreated

Emitted when any audit log is created.

```typescript
interface AuditLogCreated {
  auditId: string;
  tenantId: string;
  eventType: AuditEventType;
  severity: Severity;
  timestamp: Date;
}
```

**Subscribers:**
- Security monitoring systems (SIEM)
- Alerting for high-severity events

### 2. DataSubjectRequestCreated

Emitted when user submits GDPR/CCPA request.

```typescript
interface DataSubjectRequestCreated {
  requestId: string;
  userId: string;
  tenantId: string;
  requestType: RequestType;
  deadline: Date;
  timestamp: Date;
}
```

**Subscribers:**
- Notification Context (alert admins)
- Compliance dashboard

### 3. IdentityVerified

Emitted when data subject identity is verified.

```typescript
interface IdentityVerified {
  requestId: string;
  userId: string;
  tenantId: string;
  method: VerificationMethod;
  verifier: string;
  timestamp: Date;
}
```

### 4. RequestCompleted

Emitted when data subject request is fulfilled.

```typescript
interface RequestCompleted {
  requestId: string;
  userId: string;
  tenantId: string;
  requestType: RequestType;
  outcome: RequestOutcome;
  outputUrl?: string;
  deletionSummary?: DeletionSummary;
  timestamp: Date;
}
```

**Subscribers:**
- Notification Context (notify user)
- Compliance dashboard

---

## Domain Services

### 1. AuditService

**Responsibility:** Create audit logs for all significant events.

```typescript
interface AuditService {
  // Log authentication events
  logLogin(userId: string, tenantId: string, context: AuditContext, success: boolean): Promise<void>;
  logLogout(userId: string, tenantId: string, context: AuditContext): Promise<void>;
  logPasswordChange(userId: string, tenantId: string, context: AuditContext): Promise<void>;

  // Log data access
  logDataAccess(
    userId: string,
    tenantId: string,
    resource: Resource,
    action: string,
    context: AuditContext
  ): Promise<void>;

  // Log admin actions
  logAdminAction(
    adminId: string,
    tenantId: string,
    action: string,
    resource: Resource,
    context: AuditContext
  ): Promise<void>;

  // Log with changes
  logUpdate(
    userId: string,
    tenantId: string,
    resource: Resource,
    before: Record<string, any>,
    after: Record<string, any>,
    context: AuditContext
  ): Promise<void>;

  // Query audit trail
  getAuditTrail(
    tenantId: string,
    filters: AuditFilters,
    pagination: Pagination
  ): Promise<AuditLog[]>;

  // Export audit logs
  exportLogs(
    tenantId: string,
    filters: AuditFilters,
    format: ExportFormat
  ): Promise<string>; // Returns download URL
}
```

### 2. ComplianceReportService

**Responsibility:** Generate compliance reports for audits and certifications.

```typescript
interface ComplianceReportService {
  // Generate SOC 2 report
  generateSOC2Report(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<SOC2Report>;

  // Generate GDPR compliance report
  generateGDPRReport(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<GDPRReport>;

  // Generate data processing activity record (GDPR Article 30)
  generateDPAR(tenantId: string): Promise<DPARReport>;

  // Data breach notification report
  generateBreachReport(
    tenantId: string,
    breachId: string
  ): Promise<BreachReport>;
}
```

### 3. DeletionService

**Responsibility:** Orchestrate data deletion across all contexts.

```typescript
interface DeletionService {
  // Delete user data (GDPR erasure)
  deleteUserData(
    userId: string,
    tenantId: string
  ): Promise<DeletionSummary>;

  // Check for legal holds
  checkLegalHolds(
    userId: string,
    tenantId: string
  ): Promise<LegalHold[]>;

  // Anonymize instead of delete (preserve analytics)
  anonymizeUserData(
    userId: string,
    tenantId: string
  ): Promise<DeletionSummary>;

  // Execute retention policy (automatic deletion)
  executeRetentionPolicy(
    policy: RetentionPolicy,
    dryRun: boolean
  ): Promise<DeletionSummary>;
}
```

---

## Business Rules

### 1. Audit Log Immutability

**Rule:** Audit logs cannot be modified or deleted (except when retention expired and no legal hold).

**Rationale:** Audit integrity required for compliance and legal proceedings.

**Enforcement:**
- AuditLog has no update methods
- Database uses append-only storage
- Deletion only via retention policy service
- Legal holds prevent deletion

### 2. GDPR 30-Day Deadline

**Rule:** Data subject requests must be completed within 30 days (or 90 days with extension).

**Rationale:** GDPR Article 12(3) requirement.

**Enforcement:**
- DataSubjectRequest sets deadline on creation
- Dashboard shows overdue requests
- Automated reminders at 20, 25, 28 days
- Extension requires justification

### 3. Identity Verification

**Rule:** Data subject identity must be verified before processing request.

**Rationale:** Prevent unauthorized access to personal data.

**Enforcement:**
- Request status must be VERIFIED before IN_PROGRESS
- Multiple verification methods supported (email, ID upload, phone)
- Verification logged in audit trail

### 4. Legal Hold Priority

**Rule:** Data under legal hold cannot be deleted regardless of retention policy.

**Rationale:** Legal preservation requirements.

**Enforcement:**
- AuditLog.canBeDeleted() checks legal hold
- Deletion service skips legal hold data
- Legal hold requires case ID and reason
- Only authorized users can place/release holds

### 5. Retention Policy Priority

**Rule:** When multiple policies apply, the longest retention period takes precedence.

**Rationale:** Conservative approach to comply with all applicable regulations.

**Enforcement:**
- Policies have priority field
- Retention service evaluates all applicable policies
- Maximum retention period used
- Financial data: 7 years (regulatory requirement)
- Security logs: Minimum 1 year
- General data: Tenant tier default

---

## Use Cases

### Use Case 1: Record User Login Event

**Actor:** System (Identity Context)

**Trigger:** User successfully authenticates

**Preconditions:**
- User has valid credentials
- Authentication successful

**Flow:**
1. Identity Context authenticates user
2. Identity Context emits UserAuthenticated event
3. Audit Context receives event
4. AuditService.logLogin() called with:
   - userId
   - tenantId
   - AuditContext (IP, user agent, location)
   - success = true
5. AuditLog.create() creates immutable log:
   - eventType = USER_LOGIN
   - eventCategory = AUTHENTICATION
   - severity = LOW
   - actor = user
   - resource = user account
   - action = "User logged in"
   - outcome = SUCCESS
   - retentionPolicy = 1 year minimum
6. AuditLog persisted to append-only store
7. AuditLogCreated event emitted
8. SIEM system receives event for security monitoring

**Postconditions:**
- Login recorded in audit trail
- Available for compliance reporting
- Searchable in audit log interface

---

### Use Case 2: Process GDPR Data Access Request

**Actor:** User

**Trigger:** User submits "Download my data" request

**Preconditions:**
- User has active account
- User authenticated

**Flow:**
1. User clicks "Download my data" in settings
2. UI shows explanation of request process
3. User confirms request
4. DataSubjectRequest.create() creates request:
   - requestType = ACCESS
   - status = PENDING
   - deadline = now + 30 days
   - legalBasis = GDPR Article 15
5. DataSubjectRequestCreated event emitted
6. Admin receives notification
7. System sends verification email with unique link
8. User clicks verification link
9. Admin verifies identity: DataSubjectRequest.verifyIdentity()
   - method = EMAIL_CONFIRMATION
   - status → VERIFIED
10. Admin assigns to compliance team member
11. Compliance member starts processing: DataSubjectRequest.assignTo()
    - status → IN_PROGRESS
12. System collects data from all contexts:
    - Profile Context: User profile, preferences, habits
    - Calendar Context: Events, meetings
    - Communication Context: Messages, contacts
    - Finance Context: Accounts, transactions
    - Plugin Context: Connected services
    - Audit Context: Audit logs
13. Data transformed to JSON format
14. DataPackage created with all data files
15. Package uploaded to secure storage
16. DataSubjectRequest.completeAccessRequest() completes request:
    - status → COMPLETED
    - outcome = FULFILLED
    - outputUrl = download link (expires in 7 days)
17. RequestCompleted event emitted
18. User receives email with download link
19. User downloads data package (ZIP file)

**Postconditions:**
- User has copy of all personal data
- Request completed within deadline
- Audit trail records entire process
- Data package auto-deleted after 7 days

**GDPR Compliance:**
- Article 15: Right to access
- Article 12(3): 30-day response time
- Article 20: Data portability (machine-readable format)

---

### Use Case 3: Execute Retention Policy and Auto-Delete Expired Data

**Actor:** System (Retention Policy Service)

**Trigger:** Scheduled job (daily at 2am UTC)

**Preconditions:**
- Retention policies configured for tenant
- No legal holds on expired data

**Flow:**
1. Retention Policy Service runs daily job
2. For each tenant:
   - Retrieve all retention policies
   - Order by priority (longest retention first)
3. For each data category (audit logs, user profiles, documents, etc.):
   - Query records older than retention period
   - Filter out records with legal holds
   - Generate deletion summary (dry run)
4. For audit logs specifically:
   - Query AuditLog.shouldBeRetained()
   - Identify logs eligible for deletion:
     - retention expired
     - no legal hold
     - not marked for preservation
5. For each eligible log:
   - Verify no related legal holds
   - Verify not referenced by active data subject requests
6. Execute deletion:
   - Soft delete first (mark as deleted, retain for 30 days)
   - Hard delete after 30-day grace period
   - Create DeletionLog for compliance
7. Generate daily retention report:
   - Records evaluated
   - Records deleted
   - Records retained (with reasons)
   - Storage freed
8. Email report to compliance team
9. Update retention metrics dashboard

**Postconditions:**
- Expired data deleted per policy
- Storage freed
- Deletion logged for audit
- Compliance maintained

**Example Retention Periods:**
- Community tier audit logs: 90 days
- Cloud tier audit logs: 1 year
- Enterprise audit logs: 7 years
- Authentication events: Minimum 1 year (all tiers)
- Financial transactions: 7 years (regulatory)
- Health records: 10 years (HIPAA)
- Marketing consent: Until withdrawn

---

## Repository Interfaces

### AuditLogRepository

```typescript
interface AuditLogRepository {
  // Append-only operations
  append(log: AuditLog): Promise<void>;
  appendBatch(logs: AuditLog[]): Promise<void>;

  // Query operations
  findById(auditId: string): Promise<AuditLog | null>;
  findByTenant(
    tenantId: string,
    filters: AuditFilters,
    pagination: Pagination
  ): Promise<AuditLog[]>;

  findByUser(
    userId: string,
    tenantId: string,
    filters: AuditFilters,
    pagination: Pagination
  ): Promise<AuditLog[]>;

  findByResource(
    resource: Resource,
    tenantId: string,
    pagination: Pagination
  ): Promise<AuditLog[]>;

  // Legal hold operations
  findUnderLegalHold(tenantId: string): Promise<AuditLog[]>;

  // Retention operations
  findExpired(policy: RetentionPolicy, limit: number): Promise<AuditLog[]>;
  deleteExpired(auditIds: string[]): Promise<number>; // Returns count deleted

  // Export operations
  export(
    tenantId: string,
    filters: AuditFilters,
    format: ExportFormat
  ): Promise<ReadableStream>;
}

interface AuditFilters {
  eventTypes?: AuditEventType[];
  eventCategories?: EventCategory[];
  severities?: Severity[];
  actors?: string[]; // Actor IDs
  resources?: Resource[];
  startDate?: Date;
  endDate?: Date;
  outcome?: Outcome;
}
```

### DataSubjectRequestRepository

```typescript
interface DataSubjectRequestRepository {
  // Basic CRUD
  save(request: DataSubjectRequest): Promise<void>;
  findById(requestId: string): Promise<DataSubjectRequest | null>;
  update(request: DataSubjectRequest): Promise<void>;

  // Query operations
  findByUser(userId: string, tenantId: string): Promise<DataSubjectRequest[]>;
  findByTenant(tenantId: string, status?: RequestStatus): Promise<DataSubjectRequest[]>;
  findOverdue(tenantId?: string): Promise<DataSubjectRequest[]>;
  findPendingVerification(tenantId?: string): Promise<DataSubjectRequest[]>;

  // Assignment operations
  findAssignedTo(adminId: string): Promise<DataSubjectRequest[]>;
  findUnassigned(tenantId: string): Promise<DataSubjectRequest[]>;

  // Metrics
  countByStatus(tenantId: string): Promise<Record<RequestStatus, number>>;
  averageCompletionTime(tenantId: string, days: number): Promise<number>;
}
```

---

## Integration Points

### Inbound (Audit & Compliance Context consumes)

| **Source Context** | **Event** | **Purpose** |
|-------------------|-----------|-------------|
| ALL CONTEXTS | Any Domain Event | Create audit logs |
| Identity Context | UserAuthenticated | Log authentication |
| Identity Context | UserRegistrationCompleted | Log user creation |
| Plugin Context | ConnectionCompleted | Log plugin connection |
| Profile Context | PreferenceSet | Log preference changes |
| Calendar Context | EventCreated | Log data creation |

### Outbound (Audit & Compliance Context publishes)

| **Event** | **Subscribers** |
|-----------|----------------|
| DataSubjectRequestCreated | Notification Context, Compliance Dashboard |
| RequestCompleted | Notification Context, User |
| IdentityVerified | Notification Context |
| LegalHoldPlaced | All Contexts (prevent deletion) |
| LegalHoldReleased | All Contexts (resume normal retention) |

---

## Testing Strategy

### Unit Tests

```typescript
describe('AuditLog', () => {
  it('should create immutable audit log');
  it('should categorize event types correctly');
  it('should determine severity based on event and outcome');
  it('should apply correct retention policy');
  it('should prevent deletion when legal hold active');
  it('should redact sensitive fields in changes');
});

describe('DataSubjectRequest', () => {
  it('should create request with 30-day deadline');
  it('should verify identity and transition to VERIFIED');
  it('should complete access request with data package');
  it('should complete erasure request with deletion summary');
  it('should request extension and update deadline');
  it('should detect overdue requests');
});
```

### Integration Tests

```typescript
describe('Audit Trail Flow', () => {
  it('should log all authentication events');
  it('should log data access across contexts');
  it('should enforce immutability of logs');
  it('should execute retention policy correctly');
});

describe('GDPR Request Flow', () => {
  it('should process access request end-to-end');
  it('should process erasure request and delete data');
  it('should respect legal holds during deletion');
  it('should complete within 30-day deadline');
});
```

---

## Implementation Notes

### Append-Only Storage

**Database Strategy:**
- PostgreSQL with append-only table (no UPDATE/DELETE)
- Partitioned by month for performance
- Immutable indexes on tenantId, eventType, timestamp
- Separate archive database for old logs

### Event Sourcing

**Pattern:**
- Audit logs stored as events
- Queryable via event store
- Replayed for compliance reports
- Immutable event history

### Data Deletion Choreography

**Multi-Context Deletion:**
1. Deletion Service publishes UserDataDeletionRequested event
2. Each context subscribes and deletes its data
3. Each context publishes ContextDataDeleted event
4. Deletion Service aggregates responses
5. Deletion Service creates DeletionSummary
6. Retained records documented with legal basis

---

## Summary

The **Audit & Compliance Context** ensures Fidus meets regulatory requirements and provides transparency. Key characteristics:

- **Comprehensive Audit Logs:** Record all significant events (authentication, data access, admin actions)
- **Immutable Event Store:** Append-only storage for audit integrity
- **GDPR/CCPA Compliance:** Data access, erasure, portability requests
- **Retention Policies:** Automated data lifecycle management
- **Legal Hold Support:** Preserve data for legal proceedings
- **Compliance Reporting:** SOC 2, GDPR, data breach reports
- **Multi-Tenant Isolation:** Audit logs scoped per tenant
- **Plan-Based Features:** Basic (Community), Standard (Cloud), Advanced (Enterprise)
- **30-Day SLA:** Meet GDPR response timeline
- **Secure Deletion:** Orchestrated deletion across all contexts

This domain model provides the foundation for Fidus to be trusted with sensitive personal data and meet enterprise compliance requirements.
