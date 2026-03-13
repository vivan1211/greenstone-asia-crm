'use client'

import { useEffect, useState } from 'react'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { getFmps } from '@/lib/fmp-api'
import type { Fmp } from '@/types'

export default function KanbanPage() {
  const [fmps, setFmps] = useState<Fmp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFmps().then(data => {
      setFmps(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="px-8 py-7 h-screen flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-[18px] font-semibold text-[#111827]">Kanban</h1>
        <p className="text-[12px] text-[#9ca3af] mt-0.5">Drag cards to update FMP stage</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin w-5 h-5 border-2 border-[#e5e7eb] border-t-[#111827] rounded-full" />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard initialFmps={fmps} />
        </div>
      )}
    </div>
  )
}
