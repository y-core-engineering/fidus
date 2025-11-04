'use client';

import { Preference, PreferenceGroup } from '@fidus/shared';
import {
  Button,
  ConfidenceIndicator,
  Badge,
  Container,
  Spinner,
  EmptyCard,
  Stack,
  DetailCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  IconButton
} from '@fidus/ui';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface PreferenceViewerProps {
  onDeleteAll?: () => Promise<void>;
}

export interface PreferenceViewerRef {
  refresh: () => Promise<void>;
}

export const PreferenceViewer = forwardRef<PreferenceViewerRef, PreferenceViewerProps>(
  function PreferenceViewer({ onDeleteAll }, ref) {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial load with spinner
    fetchPreferences(true);
  }, []);

  // Expose refresh method to parent via ref
  useImperativeHandle(ref, () => ({
    refresh: () => fetchPreferences(false),
  }));

  const fetchPreferences = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      setError(null);
      const response = await fetch('http://localhost:8000/memory/preferences');
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      const data = await response.json();
      setPreferences(data.preferences || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (showLoadingSpinner) {
        setLoading(false);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all memories? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/memory/preferences', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete preferences');
      }

      setPreferences([]);
      if (onDeleteAll) {
        await onDeleteAll();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleAcceptPreference = async (preferenceId: string) => {
    try {
      const response = await fetch('http://localhost:8000/memory/preferences/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preference_id: preferenceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept preference');
      }

      // Refresh preferences to show updated confidence (no spinner)
      await fetchPreferences(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept');
    }
  };

  const handleRejectPreference = async (preferenceId: string) => {
    try {
      const response = await fetch('http://localhost:8000/memory/preferences/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preference_id: preferenceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject preference');
      }

      // Refresh preferences to show updated confidence (no spinner)
      await fetchPreferences(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    }
  };

  // Group preferences by domain and sort alphabetically
  const groupedPreferences: PreferenceGroup[] = preferences
    .reduce((groups, pref) => {
      const domain = pref.domain || 'general';
      let group = groups.find(g => g.domain === domain);

      if (!group) {
        group = { domain, preferences: [] };
        groups.push(group);
      }

      group.preferences.push(pref);
      return groups;
    }, [] as PreferenceGroup[])
    // Sort groups alphabetically by domain name
    .sort((a, b) => a.domain.localeCompare(b.domain))
    // Sort preferences within each group alphabetically by key
    .map(group => ({
      ...group,
      preferences: group.preferences.sort((a, b) => a.key.localeCompare(b.key))
    }));

  if (loading) {
    return (
      <Container size="md" padding="lg">
        <Stack direction="vertical" spacing="md" align="center">
          <Spinner size="lg" />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" padding="lg">
        <Stack direction="vertical" spacing="md">
          <div className="text-sm text-destructive">Error: {error}</div>
          <Button onClick={() => fetchPreferences(true)}>
            Retry
          </Button>
        </Stack>
      </Container>
    );
  }

  if (preferences.length === 0) {
    return (
      <Container size="md" padding="lg">
        <EmptyCard
          title="No Preferences Yet"
          description="Chat with Fidus Memory to start building your profile!"
        />
      </Container>
    );
  }

  return (
    <Container size="full" padding="lg">
      <Stack direction="vertical" spacing="lg">
        <Stack direction="horizontal" spacing="md" justify="between">
          <div className="text-lg font-semibold text-foreground">Your Preferences</div>
          <Button
            onClick={handleDeleteAll}
            variant="destructive"
            disabled={preferences.length === 0}
          >
            Delete All Memories
          </Button>
        </Stack>

        {groupedPreferences.map((group) => (
          <DetailCard
            key={group.domain}
            title={group.domain}
            subtitle={`${group.preferences.length} ${group.preferences.length === 1 ? 'preference' : 'preferences'}`}
            defaultExpanded={true}
            collapsible={true}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preference</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Metadata</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.preferences.map((pref) => (
                  <TableRow key={pref.id}>
                    <TableCell className="font-medium">
                      {pref.key.split('.').pop()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {pref.value}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={pref.sentiment === 'positive' ? 'success' : pref.sentiment === 'negative' ? 'error' : 'normal'}
                      >
                        {pref.sentiment === 'positive' ? '👍' : pref.sentiment === 'negative' ? '👎' : '😐'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ConfidenceIndicator
                        confidence={pref.confidence}
                        variant="minimal"
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="horizontal" spacing="xs">
                        {pref.is_exception && (
                          <Badge variant="warning" size="sm">
                            Exception
                          </Badge>
                        )}
                        {(pref.reinforcement_count !== undefined && pref.reinforcement_count > 0) && (
                          <Badge variant="success" size="sm">
                            +{pref.reinforcement_count}
                          </Badge>
                        )}
                        {(pref.rejection_count !== undefined && pref.rejection_count > 0) && (
                          <Badge variant="error" size="sm">
                            -{pref.rejection_count}
                          </Badge>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell className="text-right">
                      {pref.id && (
                        <Stack direction="horizontal" spacing="xs" justify="end">
                          <IconButton
                            variant="primary"
                            size="sm"
                            aria-label="Accept preference"
                            onClick={() => handleAcceptPreference(pref.id!)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </IconButton>
                          <IconButton
                            variant="destructive"
                            size="sm"
                            aria-label="Reject preference"
                            onClick={() => handleRejectPreference(pref.id!)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </IconButton>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DetailCard>
        ))}
      </Stack>
    </Container>
  );
});
