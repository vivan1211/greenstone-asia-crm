import { getSupabaseBrowserClient } from './supabase/client'
import { addDays } from './utils'
import type { Fmp, TimelineEntry, Stage, Market, KpiSummary } from '@/types'
import { STAGES } from './constants'
import { MOCK_FMPS, MOCK_TIMELINE } from './mock-data'

const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

function client() {
  return getSupabaseBrowserClient()
}

// ─── FMPs ─────────────────────────────────────────────────────────────────────

export async function getFmps(filters?: { stage?: Stage | null; market?: Market | null }): Promise<Fmp[]> {
  if (DEMO) {
    let result = [...MOCK_FMPS]
    if (filters?.stage) result = result.filter(f => f.stage === filters.stage)
    if (filters?.market) result = result.filter(f => f.market === filters.market)
    return result.sort((a, b) => {
      if (!a.next_contact_date) return 1
      if (!b.next_contact_date) return -1
      return a.next_contact_date.localeCompare(b.next_contact_date)
    })
  }

  let query = client()
    .from('fmps')
    .select('*')
    .order('next_contact_date', { ascending: true, nullsFirst: false })

  if (filters?.stage) query = query.eq('stage', filters.stage)
  if (filters?.market) query = query.eq('market', filters.market)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Fmp[]
}

export async function getFmpById(id: string): Promise<Fmp | null> {
  if (DEMO) {
    return MOCK_FMPS.find(f => f.id === id) ?? null
  }

  const { data, error } = await client()
    .from('fmps')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Fmp
}

export async function createFmp(data: Omit<Fmp, 'id' | 'created_at'>): Promise<Fmp> {
  const { data: row, error } = await client()
    .from('fmps')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Fmp
}

export async function updateFmp(id: string, data: Partial<Fmp>): Promise<Fmp> {
  if (DEMO) {
    const fmp = MOCK_FMPS.find(f => f.id === id)
    return { ...fmp!, ...data } as Fmp
  }

  const { data: row, error } = await client()
    .from('fmps')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Fmp
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export async function getTimeline(fmpId: string): Promise<TimelineEntry[]> {
  if (DEMO) {
    return MOCK_TIMELINE[fmpId] ?? []
  }

  const { data, error } = await client()
    .from('timeline')
    .select('*')
    .eq('fmp_id', fmpId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as TimelineEntry[]
}

export async function logContact(
  fmpId: string,
  entry: Pick<TimelineEntry, 'date' | 'summary' | 'logged_by'>
): Promise<TimelineEntry> {
  if (DEMO) {
    return { id: 'mock-new', fmp_id: fmpId, created_at: new Date().toISOString(), ...entry }
  }

  const { data: row, error } = await client()
    .from('timeline')
    .insert({ fmp_id: fmpId, ...entry })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await client()
    .from('fmps')
    .update({ next_contact_date: addDays(entry.date, 30) })
    .eq('id', fmpId)

  return row as TimelineEntry
}

// ─── KPI Summary ──────────────────────────────────────────────────────────────

export async function getKpiSummary(market?: Market | null): Promise<KpiSummary[]> {
  if (DEMO) {
    const rows = market ? MOCK_FMPS.filter(f => f.market === market) : MOCK_FMPS
    return STAGES.map(stage => {
      const stageRows = rows.filter(r => r.stage === stage)
      return {
        stage,
        count: stageRows.length,
        totalRetainer: stageRows.reduce((sum, r) => sum + (r.retainer_amount ?? 0), 0),
        completeCount: stageRows.filter(r => r.sub_status === 'Complete').length,
        inProcessCount: stageRows.filter(r => r.sub_status === 'In Process').length,
      }
    })
  }

  let query = client().from('fmps').select('stage, sub_status, retainer_amount')
  if (market) query = query.eq('market', market)

  const { data, error } = await query
  if (error) throw new Error(error.message)

  const rows = (data ?? []) as { stage: Stage | null; sub_status: string | null; retainer_amount: number | null }[]

  return STAGES.map(stage => {
    const stageRows = rows.filter(r => r.stage === stage)
    return {
      stage,
      count: stageRows.length,
      totalRetainer: stageRows.reduce((sum, r) => sum + (r.retainer_amount ?? 0), 0),
      completeCount: stageRows.filter(r => r.sub_status === 'Complete').length,
      inProcessCount: stageRows.filter(r => r.sub_status === 'In Process').length,
    }
  })
}
