"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import IdeaCard from "@/components/IdeaCard";
import Notice from "@/components/Notice";
import { Sparkles, Loader2 } from "lucide-react";

function IdeaCardSkeleton() {
  return (
    <div className="bg-card border-l-[3px] border-l-line border border-line rounded-card p-4 flex flex-col gap-2 animate-pulse">
      <div className="h-4 bg-paper rounded w-3/4" />
      <div className="h-3 bg-paper rounded w-full" />
      <div className="h-3 bg-paper rounded w-5/6" />
      <div className="h-5 bg-paper rounded w-16 mt-1" />
    </div>
  );
}

export default function IdeasPage() {
  const [topic, setTopic] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [generated, setGenerated] = useState([]);
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadIdeas() {
    const res = await fetch("/api/ideas");
    const data = await res.json();
    if (res.ok) setSavedIdeas(data.ideas || []);
  }

  useEffect(() => {
    loadIdeas();
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGenerated([]);

    const res = await fetch("/api/ideas/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, channelDescription }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "สร้างไอเดียไม่สำเร็จ ลองใหม่อีกครั้ง");
      return;
    }
    setGenerated(data.ideas || []);
  }

  async function saveIdea(idea) {
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...idea, source: idea.source || "ai" }),
    });
    if (res.ok) {
      setGenerated((prev) => prev.filter((i) => i.title !== idea.title));
      loadIdeas();
      setNotice(`บันทึกไอเดีย "${idea.title}" แล้ว`);
    }
  }

  async function deleteIdea(id) {
    await fetch("/api/ideas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadIdeas();
  }

  async function addToCalendar(idea) {
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: idea.title,
        description: idea.description,
        idea_id: idea.id,
        status: "idea",
      }),
    });
    setNotice(`เพิ่ม "${idea.title}" ลงปฏิทินแล้ว — ไปที่หน้าปฏิทินเพื่อตั้งวันที่`);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      <main className="flex-1 px-5 md:px-10 py-8 max-w-5xl">
        <h1 className="font-display text-3xl text-ink mb-1">คิดไอเดียคอนเทนต์</h1>
        <p className="text-inkmuted mb-6">ให้ AI ช่วยระดมไอเดียคลิปใหม่ตามทิศทางช่องของคุณ</p>

        <form
          onSubmit={handleGenerate}
          className="bg-card border border-line rounded-card p-5 flex flex-col gap-3 mb-8"
        >
          <div>
            <label className="text-sm text-ink font-medium block mb-1">หัวข้อที่อยากได้ไอเดีย</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="เช่น สายรีวิวเทคโนโลยี, ทำอาหารคลีน, เกม Minecraft"
              className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus-ring bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-ink font-medium block mb-1">
              เกี่ยวกับช่องของคุณ (ไม่บังคับ)
            </label>
            <textarea
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              placeholder="เช่น ช่องรีวิวสินค้าไอทีสำหรับมือใหม่ เน้นอธิบายง่ายๆ"
              rows={2}
              className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus-ring bg-white resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="self-start flex items-center gap-2 bg-navy text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-navydeep transition-colors disabled:opacity-60 focus-ring"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? "กำลังคิดไอเดีย..." : "สร้างไอเดีย"}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>

        {loading && (
          <div className="mb-10">
            <h2 className="font-display text-xl text-ink mb-3">กำลังคิดไอเดียให้คุณ...</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <IdeaCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {!loading && generated.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl text-ink mb-3">ไอเดียใหม่จาก AI</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {generated.map((idea, idx) => (
                <IdeaCard
                  key={idx}
                  idea={{ ...idea, source: "ai" }}
                  onAddToCalendar={() => saveIdea(idea)}
                  addLabel="บันทึกไอเดีย"
                />
              ))}
            </div>
            <p className="text-xs text-inkmuted mt-2">
              กด &quot;ลงปฏิทิน&quot; เพื่อบันทึกไอเดียที่ชอบไว้ในรายการของคุณ
            </p>
          </div>
        )}

        <h2 className="font-display text-xl text-ink mb-3">ไอเดียที่บันทึกไว้ ({savedIdeas.length})</h2>
        {savedIdeas.length === 0 ? (
          <div className="bg-card border border-dashed border-line rounded-card p-6 text-center text-inkmuted text-sm">
            ยังไม่มีไอเดียที่บันทึกไว้ ลองสร้างไอเดียใหม่ด้านบนดูสิ
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {savedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onAddToCalendar={addToCalendar}
                onDelete={deleteIdea}
              />
            ))}
          </div>
        )}
      </main>

      <Notice message={notice} onClose={() => setNotice("")} />
    </div>
  );
}
