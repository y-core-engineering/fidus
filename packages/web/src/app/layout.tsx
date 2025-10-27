/**
 * Fidus Web Application - Root Layout
 *
 * Root layout component for the Fidus web interface.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fidus - Privacy-first AI Personal Assistant',
  description: 'Your privacy-first AI personal assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
