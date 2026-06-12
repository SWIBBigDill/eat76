-- Eat76 initial schema (Supabase-ready)
-- Run via Supabase CLI: supabase db push

-- Restaurants (synced from onboarding / prospects)
create table if not exists restaurants (
  id text primary key,
  name text not null,
  food_type text not null,
  address text not null,
  phone text,
  zone text not null,
  zip text not null default '19348',
  website text,
  image_url text,
  stripe_connect_account_id text,
  monthly_order_count int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Customer orders
create table if not exists orders (
  id text primary key,
  stripe_session_id text unique,
  restaurant_id text not null references restaurants(id),
  restaurant_name text not null,
  customer_name text,
  customer_email text,
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null,
  service_fee numeric(10,2) not null default 1.76,
  delivery_fee numeric(10,2) not null default 4.76,
  tip numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  savings numeric(10,2),
  status text not null default 'placed'
    check (status in ('placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  source text not null default 'demo'
    check (source in ('demo', 'stripe')),
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_restaurant_id_idx on orders(restaurant_id);
create index if not exists orders_placed_at_idx on orders(placed_at desc);

-- Early access / partner applications
create table if not exists early_access (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('restaurant', 'driver', 'customer')),
  payload jsonb not null,
  submitted_at timestamptz not null default now()
);

create index if not exists early_access_type_idx on early_access(type);

-- Driver applications & profiles
create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  zip_code text not null default '19348',
  vehicle_type text,
  availability text,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'offline')),
  notes text,
  created_at timestamptz not null default now()
);

-- RLS (enable when auth is wired)
-- alter table orders enable row level security;
-- alter table early_access enable row level security;
