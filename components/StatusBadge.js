const LABELS = {
  idea: "ไอเดีย",
  script: "เขียนสคริปต์",
  shooting: "ถ่ายทำ",
  editing: "ตัดต่อ",
  posted: "โพสต์แล้ว",
};

const DOT_COLOR = {
  idea: "bg-status-idea",
  script: "bg-status-script",
  shooting: "bg-status-shooting",
  editing: "bg-status-editing",
  posted: "bg-status-posted",
};

export default function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-ink">
      <span className={`w-2 h-2 rounded-full ${DOT_COLOR[status] || "bg-status-idea"}`} />
      {LABELS[status] || status}
    </span>
  );
}

export const STATUS_ORDER = ["idea", "script", "shooting", "editing", "posted"];
export const STATUS_LABELS = LABELS;
