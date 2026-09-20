"use client";

import { Sparkles, Plus, Trash2 } from "lucide-react";

export default function IdeaCard({ idea, onAddToCalendar, onDelete, addLabel = "ลงปฏิทิน" }) {
  return (
    <div className="bg-card border-l-[3px] border-l-amber border border-line rounded-card p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-[17px] leading-snug text-ink">{idea.title}</h3>
        {idea.source === "ai" && (
          <span title="สร้างโดย AI" className="shrink-0 text-amber">
            <Sparkles size={15} />
          </span>
        )}
      </div>
      {idea.description && (
        <p className="text-sm text-inkmuted leading-relaxed">{idea.description}</p>
      )}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-inkmuted bg-paper px-2 py-1 rounded">{idea.category}</span>
        <div className="flex items-center gap-1">
          {onAddToCalendar && (
            <button
              onClick={() => onAddToCalendar(idea)}
              className="text-xs flex items-center gap-1 text-navy hover:text-amber transition-colors focus-ring px-2 py-1 rounded"
              title="เพิ่มลงปฏิทิน"
            >
              <Plus size={14} /> {addLabel}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(idea.id)}
              className="text-inkmuted hover:text-red-500 transition-colors focus-ring p-1 rounded"
              title="ลบไอเดีย"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
