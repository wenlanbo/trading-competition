import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

import { ReactQueryProvider } from '@/lib/context/ReactQueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Trading leaderboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
