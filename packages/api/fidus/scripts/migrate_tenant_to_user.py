"""
Migration Script: tenant_id -> User nodes

This script migrates existing data that uses tenant_id directly
to properly reference User nodes as the aggregate root.

Usage:
    poetry run python -m fidus.scripts.migrate_tenant_to_user --dry-run
    poetry run python -m fidus.scripts.migrate_tenant_to_user --execute

Environment Variables:
    NEO4J_URI: Neo4j connection URI (default: bolt://localhost:7687)
    NEO4J_USER: Neo4j username (default: neo4j)
    NEO4J_PASSWORD: Neo4j password (required)
"""

import asyncio
import argparse
import logging
import os
import sys
from datetime import datetime
from typing import List, Dict, Any
from uuid import uuid4

from neo4j import AsyncGraphDatabase, AsyncDriver

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class MigrationError(Exception):
    """Raised when migration fails."""
    pass


class TenantToUserMigration:
    """
    Migrates tenant_id references to User entity nodes.

    This migration:
    1. Finds all unique tenant_id values in the system
    2. Creates User nodes for each tenant (if not exists)
    3. Updates all entities to reference User nodes
    4. Creates relationships from User to owned entities
    """

    def __init__(self, driver: AsyncDriver, dry_run: bool = True):
        self.driver = driver
        self.dry_run = dry_run
        self.stats = {
            "tenants_found": 0,
            "users_created": 0,
            "users_existing": 0,
            "entities_updated": 0,
            "relationships_created": 0,
            "errors": []
        }

    async def run(self) -> Dict[str, Any]:
        """Execute the migration."""
        logger.info(f"Starting migration (dry_run={self.dry_run})")

        try:
            # Step 1: Find all unique tenant_ids
            tenants = await self._find_tenants()
            self.stats["tenants_found"] = len(tenants)
            logger.info(f"Found {len(tenants)} unique tenant(s)")

            for tenant_id in tenants:
                await self._migrate_tenant(tenant_id)

            # Step 2: Verify migration
            if not self.dry_run:
                await self._verify_migration()

            logger.info("Migration completed successfully")
            return self.stats

        except Exception as e:
            self.stats["errors"].append(str(e))
            logger.error(f"Migration failed: {e}")
            raise MigrationError(f"Migration failed: {e}") from e

    async def _find_tenants(self) -> List[str]:
        """Find all unique tenant_id values in the system."""
        query = """
        // Find tenant_ids from all node types
        MATCH (n)
        WHERE n.tenant_id IS NOT NULL
        RETURN DISTINCT n.tenant_id AS tenant_id
        ORDER BY tenant_id
        """

        async with self.driver.session() as session:
            result = await session.run(query)
            records = [record async for record in result]
            return [r["tenant_id"] for r in records]

    async def _migrate_tenant(self, tenant_id: str) -> None:
        """Migrate a single tenant to User entity structure."""
        logger.info(f"Migrating tenant: {tenant_id}")

        # Check if User node already exists for this tenant
        user = await self._get_or_create_user(tenant_id)

        if user["created"]:
            self.stats["users_created"] += 1
            logger.info(f"  Created User node: {user['id']}")
        else:
            self.stats["users_existing"] += 1
            logger.info(f"  User node already exists: {user['id']}")

        # Update entities to reference User
        entities_updated = await self._update_entities(tenant_id, user["id"])
        self.stats["entities_updated"] += entities_updated

        # Create ownership relationships
        relationships_created = await self._create_ownership_relationships(
            tenant_id, user["id"]
        )
        self.stats["relationships_created"] += relationships_created

    async def _get_or_create_user(self, tenant_id: str) -> Dict[str, Any]:
        """Get existing User or create new one for tenant."""
        # First try to find existing User for this tenant
        find_query = """
        MATCH (u:User {tenant_id: $tenant_id})
        RETURN u.id AS id, false AS created
        LIMIT 1
        """

        async with self.driver.session() as session:
            result = await session.run(find_query, tenant_id=tenant_id)
            record = await result.single()

            if record:
                return {"id": record["id"], "created": False}

        # Create new User if not exists
        if self.dry_run:
            user_id = f"dry-run-user-{uuid4()}"
            logger.info(f"  [DRY RUN] Would create User: {user_id}")
            return {"id": user_id, "created": True}

        now = datetime.utcnow().isoformat()
        user_id = str(uuid4())

        create_query = """
        CREATE (u:User {
            id: $user_id,
            tenant_id: $tenant_id,
            email: $email,
            name: $name,
            preferred_language: 'en',
            timezone: 'UTC',
            skills: [],
            ai_properties: {},
            created_at: datetime($created_at),
            updated_at: datetime($updated_at),
            migrated_from_tenant: true
        })
        RETURN u.id AS id, true AS created
        """

        async with self.driver.session() as session:
            result = await session.run(
                create_query,
                user_id=user_id,
                tenant_id=tenant_id,
                email=f"migrated-{tenant_id}@migration.local",
                name=f"Migrated User ({tenant_id})",
                created_at=now,
                updated_at=now
            )
            record = await result.single()
            return {"id": record["id"], "created": record["created"]}

    async def _update_entities(self, tenant_id: str, user_id: str) -> int:
        """Update all entities to include user_id reference."""
        # Find entities that have tenant_id but no user_id
        count_query = """
        MATCH (n)
        WHERE n.tenant_id = $tenant_id
          AND n.user_id IS NULL
          AND NOT n:User
        RETURN count(n) AS count
        """

        async with self.driver.session() as session:
            result = await session.run(count_query, tenant_id=tenant_id)
            record = await result.single()
            count = record["count"]

        if count == 0:
            logger.info(f"  No entities to update for tenant {tenant_id}")
            return 0

        logger.info(f"  Found {count} entities to update")

        if self.dry_run:
            logger.info(f"  [DRY RUN] Would update {count} entities with user_id={user_id}")
            return count

        # Update entities with user_id
        update_query = """
        MATCH (n)
        WHERE n.tenant_id = $tenant_id
          AND n.user_id IS NULL
          AND NOT n:User
        SET n.user_id = $user_id,
            n.migrated_at = datetime()
        RETURN count(n) AS updated
        """

        async with self.driver.session() as session:
            result = await session.run(
                update_query,
                tenant_id=tenant_id,
                user_id=user_id
            )
            record = await result.single()
            return record["updated"]

    async def _create_ownership_relationships(
        self, tenant_id: str, user_id: str
    ) -> int:
        """Create OWNS relationships from User to entities."""
        # Count entities that need ownership relationships
        count_query = """
        MATCH (u:User {id: $user_id})
        MATCH (n)
        WHERE n.tenant_id = $tenant_id
          AND NOT n:User
          AND NOT (u)-[:OWNS]->(n)
        RETURN count(n) AS count
        """

        async with self.driver.session() as session:
            result = await session.run(
                count_query,
                user_id=user_id,
                tenant_id=tenant_id
            )
            record = await result.single()
            count = record["count"]

        if count == 0:
            logger.info(f"  No ownership relationships to create")
            return 0

        logger.info(f"  Found {count} entities needing ownership relationships")

        if self.dry_run:
            logger.info(f"  [DRY RUN] Would create {count} OWNS relationships")
            return count

        # Create ownership relationships
        create_query = """
        MATCH (u:User {id: $user_id})
        MATCH (n)
        WHERE n.tenant_id = $tenant_id
          AND NOT n:User
          AND NOT (u)-[:OWNS]->(n)
        CREATE (u)-[:OWNS {
            created_at: datetime(),
            source: 'migration'
        }]->(n)
        RETURN count(*) AS created
        """

        async with self.driver.session() as session:
            result = await session.run(
                create_query,
                user_id=user_id,
                tenant_id=tenant_id
            )
            record = await result.single()
            return record["created"]

    async def _verify_migration(self) -> None:
        """Verify migration was successful."""
        logger.info("Verifying migration...")

        # Check for entities without user_id
        verify_query = """
        MATCH (n)
        WHERE n.tenant_id IS NOT NULL
          AND n.user_id IS NULL
          AND NOT n:User
        RETURN count(n) AS orphaned_count
        """

        async with self.driver.session() as session:
            result = await session.run(verify_query)
            record = await result.single()
            orphaned = record["orphaned_count"]

        if orphaned > 0:
            logger.warning(f"Found {orphaned} entities without user_id after migration")
            self.stats["errors"].append(f"{orphaned} orphaned entities remain")
        else:
            logger.info("All entities properly linked to User nodes")

    def print_summary(self) -> None:
        """Print migration summary."""
        print("\n" + "=" * 50)
        print("MIGRATION SUMMARY")
        print("=" * 50)
        print(f"Mode: {'DRY RUN' if self.dry_run else 'EXECUTED'}")
        print(f"Tenants found: {self.stats['tenants_found']}")
        print(f"Users created: {self.stats['users_created']}")
        print(f"Users existing: {self.stats['users_existing']}")
        print(f"Entities updated: {self.stats['entities_updated']}")
        print(f"Relationships created: {self.stats['relationships_created']}")

        if self.stats["errors"]:
            print(f"\nErrors ({len(self.stats['errors'])}):")
            for error in self.stats["errors"]:
                print(f"  - {error}")
        else:
            print("\nNo errors encountered.")

        print("=" * 50)


async def main():
    """Main entry point for migration script."""
    parser = argparse.ArgumentParser(
        description="Migrate tenant_id references to User entity nodes"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=True,
        help="Preview changes without executing (default: True)"
    )
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Execute the migration (disables dry-run)"
    )
    parser.add_argument(
        "--neo4j-uri",
        default=os.getenv("NEO4J_URI", "bolt://localhost:7687"),
        help="Neo4j connection URI"
    )
    parser.add_argument(
        "--neo4j-user",
        default=os.getenv("NEO4J_USER", "neo4j"),
        help="Neo4j username"
    )
    parser.add_argument(
        "--neo4j-password",
        default=os.getenv("NEO4J_PASSWORD"),
        help="Neo4j password"
    )

    args = parser.parse_args()

    if not args.neo4j_password:
        logger.error("NEO4J_PASSWORD environment variable or --neo4j-password required")
        sys.exit(1)

    dry_run = not args.execute

    if not dry_run:
        print("\n" + "!" * 50)
        print("WARNING: This will modify your database!")
        print("!" * 50)
        confirm = input("Type 'yes' to continue: ")
        if confirm.lower() != "yes":
            print("Migration cancelled.")
            sys.exit(0)

    driver = AsyncGraphDatabase.driver(
        args.neo4j_uri,
        auth=(args.neo4j_user, args.neo4j_password)
    )

    try:
        migration = TenantToUserMigration(driver, dry_run=dry_run)
        await migration.run()
        migration.print_summary()

        if dry_run:
            print("\nThis was a DRY RUN. No changes were made.")
            print("Run with --execute to apply changes.")

    finally:
        await driver.close()


if __name__ == "__main__":
    asyncio.run(main())
