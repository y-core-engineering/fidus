/**
 * Memory API client for user management.
 *
 * Provides typed functions for interacting with the User API endpoints.
 */

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  preferred_language: string;
  timezone: string;
  skills: string[];
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
  skills?: string[];
  ai_properties?: Record<string, unknown>;
}

export interface UserUpdate {
  name?: string;
  preferred_language?: string;
  timezone?: string;
  skills?: string[];
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
