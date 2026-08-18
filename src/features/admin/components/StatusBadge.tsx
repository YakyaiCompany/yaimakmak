import { ContentStatus, MessageStatus } from "../types";

export function StatusBadge({ status }: { status: ContentStatus | MessageStatus }) {
  const style = status === "เผยแพร่" || status === "ติดต่อแล้ว" || status === "ปิดงาน"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
    : status === "กำหนดเผยแพร่"
      ? "bg-violet-50 text-violet-700 ring-violet-600/15"
      : status === "ใหม่"
        ? "bg-amber-50 text-amber-700 ring-amber-600/15"
        : status === "กำลังดำเนินการ"
          ? "bg-blue-50 text-blue-700 ring-blue-600/15"
          : status === "สแปม"
            ? "bg-rose-50 text-rose-700 ring-rose-600/15"
            : "bg-slate-100 text-slate-600 ring-slate-500/15";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}>{status}</span>;
}
