"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STATUS_LABELS } from "./StatusBadge";

const DOT_COLOR = {
  idea: "bg-status-idea",
  script: "bg-status-script",
  shooting: "bg-status-shooting",
  editing: "bg-status-editing",
  posted: "bg-status-posted",
};

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function MonthCalendar({ items, onSelectItem }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const itemsByDate = {};
  for (const item of items) {
    if (!item.scheduled_date) continue;
    const key = item.scheduled_date;
    if (!itemsByDate[key]) itemsByDate[key] = [];
    itemsByDate[key].push(item);
  }

  function dateKey(day) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  function changeMonth(delta) {
    setCursor(new Date(year, month + delta, 1));
  }

  return (
    <div className="bg-card border border-line rounded-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-ink">
          {cursor.toLocaleDateString("th-TH", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 rounded hover:bg-paper text-inkmuted hover:text-ink focus-ring"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 rounded hover:bg-paper text-inkmuted hover:text-ink focus-ring"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-[11px] text-inkmuted text-center py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} className="min-h-[76px]" />;
          const key = dateKey(day);
          const dayItems = itemsByDate[key] || [];
          return (
            <div
              key={idx}
              className="min-h-[76px] border border-line rounded-md p-1.5 flex flex-col gap-1"
            >
              <span className="text-[11px] text-inkmuted">{day}</span>
              {dayItems.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  title={`${item.title} — ${STATUS_LABELS[item.status]}`}
                  className="flex items-center gap-1 text-left focus-ring rounded px-1 py-0.5 hover:bg-paper"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      DOT_COLOR[item.status] || "bg-status-idea"
                    }`}
                  />
                  <span className="text-[10px] text-ink truncate">{item.title}</span>
                </button>
              ))}
              {dayItems.length > 3 && (
                <span className="text-[10px] text-inkmuted">+{dayItems.length - 3} อื่นๆ</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
