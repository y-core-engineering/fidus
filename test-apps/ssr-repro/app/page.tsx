import { Button, Stack, Alert, DetailCard } from '@fidus/ui'

export default function Home() {
  return (
    <main>
      <h1>SSR Reproduction Test</h1>

      <Stack spacing="md">
        <Button>Test Button</Button>

        <Alert variant="info">
          Test Alert Component
        </Alert>

        <DetailCard title="Test Card">
          Testing DetailCard component
        </DetailCard>
      </Stack>
    </main>
  )
}
