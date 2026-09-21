"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export default function Notice({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 2600);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className="fixed inset-0 bg-navydeep/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-card p-5 max-w-xs w-full flex flex-col items-center text-center gap-2 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CheckCircle2 size={28} className="text-status-posted" />
        <p className="text-sm text-ink leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="mt-1 text-xs text-navy hover:text-amber transition-colors focus-ring px-3 py-1.5 rounded"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
