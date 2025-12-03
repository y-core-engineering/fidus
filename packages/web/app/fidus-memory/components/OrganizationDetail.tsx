'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  TextInput,
  Chip,
  ModalRoot,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@fidus/ui';
import {
  type Organization,
  updateOrganization,
  deleteOrganization,
} from '@/lib/api/memory';

interface OrganizationDetailProps {
  organization: Organization | null;
  onUpdate?: (org: Organization) => void;
  onDelete?: (orgId: string) => void;
  className?: string;
}

export function OrganizationDetail({
  organization,
  onUpdate,
  onDelete,
  className = '',
}: OrganizationDetailProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form state
  const [name, setName] = useState(organization?.name || '');

  // Reset form when organization changes
  useEffect(() => {
    setName(organization?.name || '');
    setIsEditing(false);
  }, [organization]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { name: string }) => updateOrganization(organization!.id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      onUpdate?.(updated);
      setIsEditing(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteOrganization(organization!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      onDelete?.(organization!.id);
      setShowDeleteDialog(false);
    },
  });

  const handleSave = () => {
    if (!organization) return;
    updateMutation.mutate({ name });
  };

  const handleDelete = () => {
    if (!organization) return;
    deleteMutation.mutate();
  };

  const handleCancel = () => {
    setName(organization?.name || '');
    setIsEditing(false);
  };

  // No organization selected
  if (!organization) {
    return (
      <div className={`flex items-center justify-center h-full text-gray-500 ${className}`}>
        <p>Select an organization to view details</p>
      </div>
    );
  }

  const error = updateMutation.error || deleteMutation.error;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {error && (
        <div className="p-4">
          <Alert variant="error">
            {error instanceof Error ? error.message : 'An error occurred'}
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Organization' : 'Organization Details'}
          </h2>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  size="sm"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                  size="sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} size="sm">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  size="sm"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          {isEditing ? (
            <TextInput
              label=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization name"
            />
          ) : (
            <p className="text-gray-900">{organization.name}</p>
          )}
        </div>

        {/* Industry */}
        {organization.industry && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <p className="text-gray-900">{organization.industry}</p>
          </div>
        )}

        {/* Size */}
        {organization.size && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <Chip size="sm">{organization.size}</Chip>
          </div>
        )}

        {/* Location */}
        {organization.location && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <p className="text-gray-900">{organization.location}</p>
          </div>
        )}

        {/* Culture */}
        {organization.culture && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Culture
            </label>
            <p className="text-gray-900">{organization.culture}</p>
          </div>
        )}

        {/* Website */}
        {organization.website && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {organization.website}
            </a>
          </div>
        )}

        {/* Description */}
        {organization.description && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <p className="text-gray-900">{organization.description}</p>
          </div>
        )}

        {/* AI Properties (raw) */}
        {organization.ai_properties && Object.keys(organization.ai_properties).length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              All AI-Discovered Properties
            </label>
            <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto border border-gray-200 max-h-48">
              {JSON.stringify(organization.ai_properties, null, 2)}
            </pre>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Metadata</h3>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <dt className="text-gray-500">ID</dt>
            <dd className="text-gray-900 font-mono">{organization.id.substring(0, 8)}...</dd>

            <dt className="text-gray-500">Source</dt>
            <dd className="text-gray-900">{organization.source}</dd>

            <dt className="text-gray-500">Confidence</dt>
            <dd className="text-gray-900">{Math.round(organization.confidence * 100)}%</dd>

            <dt className="text-gray-500">Created</dt>
            <dd className="text-gray-900">{new Date(organization.created_at).toLocaleDateString()}</dd>

            <dt className="text-gray-500">Updated</dt>
            <dd className="text-gray-900">{new Date(organization.updated_at).toLocaleDateString()}</dd>
          </dl>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ModalRoot open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Organization</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete <strong>{organization.name}</strong>?
              This will also remove all relationships connected to this organization.
              <strong className="block mt-2 text-red-600">
                This action cannot be undone.
              </strong>
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Organization'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalRoot>
    </div>
  );
}
