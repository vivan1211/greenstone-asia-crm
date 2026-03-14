'use client'

import React from 'react'
import { STAGE_COLORS, MARKET_COLORS, SUB_STATUS_COLORS } from '@/lib/constants'
import { getInitials } from '@/lib/utils'
import type { Stage, Market, SubStatus } from '@/types'

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className = '', onClick, hover }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white border border-[#e5e7eb] rounded-lg',
        hover ? 'cursor-pointer hover:border-[#d1d5db] hover:shadow-sm transition-all duration-150' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  loading?: boolean
}

export function Button({ variant = 'secondary', size = 'md', children, loading, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-md border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
  const sizes = {
    sm: 'h-7 px-2.5 text-[12px]',
    md: 'h-8 px-3 text-[13px]',
  }
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[#1a4731] text-white border-[#1a4731] hover:bg-[#14532d]',
    secondary: 'bg-white text-[#374151] border-[#e5e7eb] hover:bg-[#f9fafb] hover:border-[#d1d5db]',
    ghost: 'bg-transparent text-[#6b7280] border-transparent hover:bg-[#f3f4f6] hover:text-[#374151]',
    danger: 'bg-white text-[#dc2626] border-[#fecaca] hover:bg-[#fef2f2]',
  }

  return (
    <button
      className={[base, sizes[size], variants[variant], className].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'h-8 px-2.5 bg-white border border-[#e5e7eb] rounded-md text-[13px] text-[#111827]',
          'placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1a4731] focus:ring-1 focus:ring-[#1a4731]/20',
          'transition-colors duration-150',
          error ? 'border-[#dc2626]' : '',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <p className="text-[11px] text-[#dc2626]">{error}</p>}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
}

export function Select({ label, error, placeholder, className = '', id, children, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={[
          'h-8 px-2.5 bg-white border border-[#e5e7eb] rounded-md text-[13px] text-[#111827]',
          'focus:outline-none focus:border-[#1a4731] focus:ring-1 focus:ring-[#1a4731]/20',
          'transition-colors duration-150 cursor-pointer',
          error ? 'border-[#dc2626]' : '',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {error && <p className="text-[11px] text-[#dc2626]">{error}</p>}
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          'px-2.5 py-2 bg-white border border-[#e5e7eb] rounded-md text-[13px] text-[#111827]',
          'placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1a4731] focus:ring-1 focus:ring-[#1a4731]/20',
          'transition-colors duration-150 resize-none',
          error ? 'border-[#dc2626]' : '',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <p className="text-[11px] text-[#dc2626]">{error}</p>}
    </div>
  )
}

// ─── StageBadge ───────────────────────────────────────────────────────────────

export function StageBadge({ stage }: { stage: Stage | null | undefined }) {
  if (!stage) return <span className="text-[#9ca3af] text-[12px]">—</span>
  const { bg, text } = STAGE_COLORS[stage]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {stage}
    </span>
  )
}

// ─── SubStatusBadge ───────────────────────────────────────────────────────────

export function SubStatusBadge({ subStatus }: { subStatus: SubStatus | null | undefined }) {
  if (!subStatus) return null
  const { bg, text, border } = SUB_STATUS_COLORS[subStatus]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
      style={{ backgroundColor: bg, color: text, borderColor: border }}
    >
      {subStatus}
    </span>
  )
}

// ─── MarketPill ───────────────────────────────────────────────────────────────

export function MarketPill({ market }: { market: Market | null | undefined }) {
  if (!market) return <span className="text-[#9ca3af] text-[12px]">—</span>
  const color = MARKET_COLORS[market]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
      style={{
        backgroundColor: color + '14',
        color: color,
        borderColor: color + '33',
      }}
    >
      {market}
    </span>
  )
}

// ─── InitialsAvatar ───────────────────────────────────────────────────────────

interface InitialsAvatarProps {
  name: string
  market?: Market | null
  size?: 'sm' | 'md' | 'lg'
}

export function InitialsAvatar({ name, market, size = 'md' }: InitialsAvatarProps) {
  const color = market ? MARKET_COLORS[market] : '#6b7280'
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-8 h-8 text-[11px]', lg: 'w-10 h-10 text-[13px]' }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
      style={{ backgroundColor: color + '18', color }}
    >
      {getInitials(name)}
    </div>
  )
}

// ─── OverdueBadge ─────────────────────────────────────────────────────────────

export function OverdueBadge() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#fef2f2] text-[#dc2626]">
      Overdue
    </span>
  )
}

// ─── TabBar ───────────────────────────────────────────────────────────────────

interface TabBarProps {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-0 border-b border-[#e5e7eb]">
      {tabs.map(tab => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={[
            'px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all duration-150',
            active === tab
              ? 'border-[#1a4731] text-[#1a4731]'
              : 'border-transparent text-[#6b7280] hover:text-[#374151] hover:border-[#d1d5db]',
          ].join(' ')}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="animate-spin text-[#6b7280]"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center mb-3">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-[13px] font-medium text-[#374151]">{title}</p>
      {description && <p className="text-[12px] text-[#9ca3af] mt-1">{description}</p>}
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider() {
  return <div className="h-px bg-[#e5e7eb] my-1" />
}

// ─── AmberCallout ─────────────────────────────────────────────────────────────

export function AmberCallout({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2.5 px-3.5 py-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg">
      <div className="flex-shrink-0 mt-0.5">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#b45309] mb-0.5">{label}</p>
        <p className="text-[13px] text-[#92400e]">{value}</p>
      </div>
    </div>
  )
}
