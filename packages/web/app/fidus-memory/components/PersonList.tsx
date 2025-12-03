'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  TextInput,
  Skeleton,
  Chip,
} from '@fidus/ui';
import {
  type Person,
  listPersons,
  getPersonFeatureStatus,
} from '@/lib/api/memory';
import { getUserId } from '@/app/lib/userSession';
import { useDebounce } from '@/lib/hooks/useDebounce';

export interface PersonListRef {
  refresh: () => void;
}

interface PersonListProps {
  onSelectPerson?: (person: Person) => void;
  className?: string;
}

export const PersonList = forwardRef<PersonListRef, PersonListProps>(
  ({ onSelectPerson, className = '' }, ref) => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const userId = getUserId();

    // Feature status query
    const {
      data: featureStatus,
      isLoading: isFeatureLoading,
    } = useQuery({
      queryKey: ['personFeatureStatus'],
      queryFn: getPersonFeatureStatus,
      staleTime: 60 * 1000, // Cache for 1 minute
      retry: false,
    });

    // Persons list query
    const {
      data: persons = [],
      isLoading: isPersonsLoading,
      error,
    } = useQuery({
      queryKey: ['persons', userId, debouncedSearch],
      queryFn: () => listPersons(userId!, debouncedSearch || undefined),
      enabled: !!userId && featureStatus?.enabled === true,
      staleTime: 30 * 1000, // 30 seconds
    });

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: () => {
        queryClient.invalidateQueries({ queryKey: ['persons'] });
      },
    }));

    const handleSelectPerson = (person: Person) => {
      setSelectedId(person.id);
      onSelectPerson?.(person);
    };

    // No user ID
    if (!userId) {
      return (
        <div className={`p-4 ${className}`}>
          <Alert variant="info">
            Please send a message first to create your profile.
          </Alert>
        </div>
      );
    }

    // Feature disabled state
    if (featureStatus?.enabled === false) {
      return (
        <div className={`p-4 ${className}`}>
          <Alert variant="info">
            <strong>Person Entity Feature Disabled</strong>
            <p className="mt-1 text-sm">
              Set <code>ENABLE_PERSON_ENTITY=true</code> in your environment to enable this feature.
            </p>
          </Alert>
        </div>
      );
    }

    // Loading state
    const isLoading = isFeatureLoading || isPersonsLoading;
    if (isLoading && persons.length === 0) {
      return (
        <div className={`p-4 space-y-4 ${className}`}>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className={`p-4 ${className}`}>
          <Alert variant="error">
            {error instanceof Error ? error.message : 'Failed to load persons'}
          </Alert>
        </div>
      );
    }

    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200">
          <TextInput
            label=""
            placeholder="Search persons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Person list */}
        <div className="flex-1 overflow-y-auto">
          {persons.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No persons found.</p>
              <p className="text-sm mt-2">
                Start a conversation to extract person information automatically.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {persons.map((person) => (
                <li
                  key={person.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedId === person.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectPerson(person)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {person.name}
                      </h3>
                      {person.profession && (
                        <p className="text-sm text-gray-600 truncate">
                          {person.profession}
                        </p>
                      )}
                      {person.topics && person.topics.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {person.topics.slice(0, 3).map((topic, idx) => (
                            <Chip key={idx} size="sm">
                              {topic}
                            </Chip>
                          ))}
                          {person.topics.length > 3 && (
                            <Chip size="sm" variant="outlined">
                              +{person.topics.length - 3}
                            </Chip>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex flex-col items-end gap-1">
                      <Chip
                        size="sm"
                        variant={person.source === 'explicit' ? 'filled' : 'outlined'}
                      >
                        {person.source}
                      </Chip>
                      <Chip
                        size="sm"
                        variant={person.confidence >= 0.9 ? 'filled' : 'outlined'}
                      >
                        {Math.round(person.confidence * 100)}%
                      </Chip>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with count */}
        <div className="p-2 border-t border-gray-200 text-xs text-gray-500 text-center">
          {persons.length} person{persons.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }
);

PersonList.displayName = 'PersonList';
