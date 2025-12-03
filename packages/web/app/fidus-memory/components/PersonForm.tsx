'use client';

import { useState } from 'react';
import {
  Alert,
  Button,
  TextInput,
  ModalRoot,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@fidus/ui';
import { type Person, type PersonCreate, createPerson } from '@/lib/api/memory';

// Common property suggestions matching Package 2.1 spec
const PROPERTY_SUGGESTIONS = [
  'Profession',
  'Company',
  'Topics',
  'Communication Style',
  'Email',
  'Phone',
  'Notes',
];

interface PropertyPair {
  id: string;
  key: string;
  value: string;
}

interface PersonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (person: Person) => void;
}

export function PersonForm({ open, onOpenChange, onCreated }: PersonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [properties, setProperties] = useState<PropertyPair[]>([]);

  const resetForm = () => {
    setName('');
    setProperties([]);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const addProperty = () => {
    setProperties([
      ...properties,
      { id: crypto.randomUUID(), key: '', value: '' },
    ]);
  };

  const removeProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  const updateProperty = (id: string, field: 'key' | 'value', value: string) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Build ai_properties from dynamic properties
      const ai_properties: Record<string, unknown> = {};

      // Add all custom properties
      for (const prop of properties) {
        const key = prop.key.trim();
        const value = prop.value.trim();
        if (key && value) {
          // Convert key to snake_case for consistency
          const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
          ai_properties[normalizedKey] = value;
        }
      }

      const personData: PersonCreate = {
        name: name.trim(),
        source: 'explicit',
        confidence: 1.0,
      };

      if (Object.keys(ai_properties).length > 0) {
        personData.ai_properties = ai_properties;
      }

      const created = await createPerson(personData);
      onCreated?.(created);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create person');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalRoot open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Add Person</ModalTitle>
            <ModalDescription>
              Add a person to your network. Additional properties will be
              automatically learned from conversations.
            </ModalDescription>
          </ModalHeader>

          <div className="p-4 space-y-4">
            {error && <Alert variant="error">{error}</Alert>}

            {/* Name - required */}
            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Person's name"
              required
              disabled={isSubmitting}
            />

            {/* Dynamic Properties */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Properties
                </label>
                <button
                  type="button"
                  onClick={addProperty}
                  disabled={isSubmitting}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  + Add
                </button>
              </div>

              {properties.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Suggestions: {PROPERTY_SUGGESTIONS.slice(0, 4).join(', ')}...
                </p>
              )}

              {properties.map((prop) => (
                <div key={prop.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={prop.key}
                      onChange={(e) => updateProperty(prop.id, 'key', e.target.value)}
                      placeholder="Property"
                      disabled={isSubmitting}
                      list="property-suggestions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={prop.value}
                      onChange={(e) => updateProperty(prop.id, 'value', e.target.value)}
                      placeholder="Value"
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProperty(prop.id)}
                    disabled={isSubmitting}
                    className="p-2 text-gray-400 hover:text-red-600 disabled:cursor-not-allowed"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Datalist for property suggestions */}
              <datalist id="property-suggestions">
                {PROPERTY_SUGGESTIONS.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Add'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalRoot>
  );
}
