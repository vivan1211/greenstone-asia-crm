'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, MarketPill, InitialsAvatar, TabBar } from '@/components/ui'
import { ContactTimeline } from '@/components/fmp/ContactTimeline'
import { LogContactModal } from '@/components/modals/LogContactModal'
import { getTimeline } from '@/lib/fmp-api'
import { updateFmpAction } from '@/lib/actions'
import { STAGES, SUB_STATUSES, STAGE_COLORS, SUB_STATUS_COLORS } from '@/lib/constants'
import { useAuth } from '@/hooks/use-auth'
import type { Fmp, TimelineEntry, Stage, SubStatus } from '@/types'

interface Props {
  fmp: Fmp | null
  onClose: () => void
  onUpdate: (updated?: Fmp) => void
}

export function FmpSlidePanel({ fmp, onClose, onUpdate }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [tab, setTab] = useState('Details')
  const [local, setLocal] = useState<Fmp | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [logModalOpen, setLogModalOpen] = useState(false)

  useEffect(() => {
    if (!fmp) return
    setLocal({ ...fmp })
    setDirty(false)
    setSaveError('')
    setTab('Details')
    setTimelineLoading(true)
    getTimeline(fmp.id).then(t => { setTimeline(t); setTimelineLoading(false) })
  }, [fmp?.id])

  const set = (field: keyof Fmp) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setLocal(prev => prev ? { ...prev, [field]: e.target.value || null } : null)
    setDirty(true)
  }

  const handleSave = async () => {
    if (!local || !dirty) return
    setSaving(true)
    setSaveError('')
    try {
      await updateFmpAction(local.id, {
        stage: local.stage,
        sub_status: local.sub_status,
        next_step: local.next_step,
        next_contact_date: local.next_contact_date,
        relationship_manager: local.relationship_manager,
        retainer_amount: local.retainer_amount,
        fund_registration_fee: local.fund_registration_fee,
        fmp_contact_name: local.fmp_contact_name,
        fmp_contact_role: local.fmp_contact_role,
        fmp_contact_email: local.fmp_contact_email,
        contract_start_date: local.contract_start_date,
      })
      setDirty(false)
      onUpdate(local)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save')
    }
    setSaving(false)
  }

  const isOpen = !!fmp

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-30" onClick={onClose} />
      )}

      <div
        className={[
          'fixed top-0 right-0 h-full bg-white border-l border-[#e5e7eb] z-40 flex flex-col shadow-2xl',
          'transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        style={{ width: 520 }}
      >
        {local && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#f3f4f6] flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <InitialsAvatar name={local.name} market={local.market} size="md" />
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-[#111827] truncate leading-tight">{local.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MarketPill market={local.market} />
                    {local.relationship_manager && (
                      <span className="text-[11px] text-[#9ca3af]">{local.relationship_manager}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button size="sm" variant="primary" onClick={() => setLogModalOpen(true)}>
                  Log Contact
                </Button>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151] transition-all duration-150"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <TabBar tabs={['Details', 'Timeline']} active={tab} onChange={setTab} />

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {tab === 'Details' && (
                <div className="px-5 py-5 flex flex-col gap-5">

                  {/* Stage + Sub-Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Stage</FieldLabel>
                      <select
                        value={local.stage ?? ''}
                        onChange={e => {
                          setLocal(prev => prev ? { ...prev, stage: e.target.value as Stage } : null)
                          setDirty(true)
                        }}
                        className="w-full rounded-md border text-[12px] font-semibold px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#1a4731] cursor-pointer transition-colors"
                        style={local.stage ? {
                          backgroundColor: STAGE_COLORS[local.stage as Stage]?.bg,
                          color: STAGE_COLORS[local.stage as Stage]?.text,
                          borderColor: STAGE_COLORS[local.stage as Stage]?.border,
                        } : { borderColor: '#e5e7eb' }}
                      >
                        <option value="">— Select stage</option>
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Sub-Status</FieldLabel>
                      <select
                        value={local.sub_status ?? ''}
                        onChange={e => {
                          setLocal(prev => prev ? { ...prev, sub_status: (e.target.value as SubStatus) || null } : null)
                          setDirty(true)
                        }}
                        className="w-full rounded-md border text-[12px] font-semibold px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#1a4731] cursor-pointer transition-colors"
                        style={local.sub_status ? {
                          backgroundColor: SUB_STATUS_COLORS[local.sub_status as SubStatus]?.bg,
                          color: SUB_STATUS_COLORS[local.sub_status as SubStatus]?.text,
                          borderColor: SUB_STATUS_COLORS[local.sub_status as SubStatus]?.border,
                        } : { borderColor: '#e5e7eb' }}
                      >
                        <option value="">— Select status</option>
                        {SUB_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Next Step */}
                  <div>
                    <FieldLabel>Next Step</FieldLabel>
                    <textarea
                      value={local.next_step ?? ''}
                      onChange={set('next_step')}
                      rows={3}
                      placeholder="What's the next action item?"
                      className="w-full rounded-md border border-[#fde68a] bg-[#fffbeb] text-[13px] text-[#374151] px-3 py-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-[#d97706] placeholder:text-[#d1d5db]"
                    />
                  </div>

                  {/* Next Contact Date */}
                  <EditField
                    label="Next Contact Date"
                    type="date"
                    value={local.next_contact_date ?? ''}
                    onChange={set('next_contact_date')}
                  />

                  <SectionDivider label="Deal Info" />

                  {/* RM + Financials */}
                  <div className="grid grid-cols-2 gap-4">
                    <EditField
                      label="Relationship Manager"
                      value={local.relationship_manager ?? ''}
                      onChange={set('relationship_manager')}
                      placeholder="e.g. James Chen"
                    />
                    <EditField
                      label="Retainer (USD)"
                      type="number"
                      value={local.retainer_amount?.toString() ?? ''}
                      onChange={e => {
                        setLocal(prev => prev ? { ...prev, retainer_amount: e.target.value ? parseFloat(e.target.value) : null } : null)
                        setDirty(true)
                      }}
                      placeholder="e.g. 50000"
                    />
                    <EditField
                      label="Fund Reg. Fee (USD)"
                      type="number"
                      value={local.fund_registration_fee?.toString() ?? ''}
                      onChange={e => {
                        setLocal(prev => prev ? { ...prev, fund_registration_fee: e.target.value ? parseFloat(e.target.value) : null } : null)
                        setDirty(true)
                      }}
                      placeholder="e.g. 10000"
                    />
                    <EditField
                      label="Contract Start Date"
                      type="date"
                      value={local.contract_start_date ?? ''}
                      onChange={set('contract_start_date')}
                    />
                  </div>

                  <SectionDivider label="Contact" />

                  {/* Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <EditField
                      label="Contact Name"
                      value={local.fmp_contact_name ?? ''}
                      onChange={set('fmp_contact_name')}
                      placeholder="e.g. Sarah Kim"
                    />
                    <EditField
                      label="Role"
                      value={local.fmp_contact_role ?? ''}
                      onChange={set('fmp_contact_role')}
                      placeholder="e.g. MD"
                    />
                  </div>
                  <EditField
                    label="Email"
                    type="email"
                    value={local.fmp_contact_email ?? ''}
                    onChange={set('fmp_contact_email')}
                    placeholder="e.g. sarah@firm.com"
                  />

                  <button
                    onClick={() => router.push(`/fmp/${local.id}`)}
                    className="flex items-center gap-1.5 text-[12px] text-[#6b7280] hover:text-[#2563eb] transition-colors duration-150 self-start mt-1"
                  >
                    View full profile
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              )}

              {tab === 'Timeline' && (
                <div className="px-5 py-5">
                  <ContactTimeline entries={timeline} loading={timelineLoading} />
                </div>
              )}
            </div>

            {/* Save bar */}
            {dirty && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#e5e7eb] bg-[#f9fafb] flex-shrink-0">
                {saveError ? (
                  <p className="text-[12px] text-[#dc2626]">{saveError}</p>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    <p className="text-[11px] text-[#6b7280]">Unsaved changes</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => { if (fmp) { setLocal({ ...fmp }); setDirty(false); setSaveError('') } }}
                  >
                    Discard
                  </Button>
                  <Button size="sm" variant="primary" loading={saving} onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {logModalOpen && fmp && (
        <LogContactModal
          fmp={fmp}
          loggedByDefault={fmp.relationship_manager || user?.email?.split('@')[0] || ''}
          onClose={() => setLogModalOpen(false)}
          onSuccess={() => {
            getTimeline(fmp.id).then(setTimeline)
            onUpdate()
          }}
        />
      )}
    </>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">{children}</p>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">{label}</span>
      <div className="flex-1 h-px bg-[#f3f4f6]" />
    </div>
  )
}

function EditField({
  label, value, onChange, type = 'text', placeholder,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#e5e7eb] text-[13px] text-[#374151] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1a4731] placeholder:text-[#d1d5db] bg-white"
      />
    </div>
  )
}
