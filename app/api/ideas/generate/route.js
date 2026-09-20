import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateYoutubeIdeas } from "@/lib/gemini";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { topic, channelDescription } = await req.json();

  try {
    const ideas = await generateYoutubeIdeas({ topic, channelDescription, count: 5 });
    return NextResponse.json({ ideas });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
