'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = getSupabaseBrowserClient()

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Insert into allowed_users with approved = false (pending admin approval)
    if (data.user) {
      await supabase.from('allowed_users').insert({ email, approved: false })
    }

    setLoading(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center">
            <span className="text-white text-[13px] font-bold">G</span>
          </div>
          <span className="text-[16px] font-semibold text-[#111827]">Greenstone Asia CRM</span>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-7 shadow-sm">
          {done ? (
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[15px] font-semibold text-[#111827] mb-1">Request submitted</h2>
              <p className="text-[12px] text-[#6b7280] mb-5">
                Your account is pending approval. You'll be able to sign in once an admin approves your access.
              </p>
              <Link href="/login" className="text-[12px] text-[#111827] font-medium hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-[15px] font-semibold text-[#111827] mb-1">Request access</h1>
              <p className="text-[12px] text-[#9ca3af] mb-6">Create an account — an admin will approve you</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  autoComplete="new-password"
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
                  Request access
                </Button>
              </form>

              <p className="text-center text-[12px] text-[#9ca3af] mt-5">
                Already have an account?{' '}
                <Link href="/login" className="text-[#111827] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-[#9ca3af] mt-5">
          Greenstone Equity Partners · APAC FMP Pipeline
        </p>
      </div>
    </div>
  )
}
