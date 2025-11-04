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
  IconButton,
  Modal,
  Tooltip
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    try {
      const response = await fetch('http://localhost:8000/memory/preferences', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete preferences');
      }

      setPreferences([]);
      setShowDeleteModal(false);
      if (onDeleteAll) {
        await onDeleteAll();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setShowDeleteModal(false);
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
            onClick={() => setShowDeleteModal(true)}
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
            <div className="-mx-4 -my-3">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-full">Preference</TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    <Stack direction="horizontal" spacing="xs" align="center" justify="end">
                      <span>This you?</span>
                      <Tooltip content="👍 Thumbs Up: Increase confidence (+10%). 👎 Thumbs Down: Decrease confidence (-15%). If confidence reaches 0%, the preference is automatically deleted.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 16v-4"></path>
                          <path d="M12 8h.01"></path>
                        </svg>
                      </Tooltip>
                    </Stack>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.preferences.map((pref) => (
                  <TableRow key={pref.id}>
                    <TableCell className="w-full">
                      <Stack direction="horizontal" spacing="sm" align="start" justify="between">
                        <Stack direction="vertical" spacing="xs" className="flex-1 min-w-0">
                          <Stack direction="horizontal" spacing="xs" align="center" className="flex-wrap">
                            <div className="font-medium">{pref.key.split('.').pop()}</div>
                            <Tooltip content={
                              pref.sentiment === 'positive'
                                ? '👍 Positive: You like or prefer this'
                                : pref.sentiment === 'negative'
                                ? '👎 Negative: You dislike or avoid this'
                                : '😐 Neutral: No strong preference'
                            }>
                              <Badge
                                variant={pref.sentiment === 'positive' ? 'success' : pref.sentiment === 'negative' ? 'error' : 'normal'}
                                size="sm"
                              >
                                {pref.sentiment === 'positive' ? '👍' : pref.sentiment === 'negative' ? '👎' : '😐'}
                              </Badge>
                            </Tooltip>
                          </Stack>
                          <div className="text-sm text-muted-foreground break-words">{pref.value}</div>
                          <Stack direction="horizontal" spacing="xs" align="center" className="flex-wrap">
                            <Tooltip content={`Confidence: ${Math.round(pref.confidence * 100)}% - This shows how certain Fidus is about this preference. Give feedback with 👍/👎 buttons to adjust confidence. Preferences with 0% confidence are automatically removed.`}>
                              <div>
                                <ConfidenceIndicator
                                  confidence={pref.confidence}
                                  variant="minimal"
                                  size="sm"
                                />
                              </div>
                            </Tooltip>
                            {pref.is_exception && (
                              <Tooltip content="Exception: This preference has special rules or conditions">
                                <Badge variant="warning" size="sm">Exception</Badge>
                              </Tooltip>
                            )}
                            {(pref.reinforcement_count !== undefined && pref.reinforcement_count > 0) && (
                              <Tooltip content={`You agreed with this preference ${pref.reinforcement_count} ${pref.reinforcement_count === 1 ? 'time' : 'times'}`}>
                                <Badge variant="success" size="sm">+{pref.reinforcement_count}</Badge>
                              </Tooltip>
                            )}
                            {(pref.rejection_count !== undefined && pref.rejection_count > 0) && (
                              <Tooltip content={`You disagreed with this preference ${pref.rejection_count} ${pref.rejection_count === 1 ? 'time' : 'times'}`}>
                                <Badge variant="error" size="sm">-{pref.rejection_count}</Badge>
                              </Tooltip>
                            )}
                          </Stack>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right align-top">
                      {pref.id && (
                        <Stack direction="horizontal" spacing="xs" justify="end">
                          <IconButton
                            variant="primary"
                            size="sm"
                            aria-label="Increase confidence (I agree)"
                            onClick={() => handleAcceptPreference(pref.id!)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                          </IconButton>
                          <IconButton
                            variant="destructive"
                            size="sm"
                            aria-label="Decrease confidence (I disagree)"
                            onClick={() => handleRejectPreference(pref.id!)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                            </svg>
                          </IconButton>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </DetailCard>
        ))}
      </Stack>

      <Modal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete All Memories?"
        description="This action cannot be undone. All your preferences will be permanently deleted."
        dismissible={false}
        closeOnBackdropClick={false}
        closeOnEscape={false}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAll}>
              Delete All
            </Button>
          </>
        }
      >
        <></>
      </Modal>
    </Container>
  );
});
