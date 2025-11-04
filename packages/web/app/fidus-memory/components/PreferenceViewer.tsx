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
  Grid,
  DetailCard
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

  // Group preferences by domain
  const groupedPreferences: PreferenceGroup[] = preferences.reduce((groups, pref) => {
    const domain = pref.domain || 'general';
    let group = groups.find(g => g.domain === domain);

    if (!group) {
      group = { domain, preferences: [] };
      groups.push(group);
    }

    group.preferences.push(pref);
    return groups;
  }, [] as PreferenceGroup[]);

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
            <Grid cols="3" gap="md">
              {group.preferences.map((pref) => (
                <div key={pref.id} className="rounded-lg border border-border bg-card p-3 shadow-sm">
                  <Stack direction="vertical" spacing="sm">
                    {/* Preference header with title and sentiment */}
                    <Stack direction="horizontal" spacing="sm" justify="between">
                      <Stack direction="vertical" spacing="xs">
                        <div className="text-sm font-semibold text-foreground">
                          {pref.key.split('.').pop()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {pref.value}
                        </div>
                      </Stack>
                      <Badge
                        variant={pref.sentiment === 'positive' ? 'success' : pref.sentiment === 'negative' ? 'error' : 'normal'}
                      >
                        {pref.sentiment === 'positive' ? '👍' : pref.sentiment === 'negative' ? '👎' : '😐'}
                      </Badge>
                    </Stack>

                    {/* Confidence and metadata */}
                    <Stack direction="horizontal" spacing="sm" justify="between">
                      <ConfidenceIndicator
                        confidence={pref.confidence}
                        variant="minimal"
                        size="sm"
                      />
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
                    </Stack>

                    {/* Accept/Reject buttons (only if we have ID from Neo4j) */}
                    {pref.id && (
                      <Stack direction="horizontal" spacing="xs">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAcceptPreference(pref.id!)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRejectPreference(pref.id!)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </div>
              ))}
            </Grid>
          </DetailCard>
        ))}
      </Stack>
    </Container>
  );
});
