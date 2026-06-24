-- =============================================================
--  صيف وصحة - مساعد  |  Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- =============================================================

-- ── Events ────────────────────────────────────────────────────
create table if not exists aser_events (
  id          text        primary key,
  title       text        not null default '',
  description text        not null default '',
  location    text        not null default '',
  date        text        not null default '',
  time        text        not null default '',
  audience    text        not null default '',
  category    text        not null default '',
  map_url     text        not null default '',
  active      boolean     not null default true,
  tone        text        not null default 'green',
  created_at  timestamptz not null default now()
);

-- ── Awareness Contents ────────────────────────────────────────
create table if not exists aser_contents (
  id           text        primary key,
  title        text        not null default '',
  type         text        not null default 'post',
  summary      text        not null default '',
  category     text        not null default '',
  action_label text        not null default '',
  file_url     text        not null default '',
  active       boolean     not null default true,
  updated_at   text        not null default '',
  created_at   timestamptz not null default now()
);

-- ── Keyword Answers (Assistant) ───────────────────────────────
create table if not exists aser_keywords (
  id          text        primary key,
  question    text        not null default '',
  keywords    text[]      not null default '{}',
  answer      text        not null default '',
  link_label  text        not null default '',
  link_url    text        not null default '',
  image_url   text        not null default '',
  cta_label   text        not null default '',
  cta_url     text        not null default '',
  active      boolean     not null default true,
  updated_at  text        not null default '',
  created_at  timestamptz not null default now()
);

-- ── Doctor Assistant Questions ────────────────────────────────
create table if not exists aser_doctor_questions (
  id          text        primary key,
  question    text        not null default '',
  answer      text        not null default '',
  keywords    text[]      not null default '{}',
  active      boolean     not null default true,
  "order"     integer     not null default 999,
  updated_at  text        not null default '',
  created_at  timestamptz not null default now()
);

-- ── QR Locations ──────────────────────────────────────────────
create table if not exists aser_qr_locations (
  id          text        primary key,
  name        text        not null default '',
  description text        not null default '',
  slug        text        not null unique,
  active      boolean     not null default true,
  created_at  text        not null default ''
);

-- ── Smart Entry Config (single row) ──────────────────────────
create table if not exists aser_smart_entry_config (
  id         integer     primary key default 1,
  config     jsonb       not null default '{}',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- =============================================================
--  Row Level Security
--  The app uses anon key only, so we allow full public access.
--  To restrict writes to authenticated admins later, replace
--  the "public_write" policies with JWT-based checks.
-- =============================================================

alter table aser_events              enable row level security;
alter table aser_contents            enable row level security;
alter table aser_keywords            enable row level security;
alter table aser_doctor_questions    enable row level security;
alter table aser_qr_locations        enable row level security;
alter table aser_smart_entry_config  enable row level security;

-- Events
create policy "events_read"  on aser_events for select using (true);
create policy "events_write" on aser_events for all    using (true) with check (true);

-- Contents
create policy "contents_read"  on aser_contents for select using (true);
create policy "contents_write" on aser_contents for all    using (true) with check (true);

-- Keywords
create policy "keywords_read"  on aser_keywords for select using (true);
create policy "keywords_write" on aser_keywords for all    using (true) with check (true);

-- Doctor questions
create policy "doctor_read"  on aser_doctor_questions for select using (true);
create policy "doctor_write" on aser_doctor_questions for all    using (true) with check (true);

-- QR locations
create policy "qr_loc_read"  on aser_qr_locations for select using (true);
create policy "qr_loc_write" on aser_qr_locations for all    using (true) with check (true);

-- Smart entry config
create policy "sec_read"  on aser_smart_entry_config for select using (true);
create policy "sec_write" on aser_smart_entry_config for all    using (true) with check (true);
