import { Card } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { Fmp, TimelineEntry } from '@/types'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[#f3f4f6] last:border-0">
      <span className="text-[11px] font-medium text-[#9ca3af] flex-shrink-0">{label}</span>
      <span className="text-[13px] text-[#374151] text-right tabular-nums">{value}</span>
    </div>
  )
}

interface Props {
  fmp: Fmp
  timeline: TimelineEntry[]
}

export function ProfileMetaCard({ fmp, timeline }: Props) {
  const lastContact = timeline.length > 0 ? timeline[0].date : null

  return (
    <Card className="p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">Profile</p>
      <Row label="Date Added" value={formatDate(fmp.date_added)} />
      <Row label="Last Contact" value={formatDate(lastContact)} />
      <Row label="Next Contact" value={formatDate(fmp.next_contact_date)} />
      <Row label="Touchpoints" value={timeline.length} />
      <Row label="RM" value={fmp.relationship_manager ?? '—'} />
    </Card>
  )
}
