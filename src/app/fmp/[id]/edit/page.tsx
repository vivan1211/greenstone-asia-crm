'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FmpForm } from '@/components/fmp/FmpForm'
import { getFmpById } from '@/lib/fmp-api'
import { updateFmpAction } from '@/lib/actions'
import type { Fmp, FmpFormData } from '@/types'

export default function EditFmpPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [fmp, setFmp] = useState<Fmp | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFmpById(id).then(f => {
      setFmp(f)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (data: FmpFormData) => {
    await updateFmpAction(id, {
      name: data.name,
      relationship_manager: data.relationship_manager || null,
      market: data.market || null,
      stage: data.stage || null,
      next_step: data.next_step || null,
      next_contact_date: data.next_contact_date || null,
      fmp_contact_name: data.fmp_contact_name || null,
      fmp_contact_email: data.fmp_contact_email || null,
      fmp_contact_role: data.fmp_contact_role || null,
      retainer_amount: data.retainer_amount ? parseFloat(data.retainer_amount) : null,
      fund_registration_fee: data.fund_registration_fee ? parseFloat(data.fund_registration_fee) : null,
      contract_status: data.contract_status || null,
      contract_start_date: data.contract_start_date || null,
      date_added: data.date_added || null,
    })
    router.push(`/fmp/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-5 h-5 border-2 border-[#e5e7eb] border-t-[#111827] rounded-full" />
      </div>
    )
  }

  if (!fmp) {
    return (
      <div className="px-8 py-7">
        <p className="text-[13px] text-[#9ca3af]">FMP not found.</p>
        <Link href="/" className="text-[13px] text-[#2563eb] mt-2 block">← Back to pipeline</Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-7 max-w-3xl">
      <div className="flex items-center gap-2 text-[12px] text-[#9ca3af] mb-6">
        <Link href="/" className="hover:text-[#374151] transition-colors duration-150">Pipeline</Link>
        <span>/</span>
        <Link href={`/fmp/${id}`} className="hover:text-[#374151] transition-colors duration-150">{fmp.name}</Link>
        <span>/</span>
        <span className="text-[#374151]">Edit</span>
      </div>

      <h1 className="text-[18px] font-semibold text-[#111827] mb-6">Edit FMP</h1>

      <div className="bg-white border border-[#e5e7eb] rounded-lg p-7">
        <FmpForm initial={fmp} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  )
}
