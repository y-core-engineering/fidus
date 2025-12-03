'use client';

import { useState, useRef } from 'react';
import { Container, Stack, Button, Grid } from '@fidus/ui';
import { PersonList, PersonListRef } from '@/app/fidus-memory/components/PersonList';
import { PersonDetail } from '@/app/fidus-memory/components/PersonDetail';
import { PersonForm } from '@/app/fidus-memory/components/PersonForm';
import { type Person } from '@/lib/api/memory';

export default function PersonsPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);
  const personListRef = useRef<PersonListRef>(null);

  const handlePersonCreated = (person: Person) => {
    personListRef.current?.refresh();
    setSelectedPerson(person);
  };

  const handlePersonUpdated = (person: Person) => {
    setSelectedPerson(person);
    personListRef.current?.refresh();
  };

  const handlePersonDeleted = () => {
    setSelectedPerson(null);
    personListRef.current?.refresh();
  };

  return (
    <Container size="xl" padding="lg" className="py-lg">
      <Stack direction="vertical" spacing="lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Stack direction="vertical" spacing="sm">
            <h1 className="text-3xl font-bold text-foreground">
              Persons
            </h1>
            <p className="text-muted-foreground">
              Manage persons in your network
            </p>
          </Stack>
          <Button onClick={() => setShowForm(true)}>
            + Add Person
          </Button>
        </div>

        {/* Main Content: List + Detail */}
        <Grid cols="2" gap="lg" className="min-h-[600px]">
          {/* Person List */}
          <div className="shadow-lg rounded-lg overflow-hidden bg-card border border-border h-[600px]">
            <PersonList
              ref={personListRef}
              onSelectPerson={setSelectedPerson}
              className="h-full"
            />
          </div>

          {/* Person Detail */}
          <div className="shadow-lg rounded-lg overflow-hidden bg-card border border-border h-[600px]">
            <PersonDetail
              person={selectedPerson}
              onUpdate={handlePersonUpdated}
              onDelete={handlePersonDeleted}
              className="h-full"
            />
          </div>
        </Grid>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Person data is stored securely in your private memory graph.
          </p>
        </div>
      </Stack>

      {/* Person Form Modal */}
      <PersonForm
        open={showForm}
        onOpenChange={setShowForm}
        onCreated={handlePersonCreated}
      />
    </Container>
  );
}
