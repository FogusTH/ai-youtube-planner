import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { fetchYoutubeVideoStats } from "@/lib/youtube";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { contentItemId, videoId } = await req.json();
  if (!contentItemId) {
    return NextResponse.json({ error: "ต้องระบุ contentItemId" }, { status: 400 });
  }

  const { data: item, error: itemError } = await supabaseAdmin
    .from("content_items")
    .select("id, youtube_video_id")
    .eq("id", contentItemId)
    .eq("user_id", session.user.id)
    .single();

  if (itemError || !item) {
    return NextResponse.json({ error: "ไม่พบคอนเทนต์นี้" }, { status: 404 });
  }

  const target = videoId || item.youtube_video_id;
  if (!target) {
    return NextResponse.json({ error: "ยังไม่ได้ใส่ลิงก์หรือรหัสวิดีโอ YouTube" }, { status: 400 });
  }

  try {
    const stats = await fetchYoutubeVideoStats(target);

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("content_items")
      .update({
        youtube_video_id: stats.videoId,
        views: stats.views,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contentItemId)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ item: updated, stats });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
