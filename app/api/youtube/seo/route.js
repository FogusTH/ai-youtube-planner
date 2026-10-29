import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateYoutubeSeoMeta } from "@/lib/gemini";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { contentItemId } = await req.json();
  if (!contentItemId) {
    return NextResponse.json({ error: "ต้องระบุ contentItemId" }, { status: 400 });
  }

  const { data: item, error: itemError } = await supabaseAdmin
    .from("content_items")
    .select("id, title, description")
    .eq("id", contentItemId)
    .eq("user_id", session.user.id)
    .single();

  if (itemError || !item) {
    return NextResponse.json({ error: "ไม่พบคอนเทนต์นี้" }, { status: 404 });
  }

  try {
    const meta = await generateYoutubeSeoMeta({
      title: item.title,
      description: item.description,
    });
    return NextResponse.json({ meta });
  } catch (err) {
    const message = /50[0-9]|429|UNAVAILABLE/i.test(err.message)
      ? "AI กำลังมีคนใช้งานเยอะตอนนี้ ลองกดอีกครั้งใน 1-2 นาทีครับ"
      : err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
