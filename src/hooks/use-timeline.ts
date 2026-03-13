'use client'

import { useEffect, useState, useCallback } from 'react'
import { getTimeline, logContact } from '@/lib/fmp-api'
import type { TimelineEntry } from '@/types'

export function useTimeline(fmpId: string) {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTimeline(fmpId)
      setEntries(data)
    } finally {
      setLoading(false)
    }
  }, [fmpId])

  useEffect(() => { load() }, [load])

  const log = async (entry: Pick<TimelineEntry, 'date' | 'summary' | 'logged_by'>) => {
    const newEntry = await logContact(fmpId, entry)
    setEntries(prev => [newEntry, ...prev])
    return newEntry
  }

  return { entries, loading, reload: load, log }
}
