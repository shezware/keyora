begin;

create table public.member_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.member_profiles enable row level security;
revoke all on public.member_profiles from anon, authenticated;
grant select on public.member_profiles to authenticated;
create policy "Members read only their own profile" on public.member_profiles
  for select to authenticated using ((select auth.uid()) = id);

-- Auth owns email/passwords. Profile changes mirror validated auth metadata;
-- no client may insert a profile for another user or change identifiers/dates.
create function public.keyora_sync_member_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.member_profiles (id, full_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120))
  on conflict (id) do update set full_name = excluded.full_name, updated_at = now();
  return new;
end;
$$;
revoke all on function public.keyora_sync_member_profile() from public, anon, authenticated;
create trigger keyora_member_created after insert on auth.users
  for each row execute function public.keyora_sync_member_profile();
create trigger keyora_member_updated after update of raw_user_meta_data on auth.users
  for each row execute function public.keyora_sync_member_profile();

insert into public.member_profiles (id, full_name)
select id, left(coalesce(raw_user_meta_data ->> 'full_name', ''), 120) from auth.users
on conflict (id) do nothing;

commit;
