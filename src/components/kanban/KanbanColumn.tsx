'use client'

import { Droppable } from '@hello-pangea/dnd'
import { KanbanCard } from './KanbanCard'
import { STAGE_COLORS } from '@/lib/constants'
import type { Fmp, Stage } from '@/types'

interface Props {
  stage: Stage
  fmps: Fmp[]
  onCardClick: (fmp: Fmp) => void
}

export function KanbanColumn({ stage, fmps = [], onCardClick }: Props) {
  const { bg, text, border } = STAGE_COLORS[stage]

  return (
    <div className="flex flex-col" style={{ width: 240, flexShrink: 0 }}>
      {/* Column header */}
      <div
        className="flex items-center justify-between mb-2 px-2.5 py-2 rounded-t-lg"
        style={{ backgroundColor: bg, borderBottom: `2px solid ${border}` }}
      >
        <span className="text-[11px] font-semibold tracking-wide" style={{ color: text }}>
          {stage.toUpperCase()}
        </span>
        <span
          className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: border + '33', color: text }}
        >
          {fmps.length}
        </span>
      </div>

      {/* Droppable column */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={[
              'flex flex-col gap-2 flex-1 rounded-b-lg min-h-[200px] p-1.5 transition-colors duration-150',
              snapshot.isDraggingOver ? 'bg-[#f0f9ff]' : 'bg-[#f9fafb]',
            ].join(' ')}
          >
            {fmps.map((fmp, i) => (
              <KanbanCard key={fmp.id} fmp={fmp} index={i} onClick={onCardClick} />
            ))}
            {provided.placeholder}
            {fmps.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-16 text-[11px] text-[#d1d5db]">
                Drop here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
