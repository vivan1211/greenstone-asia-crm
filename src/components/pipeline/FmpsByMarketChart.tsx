'use client'

import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { MARKET_CHART_COLORS, MARKETS } from '@/lib/constants'
import type { Fmp } from '@/types'

interface Props {
  fmps: Fmp[]
}

export function FmpsByMarketChart({ fmps }: Props) {
  const data = MARKETS.map(market => ({
    market,
    count: fmps.filter(f => f.market === market).length,
    color: MARKET_CHART_COLORS[market],
  })).filter(d => d.count > 0)

  const total = data.reduce((s, d) => s + d.count, 0)

  if (total === 0) {
    return (
      <div className="h-[160px] flex items-center justify-center text-[12px] text-[#9ca3af]">
        No market data
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0] }[] }) => {
    if (!active || !payload?.[0]) return null
    const d = payload[0].payload
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-md px-3 py-2 shadow-sm text-[12px]">
        <p className="font-medium text-[#111827]">{d.market}</p>
        <p className="text-[#6b7280]">{d.count} FMP{d.count !== 1 ? 's' : ''} · {Math.round(d.count / total * 100)}%</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Donut chart */}
      <div className="relative flex-shrink-0" style={{ width: 200, height: 200 }}>
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            cx={100}
            cy={100}
            innerRadius={62}
            outerRadius={90}
            paddingAngle={2}
            dataKey="count"
            stroke="none"
          >
            {data.map(entry => (
              <Cell key={entry.market} fill={entry.color} fillOpacity={1} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
        {/* Center count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[28px] font-semibold text-[#111827] leading-none">{total}</span>
          <span className="text-[11px] text-[#9ca3af] mt-1">FMPs</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {data.map(d => (
          <div key={d.market} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[11px] text-[#6b7280]">{d.market}</span>
            <span className="text-[11px] font-medium text-[#374151] tabular-nums">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
