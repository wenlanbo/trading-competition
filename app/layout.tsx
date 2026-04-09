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
          <footer className="border-t border-white/5 py-8 text-center">
            <p className="mb-2 text-xs text-white/30">
              By participating you agree to our
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/terms"
                className="inline-flex items-center gap-1.5 rounded-full border border-brand2/20 bg-brand2/5 px-4 py-1.5 text-xs font-medium text-brand3 transition-all hover:border-brand2/40 hover:bg-brand2/10 hover:text-brand"
              >
                Competition T&amp;Cs
              </a>
              <a
                href="https://docs.42.space/legal/terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-brand2/20 bg-brand2/5 px-4 py-1.5 text-xs font-medium text-brand3 transition-all hover:border-brand2/40 hover:bg-brand2/10 hover:text-brand"
              >
                Terms of Use
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </footer>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
