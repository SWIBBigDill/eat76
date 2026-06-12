-- Eat76 initial schema with RLS (applied to Supabase project acnjhuznxwquxaaflmrm)

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

create table if not exists orders (
  id text primary key,
  stripe_session_id text unique,
  restaurant_id text references restaurants(id),
  restaurant_name text not null,
  customer_name text,
  customer_email text,
  customer_user_id uuid,
  delivery_address text,
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null,
  service_fee numeric(10,2) not null default 1.76,
  delivery_fee numeric(10,2) not null default 4.76,
  tip numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  savings numeric(10,2),
  status text not null default 'placed'
    check (status in ('placed', 'confirmed', 'preparing', 'ready', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled')),
  source text not null default 'demo'
    check (source in ('demo', 'stripe')),
  driver_id uuid,
  driver_name text,
  driver_vehicle text,
  driver_lat double precision,
  driver_lng double precision,
  minutes_away int,
  notes text,
  promo_code text,
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_restaurant_id_idx on orders(restaurant_id);
create index if not exists orders_placed_at_idx on orders(placed_at desc);
create index if not exists orders_status_idx on orders(status);

create table if not exists early_access (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('restaurant', 'driver', 'customer')),
  payload jsonb not null,
  submitted_at timestamptz not null default now()
);

create index if not exists early_access_type_idx on early_access(type);

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

-- updated_at trigger
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- RLS: enabled on all tables. Server routes use the secret key (bypasses RLS).
-- Narrow policies below support the anon-key fallback path used before the
-- secret key is configured.
alter table restaurants enable row level security;
alter table orders enable row level security;
alter table early_access enable row level security;
alter table drivers enable row level security;

-- Restaurants are public directory data
create policy "restaurants_public_read" on restaurants
  for select using (true);

-- Anyone can submit an order (placing an order is a public action)
create policy "orders_public_insert" on orders
  for insert with check (true);

-- Authenticated customers can read their own orders
create policy "orders_owner_read" on orders
  for select to authenticated
  using (customer_user_id = (select auth.uid()));

-- Early access form submissions are public inserts
create policy "early_access_public_insert" on early_access
  for insert with check (true);

-- Capability-URL order lookup: returns exactly one order by unguessable id.
create or replace function get_order_by_id(p_order_id text)
returns setof orders
language sql
security definer
set search_path = public
stable
as $$
  select * from orders where id = p_order_id limit 1;
$$;

-- Status update RPC for dashboards in anon fallback mode
create or replace function update_order_status(p_order_id text, p_status text)
returns setof orders
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('placed', 'confirmed', 'preparing', 'ready', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled') then
    raise exception 'invalid status %', p_status;
  end if;
  return query
    update orders set status = p_status where id = p_order_id returning *;
end;
$$;

-- Restaurant orders feed for dashboard
create or replace function get_restaurant_orders(p_restaurant_id text)
returns setof orders
language sql
security definer
set search_path = public
stable
as $$
  select * from orders
  where restaurant_id = p_restaurant_id
  order by placed_at desc
  limit 100;
$$;

-- Active deliveries feed for driver dashboard
create or replace function get_active_deliveries()
returns setof orders
language sql
security definer
set search_path = public
stable
as $$
  select * from orders
  where status in ('confirmed', 'preparing', 'ready', 'picked_up', 'out_for_delivery')
  order by placed_at desc
  limit 50;
$$;

-- Driver assignment RPC
create or replace function assign_driver(p_order_id text, p_driver_name text, p_driver_vehicle text)
returns setof orders
language sql
security definer
set search_path = public
as $$
  update orders
  set driver_name = p_driver_name,
      driver_vehicle = p_driver_vehicle
  where id = p_order_id
  returning *;
$$;
