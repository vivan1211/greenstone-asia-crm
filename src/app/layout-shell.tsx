'use client'

import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { Sidebar } from '@/components/nav'

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Suspense>
        <Sidebar />
      </Suspense>
      <main style={{ marginLeft: 220 }} className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
