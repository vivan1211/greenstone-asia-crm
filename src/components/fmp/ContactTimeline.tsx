'use client'

import { formatDate } from '@/lib/utils'
import type { TimelineEntry } from '@/types'

interface Props {
  entries: TimelineEntry[]
  loading?: boolean
}

export function ContactTimeline({ entries, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-4 h-4 border-2 border-[#e5e7eb] border-t-[#6b7280] rounded-full" />
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-[12px] text-[#9ca3af]">No contact history yet.</p>
        <p className="text-[11px] text-[#d1d5db] mt-1">Log a contact to start tracking touchpoints.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {entries.map((entry, i) => (
        <div key={entry.id} className="flex gap-3">
          {/* Timeline line */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: '#16a34a' }}
            />
            {i < entries.length - 1 && (
              <div className="w-px flex-1 bg-[#e5e7eb] mt-1" style={{ minHeight: 24 }} />
            )}
          </div>

          {/* Content */}
          <div className={['pb-5', i === entries.length - 1 ? '' : ''].join(' ')}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] text-[#9ca3af] tabular-nums">{formatDate(entry.date)}</span>
              {entry.logged_by && (
                <>
                  <span className="text-[#e5e7eb]">·</span>
                  <span className="text-[11px] text-[#9ca3af]">{entry.logged_by}</span>
                </>
              )}
            </div>
            <p className="text-[13px] text-[#374151] leading-relaxed">{entry.summary}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
