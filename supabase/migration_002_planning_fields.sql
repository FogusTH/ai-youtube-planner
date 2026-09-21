-- Migration 002: เพิ่มฟิลด์สำหรับวางแผนคอนเทนต์แบบละเอียด + ผลลัพธ์หลังโพสต์
-- วิธีใช้: Supabase Dashboard > SQL Editor > New query > วางทั้งหมดนี้ > Run

alter table content_items add column if not exists alt_titles text;
alter table content_items add column if not exists thumbnail_idea text;
alter table content_items add column if not exists hook_notes text;
alter table content_items add column if not exists cta_notes text;
alter table content_items add column if not exists series text;
alter table content_items add column if not exists views integer;
alter table content_items add column if not exists ctr numeric;
alter table content_items add column if not exists retention_notes text;

create index if not exists content_items_series_idx on content_items(series);
