"use client";

import { Sparkles, Plus, Trash2, Film, Zap, Radio } from "lucide-react";

const TYPE_META = {
  video: { label: "คลิปยาว", icon: Film },
  shorts: { label: "Shorts", icon: Zap },
  stream: { label: "สตรีม", icon: Radio },
};

export default function IdeaCard({ idea, onAddToCalendar, onDelete, addLabel = "ลงปฏิทิน" }) {
  const type = TYPE_META[idea.content_type] || TYPE_META.video;
  const TypeIcon = type.icon;

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
      <div className="flex items-center justify-between mt-1 flex-wrap gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-inkmuted bg-paper px-2 py-1 rounded">{idea.category}</span>
          <span
            title={type.label}
            className="text-xs flex items-center gap-1 text-inkmuted bg-paper px-2 py-1 rounded"
          >
            <TypeIcon size={12} /> {type.label}
          </span>
        </div>
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
