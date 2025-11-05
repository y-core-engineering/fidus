/**
 * User Session Management
 *
 * Manages user_id persistence using LocalStorage for guest user sessions.
 * The backend returns X-User-ID header which we store and reuse across requests.
 */

const USER_ID_KEY = 'fidus_user_id';

/**
 * Get the current user_id from LocalStorage
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }
  return localStorage.getItem(USER_ID_KEY);
}

/**
 * Set the user_id in LocalStorage
 * @param userId - The user_id to store (e.g., "guest-uuid" or custom user ID)
 */
export function setUserId(userId: string): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  localStorage.setItem(USER_ID_KEY, userId);
}

/**
 * Clear the user_id from LocalStorage
 */
export function clearUserId(): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  localStorage.removeItem(USER_ID_KEY);
}

/**
 * Check if we have a stored user_id
 */
export function hasUserId(): boolean {
  return getUserId() !== null;
}
