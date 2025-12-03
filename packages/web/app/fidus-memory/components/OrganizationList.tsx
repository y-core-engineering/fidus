'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  TextInput,
  Skeleton,
  Chip,
  Card,
  Stack,
  Select,
  type SelectOption,
} from '@fidus/ui';
import {
  type Organization,
  listOrganizations,
  getOrganizationFeatureStatus,
} from '@/lib/api/memory';
import { getUserId } from '@/app/lib/userSession';
import { useDebounce } from '@/lib/hooks/useDebounce';

const INDUSTRY_OPTIONS: SelectOption[] = [
  { value: 'Technology', label: 'Technology' },
  { value: 'AI Safety', label: 'AI Safety' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Other', label: 'Other' },
];

export interface OrganizationListRef {
  refresh: () => void;
}

interface OrganizationListProps {
  onSelectOrganization?: (org: Organization) => void;
  className?: string;
}

export const OrganizationList = forwardRef<OrganizationListRef, OrganizationListProps>(
  ({ onSelectOrganization, className = '' }, ref) => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const userId = getUserId();

    // Feature status query
    const {
      data: featureStatus,
      isLoading: isFeatureLoading,
    } = useQuery({
      queryKey: ['organizationFeatureStatus'],
      queryFn: getOrganizationFeatureStatus,
      staleTime: 60 * 1000, // Cache for 1 minute
      retry: false,
    });

    // Organizations list query
    const {
      data: organizations = [],
      isLoading: isOrganizationsLoading,
      error,
    } = useQuery({
      queryKey: ['organizations', userId, debouncedSearch, selectedIndustry],
      queryFn: () => listOrganizations(
        userId!,
        debouncedSearch || undefined,
        selectedIndustry || undefined
      ),
      enabled: !!userId && featureStatus?.enabled === true,
      staleTime: 30 * 1000, // 30 seconds
    });

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    }));

    const handleSelectOrganization = (org: Organization) => {
      setSelectedId(org.id);
      onSelectOrganization?.(org);
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
            <strong>Organization Entity Feature Disabled</strong>
            <p className="mt-1 text-sm">
              Set <code>ENABLE_ORGANIZATION_ENTITY=true</code> in your environment to enable this feature.
            </p>
          </Alert>
        </div>
      );
    }

    // Loading state
    const isLoading = isFeatureLoading || isOrganizationsLoading;
    if (isLoading && organizations.length === 0) {
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
            {error instanceof Error ? error.message : 'Failed to load organizations'}
          </Alert>
        </div>
      );
    }

    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Search bar and industry filter */}
        <div className="p-4 border-b border-border space-y-3">
          <TextInput
            label=""
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Select
            label=""
            placeholder="All Industries"
            value={selectedIndustry}
            options={INDUSTRY_OPTIONS}
            onChange={(value) => setSelectedIndustry(value)}
            clearable
            className="w-full"
          />
        </div>

        {/* Organization list */}
        <div className="flex-1 overflow-y-auto p-4">
          {organizations.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>No organizations found.</p>
              <p className="text-sm mt-2">
                Start a conversation to extract organization information automatically.
              </p>
            </div>
          ) : (
            <Stack direction="vertical" spacing="sm">
              {organizations.map((org) => (
                <Card
                  key={org.id}
                  interactive
                  selected={selectedId === org.id}
                  onClick={() => handleSelectOrganization(org)}
                  padding="md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {org.name}
                      </h3>
                      {org.industry && (
                        <p className="text-sm text-muted-foreground truncate">
                          {org.industry}
                        </p>
                      )}
                      {org.location && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          <Chip size="sm">{org.location}</Chip>
                          {org.size && (
                            <Chip size="sm" variant="outlined">
                              {org.size}
                            </Chip>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex flex-col items-end gap-1">
                      <Chip
                        size="sm"
                        variant={org.source === 'explicit' ? 'filled' : 'outlined'}
                      >
                        {org.source}
                      </Chip>
                      <Chip
                        size="sm"
                        variant={org.confidence >= 0.9 ? 'filled' : 'outlined'}
                      >
                        {Math.round(org.confidence * 100)}%
                      </Chip>
                    </div>
                  </div>
                </Card>
              ))}
            </Stack>
          )}
        </div>

        {/* Footer with count */}
        <div className="p-2 border-t border-border text-xs text-muted-foreground text-center">
          {organizations.length} organization{organizations.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }
);

OrganizationList.displayName = 'OrganizationList';
