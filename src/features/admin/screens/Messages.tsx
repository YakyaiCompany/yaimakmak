import { useEffect, useState } from "react";
import { DemoMessage, MessageStatus } from "../types";
import { PageHeading } from "../components/PageHeading";
import { StatusBadge } from "../components/StatusBadge";
import { focusRing } from "../utils";

export function Messages({ messages, assignees, onOpenMessage, onStatusChange, onUpdateMessage }: {
  messages: DemoMessage[];
  assignees: Array<{ id: string; email: string; role: string }>;
  onOpenMessage: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: MessageStatus) => Promise<void>;
  onUpdateMessage: (id: string, patch: Partial<DemoMessage>) => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DemoMessage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const selected = messages.find((message) => message.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId && messages[0]) { setSelectedId(messages[0].id); setDraft(messages[0]); }
    if (selected && !draft) setDraft(selected);
  }, [draft, messages, selected, selectedId]);

  const openMessage = async (message: DemoMessage) => {
    setError(""); setNotice(""); setSelectedId(message.id);
    setDraft(message);
    try { await onOpenMessage(message.id); }
    catch (openError) { setError(openError instanceof Error ? openError.message : "ไม่สามารถเปิดข้อความได้"); }
  };

  const saveStatus = async (status: MessageStatus) => {
    if (!draft) return;
    setIsSaving(true); setError("");
    try { await onStatusChange(draft.id, status); setDraft((current) => current ? { ...current, status } : current); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : "ไม่สามารถอัปเดตสถานะได้"); }
    finally { setIsSaving(false); }
  };

  const saveFollowUp = async () => {
    if (!draft) return;
    setIsSaving(true); setError(""); setNotice("");
    try {
      await onUpdateMessage(draft.id, { assignedToUserId: draft.assignedToUserId ?? null, followUpAt: draft.followUpAt, internalNote: draft.internalNote });
      setNotice("บันทึกผู้รับผิดชอบ วันติดตาม และบันทึกภายในแล้ว");
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "ไม่สามารถบันทึกการติดตามได้"); }
    finally { setIsSaving(false); }
  };

  return <div className="space-y-6">
    <PageHeading eyebrow="การสื่อสาร" title="ข้อความติดต่อ" />
    <p className="-mt-3 text-sm text-slate-500">สถานะ ผู้รับผิดชอบ วันติดตาม และบันทึกภายในจะบันทึกลงฐานข้อมูลของลีด</p>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-semibold text-slate-900">กล่องข้อความ</h2><p className="mt-1 text-xs text-slate-500">{messages.length} รายการ</p></div><div className="divide-y divide-slate-100">{messages.map((message) => <article key={message.id} className={`flex flex-col gap-3 px-5 py-4 transition-colors sm:flex-row sm:items-center sm:px-6 ${selectedId === message.id ? "bg-brand-900/5" : "hover:bg-slate-50"}`}><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-slate-800">{message.sender}</h3><StatusBadge status={message.status} /></div><p className="mt-1 text-sm text-slate-600">{message.subject}</p><p className="mt-1 text-xs text-slate-500">{message.company} · {message.receivedAt}</p></div><button type="button" onClick={() => void openMessage(message)} className={`self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-900/5 sm:self-auto ${focusRing}`}>เปิดอ่าน</button></article>)}{!messages.length && <p className="px-5 py-10 text-center text-sm text-slate-500">ยังไม่มีข้อความติดต่อ</p>}</div></section>
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">{draft ? <div><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-base font-semibold text-slate-900">{draft.subject}</h2><p className="mt-1 text-sm text-slate-500">จาก {draft.sender} · {draft.company}</p></div><StatusBadge status={draft.status} /></div><dl className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm"><div><dt className="text-xs text-slate-500">ช่องทางติดต่อ</dt><dd className="mt-1 font-medium text-slate-800">{draft.phone} · {draft.contact}</dd></div><div><dt className="text-xs text-slate-500">แหล่งที่มา</dt><dd className="mt-1 font-medium text-slate-800">{draft.source}</dd></div></dl><section className="mt-5"><h3 className="text-xs font-semibold text-slate-500">ข้อความจากลูกค้า</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{draft.detail}</p></section><div className="mt-5 grid gap-4"><label><span className="mb-2 block text-sm font-medium text-slate-700">สถานะการติดตาม</span><select disabled={isSaving} value={draft.status} onChange={(event) => void saveStatus(event.target.value as MessageStatus)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`}><option>ใหม่</option><option>กำลังดำเนินการ</option><option>ติดต่อแล้ว</option><option>ปิดงาน</option><option>สแปม</option></select></label><label><span className="mb-2 block text-sm font-medium text-slate-700">ผู้รับผิดชอบ</span><select value={draft.assignedToUserId ?? ""} onChange={(event) => setDraft((current) => current ? { ...current, assignedToUserId: event.target.value || null } : current)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`}><option value="">ยังไม่มอบหมาย</option>{assignees.map((user) => <option key={user.id} value={user.id}>{user.email} ({user.role})</option>)}</select></label><label><span className="mb-2 block text-sm font-medium text-slate-700">วันและเวลาติดตามครั้งถัดไป</span><input type="datetime-local" value={draft.followUpAt} onChange={(event) => setDraft((current) => current ? { ...current, followUpAt: event.target.value } : current)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">บันทึกภายใน</span><textarea rows={5} value={draft.internalNote} onChange={(event) => setDraft((current) => current ? { ...current, internalNote: event.target.value } : current)} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label></div>{error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-800">{error}</p>}{notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">{notice}</p>}<button type="button" onClick={() => void saveFollowUp()} disabled={isSaving} className={`mt-4 w-full rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50 ${focusRing}`}>{isSaving ? "กำลังบันทึก..." : "บันทึกการติดตาม"}</button></div> : <p className="text-sm text-slate-500">เลือกข้อความเพื่อดูรายละเอียด</p>}</aside>
    </div>
  </div>;
}
