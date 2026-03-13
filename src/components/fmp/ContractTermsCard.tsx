import { Card, MarketPill } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Fmp } from '@/types'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[#f3f4f6] last:border-0">
      <span className="text-[11px] font-medium text-[#9ca3af] flex-shrink-0">{label}</span>
      <span className="text-[13px] text-[#374151] text-right">{value}</span>
    </div>
  )
}

export function ContractTermsCard({ fmp }: { fmp: Fmp }) {
  return (
    <Card className="p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">Contract Terms</p>
      <Row label="Market" value={<MarketPill market={fmp.market} />} />
      <Row label="Retainer" value={formatCurrency(fmp.retainer_amount)} />
      <Row label="Fund Reg. Fee" value={formatCurrency(fmp.fund_registration_fee)} />
      <Row
        label="Contract Status"
        value={
          fmp.contract_status ? (
            <span className={[
              'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
              fmp.contract_status === 'Signed' ? 'bg-[#ecfdf5] text-[#059669]' :
              fmp.contract_status === 'Under Negotiation' ? 'bg-[#fffbeb] text-[#d97706]' :
              'bg-[#f3f4f6] text-[#6b7280]',
            ].join(' ')}>
              {fmp.contract_status}
            </span>
          ) : <span className="text-[#9ca3af]">—</span>
        }
      />
      <Row label="Start Date" value={formatDate(fmp.contract_start_date)} />
    </Card>
  )
}
