'use client'

import { useEffect, useState, useCallback } from 'react'
import { getFmps, getKpiSummary } from '@/lib/fmp-api'
import type { Fmp, KpiSummary, Stage, Market } from '@/types'

export function useFmps(filters?: { stage?: Stage | null; market?: Market | null }) {
  const [fmps, setFmps] = useState<Fmp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getFmps(filters)
      setFmps(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.stage, filters?.market])

  useEffect(() => { load() }, [load])

  return { fmps, loading, error, reload: load }
}

export function useKpiSummary(market?: Market | null) {
  const [summary, setSummary] = useState<KpiSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getKpiSummary(market)
      .then(setSummary)
      .finally(() => setLoading(false))
  }, [market])

  return { summary, loading }
}
