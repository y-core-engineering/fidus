-- Fidus Database Initialization Script
-- This script sets up the PostgreSQL database schema for Fidus Memory

-- ============================================================================
-- Conversations Table
-- ============================================================================
-- Stores conversation history with automatic 7-day retention for privacy

CREATE TABLE IF NOT EXISTS conversations (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Multi-tenancy identifiers
    user_id VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,

    -- Message content
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,

    -- Optional metadata (JSON format)
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: tenant_id + user_id isolation
    CONSTRAINT conversations_tenant_user CHECK (LENGTH(tenant_id) > 0 AND LENGTH(user_id) > 0)
);

-- ============================================================================
-- Indexes for Query Performance
-- ============================================================================

-- Index for retrieving conversation history (most common query)
CREATE INDEX IF NOT EXISTS idx_conversations_user_tenant_created
ON conversations (user_id, tenant_id, created_at DESC);

-- Index for cleanup operations
CREATE INDEX IF NOT EXISTS idx_conversations_created_at
ON conversations (created_at);

-- ============================================================================
-- Automatic Cleanup Function (7-Day Retention)
-- ============================================================================

CREATE OR REPLACE FUNCTION delete_old_conversations()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete conversations older than 7 days
    DELETE FROM conversations
    WHERE created_at < NOW() - INTERVAL '7 days';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Scheduled Cleanup (Optional - can be run via cron or application)
-- ============================================================================
-- Note: PostgreSQL doesn't have built-in job scheduling like SQL Server
-- This function should be called periodically by the application or via pg_cron extension

COMMENT ON FUNCTION delete_old_conversations() IS
'Deletes conversation messages older than 7 days for privacy compliance.
Should be called periodically by the application or scheduled via pg_cron extension.';

-- ============================================================================
-- Helper Function: Get Conversation History
-- ============================================================================

CREATE OR REPLACE FUNCTION get_conversation_history(
    p_user_id VARCHAR(255),
    p_tenant_id VARCHAR(255),
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    user_id VARCHAR(255),
    tenant_id VARCHAR(255),
    role VARCHAR(50),
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.user_id,
        c.tenant_id,
        c.role,
        c.content,
        c.metadata,
        c.created_at
    FROM conversations c
    WHERE c.user_id = p_user_id
      AND c.tenant_id = p_tenant_id
    ORDER BY c.created_at ASC  -- Chronological order (oldest first)
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_conversation_history(VARCHAR, VARCHAR, INTEGER) IS
'Retrieves conversation history for a specific user within a tenant, ordered chronologically (oldest first).';

-- ============================================================================
-- Helper Function: Delete User Conversations (Privacy Feature)
-- ============================================================================

CREATE OR REPLACE FUNCTION delete_user_conversations(
    p_user_id VARCHAR(255),
    p_tenant_id VARCHAR(255)
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM conversations
    WHERE user_id = p_user_id
      AND tenant_id = p_tenant_id;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION delete_user_conversations(VARCHAR, VARCHAR) IS
'Deletes all conversation history for a specific user within a tenant. Privacy feature for GDPR compliance.';

-- ============================================================================
-- Grants (adjust based on your application user)
-- ============================================================================

-- Grant permissions to fidus user (matches docker-compose.yml)
GRANT SELECT, INSERT, DELETE ON conversations TO fidus;
GRANT EXECUTE ON FUNCTION delete_old_conversations() TO fidus;
GRANT EXECUTE ON FUNCTION get_conversation_history(VARCHAR, VARCHAR, INTEGER) TO fidus;
GRANT EXECUTE ON FUNCTION delete_user_conversations(VARCHAR, VARCHAR) TO fidus;

-- ============================================================================
-- Completion Message
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Fidus Database Schema Initialized';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: conversations';
    RAISE NOTICE 'Functions created: delete_old_conversations, get_conversation_history, delete_user_conversations';
    RAISE NOTICE 'Privacy: 7-day retention policy';
    RAISE NOTICE 'Multi-tenancy: Enforced via tenant_id + user_id';
    RAISE NOTICE '========================================';
END $$;
