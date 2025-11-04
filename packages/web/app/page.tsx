'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Fidus Memory
    router.push('/fidus-memory');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Fidus Memory</h1>
        <p className="text-muted-foreground">Redirecting to Fidus Memory...</p>
      </div>
    </div>
  );
}
