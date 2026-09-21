"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ContentDetailModal from "@/components/ContentDetailModal";
import { TrendingUp, ListPlus } from "lucide-react";

export default function ResultsPage() {
  const [items, setItems] = useState([]);
  const [detailItem, setDetailItem] = useState(null);

  async function load() {
    const res = await fetch("/api/content");
    const data = await res.json();
    if (res.ok) setItems((data.items || []).filter((i) => i.status === "posted"));
  }

  useEffect(() => {
    load();
  }, []);

  async function updateItem(id, updates) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    await fetch(`/api/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  const sorted = useMemo(
    () => [...items].sort((a, b) => (b.views || 0) - (a.views || 0)),
    [items]
  );

  const bestSeries = useMemo(() => {
    const groups = {};
    for (const i of items) {
      if (!i.series || !i.views) continue;
      if (!groups[i.series]) groups[i.series] = { total: 0, count: 0 };
      groups[i.series].total += Number(i.views);
      groups[i.series].count += 1;
    }
    const entries = Object.entries(groups).map(([series, v]) => ({
      series,
      avg: Math.round(v.total / v.count),
    }));
    entries.sort((a, b) => b.avg - a.avg);
    return entries[0];
  }, [items]);

  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      <main className="flex-1 px-5 md:px-10 py-8 max-w-4xl">
        <h1 className="font-display text-3xl text-ink mb-1">ผลลัพธ์</h1>
        <p className="text-inkmuted mb-6">
          บันทึกยอดวิวและ CTR หลังโพสต์ เพื่อดูว่าไอเดียหรือซีรีส์แบบไหนเวิร์กจริง
        </p>

        {bestSeries && (
          <div className="bg-card border border-line rounded-card p-4 mb-6 flex items-center gap-3">
            <TrendingUp size={20} className="text-status-posted shrink-0" />
            <p className="text-sm text-ink">
              ซีรีส์ที่ทำผลงานดีที่สุดตอนนี้คือ{" "}
              <span className="font-medium">{bestSeries.series}</span> — เฉลี่ย{" "}
              {bestSeries.avg.toLocaleString()} วิวต่อคลิป
            </p>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="bg-card border border-dashed border-line rounded-card p-6 text-center text-inkmuted text-sm">
            ยังไม่มีคอนเทนต์ที่โพสต์แล้ว — พอเปลี่ยนสถานะเป็น &quot;โพสต์แล้ว&quot; ในหน้าปฏิทิน จะมาโชว์ที่นี่
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sorted.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-line rounded-card p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-ink font-medium text-sm truncate">{item.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {item.series && (
                      <span className="text-[11px] text-navy bg-paper px-2 py-0.5 rounded">
                        {item.series}
                      </span>
                    )}
                    <span className="text-xs text-inkmuted">
                      {item.views ? `${Number(item.views).toLocaleString()} วิว` : "ยังไม่บันทึกยอดวิว"}
                      {item.ctr ? ` · CTR ${item.ctr}%` : ""}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDetailItem(item)}
                  className="shrink-0 flex items-center gap-1.5 text-sm text-navy hover:text-amber transition-colors focus-ring px-2 py-1.5 rounded"
                >
                  <ListPlus size={15} />
                  บันทึกผลลัพธ์
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {detailItem && (
        <ContentDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onUpdate={updateItem}
        />
      )}
    </div>
  );
}
