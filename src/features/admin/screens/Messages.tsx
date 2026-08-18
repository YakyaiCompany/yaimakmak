import { useState } from "react";
import { DemoMessage, MessageStatus } from "../types";
import { PageHeading } from "../components/PageHeading";
import { StatusBadge } from "../components/StatusBadge";
import { focusRing } from "../utils";

export function Messages({ messages, onOpenMessage, onStatusChange, onUpdateMessage }: { messages: DemoMessage[]; onOpenMessage: (id: string) => void; onStatusChange: (id: string, status: MessageStatus) => void; onUpdateMessage: (id: string, patch: Partial<DemoMessage>) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(messages[0]?.id ?? null);
  const [replySent, setReplySent] = useState(false);
  const selected = messages.find((message) => message.id === selectedId) ?? null;

  const openMessage = (id: string) => {
    onOpenMessage(id);
    setSelectedId(id);
    setReplySent(false);
  };

  const simulateReply = () => {
    if (!selected) return;
    onStatusChange(selected.id, "ติดต่อแล้ว");
    setReplySent(true);
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="การสื่อสาร" title="ข้อความติดต่อ" />
      <p className="-mt-3 text-sm text-slate-500">เก็บข้อมูลจากแบบฟอร์ม พร้อมรายละเอียดโครงการ ผู้รับผิดชอบ นัดติดตาม และบันทึกภายในในรายการเดียว</p>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-semibold text-slate-900">กล่องข้อความ</h2><p className="mt-1 text-xs text-slate-500">{messages.length} รายการ</p></div>
          <div className="divide-y divide-slate-100">
            {messages.map((message) => (
              <article key={message.id} className={`flex flex-col gap-3 px-5 py-4 transition-colors sm:flex-row sm:items-center sm:px-6 ${selectedId === message.id ? "bg-brand-900/5" : "hover:bg-slate-50"}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-slate-800">{message.sender}</h3><StatusBadge status={message.status} /></div>
                  <p className="mt-1 text-sm text-slate-600">{message.subject}</p>
                  <p className="mt-1 text-xs text-slate-500">{message.company} · {message.receivedAt}</p>
                  <p className="mt-2 line-clamp-1 text-xs text-slate-500">{message.interest} · {message.factoryLocation}</p>
                </div>
                <button type="button" onClick={() => openMessage(message.id)} className={`self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-900/5 sm:self-auto ${focusRing}`}>เปิดอ่าน</button>
              </article>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
          <h2 className="font-semibold text-slate-900">รายละเอียดและการติดตาม</h2>
          {selected ? (
            <div className="mt-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{selected.subject}</p><p className="mt-1 text-sm text-slate-500">จาก {selected.sender} · {selected.company}</p></div><StatusBadge status={selected.status} /></div>
              <dl className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {[["เบอร์โทร", selected.phone], ["Email / LINE", selected.contact], ["สนใจ", selected.interest], ["พื้นที่โรงงาน", selected.factoryLocation], ["ขั้นตอนโครงการ", selected.projectStage], ["งบประมาณ", selected.budgetRange], ["ระยะเวลาที่ต้องการ", selected.desiredTimeline], ["ช่องทางที่สะดวก", selected.preferredContact], ["แหล่งที่มา", selected.source]].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-medium leading-5 text-slate-800">{value}</dd></div>)}
              </dl>
              <section className="mt-5"><h3 className="text-xs font-semibold text-slate-500">ข้อความจากลูกค้า</h3><p className="mt-2 text-sm leading-7 text-slate-700">{selected.detail}</p></section>
              <div className="mt-5 grid gap-4">
                <label><span className="mb-2 block text-sm font-medium text-slate-700">สถานะการติดตาม</span><select value={selected.status} onChange={(event) => onStatusChange(selected.id, event.target.value as MessageStatus)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`}><option>ใหม่</option><option>กำลังดำเนินการ</option><option>ติดต่อแล้ว</option><option>ปิดงาน</option><option>สแปม</option></select></label>
                <label><span className="mb-2 block text-sm font-medium text-slate-700">ผู้รับผิดชอบ</span><input value={selected.assignedTo} onChange={(event) => onUpdateMessage(selected.id, { assignedTo: event.target.value })} placeholder="ชื่อหรือทีมที่รับผิดชอบ" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
                <label><span className="mb-2 block text-sm font-medium text-slate-700">วันและเวลาติดตามครั้งถัดไป</span><input type="datetime-local" value={selected.followUpAt} onChange={(event) => onUpdateMessage(selected.id, { followUpAt: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
                <label><span className="mb-2 block text-sm font-medium text-slate-700">บันทึกภายใน</span><textarea rows={4} value={selected.internalNote} onChange={(event) => onUpdateMessage(selected.id, { internalNote: event.target.value })} placeholder="บันทึกข้อมูลที่ต้องขอเพิ่ม ผลการโทร หรือขั้นตอนถัดไป" className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label>
              </div>
              <button type="button" onClick={simulateReply} className={`mt-4 w-full rounded-xl border border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white ${focusRing}`}>บันทึกว่าติดต่อแล้ว</button>
              {replySent && <p role="status" className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">อัปเดตสถานะเป็น “ติดต่อแล้ว”</p>}
            </div>
          ) : <p className="mt-4 text-sm leading-6 text-slate-500">เลือกข้อความเพื่อดูข้อมูลลูกค้าและบันทึกการติดตาม</p>}
        </aside>
      </div>
    </div>
  );
}
