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
  Grid
} from '@fidus/ui';
import { useState, useEffect } from 'react';

interface PreferenceViewerProps {
  onDeleteAll?: () => Promise<void>;
}

export function PreferenceViewer({ onDeleteAll }: PreferenceViewerProps) {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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

      // Refresh preferences to show updated confidence
      await fetchPreferences();
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

      // Refresh preferences to show updated confidence
      await fetchPreferences();
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
          <p>Error: {error}</p>
          <Button onClick={fetchPreferences}>
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
          <h2>Your Preferences</h2>
          <Button
            onClick={handleDeleteAll}
            variant="destructive"
            disabled={preferences.length === 0}
          >
            Delete All Memories
          </Button>
        </Stack>

        {groupedPreferences.map((group) => (
          <Stack key={group.domain} direction="vertical" spacing="md">
            <h3>{group.domain}</h3>
            <Grid cols="3" gap="md">
              {group.preferences.map((pref) => (
                <Stack key={pref.id} direction="vertical" spacing="sm">
                  <Stack direction="horizontal" spacing="sm" justify="between">
                    <Stack direction="vertical" spacing="xs">
                      <strong>{pref.key.split('.').pop()}</strong>
                      <span>{pref.value}</span>
                    </Stack>
                    <Badge
                      variant={pref.sentiment === 'positive' ? 'success' : pref.sentiment === 'negative' ? 'error' : 'normal'}
                    >
                      {pref.sentiment === 'positive' ? '👍' : pref.sentiment === 'negative' ? '👎' : '😐'}
                    </Badge>
                  </Stack>

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
              ))}
            </Grid>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}
