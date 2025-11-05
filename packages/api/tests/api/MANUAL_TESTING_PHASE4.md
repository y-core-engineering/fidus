# Manual Testing Guide: Phase 4 Multi-User Support & Authentication

This guide provides manual testing instructions for Phase 4 features: authentication middleware, health checks, and user isolation.

## Prerequisites

1. Start all services with Docker Compose:
```bash
cd /Users/sebastianherden/Documents/GitHub/fidus
docker compose up -d
```

2. Verify all services are running:
```bash
docker compose ps
```

Expected services: neo4j, postgres, redis, qdrant, ollama, memory-api

## Test 1: Basic Health Checks

### Test 1.1: Simple Health Check (No Authentication Required)

```bash
curl http://localhost:8080/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Fidus Memory API is running"
}
```

**Verification:**
- Response status: 200 OK
- No X-User-ID header in response
- No authentication required

### Test 1.2: Database Health Check (No Authentication Required)

```bash
curl http://localhost:8080/health/db
```

**Expected Response:**
```json
{
  "status": "healthy",
  "databases": {
    "neo4j": {
      "status": "ok",
      "message": "Connected to Neo4j",
      "details": {
        "uri": "neo4j://localhost:7687"
      }
    },
    "postgresql": {
      "status": "ok",
      "message": "Connected to PostgreSQL",
      "details": {
        "url": "localhost/fidus_memory"
      }
    },
    "qdrant": {
      "status": "ok",
      "message": "Connected to Qdrant",
      "details": {
        "host": "localhost",
        "port": 6333,
        "collections_count": 0
      }
    },
    "redis": {
      "status": "ok",
      "message": "Connected to Redis",
      "details": {
        "url": "localhost:6379"
      }
    }
  }
}
```

**Verification:**
- Response status: 200 OK
- All databases show "ok" status (or graceful degradation if some are optional)
- No X-User-ID header in response

## Test 2: Guest User Creation

### Test 2.1: Chat Without X-User-ID Header

```bash
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "message": "Hello, I love pizza"
  }' -v
```

**Expected Response:**
```json
{
  "response": "Hi! I noted that you love pizza. How can I help you today?"
}
```

**Verification:**
- Response status: 200 OK
- Response header includes: `X-User-ID: guest-<UUID>`
- Guest user ID follows format: `guest-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

### Test 2.2: Verify Guest User Has Preferences

Use the X-User-ID from the previous response:

```bash
GUEST_ID="<guest-id-from-previous-response>"
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: $GUEST_ID" -v
```

**Expected Response:**
```json
{
  "preferences": [
    {
      "key": "food.pizza",
      "value": "loves pizza",
      "sentiment": "positive",
      "confidence": 0.8,
      "domain": "food",
      ...
    }
  ]
}
```

**Verification:**
- Response status: 200 OK
- Preferences list contains the pizza preference
- Response header includes same X-User-ID

## Test 3: User Authentication with X-User-ID

### Test 3.1: Chat with Specific User ID

```bash
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -H "X-User-ID: alice-12345" \
  -d '{
    "user_id": "alice-12345",
    "message": "I prefer dark chocolate"
  }' -v
```

**Expected Response:**
```json
{
  "response": "Noted! You prefer dark chocolate. Anything else?"
}
```

**Verification:**
- Response status: 200 OK
- Response header: `X-User-ID: alice-12345` (preserved)

### Test 3.2: Query Preferences for Alice

```bash
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: alice-12345"
```

**Expected Response:**
```json
{
  "preferences": [
    {
      "key": "food.chocolate",
      "value": "prefers dark chocolate",
      "sentiment": "positive",
      ...
    }
  ]
}
```

## Test 4: USER ISOLATION (CRITICAL SECURITY TEST)

This is the most important test to verify multi-user security.

### Test 4.1: Create Preferences for User A

```bash
# User A: Alice creates preferences
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -H "X-User-ID: alice-12345" \
  -d '{
    "user_id": "alice-12345",
    "message": "I love Italian food and hate spicy food"
  }'
```

### Test 4.2: Verify User A Has Preferences

```bash
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: alice-12345"
```

**Expected:**
- At least one preference (e.g., "food.italian": "loves Italian food")

**Save the output:** Alice should have preferences related to Italian food and spicy food.

### Test 4.3: Query Preferences as User B

```bash
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: bob-67890"
```

**Expected Response:**
```json
{
  "preferences": []
}
```

**CRITICAL VERIFICATION:**
- User B MUST have ZERO preferences
- User B MUST NOT see Alice's preferences
- If Bob sees Alice's preferences, USER ISOLATION HAS FAILED!

### Test 4.4: Create Different Preferences for User B

```bash
# User B: Bob creates preferences
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -H "X-User-ID: bob-67890" \
  -d '{
    "user_id": "bob-67890",
    "message": "I love spicy food and Mexican cuisine"
  }'
```

### Test 4.5: Verify Both Users Have Different Preferences

**Alice's preferences:**
```bash
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: alice-12345"
```

Expected: Italian food (positive), spicy food (negative)

**Bob's preferences:**
```bash
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: bob-67890"
```

Expected: Spicy food (positive), Mexican cuisine (positive)

**CRITICAL VERIFICATION:**
- Alice should NOT see Bob's preferences
- Bob should NOT see Alice's preferences
- Preferences are COMPLETELY isolated by user_id

## Test 5: Conversation History Isolation

### Test 5.1: User A Has a Conversation

```bash
# Alice introduces herself
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -H "X-User-ID: alice-12345" \
  -d '{
    "user_id": "alice-12345",
    "message": "My name is Alice"
  }'

# Alice asks about her name
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -H "X-User-ID: alice-12345" \
  -d '{
    "user_id": "alice-12345",
    "message": "What is my name?"
  }'
```

**Expected Response (2nd request):**
The assistant should respond with "Alice" or "Your name is Alice"

### Test 5.2: User B Asks Same Question

```bash
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -H "X-User-ID: bob-67890" \
  -d '{
    "user_id": "bob-67890",
    "message": "What is my name?"
  }'
```

**Expected Response:**
The assistant should say "I don't know" or ask for Bob's name.

**CRITICAL VERIFICATION:**
- Bob's response MUST NOT mention "Alice"
- Bob's conversation history is isolated from Alice's
- If Bob gets "Alice" as the answer, ISOLATION HAS FAILED!

## Test 6: Multiple Guest Users

### Test 6.1: Create First Guest User

```bash
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "guest1",
    "message": "I like chocolate ice cream"
  }' -v
```

Save the X-User-ID from response headers (e.g., `guest-AAAA-BBBB-...`)

### Test 6.2: Create Second Guest User

```bash
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "guest2",
    "message": "I like vanilla ice cream"
  }' -v
```

Save the X-User-ID from response headers (e.g., `guest-CCCC-DDDD-...`)

### Test 6.3: Verify Different Guest IDs

**VERIFICATION:**
- Guest1 ID ≠ Guest2 ID
- Each guest gets a unique UUID-based identifier

### Test 6.4: Verify Guest Isolation

```bash
GUEST1_ID="<guest-id-from-test-6.1>"
GUEST2_ID="<guest-id-from-test-6.2>"

# Guest 1's preferences
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: $GUEST1_ID"

# Guest 2's preferences
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: $GUEST2_ID"
```

**VERIFICATION:**
- Guest1 should only see chocolate ice cream preference
- Guest2 should only see vanilla ice cream preference
- NO overlap between guest preferences

## Test 7: OpenAPI Docs Access (No Auth Required)

### Test 7.1: Access OpenAPI JSON

```bash
curl http://localhost:8080/openapi.json
```

**Expected:**
- Response status: 200 OK
- Valid OpenAPI JSON schema
- No X-User-ID header in response

### Test 7.2: Access Swagger UI

```bash
curl http://localhost:8080/docs
```

**Expected:**
- Response status: 200 OK or 307 Redirect
- No X-User-ID header in response
- No authentication required

## Test 8: Consistent User ID Across Requests

### Test 8.1: Make Multiple Requests with Same User ID

```bash
USER_ID="consistent-user-123"

# First request
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_ID" \
  -d '{
    "user_id": "'$USER_ID'",
    "message": "First message"
  }' -v

# Second request
curl -X POST http://localhost:8080/memory/chat/legacy \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_ID" \
  -d '{
    "user_id": "'$USER_ID'",
    "message": "Second message"
  }' -v

# Get preferences
curl http://localhost:8080/memory/preferences \
  -H "X-User-ID: $USER_ID" -v
```

**VERIFICATION:**
- All responses include `X-User-ID: consistent-user-123`
- User ID remains consistent across all requests
- Preferences accumulate across requests

## Test 9: Database Health Check with Failures

### Test 9.1: Stop Neo4j and Check Health

```bash
docker compose stop neo4j
curl http://localhost:8080/health/db
```

**Expected Response:**
```json
{
  "status": "degraded",
  "databases": {
    "neo4j": {
      "status": "error",
      "message": "Neo4j connection failed: ..."
    },
    "postgresql": {"status": "ok", ...},
    "qdrant": {"status": "ok", ...},
    "redis": {"status": "ok", ...}
  }
}
```

**VERIFICATION:**
- Overall status is "degraded" (not "healthy")
- Neo4j shows "error" status
- Other databases still show "ok"

### Test 9.2: Restart Neo4j

```bash
docker compose start neo4j
sleep 5
curl http://localhost:8080/health/db
```

**Expected:**
- Status returns to "healthy"
- All databases show "ok"

## Security Verification Checklist

After completing all tests, verify:

- [ ] Health checks do NOT require authentication
- [ ] Docs endpoints do NOT require authentication
- [ ] All other endpoints DO require authentication (user_id in header)
- [ ] Guest users are created automatically
- [ ] User A CANNOT see User B's preferences
- [ ] User A CANNOT see User B's conversation history
- [ ] Guest users are isolated from each other
- [ ] User IDs remain consistent across requests
- [ ] X-User-ID header is returned in all responses (except health/docs)
- [ ] Database health checks show accurate status

## Troubleshooting

### Problem: "User isolation failed - Bob sees Alice's preferences"

**Solution:** This is a CRITICAL security issue. Check:
1. Verify `get_user_agent()` is being called in all endpoints
2. Verify `tenant_id = user_id` in PersistentAgent initialization
3. Check Neo4j queries use correct `tenant_id` parameter

### Problem: Health checks require authentication

**Solution:** Verify paths are in `SKIP_AUTH_PATHS` in `auth.py`:
- /health
- /health/db
- /docs
- /redoc
- /openapi.json

### Problem: Guest user IDs collide

**Solution:** Check UUID generation in `SimpleAuthMiddleware.dispatch()`:
```python
user_id = f"guest-{uuid.uuid4()}"
```

## Cleanup

After testing, clean up test data:

```bash
# Purge all memories for test users
curl -X DELETE http://localhost:8080/memory/purge-all \
  -H "X-User-ID: alice-12345"

curl -X DELETE http://localhost:8080/memory/purge-all \
  -H "X-User-ID: bob-67890"

# Or restart all services
docker compose down
docker compose up -d
```

---

## Success Criteria

Phase 4 implementation is successful if:

1. ✅ All automated tests pass (9/9)
2. ✅ Manual user isolation test passes (Test 4)
3. ✅ Conversation history isolation works (Test 5)
4. ✅ Health checks accessible without auth (Tests 1, 7)
5. ✅ Guest users created automatically (Test 2)
6. ✅ Multiple guest users isolated (Test 6)
7. ✅ User IDs consistent across requests (Test 8)
8. ✅ Database health monitoring works (Tests 1.2, 9)

**If any test fails, DO NOT deploy to production!**
