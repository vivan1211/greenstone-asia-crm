import type { Market, Stage, SubStatus } from '@/types'

export const STAGE_COLORS: Record<Stage, { bg: string; text: string; border: string; chart: string }> = {
  Prospect:        { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', chart: '#93c5fd' },
  'First Call':    { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', chart: '#fdba74' },
  'Second Call':   { bg: '#fffbeb', text: '#d97706', border: '#fde68a', chart: '#fde68a' },
  'Issue Contract':{ bg: '#faf5ff', text: '#7c3aed', border: '#e9d5ff', chart: '#d8b4fe' },
  Negotiation:     { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe', chart: '#a5b4fc' },
  Signed:          { bg: '#f0fdf4', text: '#059669', border: '#a7f3d0', chart: '#86efac' },
  Rejected:        { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', chart: '#fca5a5' },
}

export const SUB_STATUS_COLORS: Record<SubStatus, { bg: string; text: string; border: string }> = {
  Complete:    { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  'In Process': { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
}

export const MARKET_COLORS: Record<Market, string> = {
  Korea: '#2563eb',
  Japan: '#dc2626',
  Singapore: '#16a34a',
  'Hong Kong': '#7c3aed',
  Taiwan: '#ea580c',
}

// Pastel versions for charts
export const MARKET_CHART_COLORS: Record<Market, string> = {
  Korea: '#93c5fd',
  Japan: '#fca5a5',
  Singapore: '#86efac',
  'Hong Kong': '#d8b4fe',
  Taiwan: '#fdba74',
}

export const STAGES: Stage[] = ['Prospect', 'First Call', 'Second Call', 'Issue Contract', 'Negotiation', 'Signed', 'Rejected']
export const SUB_STATUSES: SubStatus[] = ['In Process', 'Complete']
export const MARKETS: Market[] = ['Korea', 'Japan', 'Singapore', 'Hong Kong', 'Taiwan']

export const CONTRACT_STATUSES = ['Not Started', 'Under Negotiation', 'Signed'] as const
