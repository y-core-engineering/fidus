'use client';

import { useState, useRef } from 'react';
import { Container, Stack, Button, Grid } from '@fidus/ui';
import { OrganizationList, OrganizationListRef } from '@/app/fidus-memory/components/OrganizationList';
import { OrganizationDetail } from '@/app/fidus-memory/components/OrganizationDetail';
import { OrganizationForm } from '@/app/fidus-memory/components/OrganizationForm';
import { type Organization } from '@/lib/api/memory';

export default function OrganizationsPage() {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showForm, setShowForm] = useState(false);
  const organizationListRef = useRef<OrganizationListRef>(null);

  const handleOrganizationCreated = (org: Organization) => {
    organizationListRef.current?.refresh();
    setSelectedOrganization(org);
  };

  const handleOrganizationUpdated = (org: Organization) => {
    setSelectedOrganization(org);
    organizationListRef.current?.refresh();
  };

  const handleOrganizationDeleted = () => {
    setSelectedOrganization(null);
    organizationListRef.current?.refresh();
  };

  return (
    <Container size="xl" padding="lg" className="py-lg">
      <Stack direction="vertical" spacing="lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Stack direction="vertical" spacing="sm">
            <h1 className="text-3xl font-bold text-foreground">
              Organizations
            </h1>
            <p className="text-muted-foreground">
              Manage organizations in your network
            </p>
          </Stack>
          <Button onClick={() => setShowForm(true)}>
            + Add Organization
          </Button>
        </div>

        {/* Main Content: List + Detail */}
        <Grid cols="2" gap="lg" className="min-h-[600px]">
          {/* Organizations List */}
          <div className="shadow-lg rounded-lg overflow-hidden bg-card border border-border h-[600px]">
            <OrganizationList
              ref={organizationListRef}
              onSelectOrganization={setSelectedOrganization}
              className="h-full"
            />
          </div>

          {/* Organization Detail */}
          <div className="shadow-lg rounded-lg overflow-hidden bg-card border border-border h-[600px]">
            <OrganizationDetail
              organization={selectedOrganization}
              onUpdate={handleOrganizationUpdated}
              onDelete={handleOrganizationDeleted}
              className="h-full"
            />
          </div>
        </Grid>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Organization data is stored securely in your private memory graph.
          </p>
        </div>
      </Stack>

      {/* Organization Form Modal */}
      <OrganizationForm
        open={showForm}
        onOpenChange={setShowForm}
        onCreated={handleOrganizationCreated}
      />
    </Container>
  );
}
