import { Button, Link, IconButton, ButtonGroup } from '@fidus/ui';
import { Search, Settings, Menu } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary" />
            <span className="text-xl font-bold">Fidus Design System</span>
          </div>
          <div className="flex items-center gap-2">
            <IconButton variant="tertiary" size="md" aria-label="Search">
              <Search className="h-5 w-5" />
            </IconButton>
            <IconButton variant="tertiary" size="md" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Fidus Design System
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              A comprehensive design system for building privacy-first,
              AI-driven user interfaces.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="secondary" size="lg">
                View Components
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Slice 0: Action Components
          </h2>
          <div className="mx-auto max-w-2xl space-y-8">
            <div>
              <h3 className="mb-4 text-xl font-semibold">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">Links</h3>
              <div className="space-y-2">
                <Link href="#" variant="inline">Inline Link</Link>
                <br />
                <Link href="https://example.com" external>External Link</Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">Icon Buttons</h3>
              <div className="flex gap-4">
                <IconButton variant="primary" aria-label="Search">
                  <Search className="h-5 w-5" />
                </IconButton>
                <IconButton variant="secondary" aria-label="Settings">
                  <Settings className="h-5 w-5" />
                </IconButton>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">Button Group</h3>
              <ButtonGroup>
                <Button variant="tertiary">Left</Button>
                <Button variant="tertiary">Center</Button>
                <Button variant="tertiary">Right</Button>
              </ButtonGroup>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Fidus Design System · Slice 0 Complete ✅</p>
        </div>
      </footer>
    </div>
  );
}
