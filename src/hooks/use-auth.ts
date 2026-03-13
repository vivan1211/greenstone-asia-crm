'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    async function load() {
      const { data } = await supabase.auth.getUser() as { data: { user: User | null } }
      setUser(data.user)
      setLoading(false)
    }
    load()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: unknown, session: { user?: User } | null) => {
        setUser(session?.user ?? null)
      }
    )

    return () => authListener.subscription.unsubscribe()
  }, [])

  return { user, loading }
}
