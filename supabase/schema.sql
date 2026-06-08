create extension if not exists "pgcrypto";

create type public.plan_name as enum ('Starter', 'Business', 'Executive');
create type public.task_status as enum ('draft', 'completed', 'saved', 'failed');

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan public.plan_name not null default 'Starter',
  monthly_task_limit integer not null default 80,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  full_name text,
  company_name text,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

create table public.ai_employees (
  id text primary key,
  name text not null,
  plan public.plan_name not null,
  description text not null,
  route text not null,
  active boolean not null default true
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  employee_id text not null references public.ai_employees(id),
  title text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  status public.task_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.ai_employees enable row level security;
alter table public.tasks enable row level security;

create policy "Users can read their workspace"
on public.workspaces for select
using (
  id in (select workspace_id from public.profiles where profiles.id = auth.uid())
);

create policy "Users can read their profile"
on public.profiles for select
using (id = auth.uid());

create policy "Users can update their profile"
on public.profiles for update
using (id = auth.uid());

create policy "Everyone can read active AI employees"
on public.ai_employees for select
using (active = true);

create policy "Users can read workspace tasks"
on public.tasks for select
using (
  workspace_id in (select workspace_id from public.profiles where profiles.id = auth.uid())
);

create policy "Users can insert workspace tasks"
on public.tasks for insert
with check (
  workspace_id in (select workspace_id from public.profiles where profiles.id = auth.uid())
);

create policy "Users can update workspace tasks"
on public.tasks for update
using (
  workspace_id in (select workspace_id from public.profiles where profiles.id = auth.uid())
);

insert into public.ai_employees (id, name, plan, description, route) values
  ('german-email', 'German Email Employee', 'Starter', 'Reply to German clients and understand their intent.', '/employees/german-email'),
  ('contract', 'Contract Intelligence Employee', 'Starter', 'Analyze contracts, risks and key clauses.', '/employees/contract'),
  ('supplier', 'Supplier Communication Employee', 'Starter', 'Create supplier inquiries, negotiations and follow-ups.', '/employees/supplier'),
  ('listing', 'E-commerce Listing Employee', 'Business', 'Create marketplace listings, SEO descriptions and product pages.', '/employees/listing'),
  ('competitor', 'Competitor Intelligence Employee', 'Business', 'Analyze competitors, keywords, pricing and reviews.', '/employees/competitor'),
  ('meeting', 'Meeting Recorder Employee', 'Executive', 'Analyze uploaded meeting recordings and generate minutes.', '/employees/meeting')
on conflict (id) do update set
  name = excluded.name,
  plan = excluded.plan,
  description = excluded.description,
  route = excluded.route,
  active = true;
