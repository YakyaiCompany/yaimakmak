import { ContentBlock } from "../types";

export function FlexibleBlockPreview({ block }: { block: ContentBlock }) {
  const lines = block.content.split("\n").map((line) => line.trim()).filter(Boolean);
  const safeUrl = block.content.trim().startsWith("https://") || block.content.trim().startsWith("/") ? block.content.trim() : "";

  if (block.kind === "รูปภาพ") {
    return <section>{block.title && <h2 className="mb-3 text-xl font-semibold text-slate-900">{block.title}</h2>}{safeUrl ? <img src={safeUrl} alt={block.title || "ภาพประกอบ"} className="w-full rounded-2xl object-cover" /> : <div className="grid min-h-44 place-items-center rounded-2xl bg-slate-100 text-sm text-slate-500">รอ URL รูปภาพที่ถูกต้อง</div>}</section>;
  }

  if (block.kind === "วิดีโอ") {
    return <section className="rounded-2xl border border-slate-200 p-5">{block.title && <h2 className="text-xl font-semibold text-slate-900">{block.title}</h2>}<p className="mt-2 text-sm text-slate-600">{safeUrl ? "มีวิดีโอแนบพร้อมเปิดในหน้าจริง" : "รอ URL วิดีโอที่ถูกต้อง"}</p>{safeUrl && <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white">เปิดวิดีโอ</a>}</section>;
  }

  if (block.kind === "ปุ่ม/ลิงก์") {
    const [label = "ดูข้อมูลเพิ่มเติม", rawUrl = ""] = block.content.split("|").map((value) => value.trim());
    const linkUrl = rawUrl.startsWith("https://") || rawUrl.startsWith("/") ? rawUrl : "";
    return <section>{block.title && <h2 className="mb-3 text-xl font-semibold text-slate-900">{block.title}</h2>}<span className={`inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold ${linkUrl ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-400"}`}>{label}</span></section>;
  }

  if (block.kind === "รายการ") {
    return <section>{block.title && <h2 className="mb-3 text-xl font-semibold text-slate-900">{block.title}</h2>}<ul className="space-y-2">{lines.map((line, index) => <li key={`${block.id}-${index}`} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="text-brand-700">✓</span>{line}</li>)}</ul></section>;
  }

  return <section>{block.title && <h2 className="mb-3 text-xl font-semibold text-slate-900">{block.title}</h2>}<div className="space-y-3">{block.content.split("\n\n").filter(Boolean).map((paragraph, index) => <p key={`${block.id}-${index}`} className="text-sm leading-7 text-slate-700">{paragraph}</p>)}</div></section>;
}
