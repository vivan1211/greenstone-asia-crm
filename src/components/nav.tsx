'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

function NavItem({ href, label, icon, active }: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={[
        'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150',
        active
          ? 'bg-[#f0fdf4] text-[#1a4731] font-semibold'
          : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#374151]',
      ].join(' ')}
    >
      <span className="flex-shrink-0 opacity-70">{icon}</span>
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <div
      className="fixed top-0 left-0 h-full bg-white border-r border-[#e5e7eb] flex flex-col"
      style={{ width: 220 }}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1a4731] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">G</span>
          </div>
          <span className="text-[13px] font-semibold text-[#111827]">Greenstone CRM</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="px-2 py-3 flex flex-col gap-0.5">
        <NavItem
          href="/"
          label="Pipeline"
          active={pathname === '/'}
          icon={
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
        <NavItem
          href="/kanban"
          label="Kanban"
          active={pathname === '/kanban'}
          icon={
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          }
        />
        <NavItem
          href="/fmp/new"
          label="+ Add FMP"
          active={pathname === '/fmp/new'}
          icon={
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        />
      </div>

      {/* Bottom: User */}
      <div className="mt-auto px-3 py-3 border-t border-[#e5e7eb]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-semibold text-[#6b7280]">
                {displayName[0]?.toUpperCase()}
              </span>
            </div>
            <span className="text-[12px] text-[#374151] truncate">{displayName}</span>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-[#9ca3af] hover:text-[#6b7280] transition-colors duration-150 flex-shrink-0"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

