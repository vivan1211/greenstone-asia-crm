'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from './supabase/server'
import { addDays } from './utils'
import type { FmpFormData } from '@/types'

function parseFmpFormData(data: FmpFormData) {
  return {
    name: data.name,
    relationship_manager: data.relationship_manager || null,
    market: data.market || null,
    stage: data.stage || null,
    sub_status: data.sub_status || null,
    next_step: data.next_step || null,
    next_contact_date: data.next_contact_date || null,
    fmp_contact_name: data.fmp_contact_name || null,
    fmp_contact_email: data.fmp_contact_email || null,
    fmp_contact_role: data.fmp_contact_role || null,
    retainer_amount: data.retainer_amount ? parseFloat(data.retainer_amount) : null,
    fund_registration_fee: data.fund_registration_fee ? parseFloat(data.fund_registration_fee) : null,
    contract_status: data.contract_status || null,
    contract_start_date: data.contract_start_date || null,
    date_added: data.date_added || null,
  }
}

export async function createFmpAction(formData: FmpFormData) {
  const supabase = await getSupabaseServerClient()
  const parsed = parseFmpFormData(formData)

  const { data, error } = await supabase
    .from('fmps')
    .insert(parsed)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/kanban')
  redirect(`/fmp/${data.id}`)
}

export async function updateFmpAction(id: string, formData: Partial<FmpFormData> | Record<string, unknown>) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('fmps')
    .update(formData)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/kanban')
  revalidatePath(`/fmp/${id}`)
}

export async function updateNextStepAction(
  id: string,
  nextStep: string | null,
  nextContactDate?: string | null
) {
  const supabase = await getSupabaseServerClient()
  const update: Record<string, unknown> = { next_step: nextStep || null }
  if (nextContactDate !== undefined) update.next_contact_date = nextContactDate || null
  const { error } = await supabase.from('fmps').update(update).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/fmp/${id}`)
  revalidatePath('/')
  revalidatePath('/kanban')
}

export async function logContactAction(
  fmpId: string,
  entry: { date: string; summary: string; logged_by: string; next_step?: string }
) {
  const supabase = await getSupabaseServerClient()

  const { error: timelineError } = await supabase
    .from('timeline')
    .insert({
      fmp_id: fmpId,
      date: entry.date,
      summary: entry.summary,
      logged_by: entry.logged_by,
    })

  if (timelineError) throw new Error(timelineError.message)

  const update: Record<string, unknown> = {
    next_contact_date: addDays(entry.date, 30),
  }
  if (entry.next_step !== undefined) {
    update.next_step = entry.next_step || null
  }

  const { error: fmpError } = await supabase
    .from('fmps')
    .update(update)
    .eq('id', fmpId)

  if (fmpError) throw new Error(fmpError.message)

  revalidatePath(`/fmp/${fmpId}`)
  revalidatePath('/')
  revalidatePath('/kanban')
}
