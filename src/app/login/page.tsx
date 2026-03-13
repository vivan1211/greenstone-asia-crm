'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center">
            <span className="text-white text-[13px] font-bold">G</span>
          </div>
          <span className="text-[16px] font-semibold text-[#111827]">Greenstone CRM</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-7 shadow-sm">
          <h1 className="text-[15px] font-semibold text-[#111827] mb-1">Sign in</h1>
          <p className="text-[12px] text-[#9ca3af] mb-6">Access your FMP pipeline</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@greenstoneep.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="text-[12px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full justify-center mt-1 h-9"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#9ca3af] mt-5">
          Greenstone Equity Partners · APAC FMP Pipeline
        </p>
      </div>
    </div>
  )
}
