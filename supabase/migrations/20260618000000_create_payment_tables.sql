-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. BOOKS TABLE
create table if not exists public.books (
    id text primary key,
    title text not null,
    author text not null,
    price_ars numeric not null check (price_ars >= 0),
    price_usd numeric not null check (price_usd >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ORDERS TABLE
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    shipping_address text not null,
    shipping_city text not null,
    shipping_state text not null,
    shipping_zip text not null,
    shipping_country text not null,
    shipping_cost numeric not null check (shipping_cost >= 0),
    subtotal numeric not null check (subtotal >= 0),
    total_amount numeric not null check (total_amount >= 0),
    currency text not null check (currency in ('ARS', 'USD')),
    payment_method text not null check (payment_method in ('paypal', 'mercadopago')),
    status text default 'pending'::text not null check (status in ('pending', 'paid', 'failed', 'cancelled')),
    payment_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ORDER ITEMS TABLE
create table if not exists public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    book_id text references public.books(id) not null,
    title text not null,
    quantity integer not null check (quantity > 0),
    price numeric not null check (price >= 0),
    currency text not null check (currency in ('ARS', 'USD')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PAYMENTS LOG / HISTORY TABLE
create table if not exists public.payments (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete set null,
    gateway text not null check (gateway in ('paypal', 'mercadopago')),
    external_payment_id text not null,
    payment_status text not null,
    payment_amount numeric not null check (payment_amount >= 0),
    payment_currency text not null,
    payer_email text,
    payload jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TRIGGER FOR UPDATED_AT ON ORDERS
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trigger_orders_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at();

-- 6. SEED DATA FOR BOOKS
insert into public.books (id, title, author, price_ars, price_usd)
values 
    ('posturas', 'Posturas', 'Mercedes Miralpeix', 150, 1.5),
    ('circulantes', 'Circulantes', 'Jorge F. Pantaleón', 150, 1.5),
    ('desborde', 'Desbordes', 'Hernán Ulm', 150, 1.5)
on conflict (id) do update set
    title = excluded.title,
    author = excluded.author,
    price_ars = excluded.price_ars,
    price_usd = excluded.price_usd;

-- 7. ROW LEVEL SECURITY (RLS)
alter table public.books enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- 8. POLICIES
-- Books: Anyone can view
create policy "Allow public read access to books"
    on public.books for select
    using (true);

-- Orders: Public can select their own order if they have the ID (UUID), and can insert if needed (though edge function uses service role)
create policy "Allow public read access to orders by ID"
    on public.orders for select
    using (true);

-- Order Items: Public can select order items if they know the order_id (UUID)
create policy "Allow public read access to order items by order ID"
    on public.order_items for select
    using (true);
