'use client'

import { Draggable } from '@hello-pangea/dnd'
import { InitialsAvatar, MarketPill, OverdueBadge } from '@/components/ui'
import { formatCurrency, isOverdue } from '@/lib/utils'
import { SUB_STATUS_COLORS } from '@/lib/constants'
import type { Fmp } from '@/types'

interface Props {
  fmp: Fmp
  index: number
  onClick: (fmp: Fmp) => void
}

export function KanbanCard({ fmp, index, onClick }: Props) {
  const overdue = isOverdue(fmp.next_contact_date)

  return (
    <Draggable draggableId={fmp.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(fmp)}
          className={[
            'bg-white border border-[#e5e7eb] rounded-lg p-3 cursor-pointer',
            'transition-all duration-150',
            snapshot.isDragging
              ? 'shadow-lg border-[#d1d5db] rotate-1'
              : 'hover:border-[#d1d5db] hover:shadow-sm',
          ].join(' ')}
        >
          {/* Top row */}
          <div className="flex items-start gap-2.5 mb-2.5">
            <InitialsAvatar name={fmp.name} market={fmp.market} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#111827] leading-snug truncate">{fmp.name}</p>
              {fmp.relationship_manager && (
                <p className="text-[11px] text-[#9ca3af] mt-0.5 truncate">{fmp.relationship_manager}</p>
              )}
            </div>
            {overdue && <OverdueBadge />}
          </div>

          {/* Market pill + sub-status */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <MarketPill market={fmp.market} />
            {fmp.sub_status && (() => {
              const c = SUB_STATUS_COLORS[fmp.sub_status]
              return (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                >
                  {fmp.sub_status}
                </span>
              )
            })()}
          </div>

          {/* Footer */}
          {fmp.retainer_amount != null && (
            <div className="flex items-center justify-end pt-2 border-t border-[#f3f4f6]">
              <span className="text-[11px] font-semibold text-[#374151] tabular-nums">
                {formatCurrency(fmp.retainer_amount)}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
