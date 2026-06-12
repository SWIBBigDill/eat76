-- Pin search_path on the trigger function
create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Feed RPCs return jsonb with customer_email stripped so anonymous dashboard
-- feeds never expose customer contact info. The single-order capability
-- lookup (get_order_by_id) keeps email for the customer's own confirmation.
drop function if exists get_restaurant_orders(text);
create function get_restaurant_orders(p_restaurant_id text)
returns setof jsonb
language sql
security definer
set search_path = public
stable
as $$
  select to_jsonb(o.*) - 'customer_email'
  from orders o
  where o.restaurant_id = p_restaurant_id
  order by o.placed_at desc
  limit 100;
$$;

drop function if exists get_active_deliveries();
create function get_active_deliveries()
returns setof jsonb
language sql
security definer
set search_path = public
stable
as $$
  select to_jsonb(o.*) - 'customer_email'
  from orders o
  where o.status in ('restaurant_confirmed', 'preparing', 'ready', 'driver_picked_up', 'on_the_way')
  order by o.placed_at desc
  limit 50;
$$;

drop function if exists get_recent_orders();
create function get_recent_orders()
returns setof jsonb
language sql
security definer
set search_path = public
stable
as $$
  select to_jsonb(o.*) - 'customer_email'
  from orders o
  order by o.placed_at desc
  limit 100;
$$;
