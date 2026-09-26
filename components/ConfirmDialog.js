"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "ยืนยันการลบ",
  message,
  confirmLabel = "ลบ",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-navydeep/40 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-card rounded-card p-5 max-w-xs w-full flex flex-col items-center text-center gap-2 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertTriangle size={28} className="text-amber" />
        <h3 className="font-display text-lg text-ink">{title}</h3>
        {message && <p className="text-sm text-inkmuted leading-relaxed">{message}</p>}

        <div className="flex gap-2 mt-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 text-sm text-inkmuted hover:text-ink border border-line rounded-md py-2 focus-ring transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md py-2 focus-ring transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
