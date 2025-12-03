'use client';

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  Alert,
  Button,
  TextInput,
  Skeleton,
  Badge,
} from '@fidus/ui';
import {
  type Person,
  listPersons,
  getPersonFeatureStatus,
} from '@/lib/api/memory';
import { getUserId } from '@/app/lib/userSession';

export interface PersonListRef {
  refresh: () => void;
}

interface PersonListProps {
  onSelectPerson?: (person: Person) => void;
  className?: string;
}

export const PersonList = forwardRef<PersonListRef, PersonListProps>(
  ({ onSelectPerson, className = '' }, ref) => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const fetchPersons = useCallback(async () => {
      const userId = getUserId();
      if (!userId) {
        setError('Please send a message first to create your profile.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await listPersons(userId, searchQuery || undefined);
        setPersons(data);
      } catch (err) {
        if (err instanceof Error && err.message === 'Person feature is disabled') {
          setFeatureEnabled(false);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load persons');
        }
      } finally {
        setIsLoading(false);
      }
    }, [searchQuery]);

    const checkFeatureStatus = useCallback(async () => {
      try {
        const status = await getPersonFeatureStatus();
        setFeatureEnabled(status.enabled);
        return status.enabled;
      } catch {
        setFeatureEnabled(false);
        return false;
      }
    }, []);

    useEffect(() => {
      checkFeatureStatus().then((enabled) => {
        if (enabled) {
          fetchPersons();
        } else {
          setIsLoading(false);
        }
      });
    }, [checkFeatureStatus, fetchPersons]);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: fetchPersons,
    }));

    const handleSelectPerson = (person: Person) => {
      setSelectedId(person.id);
      onSelectPerson?.(person);
    };

    const handleSearch = () => {
      fetchPersons();
    };

    // Feature disabled state
    if (featureEnabled === false) {
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
          <Alert variant="error">{error}</Alert>
        </div>
      );
    }

    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <TextInput
              label=""
              placeholder="Search persons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} size="sm">
              Search
            </Button>
          </div>
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
                            <Badge key={idx} variant="info" size="sm">
                              {topic}
                            </Badge>
                          ))}
                          {person.topics.length > 3 && (
                            <Badge variant="info" size="sm">
                              +{person.topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 text-right">
                      <Badge
                        variant={person.confidence >= 0.9 ? 'success' : 'normal'}
                        size="sm"
                      >
                        {Math.round(person.confidence * 100)}%
                      </Badge>
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
