import './globals.css';

export const metadata = {
  title: 'Fidus Memory',
  description: 'Privacy-first conversational learning agent',
  icons: {
    icon: '/favicon.svg',
  },
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
