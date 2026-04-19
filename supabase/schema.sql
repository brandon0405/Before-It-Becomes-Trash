create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  auth0_sub text not null unique,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists items (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  category text not null,
  damage_description text not null,
  approximate_age text,
  current_state text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists analyses (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid not null references items(id) on delete cascade,
  probable_diagnosis text not null,
  recommendation text not null check (recommendation in ('repair', 'reuse', 'recycle', 'discard')),
  justification text not null,
  suggested_steps jsonb not null,
  difficulty text not null,
  eco_impact text not null,
  recovered_life text not null,
  raw_model jsonb,
  created_at timestamptz not null default now()
);

create table if not exists rescue_actions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  item_id uuid not null references items(id) on delete cascade,
  analysis_id uuid not null references analyses(id) on delete cascade,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create table if not exists badges (
  id uuid primary key default uuid_generate_v4(),
  rescue_action_id uuid not null references rescue_actions(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  label text not null,
  description text not null,
  awarded_at timestamptz not null default now()
);

create table if not exists blockchain_records (
  id uuid primary key default uuid_generate_v4(),
  rescue_action_id uuid not null references rescue_actions(id) on delete cascade,
  badge_id uuid references badges(id) on delete set null,
  network text not null,
  transaction_signature text not null,
  explorer_url text not null,
  memo_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_auth0_sub on profiles(auth0_sub);
create index if not exists idx_items_profile_created on items(profile_id, created_at desc);
create index if not exists idx_actions_profile_created on rescue_actions(profile_id, created_at desc);
create index if not exists idx_blockchain_action on blockchain_records(rescue_action_id);
