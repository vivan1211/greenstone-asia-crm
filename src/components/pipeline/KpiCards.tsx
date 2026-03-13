'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { STAGE_COLORS, STAGES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { KpiSummary, Stage } from '@/types'

interface KpiCardsProps {
  summaries: KpiSummary[]
}

export function KpiCards({ summaries }: KpiCardsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeStage = searchParams.get('stage') as Stage | null

  const total = {
    count: summaries.reduce((s, k) => s + k.count, 0),
    totalRetainer: summaries.reduce((s, k) => s + k.totalRetainer, 0),
  }

  const handleClick = (stage: Stage | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (stage && activeStage !== stage) {
      params.set('stage', stage)
    } else {
      params.delete('stage')
    }
    router.push(`/?${params.toString()}`)
  }

  const cards = STAGES.map(stage => {
    const summary = summaries.find(s => s.stage === stage)
    return { stage, count: summary?.count ?? 0, totalRetainer: summary?.totalRetainer ?? 0 }
  })

  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map(({ stage, count, totalRetainer }) => {
        const { bg, text, border } = STAGE_COLORS[stage]
        const isActive = activeStage === stage
        return (
          <button
            key={stage}
            onClick={() => handleClick(stage)}
            className={[
              'text-left p-4 rounded-lg border transition-all duration-150',
              isActive
                ? 'ring-2 ring-offset-1 shadow-sm'
                : 'bg-white border-[#e5e7eb] hover:border-[#d1d5db] hover:shadow-sm',
            ].join(' ')}
            style={isActive ? {
              backgroundColor: bg,
              borderColor: border,
            } : {}}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-2"
              style={{ color: isActive ? text : '#9ca3af' }}
            >
              {stage}
            </p>
            <p
              className="text-[22px] font-semibold tabular-nums leading-none mb-1"
              style={{ color: isActive ? text : '#111827' }}
            >
              {count}
            </p>
            <p
              className="text-[12px] tabular-nums"
              style={{ color: isActive ? text : '#6b7280' }}
            >
              {formatCurrency(totalRetainer)}
            </p>
          </button>
        )
      })}
      {/* Total card */}
      <button
        onClick={() => handleClick(null)}
        className={[
          'text-left p-4 rounded-lg border transition-all duration-150',
          !activeStage
            ? 'bg-[#111827] border-[#111827]'
            : 'bg-white border-[#e5e7eb] hover:border-[#d1d5db] hover:shadow-sm',
        ].join(' ')}
      >
        <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${!activeStage ? 'text-gray-400' : 'text-[#9ca3af]'}`}>
          Total
        </p>
        <p className={`text-[22px] font-semibold tabular-nums leading-none mb-1 ${!activeStage ? 'text-white' : 'text-[#111827]'}`}>
          {total.count}
        </p>
        <p className={`text-[12px] tabular-nums ${!activeStage ? 'text-gray-400' : 'text-[#6b7280]'}`}>
          {formatCurrency(total.totalRetainer)}
        </p>
      </button>
    </div>
  )
}
