'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Select, Textarea, Button, TabBar } from '@/components/ui'
import { MARKETS, STAGES, SUB_STATUSES } from '@/lib/constants'
import { todayISO } from '@/lib/utils'
import type { FmpFormData, Fmp, SubStatus } from '@/types'

const TABS = ['Details', 'Contact', 'Contract', 'Next Step']

interface Props {
  initial?: Fmp
  onSubmit: (data: FmpFormData) => Promise<void>
  submitLabel?: string
}

const empty: FmpFormData = {
  name: '',
  relationship_manager: '',
  market: '',
  stage: '',
  sub_status: '',
  next_step: '',
  next_contact_date: '',
  fmp_contact_name: '',
  fmp_contact_email: '',
  fmp_contact_role: '',
  retainer_amount: '',
  fund_registration_fee: '',
  contract_status: '',
  contract_start_date: '',
  date_added: todayISO(),
}

function fmpToFormData(fmp: Fmp): FmpFormData {
  return {
    name: fmp.name ?? '',
    relationship_manager: fmp.relationship_manager ?? '',
    market: fmp.market ?? '',
    stage: fmp.stage ?? '',
    sub_status: fmp.sub_status ?? '',
    next_step: fmp.next_step ?? '',
    next_contact_date: fmp.next_contact_date ?? '',
    fmp_contact_name: fmp.fmp_contact_name ?? '',
    fmp_contact_email: fmp.fmp_contact_email ?? '',
    fmp_contact_role: fmp.fmp_contact_role ?? '',
    retainer_amount: fmp.retainer_amount?.toString() ?? '',
    fund_registration_fee: fmp.fund_registration_fee?.toString() ?? '',
    contract_status: fmp.contract_status ?? '',
    contract_start_date: fmp.contract_start_date ?? '',
    date_added: fmp.date_added ?? todayISO(),
  }
}

export function FmpForm({ initial, onSubmit, submitLabel = 'Save FMP' }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FmpFormData>(initial ? fmpToFormData(initial) : empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('Details')

  const set = (field: keyof FmpFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('FMP name is required.'); return }
    setError('')
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0">
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="py-6 flex flex-col gap-4">
        {activeTab === 'Details' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Input
              label="FMP Name"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. BlackRock Asia"
              required
            />
            <Input
              label="Relationship Manager"
              value={form.relationship_manager}
              onChange={set('relationship_manager')}
              placeholder="e.g. James Chen"
            />
            <Select label="Market" value={form.market} onChange={set('market')} placeholder="Select market">
              {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
            <Select label="Stage" value={form.stage} onChange={set('stage')} placeholder="Select stage">
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select label="Sub-Status" value={form.sub_status} onChange={e => setForm(prev => ({ ...prev, sub_status: e.target.value as SubStatus | '' }))} placeholder="Select sub-status">
              {SUB_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Input
              label="Date Added"
              type="date"
              value={form.date_added}
              onChange={set('date_added')}
            />
            <Input
              label="Next Contact Date"
              type="date"
              value={form.next_contact_date}
              onChange={set('next_contact_date')}
            />
          </div>
        )}

        {activeTab === 'Contact' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Input
              label="Contact Name"
              value={form.fmp_contact_name}
              onChange={set('fmp_contact_name')}
              placeholder="e.g. Sarah Kim"
            />
            <Input
              label="Contact Role"
              value={form.fmp_contact_role}
              onChange={set('fmp_contact_role')}
              placeholder="e.g. Managing Director"
            />
            <Input
              label="Contact Email"
              type="email"
              value={form.fmp_contact_email}
              onChange={set('fmp_contact_email')}
              placeholder="e.g. sarah.kim@blackrock.com"
              className="col-span-2"
            />
          </div>
        )}

        {activeTab === 'Contract' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Input
              label="Retainer Amount (USD)"
              type="number"
              value={form.retainer_amount}
              onChange={set('retainer_amount')}
              placeholder="e.g. 50000"
            />
            <Input
              label="Fund Registration Fee (USD)"
              type="number"
              value={form.fund_registration_fee}
              onChange={set('fund_registration_fee')}
              placeholder="e.g. 10000"
            />
            <Input
              label="Contract Start Date"
              type="date"
              value={form.contract_start_date}
              onChange={set('contract_start_date')}
            />
          </div>
        )}

        {activeTab === 'Next Step' && (
          <Textarea
            label="Next Step"
            value={form.next_step}
            onChange={set('next_step')}
            rows={5}
            placeholder="e.g. Schedule follow-up call to discuss fund registration..."
          />
        )}
      </div>

      {error && (
        <p className="text-[12px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-[#e5e7eb]">
        <Button type="submit" variant="primary" loading={loading}>
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
