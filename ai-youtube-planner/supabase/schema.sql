-- AI YouTube Planner — Supabase schema
-- วิธีใช้: เปิด Supabase Dashboard > SQL Editor > New query > วางทั้งหมดนี้ > Run

create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists ideas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  title text not null,
  description text,
  category text default 'ทั่วไป',
  source text default 'manual', -- 'manual' | 'ai'
  created_at timestamptz default now()
);

create table if not exists content_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  idea_id uuid references ideas(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'idea' check (status in ('idea','script','shooting','editing','posted')),
  scheduled_date date,
  alt_titles text,
  thumbnail_idea text,
  hook_notes text,
  cta_notes text,
  series text,
  views integer,
  ctr numeric,
  retention_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists ideas_user_id_idx on ideas(user_id);
create index if not exists content_items_user_id_idx on content_items(user_id);
create index if not exists content_items_status_idx on content_items(status);

-- หมายเหตุ: แอปนี้เช็คสิทธิ์ผู้ใช้ที่ชั้น API (NextAuth session) ไม่ได้ใช้ Supabase Auth/RLS
-- ถ้าจะโปรดักชันจริงจัง แนะนำเปิด RLS + policy เพิ่มเติมภายหลัง
