# PostgreSQL Conversation Storage

This module provides PostgreSQL-based conversation history storage for Fidus Memory Phase 4.

## Features

- **Conversation History**: Store user-assistant conversations with metadata
- **7-Day Retention**: Automatic privacy-compliant cleanup of old messages
- **Multi-Tenancy**: Full tenant_id + user_id isolation
- **GDPR Compliance**: User data deletion on request
- **Type Safety**: Full Python type hints with strict mypy compliance

## Architecture

```
┌─────────────────────────────────────────────┐
│         ConversationStore (Python)          │
│                                             │
│  - save_message()                           │
│  - get_conversation_history()               │
│  - cleanup_old_conversations()              │
│  - delete_user_conversations()              │
└──────────────┬──────────────────────────────┘
               │ asyncpg
               ▼
┌─────────────────────────────────────────────┐
│      PostgreSQL Database (fidus)            │
│                                             │
│  Table: conversations                       │
│    - id (UUID)                              │
│    - user_id (VARCHAR)                      │
│    - tenant_id (VARCHAR)                    │
│    - role (VARCHAR)                         │
│    - content (TEXT)                         │
│    - metadata (JSONB)                       │
│    - created_at (TIMESTAMP)                 │
│                                             │
│  Functions:                                 │
│    - delete_old_conversations()             │
│    - get_conversation_history()             │
│    - delete_user_conversations()            │
└─────────────────────────────────────────────┘
```

## Database Schema

The database schema is automatically initialized via `scripts/init-db.sql` when the PostgreSQL container starts.

### Table: conversations

| Column     | Type                    | Description                          |
|------------|-------------------------|--------------------------------------|
| id         | UUID                    | Primary key (auto-generated)         |
| user_id    | VARCHAR(255)            | User identifier (multi-tenancy)      |
| tenant_id  | VARCHAR(255)            | Tenant identifier (multi-tenancy)    |
| role       | VARCHAR(50)             | Message role (user/assistant/system) |
| content    | TEXT                    | Message content                      |
| metadata   | JSONB                   | Optional metadata                    |
| created_at | TIMESTAMP WITH TIMEZONE | Creation timestamp                   |

### Indexes

- `idx_conversations_user_tenant_created`: Optimizes history retrieval queries
- `idx_conversations_created_at`: Optimizes cleanup operations

### Constraints

- `conversations_role_check`: Ensures role is one of: user, assistant, system
- `conversations_tenant_user`: Ensures tenant_id and user_id are not empty

## Usage

### Basic Usage

```python
from fidus.infrastructure.postgres.conversation_store import ConversationStore
from fidus.config import PrototypeConfig

# Initialize store
store = ConversationStore()
await store.initialize()

# Save a message
await store.save_message(
    user_id="user-123",
    tenant_id=PrototypeConfig.PROTOTYPE_TENANT_ID,
    role="user",
    content="What's the weather like?",
    metadata={"source": "web_ui"}
)

# Retrieve conversation history (chronological order)
messages = await store.get_conversation_history(
    user_id="user-123",
    tenant_id=PrototypeConfig.PROTOTYPE_TENANT_ID,
    limit=20
)

for msg in messages:
    print(f"{msg.role}: {msg.content}")

# Clean up old conversations (7-day retention)
deleted = await store.cleanup_old_conversations()
print(f"Deleted {deleted} old messages")

# Delete user data (GDPR compliance)
deleted = await store.delete_user_conversations(
    user_id="user-123",
    tenant_id=PrototypeConfig.PROTOTYPE_TENANT_ID
)

# Close store
await store.close()
```

### With Connection Pool

```python
import asyncpg

# Create connection pool
pool = await asyncpg.create_pool(
    host="localhost",
    port=5432,
    user="fidus",
    password="fidus_password",
    database="fidus"
)

# Pass pool to store
store = ConversationStore(pool=pool)

# Use store...

# Close pool when done
await pool.close()
```

## Configuration

Configure PostgreSQL connection via environment variables:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=fidus
POSTGRES_PASSWORD=fidus_password
POSTGRES_DB=fidus
```

Or use `PrototypeConfig`:

```python
from fidus.config import config

print(config.postgres_dsn)
# postgresql://fidus:fidus_password@localhost:5432/fidus
```

## Privacy & Compliance

### 7-Day Retention Policy

Messages are automatically deleted after 7 days for privacy compliance. The `delete_old_conversations()` function should be called periodically:

```python
# In a scheduled task (e.g., cron job)
deleted = await store.cleanup_old_conversations()
logger.info(f"Cleaned up {deleted} old messages")
```

### User Data Deletion (GDPR)

Users can request deletion of all their conversation data:

```python
# Handle GDPR deletion request
deleted = await store.delete_user_conversations(
    user_id=request.user_id,
    tenant_id=request.tenant_id
)
```

## Multi-Tenancy

All operations are scoped to `tenant_id + user_id`:

- Users can only access their own conversations within their tenant
- Cross-tenant queries are prevented by design
- Database indexes optimize tenant-scoped queries

```python
# User A in Tenant 1
messages_a = await store.get_conversation_history(
    user_id="user-a",
    tenant_id="tenant-1"
)

# User B in Tenant 1 (isolated from User A)
messages_b = await store.get_conversation_history(
    user_id="user-b",
    tenant_id="tenant-1"
)

# User A in Tenant 2 (isolated from Tenant 1)
messages_a2 = await store.get_conversation_history(
    user_id="user-a",
    tenant_id="tenant-2"
)
```

## Testing

### Running Integration Tests

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Run tests
cd packages/api
poetry run pytest tests/infrastructure/test_conversation_store.py -v
```

### Manual Testing

```bash
# Run manual test script
cd packages/api
poetry run python -m fidus.infrastructure.postgres.manual_test
```

## Database Functions

The PostgreSQL schema includes helper functions:

### delete_old_conversations()

Deletes messages older than 7 days.

```sql
SELECT delete_old_conversations();
```

Returns: Number of messages deleted

### get_conversation_history(p_user_id, p_tenant_id, p_limit)

Retrieves conversation history for a user.

```sql
SELECT * FROM get_conversation_history('user-123', 'tenant-1', 20);
```

Returns: Table of conversation messages

### delete_user_conversations(p_user_id, p_tenant_id)

Deletes all conversations for a user.

```sql
SELECT delete_user_conversations('user-123', 'tenant-1');
```

Returns: Number of messages deleted

## Performance

- **Indexes**: Optimized for common query patterns
- **Connection Pooling**: asyncpg connection pool with 2-10 connections
- **Batch Operations**: Efficient bulk inserts and deletes
- **JSONB**: Fast metadata queries with PostgreSQL JSONB

## Security

- **Parameterized Queries**: Protection against SQL injection
- **Role Validation**: Enforced at database and application level
- **Tenant Isolation**: Database-level constraints ensure data separation
- **No Sensitive Data**: Metadata should not contain PII or secrets

## Migration Path

For future migrations, use Alembic:

```bash
# Create migration
alembic revision -m "add conversations table"

# Apply migration
alembic upgrade head
```

Currently, the schema is initialized via `scripts/init-db.sql` which runs automatically when the PostgreSQL container starts.

## Troubleshooting

### Connection Issues

```python
# Check connection
from fidus.config import config
print(config.postgres_dsn)

# Test connection manually
import asyncpg
conn = await asyncpg.connect(config.postgres_dsn)
await conn.close()
```

### Schema Not Initialized

```bash
# Verify schema
docker exec fidus-postgres psql -U fidus -d fidus -c "\d conversations"

# Re-initialize if needed
docker-compose down postgres
docker volume rm fidus_postgres_data
docker-compose up -d postgres
```

### Performance Issues

```bash
# Check indexes
docker exec fidus-postgres psql -U fidus -d fidus -c "\di"

# Analyze query performance
docker exec fidus-postgres psql -U fidus -d fidus -c "EXPLAIN ANALYZE SELECT * FROM conversations WHERE user_id = 'test' AND tenant_id = 'prototype-tenant' ORDER BY created_at ASC LIMIT 20;"
```

## Future Enhancements

- [ ] Add support for conversation threads
- [ ] Implement message editing/deletion
- [ ] Add full-text search on message content
- [ ] Support for message attachments (references)
- [ ] Conversation analytics and insights
- [ ] Export conversation history (JSON/CSV)

## References

- [asyncpg Documentation](https://magicstack.github.io/asyncpg/current/)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [GDPR Compliance](https://gdpr.eu/)
