'use client';

import { useRef } from 'react';
import { Container, Stack } from '@fidus/ui';
import { PreferenceViewer, PreferenceViewerRef } from '@/app/fidus-memory/components/PreferenceViewer';

export default function PreferencesPage() {
  const preferenceViewerRef = useRef<PreferenceViewerRef>(null);

  return (
    <Container size="xl" padding="lg" className="py-lg">
      <Stack direction="vertical" spacing="lg">
        {/* Header */}
        <Stack direction="vertical" spacing="sm">
          <h1 className="text-3xl font-bold text-foreground">
            Preferences
          </h1>
          <p className="text-muted-foreground">
            View and manage your learned preferences
          </p>
        </Stack>

        {/* Preferences Content */}
        <div className="shadow-lg rounded-lg overflow-hidden bg-card border border-border min-h-[600px]">
          <PreferenceViewer ref={preferenceViewerRef} />
        </div>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Your preferences are stored securely and never shared.
          </p>
        </div>
      </Stack>
    </Container>
  );
}
