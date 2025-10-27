# Plugin Domain Model

## Overview

The **Plugin Context** is a **Supporting Domain** in Fidus that manages integrations with external services, APIs, and data sources. It provides a unified framework for connecting to third-party services (Google, Apple, Microsoft, etc.), managing credentials, handling OAuth flows, syncing data, and orchestrating plugin lifecycle.

**Relationship to Bounded Context:**
- This **domain model** defines WHAT the Plugin Context does (aggregates, events, rules)
- The **PluginSupervisor** (architecture) defines HOW it's implemented (MCP servers, OAuth providers, sync schedulers)

---

## Multi-Tenancy Considerations

The Plugin Context operates with **tenant-level control** and **user-level credentials**:

| **Tenant Type** | **Plugin Capabilities** |
|-----------------|------------------------|
| **INDIVIDUAL** | User manages own plugin connections, personal credentials |
| **FAMILY** | Family admin can enable/disable plugins, users have individual credentials |
| **TEAM** | Team admin controls available plugins, users authenticate individually |
| **COMPANY** | IT admin provisions enterprise plugins, SSO integration, centralized credential management |

**Tenant-Specific Features:**
- **Community Tier:** 3 plugin connections, basic sync (hourly)
- **Cloud Tier:** 10 plugin connections, real-time webhooks, advanced sync settings
- **Enterprise Tier:** Unlimited plugins, custom integrations, SSO, audit logging, credential management

**Data Isolation:**
- All plugin connections scoped to `tenantId` and `userId`
- Credentials encrypted per-user with tenant-specific keys
- Plugin data synced to tenant-partitioned storage
- Webhook endpoints include tenant verification

---

## Core Bounded Context

**Name:** Plugin Context

**Type:** Supporting Domain (serves all Domain Contexts)

**Responsibility:** Manage integrations with external services, handle authentication flows, sync data bidirectionally, and provide unified access to third-party APIs via MCP.

**Domain Language:**
- **Plugin:** An integration with an external service
- **PluginConnection:** A user's configured connection to a plugin
- **Credential:** Authentication credentials for a plugin (API key, OAuth tokens)
- **Sync:** Process of synchronizing data between Fidus and external service
- **Webhook:** Real-time notification from external service
- **MCP Server:** Model Context Protocol server exposing plugin capabilities
- **Scope:** Specific permissions requested from external service
- **Rate Limit:** API usage constraints

---

## Aggregates

### 1. PluginConnection (Aggregate Root)

The **PluginConnection** represents a user's active connection to a specific plugin.

**Identity:**
- `connectionId: string` - Unique identifier
- `userId: string` - Owner of connection
- `tenantId: string` - Tenant scope
- `pluginId: string` - Reference to Plugin registry

**Core Attributes:**
- `pluginType: PluginType` - Type of plugin (CALENDAR | EMAIL | STORAGE | FINANCE | HEALTH | COMMUNICATION | CUSTOM)
- `provider: string` - Provider name (e.g., "google", "microsoft", "apple")
- `status: ConnectionStatus` - DISCONNECTED | CONNECTING | CONNECTED | ERROR | SUSPENDED
- `credentials: EncryptedCredentials` - Encrypted authentication credentials
- `scopes: Scope[]` - Granted permissions
- `config: ConnectionConfig` - User-specific configuration
- `syncSettings: SyncSettings` - Data sync preferences

**Sync State:**
- `lastSyncAt?: Date` - Last successful sync
- `nextSyncAt?: Date` - Next scheduled sync
- `syncStatus: SyncStatus` - IDLE | IN_PROGRESS | FAILED
- `syncErrors: SyncError[]` - Recent sync errors

**Metrics:**
- `totalSyncs: number` - Total sync count
- `failedSyncs: number` - Failed sync count
- `dataItemsSynced: number` - Total items synced
- `lastErrorAt?: Date`

**Lifecycle:**
- `connectedAt: Date`
- `lastUsedAt: Date`
- `expiresAt?: Date` - Token expiration

**Invariants:**
1. Credentials must be valid for status to be CONNECTED
2. Scopes must match plugin's available scopes
3. Sync settings must respect tenant quota limits
4. Connection cannot sync if status is ERROR or SUSPENDED
5. User can only have one active connection per plugin type and provider

**Commands:**

```typescript
class PluginConnection {
  // Core aggregate root
  private readonly connectionId: string;
  private readonly userId: string;
  private readonly tenantId: string;
  private readonly pluginId: string;

  private pluginType: PluginType;
  private provider: string;
  private status: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private credentials?: EncryptedCredentials;
  private scopes: Scope[] = [];
  private config: ConnectionConfig;
  private syncSettings: SyncSettings;

  private lastSyncAt?: Date;
  private nextSyncAt?: Date;
  private syncStatus: SyncStatus = SyncStatus.IDLE;
  private syncErrors: SyncError[] = [];

  private totalSyncs: number = 0;
  private failedSyncs: number = 0;
  private dataItemsSynced: number = 0;
  private lastErrorAt?: Date;

  private connectedAt?: Date;
  private lastUsedAt: Date;
  private expiresAt?: Date;

  // Command: Connect plugin (initiate OAuth flow)
  initiateConnection(
    redirectUri: string,
    requestedScopes: Scope[]
  ): ConnectionInitiated {
    if (this.status !== ConnectionStatus.DISCONNECTED) {
      throw new Error('Connection already exists');
    }

    this.status = ConnectionStatus.CONNECTING;
    this.scopes = requestedScopes;

    return new ConnectionInitiated({
      connectionId: this.connectionId,
      userId: this.userId,
      tenantId: this.tenantId,
      pluginId: this.pluginId,
      provider: this.provider,
      redirectUri,
      scopes: requestedScopes.map(s => s.name),
      timestamp: new Date()
    });
  }

  // Command: Complete connection (store credentials)
  completeConnection(
    credentials: Credentials,
    grantedScopes: Scope[],
    expiresIn?: number
  ): ConnectionCompleted | ConnectionFailed {
    if (this.status !== ConnectionStatus.CONNECTING) {
      return new ConnectionFailed({
        connectionId: this.connectionId,
        reason: 'Connection not in CONNECTING state',
        timestamp: new Date()
      });
    }

    // Validate granted scopes match requested
    const missingScopes = this.scopes.filter(
      requested => !grantedScopes.some(granted => granted.name === requested.name)
    );

    if (missingScopes.length > 0) {
      this.status = ConnectionStatus.ERROR;
      return new ConnectionFailed({
        connectionId: this.connectionId,
        reason: `Missing required scopes: ${missingScopes.map(s => s.name).join(', ')}`,
        timestamp: new Date()
      });
    }

    // Encrypt and store credentials
    this.credentials = EncryptedCredentials.encrypt(credentials, this.tenantId);
    this.scopes = grantedScopes;
    this.status = ConnectionStatus.CONNECTED;
    this.connectedAt = new Date();
    this.lastUsedAt = new Date();

    if (expiresIn) {
      this.expiresAt = new Date(Date.now() + expiresIn * 1000);
    }

    // Schedule initial sync
    this.scheduleNextSync();

    return new ConnectionCompleted({
      connectionId: this.connectionId,
      userId: this.userId,
      tenantId: this.tenantId,
      pluginId: this.pluginId,
      provider: this.provider,
      scopes: grantedScopes.map(s => s.name),
      timestamp: new Date()
    });
  }

  // Command: Refresh credentials (OAuth token refresh)
  async refreshCredentials(
    oauthService: OAuthService
  ): Promise<CredentialsRefreshed | CredentialsRefreshFailed> {
    if (!this.credentials) {
      throw new Error('No credentials to refresh');
    }

    if (!this.credentials.hasRefreshToken()) {
      throw new Error('No refresh token available');
    }

    try {
      const decrypted = this.credentials.decrypt(this.tenantId);
      const refreshed = await oauthService.refreshToken(
        this.provider,
        decrypted.refreshToken!
      );

      this.credentials = EncryptedCredentials.encrypt(refreshed, this.tenantId);
      this.expiresAt = new Date(Date.now() + refreshed.expiresIn * 1000);
      this.lastUsedAt = new Date();

      return new CredentialsRefreshed({
        connectionId: this.connectionId,
        expiresAt: this.expiresAt,
        timestamp: new Date()
      });
    } catch (error) {
      this.status = ConnectionStatus.ERROR;
      this.lastErrorAt = new Date();

      return new CredentialsRefreshFailed({
        connectionId: this.connectionId,
        reason: error.message,
        timestamp: new Date()
      });
    }
  }

  // Command: Execute sync
  async executeSync(
    syncService: SyncService
  ): Promise<SyncCompleted | SyncFailed> {
    if (this.status !== ConnectionStatus.CONNECTED) {
      throw new Error('Connection not in CONNECTED state');
    }

    if (this.syncStatus === SyncStatus.IN_PROGRESS) {
      throw new Error('Sync already in progress');
    }

    this.syncStatus = SyncStatus.IN_PROGRESS;
    const syncStartedAt = new Date();

    try {
      // Check if credentials need refresh
      if (this.needsCredentialRefresh()) {
        const refreshResult = await this.refreshCredentials(syncService.oauthService);
        if (refreshResult instanceof CredentialsRefreshFailed) {
          throw new Error('Failed to refresh credentials');
        }
      }

      const decrypted = this.credentials!.decrypt(this.tenantId);
      const result = await syncService.sync(
        this.pluginType,
        this.provider,
        decrypted,
        this.syncSettings
      );

      this.syncStatus = SyncStatus.IDLE;
      this.lastSyncAt = new Date();
      this.totalSyncs++;
      this.dataItemsSynced += result.itemCount;
      this.scheduleNextSync();

      // Clear old errors
      this.syncErrors = [];

      return new SyncCompleted({
        connectionId: this.connectionId,
        userId: this.userId,
        tenantId: this.tenantId,
        pluginId: this.pluginId,
        itemCount: result.itemCount,
        duration: Date.now() - syncStartedAt.getTime(),
        timestamp: new Date()
      });
    } catch (error) {
      this.syncStatus = SyncStatus.FAILED;
      this.failedSyncs++;
      this.lastErrorAt = new Date();

      const syncError = SyncError.create(error.message, syncStartedAt);
      this.syncErrors.push(syncError);

      // Keep only last 10 errors
      if (this.syncErrors.length > 10) {
        this.syncErrors = this.syncErrors.slice(-10);
      }

      // Suspend connection after 5 consecutive failures
      if (this.failedSyncs >= 5) {
        this.status = ConnectionStatus.SUSPENDED;
      }

      return new SyncFailed({
        connectionId: this.connectionId,
        userId: this.userId,
        tenantId: this.tenantId,
        pluginId: this.pluginId,
        reason: error.message,
        timestamp: new Date()
      });
    }
  }

  // Command: Disconnect plugin
  disconnect(): ConnectionDisconnected {
    this.status = ConnectionStatus.DISCONNECTED;
    this.credentials = undefined;
    this.syncStatus = SyncStatus.IDLE;
    this.nextSyncAt = undefined;

    return new ConnectionDisconnected({
      connectionId: this.connectionId,
      userId: this.userId,
      tenantId: this.tenantId,
      pluginId: this.pluginId,
      provider: this.provider,
      timestamp: new Date()
    });
  }

  // Command: Update sync settings
  updateSyncSettings(settings: SyncSettings): SyncSettingsUpdated {
    this.syncSettings = settings;
    this.scheduleNextSync();

    return new SyncSettingsUpdated({
      connectionId: this.connectionId,
      settings: settings.toJSON(),
      nextSyncAt: this.nextSyncAt,
      timestamp: new Date()
    });
  }

  // Query: Get connection status
  getStatus(): ConnectionStatus {
    return this.status;
  }

  // Query: Get sync health
  getSyncHealth(): SyncHealth {
    const successRate = this.totalSyncs > 0
      ? (this.totalSyncs - this.failedSyncs) / this.totalSyncs
      : 1.0;

    return {
      status: this.syncStatus,
      successRate,
      lastSyncAt: this.lastSyncAt,
      nextSyncAt: this.nextSyncAt,
      recentErrors: this.syncErrors.slice(-5)
    };
  }

  // Private: Check if credentials need refresh
  private needsCredentialRefresh(): boolean {
    if (!this.expiresAt) return false;
    // Refresh if expiring in next 5 minutes
    return Date.now() + 5 * 60 * 1000 >= this.expiresAt.getTime();
  }

  // Private: Schedule next sync
  private scheduleNextSync(): void {
    if (this.status !== ConnectionStatus.CONNECTED) return;

    const interval = this.syncSettings.getIntervalMs();
    this.nextSyncAt = new Date(Date.now() + interval);
  }
}
```

**Domain Events:**
- `ConnectionInitiated` - OAuth flow started
- `ConnectionCompleted` - Plugin connected successfully
- `ConnectionFailed` - Connection failed
- `ConnectionDisconnected` - Plugin disconnected
- `CredentialsRefreshed` - OAuth tokens refreshed
- `CredentialsRefreshFailed` - Token refresh failed
- `SyncCompleted` - Data sync completed
- `SyncFailed` - Data sync failed
- `SyncSettingsUpdated` - Sync settings changed

---

### 2. PluginRegistry (Aggregate Root)

The **PluginRegistry** maintains the catalog of available plugins.

**Identity:**
- `pluginId: string` - Unique identifier

**Core Attributes:**
- `name: string` - Display name
- `provider: string` - Provider identifier (e.g., "google", "microsoft")
- `pluginType: PluginType` - Plugin category
- `description: string`
- `iconUrl: string`
- `status: PluginStatus` - BETA | STABLE | DEPRECATED
- `availableScopes: Scope[]` - All possible scopes
- `defaultScopes: Scope[]` - Recommended scopes
- `capabilities: Capability[]` - What the plugin can do
- `mcpServerConfig: MCPServerConfig` - MCP server configuration

**Constraints:**
- `supportedTiers: PlanTier[]` - Which tiers can use this plugin
- `maxConnectionsPerUser: number` - Connection limit
- `rateLimits: RateLimit[]` - API rate limits

**Lifecycle:**
- `createdAt: Date`
- `updatedAt: Date`

---

## Value Objects

### 1. EncryptedCredentials

Encrypted storage of authentication credentials.

```typescript
class EncryptedCredentials {
  constructor(
    private readonly encryptedData: string,
    private readonly algorithm: string,
    private readonly keyId: string
  ) {}

  static encrypt(credentials: Credentials, tenantId: string): EncryptedCredentials {
    const key = getEncryptionKey(tenantId);
    const encrypted = encrypt(JSON.stringify(credentials), key, 'aes-256-gcm');
    return new EncryptedCredentials(encrypted, 'aes-256-gcm', key.id);
  }

  decrypt(tenantId: string): Credentials {
    const key = getEncryptionKey(tenantId, this.keyId);
    const decrypted = decrypt(this.encryptedData, key, this.algorithm);
    return JSON.parse(decrypted) as Credentials;
  }

  hasRefreshToken(): boolean {
    // Check without decrypting (stored in metadata)
    return this.metadata?.hasRefreshToken || false;
  }
}

interface Credentials {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType: string;
  scope?: string;
}
```

### 2. SyncSettings

User preferences for data synchronization.

```typescript
class SyncSettings {
  constructor(
    public readonly enabled: boolean,
    public readonly interval: SyncInterval,
    public readonly direction: SyncDirection,
    public readonly filters: SyncFilter[],
    public readonly conflictResolution: ConflictResolution
  ) {}

  getIntervalMs(): number {
    switch (this.interval) {
      case SyncInterval.REAL_TIME:
        return 5 * 60 * 1000; // 5 minutes
      case SyncInterval.HOURLY:
        return 60 * 60 * 1000;
      case SyncInterval.DAILY:
        return 24 * 60 * 60 * 1000;
      case SyncInterval.MANUAL:
        return Infinity;
    }
  }

  toJSON(): Record<string, any> {
    return {
      enabled: this.enabled,
      interval: this.interval,
      direction: this.direction,
      filters: this.filters.map(f => f.toJSON()),
      conflictResolution: this.conflictResolution
    };
  }
}

enum SyncInterval {
  REAL_TIME = 'REAL_TIME',   // Cloud+ tier only
  HOURLY = 'HOURLY',          // All tiers
  DAILY = 'DAILY',            // All tiers
  MANUAL = 'MANUAL'           // All tiers
}

enum SyncDirection {
  BIDIRECTIONAL = 'BIDIRECTIONAL', // Full sync
  INBOUND_ONLY = 'INBOUND_ONLY',   // Import only
  OUTBOUND_ONLY = 'OUTBOUND_ONLY'  // Export only
}

enum ConflictResolution {
  EXTERNAL_WINS = 'EXTERNAL_WINS',
  FIDUS_WINS = 'FIDUS_WINS',
  NEWEST_WINS = 'NEWEST_WINS',
  MANUAL = 'MANUAL'
}
```

### 3. Scope

Permission scope for plugin access.

```typescript
class Scope {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly required: boolean
  ) {}

  static readonly GOOGLE_CALENDAR_READ = new Scope(
    'https://www.googleapis.com/auth/calendar.readonly',
    'Read calendar events',
    false
  );

  static readonly GOOGLE_CALENDAR_WRITE = new Scope(
    'https://www.googleapis.com/auth/calendar',
    'Read and write calendar events',
    true
  );

  static readonly GOOGLE_CONTACTS_READ = new Scope(
    'https://www.googleapis.com/auth/contacts.readonly',
    'Read contacts',
    false
  );

  // ... more predefined scopes
}
```

### 4. SyncError

Record of a sync failure.

```typescript
class SyncError {
  constructor(
    public readonly message: string,
    public readonly occurredAt: Date,
    public readonly errorCode?: string,
    public readonly retryable: boolean = true
  ) {}

  static create(message: string, timestamp: Date): SyncError {
    // Parse error message to determine error code and retryability
    const errorCode = this.extractErrorCode(message);
    const retryable = this.isRetryable(errorCode);
    return new SyncError(message, timestamp, errorCode, retryable);
  }

  private static extractErrorCode(message: string): string | undefined {
    // Extract standard error codes (HTTP status, API error codes)
    const match = message.match(/\b(\d{3})\b/);
    return match ? match[1] : undefined;
  }

  private static isRetryable(errorCode?: string): boolean {
    if (!errorCode) return true;
    // Rate limit, server errors are retryable
    // Auth errors, not found are not retryable
    const retryableCodes = ['429', '500', '502', '503', '504'];
    return retryableCodes.includes(errorCode);
  }
}
```

### 5. SyncFilter

Filter to control what data is synced.

```typescript
class SyncFilter {
  constructor(
    public readonly field: string,
    public readonly operator: FilterOperator,
    public readonly value: any
  ) {}

  toJSON(): Record<string, any> {
    return {
      field: this.field,
      operator: this.operator,
      value: this.value
    };
  }

  // Example filters:
  static onlyFutureEvents(): SyncFilter {
    return new SyncFilter('startTime', FilterOperator.GREATER_THAN, new Date());
  }

  static onlyWorkCalendar(): SyncFilter {
    return new SyncFilter('calendar', FilterOperator.EQUALS, 'work');
  }
}

enum FilterOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN'
}
```

### 6. RateLimit

API rate limit configuration.

```typescript
class RateLimit {
  constructor(
    public readonly requestsPerHour: number,
    public readonly burstLimit: number,
    public readonly scope: RateLimitScope
  ) {}

  isExceeded(currentCount: number, windowStart: Date): boolean {
    const hoursSinceStart = (Date.now() - windowStart.getTime()) / (1000 * 60 * 60);
    const effectiveLimit = this.requestsPerHour * Math.max(1, hoursSinceStart);
    return currentCount >= Math.min(effectiveLimit, this.burstLimit);
  }
}

enum RateLimitScope {
  PER_USER = 'PER_USER',
  PER_TENANT = 'PER_TENANT',
  GLOBAL = 'GLOBAL'
}
```

### 7. Capability

Describes what a plugin can do.

```typescript
class Capability {
  constructor(
    public readonly type: CapabilityType,
    public readonly operations: Operation[],
    public readonly dataTypes: string[]
  ) {}
}

enum CapabilityType {
  READ = 'READ',
  WRITE = 'WRITE',
  SUBSCRIBE = 'SUBSCRIBE',  // Webhooks
  SEARCH = 'SEARCH',
  BATCH = 'BATCH'
}

enum Operation {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LIST = 'LIST'
}
```

---

## Domain Events

### 1. ConnectionInitiated

Emitted when user starts plugin connection flow.

```typescript
interface ConnectionInitiated {
  connectionId: string;
  userId: string;
  tenantId: string;
  pluginId: string;
  provider: string;
  redirectUri: string;
  scopes: string[];
  timestamp: Date;
}
```

### 2. ConnectionCompleted

Emitted when plugin connection is successfully established.

```typescript
interface ConnectionCompleted {
  connectionId: string;
  userId: string;
  tenantId: string;
  pluginId: string;
  provider: string;
  scopes: string[];
  timestamp: Date;
}
```

**Subscribers:**
- Profile Context (update user's connected services)
- All Domain Contexts (enable plugin-specific features)
- Analytics Context (track plugin adoption)

### 3. ConnectionFailed

Emitted when plugin connection fails.

```typescript
interface ConnectionFailed {
  connectionId: string;
  reason: string;
  timestamp: Date;
}
```

### 4. ConnectionDisconnected

Emitted when user disconnects a plugin.

```typescript
interface ConnectionDisconnected {
  connectionId: string;
  userId: string;
  tenantId: string;
  pluginId: string;
  provider: string;
  timestamp: Date;
}
```

**Subscribers:**
- All Domain Contexts (disable plugin-specific features)
- Profile Context (update connected services)

### 5. SyncCompleted

Emitted when data sync completes successfully.

```typescript
interface SyncCompleted {
  connectionId: string;
  userId: string;
  tenantId: string;
  pluginId: string;
  itemCount: number;
  duration: number; // milliseconds
  timestamp: Date;
}
```

**Subscribers:**
- Domain Contexts (receive synced data)
- Proactivity Context (check for new opportunities)

### 6. SyncFailed

Emitted when data sync fails.

```typescript
interface SyncFailed {
  connectionId: string;
  userId: string;
  tenantId: string;
  pluginId: string;
  reason: string;
  timestamp: Date;
}
```

**Subscribers:**
- Notification Context (alert user of sync issues)

### 7. CredentialsRefreshed

Emitted when OAuth tokens are refreshed.

```typescript
interface CredentialsRefreshed {
  connectionId: string;
  expiresAt: Date;
  timestamp: Date;
}
```

### 8. CredentialsRefreshFailed

Emitted when token refresh fails (requires re-authentication).

```typescript
interface CredentialsRefreshFailed {
  connectionId: string;
  reason: string;
  timestamp: Date;
}
```

**Subscribers:**
- Notification Context (prompt user to reconnect)

### 9. SyncSettingsUpdated

Emitted when user changes sync settings.

```typescript
interface SyncSettingsUpdated {
  connectionId: string;
  settings: Record<string, any>;
  nextSyncAt?: Date;
  timestamp: Date;
}
```

---

## Domain Services

### 1. OAuthService

**Responsibility:** Handle OAuth 2.0 authorization flows.

```typescript
interface OAuthService {
  // Initiate OAuth flow
  getAuthorizationUrl(
    provider: string,
    scopes: Scope[],
    redirectUri: string,
    state: string
  ): string;

  // Exchange authorization code for tokens
  exchangeAuthorizationCode(
    provider: string,
    code: string,
    redirectUri: string
  ): Promise<Credentials>;

  // Refresh access token
  refreshToken(
    provider: string,
    refreshToken: string
  ): Promise<Credentials>;

  // Revoke access
  revokeAccess(
    provider: string,
    token: string
  ): Promise<void>;
}
```

**Implementation Notes:**
- Supports multiple OAuth providers (Google, Microsoft, Apple, GitHub, etc.)
- Handles PKCE for mobile/SPA apps
- Validates state parameter to prevent CSRF
- Stores OAuth client credentials securely

### 2. SyncService

**Responsibility:** Synchronize data between Fidus and external services.

```typescript
interface SyncService {
  // Execute sync
  sync(
    pluginType: PluginType,
    provider: string,
    credentials: Credentials,
    settings: SyncSettings
  ): Promise<SyncResult>;

  // Handle webhook
  handleWebhook(
    provider: string,
    signature: string,
    payload: any
  ): Promise<void>;

  // Verify webhook signature
  verifyWebhookSignature(
    provider: string,
    signature: string,
    payload: string
  ): boolean;
}

interface SyncResult {
  itemCount: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsDeleted: number;
  conflicts: SyncConflict[];
}

interface SyncConflict {
  itemId: string;
  fidusVersion: any;
  externalVersion: any;
  resolution: ConflictResolution;
}
```

**Implementation Notes:**
- Uses MCP servers for plugin-specific sync logic
- Implements incremental sync (delta queries)
- Handles pagination for large datasets
- Resolves conflicts based on settings
- Validates webhook signatures (HMAC-SHA256)

### 3. MCPServerRegistry

**Responsibility:** Manage MCP server lifecycle and routing.

```typescript
interface MCPServerRegistry {
  // Register MCP server
  register(
    pluginId: string,
    config: MCPServerConfig
  ): Promise<void>;

  // Start MCP server
  start(pluginId: string): Promise<void>;

  // Stop MCP server
  stop(pluginId: string): Promise<void>;

  // Get MCP client
  getClient(pluginId: string): MCPClient;

  // Health check
  healthCheck(pluginId: string): Promise<HealthStatus>;
}

interface MCPServerConfig {
  command: string;
  args: string[];
  env: Record<string, string>;
  tools: string[]; // Available MCP tools
}
```

**Implementation Notes:**
- Spawns MCP server processes on-demand
- Manages server lifecycle (start, stop, restart)
- Implements health checks and auto-restart
- Routes MCP tool calls to correct server

---

## Business Rules

### 1. Connection Limit

**Rule:** Users can only have one active connection per (pluginType, provider) combination.

**Rationale:** Prevents confusion and conflicts from multiple connections to same service.

**Enforcement:**
- PluginConnectionRepository checks for existing connections before creating
- UI shows "Already connected" status
- Disconnecting old connection required before new connection

### 2. Scope Validation

**Rule:** Granted scopes must include all required scopes defined by the plugin.

**Rationale:** Plugin cannot function without required permissions.

**Enforcement:**
- `PluginConnection.completeConnection()` validates granted scopes
- Connection fails if required scopes not granted
- UI clearly indicates which scopes are required vs optional

### 3. Credential Expiration

**Rule:** Credentials must be refreshed before expiration (5-minute buffer).

**Rationale:** Prevents sync failures due to expired tokens.

**Enforcement:**
- `PluginConnection.needsCredentialRefresh()` checks expiration
- Sync automatically refreshes credentials if needed
- Background job refreshes credentials proactively

### 4. Sync Suspension

**Rule:** Connection is suspended after 5 consecutive sync failures.

**Rationale:** Prevents wasting resources on permanently broken connections.

**Enforcement:**
- `PluginConnection.executeSync()` increments failure counter
- Status changes to SUSPENDED after 5 failures
- User must manually reconnect to re-enable

### 5. Tenant Quota Enforcement

**Rule:** Plugin connections and sync frequency must respect tenant tier limits.

**Rationale:** Fair usage and revenue protection.

**Enforcement:**
| **Tier** | **Max Connections** | **Real-Time Sync** | **Sync Frequency** |
|----------|-------------------|-------------------|-------------------|
| Community | 3 | No | Hourly minimum |
| Cloud | 10 | Yes | Real-time |
| Enterprise | Unlimited | Yes | Real-time |

- Connection creation checks tenant limits
- SyncSettings validates interval against tier
- UI shows upgrade prompt when limit reached

---

## Use Cases

### Use Case 1: Connect Google Calendar

**Actor:** User

**Trigger:** User clicks "Connect Google Calendar" in settings

**Preconditions:**
- User has active account
- Tenant has not exceeded connection limit
- Google Calendar plugin is available for user's tier

**Flow:**
1. User clicks "Connect Google Calendar"
2. UI retrieves plugin configuration from PluginRegistry
3. UI displays requested scopes with explanations
4. User clicks "Continue"
5. PluginConnection.initiateConnection() creates connection in CONNECTING state
6. OAuthService generates authorization URL with:
   - Client ID
   - Requested scopes (calendar.readonly, calendar.events)
   - Redirect URI (https://fidus.app/oauth/callback)
   - State parameter (CSRF protection)
7. User redirected to Google OAuth consent screen
8. User grants permissions
9. Google redirects back to Fidus with authorization code
10. Backend validates state parameter
11. OAuthService.exchangeAuthorizationCode() exchanges code for tokens
12. PluginConnection.completeConnection() stores encrypted credentials
13. ConnectionCompleted event emitted
14. CalendarSupervisor receives event, enables Google Calendar features
15. Initial sync scheduled
16. User sees "Connected successfully" confirmation

**Postconditions:**
- Plugin connection active
- Credentials stored encrypted
- Initial sync scheduled
- Calendar features enabled

**Error Scenarios:**
- User denies permissions → ConnectionFailed event, show explanation
- Token exchange fails → ConnectionFailed event, show error
- Required scopes not granted → ConnectionFailed event, explain requirements

---

### Use Case 2: Automatic Sync Execution

**Actor:** System (Sync Scheduler)

**Trigger:** Scheduled sync time reached OR webhook received

**Preconditions:**
- PluginConnection status is CONNECTED
- No sync currently in progress
- Credentials valid (or can be refreshed)

**Flow:**
1. Sync scheduler identifies connections due for sync
2. For each connection:
   - Check if credentials need refresh
   - If yes, call PluginConnection.refreshCredentials()
   - If refresh fails, emit CredentialsRefreshFailed, skip sync
3. PluginConnection.executeSync() initiates sync
4. SyncService retrieves last sync timestamp
5. SyncService calls external API with delta query:
   - Google Calendar: syncToken for incremental sync
   - Microsoft: deltaLink for changes since last sync
6. SyncService retrieves changed items (created, updated, deleted)
7. For each item:
   - Transform external format to Fidus format
   - Check for conflicts (item changed in both systems)
   - If conflict, apply resolution strategy:
     - NEWEST_WINS: Compare lastModified timestamps
     - EXTERNAL_WINS: Always use external version
     - FIDUS_WINS: Always use Fidus version
     - MANUAL: Create conflict record for user review
8. SyncService publishes domain events:
   - CalendarEventCreated
   - CalendarEventUpdated
   - CalendarEventDeleted
9. CalendarSupervisor receives events, updates local state
10. PluginConnection.executeSync() returns SyncCompleted
11. SyncCompleted event emitted
12. Next sync scheduled based on settings

**Postconditions:**
- Local data synchronized with external service
- Last sync timestamp updated
- Next sync scheduled
- Sync metrics updated

**Error Scenarios:**
- API rate limit exceeded → SyncFailed, exponential backoff retry
- Network error → SyncFailed, retry after 5 minutes
- Invalid credentials → CredentialsRefreshFailed, notify user
- 5 consecutive failures → Connection suspended, notify user

---

### Use Case 3: Webhook-Based Real-Time Sync

**Actor:** External Service (via webhook)

**Trigger:** Event occurs in external service (e.g., new calendar event created)

**Preconditions:**
- PluginConnection has SUBSCRIBE capability
- Webhook registered with external service
- User on Cloud+ tier (real-time sync enabled)

**Flow:**
1. User creates calendar event in Google Calendar
2. Google sends webhook to Fidus endpoint: POST /webhooks/google/calendar
3. Webhook payload includes:
   - Event type (created, updated, deleted)
   - Resource ID
   - Channel ID (identifies subscription)
   - HMAC signature
4. Webhook handler validates:
   - Signature matches (HMAC-SHA256)
   - Channel ID corresponds to active connection
   - Tenant has real-time sync enabled
5. SyncService.handleWebhook() processes event
6. Retrieves full event details from Google API (webhook only contains metadata)
7. Transforms event to Fidus format
8. Publishes CalendarEventCreated domain event
9. CalendarSupervisor receives event, updates local state
10. ProactivitySupervisor receives event, checks for conflicts/opportunities
11. If opportunity detected (e.g., double-booking), creates Suggestion
12. User receives real-time notification

**Postconditions:**
- Local data updated immediately (no wait for next sync)
- User informed of relevant opportunities
- Last sync timestamp updated

**Security Considerations:**
- Signature validation prevents spoofed webhooks
- Channel ID prevents cross-tenant attacks
- Rate limiting prevents webhook flooding
- Webhook endpoint uses HTTPS

---

## Repository Interfaces

### PluginConnectionRepository

```typescript
interface PluginConnectionRepository {
  // Basic CRUD
  save(connection: PluginConnection): Promise<void>;
  findById(connectionId: string): Promise<PluginConnection | null>;
  delete(connectionId: string): Promise<void>;

  // User queries
  findByUserId(userId: string, tenantId: string): Promise<PluginConnection[]>;
  findByUserAndPlugin(
    userId: string,
    tenantId: string,
    pluginType: PluginType,
    provider: string
  ): Promise<PluginConnection | null>;

  // Sync queries
  findDueForSync(limit: number): Promise<PluginConnection[]>;
  findByStatus(
    status: ConnectionStatus,
    tenantId?: string
  ): Promise<PluginConnection[]>;

  // Health queries
  findFailingConnections(
    failureThreshold: number,
    tenantId?: string
  ): Promise<PluginConnection[]>;

  // Tenant queries
  countByTenant(tenantId: string): Promise<number>;
}
```

### PluginRegistryRepository

```typescript
interface PluginRegistryRepository {
  // Basic CRUD
  save(plugin: PluginRegistry): Promise<void>;
  findById(pluginId: string): Promise<PluginRegistry | null>;
  findByProvider(provider: string): Promise<PluginRegistry[]>;

  // Discovery
  findAll(status?: PluginStatus): Promise<PluginRegistry[]>;
  findByType(type: PluginType): Promise<PluginRegistry[]>;
  findAvailableForTier(tier: PlanTier): Promise<PluginRegistry[]>;

  // Search
  search(query: string): Promise<PluginRegistry[]>;
}
```

---

## Integration Points

### Inbound (Plugin Context consumes)

| **Source Context** | **Event** | **Purpose** |
|-------------------|-----------|-------------|
| Identity Context | UserRegistered | Initialize plugin capabilities |
| Identity Context | TenantCreated | Set tenant plugin quotas |
| Identity Context | PlanUpgraded | Enable additional plugins |

### Outbound (Plugin Context publishes)

| **Event** | **Subscribers** |
|-----------|----------------|
| ConnectionCompleted | All Domain Contexts, Profile Context |
| ConnectionDisconnected | All Domain Contexts, Profile Context |
| SyncCompleted | Domain Contexts (by type), Proactivity Context |
| SyncFailed | Notification Context |
| CredentialsRefreshFailed | Notification Context |

### MCP Interface

Each plugin exposes MCP tools via its MCP server:

```typescript
// Example: Google Calendar MCP tools
interface GoogleCalendarMCPTools {
  list_events(start: Date, end: Date): CalendarEvent[];
  create_event(event: CalendarEvent): string;
  update_event(eventId: string, updates: Partial<CalendarEvent>): void;
  delete_event(eventId: string): void;
  find_free_slots(duration: number, start: Date, end: Date): TimeSlot[];
}
```

**MCP Tool Naming Convention:** `{provider}_{entity}_{action}`
- Examples: google_calendar_list_events, microsoft_mail_send, apple_health_get_steps

---

## Testing Strategy

### Unit Tests

```typescript
describe('PluginConnection', () => {
  it('should initiate connection and transition to CONNECTING');
  it('should complete connection with valid credentials and scopes');
  it('should fail connection if required scopes not granted');
  it('should refresh credentials before expiration');
  it('should suspend connection after 5 consecutive sync failures');
  it('should disconnect and clear credentials');
});

describe('SyncSettings', () => {
  it('should calculate interval milliseconds correctly');
  it('should serialize to JSON with all fields');
  it('should validate interval against tenant tier');
});

describe('EncryptedCredentials', () => {
  it('should encrypt credentials with tenant-specific key');
  it('should decrypt credentials with correct key');
  it('should throw error with wrong key');
});
```

### Integration Tests

```typescript
describe('OAuth Flow', () => {
  it('should complete full OAuth 2.0 authorization code flow');
  it('should handle refresh token flow');
  it('should revoke access on disconnect');
});

describe('Sync Flow', () => {
  it('should execute incremental sync with delta query');
  it('should handle pagination for large datasets');
  it('should resolve conflicts based on settings');
  it('should refresh credentials if expiring soon');
});

describe('Webhook Flow', () => {
  it('should validate webhook signature');
  it('should process webhook and update local data');
  it('should reject webhook with invalid signature');
  it('should rate limit webhook requests');
});
```

### End-to-End Tests

```typescript
describe('Plugin Context E2E', () => {
  it('should connect Google Calendar and sync events');
  it('should receive real-time webhook and update data');
  it('should disconnect plugin and stop syncing');
  it('should respect tenant connection limits');
  it('should suspend failing connections automatically');
});
```

---

## Implementation Notes

### Credential Storage

**Encryption:**
- AES-256-GCM encryption
- Tenant-specific encryption keys stored in key management service (AWS KMS, HashiCorp Vault)
- Keys rotated every 90 days
- Credentials re-encrypted during key rotation

**Access Control:**
- Credentials never exposed in logs or errors
- Decrypt only in memory, never persist decrypted
- Access audited in Audit Context

### MCP Server Management

**Process Isolation:**
- Each MCP server runs in separate process
- Supervised by process manager (PM2, systemd)
- Auto-restart on crash
- Resource limits (CPU, memory)

**Communication:**
- Standard input/output for MCP protocol
- JSON-RPC 2.0 message format
- Timeout protection (30s per tool call)

### Webhook Security

**Signature Validation:**
- HMAC-SHA256 signature in header
- Provider-specific secret keys
- Reject unsigned requests
- Replay protection (timestamp validation)

**Rate Limiting:**
- 100 webhooks per hour per connection
- Exponential backoff for excess webhooks
- Temporary suspension after abuse

---

## Open Questions / Future Enhancements

1. **Plugin Marketplace:** Should we allow third-party developers to publish custom plugins?

2. **Data Residency:** How to handle GDPR data residency for EU customers? Store credentials in EU region?

3. **Sync Conflict UI:** Should we provide UI for users to manually resolve sync conflicts?

4. **Plugin Chaining:** Should we support workflows that chain multiple plugins? (e.g., "When Slack message received, create calendar event")

5. **Offline Sync:** How to handle sync when user offline? Queue changes for later?

6. **Custom Scopes:** Should Enterprise tier allow custom OAuth scopes?

7. **Plugin Analytics:** Should we provide analytics on plugin usage, sync performance, error rates?

---

## Summary

The **Plugin Context** is a critical Supporting Domain that enables Fidus to integrate with the external services users already use. Key characteristics:

- **OAuth 2.0 Support:** Secure authorization flows with token refresh
- **Bidirectional Sync:** Keep data synchronized between Fidus and external services
- **Real-Time Webhooks:** Immediate updates via webhook subscriptions (Cloud+ tier)
- **MCP Integration:** Exposes plugin capabilities via Model Context Protocol
- **Multi-Provider:** Supports Google, Microsoft, Apple, and custom providers
- **Secure Credential Management:** Tenant-specific encryption for sensitive credentials
- **Resilient Sync:** Automatic retry, exponential backoff, conflict resolution
- **Tenant Quotas:** Fair usage enforcement based on pricing tier
- **Comprehensive Monitoring:** Sync health, error tracking, suspension logic

This domain model provides the foundation for Fidus to be a unified interface to all of a user's digital life.
