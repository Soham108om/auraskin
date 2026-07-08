-- ====================================================================
-- AURASKIN SUPABASE SETUP SCHEMA
-- Paste this script in your Supabase Dashboard SQL Editor and click 'Run'
-- ====================================================================

-- 1. Create Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  address text,
  city text,
  zip text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;

-- Drop existing policies if they exist to avoid duplication errors
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Trigger to automatically create a profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger cleanly
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create Orders Table
create table if not exists public.orders (
  id text primary key, -- transaction reference e.g., T-123456
  user_id uuid references auth.users on delete set null,
  email text not null,
  first_name text not null,
  last_name text,
  address text not null,
  city text not null,
  zip text not null,
  subtotal numeric(10,2) not null,
  discount_amount numeric(10,2) default 0.00,
  shipping numeric(10,2) default 0.00,
  final_total numeric(10,2) not null,
  coupon_code text,
  payment_status text default 'Pending',
  payment_method text,
  transaction_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

drop policy if exists "Users can view their own orders" on public.orders;
drop policy if exists "Anyone can insert orders" on public.orders;

create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Anyone can insert orders" on public.orders
  for insert with check (true);

-- 3. Create Order Items Table
create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id text references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity integer not null,
  price numeric(10,2) not null,
  selected_size text,
  selected_scent text
);

alter table public.order_items enable row level security;

drop policy if exists "Users can view their own order items" on public.order_items;
drop policy if exists "Anyone can insert order items" on public.order_items;

create policy "Users can view their own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_items.order_id
      and public.orders.user_id = auth.uid()
    )
  );

create policy "Anyone can insert order items" on public.order_items
  for insert with check (true);

-- 4. Create Reviews Table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

drop policy if exists "Anyone can read reviews" on public.reviews;
drop policy if exists "Anyone can insert reviews" on public.reviews;

create policy "Anyone can read reviews" on public.reviews
  for select using (true);

create policy "Anyone can insert reviews" on public.reviews
  for insert with check (true);

-- 5. Create Quiz Results Table
create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  skin_type text not null,
  concern text not null,
  sensitivity text not null,
  hydration integer not null,
  sebum integer not null,
  barrier integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.quiz_results enable row level security;

drop policy if exists "Users can view their own quiz results" on public.quiz_results;
drop policy if exists "Users can insert their own quiz results" on public.quiz_results;

create policy "Users can view their own quiz results" on public.quiz_results
  for select using (auth.uid() = user_id);

create policy "Users can insert their own quiz results" on public.quiz_results
  for insert with check (auth.uid() = user_id);
