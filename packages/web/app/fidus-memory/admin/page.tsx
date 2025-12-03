'use client';

import { Container, Stack } from '@fidus/ui';
import { MigrationStatus } from '@/app/fidus-memory/components/MigrationStatus';

export default function AdminPage() {
  return (
    <Container size="xl" padding="lg" className="py-lg">
      <Stack direction="vertical" spacing="lg">
        {/* Header */}
        <Stack direction="vertical" spacing="sm">
          <h1 className="text-3xl font-bold text-foreground">
            Admin
          </h1>
          <p className="text-muted-foreground">
            System administration and migration status
          </p>
        </Stack>

        {/* Admin Content */}
        <div className="shadow-lg rounded-lg overflow-hidden bg-card border border-border min-h-[600px]">
          <MigrationStatus className="p-4" />
        </div>

        {/* Notice */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Administrative functions for system management.
          </p>
        </div>
      </Stack>
    </Container>
  );
}
