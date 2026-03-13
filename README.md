# Greenstone CRM

Fund Manager Placement CRM for Greenstone Equity Partners — APAC markets.

## Setup

### 1. Create Supabase project

Go to [supabase.com](https://supabase.com) and create a new project. Run this SQL in the SQL editor:

```sql
create table fmps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  relationship_manager text,
  market text check (market in ('Korea','Japan','Singapore','Hong Kong','Taiwan')),
  stage text check (stage in ('Prospect','Active','Contracted','Signed','Inactive')),
  next_step text,
  next_contact_date date,
  fmp_contact_name text,
  fmp_contact_email text,
  fmp_contact_role text,
  retainer_amount numeric,
  fund_registration_fee numeric,
  contract_status text check (contract_status in ('Not Started','Under Negotiation','Signed')),
  contract_start_date date,
  date_added date default now(),
  created_at timestamptz default now()
);

create table timeline (
  id uuid primary key default gen_random_uuid(),
  fmp_id uuid references fmps(id) on delete cascade,
  date date not null,
  summary text not null,
  logged_by text,
  created_at timestamptz default now()
);

alter table fmps enable row level security;
alter table timeline enable row level security;

create policy "Authenticated read fmps" on fmps for select to authenticated using (true);
create policy "Authenticated insert fmps" on fmps for insert to authenticated with check (true);
create policy "Authenticated update fmps" on fmps for update to authenticated using (true);
create policy "Authenticated read timeline" on timeline for select to authenticated using (true);
create policy "Authenticated insert timeline" on timeline for insert to authenticated with check (true);
```

Create a user in Supabase > Authentication > Users.

### 2. Add environment variables

Edit `.env.local` with your project credentials (found in Supabase > Project Settings > API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy to Vercel

Add the two env vars in Vercel dashboard under Project > Settings > Environment Variables, then:

```bash
npx vercel --prod
```

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Supabase (PostgreSQL + Auth via `@supabase/ssr`)
- Tailwind CSS v4
- Recharts (pipeline charts)
- @hello-pangea/dnd (kanban drag-and-drop)
