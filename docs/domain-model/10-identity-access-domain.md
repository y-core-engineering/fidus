# Identity & Access Domain - Detailed Model

**Version:** 1.0
**Date:** 2025-10-27
**Status:** Draft
**Context:** Identity & Access Context (Supporting Domain)

## Overview

The Identity & Access Domain is a **Supporting Domain** responsible for user authentication, authorization, and tenant management. It provides the foundational security layer for all other domains.

**Key Responsibilities:**
- User identity management (registration, authentication)
- Multi-tenant isolation and management
- Role-based access control (RBAC)
- Session management
- SSO integration (SAML, OIDC) for Enterprise tier

---

## Core Entities

### 1. User (Aggregate Root)

**Description:** Represents a system user with authentication credentials and roles.

**Invariants:**
- Email must be unique across tenants (or unique within tenant depending on deployment)
- Password must meet security requirements
- Cannot delete user with active sessions
- Must have at least one role

**State:**
```typescript
class User {
  // Identity
  private readonly id: string;
  private readonly tenantId: string;

  // Profile
  private email: Email; // Value Object
  private displayName: string;
  private passwordHash?: PasswordHash; // Value Object (optional for SSO users)

  // Authentication
  private authenticationMethod: AuthMethod;
  private ssoProvider?: SSOProvider;
  private ssoUserId?: string;

  // Status
  private status: UserStatus;
  private emailVerified: boolean;
  private verificationToken?: string;
  private lastLoginAt?: Date;
  private failedLoginAttempts: number;
  private lockedUntil?: Date;

  // Authorization
  private roles: Role[] = []; // Value Object
  private permissions: Permission[] = []; // Directly assigned permissions

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}

enum AuthMethod {
  PASSWORD = 'password',
  SSO_SAML = 'sso_saml',
  SSO_OIDC = 'sso_oidc',
  MAGIC_LINK = 'magic_link'
}

enum UserStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  DELETED = 'deleted'
}
```

**Commands:**

```typescript
// Register new user
static register(
  email: Email,
  password: string,
  tenantId: string,
  displayName: string
): User {
  const user = new User(
    generateId(),
    tenantId,
    email,
    displayName
  );

  // Hash password
  user.passwordHash = PasswordHash.create(password);
  user.authenticationMethod = AuthMethod.PASSWORD;
  user.status = UserStatus.PENDING_VERIFICATION;
  user.emailVerified = false;
  user.verificationToken = generateToken();
  user.roles = [Role.USER]; // Default role

  return user;
}

// Authenticate with password
authenticate(password: string): UserAuthenticated | AuthenticationFailed {
  // Check if locked
  if (this.isLocked()) {
    return new AuthenticationFailed({
      userId: this.id,
      reason: 'Account locked',
      lockedUntil: this.lockedUntil
    });
  }

  // Check if active
  if (this.status !== UserStatus.ACTIVE) {
    return new AuthenticationFailed({
      userId: this.id,
      reason: `Account status: ${this.status}`
    });
  }

  // Verify password
  if (!this.passwordHash?.verify(password)) {
    this.failedLoginAttempts++;

    // Lock after 5 failed attempts
    if (this.failedLoginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min
      this.status = UserStatus.LOCKED;

      return new AuthenticationFailed({
        userId: this.id,
        reason: 'Too many failed attempts',
        lockedUntil: this.lockedUntil
      });
    }

    return new AuthenticationFailed({
      userId: this.id,
      reason: 'Invalid credentials',
      attemptsRemaining: 5 - this.failedLoginAttempts
    });
  }

  // Success
  this.failedLoginAttempts = 0;
  this.lastLoginAt = new Date();

  return new UserAuthenticated({
    userId: this.id,
    tenantId: this.tenantId,
    email: this.email.value,
    roles: this.roles.map(r => r.name),
    authenticatedAt: this.lastLoginAt
  });
}

// Verify email
verifyEmail(token: string): EmailVerified | VerificationFailed {
  if (this.verificationToken !== token) {
    return new VerificationFailed({
      userId: this.id,
      reason: 'Invalid token'
    });
  }

  this.emailVerified = true;
  this.status = UserStatus.ACTIVE;
  this.verificationToken = undefined;

  return new EmailVerified({
    userId: this.id,
    email: this.email.value,
    verifiedAt: new Date()
  });
}

// Assign role
assignRole(role: Role): RoleAssigned {
  if (this.hasRole(role)) {
    throw new Error('User already has this role');
  }

  this.roles.push(role);

  return new RoleAssigned({
    userId: this.id,
    tenantId: this.tenantId,
    roleName: role.name,
    assignedAt: new Date()
  });
}

// Grant permission
grantPermission(permission: Permission): PermissionGranted {
  if (this.hasPermission(permission)) {
    throw new Error('User already has this permission');
  }

  this.permissions.push(permission);

  return new PermissionGranted({
    userId: this.id,
    tenantId: this.tenantId,
    permission: permission.toString(),
    grantedAt: new Date()
  });
}

// Reset password
resetPassword(newPassword: string): PasswordReset {
  this.passwordHash = PasswordHash.create(newPassword);
  this.failedLoginAttempts = 0;
  this.lockedUntil = undefined;

  if (this.status === UserStatus.LOCKED) {
    this.status = UserStatus.ACTIVE;
  }

  return new PasswordReset({
    userId: this.id,
    resetAt: new Date()
  });
}
```

**Queries:**

```typescript
// Check if user has role
hasRole(role: Role): boolean {
  return this.roles.some(r => r.equals(role));
}

// Check if user has permission
hasPermission(permission: Permission): boolean {
  // Check direct permissions
  if (this.permissions.some(p => p.equals(permission))) {
    return true;
  }

  // Check role permissions
  return this.roles.some(role =>
    role.hasPermission(permission)
  );
}

// Check if locked
isLocked(): boolean {
  if (this.status === UserStatus.LOCKED) {
    if (this.lockedUntil && new Date() > this.lockedUntil) {
      // Lock expired
      this.status = UserStatus.ACTIVE;
      this.lockedUntil = undefined;
      this.failedLoginAttempts = 0;
      return false;
    }
    return true;
  }
  return false;
}

// Get all permissions (direct + from roles)
getAllPermissions(): Permission[] {
  const permissionsFromRoles = this.roles.flatMap(role =>
    role.getPermissions()
  );

  return [...this.permissions, ...permissionsFromRoles];
}
```

---

### 2. Tenant (Aggregate Root)

**Description:** Represents an organizational unit (individual, family, team, company).

**Invariants:**
- Tenant name must be unique
- Must have at least one owner
- Cannot delete tenant with active users

**State:**
```typescript
class Tenant {
  // Identity
  private readonly id: string;

  // Profile
  private name: string;
  private type: TenantType;
  private plan: PlanTier;

  // Ownership
  private ownerId: string; // User ID of owner
  private memberIds: string[] = [];

  // Settings
  private settings: TenantSettings;
  private ssoConfig?: SSOConfig;

  // Quotas
  private quotas: TenantQuotas; // Value Object
  private usage: TenantUsage; // Value Object

  // Status
  private status: TenantStatus;
  private suspendedReason?: string;

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}

enum TenantType {
  INDIVIDUAL = 'individual',
  FAMILY = 'family',
  TEAM = 'team',
  COMPANY = 'company'
}

enum PlanTier {
  COMMUNITY = 'community',
  CLOUD = 'cloud',
  ENTERPRISE = 'enterprise'
}

enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  CANCELLED = 'cancelled'
}
```

**Commands:**

```typescript
// Create tenant
static create(
  name: string,
  type: TenantType,
  ownerId: string,
  plan: PlanTier = PlanTier.COMMUNITY
): Tenant {
  const tenant = new Tenant(
    generateId(),
    name,
    type,
    ownerId,
    plan
  );

  tenant.status = TenantStatus.ACTIVE;
  tenant.memberIds = [ownerId];
  tenant.quotas = TenantQuotas.forPlan(plan);
  tenant.usage = TenantUsage.empty();
  tenant.settings = TenantSettings.default();

  return tenant;
}

// Add member
addMember(userId: string, addedBy: string): MemberAdded {
  // Check quotas
  if (this.memberIds.length >= this.quotas.maxMembers) {
    throw new Error('Member limit reached');
  }

  if (this.memberIds.includes(userId)) {
    throw new Error('User already a member');
  }

  this.memberIds.push(userId);

  return new MemberAdded({
    tenantId: this.id,
    userId,
    addedBy,
    addedAt: new Date()
  });
}

// Remove member
removeMember(userId: string, removedBy: string): MemberRemoved {
  if (userId === this.ownerId) {
    throw new Error('Cannot remove tenant owner');
  }

  this.memberIds = this.memberIds.filter(id => id !== userId);

  return new MemberRemoved({
    tenantId: this.id,
    userId,
    removedBy,
    removedAt: new Date()
  });
}

// Configure SSO
configureSSOSetup(config: SSOConfig): SSOConfigured {
  if (this.plan !== PlanTier.ENTERPRISE) {
    throw new Error('SSO only available for Enterprise plan');
  }

  this.ssoConfig = config;

  return new SSOConfigured({
    tenantId: this.id,
    provider: config.provider,
    configuredAt: new Date()
  });
}

// Update quotas (plan upgrade)
updateQuotas(newQuotas: TenantQuotas): QuotasUpdated {
  const oldQuotas = this.quotas;
  this.quotas = newQuotas;

  return new QuotasUpdated({
    tenantId: this.id,
    oldQuotas: oldQuotas.toJSON(),
    newQuotas: newQuotas.toJSON()
  });
}

// Record usage
recordUsage(metric: UsageMetric, amount: number): void {
  this.usage.increment(metric, amount);

  // Check if quota exceeded
  if (this.usage.exceeds(this.quotas, metric)) {
    // Emit warning event
    this.emitQuotaExceeded(metric);
  }
}
```

---

### 3. AuthenticationSession (Aggregate Root)

**Description:** Represents an active user session.

**State:**
```typescript
class AuthenticationSession {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Tokens
  private accessToken: AccessToken; // Value Object
  private refreshToken: RefreshToken; // Value Object

  // Session info
  private ipAddress: string;
  private userAgent: string;
  private deviceId?: string;

  // Lifecycle
  private createdAt: Date;
  private expiresAt: Date;
  private lastActivityAt: Date;
  private terminatedAt?: Date;
}
```

**Commands:**

```typescript
// Create session
static create(
  userId: string,
  tenantId: string,
  ipAddress: string,
  userAgent: string
): AuthenticationSession {
  const session = new AuthenticationSession(
    generateId(),
    userId,
    tenantId
  );

  session.accessToken = AccessToken.generate(userId, tenantId);
  session.refreshToken = RefreshToken.generate(userId, tenantId);
  session.ipAddress = ipAddress;
  session.userAgent = userAgent;
  session.createdAt = new Date();
  session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  session.lastActivityAt = new Date();

  return session;
}

// Refresh tokens
refresh(): TokensRefreshed {
  if (this.isExpired()) {
    throw new Error('Session expired');
  }

  // Generate new access token
  this.accessToken = AccessToken.generate(this.userId, this.tenantId);
  this.lastActivityAt = new Date();

  return new TokensRefreshed({
    sessionId: this.id,
    userId: this.userId,
    newAccessToken: this.accessToken.value
  });
}

// Terminate session
terminate(reason: string): SessionTerminated {
  this.terminatedAt = new Date();

  return new SessionTerminated({
    sessionId: this.id,
    userId: this.userId,
    reason,
    terminatedAt: this.terminatedAt
  });
}
```

**Queries:**

```typescript
isExpired(): boolean {
  return new Date() > this.expiresAt;
}

isActive(): boolean {
  return !this.terminatedAt && !this.isExpired();
}
```

---

## Value Objects

### Email

```typescript
class Email {
  private constructor(public readonly value: string) {}

  static create(email: string): Email {
    const normalized = email.toLowerCase().trim();

    if (!this.isValid(normalized)) {
      throw new Error('Invalid email format');
    }

    return new Email(normalized);
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

### PasswordHash

```typescript
class PasswordHash {
  private constructor(
    private readonly hash: string,
    private readonly algorithm: string = 'bcrypt'
  ) {}

  static create(password: string): PasswordHash {
    // Validate password requirements
    if (!this.meetsRequirements(password)) {
      throw new Error('Password does not meet security requirements');
    }

    // Hash with bcrypt (cost factor 12)
    const hash = bcrypt.hashSync(password, 12);

    return new PasswordHash(hash, 'bcrypt');
  }

  verify(password: string): boolean {
    return bcrypt.compareSync(password, this.hash);
  }

  private static meetsRequirements(password: string): boolean {
    // Minimum 8 characters
    if (password.length < 8) return false;

    // At least one uppercase, one lowercase, one number
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUppercase && hasLowercase && hasNumber;
  }
}
```

### Role

```typescript
class Role {
  constructor(
    public readonly name: string,
    private readonly permissions: Permission[] = []
  ) {}

  static USER = new Role('user', [
    Permission.READ_OWN_DATA,
    Permission.WRITE_OWN_DATA
  ]);

  static ADMIN = new Role('admin', [
    Permission.READ_ALL_DATA,
    Permission.WRITE_ALL_DATA,
    Permission.MANAGE_USERS
  ]);

  static OWNER = new Role('owner', [
    Permission.READ_ALL_DATA,
    Permission.WRITE_ALL_DATA,
    Permission.MANAGE_USERS,
    Permission.MANAGE_TENANT
  ]);

  hasPermission(permission: Permission): boolean {
    return this.permissions.some(p => p.equals(permission));
  }

  getPermissions(): Permission[] {
    return [...this.permissions];
  }

  equals(other: Role): boolean {
    return this.name === other.name;
  }
}
```

### Permission

```typescript
class Permission {
  constructor(
    public readonly resource: string,
    public readonly action: string
  ) {}

  // Common permissions
  static READ_OWN_DATA = new Permission('user_data', 'read_own');
  static WRITE_OWN_DATA = new Permission('user_data', 'write_own');
  static READ_ALL_DATA = new Permission('tenant_data', 'read_all');
  static WRITE_ALL_DATA = new Permission('tenant_data', 'write_all');
  static MANAGE_USERS = new Permission('users', 'manage');
  static MANAGE_TENANT = new Permission('tenant', 'manage');

  toString(): string {
    return `${this.resource}:${this.action}`;
  }

  equals(other: Permission): boolean {
    return this.resource === other.resource && this.action === other.action;
  }

  static parse(str: string): Permission {
    const [resource, action] = str.split(':');
    return new Permission(resource, action);
  }
}
```

### AccessToken

```typescript
class AccessToken {
  private constructor(
    public readonly value: string,
    public readonly expiresAt: Date
  ) {}

  static generate(userId: string, tenantId: string): AccessToken {
    const payload = {
      userId,
      tenantId,
      type: 'access',
      iat: Date.now()
    };

    // Sign with JWT (15 min expiry)
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m'
    });

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    return new AccessToken(token, expiresAt);
  }

  static verify(token: string): AccessToken | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return new AccessToken(token, new Date(decoded.exp * 1000));
    } catch {
      return null;
    }
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
```

### RefreshToken

```typescript
class RefreshToken {
  private constructor(
    public readonly value: string,
    public readonly expiresAt: Date
  ) {}

  static generate(userId: string, tenantId: string): RefreshToken {
    const payload = {
      userId,
      tenantId,
      type: 'refresh',
      iat: Date.now()
    };

    // Sign with JWT (7 days expiry)
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return new RefreshToken(token, expiresAt);
  }
}
```

### TenantQuotas

```typescript
class TenantQuotas {
  constructor(
    public readonly maxMembers: number,
    public readonly maxStorage: number, // bytes
    public readonly maxApiCalls: number, // per month
    public readonly maxSupervisors: number
  ) {}

  static forPlan(plan: PlanTier): TenantQuotas {
    switch (plan) {
      case PlanTier.COMMUNITY:
        return new TenantQuotas(1, 1 * GB, 10000, 8);
      case PlanTier.CLOUD:
        return new TenantQuotas(5, 10 * GB, 100000, 12);
      case PlanTier.ENTERPRISE:
        return new TenantQuotas(100, 100 * GB, 1000000, Infinity);
    }
  }

  toJSON(): any {
    return {
      maxMembers: this.maxMembers,
      maxStorage: this.maxStorage,
      maxApiCalls: this.maxApiCalls,
      maxSupervisors: this.maxSupervisors
    };
  }
}

const GB = 1024 * 1024 * 1024;
```

### TenantUsage

```typescript
class TenantUsage {
  constructor(
    private storage: number = 0,
    private apiCalls: number = 0,
    private activeMembers: number = 0
  ) {}

  static empty(): TenantUsage {
    return new TenantUsage(0, 0, 0);
  }

  increment(metric: UsageMetric, amount: number): void {
    switch (metric) {
      case UsageMetric.STORAGE:
        this.storage += amount;
        break;
      case UsageMetric.API_CALLS:
        this.apiCalls += amount;
        break;
      case UsageMetric.ACTIVE_MEMBERS:
        this.activeMembers += amount;
        break;
    }
  }

  exceeds(quotas: TenantQuotas, metric: UsageMetric): boolean {
    switch (metric) {
      case UsageMetric.STORAGE:
        return this.storage > quotas.maxStorage;
      case UsageMetric.API_CALLS:
        return this.apiCalls > quotas.maxApiCalls;
      case UsageMetric.ACTIVE_MEMBERS:
        return this.activeMembers > quotas.maxMembers;
    }
  }
}

enum UsageMetric {
  STORAGE = 'storage',
  API_CALLS = 'api_calls',
  ACTIVE_MEMBERS = 'active_members'
}
```

---

## Domain Events

```typescript
interface UserRegistered extends DomainEvent {
  eventType: 'UserRegistered';
  aggregateType: 'User';
  payload: {
    userId: string;
    tenantId: string;
    email: string;
    displayName: string;
    registeredAt: Date;
  };
}

interface UserAuthenticated extends DomainEvent {
  eventType: 'UserAuthenticated';
  aggregateType: 'User';
  payload: {
    userId: string;
    tenantId: string;
    email: string;
    roles: string[];
    authenticatedAt: Date;
  };
}

interface AuthenticationFailed extends DomainEvent {
  eventType: 'AuthenticationFailed';
  aggregateType: 'User';
  payload: {
    userId: string;
    reason: string;
    lockedUntil?: Date;
    attemptsRemaining?: number;
  };
}

interface EmailVerified extends DomainEvent {
  eventType: 'EmailVerified';
  aggregateType: 'User';
  payload: {
    userId: string;
    email: string;
    verifiedAt: Date;
  };
}

interface RoleAssigned extends DomainEvent {
  eventType: 'RoleAssigned';
  aggregateType: 'User';
  payload: {
    userId: string;
    tenantId: string;
    roleName: string;
    assignedAt: Date;
  };
}

interface PermissionGranted extends DomainEvent {
  eventType: 'PermissionGranted';
  aggregateType: 'User';
  payload: {
    userId: string;
    tenantId: string;
    permission: string;
    grantedAt: Date;
  };
}

interface TenantCreated extends DomainEvent {
  eventType: 'TenantCreated';
  aggregateType: 'Tenant';
  payload: {
    tenantId: string;
    name: string;
    type: TenantType;
    plan: PlanTier;
    ownerId: string;
    createdAt: Date;
  };
}

interface MemberAdded extends DomainEvent {
  eventType: 'MemberAdded';
  aggregateType: 'Tenant';
  payload: {
    tenantId: string;
    userId: string;
    addedBy: string;
    addedAt: Date;
  };
}

interface SSOConfigured extends DomainEvent {
  eventType: 'SSOConfigured';
  aggregateType: 'Tenant';
  payload: {
    tenantId: string;
    provider: string;
    configuredAt: Date;
  };
}

interface SessionTerminated extends DomainEvent {
  eventType: 'SessionTerminated';
  aggregateType: 'AuthenticationSession';
  payload: {
    sessionId: string;
    userId: string;
    reason: string;
    terminatedAt: Date;
  };
}
```

---

## Business Rules

### Rule 1: Password Policy
**Description:** Passwords must be >= 8 characters with uppercase, lowercase, and number
**Rationale:** OWASP security guidelines

### Rule 2: Account Lockout
**Description:** Account locked for 30 minutes after 5 failed login attempts
**Rationale:** Prevent brute force attacks

### Rule 3: Session Expiry
**Description:** Access tokens expire after 15 minutes, refresh tokens after 7 days
**Rationale:** Balance security and UX

### Rule 4: Email Uniqueness
**Description:** Email must be unique within tenant (or globally depending on deployment)
**Rationale:** Prevent identity confusion

### Rule 5: Role Hierarchy
**Description:** OWNER > ADMIN > USER
**Rationale:** Clear permission hierarchy

---

## Use Cases

### UC1: User Registration

**Flow:**
1. User submits email + password
2. Create User aggregate (status: PENDING_VERIFICATION)
3. Generate verification token
4. Emit UserRegistered event
5. Email verification link
6. User clicks link
7. Verify email
8. Status → ACTIVE
9. Emit EmailVerified event

### UC2: SSO Authentication (Enterprise)

**Flow:**
1. User clicks "Login with Okta"
2. Redirect to Okta (SAML)
3. User authenticates with Okta
4. Okta returns SAML assertion
5. Validate assertion
6. Lookup user by SSO ID
7. If not exists: auto-provision user (if enabled)
8. Create AuthenticationSession
9. Issue access + refresh tokens
10. Emit UserAuthenticated event

### UC3: Permission Check

**Flow:**
1. Request comes in with access token
2. Validate token
3. Load User aggregate
4. Check user.hasPermission(requested permission)
5. Check role permissions if not direct
6. Allow/deny request

---

## Multi-Tenancy Considerations

### Tenant Isolation

All data is isolated by `tenantId`:
- Database queries MUST include `WHERE tenantId = ?`
- Cross-tenant access is forbidden (except for platform admins)
- SSO configuration is per-tenant

### Shared Resources

Family/Team members can share:
- Calendar events
- Shopping lists
- Budgets

Access controlled via `SharedResource` with ACL.

---

## Persistence

```typescript
interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email, tenantId?: string): Promise<User | null>;
  findByTenant(tenantId: string): Promise<User[]>;
}

interface TenantRepository {
  save(tenant: Tenant): Promise<void>;
  findById(id: string): Promise<Tenant | null>;
  findByName(name: string): Promise<Tenant | null>;
}

interface SessionRepository {
  save(session: AuthenticationSession): Promise<void>;
  findById(id: string): Promise<AuthenticationSession | null>;
  findByUserId(userId: string): Promise<AuthenticationSession[]>;
  deleteExpired(): Promise<number>; // Cleanup job
}
```

---

## Testing Strategy

```typescript
describe('User', () => {
  it('should reject weak passwords', () => {
    expect(() =>
      User.register(Email.create('test@example.com'), 'weak', 'tenant-1', 'Test')
    ).toThrow('Password does not meet security requirements');
  });

  it('should lock account after 5 failed attempts', () => {
    const user = createActiveUser();

    for (let i = 0; i < 5; i++) {
      user.authenticate('wrong-password');
    }

    expect(user.status).toBe(UserStatus.LOCKED);
    expect(user.lockedUntil).toBeDefined();
  });
});
```

---

**End of Document**
