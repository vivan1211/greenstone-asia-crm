'use client'

import { useState } from 'react'
import { Button, Input, Textarea } from '@/components/ui'
import { logContactAction, updateNextStepAction } from '@/lib/actions'
import { todayISO, addDays } from '@/lib/utils'
import type { Fmp } from '@/types'

interface Props {
  fmp: Fmp
  loggedByDefault?: string
  onClose: () => void
  onSuccess: () => void
}

export function LogContactModal({ fmp, loggedByDefault = '', onClose, onSuccess }: Props) {
  const [date, setDate] = useState(todayISO())
  const [summary, setSummary] = useState('')
  const [loggedBy, setLoggedBy] = useState(loggedByDefault)
  const [nextStep, setNextStep] = useState(fmp.next_step ?? '')
  const [nextContactDate, setNextContactDate] = useState(addDays(todayISO(), 30))
  const [updateNextStep, setUpdateNextStep] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nextStepLoading, setNextStepLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSaveNextStep = async () => {
    setError('')
    setNextStepLoading(true)
    try {
      await updateNextStepAction(fmp.id, nextStep, nextContactDate || null)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update next step')
      setNextStepLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!summary.trim()) { setError('Add meeting notes to log a contact.'); return }
    setError('')
    setLoading(true)
    try {
      await logContactAction(fmp.id, {
        date,
        summary: summary.trim(),
        logged_by: loggedBy,
        next_step: updateNextStep ? nextStep : undefined,
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log contact')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-xl w-full max-w-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <div>
            <h2 className="text-[14px] font-semibold text-[#111827]">Log Contact</h2>
            <p className="text-[11px] text-[#9ca3af] mt-0.5">{fmp.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151] transition-all duration-150"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
            <Input
              label="Logged By"
              value={loggedBy}
              onChange={e => setLoggedBy(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <Textarea
            label="Meeting Notes"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            rows={4}
            placeholder="Summarize the discussion, outcomes, and any commitments made..."
          />

          {/* Next Step section */}
          <div className="flex flex-col gap-2 rounded-lg border border-[#e5e7eb] p-3 bg-[#f9fafb]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={updateNextStep}
                onChange={e => setUpdateNextStep(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#d1d5db] text-[#2563eb] cursor-pointer"
              />
              <span className="text-[12px] font-medium text-[#374151]">Update next step</span>
            </label>
            {updateNextStep && (
              <>
                <Textarea
                  value={nextStep}
                  onChange={e => setNextStep(e.target.value)}
                  rows={2}
                  placeholder="What's the next action item?"
                />
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      label="Next Contact Date"
                      type="date"
                      value={nextContactDate}
                      onChange={e => setNextContactDate(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    loading={nextStepLoading}
                    onClick={handleSaveNextStep}
                  >
                    Save Next Step
                  </Button>
                </div>
              </>
            )}
          </div>

          {error && (
            <p className="text-[12px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-[#e5e7eb] mt-1">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Log Contact
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
