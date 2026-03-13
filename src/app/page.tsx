'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PipelineSummaryChart } from '@/components/pipeline/PipelineSummaryChart'
import { PipelineTable } from '@/components/pipeline/PipelineTable'
import { RetainerByStageChart } from '@/components/pipeline/RetainerByStageChart'
import { FmpsByMarketChart } from '@/components/pipeline/FmpsByMarketChart'
import { getFmps, getKpiSummary } from '@/lib/fmp-api'
import { formatCurrency } from '@/lib/utils'
import { MARKETS, MARKET_COLORS, STAGES } from '@/lib/constants'
import type { Fmp, KpiSummary, Stage, Market } from '@/types'

function PipelineContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeStage = searchParams.get('stage') as Stage | null
  const activeMarket = searchParams.get('market') as Market | null

  const [fmps, setFmps] = useState<Fmp[]>([])
  const [summaries, setSummaries] = useState<KpiSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getFmps({ stage: activeStage, market: activeMarket }),
      getKpiSummary(activeMarket),
    ]).then(([filtered, kpi]) => {
      setFmps(filtered)
      setSummaries(kpi)
    }).finally(() => setLoading(false))
  }, [activeStage, activeMarket])

  const totalFmps = summaries.reduce((s, x) => s + x.count, 0)
  const totalRetainer = summaries
    .filter(s => s.stage !== 'Rejected')
    .reduce((sum, s) => sum + s.totalRetainer, 0)

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set(key, value) } else { params.delete(key) }
    router.push(`/?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-5 h-5 border-2 border-[#e5e7eb] border-t-[#111827] rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Pipeline Overview */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
            Pipeline Overview
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[16px] font-semibold text-[#111827]">{totalFmps}</span>
            <span className="text-[11px] text-[#9ca3af]">Total FMPs</span>
          </div>
        </div>
        <Suspense>
          <PipelineSummaryChart summaries={summaries} />
        </Suspense>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Retainer by Stage
              </p>
              {totalRetainer > 0 && (
                <p className="text-[14px] font-semibold text-[#111827] leading-none flex-shrink-0 ml-2">
                  {formatCurrency(totalRetainer)}
                </p>
              )}
            </div>
            {totalRetainer > 0 && (
              <p className="text-[10px] text-[#9ca3af] text-right mt-0.5">excl. Rejected</p>
            )}
          </div>
          <RetainerByStageChart summaries={activeStage ? summaries.filter(s => s.stage === activeStage) : summaries} />
        </div>
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-4">
            FMPs by Market
          </p>
          <FmpsByMarketChart fmps={fmps} />
        </div>
      </div>

      {/* Pipeline table */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <div>
            <h2 className="text-[13px] font-semibold text-[#111827]">Pipeline</h2>
            <p className="text-[11px] text-[#9ca3af] mt-0.5">
              {fmps.length} FMP{fmps.length !== 1 ? 's' : ''}
            </p>
          </div>
          {/* Table-level filters */}
          <div className="flex items-center gap-2">
            <select
              value={activeStage ?? ''}
              onChange={e => setParam('stage', e.target.value || null)}
              className="text-[12px] text-[#374151] border border-[#e5e7eb] rounded-md px-2.5 py-1.5 bg-white hover:border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a4731] cursor-pointer"
            >
              <option value="">All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={activeMarket ?? ''}
              onChange={e => setParam('market', e.target.value || null)}
              className="text-[12px] text-[#374151] border border-[#e5e7eb] rounded-md px-2.5 py-1.5 bg-white hover:border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a4731] cursor-pointer"
            >
              <option value="">All Markets</option>
              {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {(activeStage || activeMarket) && (
              <button
                onClick={() => { const p = new URLSearchParams(); router.push(`/?${p.toString()}`) }}
                className="text-[11px] text-[#9ca3af] hover:text-[#6b7280] transition-colors px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="px-5 py-4">
          <PipelineTable fmps={fmps} />
        </div>
      </div>
    </div>
  )
}

function MarketFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeMarket = searchParams.get('market') as Market | null

  const handleMarketFilter = (market: Market | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (market) {
      params.set('market', market)
    } else {
      params.delete('market')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => handleMarketFilter(null)}
        className={[
          'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150',
          !activeMarket
            ? 'bg-[#f0fdf4] border-[#a7f3d0] text-[#1a4731]'
            : 'bg-white border-[#e5e7eb] text-[#6b7280] hover:border-[#d1d5db]',
        ].join(' ')}
      >
        All
      </button>
      {MARKETS.map(market => {
        const color = MARKET_COLORS[market]
        const active = activeMarket === market
        return (
          <button
            key={market}
            onClick={() => handleMarketFilter(market)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150"
            style={
              active
                ? { backgroundColor: color + '18', borderColor: color + '55', color }
                : { backgroundColor: 'white', borderColor: '#e5e7eb', color: '#6b7280' }
            }
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            {market}
          </button>
        )
      })}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-semibold text-[#111827]">Pipeline</h1>
          <p className="text-[12px] text-[#9ca3af] mt-0.5">APAC Fund Manager Placement</p>
        </div>
        <Suspense>
          <MarketFilter />
        </Suspense>
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-5 h-5 border-2 border-[#e5e7eb] border-t-[#111827] rounded-full" />
        </div>
      }>
        <PipelineContent />
      </Suspense>
    </div>
  )
}
