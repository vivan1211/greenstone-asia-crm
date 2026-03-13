'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { updateFmpAction } from '@/lib/actions'
import type { Fmp } from '@/types'

interface Props {
  fmp: Fmp
  onUpdate?: (updated: Partial<Fmp>) => void
}

function InlineField({ label, value, onSave, type = 'text' }: {
  label: string
  value: string
  onSave: (val: string) => Promise<void>
  type?: string
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await onSave(val)
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => {
    setVal(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">{label}</p>
        <div className="flex items-center gap-1.5">
          <input
            type={type}
            value={val}
            onChange={e => setVal(e.target.value)}
            autoFocus
            className="flex-1 h-7 px-2 text-[13px] border border-[#1a4731] rounded focus:outline-none"
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
          />
          <button
            onClick={save}
            disabled={saving}
            className="h-7 px-2 text-[11px] font-medium bg-[#1a4731] text-white rounded disabled:opacity-50"
          >
            {saving ? '...' : '✓'}
          </button>
          <button
            onClick={cancel}
            className="h-7 px-2 text-[11px] text-[#6b7280] hover:text-[#374151]"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-0.5 group cursor-pointer"
      onClick={() => setEditing(true)}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">{label}</p>
      <p className="text-[13px] text-[#374151] group-hover:text-[#2563eb] transition-colors duration-150">
        {value || <span className="text-[#d1d5db]">—</span>}
      </p>
    </div>
  )
}

export function FmpContactCard({ fmp, onUpdate }: Props) {
  const save = async (field: keyof Fmp, value: string) => {
    await updateFmpAction(fmp.id, { [field]: value || null })
    onUpdate?.({ [field]: value || null })
  }

  return (
    <Card className="p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-3">FMP Contact</p>
      <div className="flex flex-col gap-3">
        <InlineField
          label="Name"
          value={fmp.fmp_contact_name ?? ''}
          onSave={v => save('fmp_contact_name', v)}
        />
        <InlineField
          label="Role"
          value={fmp.fmp_contact_role ?? ''}
          onSave={v => save('fmp_contact_role', v)}
        />
        <InlineField
          label="Email"
          value={fmp.fmp_contact_email ?? ''}
          onSave={v => save('fmp_contact_email', v)}
          type="email"
        />
      </div>
    </Card>
  )
}
