'use client';

import { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  TextInput,
  Badge,
  ModalRoot,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@fidus/ui';
import {
  type Person,
  updatePerson,
  deletePerson,
} from '@/lib/api/memory';

interface PersonDetailProps {
  person: Person | null;
  onUpdate?: (person: Person) => void;
  onDelete?: (personId: string) => void;
  className?: string;
}

export function PersonDetail({
  person,
  onUpdate,
  onDelete,
  className = '',
}: PersonDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form state
  const [name, setName] = useState(person?.name || '');

  // Reset form when person changes
  useEffect(() => {
    setName(person?.name || '');
    setIsEditing(false);
    setError(null);
  }, [person]);

  const resetForm = () => {
    setName(person?.name || '');
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!person) return;

    setIsSaving(true);
    setError(null);

    try {
      const updated = await updatePerson(person.id, { name });
      onUpdate?.(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update person');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!person) return;

    try {
      await deletePerson(person.id);
      onDelete?.(person.id);
      setShowDeleteDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete person');
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  // No person selected
  if (!person) {
    return (
      <div className={`flex items-center justify-center h-full text-gray-500 ${className}`}>
        <p>Select a person to view details</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {error && (
        <div className="p-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Person' : 'Person Details'}
          </h2>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isSaving}
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
              placeholder="Person's name"
            />
          ) : (
            <p className="text-gray-900">{person.name}</p>
          )}
        </div>

        {/* Profession */}
        {person.profession && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profession
            </label>
            <p className="text-gray-900">{person.profession}</p>
          </div>
        )}

        {/* Topics */}
        {person.topics && person.topics.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topics
            </label>
            <div className="flex flex-wrap gap-2">
              {person.topics.map((topic, idx) => (
                <Badge key={idx} variant="info">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Communication Style */}
        {person.communication_style && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Communication Style
            </label>
            <p className="text-gray-900">{person.communication_style}</p>
          </div>
        )}

        {/* AI Properties (raw) */}
        {person.ai_properties && Object.keys(person.ai_properties).length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              All AI-Discovered Properties
            </label>
            <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto border border-gray-200 max-h-48">
              {JSON.stringify(person.ai_properties, null, 2)}
            </pre>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Metadata</h3>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <dt className="text-gray-500">ID</dt>
            <dd className="text-gray-900 font-mono">{person.id.substring(0, 8)}...</dd>

            <dt className="text-gray-500">Source</dt>
            <dd className="text-gray-900">{person.source}</dd>

            <dt className="text-gray-500">Confidence</dt>
            <dd className="text-gray-900">{Math.round(person.confidence * 100)}%</dd>

            <dt className="text-gray-500">Created</dt>
            <dd className="text-gray-900">{new Date(person.created_at).toLocaleDateString()}</dd>

            <dt className="text-gray-500">Updated</dt>
            <dd className="text-gray-900">{new Date(person.updated_at).toLocaleDateString()}</dd>
          </dl>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ModalRoot open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Person</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete <strong>{person.name}</strong>?
              This will also remove all relationships connected to this person.
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
              Delete Person
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalRoot>
    </div>
  );
}
