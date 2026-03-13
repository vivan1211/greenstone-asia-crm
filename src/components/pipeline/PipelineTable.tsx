'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StageBadge, MarketPill, SubStatusBadge } from '@/components/ui'
import { formatDate, formatCurrency, isOverdue } from '@/lib/utils'
import type { Fmp } from '@/types'

interface Props {
  fmps: Fmp[]
}

type ColKey =
  | 'name' | 'rm' | 'market' | 'stage' | 'sub_status'
  | 'next_contact' | 'next_step' | 'retainer' | 'fund_reg_fee'
  | 'contract_start' | 'date_added'
  | 'contact_name' | 'contact_role' | 'contact_email'

const COL_CONFIG: { key: ColKey; label: string; defaultOn: boolean }[] = [
  { key: 'name',            label: 'FMP Name',        defaultOn: true  },
  { key: 'rm',              label: 'RM',               defaultOn: true  },
  { key: 'market',          label: 'Market',           defaultOn: true  },
  { key: 'stage',           label: 'Stage',            defaultOn: true  },
  { key: 'sub_status',      label: 'Status',           defaultOn: true  },
  { key: 'next_contact',    label: 'Next Contact',     defaultOn: true  },
  { key: 'next_step',       label: 'Next Step',        defaultOn: true  },
  { key: 'retainer',        label: 'Retainer',         defaultOn: false },
  { key: 'fund_reg_fee',    label: 'Fund Reg. Fee',    defaultOn: false },
  { key: 'contract_start',  label: 'Contract Start',   defaultOn: false },
  { key: 'date_added',      label: 'Date Added',       defaultOn: false },
  { key: 'contact_name',    label: 'Contact Name',     defaultOn: false },
  { key: 'contact_role',    label: 'Contact Role',     defaultOn: false },
  { key: 'contact_email',   label: 'Contact Email',    defaultOn: false },
]

const DEFAULT_VISIBLE = new Set<ColKey>(
  COL_CONFIG.filter(c => c.defaultOn).map(c => c.key)
)

export function PipelineTable({ fmps }: Props) {
  const router = useRouter()
  const [visible, setVisible] = useState<Set<ColKey>>(new Set(DEFAULT_VISIBLE))
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const toggleCol = (key: ColKey) => {
    setVisible(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      return next
    })
  }

  const cols = COL_CONFIG.filter(c => visible.has(c.key))

  const renderCell = (fmp: Fmp, key: ColKey, isLast: boolean) => {
    const borderB = !isLast ? 'border-b border-[#f0f0f0]' : ''
    const base = `px-4 py-3 border-r border-[#f0f0f0] ${borderB}`
    const baseLast = `px-4 py-3 ${borderB}`

    switch (key) {
      case 'name':
        return (
          <td key={key} className={base}>
            <span className="text-[13px] font-semibold text-[#111827] group-hover:text-[#1a4731] transition-colors duration-100">
              {fmp.name}
            </span>
          </td>
        )
      case 'rm':
        return (
          <td key={key} className={`${base} whitespace-nowrap`}>
            <span className="text-[12px] text-[#6b7280]">{fmp.relationship_manager || '—'}</span>
          </td>
        )
      case 'market':
        return (
          <td key={key} className={base}>
            <MarketPill market={fmp.market} />
          </td>
        )
      case 'stage':
        return (
          <td key={key} className={base}>
            <StageBadge stage={fmp.stage} />
          </td>
        )
      case 'sub_status':
        return (
          <td key={key} className={base}>
            <SubStatusBadge subStatus={fmp.sub_status} />
          </td>
        )
      case 'next_contact': {
        const overdue = isOverdue(fmp.next_contact_date)
        return (
          <td key={key} className={`${base} whitespace-nowrap`}>
            <div className="flex items-center gap-2">
              <span className={['text-[12px] tabular-nums', overdue ? 'text-[#dc2626] font-medium' : 'text-[#6b7280]'].join(' ')}>
                {formatDate(fmp.next_contact_date)}
              </span>
              {overdue && (
                <span className="text-[9px] font-bold uppercase tracking-wide bg-[#fef2f2] text-[#dc2626] px-1.5 py-0.5 rounded">
                  Overdue
                </span>
              )}
            </div>
          </td>
        )
      }
      case 'next_step':
        return (
          <td key={key} className={`${baseLast} max-w-[240px]`}>
            <span className="text-[12px] text-[#6b7280] truncate block">
              {fmp.next_step || <span className="text-[#d1d5db]">—</span>}
            </span>
          </td>
        )
      case 'retainer':
        return (
          <td key={key} className={`${base} whitespace-nowrap`}>
            <span className="text-[12px] text-[#374151] tabular-nums">
              {fmp.retainer_amount ? formatCurrency(fmp.retainer_amount) : '—'}
            </span>
          </td>
        )
      case 'fund_reg_fee':
        return (
          <td key={key} className={`${base} whitespace-nowrap`}>
            <span className="text-[12px] text-[#374151] tabular-nums">
              {fmp.fund_registration_fee ? formatCurrency(fmp.fund_registration_fee) : '—'}
            </span>
          </td>
        )
      case 'contract_start':
        return (
          <td key={key} className={`${base} whitespace-nowrap`}>
            <span className="text-[12px] text-[#6b7280] tabular-nums">{formatDate(fmp.contract_start_date)}</span>
          </td>
        )
      case 'date_added':
        return (
          <td key={key} className={`${base} whitespace-nowrap`}>
            <span className="text-[12px] text-[#6b7280] tabular-nums">{formatDate(fmp.date_added)}</span>
          </td>
        )
      case 'contact_name':
        return (
          <td key={key} className={base}>
            <span className="text-[12px] text-[#6b7280]">{fmp.fmp_contact_name || '—'}</span>
          </td>
        )
      case 'contact_role':
        return (
          <td key={key} className={base}>
            <span className="text-[12px] text-[#6b7280]">{fmp.fmp_contact_role || '—'}</span>
          </td>
        )
      case 'contact_email':
        return (
          <td key={key} className={`${base} max-w-[200px]`}>
            <span className="text-[12px] text-[#6b7280] truncate block">{fmp.fmp_contact_email || '—'}</span>
          </td>
        )
    }
  }

  if (fmps.length === 0) {
    return (
      <div className="text-center py-12 text-[13px] text-[#9ca3af]">
        No FMPs match the current filters.
      </div>
    )
  }

  return (
    <div>
      {/* Column toggle */}
      <div className="flex justify-end mb-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium text-[#6b7280] border border-[#e5e7eb] bg-white hover:bg-[#f9fafb] hover:border-[#d1d5db] transition-all duration-150"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Columns
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-30 bg-white border border-[#e5e7eb] rounded-lg shadow-lg w-52 py-1.5">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Show / Hide Columns
              </p>
              {COL_CONFIG.map(col => (
                <label
                  key={col.key}
                  className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-[#f9fafb] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={visible.has(col.key)}
                    onChange={() => toggleCol(col.key)}
                    className="w-3.5 h-3.5 rounded border-[#d1d5db] text-[#1a4731] cursor-pointer"
                  />
                  <span className="text-[12px] text-[#374151]">{col.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb]">
              {cols.map((col, i) => (
                <th
                  key={col.key}
                  className={[
                    'text-left py-2.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]',
                    'border-b border-[#e5e7eb]',
                    i < cols.length - 1 ? 'border-r border-[#e5e7eb]' : '',
                  ].join(' ')}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fmps.map((fmp, i) => {
              const isLast = i === fmps.length - 1
              return (
                <tr
                  key={fmp.id}
                  onClick={() => router.push(`/fmp/${fmp.id}`)}
                  className="cursor-pointer transition-colors duration-100 hover:bg-[#f9fafb] group"
                >
                  {cols.map(col => renderCell(fmp, col.key, isLast))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
