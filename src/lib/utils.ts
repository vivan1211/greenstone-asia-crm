import type { Market } from '@/types'
import { MARKET_COLORS } from './constants'

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function isOverdue(date: string | null | undefined): boolean {
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(date + 'T00:00:00')
  return d < today
}

export function getInitials(name: string): string {
  if (!name) return '??'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function getMarketColor(market: Market | null | undefined): string {
  if (!market) return '#94a3b8'
  return MARKET_COLORS[market] ?? '#94a3b8'
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function clx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
