import { useState, useMemo } from "react";
import {
  ContentType,
  ContentItem,
  ContentActivity,
  ContentStatus,
  ContentBlock,
  ContentBlockKind,
} from "../types";
import { PageHeading } from "../components/PageHeading";
import { ActivityBadge } from "../components/ActivityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { FlexibleBlockPreview } from "../components/FlexibleBlockPreview";
import { contentTypeLabel, emptyContent, focusRing } from "../utils";
import { postFormData } from "../../../lib/api";

export function ContentManager({
  type,
  items,
  latestActivity,
  onSave,
  onDelete,
  externalError,
}: {
  type: ContentType;
  items: ContentItem[];
  latestActivity?: ContentActivity;
  onSave: (item: ContentItem) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  externalError?: string;
}) {
  const title = contentTypeLabel(type);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "ทั้งหมด">(
    "ทั้งหมด",
  );
  const [draft, setDraft] = useState<ContentItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesQuery =
          item.title.toLowerCase().includes(query.trim().toLowerCase()) ||
          item.category.toLowerCase().includes(query.trim().toLowerCase());
        const matchesStatus =
          statusFilter === "ทั้งหมด" || item.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [items, query, statusFilter],
  );

  const openEditor = (item: ContentItem) => {
    setNotice("");
    setError("");
    setDraft({ ...item });
  };

  const openPreview = (item: ContentItem) => {
    setNotice("");
    setError("");
    setDraft({ ...item });
    setPreviewOpen(true);
  };

  const duplicate = async (item: ContentItem) => {
    setError("");
    setIsSaving(true);
    try {
      await onSave({
        ...item,
        id: `new-${type}-${Date.now()}`,
        slug: `${item.slug || type}-copy-${Date.now()}`,
        title: `${item.title} (สำเนา)`,
        status: "ร่าง",
        updatedAt: "เมื่อสักครู่",
      });
      setNotice(`สร้างสำเนา${title}เป็นร่างแล้ว`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ไม่สามารถสร้างสำเนาได้",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (item: ContentItem) => {
    if (!window.confirm(`ต้องการลบ "${item.title}" หรือไม่?`)) return;
    setError("");
    setIsSaving(true);
    try {
      await onDelete(item.id);
      setNotice(`ลบ${title}แล้ว`);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "ไม่สามารถลบรายการได้",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const save = async (status: ContentStatus) => {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("กรุณากรอกหัวข้อก่อนบันทึก");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      await onSave({
        ...draft,
        status,
        updatedAt: "เมื่อสักครู่",
        author: "ผู้ดูแลระบบ",
      });
      setNotice(
        status === "เผยแพร่" ? "เผยแพร่เนื้อหาแล้ว" : "บันทึกเนื้อหาเป็นร่างแล้ว",
      );
      setPreviewOpen(false);
      setDraft(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ไม่สามารถบันทึกเนื้อหาได้",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (draft) {
    return (
      <>
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
          >
            {error}
          </p>
        )}
        <ContentEditor
          type={type}
          item={draft}
          onChange={(patch) =>
            setDraft((current) =>
              current ? { ...current, ...patch } : current,
            )
          }
          onBack={() => {
            setPreviewOpen(false);
            setDraft(null);
          }}
          onSaveDraft={() => void save("ร่าง")}
          onPreview={() => setPreviewOpen(true)}
          isSaving={isSaving}
        />
        {previewOpen && (
          <ContentPreview
            type={type}
            item={draft}
            onClose={() => setPreviewOpen(false)}
            onPublish={() => save("เผยแพร่")}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="จัดการเนื้อหา" title={title}>
        <button
          type="button"
          onClick={() => openEditor(emptyContent(type))}
          className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}
        >
          เพิ่ม{title}
        </button>
      </PageHeading>
      {notice && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          {notice}
        </p>
      )}
      {(error || externalError) && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
        >
          {error || externalError}
        </p>
      )}
      {latestActivity && (
        <section className="flex flex-col gap-3 rounded-2xl border border-energy-600/20 bg-energy-600/[0.06] px-4 py-3.5 sm:flex-row sm:items-center">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-energy-600 ring-4 ring-energy-600/10" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-energy-600">
                เปลี่ยนแปลงล่าสุด
              </span>
              <ActivityBadge action={latestActivity.action} />
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-slate-800">
              {latestActivity.title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {latestActivity.at} · {latestActivity.actor}
            </p>
          </div>
        </section>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="block min-w-0 flex-1">
          <span className="sr-only">ค้นหา{title}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`ค้นหา${title}หรือหมวดหมู่...`}
            className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 ${focusRing}`}
          />
        </label>
        <label>
          <span className="sr-only">กรองสถานะ</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ContentStatus | "ทั้งหมด")
            }
            className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm sm:w-44 ${focusRing}`}
          >
            <option>ทั้งหมด</option>
            <option>เผยแพร่</option>
            <option>ร่าง</option>
          </select>
        </label>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">รายการ</th>
                <th className="px-4 py-4">หมวดหมู่</th>
                <th className="px-4 py-4">อัปเดตล่าสุด</th>
                <th className="px-4 py-4">สถานะ</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex max-w-md flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>
                      {latestActivity?.contentId === item.id &&
                        latestActivity.action !== "ลบ" && (
                          <span className="rounded-full bg-energy-600/10 px-2 py-0.5 text-[11px] font-semibold text-energy-600">
                            ล่าสุด
                          </span>
                        )}
                    </div>
                    <p className="mt-1 line-clamp-1 max-w-md text-xs text-slate-500">
                      {item.summary}
                    </p>
                    {type === "portfolio" && (
                      <p className="mt-1 text-xs text-brand-700">
                        {item.province || "ยังไม่ระบุจังหวัด"} ·{" "}
                        {item.system || "ยังไม่ระบุระบบ"}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {item.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">
                    {item.updatedAt}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openPreview(item)}
                        className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 ${focusRing}`}
                      >
                        ดูตัวอย่าง
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditor(item)}
                        className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-900/5 ${focusRing}`}
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicate(item)}
                        className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 ${focusRing}`}
                      >
                        ทำสำเนา
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 ${focusRing}`}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredItems.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    ไม่พบรายการที่ตรงกับการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-6 py-3.5 text-sm text-slate-500">
          แสดง {filteredItems.length} จาก {items.length} รายการ
        </div>
      </section>
    </div>
  );
}

function ContentEditor({
  type,
  item,
  onChange,
  onBack,
  onSaveDraft,
  onPreview,
  isSaving,
}: {
  type: ContentType;
  item: ContentItem;
  onChange: (patch: Partial<ContentItem>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onPreview: () => void;
  isSaving: boolean;
}) {
  const title = `แก้ไข${contentTypeLabel(type)}`;
  const contentBlocks = item.contentBlocks ?? [];
  const addBlock = () =>
    onChange({
      contentBlocks: [
        ...contentBlocks,
        { id: `block-${Date.now()}`, kind: "ข้อความ", title: "", content: "" },
      ],
    });
  const updateBlock = (id: string, patch: Partial<ContentBlock>) =>
    onChange({
      contentBlocks: contentBlocks.map((block) =>
        block.id === id ? { ...block, ...patch } : block,
      ),
    });
  const removeBlock = (id: string) =>
    onChange({
      contentBlocks: contentBlocks.filter((block) => block.id !== id),
    });
  const moveBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= contentBlocks.length) return;
    const nextBlocks = [...contentBlocks];
    [nextBlocks[index], nextBlocks[targetIndex]] = [
      nextBlocks[targetIndex],
      nextBlocks[index],
    ];
    onChange({ contentBlocks: nextBlocks });
  };

  return (
    <section aria-labelledby="editor-title" className="space-y-6">
      <PageHeading eyebrow="จัดการเนื้อหา" title={title}>
        <button
          type="button"
          onClick={onBack}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}
        >
          กลับไปรายการ
        </button>
      </PageHeading>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSaveDraft();
        }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="editor-title"
              className="text-lg font-semibold text-slate-900"
            >
              รายละเอียดเนื้อหา
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              แก้ไขข้อมูล แล้วกดดูตัวอย่างเพื่อตรวจสอบก่อนเผยแพร่
            </p>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-slate-800">
                ภาพหน้าปก
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                อัปโหลดภาพเข้าสู่คลังสื่อของหลังบ้าน ระบบจะบันทึก media ID
                ที่ใช้กับเนื้อหานี้
              </p>
              <div className="mt-4">
                <CoverImageField item={item} onChange={onChange} />
              </div>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                หัวข้อ
              </span>
              <input
                value={item.title}
                onChange={(event) => onChange({ title: event.target.value })}
                className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  หมวดหมู่
                </span>
                <input
                  value={item.category}
                  onChange={(event) =>
                    onChange({ category: event.target.value })
                  }
                  className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  ที่อยู่ของหน้านี้
                </span>
                <input
                  value={item.slug ?? ""}
                  onChange={(event) => onChange({ slug: event.target.value })}
                  placeholder="เช่น gasifier-15mw"
                  className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`}
                />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">
                  ใช้เป็นส่วนท้ายของลิงก์ ควรสั้น อ่านง่าย และไม่ซ้ำกับหน้าอื่น
                </span>
              </label>
            </div>
            {type === "portfolio" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    จังหวัด
                  </span>
                  <input
                    value={item.province ?? ""}
                    onChange={(event) =>
                      onChange({ province: event.target.value })
                    }
                    className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`}
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    ปีที่ติดตั้ง
                  </span>
                  <input
                    value={item.installedYear ?? ""}
                    onChange={(event) =>
                      onChange({ installedYear: event.target.value })
                    }
                    className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`}
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    ระบบที่ติดตั้ง
                  </span>
                  <input
                    value={item.system ?? ""}
                    onChange={(event) =>
                      onChange({ system: event.target.value })
                    }
                    className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`}
                  />
                </label>
              </div>
            )}
            {type === "products" && (
              <div className="rounded-2xl border border-brand-700/15 bg-brand-900/5 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-brand-900">
                  ข้อมูลสินค้า
                </h3>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      ข้อความรอง (Subtitle)
                    </span>
                    <input
                      value={item.subtitle ?? ""}
                      onChange={(event) =>
                        onChange({ subtitle: event.target.value })
                      }
                      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      คำอธิบายสินค้าหลัก
                    </span>
                    <textarea
                      rows={4}
                      value={item.body}
                      onChange={(event) =>
                        onChange({ body: event.target.value })
                      }
                      className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        รายละเอียดทางเทคนิค
                      </span>
                      <textarea
                        rows={5}
                        value={item.specifications ?? ""}
                        onChange={(event) =>
                          onChange({ specifications: event.target.value })
                        }
                        placeholder="เช่น&#10;กำลังการผลิต: 1.5 MW&#10;พื้นที่ติดตั้ง: 3x4 เมตร"
                        className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                      />
                      <span className="mt-1.5 block text-xs leading-5 text-slate-500">
                        กรุณาพิมพ์หัวข้อและรายละเอียดคั่นด้วยเครื่องหมายโคลอน
                        (:) 1 รายการต่อบรรทัด
                      </span>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        เชื้อเพลิงหรือการใช้งานที่รองรับ
                      </span>
                      <textarea
                        rows={5}
                        value={item.fuelTypes ?? ""}
                        onChange={(event) =>
                          onChange({ fuelTypes: event.target.value })
                        }
                        placeholder="กรอก 1 รายการต่อบรรทัด"
                        className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        เหมาะกับ
                      </span>
                      <textarea
                        rows={4}
                        value={item.suitableFor ?? ""}
                        onChange={(event) =>
                          onChange({ suitableFor: event.target.value })
                        }
                        placeholder="เช่น โรงงานอุตสาหกรรมที่ต้องการระบบผลิตความร้อนต่อเนื่อง"
                        className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        หลักการทำงาน
                      </span>
                      <textarea
                        rows={4}
                        value={item.workingPrinciple ?? ""}
                        onChange={(event) =>
                          onChange({ workingPrinciple: event.target.value })
                        }
                        placeholder="อธิบายหลักการทำงานเบื้องต้นของระบบ"
                        className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
            {type === "news" && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  ผู้เขียน
                </span>
                <input
                  value={item.author}
                  onChange={(event) => onChange({ author: event.target.value })}
                  className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`}
                />
              </label>
            )}
            {type !== "products" && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    รายละเอียดโดยย่อ
                  </span>
                  <textarea
                    rows={3}
                    value={item.summary}
                    onChange={(event) =>
                      onChange({ summary: event.target.value })
                    }
                    className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    เนื้อหาหลัก
                  </span>
                  <textarea
                    rows={9}
                    value={item.body}
                    onChange={(event) => onChange({ body: event.target.value })}
                    className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`}
                  />
                </label>
              </>
            )}
            {type === "portfolio" && (
              <details className="group rounded-xl border border-slate-200 bg-slate-50">
                <summary
                  className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 ${focusRing}`}
                >
                  <span>
                    <span className="block">รายละเอียดเพิ่มเติมของโครงการ</span>
                    <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">
                      กรอกเมื่อมีข้อมูลโจทย์ แนวทาง ขอบเขตงาน
                      หรือผลการดำเนินงานเพิ่มเติม
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-lg text-brand-700 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="grid gap-4 border-t border-slate-200 p-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      โจทย์ของลูกค้า
                    </span>
                    <textarea
                      rows={4}
                      value={item.challenge ?? ""}
                      onChange={(event) =>
                        onChange({ challenge: event.target.value })
                      }
                      className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      แนวทางที่นำเสนอ
                    </span>
                    <textarea
                      rows={4}
                      value={item.solution ?? ""}
                      onChange={(event) =>
                        onChange({ solution: event.target.value })
                      }
                      className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      ขอบเขตงาน
                    </span>
                    <textarea
                      rows={4}
                      value={item.scope ?? ""}
                      onChange={(event) =>
                        onChange({ scope: event.target.value })
                      }
                      placeholder="พิมพ์ 1 รายการต่อบรรทัด"
                      className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      ผลการดำเนินงาน
                    </span>
                    <textarea
                      rows={4}
                      value={item.result ?? ""}
                      onChange={(event) =>
                        onChange({ result: event.target.value })
                      }
                      className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`}
                    />
                  </label>
                </div>
              </details>
            )}
            <section
              className="rounded-2xl border border-brand-700/15 bg-brand-900/5 p-4 sm:p-5"
              aria-labelledby="flexible-content-heading"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3
                    id="flexible-content-heading"
                    className="text-sm font-semibold text-brand-900"
                  >
                    ส่วนเนื้อหาเพิ่มเติม
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    ใช้เมื่อต้องการแทรกหัวข้อ รูปภาพ หรือปุ่มต่อจากเนื้อหาหลัก
                    และสามารถเรียงลำดับได้
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addBlock}
                  className={`shrink-0 rounded-xl border border-brand-700 px-3 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white ${focusRing}`}
                >
                  + เพิ่มส่วน
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {contentBlocks.map((block, index) => (
                  <article
                    key={block.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="sm:w-40">
                        <span className="mb-1.5 block text-xs font-medium text-slate-600">
                          รูปแบบ
                        </span>
                        <select
                          value={block.kind}
                          onChange={(event) =>
                            updateBlock(block.id, {
                              kind: event.target.value as ContentBlockKind,
                            })
                          }
                          className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm ${focusRing}`}
                        >
                          <option>ข้อความ</option>
                          <option>รูปภาพ</option>
                          <option>ปุ่ม/ลิงก์</option>
                        </select>
                      </label>
                      <label className="min-w-0 flex-1">
                        <span className="mb-1.5 block text-xs font-medium text-slate-600">
                          หัวข้อของส่วน
                        </span>
                        <input
                          value={block.title}
                          onChange={(event) =>
                            updateBlock(block.id, { title: event.target.value })
                          }
                          placeholder="ไม่ใส่ก็ได้"
                          className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm ${focusRing}`}
                        />
                      </label>
                    </div>
                    {block.kind === "รูปภาพ" ? (
                      (() => {
                        const urls = block.content.split("\n").filter(Boolean);
                        const isUploading = urls.includes("กำลังอัปโหลด...");
                        const actualUrls = urls.filter(
                          (u) => u !== "กำลังอัปโหลด...",
                        );
                        return (
                          <div className="mt-3">
                            <span className="mb-1.5 block text-xs font-medium text-slate-600">
                              รูปภาพ (เลือกได้ทีละหลายภาพ)
                            </span>
                            <div className="flex flex-wrap items-center gap-3">
                              {actualUrls.map((url, i) => (
                                <div
                                  key={i}
                                  className="relative h-16 w-16 group"
                                >
                                  <img
                                    src={url}
                                    alt=""
                                    className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newUrls = [...actualUrls];
                                      newUrls.splice(i, 1);
                                      updateBlock(block.id, {
                                        content: newUrls.join("\n"),
                                      });
                                    }}
                                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm hover:bg-rose-600 transition-colors"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                              <label
                                className={`inline-flex cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 ${focusRing}`}
                              >
                                <span>
                                  {isUploading
                                    ? "กำลังอัปโหลด..."
                                    : actualUrls.length > 0
                                      ? "เพิ่มรูปภาพ"
                                      : "อัปโหลดภาพ"}
                                </span>
                                <input
                                  disabled={isUploading}
                                  accept="image/jpeg,image/png,image/webp,image/gif"
                                  type="file"
                                  multiple
                                  className="sr-only"
                                  onChange={async (event) => {
                                    const files = Array.from(
                                      event.target.files || [],
                                    );
                                    if (!files.length) return;
                                    event.target.value = "";
                                    let currentUrls = [...actualUrls];
                                    updateBlock(block.id, {
                                      content: [
                                        ...currentUrls,
                                        "กำลังอัปโหลด...",
                                      ].join("\n"),
                                    });
                                    for (const file of files) {
                                      try {
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        const response = await postFormData<{
                                          data: { url: string };
                                        }>(
                                          "/api/v1/admin/media/upload",
                                          formData,
                                        );
                                        currentUrls.push(response.data.url);
                                      } catch (e) {
                                        alert("ไม่สามารถอัปโหลดภาพบางภาพได้");
                                      }
                                    }
                                    updateBlock(block.id, {
                                      content: currentUrls.join("\n"),
                                    });
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <label className="mt-3 block">
                        <span className="mb-1.5 block text-xs font-medium text-slate-600">
                          {block.kind === "ปุ่ม/ลิงก์"
                            ? "ข้อความปุ่ม | URL"
                            : "เนื้อหา"}
                        </span>
                        <textarea
                          rows={block.kind === "ข้อความ" ? 4 : 3}
                          value={block.content}
                          onChange={(event) =>
                            updateBlock(block.id, {
                              content: event.target.value,
                            })
                          }
                          placeholder={
                            block.kind === "ปุ่ม/ลิงก์"
                              ? "ข้อความปุ่ม | https://..."
                              : "กรอกเนื้อหาส่วนนี้"
                          }
                          className={`w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 ${focusRing}`}
                        />
                      </label>
                    )}
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 ${focusRing}`}
                      >
                        เลื่อนขึ้น
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === contentBlocks.length - 1}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 ${focusRing}`}
                      >
                        เลื่อนลง
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 ${focusRing}`}
                      >
                        ลบส่วนนี้
                      </button>
                    </div>
                  </article>
                ))}
                {!contentBlocks.length && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                    ยังไม่มีส่วนเพิ่มเติม กด “เพิ่มส่วน”
                    เมื่อต้องการแทรกเนื้อหาประเภทอื่น
                  </div>
                )}
              </div>
            </section>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              ขั้นตอนเผยแพร่
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">สถานะ</dt>
                <dd className="font-medium text-slate-700">{item.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">ผู้แก้ไข</dt>
                <dd className="font-medium text-slate-700">ผู้ดูแลระบบ</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">แก้ไขล่าสุด</dt>
                <dd className="font-medium text-slate-700">{item.updatedAt}</dd>
              </div>
            </dl>
            <label className="mt-5 flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={item.featured ?? false}
                onChange={(event) =>
                  onChange({ featured: event.target.checked })
                }
                className="mt-0.5 h-4 w-4 accent-brand-700"
              />
              <span className="text-xs leading-5 text-slate-600">
                แสดงเป็นรายการเด่นบนหน้าแรก
              </span>
            </label>
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={onPreview}
                disabled={isSaving}
                className={`w-full rounded-xl border border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white disabled:opacity-50 ${focusRing}`}
              >
                ดูตัวอย่างก่อนเผยแพร่
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-900 disabled:opacity-50 ${focusRing}`}
              >
                {isSaving ? "กำลังบันทึก..." : "บันทึกเป็นร่าง"}
              </button>
            </div>
          </aside>
        </div>
      </form>
    </section>
  );
}

function CoverImageField({
  item,
  onChange,
}: {
  item: ContentItem;
  onChange: (patch: Partial<ContentItem>) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await postFormData<{
        data: { id: string; url: string };
      }>("/api/v1/admin/media/upload", formData);
      onChange({
        coverImage: response.data.url,
        coverImageId: response.data.id,
      });
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "ไม่สามารถอัปโหลดภาพได้",
      );
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt=""
            className="h-20 w-32 rounded-lg object-cover"
          />
        ) : (
          <div className="grid h-20 w-32 place-items-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-500">
            ยังไม่มีภาพ
          </div>
        )}

        {item.coverImage ? (
          <div className="flex flex-wrap items-center gap-2">
            <label
              className={`inline-flex w-fit cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 ${focusRing}`}
            >
              <span>{isUploading ? "กำลังอัปโหลด..." : "เปลี่ยนภาพ"}</span>
              <input
                disabled={isUploading}
                accept="image/jpeg,image/png,image/webp,image/gif"
                type="file"
                className="sr-only"
                onChange={(event) => {
                  void upload(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange({ coverImage: "", coverImageId: null })}
              disabled={isUploading}
              className={`rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:border-rose-300 disabled:opacity-50 ${focusRing}`}
            >
              ลบภาพ
            </button>
          </div>
        ) : (
          <label
            className={`inline-flex w-fit cursor-pointer rounded-xl border border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-700 hover:text-white ${focusRing}`}
          >
            <span>{isUploading ? "กำลังอัปโหลด..." : "เลือกภาพ"}</span>
            <input
              disabled={isUploading}
              accept="image/jpeg,image/png,image/webp,image/gif"
              type="file"
              className="sr-only"
              onChange={(event) => {
                void upload(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
        )}
      </div>
      {item.coverImageId && (
        <p className="text-xs text-emerald-700">บันทึกในคลังสื่อแล้ว</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}

function ContentPreview({
  type,
  item,
  onClose,
  onPublish,
}: {
  type: ContentType;
  item: ContentItem;
  onClose: () => void;
  onPublish: () => void;
}) {
  const contentLabel = contentTypeLabel(type);
  const isProduct = type === "products";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`ตัวอย่าง${contentLabel}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm cursor-default"
        aria-label="ปิดตัวอย่าง"
      />
      <section className={`relative max-h-[92vh] w-full ${isProduct ? 'max-w-2xl' : 'max-w-4xl'} overflow-y-auto rounded-3xl bg-white shadow-2xl flex flex-col`}>
        {/* HEADER */}
        {isProduct ? (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-300 bg-white/95 px-6 py-4 backdrop-blur">
            <h3 className="font-heading font-semibold text-ink-950 text-lg">{item.title || "ชื่อสินค้า"}</h3>
            <button
              onClick={onClose}
              className="min-w-11 min-h-11 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-700 transition-colors"
              aria-label="ปิดรายละเอียดสินค้า"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-brand-700 uppercase">
                ตัวอย่างก่อนเผยแพร่
              </p>
              <h2 className="mt-0.5 font-semibold text-slate-900">
                มุมมองหน้าเว็บไซต์
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              กลับไปแก้ไข
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div className={`flex-1 ${isProduct ? 'p-6' : 'mx-auto max-w-4xl px-5 py-8 sm:px-10 sm:py-12 w-full'}`}>
          {!isProduct && (
            <p className="mb-8 text-center text-sm font-medium text-slate-500">
              ตัวอย่างหน้าจอเมื่อกดเข้าไปดูรายละเอียด
            </p>
          )}

          {/* NEWS PREVIEW */}
          {type === "news" && (
            <div className="max-w-[800px] mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-500/10 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">
                  {item.category || "หมวดหมู่"}
                </span>
                <span className="text-ink-700/60 text-sm font-body">
                  {item.updatedAt}
                </span>
                <span className="text-ink-700/60 text-sm font-body">
                  · {item.author || "แอดมิน"}
                </span>
              </div>
              <h1 className="font-heading font-bold text-ink-950 text-2xl md:text-3xl leading-snug mb-6">
                {item.title || "หัวข้อข่าว"}
              </h1>
              <div className="rounded-xl overflow-hidden aspect-video mb-8 bg-ink-100 flex items-center justify-center">
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-sm">ไม่มีภาพหน้าปก</span>
                )}
              </div>
              <div className="prose prose-sm max-w-none font-body text-ink-700 leading-relaxed space-y-4">
                {item.summary && <p className="text-base font-medium">{item.summary}</p>}
                {(item.body || "เนื้อหาข่าว...").split('\n\n').filter(Boolean).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* PORTFOLIO PREVIEW */}
          {type === "portfolio" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="relative h-64 md:h-80 bg-brand-900">
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover opacity-40" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-40 bg-slate-800 text-white">ไม่มีภาพหน้าปก</div>
                )}
                <div className="absolute inset-0 flex flex-col justify-end">
                  <div className="px-5 md:px-8 pb-10 w-full">
                    <h1 className="font-heading font-bold text-white text-2xl md:text-3xl leading-snug">
                      {item.title || "ชื่อโครงการ"}
                    </h1>
                  </div>
                </div>
              </div>
              
              <div className="p-5 md:p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                  {[
                    { l: 'จังหวัด', v: item.province || "ระบุจังหวัด" }, 
                    { l: 'ประเภทโรงงาน', v: item.category || "ระบุหมวดหมู่" }, 
                    { l: 'ระบบที่ติดตั้ง', v: item.system || "ระบุระบบ" }, 
                    ...(item.installedYear ? [{ l: 'ปีที่ติดตั้ง', v: String(item.installedYear) }] : [])
                  ].map(i => (
                    <div key={i.l} className="bg-ink-100 rounded-xl p-4">
                      <div className="text-xs font-body text-ink-700 mb-1">{i.l}</div>
                      <div className="font-heading font-semibold text-ink-950 text-sm">{i.v}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-ink-300/60 rounded-2xl p-6 md:p-8 mb-6">
                  <h2 className="font-heading font-semibold text-ink-950 text-xl mb-4">ภาพรวมโครงการ</h2>
                  <p className="text-ink-700 font-body text-sm leading-relaxed">{item.summary || "รายละเอียดภาพรวมโครงการ..."}</p>
                </div>

                <section className="grid gap-5 md:grid-cols-2">
                  <article className="rounded-2xl border border-ink-300/60 bg-white p-6">
                    <p className="font-body text-xs font-medium uppercase tracking-widest text-brand-700">โจทย์ของโครงการ</p>
                    <h2 className="mt-2 font-heading text-lg font-semibold text-ink-950">ความต้องการของหน้างาน</h2>
                    <p className="mt-3 font-body text-sm leading-relaxed text-ink-700">{item.challenge || "อธิบายความต้องการ..."}</p>
                  </article>
                  <article className="rounded-2xl border border-ink-300/60 bg-white p-6">
                    <p className="font-body text-xs font-medium uppercase tracking-widest text-brand-700">แนวทางที่ออกแบบ</p>
                    <h2 className="mt-2 font-heading text-lg font-semibold text-ink-950">ระบบและการเชื่อมต่อ</h2>
                    <p className="mt-3 font-body text-sm leading-relaxed text-ink-700">{item.solution || "อธิบายแนวทาง..."}</p>
                  </article>
                  <article className="rounded-2xl bg-ink-100 p-6">
                    <p className="font-body text-xs font-medium uppercase tracking-widest text-brand-700">ขอบเขตงาน</p>
                    <h2 className="mt-2 font-heading text-lg font-semibold text-ink-950">งานที่ดำเนินการ</h2>
                    <ul className="mt-4 space-y-2">
                      {(item.scope || "ตัวอย่างขอบเขตงาน").split('\n').filter(Boolean).map(scopeItem => (
                        <li key={scopeItem} className="flex items-start gap-2 font-body text-sm leading-relaxed text-ink-700">
                          <span className="mt-0.5 text-brand-700">✓</span>{scopeItem}
                        </li>
                      ))}
                    </ul>
                  </article>
                  <article className="rounded-2xl bg-brand-900 p-6 text-white">
                    <p className="font-body text-xs font-medium uppercase tracking-widest text-energy-400">สถานะและผลลัพธ์</p>
                    <h2 className="mt-2 font-heading text-lg font-semibold">ผลการดำเนินงาน</h2>
                    <p className="mt-3 font-body text-sm leading-relaxed text-white/75">{item.result || "อธิบายผลลัพธ์..."}</p>
                  </article>
                </section>
              </div>
            </div>
          )}

          {/* PRODUCTS PREVIEW */}
          {type === "products" && (
            <div className="w-full">
              <div className="aspect-video rounded-xl overflow-hidden bg-ink-100 mb-6 flex items-center justify-center">
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-sm">ไม่มีภาพหน้าปก</span>
                )}
              </div>
              <p className="text-brand-700 text-sm font-body font-medium mb-4">{item.subtitle || "รายละเอียดสั้นๆ"}</p>
              <div className="text-ink-700 text-sm font-body leading-relaxed mb-6 space-y-4">
                {(item.body || "คำอธิบายสินค้าแบบเต็ม...").split('\n').filter(Boolean).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              
              {/* NOTE: We don't have blocks preview here as product modal blocks are part of PublicContentBlocks usually, but we can just show flexible blocks */}
              
              {item.summary && (
                <div className="mb-6">
                  <h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">จุดเด่น</h4>
                  <ul className="space-y-2">
                    {item.summary.split('\n').filter(Boolean).map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-body text-ink-700">
                        <span className="w-5 h-5 rounded-full bg-brand-700/10 text-brand-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.specifications && (
                <div className="mb-6">
                  <h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">รายละเอียดทางเทคนิค</h4>
                  <div className="rounded-xl border border-ink-300/60 overflow-hidden">
                    {item.specifications.split('\n').filter(Boolean).map((s, i) => {
                      const parts = s.split(':');
                      return (
                        <div key={i} className={`flex justify-between px-4 py-3 text-sm font-body ${i % 2 === 0 ? 'bg-white' : 'bg-ink-100/60'}`}>
                          <span className="text-ink-700">{parts[0]}</span>
                          <span className="font-medium text-ink-950">{parts.slice(1).join(':')}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {(item.fuelTypes || item.suitableFor) && (
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {item.fuelTypes && (
                    <div>
                      <h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">เชื้อเพลิงหรือการใช้งานที่รองรับ</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.fuelTypes.split('\n').filter(Boolean).map(fuel => (
                          <span key={fuel} className="bg-brand-900/5 text-brand-700 text-xs font-body px-3 py-1.5 rounded-full">
                            {fuel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.suitableFor && (
                    <div>
                      <h4 className="font-heading font-semibold text-ink-950 text-sm mb-3">เหมาะกับ</h4>
                      <p className="text-ink-700 text-sm font-body leading-relaxed">{item.suitableFor}</p>
                    </div>
                  )}
                </div>
              )}

              {item.workingPrinciple && (
                <div className="mb-8 rounded-xl bg-ink-100 p-4">
                  <h4 className="font-heading font-semibold text-ink-950 text-sm mb-2">หลักการทำงาน</h4>
                  <p className="text-ink-700 text-sm font-body leading-relaxed">{item.workingPrinciple}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-ink-300/60 mt-4">
                <button type="button" className="flex-1 bg-energy-600 text-white py-3 rounded-lg font-body font-medium text-sm transition-colors cursor-default">
                  ขอใบเสนอราคาสำหรับสินค้านี้
                </button>
              </div>
            </div>
          )}

          {/* COMMON BLOCKS & SEO (for all types) */}
          {item.contentBlocks && item.contentBlocks.length > 0 && (
            <div className={`mt-12 mx-auto space-y-8 border-t border-slate-200 pt-8 ${isProduct ? 'w-full' : 'max-w-4xl'}`}>
              {item.contentBlocks.map((block) => (
                <FlexibleBlockPreview key={block.id} block={block} />
              ))}
            </div>
          )}

        </div>

        {/* ADMIN ACTION FOOTER */}
        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7 z-10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            กลับไปแก้ไข
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {item.status === "เผยแพร่" ? "อัปเดตและเผยแพร่" : "เผยแพร่เนื้อหา"}
          </button>
        </div>
      </section>
    </div>
  );
}
