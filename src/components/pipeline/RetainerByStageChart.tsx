'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { STAGE_COLORS, STAGES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { KpiSummary } from '@/types'

interface Props {
  summaries: KpiSummary[]
}

export function RetainerByStageChart({ summaries }: Props) {
  const data = STAGES.map(stage => {
    const s = summaries.find(x => x.stage === stage) ?? { count: 0, totalRetainer: 0 }
    return {
      stage,
      value: s.totalRetainer,
      count: s.count,
      fill: STAGE_COLORS[stage].chart,
    }
  })

  if (data.every(d => d.value === 0)) {
    return (
      <div className="h-[120px] flex items-center justify-center text-[12px] text-[#9ca3af]">
        No retainer data
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0] }[] }) => {
    if (!active || !payload?.[0]) return null
    const d = payload[0].payload
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-md px-3 py-2 shadow-sm text-[12px]">
        <p className="font-medium text-[#111827]">{d.stage}</p>
        <p className="text-[#6b7280]">{formatCurrency(d.value)} · {d.count} FMP{d.count !== 1 ? 's' : ''}</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 36 + 20, 100)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 100, bottom: 0, left: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="stage"
          width={88}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={24}>
          {data.map((entry) => (
            <Cell key={entry.stage} fill={entry.fill} fillOpacity={1} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(val: any) => formatCurrency(Number(val))}
            style={{ fontSize: 11, fill: '#6b7280' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
