import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { email, password, name } = await req.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "กรุณากรอกอีเมลและรหัสผ่านอย่างน้อย 6 ตัวอักษร" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .single();

  if (existing) {
    return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await supabaseAdmin.from("users").insert({
    email: normalizedEmail,
    password_hash,
    name: name || normalizedEmail.split("@")[0],
  });

  if (error) {
    return NextResponse.json({ error: "สมัครสมาชิกไม่สำเร็จ" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
