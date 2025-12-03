'use client';

import { useRef } from 'react';
import { Container, Stack } from '@fidus/ui';
import { SituationsViewer, SituationsViewerRef } from '@/app/fidus-memory/components/SituationsViewer';

export default function SituationsPage() {
  const situationsViewerRef = useRef<SituationsViewerRef>(null);

  return (
    <Container size="xl" padding="lg" className="py-lg">
      <Stack direction="vertical" spacing="lg">
        {/* Header */}
        <Stack direction="vertical" spacing="sm">
          <h1 className="text-3xl font-bold text-foreground">
            Situations
          </h1>
          <p className="text-muted-foreground">
            View situational contexts from your conversations
          </p>
        </Stack>

        {/* Situations Content */}
        <div className="shadow-lg rounded-lg overflow-hidden bg-card border border-border min-h-[600px]">
          <SituationsViewer ref={situationsViewerRef} className="p-4" />
        </div>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Situational context helps personalize your experience.
          </p>
        </div>
      </Stack>
    </Container>
  );
}
