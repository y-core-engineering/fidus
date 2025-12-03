/**
 * Memory API client for user and entity management.
 *
 * Provides typed functions for interacting with the User and Person API endpoints.
 *
 * NOTE (ADR-0003): Skills are stored as role-scoped attributes on relationship
 * contexts in Qdrant, not on the User entity.
 */

import { getUserId } from '@/app/lib/userSession';

// ==================== User Types ====================

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  preferred_language: string;
  timezone: string;
  ai_properties: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  tenant_id: string;
  email: string;
  name: string;
  preferred_language?: string;
  timezone?: string;
  ai_properties?: Record<string, unknown>;
}

export interface UserUpdate {
  name?: string;
  preferred_language?: string;
  timezone?: string;
  ai_properties?: Record<string, unknown>;
}

/**
 * Fetch a user by ID.
 *
 * @param userId - The user's unique identifier
 * @param tenantId - The tenant identifier for multi-tenancy isolation
 * @returns The user object
 * @throws Error if the request fails
 */
export async function getUser(userId: string, tenantId: string): Promise<User> {
  const response = await fetch(`/api/memory/user/${userId}?tenant_id=${tenantId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

/**
 * Fetch a user by email.
 *
 * @param email - The user's email address
 * @param tenantId - The tenant identifier for multi-tenancy isolation
 * @returns The user object
 * @throws Error if the request fails
 */
export async function getUserByEmail(email: string, tenantId: string): Promise<User> {
  const response = await fetch(
    `/api/memory/user/by-email/${encodeURIComponent(email)}?tenant_id=${tenantId}`
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

/**
 * Create a new user.
 *
 * @param userData - The user creation data
 * @returns The created user object
 * @throws Error if the request fails (e.g., duplicate email)
 */
export async function createUser(userData: UserCreate): Promise<User> {
  const response = await fetch('/api/memory/user/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create user');
  }
  return response.json();
}

/**
 * Update a user's properties.
 *
 * Supports partial updates. Only provided fields will be updated.
 * ai_properties are merged (not overwritten).
 *
 * @param userId - The user's unique identifier
 * @param tenantId - The tenant identifier for multi-tenancy isolation
 * @param updates - The fields to update
 * @returns The updated user object
 * @throws Error if the request fails
 */
export async function updateUser(
  userId: string,
  tenantId: string,
  updates: UserUpdate
): Promise<User> {
  const response = await fetch(`/api/memory/user/${userId}?tenant_id=${tenantId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to update user');
  }
  return response.json();
}

/**
 * Delete a user and all related data (GDPR cascade delete).
 *
 * WARNING: This is irreversible. All entities and relationships
 * connected to this user will be permanently deleted.
 *
 * @param userId - The user's unique identifier
 * @param tenantId - The tenant identifier for multi-tenancy isolation
 * @throws Error if the request fails
 */
export async function deleteUser(userId: string, tenantId: string): Promise<void> {
  const response = await fetch(
    `/api/memory/user/${userId}?tenant_id=${tenantId}&confirm=true`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to delete user');
  }
}

/**
 * List all users for a tenant.
 *
 * @param tenantId - The tenant identifier
 * @param limit - Maximum number of users to return (default: 100)
 * @returns Array of user objects
 * @throws Error if the request fails
 */
export async function listUsers(tenantId: string, limit: number = 100): Promise<User[]> {
  const response = await fetch(`/api/memory/user/?tenant_id=${tenantId}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

// ==================== Person Types ====================

export interface Person {
  id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  ai_properties: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  confidence: number;
  source: string;
  // Convenience properties extracted from ai_properties
  profession: string | null;
  topics: string[];
  communication_style: string | null;
}

export interface PersonCreate {
  name: string;
  ai_properties?: Record<string, unknown>;
  confidence?: number;
  source?: string;
}

export interface PersonUpdate {
  name?: string;
  ai_properties?: Record<string, unknown>;
}

export interface PersonFeatureStatus {
  feature: string;
  enabled: boolean;
  description: string;
  hint: string;
}

// ==================== Person API Functions ====================

/**
 * Helper function to get auth headers with X-User-ID.
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const userId = getUserId();
  if (userId) {
    headers['X-User-ID'] = userId;
  }
  return headers;
}

/**
 * Check if the Person entity feature is enabled.
 *
 * @returns Feature status object
 * @throws Error if the request fails
 */
export async function getPersonFeatureStatus(): Promise<PersonFeatureStatus> {
  const response = await fetch('/api/memory/entities/person/feature-status');
  if (!response.ok) {
    throw new Error('Failed to check person feature status');
  }
  return response.json();
}

/**
 * Fetch a person by ID.
 *
 * @param personId - The person's unique identifier
 * @returns The person object
 * @throws Error if the request fails or feature is disabled
 */
export async function getPerson(personId: string): Promise<Person> {
  const response = await fetch(`/api/memory/entities/person/${personId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Person not found');
    }
    if (response.status === 501) {
      throw new Error('Person feature is disabled');
    }
    throw new Error('Failed to fetch person');
  }
  return response.json();
}

/**
 * Create a new person.
 *
 * @param personData - The person creation data
 * @returns The created person object
 * @throws Error if the request fails or feature is disabled
 */
export async function createPerson(personData: PersonCreate): Promise<Person> {
  const response = await fetch('/api/memory/entities/person', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(personData),
  });
  if (!response.ok) {
    if (response.status === 501) {
      throw new Error('Person feature is disabled');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create person');
  }
  return response.json();
}

/**
 * Update a person's properties.
 *
 * Properties are MERGED, not overwritten:
 * - New keys are added
 * - List values are unioned
 * - Existing scalar values are preserved
 *
 * @param personId - The person's unique identifier
 * @param updates - The fields to update
 * @returns The updated person object
 * @throws Error if the request fails or feature is disabled
 */
export async function updatePerson(
  personId: string,
  updates: PersonUpdate
): Promise<Person> {
  const response = await fetch(`/api/memory/entities/person/${personId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Person not found');
    }
    if (response.status === 501) {
      throw new Error('Person feature is disabled');
    }
    throw new Error('Failed to update person');
  }
  return response.json();
}

/**
 * Delete a person.
 *
 * @param personId - The person's unique identifier
 * @throws Error if the request fails or feature is disabled
 */
export async function deletePerson(personId: string): Promise<void> {
  const response = await fetch(`/api/memory/entities/person/${personId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Person not found');
    }
    if (response.status === 501) {
      throw new Error('Person feature is disabled');
    }
    throw new Error('Failed to delete person');
  }
}

/**
 * List all persons for the current user.
 *
 * @param userId - The user ID to filter by
 * @param search - Optional search query for name fuzzy matching
 * @param limit - Maximum number of persons to return (default: 100)
 * @returns Array of person objects
 * @throws Error if the request fails or feature is disabled
 */
export async function listPersons(
  userId: string,
  search?: string,
  limit: number = 100
): Promise<Person[]> {
  const params = new URLSearchParams({
    user_id: userId,
    limit: limit.toString(),
  });
  if (search) {
    params.set('q', search);
  }

  const response = await fetch(`/api/memory/entities/person?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 501) {
      throw new Error('Person feature is disabled');
    }
    throw new Error('Failed to fetch persons');
  }
  return response.json();
}
