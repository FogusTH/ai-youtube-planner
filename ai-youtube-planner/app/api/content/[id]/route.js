import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const updates = await req.json();
  const allowed = [
    "title",
    "description",
    "status",
    "scheduled_date",
    "alt_titles",
    "thumbnail_idea",
    "hook_notes",
    "cta_notes",
    "series",
    "views",
    "ctr",
    "retention_notes",
  ];
  const payload = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in updates) payload[key] = updates[key];
  }

  const { data, error } = await supabaseAdmin
    .from("content_items")
    .update(payload)
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin
    .from("content_items")
    .delete()
    .eq("id", params.id)
    .eq("user_id", session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
