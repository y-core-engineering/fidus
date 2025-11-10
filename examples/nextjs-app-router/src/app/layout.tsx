import type { Metadata } from 'next'
import '@fidus/ui/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fidus UI - Next.js App Router Example',
  description: 'Example application showcasing @fidus/ui components in Next.js App Router',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
