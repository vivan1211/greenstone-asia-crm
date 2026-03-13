import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { LayoutShell } from './layout-shell'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Greenstone CRM',
  description: 'Fund Manager Placement CRM for Greenstone Equity Partners',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}
