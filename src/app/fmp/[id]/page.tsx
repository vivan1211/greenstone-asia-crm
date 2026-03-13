'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StageBadge, MarketPill, Button, InitialsAvatar, SubStatusBadge } from '@/components/ui'
import { ContactTimeline } from '@/components/fmp/ContactTimeline'
import { FmpContactCard } from '@/components/fmp/FmpContactCard'
import { ContractTermsCard } from '@/components/fmp/ContractTermsCard'
import { ProfileMetaCard } from '@/components/fmp/ProfileMetaCard'
import { LogContactModal } from '@/components/modals/LogContactModal'
import { getFmpById, getTimeline } from '@/lib/fmp-api'
import { updateNextStepAction } from '@/lib/actions'
import { useAuth } from '@/hooks/use-auth'
import type { Fmp, TimelineEntry } from '@/types'

export default function FmpProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()

  const [fmp, setFmp] = useState<Fmp | null>(null)
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [editingNextStep, setEditingNextStep] = useState(false)
  const [nextStepVal, setNextStepVal] = useState('')
  const [savingNextStep, setSavingNextStep] = useState(false)

  const load = async () => {
    setLoading(true)
    const [f, t] = await Promise.all([getFmpById(id), getTimeline(id)])
    setFmp(f)
    setNextStepVal(f?.next_step ?? '')
    setTimeline(t)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const saveNextStep = async () => {
    if (!fmp) return
    setSavingNextStep(true)
    await updateNextStepAction(fmp.id, nextStepVal)
    setFmp(prev => prev ? { ...prev, next_step: nextStepVal || null } : prev)
    setSavingNextStep(false)
    setEditingNextStep(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-5 h-5 border-2 border-[#e5e7eb] border-t-[#1a4731] rounded-full" />
      </div>
    )
  }

  if (!fmp) {
    return (
      <div className="px-8 py-7">
        <p className="text-[13px] text-[#9ca3af]">FMP not found.</p>
        <Link href="/" className="text-[13px] text-[#1a4731] mt-2 block">← Back to pipeline</Link>
      </div>
    )
  }

  const loggedByDefault = fmp.relationship_manager || user?.email?.split('@')[0] || ''

  return (
    <div className="px-8 py-7 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#9ca3af] mb-5">
        <Link href="/" className="hover:text-[#374151] transition-colors duration-150">Pipeline</Link>
        <span>/</span>
        <span className="text-[#374151]">{fmp.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={fmp.name} market={fmp.market} size="lg" />
          <div>
            <h1 className="text-[20px] font-semibold text-[#111827]">{fmp.name}</h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StageBadge stage={fmp.stage} />
              {fmp.sub_status && <SubStatusBadge subStatus={fmp.sub_status} />}
              <MarketPill market={fmp.market} />
              {fmp.relationship_manager && (
                <span className="text-[12px] text-[#9ca3af]">
                  RM: {fmp.relationship_manager}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={() => setLogModalOpen(true)}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Log Contact
          </Button>
          <Button variant="secondary" size="sm" onClick={() => router.push(`/fmp/${fmp.id}/edit`)}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
        </div>
      </div>

      {/* Next Step — inline editable */}
      <div className="mb-6">
        {editingNextStep ? (
          <div className="flex items-start gap-2.5 px-3.5 py-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg">
            <div className="flex-shrink-0 mt-1">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#b45309]">Next Step</p>
              <textarea
                value={nextStepVal}
                onChange={e => setNextStepVal(e.target.value)}
                autoFocus
                rows={2}
                className="w-full px-2.5 py-1.5 bg-white border border-[#fde68a] rounded text-[13px] text-[#92400e] focus:outline-none focus:border-[#d97706] resize-none"
                placeholder="What's the next action item?"
                onKeyDown={e => { if (e.key === 'Escape') { setNextStepVal(fmp.next_step ?? ''); setEditingNextStep(false) } }}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={saveNextStep}
                  disabled={savingNextStep}
                  className="h-7 px-3 text-[12px] font-medium bg-[#1a4731] text-white rounded disabled:opacity-50 cursor-pointer"
                >
                  {savingNextStep ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setNextStepVal(fmp.next_step ?? ''); setEditingNextStep(false) }}
                  className="h-7 px-3 text-[12px] text-[#6b7280] hover:text-[#374151] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg cursor-pointer group hover:border-[#f59e0b] transition-colors duration-150"
            onClick={() => setEditingNextStep(true)}
            title="Click to edit"
          >
            <div className="flex-shrink-0 mt-0.5">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#b45309] mb-0.5">Next Step</p>
                <span className="text-[10px] text-[#d97706] opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
                  Click to edit
                </span>
              </div>
              <p className="text-[13px] text-[#92400e]">
                {fmp.next_step || <span className="text-[#d97706] italic">No next step set — click to add one</span>}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left: Timeline */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[13px] font-semibold text-[#111827]">Contact History</h2>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">{timeline.length} touchpoints</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setLogModalOpen(true)}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Log Contact
            </Button>
          </div>
          <ContactTimeline entries={timeline} />
        </div>

        {/* Right: Cards */}
        <div className="flex flex-col gap-3">
          <FmpContactCard fmp={fmp} onUpdate={updates => setFmp(prev => prev ? { ...prev, ...updates } : prev)} />
          <ContractTermsCard fmp={fmp} />
          <ProfileMetaCard fmp={fmp} timeline={timeline} />
        </div>
      </div>

      {/* Log Contact Modal */}
      {logModalOpen && (
        <LogContactModal
          fmp={fmp}
          loggedByDefault={loggedByDefault}
          onClose={() => setLogModalOpen(false)}
          onSuccess={load}
        />
      )}
    </div>
  )
}
