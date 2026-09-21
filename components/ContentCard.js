"use client";

import { Trash2, ListPlus } from "lucide-react";
import { STATUS_ORDER, STATUS_LABELS } from "./StatusBadge";

export default function ContentCard({ item, onUpdate, onDelete, onOpenDetail }) {
  return (
    <div className="bg-card border border-line rounded-card p-3.5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-display text-[15px] leading-snug text-ink">{item.title}</h4>
        <button
          onClick={() => onOpenDetail(item)}
          className="text-inkmuted hover:text-navy transition-colors focus-ring p-1 rounded shrink-0"
          title="ดูรายละเอียด / ผลลัพธ์"
        >
          <ListPlus size={15} />
        </button>
      </div>

      {item.series && (
        <span className="self-start text-[11px] text-navy bg-paper px-2 py-0.5 rounded">
          {item.series}
        </span>
      )}

      {item.description && (
        <p className="text-xs text-inkmuted leading-relaxed line-clamp-2">{item.description}</p>
      )}

      {item.status === "posted" && (item.views || item.ctr) ? (
        <p className="text-[11px] text-status-posted">
          {item.views ? `${Number(item.views).toLocaleString()} วิว` : ""}
          {item.views && item.ctr ? " · " : ""}
          {item.ctr ? `CTR ${item.ctr}%` : ""}
        </p>
      ) : null}

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
