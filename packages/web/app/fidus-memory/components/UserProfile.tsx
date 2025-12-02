'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  TextInput,
  Select,
  Alert,
  ModalRoot,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  Skeleton,
} from '@fidus/ui';
// NOTE (ADR-0003): Skills are now managed per relationship context, not on User
import {
  type User,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from '@/lib/api/memory';
import { setUserId } from '@/app/lib/userSession';

interface UserProfileProps {
  userId: string;
  tenantId: string;
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'America/New_York', label: 'America/New_York' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
];

export function UserProfile({ userId, tenantId }: UserProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setError('No user ID available. Please send a message first to create your profile.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const userData = await getUser(userId, tenantId);
      setUser(userData);
      setName(userData.name);
      setPreferredLanguage(userData.preferred_language);
      setTimezone(userData.timezone);
    } catch (err) {
      // If user not found by ID (404), try to find by email or create
      if (err instanceof Error && err.message === 'User not found') {
        const email = `${userId}@example.com`;
        try {
          // First, try to find by email (user may exist with different ID)
          const existingUser = await getUserByEmail(email, tenantId);
          // Found! Update localStorage with the correct ID
          setUserId(existingUser.id);
          setUser(existingUser);
          setName(existingUser.name);
          setPreferredLanguage(existingUser.preferred_language);
          setTimezone(existingUser.timezone);
        } catch {
          // Not found by email either, create new user
          try {
            const newUser = await createUser({
              tenant_id: tenantId,
              email,
              name: 'New User',
            });
            // Update localStorage with the new user's ID
            setUserId(newUser.id);
            setUser(newUser);
            setName(newUser.name);
            setPreferredLanguage(newUser.preferred_language);
            setTimezone(newUser.timezone);
            setIsEditing(true); // Start in edit mode for new users
          } catch (createErr) {
            setError('Failed to create user profile');
            console.error(createErr);
          }
        }
      } else {
        setError('Failed to load user profile');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, tenantId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    try {
      // Use user.id (actual DB ID) instead of userId prop (may be stale)
      const updatedUser = await updateUser(user.id, tenantId, {
        name,
        preferred_language: preferredLanguage,
        timezone,
      });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Use user.id (actual DB ID) instead of userId prop
      await deleteUser(user.id, tenantId);
      router.push('/');
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
    }
    setIsEditing(false);
  };

  if (isLoading && !user) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-5">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <TextInput
              label=""
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <TextInput
              label=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              placeholder="Your full name"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Language
            </label>
            <Select
              label=""
              value={preferredLanguage}
              onChange={setPreferredLanguage}
              disabled={!isEditing}
              options={LANGUAGES}
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <Select
              label=""
              value={timezone}
              onChange={setTimezone}
              disabled={!isEditing}
              options={TIMEZONES}
            />
          </div>

          {/* AI Properties (read-only) */}
          {user?.ai_properties && Object.keys(user.ai_properties).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI-Discovered Properties
              </label>
              <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto border border-gray-200 max-h-48">
                {JSON.stringify(user.ai_properties, null, 2)}
              </pre>
              <p className="text-xs text-gray-500 mt-1">
                Properties discovered by the AI during conversations
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Delete Account
          </Button>
        </div>
      </div>

      {/* Metadata */}
      {user && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>User ID: {user.id}</p>
          <p>Tenant ID: {user.tenant_id}</p>
          <p>Created: {new Date(user.created_at).toLocaleString()}</p>
          <p>Last Updated: {new Date(user.updated_at).toLocaleString()}</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ModalRoot open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Account</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete your account? This will permanently delete
              all your data, including preferences, entities, and relationships.
              <strong className="block mt-2 text-red-600">
                This action cannot be undone.
              </strong>
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalRoot>
    </div>
  );
}
