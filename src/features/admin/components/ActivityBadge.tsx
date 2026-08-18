import { ActivityAction } from "../types";

export function ActivityBadge({ action }: { action: ActivityAction }) {
  const style = action === "เพิ่ม"
    ? "bg-blue-50 text-blue-700 ring-blue-600/15"
    : action === "แก้ไข"
      ? "bg-amber-50 text-amber-700 ring-amber-600/15"
      : action === "เผยแพร่"
        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
        : action === "กำหนดเผยแพร่"
          ? "bg-violet-50 text-violet-700 ring-violet-600/15"
          : action === "ยกเลิกเผยแพร่"
            ? "bg-slate-100 text-slate-700 ring-slate-500/15"
            : "bg-rose-50 text-rose-700 ring-rose-600/15";

  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}>{action}</span>;
}
