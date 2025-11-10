import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SSR Repro Test',
  description: 'Minimal reproduction case for @fidus/ui SSR bug',
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
