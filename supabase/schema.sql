create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  address text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.health_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  height_cm numeric not null default 175 check (height_cm > 0),
  weight_kg numeric not null default 80 check (weight_kg > 0),
  gender text not null default 'masculino' check (gender in ('masculino', 'feminino', 'outro')),
  age integer not null default 30 check (age > 0),
  activity text not null default 'moderado' check (activity in ('baixo', 'moderado', 'alto', 'muito-alto', 'hiperativo')),
  goal text not null default 'manter-peso' check (goal in ('perder-peso', 'perder-lentamente', 'manter-peso', 'aumentar-lentamente', 'aumentar-peso')),
  bmi numeric,
  bmr_base numeric,
  bmr_adjusted numeric,
  water_goal_ml numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists health_profiles_set_updated_at on public.health_profiles;
create trigger health_profiles_set_updated_at
before update on public.health_profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.health_profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read their own health profile" on public.health_profiles;
create policy "Users can read their own health profile"
on public.health_profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own health profile" on public.health_profiles;
create policy "Users can insert their own health profile"
on public.health_profiles for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own health profile" on public.health_profiles;
create policy "Users can update their own health profile"
on public.health_profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
