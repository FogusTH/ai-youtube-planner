"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ContentCard from "@/components/ContentCard";
import { STATUS_ORDER, STATUS_LABELS } from "@/components/StatusBadge";
import { Plus } from "lucide-react";

export default function CalendarPage() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");

  async function load() {
    const res = await fetch("/api/content");
    const data = await res.json();
    if (res.ok) setItems(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addItem(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status: "idea" }),
    });
    setTitle("");
    setShowForm(false);
    load();
  }

  async function updateItem(id, updates) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    await fetch(`/api/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function deleteItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/content/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      <main className="flex-1 px-5 md:px-10 py-8">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <h1 className="font-display text-3xl text-ink">ปฏิทินคอนเทนต์</h1>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 bg-navy text-white rounded-md px-3.5 py-2 text-sm font-medium hover:bg-navydeep transition-colors focus-ring"
          >
            <Plus size={16} /> เพิ่มงานใหม่
          </button>
        </div>
        <p className="text-inkmuted mb-6">ลากสถานะงานผ่านแต่ละขั้นตอนตั้งแต่ไอเดียจนถึงโพสต์จริง</p>

        {showForm && (
          <form onSubmit={addItem} className="flex gap-2 mb-6 max-w-md">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ชื่อคอนเทนต์"
              className="flex-1 border border-line rounded-md px-3 py-2 text-sm focus-ring bg-white"
            />
            <button
              type="submit"
              className="bg-amber text-navydeep font-medium rounded-md px-4 py-2 text-sm hover:brightness-95 transition focus-ring"
            >
              เพิ่ม
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STATUS_ORDER.map((status) => {
            const columnItems = items.filter((i) => i.status === status);
            return (
              <div key={status} className="min-w-0">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-sm font-medium text-ink">{STATUS_LABELS[status]}</h3>
                  <span className="text-xs text-inkmuted">{columnItems.length}</span>
                </div>
                <div className="flex flex-col gap-2 min-h-[80px]">
                  {columnItems.map((item) => (
                    <ContentCard
                      key={item.id}
                      item={item}
                      onUpdate={updateItem}
                      onDelete={deleteItem}
                    />
                  ))}
                  {columnItems.length === 0 && (
                    <div className="border border-dashed border-line rounded-card p-3 text-center text-xs text-inkmuted">
                      ไม่มีงาน
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
