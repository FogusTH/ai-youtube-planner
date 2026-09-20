import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("content_items")
    .select("*")
    .eq("user_id", session.user.id)
    .order("scheduled_date", { ascending: true, nullsFirst: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, idea_id, status, scheduled_date } = body;

  if (!title) return NextResponse.json({ error: "ต้องมีชื่อคอนเทนต์" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("content_items")
    .insert({
      user_id: session.user.id,
      title,
      description: description || "",
      idea_id: idea_id || null,
      status: status || "idea",
      scheduled_date: scheduled_date || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
