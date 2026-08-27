import { ContentItem, ContentType, DemoMessage, MessageStatus, DownloadItem, DiscoverySettings } from "./types";
import { COMPANY } from "../../config/company";

function safeDateLabel(value: unknown, fallback = "ไม่ทราบวันที่"): string {
  if (!value) return fallback;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString("th-TH");
}

export function mapProjectToContentItem(project: any): ContentItem {
  return {
    id: project.id,
    title: project.title,
    category: project.industry || "",
    summary: project.summary || "",
    body: project.description || "",
    seoTitle: project.title,
    seoDescription: project.summary || "",
    status: project.status === "PUBLISHED" ? "เผยแพร่" : project.status === "SCHEDULED" ? "กำหนดเผยแพร่" : "ร่าง",
    updatedAt: safeDateLabel(project.updatedAt),
    author: "ผู้ดูแลระบบ",
    slug: project.slug,
    province: project.province || "",
    installedYear: project.completedYear ? String(project.completedYear) : "",
    system: project.system || "",
    challenge: project.challenge || "",
    solution: project.solution || "",
    scope: (project.scope || []).join("\n"),
    result: project.result || "",
    coverImage: project.coverImage?.url || "",
    coverImageId: project.coverImageId ?? null,
    featured: Boolean(project.featured),
    displayOrder: project.displayOrder ?? 0,
    scheduledAt: project.publishedAt ? new Date(project.publishedAt).toISOString().slice(0, 16) : "",
    gallery: (project.gallery || []).map((g: any) => g.url).join("\n"),
    tags: [project.industry, project.system, project.province].filter(Boolean).join(", "),
    contentBlocks: project.contentBlocks || [],
  };
}

export function mapArticleToContentItem(article: any): ContentItem {
  return {
    id: article.id,
    title: article.title,
    category: article.category || "ข่าวสาร",
    summary: article.excerpt || "",
    body: Array.isArray(article.body) ? article.body.join("\n\n") : article.body || "",
    seoTitle: article.title,
    seoDescription: article.excerpt || "",
    status: article.status === "PUBLISHED" ? "เผยแพร่" : article.status === "SCHEDULED" ? "กำหนดเผยแพร่" : "ร่าง",
    updatedAt: safeDateLabel(article.updatedAt),
    author: article.authorName || "ผู้ดูแลระบบ",
    slug: article.slug,
    coverImage: article.coverImage?.url || "",
    coverImageId: article.coverImageId ?? null,
    publishDate: article.publishedAt ? new Date(article.publishedAt).toISOString().split("T")[0] : "",
    scheduledAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : "",
    featured: Boolean(article.featured),
    displayOrder: article.displayOrder ?? 0,
    tags: (article.tags || []).join(", "),
    contentBlocks: article.contentBlocks || [],
  };
}

export function mapProductToContentItem(product: any): ContentItem {
  return {
    id: product.id,
    title: product.title,
    category: product.category || "",
    summary: "",
    body: product.description || "",
    seoTitle: product.title,
    seoDescription: product.description || "",
    status: product.status === "PUBLISHED" ? "เผยแพร่" : product.status === "SCHEDULED" ? "กำหนดเผยแพร่" : "ร่าง",
    updatedAt: safeDateLabel(product.updatedAt),
    author: "ผู้ดูแลระบบ",
    slug: product.slug,
    subtitle: product.subtitle || "",
    specifications: (product.specifications || []).map((s: any) => `${s.label}: ${s.value}`).join("\n"),
    fuelTypes: (product.supportItems || []).join("\n"),
    suitableFor: product.suitableFor || "",
    workingPrinciple: product.workingPrinciple || "",
    coverImage: product.coverImage?.url || "",
    coverImageId: product.coverImageId ?? null,
    featured: Boolean(product.featured),
    displayOrder: product.displayOrder ?? 0,
    scheduledAt: product.publishedAt ? new Date(product.publishedAt).toISOString().slice(0, 16) : "",
    tags: [product.category, product.suitableFor].filter(Boolean).join(", "),
    contentBlocks: product.contentBlocks || [],
  };
}

export function mapLeadToMessage(lead: any): DemoMessage {
  const statusMap: Record<string, MessageStatus> = {
    NEW: "ใหม่",
    IN_PROGRESS: "กำลังดำเนินการ",
    CONTACTED: "ติดต่อแล้ว",
    CLOSED: "ปิดงาน",
    SPAM: "สแปม",
  };
  return {
    id: lead.id,
    sender: lead.name,
    company: lead.company || "-",
    subject: "ติดต่อจากหน้าเว็บไซต์",
    detail: lead.message || "",
    receivedAt: new Date(lead.createdAt).toLocaleString("th-TH"),
    phone: lead.phone || "-",
    contact: lead.email || "-",
    interest: "-",
    source: lead.source || "-",
    status: statusMap[lead.status] || "ใหม่",
    factoryLocation: "-",
    projectStage: "-",
    budgetRange: "-",
    desiredTimeline: "-",
    preferredContact: "-",
    assignedTo: lead.assignedTo?.email || "-",
    assignedToUserId: lead.assignedToUserId ?? null,
    followUpAt: lead.followUpAt ? new Date(lead.followUpAt).toISOString().slice(0, 16) : "",
    internalNote: lead.notes || "",
  };
}

export function mapDownloadToDownloadItem(download: any): DownloadItem {
  return {
    id: download.id,
    slug: download.slug,
    name: download.title || "ไม่มีชื่อ",
    category: download.category || "เอกสารทั่วไป",
    description: download.description || "",
    fileId: download.fileId ?? download.file?.id ?? null,
    fileUrl: download.file?.url ?? null,
    updatedAt: download.updatedAt ? new Date(download.updatedAt).toLocaleDateString("th-TH") : "เมื่อสักครู่",
    status: download.status === "PUBLISHED" ? "เผยแพร่" : "ร่าง",
  };
}

export function mapSiteSettingsToDiscoverySettings(settings: any[]): DiscoverySettings {
  const discoverySetting = settings.find((s: any) => s.key === "discovery_settings");
  const defaultSettings: DiscoverySettings = {
    siteTitle: "",
    siteDescription: "",
    siteUrl: "",
    shareTitle: "",
    shareDescription: "",
    shareImage: "",
    googleVerification: "",
    allowIndexing: true,
  };
  
  if (discoverySetting && discoverySetting.value) {
    return { ...defaultSettings, ...discoverySetting.value };
  }
  return defaultSettings;
}

export function contentTypeLabel(type: ContentType) {
  if (type === "news") return "ข่าวสาร";
  if (type === "products") return "สินค้า";
  return "ผลงาน";
}

export function emptyContent(type: ContentType): ContentItem {
  const label = contentTypeLabel(type);
  return {
    id: `new-${type}-${Date.now()}`,
    title: type === "news" ? "หัวข้อข่าวใหม่" : type === "products" ? "ชื่อสินค้าใหม่" : "ชื่อผลงานใหม่",
    category: type === "news" ? "ข่าวบริษัท" : type === "products" ? "สินค้า" : "โครงการใหม่",
    summary: "สรุปเนื้อหาแบบสั้นสำหรับแสดงในหน้ารายการ",
    body: "เขียนเนื้อหาหลักที่ต้องการแสดงบนเว็บไซต์\n\nสามารถกดดูตัวอย่างเพื่อตรวจสอบก่อนเผยแพร่ได้",
    seoTitle: `${label}ใหม่ | ${COMPANY.shortName}`,
    seoDescription: "คำอธิบายสำหรับผลการค้นหา",
    status: "ร่าง",
    updatedAt: "เมื่อสักครู่",
    author: "ผู้ดูแลระบบ",
    slug: "",
    province: "",
    installedYear: "",
    system: "",
    challenge: "",
    solution: "",
    scope: "",
    result: "",
    subtitle: "",
    specifications: "",
    fuelTypes: "",
    suitableFor: "",
    workingPrinciple: "",
    coverImage: "",
    gallery: "",
    videoUrl: "",
    publishDate: "",
    scheduledAt: "",
    featured: false,
    tags: "",
    ctaLabel: "",
    ctaUrl: "",
    documentUrl: "",
    contentBlocks: [],
  };
}

export const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";
