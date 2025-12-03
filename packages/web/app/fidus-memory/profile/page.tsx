'use client';

import { Container, Stack } from '@fidus/ui';
import { UserProfile } from '@/app/fidus-memory/components/UserProfile';
import { getUserId } from '@/app/lib/userSession';

export default function ProfilePage() {
  const userId = getUserId() || '';

  return (
    <Container size="xl" padding="lg" className="py-lg">
      <Stack direction="vertical" spacing="lg">
        {/* Header */}
        <Stack direction="vertical" spacing="sm">
          <h1 className="text-3xl font-bold text-foreground">
            Profile
          </h1>
          <p className="text-muted-foreground">
            View and manage your profile settings
          </p>
        </Stack>

        {/* Profile Content */}
        <div className="shadow-lg rounded-lg overflow-hidden bg-card border border-border min-h-[600px]">
          <UserProfile userId={userId} tenantId="default" />
        </div>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Your profile data is stored locally and never shared.
          </p>
        </div>
      </Stack>
    </Container>
  );
}
