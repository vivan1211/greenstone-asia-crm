'use client'

import { useState, useMemo } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { KanbanColumn } from './KanbanColumn'
import { FmpSlidePanel } from './FmpSlidePanel'
import { PipelineTable } from '@/components/pipeline/PipelineTable'
import { STAGES, MARKETS } from '@/lib/constants'
import { updateFmp } from '@/lib/fmp-api'
import type { Fmp, Stage, Market } from '@/types'

interface Props {
  initialFmps: Fmp[]
}

export function KanbanBoard({ initialFmps }: Props) {
  const [fmps, setFmps] = useState<Fmp[]>(initialFmps)
  const [selectedFmp, setSelectedFmp] = useState<Fmp | null>(null)
  const [search, setSearch] = useState('')
  const [filterMarket, setFilterMarket] = useState<Market | ''>('')
  const [filterRm, setFilterRm] = useState('')
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board')

  const rms = useMemo(() => {
    const set = new Set<string>()
    fmps.forEach(f => { if (f.relationship_manager) set.add(f.relationship_manager) })
    return Array.from(set).sort()
  }, [fmps])

  const filtered = useMemo(() => {
    return fmps.filter(f => {
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false
      if (filterMarket && f.market !== filterMarket) return false
      if (filterRm && f.relationship_manager !== filterRm) return false
      return true
    })
  }, [fmps, search, filterMarket, filterRm])

  const columns = useMemo(() => {
    const map: Record<Stage, Fmp[]> = {
      Prospect: [], 'First Call': [], 'Second Call': [], 'Issue Contract': [],
      Negotiation: [], Signed: [], Rejected: [],
    }
    filtered.forEach(fmp => {
      const stage = fmp.stage ?? 'Prospect'
      if (map[stage]) map[stage].push(fmp)
    })
    return map
  }, [filtered])

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const { draggableId, source, destination } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newStage = destination.droppableId as Stage
    const fmp = fmps.find(f => f.id === draggableId)
    if (!fmp || fmp.stage === newStage) return

    setFmps(prev => prev.map(f => f.id === draggableId ? { ...f, stage: newStage } : f))
    if (selectedFmp?.id === draggableId) {
      setSelectedFmp(prev => prev ? { ...prev, stage: newStage } : null)
    }

    try {
      await updateFmp(draggableId, { stage: newStage })
    } catch {
      setFmps(prev => prev.map(f => f.id === draggableId ? { ...f, stage: fmp.stage } : f))
    }
  }

  const handleUpdate = (updated?: Fmp) => {
    if (updated) {
      setFmps(prev => prev.map(f => f.id === updated.id ? updated : f))
      setSelectedFmp(updated)
    }
  }

  const hasFilters = !!(search || filterMarket || filterRm)

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-5">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search FMPs..."
            className="h-8 pl-7 pr-3 bg-white border border-[#e5e7eb] rounded-md text-[12px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1a4731] w-[160px]"
          />
        </div>

        <select
          value={filterMarket}
          onChange={e => setFilterMarket(e.target.value as Market | '')}
          className="h-8 px-2.5 bg-white border border-[#e5e7eb] rounded-md text-[12px] text-[#374151] focus:outline-none focus:border-[#1a4731] cursor-pointer"
        >
          <option value="">All Markets</option>
          {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={filterRm}
          onChange={e => setFilterRm(e.target.value)}
          className="h-8 px-2.5 bg-white border border-[#e5e7eb] rounded-md text-[12px] text-[#374151] focus:outline-none focus:border-[#1a4731] cursor-pointer"
        >
          <option value="">All RMs</option>
          {rms.map(rm => <option key={rm} value={rm}>{rm}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterMarket(''); setFilterRm('') }}
            className="text-[11px] text-[#9ca3af] hover:text-[#374151] transition-colors"
          >
            Clear
          </button>
        )}

        {/* View toggle */}
        <div className="ml-auto flex items-center bg-[#f3f4f6] rounded-md p-0.5">
          <button
            onClick={() => setViewMode('board')}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium transition-all duration-150',
              viewMode === 'board' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6b7280] hover:text-[#374151]',
            ].join(' ')}
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Board
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium transition-all duration-150',
              viewMode === 'table' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6b7280] hover:text-[#374151]',
            ].join(' ')}
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18" />
            </svg>
            Table
          </button>
        </div>
      </div>

      {/* Board view */}
      {viewMode === 'board' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
            {STAGES.map(stage => (
              <KanbanColumn
                key={stage}
                stage={stage}
                fmps={columns[stage]}
                onCardClick={setSelectedFmp}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="flex-1 overflow-auto bg-white rounded-lg border border-[#e5e7eb]">
          <PipelineTable fmps={filtered} />
        </div>
      )}

      {/* Slide Panel (board only) */}
      {viewMode === 'board' && (
        <FmpSlidePanel
          fmp={selectedFmp}
          onClose={() => setSelectedFmp(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
