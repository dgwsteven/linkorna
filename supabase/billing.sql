alter table public.workspaces
  add column if not exists subscription_status text,
  add column if not exists billing_provider text,
  add column if not exists billing_channel text,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists paid_until timestamptz;

create index if not exists workspaces_stripe_customer_id_idx
  on public.workspaces (stripe_customer_id);

create index if not exists workspaces_stripe_subscription_id_idx
  on public.workspaces (stripe_subscription_id);
