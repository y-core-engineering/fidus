# Implementation Prompt: 1.2 - User Entity Foundation with Profile UI

**Package:** 1.2
**Epic:** Foundation & Architecture Compliance
**Priority:** 🔴 CRITICAL
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 301-355)

---

## Role

You are a **Senior Full-Stack Software Engineer** specializing in:

**Backend Expertise:**
- **Domain-Driven Design (DDD):** Bounded contexts, aggregates, entities, value objects, repositories
- **Event-Driven Architecture:** Event sourcing, CQRS, message queues, pub/sub patterns
- **Graph Databases (Neo4j):** Cypher queries, relationship modeling, graph algorithms, indexing strategies
- **Vector Databases (Qdrant):** Embedding search, similarity queries, payload filtering, collection management
- **Python Backend:** FastAPI, Pydantic, async/await, type hints, dependency injection
- **LLM Integration:** LiteLLM, prompt engineering, structured outputs, function calling
- **Orchestration:** LangGraph state machines, multi-step reasoning, error handling, rollback logic

**Frontend Expertise:**
- **Next.js 14:** App Router, Server Components, Client Components, Server Actions
- **React 18:** Hooks (useState, useEffect, useContext, custom hooks), performance optimization
- **TypeScript 5+:** Advanced types, generics, type inference, branded types
- **UI Libraries:** @fidus/ui design system components, Tailwind CSS
- **State Management:** React Context, Zustand, or Redux Toolkit (project-specific)
- **Data Fetching:** TanStack Query (React Query), SWR, fetch API
- **Testing:** Playwright (E2E), Vitest (unit), Testing Library (component)

**DevOps & Tools:**
- **Databases:** Neo4j 5.x, Qdrant 1.7+, PostgreSQL 15+, Redis 7+
- **Containerization:** Docker, Docker Compose
- **Testing:** pytest, pytest-asyncio, Playwright, locust (load testing)
- **Version Control:** Git, conventional commits
- **API Design:** REST, OpenAPI/Swagger, API versioning

**Architecture Patterns:**
- **Qdrant-First Pattern (ADR-0001):** Qdrant as PRIMARY, Neo4j as SECONDARY with references
- **Vertical Slicing:** Backend + API + Frontend + Tests in single deliverable
- **Feature Flags:** Gradual rollout, A/B testing, instant rollback
- **Multi-Tenancy:** tenant_id scoping, data isolation
- **GDPR Compliance:** Right to erasure, data portability

**Best Practices:**
- **Test-Driven Development (TDD):** Write tests first, then implementation
- **Clean Code:** SOLID principles, DRY, KISS, meaningful names
- **Documentation:** Inline comments for complex logic, docstrings, README updates
- **Error Handling:** Graceful degradation, user-friendly messages, logging
- **Security:** Input validation, SQL injection prevention, XSS protection, CSRF tokens
- **Performance:** Caching strategies, query optimization, lazy loading, pagination

---

## Context & Background

**Current State:**
- Package 1.1 (Qdrant-First Pattern) is complete
- Context storage now uses Qdrant as PRIMARY with Neo4j references
- System uses `tenant_id` for multi-tenancy but lacks proper User entity
- No centralized user profile management
- No UI for users to view/edit their information
- All entities need to relate to a User aggregate root

**Migration Goal:**
- Establish User as the aggregate root in the domain model
- Create full User entity with flexible `ai_properties` for AI-discovered attributes
- Provide UI for users to manage their profile information
- Implement GDPR-compliant cascade delete for user data
- Enable skills management with autocomplete
- Set foundation for all other entities (Person, Organization, Goal, etc.) to reference User

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/03-component-architecture.md`
- Domain Model: `/docs/domain-model/memory-domain-model.md`
- GDPR Compliance: `/docs/compliance/gdpr-requirements.md`

---

## Your Task

Implement **User Entity Foundation with Profile UI** according to the specifications below.

**User Story:**
As a user, I want to view and manage my profile information so that I can control my personal data, preferences, and skills in the memory system.

**Acceptance Criteria:**
1. Backend: User entity model in `packages/api/fidus/memory/entities/user.py` with flexible `ai_properties`
2. Backend: UserRepository with CRUD in `packages/api/fidus/memory/repositories/user_repository.py`
3. Backend: Neo4j constraints for User uniqueness
4. API: REST endpoints `GET/PUT/DELETE /api/memory/user/{user_id}`
5. API: GDPR cascade delete removes all user entities and relationships
6. Frontend: User profile component in `packages/web/src/components/memory/UserProfile.tsx` using @fidus/ui
7. Frontend: Skills editor with autocomplete
8. Tests: Full CRUD test coverage (unit + integration + E2E)
9. Documentation: Update `docs/solution-architecture/03-component-architecture.md`

---

## Technical Specification

### Backend Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/entities/user.py`** - User entity model

```python
"""
User entity: Aggregate root for the memory domain.

All other entities (Person, Organization, Goal, etc.) relate to User.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, validator


class User(BaseModel):
    """
    User entity with flexible AI-discovered properties.

    This is the aggregate root for all memory entities. Every entity
    in the memory system belongs to a specific user.
    """

    id: str = Field(..., description="Unique user identifier (UUID)")
    tenant_id: str = Field(..., description="Tenant identifier for multi-tenancy")
    email: EmailStr = Field(..., description="User email address (unique)")
    name: str = Field(..., description="User's full name")
    preferred_language: str = Field(default="en", description="ISO 639-1 language code")
    timezone: str = Field(default="UTC", description="IANA timezone (e.g., 'Europe/Berlin')")
    skills: List[str] = Field(default_factory=list, description="User skills/expertise")
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="Flexible properties discovered by AI (interests, traits, goals, etc.)"
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @validator("skills")
    def validate_skills(cls, v):
        """Ensure skills are non-empty strings."""
        return [skill.strip() for skill in v if skill.strip()]

    @validator("preferred_language")
    def validate_language(cls, v):
        """Ensure language is valid ISO 639-1 code."""
        valid_languages = ["en", "de", "fr", "es", "it", "pt", "nl", "pl", "ja", "zh", "ko"]
        if v not in valid_languages:
            raise ValueError(f"Language must be one of {valid_languages}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "id": "user-123",
                "tenant_id": "tenant-456",
                "email": "max@example.com",
                "name": "Max Mustermann",
                "preferred_language": "de",
                "timezone": "Europe/Berlin",
                "skills": ["Python", "TypeScript", "Machine Learning"],
                "ai_properties": {
                    "interests": ["AI", "Music", "Travel"],
                    "personality_traits": ["curious", "analytical"],
                    "communication_style": "direct"
                }
            }
        }


class UserCreate(BaseModel):
    """Request model for creating a user."""

    tenant_id: str
    email: EmailStr
    name: str
    preferred_language: str = "en"
    timezone: str = "UTC"
    skills: List[str] = Field(default_factory=list)
    ai_properties: Dict[str, Any] = Field(default_factory=dict)


class UserUpdate(BaseModel):
    """Request model for updating a user."""

    name: Optional[str] = None
    preferred_language: Optional[str] = None
    timezone: Optional[str] = None
    skills: Optional[List[str]] = None
    ai_properties: Optional[Dict[str, Any]] = None


class UserResponse(BaseModel):
    """Response model for user API."""

    id: str
    tenant_id: str
    email: str
    name: str
    preferred_language: str
    timezone: str
    skills: List[str]
    ai_properties: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
```

---

2. **`packages/api/fidus/memory/repositories/user_repository.py`** - User repository with CRUD

```python
"""
User repository: Database operations for User entity.
"""

from typing import Optional, List, Dict, Any
from uuid import uuid4
from datetime import datetime
import logging

from neo4j import AsyncDriver, AsyncSession
from fidus.memory.entities.user import User, UserCreate, UserUpdate

logger = logging.getLogger(__name__)


class UserRepository:
    """Repository for User entity operations."""

    def __init__(self, neo4j_driver: AsyncDriver):
        self.driver = neo4j_driver

    async def create(self, user_data: UserCreate) -> User:
        """
        Create a new user in Neo4j.

        Args:
            user_data: User creation data

        Returns:
            Created User entity

        Raises:
            ValueError: If user with email already exists
        """
        user_id = str(uuid4())
        now = datetime.utcnow()

        query = """
        MERGE (u:User {email: $email, tenant_id: $tenant_id})
        ON CREATE SET
            u.id = $user_id,
            u.name = $name,
            u.preferred_language = $preferred_language,
            u.timezone = $timezone,
            u.skills = $skills,
            u.ai_properties = $ai_properties,
            u.created_at = datetime($created_at),
            u.updated_at = datetime($updated_at)
        ON MATCH SET
            u = NULL
        RETURN u, u IS NULL as already_exists
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=user_data.tenant_id,
                email=user_data.email,
                name=user_data.name,
                preferred_language=user_data.preferred_language,
                timezone=user_data.timezone,
                skills=user_data.skills,
                ai_properties=user_data.ai_properties,
                created_at=now.isoformat(),
                updated_at=now.isoformat()
            )
            record = await result.single()

            if record["already_exists"]:
                raise ValueError(f"User with email {user_data.email} already exists")

            return self._record_to_user(record["u"])

    async def get(self, user_id: str, tenant_id: str) -> Optional[User]:
        """
        Retrieve user by ID.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier (for multi-tenancy isolation)

        Returns:
            User entity or None if not found
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})
        RETURN u
        """

        async with self.driver.session() as session:
            result = await session.run(query, user_id=user_id, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            return self._record_to_user(record["u"])

    async def update(self, user_id: str, tenant_id: str, updates: UserUpdate) -> Optional[User]:
        """
        Update user properties.

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier
            updates: Fields to update

        Returns:
            Updated User entity or None if not found
        """
        # Build dynamic SET clause
        set_clauses = ["u.updated_at = datetime($updated_at)"]
        params = {
            "user_id": user_id,
            "tenant_id": tenant_id,
            "updated_at": datetime.utcnow().isoformat()
        }

        if updates.name is not None:
            set_clauses.append("u.name = $name")
            params["name"] = updates.name

        if updates.preferred_language is not None:
            set_clauses.append("u.preferred_language = $preferred_language")
            params["preferred_language"] = updates.preferred_language

        if updates.timezone is not None:
            set_clauses.append("u.timezone = $timezone")
            params["timezone"] = updates.timezone

        if updates.skills is not None:
            set_clauses.append("u.skills = $skills")
            params["skills"] = updates.skills

        if updates.ai_properties is not None:
            # Merge ai_properties (don't overwrite, add new keys)
            set_clauses.append("u.ai_properties = coalesce(u.ai_properties, {}) + $ai_properties")
            params["ai_properties"] = updates.ai_properties

        query = f"""
        MATCH (u:User {{id: $user_id, tenant_id: $tenant_id}})
        SET {', '.join(set_clauses)}
        RETURN u
        """

        async with self.driver.session() as session:
            result = await session.run(query, **params)
            record = await result.single()

            if not record:
                return None

            return self._record_to_user(record["u"])

    async def delete(self, user_id: str, tenant_id: str) -> bool:
        """
        Delete user and cascade delete all related entities (GDPR compliance).

        This implements the "Right to Erasure" by deleting:
        1. All relationships originating from User
        2. All entities connected to User
        3. The User node itself

        Args:
            user_id: User identifier
            tenant_id: Tenant identifier

        Returns:
            True if deleted, False if not found
        """
        query = """
        MATCH (u:User {id: $user_id, tenant_id: $tenant_id})

        // Delete all outgoing relationships and connected entities
        OPTIONAL MATCH (u)-[r]->(e)
        DETACH DELETE e

        // Delete all incoming relationships
        OPTIONAL MATCH (other)-[r2]->(u)
        DELETE r2

        // Delete the user node
        DETACH DELETE u

        RETURN count(u) as deleted_count
        """

        async with self.driver.session() as session:
            result = await session.run(query, user_id=user_id, tenant_id=tenant_id)
            record = await result.single()
            deleted_count = record["deleted_count"]

            logger.info(f"Deleted user {user_id} and all related data (GDPR cascade delete)")
            return deleted_count > 0

    async def list_by_tenant(self, tenant_id: str, limit: int = 100) -> List[User]:
        """
        List all users for a tenant.

        Args:
            tenant_id: Tenant identifier
            limit: Maximum number of users to return

        Returns:
            List of User entities
        """
        query = """
        MATCH (u:User {tenant_id: $tenant_id})
        RETURN u
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(query, tenant_id=tenant_id, limit=limit)
            records = [record async for record in result]
            return [self._record_to_user(record["u"]) for record in records]

    def _record_to_user(self, record) -> User:
        """Convert Neo4j record to User entity."""
        return User(
            id=record["id"],
            tenant_id=record["tenant_id"],
            email=record["email"],
            name=record["name"],
            preferred_language=record.get("preferred_language", "en"),
            timezone=record.get("timezone", "UTC"),
            skills=record.get("skills", []),
            ai_properties=record.get("ai_properties", {}),
            created_at=record["created_at"],
            updated_at=record["updated_at"]
        )


async def ensure_user_constraints(neo4j_driver: AsyncDriver):
    """
    Create Neo4j constraints and indexes for User entity.

    This should be run on application startup or via migration script.
    """
    constraints = [
        "CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE",
        "CREATE CONSTRAINT user_email_tenant_unique IF NOT EXISTS FOR (u:User) REQUIRE (u.email, u.tenant_id) IS UNIQUE",
        "CREATE INDEX user_tenant_idx IF NOT EXISTS FOR (u:User) ON (u.tenant_id)",
        "CREATE INDEX user_email_idx IF NOT EXISTS FOR (u:User) ON (u.email)"
    ]

    async with neo4j_driver.session() as session:
        for constraint in constraints:
            try:
                await session.run(constraint)
                logger.info(f"Created constraint/index: {constraint}")
            except Exception as e:
                logger.warning(f"Constraint/index may already exist: {e}")
```

---

### API Implementation

**Files to Create:**

1. **`packages/api/fidus/memory/routes/user_routes.py`** - FastAPI router for User endpoints

```python
"""
User API routes.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from fidus.memory.entities.user import UserCreate, UserUpdate, UserResponse
from fidus.memory.repositories.user_repository import UserRepository
from fidus.dependencies import get_user_repository, get_current_user

router = APIRouter(prefix="/api/memory/user", tags=["user"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    repo: UserRepository = Depends(get_user_repository)
) -> UserResponse:
    """
    Create a new user.

    Requires tenant_id and email. Email must be unique within tenant.
    """
    try:
        user = await repo.create(user_data)
        return UserResponse(**user.dict())
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    tenant_id: str,
    repo: UserRepository = Depends(get_user_repository)
) -> UserResponse:
    """
    Get user by ID.

    Requires tenant_id for multi-tenancy isolation.
    """
    user = await repo.get(user_id, tenant_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(**user.dict())


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    tenant_id: str,
    updates: UserUpdate,
    repo: UserRepository = Depends(get_user_repository)
) -> UserResponse:
    """
    Update user properties.

    Supports partial updates. Only provided fields will be updated.
    ai_properties are merged (not overwritten).
    """
    user = await repo.update(user_id, tenant_id, updates)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(**user.dict())


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    tenant_id: str,
    confirm: bool,
    repo: UserRepository = Depends(get_user_repository)
):
    """
    Delete user and all related data (GDPR cascade delete).

    WARNING: This is irreversible. All entities and relationships
    connected to this user will be permanently deleted.

    Requires confirm=true query parameter to prevent accidental deletion.
    """
    if not confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must set confirm=true to delete user"
        )

    deleted = await repo.delete(user_id, tenant_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.get("/", response_model=List[UserResponse])
async def list_users(
    tenant_id: str,
    limit: int = 100,
    repo: UserRepository = Depends(get_user_repository)
) -> List[UserResponse]:
    """
    List all users for a tenant.

    Supports pagination via limit parameter.
    """
    users = await repo.list_by_tenant(tenant_id, limit)
    return [UserResponse(**user.dict()) for user in users]
```

---

### Frontend Implementation

**Files to Create:**

1. **`packages/web/src/components/memory/UserProfile.tsx`** - Main profile component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@fidus/ui/Card';
import { Button } from '@fidus/ui/Button';
import { TextField } from '@fidus/ui/TextField';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@fidus/ui/Select';
import { Alert, AlertDescription } from '@fidus/ui/Alert';
import { ConfirmDialog } from '@fidus/ui/ConfirmDialog';
import { SkillsEditor } from './SkillsEditor';
import { getUser, updateUser, deleteUser, type User } from '@/lib/api/memory';

interface UserProfileProps {
  userId: string;
  tenantId: string;
}

export function UserProfile({ userId, tenantId }: UserProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchUser();
  }, [userId, tenantId]);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await getUser(userId, tenantId);
      setUser(userData);
      setName(userData.name);
      setPreferredLanguage(userData.preferred_language);
      setTimezone(userData.timezone);
      setSkills(userData.skills);
    } catch (err) {
      setError('Failed to load user profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await updateUser(userId, tenantId, {
        name,
        preferred_language: preferredLanguage,
        timezone,
        skills,
      });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteUser(userId, tenantId);
      router.push('/'); // Redirect after deletion
    } catch (err) {
      setError('Failed to delete account');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setPreferredLanguage(user.preferred_language);
      setTimezone(user.timezone);
      setSkills(user.skills);
    }
    setIsEditing(false);
  };

  if (isLoading && !user) {
    return <div>Loading...</div>;
  }

  if (error && !user) {
    return (
      <Alert variant="error">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {error && (
        <Alert variant="error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <TextField value={user?.email || ''} disabled />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              placeholder="Your full name"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Language</label>
            <Select value={preferredLanguage} onValueChange={setPreferredLanguage} disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <Select value={timezone} onValueChange={setTimezone} disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                <SelectItem value="America/New_York">America/New_York</SelectItem>
                <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <SkillsEditor
              skills={skills}
              onChange={setSkills}
              disabled={!isEditing}
            />
          </div>

          {/* AI Properties (read-only for now) */}
          {user?.ai_properties && Object.keys(user.ai_properties).length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">AI-Discovered Properties</label>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(user.ai_properties, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isLoading}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Delete Account
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Account"
        description="Are you sure you want to delete your account? This will permanently delete all your data, including entities and relationships. This action cannot be undone."
        confirmText="Delete Account"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
```

---

2. **`packages/web/src/components/memory/SkillsEditor.tsx`** - Skills autocomplete component

```typescript
'use client';

import { useState } from 'react';
import { Autocomplete } from '@fidus/ui/Autocomplete';
import { Badge } from '@fidus/ui/Badge';
import { X } from 'lucide-react';

interface SkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
}

const COMMON_SKILLS = [
  'Python',
  'TypeScript',
  'JavaScript',
  'React',
  'Node.js',
  'FastAPI',
  'Django',
  'Machine Learning',
  'Data Science',
  'DevOps',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Neo4j',
  'PostgreSQL',
  'GraphQL',
  'REST API',
  'Git',
  'Agile',
  'Project Management',
];

export function SkillsEditor({ skills, onChange, disabled = false }: SkillsEditorProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onChange([...skills, trimmedSkill]);
    }
    setInputValue('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const filteredSuggestions = COMMON_SKILLS.filter(
    (skill) =>
      !skills.includes(skill) &&
      skill.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* Skill Tags */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
            {skill}
            {!disabled && (
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {/* Autocomplete Input */}
      {!disabled && (
        <Autocomplete
          value={inputValue}
          onChange={setInputValue}
          onSelect={handleAddSkill}
          suggestions={filteredSuggestions}
          placeholder="Add a skill..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              e.preventDefault();
              handleAddSkill(inputValue);
            }
          }}
        />
      )}
    </div>
  );
}
```

---

3. **`packages/web/src/lib/api/memory.ts`** - API client methods

```typescript
export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  preferred_language: string;
  timezone: string;
  skills: string[];
  ai_properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  name?: string;
  preferred_language?: string;
  timezone?: string;
  skills?: string[];
  ai_properties?: Record<string, any>;
}

export async function getUser(userId: string, tenantId: string): Promise<User> {
  const response = await fetch(`/api/memory/user/${userId}?tenant_id=${tenantId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function updateUser(
  userId: string,
  tenantId: string,
  updates: UserUpdate
): Promise<User> {
  const response = await fetch(`/api/memory/user/${userId}?tenant_id=${tenantId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
}

export async function deleteUser(userId: string, tenantId: string): Promise<void> {
  const response = await fetch(
    `/api/memory/user/${userId}?tenant_id=${tenantId}&confirm=true`,
    {
      method: 'DELETE',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}
```

---

### Testing Requirements

**Unit Tests:**

**File:** `packages/api/tests/unit/memory/test_user_repository.py`

```python
import pytest
from unittest.mock import AsyncMock, MagicMock
from fidus.memory.repositories.user_repository import UserRepository
from fidus.memory.entities.user import UserCreate, UserUpdate


@pytest.fixture
def mock_neo4j_driver():
    return AsyncMock()


@pytest.fixture
def user_repo(mock_neo4j_driver):
    return UserRepository(mock_neo4j_driver)


@pytest.mark.asyncio
async def test_create_user_success(user_repo, mock_neo4j_driver):
    """Test successful user creation."""
    user_data = UserCreate(
        tenant_id="tenant-1",
        email="test@example.com",
        name="Test User",
        skills=["Python", "TypeScript"]
    )

    # Mock Neo4j response
    mock_session = mock_neo4j_driver.session.return_value.__aenter__.return_value
    mock_result = AsyncMock()
    mock_record = {
        "u": {
            "id": "user-123",
            "tenant_id": "tenant-1",
            "email": "test@example.com",
            "name": "Test User",
            "preferred_language": "en",
            "timezone": "UTC",
            "skills": ["Python", "TypeScript"],
            "ai_properties": {},
            "created_at": "2023-01-01T00:00:00",
            "updated_at": "2023-01-01T00:00:00"
        },
        "already_exists": False
    }
    mock_result.single.return_value = mock_record
    mock_session.run.return_value = mock_result

    user = await user_repo.create(user_data)

    assert user.id == "user-123"
    assert user.email == "test@example.com"
    assert user.skills == ["Python", "TypeScript"]


@pytest.mark.asyncio
async def test_create_user_duplicate_email(user_repo, mock_neo4j_driver):
    """Test user creation with duplicate email raises ValueError."""
    user_data = UserCreate(
        tenant_id="tenant-1",
        email="duplicate@example.com",
        name="Test User"
    )

    # Mock duplicate email scenario
    mock_session = mock_neo4j_driver.session.return_value.__aenter__.return_value
    mock_result = AsyncMock()
    mock_result.single.return_value = {"u": None, "already_exists": True}
    mock_session.run.return_value = mock_result

    with pytest.raises(ValueError, match="already exists"):
        await user_repo.create(user_data)


@pytest.mark.asyncio
async def test_update_user_merge_ai_properties(user_repo, mock_neo4j_driver):
    """Test that update merges ai_properties instead of overwriting."""
    updates = UserUpdate(
        ai_properties={"new_key": "new_value"}
    )

    # Mock existing user with ai_properties
    mock_session = mock_neo4j_driver.session.return_value.__aenter__.return_value
    mock_result = AsyncMock()
    mock_record = {
        "u": {
            "id": "user-123",
            "tenant_id": "tenant-1",
            "email": "test@example.com",
            "name": "Test User",
            "preferred_language": "en",
            "timezone": "UTC",
            "skills": [],
            "ai_properties": {"old_key": "old_value", "new_key": "new_value"},
            "created_at": "2023-01-01T00:00:00",
            "updated_at": "2023-01-01T00:00:00"
        }
    }
    mock_result.single.return_value = mock_record
    mock_session.run.return_value = mock_result

    user = await user_repo.update("user-123", "tenant-1", updates)

    assert "old_key" in user.ai_properties
    assert "new_key" in user.ai_properties


@pytest.mark.asyncio
async def test_delete_user_cascade(user_repo, mock_neo4j_driver):
    """Test GDPR cascade delete removes user and all related data."""
    mock_session = mock_neo4j_driver.session.return_value.__aenter__.return_value
    mock_result = AsyncMock()
    mock_result.single.return_value = {"deleted_count": 1}
    mock_session.run.return_value = mock_result

    deleted = await user_repo.delete("user-123", "tenant-1")

    assert deleted is True
    # Verify cascade delete query was called
    mock_session.run.assert_called_once()
```

---

**Integration Tests:**

**File:** `packages/api/tests/integration/memory/test_user_api.py`

```python
import pytest
from httpx import AsyncClient
from neo4j import AsyncGraphDatabase


@pytest.fixture
async def neo4j_driver():
    driver = AsyncGraphDatabase.driver(
        "bolt://localhost:7687",
        auth=("neo4j", "test-password")
    )
    yield driver
    await driver.close()


@pytest.mark.asyncio
async def test_user_crud_workflow(client: AsyncClient, neo4j_driver):
    """Test complete user CRUD workflow via API."""
    tenant_id = "test-tenant"

    # Step 1: Create user
    create_response = await client.post("/api/memory/user/", json={
        "tenant_id": tenant_id,
        "email": "integration-test@example.com",
        "name": "Integration Test User",
        "skills": ["Python", "Testing"]
    })
    assert create_response.status_code == 201
    user_data = create_response.json()
    user_id = user_data["id"]

    # Step 2: Get user
    get_response = await client.get(f"/api/memory/user/{user_id}?tenant_id={tenant_id}")
    assert get_response.status_code == 200
    retrieved_user = get_response.json()
    assert retrieved_user["email"] == "integration-test@example.com"
    assert retrieved_user["skills"] == ["Python", "Testing"]

    # Step 3: Update user
    update_response = await client.put(
        f"/api/memory/user/{user_id}?tenant_id={tenant_id}",
        json={
            "name": "Updated Name",
            "skills": ["Python", "Testing", "FastAPI"]
        }
    )
    assert update_response.status_code == 200
    updated_user = update_response.json()
    assert updated_user["name"] == "Updated Name"
    assert len(updated_user["skills"]) == 3

    # Step 4: Delete user (GDPR cascade)
    delete_response = await client.delete(
        f"/api/memory/user/{user_id}?tenant_id={tenant_id}&confirm=true"
    )
    assert delete_response.status_code == 204

    # Step 5: Verify deletion
    get_after_delete = await client.get(f"/api/memory/user/{user_id}?tenant_id={tenant_id}")
    assert get_after_delete.status_code == 404


@pytest.mark.asyncio
async def test_multi_tenancy_isolation(client: AsyncClient):
    """Test that users from different tenants cannot access each other's data."""
    # Create user in tenant A
    tenant_a = "tenant-a"
    response_a = await client.post("/api/memory/user/", json={
        "tenant_id": tenant_a,
        "email": "user-a@example.com",
        "name": "User A"
    })
    user_a_id = response_a.json()["id"]

    # Try to access user A from tenant B
    tenant_b = "tenant-b"
    response_b = await client.get(f"/api/memory/user/{user_a_id}?tenant_id={tenant_b}")
    assert response_b.status_code == 404  # Should not be found
```

---

**E2E Test:**

**File:** `packages/web/tests/e2e/memory/user-profile.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('User can view and edit profile', async ({ page }) => {
  // Step 1: Navigate to profile page
  await page.goto('/profile');

  // Step 2: Verify initial profile data is displayed
  await expect(page.getByLabel('Email')).toBeDisabled();
  await expect(page.getByLabel('Name')).toHaveValue('Max Mustermann');

  // Step 3: Click "Edit Profile" button
  await page.getByRole('button', { name: /edit profile/i }).click();

  // Step 4: Verify form fields are now editable
  await expect(page.getByLabel('Name')).toBeEnabled();

  // Step 5: Update name
  await page.getByLabel('Name').fill('Maximilian Mustermann');

  // Step 6: Add a new skill
  const skillInput = page.getByPlaceholder('Add a skill...');
  await skillInput.fill('TypeScript');
  await skillInput.press('Enter');

  // Step 7: Verify skill was added
  await expect(page.getByText('TypeScript')).toBeVisible();

  // Step 8: Save changes
  await page.getByRole('button', { name: /save changes/i }).click();

  // Step 9: Verify edit mode is exited
  await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible();

  // Step 10: Refresh page and verify persistence
  await page.reload();
  await expect(page.getByLabel('Name')).toHaveValue('Maximilian Mustermann');
  await expect(page.getByText('TypeScript')).toBeVisible();
});

test('User can delete account with confirmation', async ({ page }) => {
  await page.goto('/profile');

  // Step 1: Click "Delete Account" button
  await page.getByRole('button', { name: /delete account/i }).click();

  // Step 2: Verify confirmation dialog appears
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/this action cannot be undone/i)).toBeVisible();

  // Step 3: Cancel deletion
  await page.getByRole('button', { name: /cancel/i }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();

  // Step 4: Try deletion again and confirm
  await page.getByRole('button', { name: /delete account/i }).click();
  await page.getByRole('button', { name: /delete account/i, exact: true }).click();

  // Step 5: Verify redirect after deletion
  await expect(page).toHaveURL('/');
});
```

---

## Implementation Guidelines

### Must Follow

1. **User as Aggregate Root:**
   - All other entities (Person, Organization, Goal, etc.) MUST reference User
   - User ID required for all entity operations
   - User is the entry point for domain operations

2. **GDPR Compliance:**
   - DELETE operation MUST cascade to all related entities
   - Provide clear warning before deletion
   - Require explicit confirmation (confirm=true parameter)
   - Log all deletion operations for audit

3. **Multi-Tenancy:**
   - ALL queries filter by tenant_id
   - User email unique per tenant (not globally)
   - Verify tenant isolation in tests

4. **Flexible Properties:**
   - ai_properties field allows any JSON structure
   - Updates MERGE properties (don't overwrite)
   - Validate common fields (email, language, timezone)

5. **Code Quality:**
   - Type hints on all Python functions
   - TypeScript strict mode (no `any` types)
   - Docstrings for public methods
   - Pass linting (Ruff, ESLint)

### Must NOT Do

- ❌ Allow cross-tenant data access
- ❌ Delete user without confirmation
- ❌ Overwrite ai_properties on update (must merge)
- ❌ Skip Neo4j constraints creation
- ❌ Hardcode user data in tests

---

## Dependencies & Prerequisites

**Required Before Starting:**
- [x] Package 1.1 (Qdrant-First Pattern) completed
- [ ] Neo4j 5.x running
- [ ] Next.js 14 application set up
- [ ] @fidus/ui design system available

**Technical Dependencies:**
- `neo4j>=5.0.0`
- `pydantic>=2.0.0`
- `fastapi>=0.100.0`
- `@fidus/ui` (design system)
- `next>=14.0.0`

---

## Step-by-Step Implementation Plan

### Phase 1: Backend Core
1. Create User entity model with Pydantic
2. Create UserRepository with CRUD methods
3. Implement GDPR cascade delete logic
4. Add Neo4j constraints and indexes
5. Write unit tests for repository

### Phase 2: API Layer
1. Create FastAPI router for User
2. Implement POST /api/memory/user (create)
3. Implement GET /api/memory/user/{user_id} (read)
4. Implement PUT /api/memory/user/{user_id} (update)
5. Implement DELETE /api/memory/user/{user_id} (delete with confirmation)
6. Write integration tests for API

### Phase 3: Frontend Components
1. Create UserProfile.tsx main component
2. Create SkillsEditor.tsx with autocomplete
3. Implement form state management
4. Connect to API with data fetching
5. Add confirmation dialog for deletion
6. Style with @fidus/ui components

### Phase 4: API Client
1. Create memory.ts API client
2. Implement getUser(), updateUser(), deleteUser()
3. Add error handling and loading states
4. Test API client integration

### Phase 5: Integration & Testing
1. Write E2E test for profile editing workflow
2. Write E2E test for account deletion
3. Test multi-tenancy isolation
4. Test GDPR cascade delete

### Phase 6: Migration & Deployment
1. Create migration script: tenant_id → User nodes
2. Update component architecture documentation
3. Deploy to dev environment
4. Run migration on dev data
5. Manual smoke testing

---

## Verification Checklist

### Functionality
- [ ] User can be created with email, name, skills
- [ ] User can be retrieved by ID
- [ ] User can be updated (partial updates work)
- [ ] User can be deleted (GDPR cascade)
- [ ] Profile UI displays user information
- [ ] Skills editor allows add/remove
- [ ] Confirmation required for deletion
- [ ] ai_properties are merged on update

### Code Quality
- [ ] All files created as specified
- [ ] Type hints on all Python functions
- [ ] TypeScript strict mode enabled
- [ ] No linting errors (Ruff, ESLint)
- [ ] Docstrings for public methods

### Testing
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass (CRUD workflow)
- [ ] E2E test passes (profile editing)
- [ ] E2E test passes (account deletion)
- [ ] Multi-tenancy isolation verified

### Documentation
- [ ] Component architecture updated
- [ ] API endpoints documented
- [ ] Migration script documented
- [ ] Code comments for complex logic

### Security & Performance
- [ ] Multi-tenancy verified (no cross-tenant leaks)
- [ ] Input validation on all endpoints
- [ ] Email uniqueness constraint enforced
- [ ] Cascade delete performance tested
- [ ] Neo4j indexes created

### Deployment Readiness
- [ ] Neo4j constraints created
- [ ] Migration script tested on dev
- [ ] Feature flag added (if needed)
- [ ] Environment variables documented

---

## Risk Mitigation

**Risks from WBS:**

**Risk:** Migrating tenant_id to User nodes may miss code paths that directly use tenant_id
**Mitigation:**
- Comprehensive grep for `tenant_id` usage
- Add deprecation warnings for direct tenant_id usage
- Keep both paths during transition period
- Feature flag `USE_USER_ENTITY=false` allows fallback

**Risk:** GDPR cascade delete might be slow for users with large graphs
**Mitigation:**
- Implement async deletion with progress tracking
- Add database indexes on user_id relationships
- Test with large datasets (1000+ entities per user)
- Consider batch deletion for performance

**Additional Risks:**

**Risk:** Skills autocomplete suggestions may not cover user's domain
**Mitigation:**
- Allow custom skill entry (not just suggestions)
- Track popular skills from user input
- Periodically update COMMON_SKILLS list

**Risk:** ai_properties merge logic may cause conflicts
**Mitigation:**
- Document merge behavior clearly
- Provide API to overwrite specific keys if needed
- Log all property changes for debugging

---

## Related Resources

**WBS Package Details:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md#package-12`
**Architecture Review:** `/docs/reviews/2025-11-21-fidus-memory-architecture-review.md`
**Solution Architecture:** `/docs/solution-architecture/03-component-architecture.md`
**Domain Model:** `/docs/domain-model/memory-domain-model.md`
**Existing Codebase:**
- `packages/api/fidus/memory/` (current memory implementation)
- `packages/web/src/` (Next.js application)
- `packages/ui/` (@fidus/ui design system)

---

## Questions to Resolve Before Starting

1. **Authentication:** How is the current user authenticated? Do we need to implement authentication or integrate with existing system?
2. **Tenant Assignment:** How is tenant_id assigned to new users? Is it from authentication context or explicitly provided?
3. **Profile Photo:** Should we support profile photo upload? If yes, where to store (S3, local filesystem)?
4. **Email Verification:** Should we implement email verification flow or assume emails are pre-verified?
5. **User Roles:** Are there different user roles (admin, user, etc.) that affect permissions?

---

## Success Criteria

This package is **successfully implemented** when:

1. ✅ A user can view their profile via UI at /profile
2. ✅ A user can edit their name, language, timezone, skills
3. ✅ Skills editor autocomplete suggests common skills
4. ✅ User can add custom skills not in suggestion list
5. ✅ Profile changes persist after save and page refresh
6. ✅ User can delete their account with confirmation dialog
7. ✅ GDPR cascade delete removes all user data from Neo4j
8. ✅ Multi-tenancy isolation prevents cross-tenant data access
9. ✅ All tests pass (unit, integration, E2E)
10. ✅ Documentation updated with User entity specification

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 1.2

---

**END OF IMPLEMENTATION PROMPT**
