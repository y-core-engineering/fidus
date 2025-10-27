# Security Architecture: Permissions & Access Control

**Version:** 1.0
**Date:** 2025-10-27

> **Navigation:** [← Overview](01-overview.md) | [Back to README →](README.md)

---

## 1. Permission & Security Model

### 1.1 Basic Principle

**Principle of Least Privilege:** Plugins only get the minimal permissions they need for their function.

**Motivation:**
- ✅ **Community Plugins:** Untrusted code must be restricted
- ✅ **Data Protection:** User data must be protected
- ✅ **Audit Trail:** Who accessed which data?

---

### 1.2 Permission Types

**Three categories of permissions:**

| Permission Type | Format | Example | Purpose |
|-----------------|--------|----------|-------|
| **Service Permissions** | `<service>.<method>` | `userProfile.get` | Which services can plugin use? |
| **Data Permissions** | `data.<scope>` | `data.preferences` | Which user data can plugin read? |
| **LLM Permissions** | `llm.complete` | `llm.complete` (with quota) | Can plugin use LLM? |

---

#### 1.2.1 Service Permissions

**Purpose:** Defines which services a plugin can call.

**Format:** `<service-name>.<method-name>`

**Example:**

```typescript
// WeatherPlugin only needs location service (read)
permissions: {
  services: [
    'location.getCurrentLocation',  // Can only call getCurrentLocation
    'weather.getForecast'            // Can use own Weather API
  ]
}

// NOT allowed:
// 'userProfile.get'       ← NOT allowed (not declared)
// 'calendar.createEvent'  ← NOT allowed (not declared)
```

**Granularity:**

| Granularity | Example | Meaning |
|--------------|----------|-----------|
| **Service-Level** | `userProfile` | All methods of service |
| **Method-Level** | `userProfile.get` | Only this one method |
| **Wildcard** | `userProfile.*` | Explicitly all methods |

---

#### 1.2.2 Data Permissions

**Purpose:** Defines which user data a plugin can read/write.

**Format:** `data.<scope>` with scopes:
- `data.preferences` - User Preferences (Graph DB)
- `data.calendar` - Calendar data
- `data.health` - Health data
- `data.finance` - Financial data
- `data.location` - Location data
- `data.contacts` - Contacts

**Example:**

```typescript
// Calendar Supervisor needs calendar + preferences
permissions: {
  data: [
    'data.calendar',        // Read + Write calendar data
    'data.preferences'      // Read user preferences (e.g. meeting_time_preference)
  ]
}

// Health Supervisor needs only health
permissions: {
  data: [
    'data.health',          // Workout data, vitals
    'data.preferences'      // Workout goals
  ]
}

// Weather Plugin needs only location (read-only)
permissions: {
  data: [
    'data.location:read'    // Only read (not write)
  ]
}
```

**Read/Write Modifiers:**

| Modifier | Example | Meaning |
|-------------|----------|-----------|
| **Read-Only** | `data.calendar:read` | Only read |
| **Write-Only** | `data.calendar:write` | Only write (rare) |
| **Read-Write** | `data.calendar` | Read + Write (default) |

---

#### 1.2.3 LLM Permissions

**Purpose:** Defines whether plugin can use LLM (and how much).

**Format:** `llm.complete` with optional quota

**Example:**

```typescript
// Supervisor: Can use LLM unlimited
permissions: {
  llm: {
    allowed: true,
    quota: null  // Unlimited
  }
}

// Community Plugin: Limited budget
permissions: {
  llm: {
    allowed: true,
    quota: 10000  // 10k tokens per day
  }
}

// Simple Tool Plugin: No LLM
permissions: {
  llm: {
    allowed: false
  }
}
```

**Quota Tracking:**

```typescript
// Process description: LLM call with quota
1. Plugin calls llm.complete()
2. LLMService checks plugin quota
3. If quota exceeded → Error
4. If OK → LLM call + track usage
5. Update quota
```

---

### 1.3 Plugin Permission Declaration

**Every plugin declares permissions in `Plugin` interface:**

```typescript
interface Plugin {
  name: string;
  version: string;
  type: 'supervisor' | 'service' | 'database' | 'integration';

  // ════════════════════════════════════════
  // PERMISSIONS (NEW)
  // ════════════════════════════════════════
  permissions: {
    services?: string[];      // Service Permissions
    data?: string[];          // Data Permissions
    llm?: {                   // LLM Permissions
      allowed: boolean;
      quota?: number;         // Tokens per day (null = unlimited)
    };
  };

  dependencies?: string[];
  getServices(): ServiceProvider[];
  initialize(): Promise<void>;
  shutdown?(): Promise<void>;
}
```

**Example: Weather Plugin**

```typescript
class WeatherPlugin implements Plugin {
  name = 'weather';
  version = '1.0.0';
  type = 'integration';

  // Declare permissions
  permissions = {
    services: [
      'location.getCurrentLocation'  // Only needs location
    ],
    data: [
      'data.location:read'           // Only read, not write
    ],
    llm: {
      allowed: false                 // No LLM needed (simple tool)
    }
  };

  getServices() {
    return [{
      name: 'weather',
      initialize: async () => new WeatherService()
    }];
  }

  async initialize() {
    console.log('WeatherPlugin initialized');
  }
}
```

**Example: Calendar Supervisor**

```typescript
class CalendarSupervisorPlugin implements Plugin {
  name = 'calendar-supervisor';
  version = '1.0.0';
  type = 'supervisor';

  // Declare permissions
  permissions = {
    services: [
      'userProfile.*',              // All UserProfile methods
      'location.getCurrentLocation' // For meeting location suggestions
    ],
    data: [
      'data.calendar',              // Read + Write
      'data.preferences',           // Read + Write
      'data.location:read'          // Only Read
    ],
    llm: {
      allowed: true,
      quota: null                   // Unlimited (is core supervisor)
    }
  };

  dependencies = ['user-profiling'];

  getServices() {
    return [{
      name: 'calendarSupervisor',
      dependencies: ['userProfile'],
      initialize: async (deps) => new CalendarSupervisor(deps['userProfile'])
    }];
  }

  async initialize() {
    await signalRegistry.registerProvider('calendar', [...]);
    await eventRegistry.registerEventTypes('calendar', [...]);
  }
}
```

---

### 1.4 Enforcement Points

**Permission checks at three places:**

```
1. Load-Time (PluginManager)
   └─ Checks if permissions are declared

2. Service-Access (ServiceRegistry)
   └─ Checks on every service call

3. Runtime (LLMService, DataAccess)
   └─ Checks on LLM calls and data access
```

---

#### 1.4.1 Load-Time Check (PluginManager)

**When loading plugin:**

```typescript
class PluginManager {
  async loadPlugin(plugin: Plugin): Promise<void> {
    // 1. Validate permissions
    this.validatePermissions(plugin);

    // 2. Check dependencies
    for (const depName of plugin.dependencies || []) {
      if (!this.plugins.has(depName)) {
        throw new Error(`Missing dependency: ${depName}`);
      }
    }

    // 3. Initialize plugin
    await plugin.initialize();

    // 4. Store plugin (with permissions)
    this.plugins.set(plugin.name, plugin);
  }

  private validatePermissions(plugin: Plugin): void {
    // Permissions must be declared
    if (!plugin.permissions) {
      throw new Error(`Plugin ${plugin.name} must declare permissions`);
    }

    // Validate service permissions
    for (const servicePerm of plugin.permissions.services || []) {
      if (!this.isValidServicePermission(servicePerm)) {
        throw new Error(`Invalid service permission: ${servicePerm}`);
      }
    }

    // Validate data permissions
    for (const dataPerm of plugin.permissions.data || []) {
      if (!this.isValidDataPermission(dataPerm)) {
        throw new Error(`Invalid data permission: ${dataPerm}`);
      }
    }
  }
}
```

---

#### 1.4.2 Service-Access Check (ServiceRegistry)

**On every service call:**

```typescript
class ServiceRegistry {
  private services: Map<string, any> = new Map();
  private pluginPermissions: Map<string, Plugin['permissions']> = new Map();

  // Get service (with permission check)
  getService(serviceName: string, requestingPlugin: Plugin): any {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service not found: ${serviceName}`);
    }

    // Wrapped service with permission proxy
    return this.createPermissionProxy(service, serviceName, requestingPlugin);
  }

  private createPermissionProxy(service: any, serviceName: string, plugin: Plugin): any {
    return new Proxy(service, {
      get: (target, methodName: string) => {
        // Permission check
        const permissionString = `${serviceName}.${methodName}`;

        if (!this.hasPermission(plugin, permissionString)) {
          throw new PermissionError(
            `Plugin ${plugin.name} does not have permission: ${permissionString}`
          );
        }

        // If permission exists: Allow
        return target[methodName];
      }
    });
  }

  private hasPermission(plugin: Plugin, permissionString: string): boolean {
    const permissions = plugin.permissions.services || [];

    // Exact match
    if (permissions.includes(permissionString)) {
      return true;
    }

    // Wildcard match (e.g. 'userProfile.*')
    const [serviceName, methodName] = permissionString.split('.');
    if (permissions.includes(`${serviceName}.*`)) {
      return true;
    }

    // Service-level match (e.g. 'userProfile' without method)
    if (permissions.includes(serviceName)) {
      return true;
    }

    return false;
  }
}
```

---

#### 1.4.3 Runtime Check (LLMService, DataAccess)

**On LLM calls:**

```typescript
class LLMService {
  private pluginQuotas: Map<string, { used: number, limit: number | null }> = new Map();

  async complete(prompt: string, requestingPlugin: Plugin): Promise<LLMResponse> {
    // 1. Permission check
    if (!requestingPlugin.permissions.llm?.allowed) {
      throw new PermissionError(
        `Plugin ${requestingPlugin.name} does not have LLM permission`
      );
    }

    // 2. Quota check
    const quota = this.pluginQuotas.get(requestingPlugin.name) || {
      used: 0,
      limit: requestingPlugin.permissions.llm.quota
    };

    if (quota.limit !== null && quota.used >= quota.limit) {
      throw new QuotaExceededError(
        `Plugin ${requestingPlugin.name} exceeded LLM quota: ${quota.limit} tokens/day`
      );
    }

    // 3. LLM call
    const response = await llm.complete(prompt);

    // 4. Track usage
    quota.used += response.usage.totalTokens;
    this.pluginQuotas.set(requestingPlugin.name, quota);

    return response;
  }

  // Daily reset (cron job)
  async resetDailyQuotas(): Promise<void> {
    for (const [pluginName, quota] of this.pluginQuotas) {
      quota.used = 0;
      this.pluginQuotas.set(pluginName, quota);
    }
    console.log('LLM quotas reset');
  }
}
```

**On data access:**

```typescript
class DataAccessService {
  async getData(scope: string, userId: string, tenantId: string, requestingPlugin: Plugin): Promise<any> {
    // 1. Permission check
    const requiredPermission = `data.${scope}`;

    if (!this.hasDataPermission(requestingPlugin, requiredPermission)) {
      throw new PermissionError(
        `Plugin ${requestingPlugin.name} does not have permission: ${requiredPermission}`
      );
    }

    // 2. Read-only check
    const isReadOnly = requestingPlugin.permissions.data?.includes(`${requiredPermission}:read`);

    // 3. Fetch data (with tenant isolation!)
    switch (scope) {
      case 'preferences':
        return await userProfileService.get(userId, '*', tenantId);
      case 'calendar':
        return await calendarService.getEvents(userId, tenantId);
      // ...
    }
  }

  private hasDataPermission(plugin: Plugin, permission: string): boolean {
    const permissions = plugin.permissions.data || [];

    // Exact match
    if (permissions.includes(permission)) {
      return true;
    }

    // Read-only match
    if (permissions.includes(`${permission}:read`)) {
      return true;
    }

    return false;
  }
}
```

---

### 1.5 User Consent (Community Plugins)

**When installing a community plugin:**

```
┌────────────────────────────────────────────┐
│ Install plugin:                            │
│ @fidus-community/crypto-trading            │
├────────────────────────────────────────────┤
│ ⚠️ This plugin requires the following      │
│    permissions:                            │
│                                            │
│ 📊 Data Access:                            │
│   • Financial data (Read + Write)         │
│   • User preferences (Read)               │
│                                            │
│ 🔧 Service Access:                         │
│   • userProfile.get                        │
│   • finance.getBalance                     │
│                                            │
│ 🤖 AI Usage:                               │
│   • LLM access (10,000 tokens/day)        │
│                                            │
│ [ ] I understand and agree                │
│ [Install] [Cancel]                        │
└────────────────────────────────────────────┘
```

**Process:**

```
1. User clicks "Install plugin"
2. PluginManager loads plugin manifest
3. Permissions are extracted
4. UI shows permission request
5. User must explicitly consent
6. Plugin is loaded (with permissions)
7. Permissions cannot be extended at runtime
```

---

### 1.6 Permission Scopes per Plugin-Type

**Recommended default permissions by plugin type:**

| Plugin Type | Default Services | Default Data | Default LLM |
|------------|------------------|--------------|-------------|
| **Supervisor** | All (needs full integration) | Own domain + Preferences | Yes, unlimited |
| **Service** | Only dependencies | Own domain | No (unless explicit) |
| **Database** | None | None | No |
| **Integration** | Minimal (e.g. only Location) | Minimal (e.g. only Location:read) | Optional (limited) |

**Example:**

```typescript
// Health Supervisor: Full permissions for Health domain
permissions: {
  services: ['userProfile.*', 'location.getCurrentLocation'],
  data: ['data.health', 'data.preferences'],
  llm: { allowed: true, quota: null }
}

// Weather Integration: Minimal permissions
permissions: {
  services: ['location.getCurrentLocation'],
  data: ['data.location:read'],
  llm: { allowed: false }
}

// Neo4j Database Plugin: No permissions (is infrastructure)
permissions: {
  services: [],
  data: [],
  llm: { allowed: false }
}
```

---

## 2. Privacy Proxy (External MCP Servers)

**Already documented in [01-overview.md](01-overview.md) Section 7.**

**Summary:**

```
User Request → Supervisor → Privacy Proxy → External MCP Server

Privacy Proxy:
- Filters sensitive data (PII) from requests
- Replaces entities with placeholders
- Only minimally necessary data is shared
```

**Permission Integration:**

External MCP servers have **no direct permissions**. They only get filtered data via Privacy Proxy.

---

## 3. Security Best Practices

### 3.1 Principle of Least Privilege

✅ **DO:**
- Declare only permissions that are actually needed
- Use read-only where possible (`data.calendar:read`)
- Limit LLM quota for community plugins

❌ **DON'T:**
- Wildcard permissions (`*.*`) for community plugins
- Unlimited LLM quota for untrusted code
- Shared permissions between plugins (each plugin has its own)

---

### 3.2 Defense in Depth

**Multiple security layers:**

```
Layer 1: Load-Time Validation
└─ Permissions must be declared

Layer 2: Service-Access Proxy
└─ Permission check on every service call

Layer 3: Runtime Enforcement
└─ LLM quota, data access checks

Layer 4: Audit Logging
└─ All permission violations are logged
```

---

### 3.3 Audit Trail

**All security events are logged:**

```typescript
interface SecurityAuditLog {
  timestamp: Date;
  eventType: 'permission_denied' | 'quota_exceeded' | 'suspicious_activity';
  pluginName: string;
  userId?: string;
  tenantId?: string;
  attemptedAction: string;  // e.g. 'userProfile.get'
  reason: string;           // e.g. 'Missing permission: userProfile.get'
}

// Example log
{
  timestamp: '2025-10-27T14:30:00Z',
  eventType: 'permission_denied',
  pluginName: 'weather',
  userId: 'user-123',
  attemptedAction: 'userProfile.get',
  reason: 'Plugin weather does not have permission: userProfile.get'
}
```

---

## 4. Summary

### 4.1 Permission Model

- ✅ **Three Permission Types:** Services, Data, LLM
- ✅ **Granular:** Method-level, Read/Write, Quotas
- ✅ **Declarative:** Plugins declare permissions in interface
- ✅ **Enforced:** Checks at load-time, service-access, runtime
- ✅ **User Consent:** Community plugins need explicit consent

### 4.2 Enforcement

- ✅ **PluginManager:** Validates permissions on load
- ✅ **ServiceRegistry:** Proxy with permission checks
- ✅ **LLMService:** Quota tracking + reset
- ✅ **DataAccess:** Tenant isolation + permission checks

### 4.3 Security

- ✅ **Principle of Least Privilege:** Minimal permissions
- ✅ **Defense in Depth:** Multiple security layers
- ✅ **Audit Trail:** All violations logged
- ✅ **Privacy Proxy:** For external MCP servers

---

**Navigation:** [← Overview](01-overview.md) | [Back to README →](README.md)

**Version History:**
- v1.0 (2025-10-27): Initial version (Architecture Completion Phase 2)
