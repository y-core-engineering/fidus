import Link from 'next/link';
import { Button, Stack } from '@fidus/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Stack spacing="lg" align="center">
        <h1>404 - Page Not Found</h1>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </Stack>
    </div>
  );
}
