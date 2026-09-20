import { createClient } from "@supabase/supabase-js";

// ใช้ service role key ฝั่งเซิร์ฟเวอร์เท่านั้น (ห้าม import ไฟล์นี้ในโค้ดฝั่ง client)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  }
);
