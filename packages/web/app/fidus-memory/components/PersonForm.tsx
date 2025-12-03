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
  const [profession, setProfession] = useState('');
  const [topics, setTopics] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('');

  const resetForm = () => {
    setName('');
    setProfession('');
    setTopics('');
    setCommunicationStyle('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
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
      // Build ai_properties from form fields
      const ai_properties: Record<string, unknown> = {};

      if (profession.trim()) {
        ai_properties.profession = profession.trim();
      }

      if (topics.trim()) {
        // Split by comma and trim each topic
        ai_properties.topics = topics
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      }

      if (communicationStyle.trim()) {
        ai_properties.communication_style = communicationStyle.trim();
      }

      const personData: PersonCreate = {
        name: name.trim(),
        source: 'explicit', // User-created persons are explicit
        confidence: 1.0, // High confidence for explicit entries
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
            <ModalTitle>Add New Person</ModalTitle>
            <ModalDescription>
              Add a person to your network. Additional properties can be added
              later through conversations.
            </ModalDescription>
          </ModalHeader>

          <div className="p-4 space-y-4">
            {error && <Alert variant="error">{error}</Alert>}

            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Person's name"
              required
              disabled={isSubmitting}
            />

            <TextInput
              label="Profession (optional)"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g., Software Engineer, Designer"
              disabled={isSubmitting}
            />

            <TextInput
              label="Topics (optional)"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="e.g., AI, Design, Photography (comma-separated)"
              disabled={isSubmitting}
            />

            <TextInput
              label="Communication Style (optional)"
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              placeholder="e.g., formal, casual, technical"
              disabled={isSubmitting}
            />
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
              {isSubmitting ? 'Creating...' : 'Add Person'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalRoot>
  );
}
