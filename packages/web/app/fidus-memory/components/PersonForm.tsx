'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  key: string;
  value: string;
}

interface FormData {
  name: string;
  properties: PropertyPair[];
}

interface PersonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (person: Person) => void;
}

export function PersonForm({ open, onOpenChange, onCreated }: PersonFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      properties: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'properties',
  });

  const createMutation = useMutation({
    mutationFn: (data: PersonCreate) => createPerson(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      onCreated?.(created);
      handleClose();
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (formData: FormData) => {
    const ai_properties: Record<string, unknown> = {};

    for (const prop of formData.properties) {
      const key = prop.key.trim();
      const value = prop.value.trim();
      if (key && value) {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
        ai_properties[normalizedKey] = value;
      }
    }

    const personData: PersonCreate = {
      name: formData.name.trim(),
      source: 'explicit',
      confidence: 1.0,
    };

    if (Object.keys(ai_properties).length > 0) {
      personData.ai_properties = ai_properties;
    }

    createMutation.mutate(personData);
  };

  const addProperty = () => {
    append({ key: '', value: '' });
  };

  return (
    <ModalRoot open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <ModalTitle>Add Person</ModalTitle>
            <ModalDescription>
              Add a person to your network. Additional properties will be
              automatically learned from conversations.
            </ModalDescription>
          </ModalHeader>

          <div className="p-4 space-y-4">
            {createMutation.error && (
              <Alert variant="error">
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : 'Failed to create person'}
              </Alert>
            )}

            {/* Name - required */}
            <TextInput
              label="Name"
              {...register('name', { required: 'Name is required' })}
              placeholder="Person's name"
              disabled={createMutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}

            {/* Dynamic Properties */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Properties
                </label>
                <button
                  type="button"
                  onClick={addProperty}
                  disabled={createMutation.isPending}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  + Add
                </button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Suggestions: {PROPERTY_SUGGESTIONS.slice(0, 4).join(', ')}...
                </p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`properties.${index}.key`)}
                      placeholder="Property"
                      disabled={createMutation.isPending}
                      list="property-suggestions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`properties.${index}.value`)}
                      placeholder="Value"
                      disabled={createMutation.isPending}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={createMutation.isPending}
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
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Add'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalRoot>
  );
}
