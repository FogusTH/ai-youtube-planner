"use client";

import { Trash2 } from "lucide-react";
import { STATUS_ORDER, STATUS_LABELS } from "./StatusBadge";

export default function ContentCard({ item, onUpdate, onDelete }) {
  return (
    <div className="bg-card border border-line rounded-card p-3.5 flex flex-col gap-2">
      <h4 className="font-display text-[15px] leading-snug text-ink">{item.title}</h4>
      {item.description && (
        <p className="text-xs text-inkmuted leading-relaxed line-clamp-2">{item.description}</p>
      )}

      <div className="flex items-center gap-2 mt-1">
        <select
          value={item.status}
          onChange={(e) => onUpdate(item.id, { status: e.target.value })}
          className="text-xs border border-line rounded px-2 py-1.5 bg-paper text-ink focus-ring flex-1"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          onClick={() => onDelete(item.id)}
          className="text-inkmuted hover:text-red-500 transition-colors focus-ring p-1.5 rounded"
          title="ลบ"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <input
        type="date"
        value={item.scheduled_date || ""}
        onChange={(e) => onUpdate(item.id, { scheduled_date: e.target.value })}
        className="text-xs border border-line rounded px-2 py-1.5 bg-paper text-ink focus-ring"
      />
    </div>
  );
}
