'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { useRouter, useSearchParams } from 'next/navigation'
import { STAGE_COLORS, STAGES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { KpiSummary, Stage } from '@/types'

interface Props {
  summaries: KpiSummary[]
}

export function PipelineSummaryChart({ summaries }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeStage = searchParams.get('stage') as Stage | null

  const data = STAGES.map(stage => {
    const s = summaries.find(x => x.stage === stage) ?? { count: 0, totalRetainer: 0, completeCount: 0, inProcessCount: 0 }
    return {
      stage,
      count: s.count,
      retainer: s.totalRetainer, // kept for tooltip only, not used as bar dataKey
      completeCount: s.completeCount,
      inProcessCount: s.inProcessCount,
      fill: STAGE_COLORS[stage].chart,
      bg: STAGE_COLORS[stage].bg,
      border: STAGE_COLORS[stage].border,
    }
  })

  // Chart data with only numeric key used by Bar (prevents Recharts from using retainer for Y-domain)
  const chartData = data.map(({ stage, count }) => ({ stage, count }))
  const maxCount = Math.max(...chartData.map(d => d.count), 1)
  const yDomain: [number, number] = [0, maxCount + 1]

  const handleClick = (stage: Stage) => {
    const params = new URLSearchParams(searchParams.toString())
    if (activeStage === stage) {
      params.delete('stage')
    } else {
      params.set('stage', stage)
    }
    router.push(`/?${params.toString()}`)
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0] }[] }) => {
    if (!active || !payload?.[0]) return null
    const d = payload[0].payload
    const full = data.find(x => x.stage === d.stage)
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-md px-3 py-2.5 shadow-sm text-[12px] min-w-[160px]">
        <p className="font-semibold text-[#111827] mb-2">{d.stage}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#6b7280]">Total</span>
            <span className="font-medium text-[#374151]">{d.count} FMP{d.count !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span className="text-[#6b7280]">Complete</span>
            </div>
            <span className="font-medium text-[#374151]">{full?.completeCount ?? 0}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
              <span className="text-[#6b7280]">In Process</span>
            </div>
            <span className="font-medium text-[#374151]">{full?.inProcessCount ?? 0}</span>
          </div>
          {(full?.retainer ?? 0) > 0 && (
            <div className="flex items-center justify-between gap-4 pt-1 mt-1 border-t border-[#f3f4f6]">
              <span className="text-[#6b7280]">Retainer</span>
              <span className="font-medium text-[#374151]">{formatCurrency(full?.retainer ?? 0)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CountLabel = ({ x, y, width, value, index }: any) => {
    const d = data[index]
    if (!d || d.count === 0) return null
    return (
      <text
        x={x + width / 2}
        y={y - 6}
        textAnchor="middle"
        fontSize={11}
        fill="#6b7280"
        fontFamily="inherit"
      >
        {value}
      </text>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {data.map(d => (
          <button
            key={d.stage}
            onClick={() => handleClick(d.stage as Stage)}
            className="flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-1 border transition-all duration-150 hover:opacity-80"
            style={
              activeStage === d.stage
                ? { backgroundColor: d.bg, borderColor: d.border, color: d.fill }
                : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#6b7280' }
            }
          >
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
            {d.stage}
          </button>
        ))}
        {activeStage && (
          <button
            onClick={() => { const p = new URLSearchParams(searchParams.toString()); p.delete('stage'); router.push(`/?${p.toString()}`) }}
            className="text-[11px] text-[#9ca3af] hover:text-[#6b7280]"
          >
            Clear
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 20, right: 8, bottom: 0, left: 8 }} barCategoryGap="28%">
          <XAxis
            dataKey="stage"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={yDomain} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56} onClick={(d: any) => handleClick(d.stage as Stage)} style={{ cursor: 'pointer' }}>
            {data.map((entry) => (
              <Cell
                key={entry.stage}
                fill={entry.fill}
                fillOpacity={activeStage && activeStage !== entry.stage ? 0.3 : 1}
              />
            ))}
            <LabelList content={<CountLabel />} dataKey="count" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
