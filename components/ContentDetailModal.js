"use client";

import { useState } from "react";
import { X, RefreshCw } from "lucide-react";

export default function ContentDetailModal({ item, onClose, onUpdate }) {
  const [form, setForm] = useState({
    alt_titles: item.alt_titles || "",
    thumbnail_idea: item.thumbnail_idea || "",
    hook_notes: item.hook_notes || "",
    cta_notes: item.cta_notes || "",
    series: item.series || "",
    youtube_video_id: item.youtube_video_id || "",
    views: item.views ?? "",
    ctr: item.ctr ?? "",
    retention_notes: item.retention_notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

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

  async function handleSave() {
    setSaving(true);
    await onUpdate(item.id, {
      alt_titles: form.alt_titles,
      thumbnail_idea: form.thumbnail_idea,
      hook_notes: form.hook_notes,
      cta_notes: form.cta_notes,
      series: form.series,
      youtube_video_id: form.youtube_video_id,
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
        <div className="flex items-start justify-between gap-2 mb-4">
          <h3 className="font-display text-lg text-ink leading-snug">{item.title}</h3>
          <button
            onClick={onClose}
            className="text-inkmuted hover:text-ink focus-ring p-1 rounded shrink-0"
          >
            <X size={18} />
          </button>
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