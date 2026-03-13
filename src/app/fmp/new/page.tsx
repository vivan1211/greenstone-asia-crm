'use client'

import Link from 'next/link'
import { FmpForm } from '@/components/fmp/FmpForm'
import { createFmpAction } from '@/lib/actions'
import type { FmpFormData } from '@/types'

export default function NewFmpPage() {
  const handleSubmit = async (data: FmpFormData) => {
    await createFmpAction(data)
  }

  return (
    <div className="px-8 py-7 max-w-3xl">
      <div className="flex items-center gap-2 text-[12px] text-[#9ca3af] mb-6">
        <Link href="/" className="hover:text-[#374151] transition-colors duration-150">
          Pipeline
        </Link>
        <span>/</span>
        <span className="text-[#374151]">New FMP</span>
      </div>

      <h1 className="text-[18px] font-semibold text-[#111827] mb-6">Add FMP</h1>

      <div className="bg-white border border-[#e5e7eb] rounded-lg p-7">
        <FmpForm onSubmit={handleSubmit} submitLabel="Create FMP" />
      </div>
    </div>
  )
}
