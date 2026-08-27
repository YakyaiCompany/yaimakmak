import { useState, useEffect } from "react";
import {
  postFormData,
  postJson,
  getJson,
  patchJson,
  putJson,
  deleteJson,
  ApiRequestError,
} from "./lib/api";
import { COMPANY } from "./config/company";
import {
  Screen,
  ContentItem,
  ContentActivity,
  ContentType,
  ActivityAction,
  ActivityContentType,
  DemoMessage,
  MessageStatus,
  DownloadItem,
  DiscoverySettings,
} from "./features/admin/types";
import { navItems, initialDiscoverySettings } from "./features/admin/data";
import {
  mapProjectToContentItem,
  mapArticleToContentItem,
  mapProductToContentItem,
  mapLeadToMessage,
  mapDownloadToDownloadItem,
  mapSiteSettingsToDiscoverySettings,
  contentTypeLabel,
  focusRing,
} from "./features/admin/utils";

import { Dashboard } from "./features/admin/screens/Dashboard";
import { ActivityLog } from "./features/admin/screens/ActivityLog";
import { ContentManager } from "./features/admin/screens/ContentManager";
import { Messages } from "./features/admin/screens/Messages";
import { Downloads } from "./features/admin/screens/Downloads";
import { DiscoverySettingsPage } from "./features/admin/screens/DiscoverySettingsPage";
import { LoginScreen } from "./features/admin/screens/LoginScreen";

type AdminPortalProps = {
  onExit: () => void;
};

export default function AdminPortal({ onExit }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<ContentItem[]>([]);
  const [news, setNews] = useState<ContentItem[]>([]);
  const [products, setProducts] = useState<ContentItem[]>([]);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [documents, setDocuments] = useState<DownloadItem[]>([]);
  const [discoverySettings, setDiscoverySettings] = useState(
    initialDiscoverySettings,
  );
  const [activities, setActivities] = useState<ContentActivity[]>([]);
  const [assignees, setAssignees] = useState<
    Array<{ id: string; email: string; role: string }>
  >([]);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    getJson("/api/v1/admin/auth/me")
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsCheckingAuth(false));
  }, []);

  const fetchDashboardData = async () => {
    setDataError("");
    try {
      const [
        projectsRes,
        articlesRes,
        productsRes,
        leadsRes,
        downloadsRes,
        siteSettingsRes,
        activitiesRes,
        usersRes,
      ] = await Promise.all([
        getJson<any>("/api/v1/admin/projects?pageSize=100"),
        getJson<any>("/api/v1/admin/articles?pageSize=100"),
        getJson<any>("/api/v1/admin/products?pageSize=100"),
        getJson<any>("/api/v1/admin/leads?pageSize=100"),
        getJson<any>("/api/v1/admin/downloads?pageSize=100"),
        getJson<any>("/api/v1/admin/site-settings"),
        getJson<any>("/api/v1/admin/activities"),
        getJson<any>("/api/v1/users"),
      ]);

      if (projectsRes.data)
        setPortfolio(projectsRes.data.map(mapProjectToContentItem));
      if (articlesRes.data)
        setNews(articlesRes.data.map(mapArticleToContentItem));
      if (productsRes.data)
        setProducts(productsRes.data.map(mapProductToContentItem));
      if (leadsRes.data) setMessages(leadsRes.data.map(mapLeadToMessage));
      if (downloadsRes.data)
        setDocuments(downloadsRes.data.map(mapDownloadToDownloadItem));
      if (siteSettingsRes.data)
        setDiscoverySettings(
          mapSiteSettingsToDiscoverySettings(siteSettingsRes.data),
        );
      if (activitiesRes.data && activitiesRes.data.length > 0)
        setActivities(activitiesRes.data);
      if (usersRes.data) setAssignees(usersRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setDataError(
        error instanceof ApiRequestError
          ? error.message
          : "ไม่สามารถโหลดข้อมูลผู้ดูแลระบบได้",
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const selectScreen = (nextScreen: Screen) => {
    setScreen(nextScreen);
    setMobileNavOpen(false);
  };

  const recordActivity = (
    activity: Omit<ContentActivity, "id" | "at" | "actor" | "createdAt">,
  ) => {
    const createdAt = Date.now();
    setActivities((current) => [
      {
        ...activity,
        id: `activity-${createdAt}-${current.length}`,
        at: "เมื่อสักครู่",
        actor: "ผู้ดูแลระบบ",
        createdAt,
      },
      ...current,
    ]);
  };

  const saveContent = async (type: ContentType, item: ContentItem) => {
    const isNew = item.id.startsWith("new-");
    const endpoint =
      type === "news"
        ? "/api/v1/admin/articles"
        : type === "products"
          ? "/api/v1/admin/products"
          : "/api/v1/admin/projects";
    const statusMap: Record<string, string> = {
      ร่าง: "DRAFT",
      กำหนดเผยแพร่: "SCHEDULED",
      เผยแพร่: "PUBLISHED",
    };

    const splitValues = (value: string | undefined) =>
      (value || "")
        .split(/[\n,]/)
        .map((part) => part.trim())
        .filter(Boolean);
    const specifications = (item.specifications || "")
      .split("\n")
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator > 0) {
          return {
            label: line.slice(0, separator).trim(),
            value: line.slice(separator + 1).trim() || "-",
          };
        }
        const trimmed = line.trim();
        return trimmed ? { label: trimmed, value: "-" } : null;
      })
      .filter(
        (specification): specification is { label: string; value: string } =>
          Boolean(specification?.label && specification.value),
      );
    const selectedDate = item.scheduledAt || item.publishDate;
    const parsedDate = selectedDate ? new Date(selectedDate) : null;
    if (parsedDate && Number.isNaN(parsedDate.getTime())) {
      throw new Error(
        "วันที่เผยแพร่ไม่ถูกต้อง กรุณาเลือกวันในปฏิทินหรือใช้รูปแบบ YYYY-MM-DD",
      );
    }
    const publishedAt = parsedDate?.toISOString() ?? null;
    const common = {
      title: item.title.trim(),
      slug: item.slug?.trim(),
      status: statusMap[item.status] || "DRAFT",
      featured: Boolean(item.featured),
      displayOrder: item.displayOrder ?? 0,
      publishedAt,
      coverImageId: item.coverImageId || null,
      contentBlocks: item.contentBlocks || [],
    };

    let payload: Record<string, unknown>;
    if (type === "news") {
      payload = {
        ...common,
        excerpt: item.summary,
        body: item.body,
        category: item.category,
        tags: splitValues(item.tags),
        authorName: item.author,
      };
    } else if (type === "products") {
      payload = {
        ...common,
        category: item.category,
        subtitle: item.subtitle || "",
        description: item.body,
        specifications,
        supportItems: splitValues(item.fuelTypes),
        suitableFor: item.suitableFor || "",
        workingPrinciple: item.workingPrinciple || "",
      };
    } else {
      payload = {
        ...common,
        province: item.province || "",
        industry: item.category || "",
        completedYear: item.installedYear
          ? Number.parseInt(item.installedYear, 10)
          : null,
        system: item.system || "",
        summary: item.summary || "",
        description: item.body || "",
        challenge: item.challenge || "",
        solution: item.solution || "",
        scope: splitValues(item.scope),
        result: item.result || "",
      };
    }

    if (!common.slug)
      throw new Error(
        "กรุณากรอก URL ของหน้านี้เป็นภาษาอังกฤษ เช่น gasifier-15mw",
      );

    try {
      const resourceId = item.id;
      const response = isNew
        ? await postJson<any, Record<string, unknown>>(endpoint, payload)
        : await patchJson<any, Record<string, unknown>>(
            `${endpoint}/${resourceId}`,
            payload,
          );
      const saved =
        type === "news"
          ? mapArticleToContentItem(response.data)
          : type === "products"
            ? mapProductToContentItem(response.data)
            : mapProjectToContentItem(response.data);
      const setItems =
        type === "news"
          ? setNews
          : type === "products"
            ? setProducts
            : setPortfolio;
      const currentItems =
        type === "news" ? news : type === "products" ? products : portfolio;
      const existing = currentItems.find((entry) => entry.id === item.id);
      const action: ActivityAction = !existing
        ? "เพิ่ม"
        : existing.status !== "เผยแพร่" && item.status === "เผยแพร่"
          ? "เผยแพร่"
          : existing.status === "เผยแพร่" && item.status !== "เผยแพร่"
            ? "ยกเลิกเผยแพร่"
            : existing.status !== "กำหนดเผยแพร่" &&
                item.status === "กำหนดเผยแพร่"
              ? "กำหนดเผยแพร่"
              : "แก้ไข";

      setItems((current) =>
        current.some((entry) => entry.id === item.id)
          ? current.map((entry) => (entry.id === item.id ? saved : entry))
          : [saved, ...current],
      );
      recordActivity({
        contentId: saved.id,
        action,
        contentType: contentTypeLabel(type) as ActivityContentType,
        title: saved.title,
        screen: type,
      });
      return saved;
    } catch (err) {
      throw err;
    }
  };

  const deleteContent = async (type: ContentType, id: string) => {
    if (id.startsWith("new-")) return;
    const endpoint =
      type === "news"
        ? "/api/v1/admin/articles"
        : type === "products"
          ? "/api/v1/admin/products"
          : "/api/v1/admin/projects";
    const setItems =
      type === "news"
        ? setNews
        : type === "products"
          ? setProducts
          : setPortfolio;
    const currentItems =
      type === "news" ? news : type === "products" ? products : portfolio;

    try {
      const resourceId =
        type === "news"
          ? currentItems.find((entry) => entry.id === id)?.slug
          : id;
      if (!resourceId) throw new Error("ไม่พบ URL ของข่าวสารที่ต้องการลบ");
      await deleteJson(`${endpoint}/${resourceId}`);
      const item = currentItems.find((entry) => entry.id === id);
      setItems((current) => current.filter((item) => item.id !== id));
      if (item) {
        recordActivity({
          contentId: item.id,
          action: "ลบ",
          contentType: contentTypeLabel(type) as ActivityContentType,
          title: item.title,
          screen: type,
        });
      }
    } catch (err) {
      alert(
        "Error deleting: " +
          (err instanceof ApiRequestError ? err.message : String(err)),
      );
      throw err;
    }
  };

  const openMessage = async (id: string) => {
    const message = messages.find((m) => m.id === id);
    if (message && message.status === "ใหม่") {
      try {
        await patchJson(`/api/v1/admin/leads/${id}`, { status: "IN_PROGRESS" });
        setMessages((current) =>
          current.map((m) =>
            m.id === id ? { ...m, status: "กำลังดำเนินการ" } : m,
          ),
        );
      } catch (err) {
        console.error("Failed to open message:", err);
        throw err;
      }
    } else {
      // Just trigger re-render / selection in Messages
      setMessages((current) => current.map((m) => m));
    }
  };

  const changeMessageStatus = async (id: string, status: MessageStatus) => {
    const statusMapReverse: Record<MessageStatus, string> = {
      ใหม่: "NEW",
      กำลังดำเนินการ: "IN_PROGRESS",
      ติดต่อแล้ว: "CONTACTED",
      ปิดงาน: "CLOSED",
      สแปม: "SPAM",
    };
    try {
      await patchJson(`/api/v1/admin/leads/${id}`, {
        status: statusMapReverse[status],
      });
      setMessages((current) =>
        current.map((message) =>
          message.id === id ? { ...message, status } : message,
        ),
      );
    } catch (err) {
      console.error("Failed to change message status:", err);
      throw err;
    }
  };

  const updateMessage = async (id: string, patch: Partial<DemoMessage>) => {
    const payload: Record<string, string | null> = {};
    if (patch.internalNote !== undefined) payload.notes = patch.internalNote;
    if (patch.followUpAt !== undefined)
      payload.followUpAt = patch.followUpAt
        ? new Date(patch.followUpAt).toISOString()
        : null;
    if (patch.assignedToUserId !== undefined)
      payload.assignedToUserId = patch.assignedToUserId;
    if (!Object.keys(payload).length) return;
    const response = await patchJson<any, Record<string, string | null>>(
      `/api/v1/admin/leads/${id}`,
      payload,
    );
    const saved = mapLeadToMessage(response.data);
    setMessages((current) =>
      current.map((message) => (message.id === id ? saved : message)),
    );
  };

  const addDocument = async ({
    title,
    slug,
    category,
    description,
    file,
  }: {
    title: string;
    slug: string;
    category: string;
    description: string;
    file: File;
  }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const mediaResponse = await postFormData<any>(
        "/api/v1/admin/media/upload",
        formData,
      );
      const res = await postJson<any, any>("/api/v1/admin/downloads", {
        title,
        slug,
        category,
        description,
        fileId: mediaResponse.data.id,
        status: "DRAFT",
      });
      const document = mapDownloadToDownloadItem(res.data);
      setDocuments((current) => [document, ...current]);
      recordActivity({
        contentId: document.id,
        action: "เพิ่ม",
        contentType: "เอกสาร",
        title: document.name,
        screen: "downloads",
      });
    } catch (err) {
      console.error("Failed to add document:", err);
      throw err;
    }
  };

  const toggleDocumentStatus = async (document: DownloadItem) => {
    if (!document.slug) throw new Error("ไม่พบ URL ของเอกสาร");

    const newStatus = document.status === "เผยแพร่" ? "ร่าง" : "เผยแพร่";
    const backendStatus = newStatus === "เผยแพร่" ? "PUBLISHED" : "DRAFT";

    try {
      const response = await patchJson<any, { status: string }>(
        `/api/v1/admin/downloads/${document.slug}`,
        { status: backendStatus },
      );
      const saved = mapDownloadToDownloadItem(response.data);
      setDocuments((current) =>
        current.map((doc) => (doc.id === document.id ? saved : doc)),
      );
      recordActivity({
        contentId: document.id,
        action: newStatus === "เผยแพร่" ? "เผยแพร่" : "ยกเลิกเผยแพร่",
        contentType: "เอกสาร",
        title: document.name,
        screen: "downloads",
      });
    } catch (err) {
      console.error("Failed to toggle document status:", err);
      throw err;
    }
  };

  const handleDiscoverySettingsChange = async (settings: DiscoverySettings) => {
    try {
      await putJson("/api/v1/admin/site-settings/discovery_settings", {
        value: settings,
      });
      setDiscoverySettings(settings);
    } catch (err) {
      console.error("Failed to save discovery settings:", err);
      throw err;
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={() => setIsAuthenticated(true)}
        onBack={onExit}
      />
    );
  }

  const page =
    screen === "dashboard" ? (
      <Dashboard
        portfolio={portfolio}
        news={news}
        products={products}
        messages={messages}
        documents={documents}
        activities={activities}
        onNavigate={selectScreen}
      />
    ) : screen === "activity" ? (
      <ActivityLog activities={activities} onNavigate={selectScreen} />
    ) : screen === "portfolio" ? (
      <ContentManager
        type="portfolio"
        items={portfolio}
        latestActivity={activities.find(
          (activity) => activity.contentType === "ผลงาน",
        )}
        onSave={(item) => saveContent("portfolio", item)}
        onDelete={(id) => deleteContent("portfolio", id)}
      />
    ) : screen === "news" ? (
      <ContentManager
        type="news"
        items={news}
        latestActivity={activities.find(
          (activity) => activity.contentType === "ข่าวสาร",
        )}
        onSave={(item) => saveContent("news", item)}
        onDelete={(id) => deleteContent("news", id)}
      />
    ) : screen === "products" ? (
      <ContentManager
        type="products"
        items={products}
        latestActivity={activities.find(
          (activity) => activity.contentType === "สินค้า",
        )}
        onSave={(item) => saveContent("products", item)}
        onDelete={(id) => deleteContent("products", id)}
      />
    ) : screen === "messages" ? (
      <Messages
        messages={messages}
        assignees={assignees}
        onOpenMessage={openMessage}
        onStatusChange={changeMessageStatus}
        onUpdateMessage={updateMessage}
      />
    ) : screen === "downloads" ? (
      <Downloads
        documents={documents}
        latestActivity={activities.find(
          (activity) => activity.contentType === "เอกสาร",
        )}
        onAddDocument={addDocument}
        onToggleStatus={toggleDocumentStatus}
      />
    ) : (
      <DiscoverySettingsPage
        settings={discoverySettings}
        onChange={handleDiscoverySettingsChange}
      />
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="lg:flex">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:sticky lg:top-0 lg:block lg:h-screen lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="เมนูผู้ดูแลระบบ"
        >
          <div className="px-2 pb-7">
            <div className="flex items-center gap-3">
              <img
                src={COMPANY.logoPath}
                alt=""
                width="44"
                height="44"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-700/10 shadow-sm"
              />
              <div>
                <p className="font-brand text-[17px] font-bold tracking-[0.06em] text-slate-900">
                  {COMPANY.shortName}
                </p>
                <p className="text-xs text-slate-500">ระบบจัดการเนื้อหา</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1" aria-label="เมนูหลัก">
            {navItems.map((item) => {
              const isActive = screen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectScreen(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${focusRing} ${isActive ? "bg-brand-700 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="absolute right-4 bottom-5 left-4 space-y-1 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => {
                postJson("/api/v1/admin/auth/logout", {}).finally(() =>
                  setIsAuthenticated(false),
                );
              }}
              className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}
            >
              ออกจากระบบ
            </button>
            <button
              type="button"
              onClick={onExit}
              className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}
            >
              กลับสู่เว็บไซต์
            </button>
          </div>
        </aside>
        {mobileNavOpen && (
          <button
            type="button"
            aria-label="ปิดเมนูนำทาง"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-20 bg-slate-950/20 lg:hidden"
          />
        )}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-7xl">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className={`mb-5 inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden ${focusRing}`}
            >
              เมนูผู้ดูแล
            </button>
            {dataError && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              >
                {dataError}
              </p>
            )}
            {page}
          </div>
        </main>
      </div>
    </div>
  );
}
