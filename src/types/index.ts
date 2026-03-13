export type Market = 'Korea' | 'Japan' | 'Singapore' | 'Hong Kong' | 'Taiwan'
export type Stage = 'Prospect' | 'First Call' | 'Second Call' | 'Issue Contract' | 'Negotiation' | 'Signed' | 'Rejected'
export type SubStatus = 'Complete' | 'In Process'
export type ContractStatus = 'Not Started' | 'Under Negotiation' | 'Signed'

export interface Fmp {
  id: string
  name: string
  relationship_manager: string | null
  market: Market | null
  stage: Stage | null
  sub_status: SubStatus | null
  next_step: string | null
  next_contact_date: string | null
  fmp_contact_name: string | null
  fmp_contact_email: string | null
  fmp_contact_role: string | null
  retainer_amount: number | null
  fund_registration_fee: number | null
  contract_status: ContractStatus | null
  contract_start_date: string | null
  date_added: string | null
  created_at: string
}

export interface TimelineEntry {
  id: string
  fmp_id: string
  date: string
  summary: string
  logged_by: string | null
  created_at: string
}

export interface KpiSummary {
  stage: Stage
  count: number
  totalRetainer: number
  completeCount: number
  inProcessCount: number
}

export interface FmpFormData {
  name: string
  relationship_manager: string
  market: Market | ''
  stage: Stage | ''
  sub_status: SubStatus | ''
  next_step: string
  next_contact_date: string
  fmp_contact_name: string
  fmp_contact_email: string
  fmp_contact_role: string
  retainer_amount: string
  fund_registration_fee: string
  contract_status: ContractStatus | ''
  contract_start_date: string
  date_added: string
}
