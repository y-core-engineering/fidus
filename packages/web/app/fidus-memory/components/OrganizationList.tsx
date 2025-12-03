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
  type Organization,
  listOrganizations,
  getOrganizationFeatureStatus,
} from '@/lib/api/memory';
import { getUserId } from '@/app/lib/userSession';
import { useDebounce } from '@/lib/hooks/useDebounce';

const INDUSTRIES = [
  'All Industries',
  'Technology',
  'AI Safety',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Other',
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
    const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
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
        selectedIndustry !== 'All Industries' ? selectedIndustry : undefined
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
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
        <div className="p-4 border-b border-gray-200 space-y-3">
          <TextInput
            label=""
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Organization grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {organizations.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No organizations found.</p>
              <p className="text-sm mt-2">
                Start a conversation to extract organization information automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow bg-white border border-gray-200 rounded-lg ${
                    selectedId === org.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelectOrganization(org)}
                >
                  <div className="flex items-start gap-3">
                    {/* Organization icon/logo placeholder */}
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-semibold">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {org.name}
                      </h3>
                      {org.industry && (
                        <p className="text-sm text-gray-600 truncate">
                          {org.industry}
                        </p>
                      )}
                      {org.location && (
                        <p className="text-xs text-gray-500 truncate">
                          {org.location}
                        </p>
                      )}
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {org.size && (
                          <Chip size="sm" variant="outlined">
                            {org.size}
                          </Chip>
                        )}
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with count */}
        <div className="p-2 border-t border-gray-200 text-xs text-gray-500 text-center">
          {organizations.length} organization{organizations.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }
);

OrganizationList.displayName = 'OrganizationList';
