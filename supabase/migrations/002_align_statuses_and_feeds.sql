-- Align order status values with the app's tracking model
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('placed', 'restaurant_confirmed', 'preparing', 'ready', 'driver_picked_up', 'on_the_way', 'delivered', 'cancelled'));

create or replace function update_order_status(p_order_id text, p_status text)
returns setof orders
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('placed', 'restaurant_confirmed', 'preparing', 'ready', 'driver_picked_up', 'on_the_way', 'delivered', 'cancelled') then
    raise exception 'invalid status %', p_status;
  end if;
  return query
    update orders set status = p_status where id = p_order_id returning *;
end;
$$;

create or replace function get_active_deliveries()
returns setof orders
language sql
security definer
set search_path = public
stable
as $$
  select * from orders
  where status in ('restaurant_confirmed', 'preparing', 'ready', 'driver_picked_up', 'on_the_way')
  order by placed_at desc
  limit 50;
$$;

-- Recent orders feed for the admin dashboard
create or replace function get_recent_orders()
returns setof orders
language sql
security definer
set search_path = public
stable
as $$
  select * from orders order by placed_at desc limit 100;
$$;
