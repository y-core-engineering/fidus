# Error & Edge States

**Status:** ✅ Complete
**Last Updated:** 2025-01-28
**Owner:** UX/UI Team

---

## Table of Contents

1. [Overview](#overview)
2. [Error Philosophy](#error-philosophy)
3. [Error States](#error-states)
4. [Empty States](#empty-states)
5. [Offline States](#offline-states)
6. [Permission States](#permission-states)
7. [Rate Limiting](#rate-limiting)
8. [Recovery Patterns](#recovery-patterns)
9. [Accessibility](#accessibility)
10. [Best Practices](#best-practices)

---

## 1. Overview

Error and edge states are **just as important** as success states. Good error UX turns frustration into confidence.

### Design Goals

1. **Clear Communication** - Users understand what went wrong
2. **Actionable** - Provide clear next steps
3. **Reassuring** - Privacy-safe error messages
4. **Recoverable** - Help users fix the problem
5. **Accessible** - Screen readers and keyboard nav

### Error State Categories

| Category | Severity | Example | User Control |
|----------|----------|---------|--------------|
| **Validation Errors** | Low | Invalid email format | Full (user can fix) |
| **Network Errors** | Medium | API request failed | Partial (retry) |
| **Permission Errors** | Medium | Calendar access denied | Full (grant permission) |
| **System Errors** | High | Database unavailable | None (wait) |
| **Data Errors** | Medium | Empty search results | Partial (refine search) |

---

## 2. Error Philosophy

### Privacy-Safe Error Messages

**❌ BAD: Leaking sensitive info**
```
Error: User with email john@acme.com not found
```

**✅ GOOD: Generic but helpful**
```
Email or password incorrect. Please try again.
```

### Progressive Error Disclosure

**Level 1: User-Friendly Message**
```
Something went wrong. Please try again.
```

**Level 2: Technical Details (expandable)**
```
▼ Technical Details
  Error Code: CAL_SYNC_401
  Service: Google Calendar API
  Timestamp: 2025-01-28 14:32:15 UTC
```

**Level 3: Support Info**
```
Still having issues? [Contact Support] or [View Help Docs]
```

### Error Message Tone

| ❌ Avoid | ✅ Use Instead |
|---------|---------------|
| "Fatal error!" | "Something went wrong" |
| "You did X wrong" | "We couldn't process X" |
| "Invalid input" | "Please check your input" |
| "Forbidden" | "Access not available" |

---

## 3. Error States

### 3.1 Network Errors

#### Pattern 1: API Request Failed

**Transient Error (retry possible):**

```
+--------------------------------------------------------+
|  Dashboard                            🔍  ⚙️  👤       |
+--------------------------------------------------------+
|                                                        |
|  +--------------------------------------------------+ |
|  | ⚠️ Couldn't load your opportunities              | |
|  |                                                  | |
|  | We're having trouble connecting to the service.  | |
|  |                                                  | |
|  | [Try Again] [Work Offline]                       | |
|  |                                                  | |
|  | ▼ Technical Details                              | |
|  +--------------------------------------------------+ |
|                                                        |
+--------------------------------------------------------+
```

**With Auto-Retry:**

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ⚠️ Connection lost                               | |
|  |                                                  | |
|  | Retrying in 5 seconds... (Attempt 2 of 3)        | |
|  |                                                  | |
|  | [Retry Now] [Cancel]                             | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

**Retry Logic:**
- **Attempt 1:** Immediate retry
- **Attempt 2:** Wait 2s, retry with exponential backoff
- **Attempt 3:** Wait 5s, retry
- **After 3 attempts:** Show persistent error with manual retry

#### Pattern 2: Timeout Error

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ⏱️ Request Timeout                               | |
|  |                                                  | |
|  | The server took too long to respond.             | |
|  | This usually means the service is busy.          | |
|  |                                                  | |
|  | [Try Again] [Check Status]                       | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

#### Pattern 3: Server Error (500)

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 🛠️ Service Temporarily Unavailable               | |
|  |                                                  | |
|  | We're experiencing technical difficulties.       | |
|  | Our team has been notified.                      | |
|  |                                                  | |
|  | Error ID: ERR_20250128_143215                    | |
|  | (Reference this when contacting support)         | |
|  |                                                  | |
|  | [Try Again] [Check Status Page]                  | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

### 3.2 Authentication Errors

#### Pattern 1: Session Expired

```
+--------------------------------------------------------+
|                                                        |
|              🔒 Session Expired                        |
|                                                        |
|  For your security, you've been logged out after       |
|  30 minutes of inactivity.                             |
|                                                        |
|  Please log in again to continue.                      |
|                                                        |
|  [Log In Again]                                        |
|                                                        |
|  💡 Tip: Fidus works offline. Your data is safe on     |
|     your device even when logged out.                  |
|                                                        |
+--------------------------------------------------------+
```

**Inline Session Warning (before expiry):**

```
+--------------------------------------------------------+
|  Dashboard                            🔍  ⚙️  👤       |
+--------------------------------------------------------+
|                                                        |
|  +--------------------------------------------------+ |
|  | ⏱️ Session expiring in 5 minutes                 | |
|  |                                                  | |
|  | [Stay Logged In] [Dismiss]                       | |
|  +--------------------------------------------------+ |
|                                                        |
+--------------------------------------------------------+
```

#### Pattern 2: Invalid Credentials

```
+--------------------------------------------------------+
|              Log In to Fidus                           |
|                                                        |
|  +-------------------------------------------------+  |
|  | Email                                           |  |
|  | +---------------------------------------------+ |  |
|  | | john@example.com                            | |  | ← Red border
|  | +---------------------------------------------+ |  |
|  +-------------------------------------------------+  |
|                                                        |
|  +-------------------------------------------------+  |
|  | Password                                        |  |
|  | +---------------------------------------------+ |  |
|  | | ••••••••                                    | |  | ← Red border
|  | +---------------------------------------------+ |  |
|  +-------------------------------------------------+  |
|                                                        |
|  ❌ Email or password incorrect. Please try again.    |
|                                                        |
|  [Forgot Password?]                                    |
|                                                        |
|  [Log In]                                              |
|                                                        |
+--------------------------------------------------------+
```

**Security Note:** Never reveal whether email or password was wrong (prevents user enumeration).

#### Pattern 3: Account Locked

```
+--------------------------------------------------------+
|              🔒 Account Temporarily Locked             |
|                                                        |
|  For your security, your account has been locked after |
|  5 unsuccessful login attempts.                        |
|                                                        |
|  You can try again in 15 minutes, or reset your        |
|  password now.                                         |
|                                                        |
|  [Reset Password] [Contact Support]                    |
|                                                        |
+--------------------------------------------------------+
```

### 3.3 Validation Errors

See [04-interaction-patterns.md](04-interaction-patterns.md#8-form-validation-patterns) for comprehensive form validation patterns.

#### Pattern 1: Form-Level Error Summary

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ❌ Please fix the following errors:              | |
|  |                                                  | |
|  | • Email is required                              | |
|  | • Password must be at least 8 characters         | |
|  | • You must agree to the Terms of Service         | |
|  +--------------------------------------------------+ |
|                                                        |
|  +-------------------------------------------------+  |
|  | Email *                                         |  |
|  | +---------------------------------------------+ |  | ← Click scrolls to field
|  | |                                             | |  |
|  | +---------------------------------------------+ |  |
|  | ❌ This field is required                       |  |
|  +-------------------------------------------------+  |
|                                                        |
+--------------------------------------------------------+
```

### 3.4 Data Errors

#### Pattern 1: No Search Results

See [Empty States](#4-empty-states) for comprehensive coverage.

```
+--------------------------------------------------------+
|  Search                          [✕]                   |
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 🔍 "dentist appointment last year"               | |
|  +--------------------------------------------------+ |
|                                                        |
|              🔍 No results found                       |
|                                                        |
|  We couldn't find any matches for                      |
|  "dentist appointment last year"                       |
|                                                        |
|  Suggestions:                                          |
|  • Check your spelling                                 |
|  • Try fewer or different keywords                     |
|  • Try searching in a specific domain                  |
|                                                        |
|  [Search in Calendar] [Search in Health]               |
|  [Clear Search] [View All]                             |
|                                                        |
+--------------------------------------------------------+
```

#### Pattern 2: Data Sync Error

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ⚠️ Calendar Sync Failed                          | |
|  |                                                  | |
|  | We couldn't sync your Google Calendar.           | |
|  |                                                  | |
|  | Possible causes:                                 | |
|  | • Calendar access was revoked                    | |
|  | • Your Google account password changed           | |
|  | • Network connection issue                       | |
|  |                                                  | |
|  | Last successful sync: 2 hours ago                | |
|  |                                                  | |
|  | [Reconnect Calendar] [Use Offline] [Dismiss]     | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

### 3.5 Conflict Errors

#### Pattern 1: Concurrent Modification

```
+--------------------------------------------------------+
|  ⚠️ Conflict Detected                            [✕]  |
+--------------------------------------------------------+
|                                                        |
|  This appointment was modified by another device       |
|  while you were editing.                               |
|                                                        |
|  +-------------------------------------------------+  |
|  | Your Changes:                                   |  |
|  | Title: "Team Meeting"                           |  |
|  | Time: 2pm - 3pm                                 |  |
|  +-------------------------------------------------+  |
|                                                        |
|  +-------------------------------------------------+  |
|  | Current Version:                                |  |
|  | Title: "All-Hands Meeting"                      |  |
|  | Time: 2pm - 4pm                                 |  |
|  +-------------------------------------------------+  |
|                                                        |
|  [Use My Changes] [Use Current Version] [Cancel]       |
|                                                        |
+--------------------------------------------------------+
```

### 3.6 LLM Errors

#### Pattern 1: LLM Unavailable

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 🤖 AI Temporarily Unavailable                    | |
|  |                                                  | |
|  | The AI model (Ollama) isn't responding.          | |
|  |                                                  | |
|  | Possible causes:                                 | |
|  | • Ollama service isn't running                   | |
|  | • Model is loading (first use takes ~30s)        | |
|  |                                                  | |
|  | What you can do:                                 | |
|  | • Wait a moment and try again                    | |
|  | • Restart Ollama service                         | |
|  | • Switch to cloud LLM (Settings → LLM)           | |
|  |                                                  | |
|  | [Try Again] [Check Status] [Switch LLM]          | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

#### Pattern 2: LLM Context Length Exceeded

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ⚠️ Request Too Long                              | |
|  |                                                  | |
|  | Your request contains too much data for the AI   | |
|  | to process at once.                              | |
|  |                                                  | |
|  | Suggestions:                                     | |
|  | • Break your request into smaller parts          | |
|  | • Focus on a specific time period                | |
|  | • Use filters to narrow results                  | |
|  |                                                  | |
|  | [Try Simplified Request] [Learn More]            | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

#### Pattern 3: LLM Safety Filter Triggered

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 🛡️ Request Not Processed                         | |
|  |                                                  | |
|  | Your request couldn't be processed due to        | |
|  | content policy restrictions.                     | |
|  |                                                  | |
|  | Please rephrase your request and try again.      | |
|  |                                                  | |
|  | [Learn More About Content Policy] [Dismiss]      | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

---

## 4. Empty States

Empty states are **opportunities**, not failures. Use them to educate and guide users.

### 4.1 Empty Dashboard (First Time)

```
+--------------------------------------------------------+
|  Dashboard                            🔍  ⚙️  👤       |
+--------------------------------------------------------+
|                                                        |
|              ✨ Welcome to Fidus!                      |
|                                                        |
|  +------------------------------------------------+   |
|  |         📊                                     |   |
|  |                                                |   |
|  |   No opportunities yet.                        |   |
|  |                                                |   |
|  |   Fidus is analyzing your data to find         |   |
|  |   opportunities. This usually takes a few      |   |
|  |   minutes after setup.                         |   |
|  |                                                |   |
|  |   What you can do:                             |   |
|  |   • Add more domains to get more opportunities |   |
|  |   • Import existing data (calendar, finance)   |   |
|  |   • Read about how Fidus works                 |   |
|  |                                                |   |
|  |   [Add Domains] [Import Data] [Learn More]     |   |
|  +------------------------------------------------+   |
|                                                        |
+--------------------------------------------------------+
```

### 4.2 Empty Domain (No Data)

**Calendar:**
```
+--------------------------------------------------------+
|  Calendar                             🔍  ⚙️  👤       |
+--------------------------------------------------------+
|                                                        |
|              📅 No Calendar Connected                  |
|                                                        |
|  Connect your calendar to let Fidus:                   |
|  • Detect scheduling conflicts                         |
|  • Suggest meeting prep time                           |
|  • Remind you of upcoming events                       |
|                                                        |
|  [Connect Google Calendar]                             |
|  [Connect Outlook]                                     |
|  [Connect iCloud]                                      |
|  [Use CalDAV]                                          |
|                                                        |
|  ℹ️ All calendar data stays on your device             |
|                                                        |
+--------------------------------------------------------+
```

**Finance:**
```
+--------------------------------------------------------+
|  Finance                              🔍  ⚙️  👤       |
+--------------------------------------------------------+
|                                                        |
|              💰 No Transactions Yet                    |
|                                                        |
|  Start tracking your spending:                         |
|                                                        |
|  +------------------+  +------------------+           |
|  | 🏦 Connect Bank  |  | 📄 Import CSV    |           |
|  |                  |  |                  |           |
|  | Automatic sync   |  | One-time import  |           |
|  | via Plaid        |  | from file        |           |
|  |                  |  |                  |           |
|  | [Connect]        |  | [Import]         |           |
|  +------------------+  +------------------+           |
|                                                        |
|  +------------------+                                 |
|  | ✏️ Manual Entry   |                                 |
|  |                  |                                 |
|  | Add transactions |                                 |
|  | one by one       |                                 |
|  |                  |                                 |
|  | [Add Transaction]|                                 |
|  +------------------+                                 |
|                                                        |
+--------------------------------------------------------+
```

### 4.3 Empty Search Results

```
+--------------------------------------------------------+
|  Search                          [✕]                   |
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 🔍 "flight to paris"                             | |
|  +--------------------------------------------------+ |
|                                                        |
|              🔍 No Results                             |
|                                                        |
|  We couldn't find any matches for "flight to paris"    |
|                                                        |
|  +------------------------------------------------+   |
|  | 💡 Try This:                                   |   |
|  |                                                |   |
|  | • Connect your Travel domain to track flights  |   |
|  | • Check spelling                               |   |
|  | • Use simpler keywords ("paris" or "flight")   |   |
|  | • Search within specific domains               |   |
|  +------------------------------------------------+   |
|                                                        |
|  [Connect Travel Domain] [Clear Search] [Back]         |
|                                                        |
+--------------------------------------------------------+
```

### 4.4 Empty List (After Filtering)

```
+--------------------------------------------------------+
|  Finance > Transactions                               |
+--------------------------------------------------------+
|                                                        |
|  Active Filters:                                       |
|  [Category: Food ✕] [Date: Last 7 days ✕]             |
|  [Amount: > $100 ✕]                                    |
|                                                        |
|              📊 No Matching Transactions               |
|                                                        |
|  No transactions match your current filters.           |
|                                                        |
|  Suggestions:                                          |
|  • Remove some filters                                 |
|  • Try a longer date range                             |
|  • Lower the minimum amount                            |
|                                                        |
|  [Clear All Filters] [Adjust Filters]                  |
|                                                        |
+--------------------------------------------------------+
```

### 4.5 Empty History (Feature Not Used)

```
+--------------------------------------------------------+
|  Search History                                        |
+--------------------------------------------------------+
|                                                        |
|              🔍 No Search History                      |
|                                                        |
|  Your recent searches will appear here for quick       |
|  access.                                               |
|                                                        |
|  Start by searching for something:                     |
|  • "Dentist appointment next week"                     |
|  • "How much did I spend on food?"                     |
|  • "Upcoming travel"                                   |
|                                                        |
|  [Start Searching]                                     |
|                                                        |
+--------------------------------------------------------+
```

---

## 5. Offline States

### 5.1 Offline Banner (Global)

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 📡 You're offline                                | |
|  |                                                  | |
|  | Fidus works offline. Changes will sync when      | |
|  | you reconnect.                                   | |
|  |                                                  | |
|  | [Dismiss]                                        | |
|  +--------------------------------------------------+ |
|                                                        |
|  Dashboard                            🔍  ⚙️  👤       |
+--------------------------------------------------------+
```

**Reconnected:**
```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ✅ Back online                                   | |
|  |                                                  | |
|  | Syncing 3 changes...                             | |
|  +--------------------------------------------------+ |
|                                                        |
```

### 5.2 Offline Feature Limitation

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 📡 Offline Mode                                  | |
|  |                                                  | |
|  | This feature requires an internet connection.    | |
|  |                                                  | |
|  | Feature: Bank Sync (via Plaid)                   | |
|  |                                                  | |
|  | Available offline:                               | |
|  | • View existing transactions                     | |
|  | • Add manual transactions                        | |
|  | • View budgets                                   | |
|  |                                                  | |
|  | [View Transactions] [Dismiss]                    | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

### 5.3 Offline Data Staleness Warning

```
+--------------------------------------------------------+
|  Calendar                             🔍  ⚙️  👤       |
+--------------------------------------------------------+
|                                                        |
|  +--------------------------------------------------+ |
|  | ⚠️ Data may be outdated                          | |
|  |                                                  | |
|  | You've been offline for 6 hours.                 | |
|  | Calendar events may have changed.                | |
|  |                                                  | |
|  | Last sync: Today at 9:00 AM                      | |
|  |                                                  | |
|  | [Sync Now] [Dismiss]                             | |
|  +--------------------------------------------------+ |
|                                                        |
+--------------------------------------------------------+
```

---

## 6. Permission States

### 6.1 Permission Required (Before Requesting)

```
+--------------------------------------------------------+
|  🔒 Calendar Access Required                     [✕]  |
+--------------------------------------------------------+
|                                                        |
|  To detect scheduling conflicts, Fidus needs access    |
|  to your calendar.                                     |
|                                                        |
|  +-------------------------------------------------+  |
|  | What we'll do with this permission:             |  |
|  |                                                 |  |
|  | ✅ Read your calendar events                    |  |
|  | ✅ Check for conflicts                          |  |
|  | ✅ Suggest meeting prep time                    |  |
|  |                                                 |  |
|  | What we WON'T do:                               |  |
|  |                                                 |  |
|  | ❌ Upload your calendar data                    |  |
|  | ❌ Share your events with anyone                |  |
|  | ❌ Modify events without your permission        |  |
|  +-------------------------------------------------+  |
|                                                        |
|  🔒 All data stays on your device                      |
|                                                        |
|  [Grant Access] [Not Now]                              |
|                                                        |
+--------------------------------------------------------+
```

### 6.2 Permission Denied (After User Declines)

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 🔒 Calendar Access Denied                        | |
|  |                                                  | |
|  | You declined calendar access.                    | |
|  |                                                  | |
|  | Without calendar access, Fidus can't:            | |
|  | • Detect double bookings                         | |
|  | • Suggest meeting prep time                      | |
|  | • Show upcoming events on dashboard              | |
|  |                                                  | |
|  | You can grant access anytime in Settings.        | |
|  |                                                  | |
|  | [Open Settings] [Dismiss]                        | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

### 6.3 Permission Revoked (After Previously Granted)

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ⚠️ Calendar Access Lost                          | |
|  |                                                  | |
|  | Google Calendar access was revoked.              | |
|  |                                                  | |
|  | This might have happened because:                | |
|  | • You changed your Google password               | |
|  | • You revoked access in Google settings          | |
|  | • The authorization expired                      | |
|  |                                                  | |
|  | [Reconnect Calendar] [Learn More] [Dismiss]      | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

### 6.4 Permission Granted (Success)

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ✅ Calendar Connected                            | |
|  |                                                  | |
|  | Google Calendar successfully connected.          | |
|  |                                                  | |
|  | Found 3 calendars:                               | |
|  | • Work Calendar (primary)                        | |
|  | • Personal Calendar                              | |
|  | • US Holidays (read-only)                        | |
|  |                                                  | |
|  | Syncing events now...                            | |
|  |                                                  | |
|  | [View Calendar] [Settings] [Dismiss]             | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

---

## 7. Rate Limiting

### 7.1 API Rate Limit Exceeded

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ⏱️ Too Many Requests                              | |
|  |                                                  | |
|  | You've sent too many requests in a short time.   | |
|  |                                                  | |
|  | Please wait 2 minutes before trying again.       | |
|  |                                                  | |
|  | Why this happens:                                | |
|  | • Prevents system overload                       | |
|  | • Protects against abuse                         | |
|  |                                                  | |
|  | Rate limit: 60 requests per minute               | |
|  | Reset in: 1 minute 45 seconds                    | |
|  |                                                  | |
|  | [OK]                                             | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

### 7.2 LLM Token Limit (Daily)

```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | 🤖 Daily AI Limit Reached                        | |
|  |                                                  | |
|  | You've reached your daily AI usage limit.        | |
|  |                                                  | |
|  | Usage today: 500,000 tokens (100%)               | |
|  | Resets in: 8 hours                               | |
|  |                                                  | |
|  | What you can still do:                           | |
|  | • View existing opportunities                    | |
|  | • Manually create appointments                   | |
|  | • Access all your data                           | |
|  |                                                  | |
|  | Want more AI usage?                              | |
|  | [Upgrade Plan] [Learn More] [OK]                 | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

---

## 8. Recovery Patterns

### 8.1 Auto-Recovery (Silent)

**Use when:**
- Transient network errors
- Temporary service unavailability
- Brief connection drops

**Pattern:**
```typescript
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await wait(2 ** i * 1000); // Exponential backoff
    }
  }
}
```

**UI Feedback:**
- Show loading state during retry
- No error message if recovery succeeds
- Only show error after all retries fail

### 8.2 User-Initiated Recovery

**Use when:**
- Auto-recovery failed
- User action required (e.g., re-authenticate)
- Ambiguous error requiring user decision

**Pattern:**
```
+--------------------------------------------------------+
|  +--------------------------------------------------+ |
|  | ⚠️ Sync Failed                                   | |
|  |                                                  | |
|  | Calendar sync failed after 3 attempts.           | |
|  |                                                  | |
|  | [Try Again] [Reconnect Calendar] [Skip]          | |
|  +--------------------------------------------------+ |
+--------------------------------------------------------+
```

### 8.3 Graceful Degradation

**Use when:**
- Feature partially available
- Fallback mode exists
- Core functionality still works

**Pattern:**
```
+--------------------------------------------------------+
|  Dashboard                            🔍  ⚙️  👤       |
+--------------------------------------------------------+
|                                                        |
|  +--------------------------------------------------+ |
|  | ℹ️ Limited Mode                                  | |
|  |                                                  | |
|  | AI suggestions unavailable (Ollama offline).     | |
|  | Showing manual opportunities only.               | |
|  |                                                  | |
|  | [Fix Now] [Dismiss]                              | |
|  +--------------------------------------------------+ |
|                                                        |
|  +--------------------------------------------------+ |
|  | 🔴 URGENT: Double booking detected               | |
|  | (Manual detection)                               | |
|  +--------------------------------------------------+ |
|                                                        |
+--------------------------------------------------------+
```

### 8.4 Data Recovery

**Use when:**
- Data corruption detected
- Sync conflict
- Local data newer than server

**Pattern:**
```
+--------------------------------------------------------+
|  ⚠️ Data Conflict Detected                       [✕]  |
+--------------------------------------------------------+
|                                                        |
|  Local and server data don't match.                    |
|                                                        |
|  +-------------------------------------------------+  |
|  | Local Changes (Newer):                          |  |
|  | 15 new transactions                             |  |
|  | 3 updated budgets                               |  |
|  | Last modified: 10 minutes ago                   |  |
|  +-------------------------------------------------+  |
|                                                        |
|  +-------------------------------------------------+  |
|  | Server Data (Older):                            |  |
|  | 12 transactions                                 |  |
|  | 2 budgets                                       |  |
|  | Last synced: 2 hours ago                        |  |
|  +-------------------------------------------------+  |
|                                                        |
|  Recommended: Keep local changes                       |
|                                                        |
|  [Keep Local] [Use Server] [Merge Both]                |
|  [View Differences]                                    |
|                                                        |
+--------------------------------------------------------+
```

---

## 9. Accessibility

### 9.1 Screen Reader Announcements

**Error Announcements:**

```html
<!-- Form validation error -->
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  Error: Email is required
</div>

<!-- Network error (less urgent) -->
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Connection lost. Retrying...
</div>

<!-- Success after error -->
<div
  role="status"
  aria-live="polite"
>
  Connection restored
</div>
```

**Empty State Announcements:**

```html
<div
  role="region"
  aria-label="Search results"
  aria-live="polite"
>
  <p>No results found for "dentist appointment"</p>
  <p>Suggestions: Check spelling, try different keywords</p>
</div>
```

### 9.2 Keyboard Navigation

**Error Dialogs:**
- `Escape` - Close error modal (if dismissible)
- `Tab` / `Shift+Tab` - Navigate between action buttons
- `Enter` - Activate focused button
- Focus trap within modal (can't Tab out)

**Error Recovery:**
- Focus automatically moves to error message
- First action button receives focus
- Clear visual focus indicators

### 9.3 Color Contrast

**Error Text:**
- Error red: `#DC2626` (WCAG AA compliant on white)
- Warning yellow: `#F59E0B` (WCAG AA compliant on white)
- Info blue: `#3B82F6` (WCAG AA compliant on white)

**Icons:**
- Always pair icons with text labels
- Don't rely on color alone to convey error state

---

## 10. Best Practices

### DO ✅

**Error Messages:**
- ✅ Be specific about what went wrong
- ✅ Suggest concrete next steps
- ✅ Use friendly, human language
- ✅ Include error codes for support
- ✅ Respect user privacy (no sensitive data in errors)

**Empty States:**
- ✅ Explain why the state is empty
- ✅ Provide clear call-to-action
- ✅ Show examples or suggestions
- ✅ Make it visually distinct from errors
- ✅ Use empty states to educate

**Recovery:**
- ✅ Auto-retry transient errors
- ✅ Provide manual retry option
- ✅ Show recovery progress
- ✅ Preserve user data during errors
- ✅ Gracefully degrade when possible

**Accessibility:**
- ✅ Announce errors to screen readers
- ✅ Maintain keyboard navigation
- ✅ Use ARIA live regions
- ✅ Provide text alternatives for icons
- ✅ Ensure color contrast compliance

### DON'T ❌

**Error Messages:**
- ❌ Blame the user ("You entered an invalid...")
- ❌ Use technical jargon users won't understand
- ❌ Show stack traces or debug info (unless expandable)
- ❌ Leak sensitive data in error messages
- ❌ Leave users with no path forward

**Empty States:**
- ❌ Show just "No data" without context
- ❌ Make empty states look like errors
- ❌ Forget to provide action buttons
- ❌ Use overly playful language for critical states
- ❌ Hide empty states (always acknowledge)

**Recovery:**
- ❌ Retry forever without telling the user
- ❌ Lose user data on error
- ❌ Fail silently
- ❌ Make users re-enter form data after errors
- ❌ Block entire app for one feature error

**Accessibility:**
- ❌ Hide errors from screen readers
- ❌ Trap focus without escape route
- ❌ Rely on color alone for error indication
- ❌ Forget to announce state changes
- ❌ Make error actions keyboard-inaccessible

---

## Examples

### Complete Error Recovery Flow

**Scenario:** User tries to connect Google Calendar, but OAuth fails.

**Step 1: Initial Attempt**
```
[Connect Google Calendar] ← User clicks
↓
Loading... (spinner)
```

**Step 2: Error Occurs**
```
+--------------------------------------------------------+
|  ⚠️ Connection Failed                            [✕]  |
+--------------------------------------------------------+
|                                                        |
|  Couldn't connect to Google Calendar.                  |
|                                                        |
|  Possible causes:                                      |
|  • Pop-up was blocked                                  |
|  • Authorization was cancelled                         |
|  • Network connection issue                            |
|                                                        |
|  [Try Again] [Help] [Cancel]                           |
|                                                        |
+--------------------------------------------------------+
```

**Step 3: User Clicks "Try Again"**
```
+--------------------------------------------------------+
|  Connecting to Google Calendar...                      |
|                                                        |
|  ⚙️ Opening authorization window...                    |
|                                                        |
|  [Cancel]                                              |
+--------------------------------------------------------+
```

**Step 4: Success**
```
+--------------------------------------------------------+
|  ✅ Calendar Connected                                 |
|                                                        |
|  Successfully connected Google Calendar.               |
|                                                        |
|  Found 3 calendars: Work, Personal, Holidays           |
|                                                        |
|  [View Calendar] [Dismiss]                             |
+--------------------------------------------------------+
```

---

## Related Documentation

- [04-interaction-patterns.md](04-interaction-patterns.md) - Form validation patterns
- [06-opportunity-cards-layouts.md](06-opportunity-cards-layouts.md) - Card error states
- [12-onboarding-ux.md](12-onboarding-ux.md) - Onboarding error handling
- [16-search-patterns.md](16-search-patterns.md) - Search empty states
- [17-settings-ui.md](17-settings-ui.md) - Settings error recovery

---

**Document Status:** ✅ Complete
**Last Review:** 2025-01-28
**Next Review:** 2025-02-28 (quarterly review)
