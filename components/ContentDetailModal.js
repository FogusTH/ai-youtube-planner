"use client";

import { useState } from "react";
import {
  X,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  Film,
  Zap,
  Radio,
  Scissors,
} from "lucide-react";

const CONTENT_TYPES = [
  { value: "video", label: "คลิปยาว", icon: Film },
  { value: "shorts", label: "Shorts", icon: Zap },
  { value: "stream", label: "สตรีม", icon: Radio },
];

export default function ContentDetailModal({ item, onClose, onUpdate, onClipCreated }) {
  const [form, setForm] = useState({
    content_type: item.content_type || "video",
    alt_titles: item.alt_titles || "",
    thumbnail_idea: item.thumbnail_idea || "",
    hook_notes: item.hook_notes || "",
    cta_notes: item.cta_notes || "",
    series: item.series || "",
    youtube_video_id: item.youtube_video_id || "",
    youtube_description: item.youtube_description || "",
    youtube_tags: item.youtube_tags || "",
    stream_time: item.stream_time || "",
    stream_topic: item.stream_topic || "",
    stream_highlights: item.stream_highlights || "",
    views: item.views ?? "",
    ctr: item.ctr ?? "",
    retention_notes: item.retention_notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  const [seoLoading, setSeoLoading] = useState(false);
  const [seoError, setSeoError] = useState("");
  const [seoTitles, setSeoTitles] = useState([]);
  const [copiedTitleIdx, setCopiedTitleIdx] = useState(null);

  const [clipping, setClipping] = useState(false);
  const [clipMsg, setClipMsg] = useState("");

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSync() {
    if (!form.youtube_video_id) {
      setSyncMsg("กรุณาใส่ลิงก์หรือรหัสวิดีโอ YouTube ก่อน");
      return;
    }
    setSyncing(true);
    setSyncMsg("");

    const res = await fetch("/api/youtube/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentItemId: item.id, videoId: form.youtube_video_id }),
    });
    const data = await res.json();
    setSyncing(false);

    if (!res.ok) {
      setSyncMsg(data.error || "ดึงข้อมูลไม่สำเร็จ");
      return;
    }

    setForm((f) => ({ ...f, views: data.stats.views, youtube_video_id: data.stats.videoId }));
    await onUpdate(item.id, { views: data.stats.views, youtube_video_id: data.stats.videoId });
    setSyncMsg(`อัปเดตแล้ว: ${data.stats.views.toLocaleString()} วิว — "${data.stats.title}"`);
  }

  async function handleGenerateSeo() {
    setSeoLoading(true);
    setSeoError("");

    const res = await fetch("/api/youtube/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentItemId: item.id }),
    });
    const data = await res.json();
    setSeoLoading(false);

    if (!res.ok) {
      setSeoError(data.error || "สร้าง SEO ไม่สำเร็จ");
      return;
    }

    setSeoTitles(data.meta.titles || []);
    setForm((f) => ({
      ...f,
      youtube_description: data.meta.description || f.youtube_description,
      youtube_tags: Array.isArray(data.meta.tags) ? data.meta.tags.join(", ") : f.youtube_tags,
    }));
  }

  function copyTitle(title, idx) {
    navigator.clipboard?.writeText(title).catch(() => {});
    setCopiedTitleIdx(idx);
    setTimeout(() => setCopiedTitleIdx(null), 1500);
  }

  async function handleCreateClip() {
    if (!form.stream_highlights.trim()) {
      setClipMsg("กรุณาบันทึกไฮไลต์จากสตรีมก่อน");
      return;
    }
    setClipping(true);
    setClipMsg("");

    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Shorts จากสตรีม: ${item.title}`,
        description: form.stream_highlights,
        status: "idea",
        content_type: "shorts",
        source_stream_id: item.id,
      }),
    });
    const data = await res.json();
    setClipping(false);

    if (!res.ok) {
      setClipMsg(data.error || "สร้างคลิปสั้นไม่สำเร็จ");
      return;
    }

    setClipMsg("สร้างคลิปสั้นใหม่แล้ว! ไปแก้ไขต่อได้ที่คอลัมน์ไอเดียในปฏิทิน");
    onClipCreated?.(data.item);
  }

  async function handleSave() {
    setSaving(true);
    await onUpdate(item.id, {
      content_type: form.content_type,
      alt_titles: form.alt_titles,
      thumbnail_idea: form.thumbnail_idea,
      hook_notes: form.hook_notes,
      cta_notes: form.cta_notes,
      series: form.series,
      youtube_video_id: form.youtube_video_id,
      youtube_description: form.youtube_description,
      youtube_tags: form.youtube_tags,
      stream_time: form.stream_time,
      stream_topic: form.stream_topic,
      stream_highlights: form.stream_highlights,
      views: form.views === "" ? null : Number(form.views),
      ctr: form.ctr === "" ? null : Number(form.ctr),
      retention_notes: form.retention_notes,
    });
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-navydeep/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-card w-full max-w-lg max-h-[85vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-display text-lg text-ink leading-snug">{item.title}</h3>
          <button
            onClick={onClose}
            className="text-inkmuted hover:text-ink focus-ring p-1 rounded shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex border border-line rounded-md overflow-hidden w-fit mb-4">
          {CONTENT_TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("content_type", value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs focus-ring ${
                form.content_type === value
                  ? "bg-navy text-white"
                  : "bg-white text-inkmuted hover:text-ink"
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <section>
            <h4 className="text-xs font-medium text-inkmuted uppercase tracking-wide mb-2">
              ก่อนถ่าย/ตัด
            </h4>
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="text-xs text-ink block mb-1">ชื่อคลิปสำรอง (แยกบรรทัด)</label>
                <textarea
                  value={form.alt_titles}
                  onChange={(e) => set("alt_titles", e.target.value)}
                  rows={2}
                  placeholder="เช่น ชื่ออื่นที่อยากทดสอบ A/B"
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-ink block mb-1">ไอเดียภาพปก (Thumbnail)</label>
                <input
                  value={form.thumbnail_idea}
                  onChange={(e) => set("thumbnail_idea", e.target.value)}
                  placeholder="เช่น หน้าตกใจ + ตัวเลขใหญ่ พื้นหลังสีแดง"
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-ink block mb-1">Hook เปิดคลิป (5-10 วิแรก)</label>
                <textarea
                  value={form.hook_notes}
                  onChange={(e) => set("hook_notes", e.target.value)}
                  rows={2}
                  placeholder="จะเปิดคลิปยังไงให้คนไม่กดออก"
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-ink block mb-1">Call-to-action ท้ายคลิป</label>
                <input
                  value={form.cta_notes}
                  onChange={(e) => set("cta_notes", e.target.value)}
                  placeholder="เช่น ชวนดูคลิปต่อไปเรื่อง X"
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-ink block mb-1">ซีรีส์ / เพลย์ลิสต์</label>
                <input
                  value={form.series}
                  onChange={(e) => set("series", e.target.value)}
                  placeholder="เช่น Minecraft 100 Days"
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white"
                />
              </div>
            </div>
          </section>

          {form.content_type === "stream" && (
            <section>
              <h4 className="text-xs font-medium text-inkmuted uppercase tracking-wide mb-2">
                ตารางสตรีม
              </h4>
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                <div>
                  <label className="text-xs text-ink block mb-1">เวลาไลฟ์</label>
                  <input
                    type="time"
                    value={form.stream_time}
                    onChange={(e) => set("stream_time", e.target.value)}
                    className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink block mb-1">หัวข้อ/เกมที่จะเล่น</label>
                  <input
                    value={form.stream_topic}
                    onChange={(e) => set("stream_topic", e.target.value)}
                    placeholder="เช่น Valorant แรงค์, พูดคุยฟรีสไตล์"
                    className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white"
                  />
                </div>
              </div>

              <label className="text-xs text-ink block mb-1">
                บันทึกไฮไลต์จากสตรีม (เพื่อตัดเป็นคลิปสั้นทีหลัง)
              </label>
              <textarea
                value={form.stream_highlights}
                onChange={(e) => set("stream_highlights", e.target.value)}
                rows={3}
                placeholder="เช่น นาที 23:00 มีมุกฮาเกี่ยวกับ..., นาที 1:10:00 คลัตช์เกม..."
                className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white resize-none mb-2"
              />
              <button
                onClick={handleCreateClip}
                disabled={clipping}
                type="button"
                className="flex items-center gap-1.5 bg-amber text-navydeep text-xs font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60 focus-ring"
              >
                <Scissors size={13} />
                {clipping ? "กำลังสร้าง..." : "ตัดเป็นคลิปสั้นจากไฮไลต์นี้"}
              </button>
              {clipMsg && <p className="text-xs text-inkmuted mt-1.5">{clipMsg}</p>}
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-inkmuted uppercase tracking-wide">
                SEO สำหรับ YouTube (ช่วยให้ถูกแนะนำมากขึ้น)
              </h4>
              <button
                onClick={handleGenerateSeo}
                disabled={seoLoading}
                type="button"
                className="shrink-0 flex items-center gap-1.5 bg-amber text-navydeep text-xs font-medium px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60 focus-ring"
              >
                <Sparkles size={13} className={seoLoading ? "animate-pulse" : ""} />
                {seoLoading ? "กำลังคิด..." : "ให้ AI ช่วยคิด"}
              </button>
            </div>

            {seoError && <p className="text-xs text-status-posted mb-2">{seoError}</p>}

            {seoTitles.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-ink block mb-1">ชื่อคลิปแนะนำ (กดเพื่อคัดลอก)</label>
                <div className="flex flex-col gap-1.5">
                  {seoTitles.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => copyTitle(t, idx)}
                      className="flex items-start gap-2 text-left text-xs bg-paper border border-line rounded-md px-2.5 py-2 hover:bg-white transition-colors focus-ring"
                    >
                      {copiedTitleIdx === idx ? (
                        <Check size={13} className="shrink-0 mt-0.5 text-status-posted" />
                      ) : (
                        <Copy size={13} className="shrink-0 mt-0.5 text-inkmuted" />
                      )}
                      <span className="text-ink">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <div>
                <label className="text-xs text-ink block mb-1">คำอธิบายใต้คลิป (Description)</label>
                <textarea
                  value={form.youtube_description}
                  onChange={(e) => set("youtube_description", e.target.value)}
                  rows={5}
                  placeholder='กดปุ่ม "ให้ AI ช่วยคิด" ด้านบน หรือพิมพ์เองที่นี่'
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-ink block mb-1">แท็ก (คั่นด้วยคอมมา)</label>
                <textarea
                  value={form.youtube_tags}
                  onChange={(e) => set("youtube_tags", e.target.value)}
                  rows={2}
                  placeholder="เช่น ทำอาหาร, สูตรง่ายๆ, วิธีทำ"
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white resize-none"
                />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-medium text-inkmuted uppercase tracking-wide mb-2">
              เชื่อมต่อ YouTube
            </h4>
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="text-xs text-ink block mb-1">ลิงก์หรือรหัสวิดีโอ YouTube</label>
                <div className="flex gap-2">
                  <input
                    value={form.youtube_video_id}
                    onChange={(e) => set("youtube_video_id", e.target.value)}
                    placeholder="เช่น https://youtu.be/xxxxxxxxxxx"
                    className="flex-1 border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white"
                  />
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    type="button"
                    className="shrink-0 flex items-center gap-1.5 bg-navy text-white text-xs font-medium px-3 py-2 rounded-md hover:bg-navydeep transition-colors disabled:opacity-60 focus-ring"
                  >
                    <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
                    {syncing ? "กำลังดึง..." : "ดึงยอดวิวล่าสุด"}
                  </button>
                </div>
                {syncMsg && <p className="text-xs text-inkmuted mt-1.5">{syncMsg}</p>}
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-medium text-inkmuted uppercase tracking-wide mb-2">
              ผลลัพธ์หลังโพสต์
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-ink block mb-1">ยอดวิว</label>
                <input
                  type="number"
                  value={form.views}
                  onChange={(e) => set("views", e.target.value)}
                  placeholder="0"
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white"
                />
                <p className="text-[11px] text-inkmuted mt-1">
                  ดึงอัตโนมัติได้จากช่อง &quot;เชื่อมต่อ YouTube&quot; ด้านบน หรือกรอกเองก็ได้
                </p>
              </div>
              <div>
                <label className="text-xs text-ink block mb-1">CTR (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.ctr}
                  onChange={(e) => set("ctr", e.target.value)}
                  placeholder="0.0"
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white"
                />
                <p className="text-[11px] text-inkmuted mt-1">
                  YouTube ไม่เปิดให้ดึงอัตโนมัติ ต้องกรอกเองจาก YouTube Studio
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-ink block mb-1">
                  บันทึก Retention / สิ่งที่เรียนรู้
                </label>
                <textarea
                  value={form.retention_notes}
                  onChange={(e) => set("retention_notes", e.target.value)}
                  rows={2}
                  placeholder="เช่น คนหลุดช่วงนาทีที่ 2, ไอเดียแบบนี้เวิร์กเพราะ..."
                  className="w-full border border-line rounded-md px-2.5 py-2 text-sm focus-ring bg-white resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="text-sm text-inkmuted hover:text-ink px-3 py-2 rounded-md focus-ring"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-navy text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-navydeep transition-colors disabled:opacity-60 focus-ring"
          >
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}
