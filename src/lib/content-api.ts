import { COMPANY } from "../config/company"

import { environment } from "../config/environment"
import { getJson } from "./api"

import { DOWNLOADS } from "../data/downloads"

import {
  ABOUT,
  INDUSTRIES,
  NEWS,
  PRODUCTS,
  PROJECTS,
  SERVICES,
  WHY_US,
} from "../data/siteContent"

import type {
  AboutContent,
  Article,
  Industry,
  Product,
  Project,
  Service,
  WhyUsItem,
} from "../types/content"

export interface FrontendDownload {
  id: string | number

  name: string

  category: string

  type: string

  size: string

  updated: string

  href?: string
}

export interface HomeContent {
  hero: {
    image: { url: string; alt: string }
    headingLines: string[]
    description: string
    benefits: string[]
    actions: {
      primary: { label: string; action: string }
      secondary: { label: string; action: string }
      video: { label: string; action: string }
    }
  }
  aboutTeaser: {
    image: { url: string; alt: string }
    badge: { title: string; description: string }
    eyebrow: string
    title: string
    paragraphs: string[]
    strengths: Array<{ title: string; description: string }>
    action: { label: string; action: string }
  }
  quoteCta: {
    backgroundImage: { url: string; alt: string }
    title: string
    description: string
    actions: Array<{ label: string; action: string }>
  }
}

const fallbackHomeContent: HomeContent = {
  hero: {
    image: {
      url: "/assets/company/hero-yakyai-installation.jpg",
      alt: "งานติดตั้งระบบอบแห้งอุตสาหกรรมของ YAKYAI 2015",
    },
    headingLines: [
      "ระบบผลิตความร้อนจากชีวมวล",
      "และเครื่องจักรอบแห้ง",
      "สำหรับโรงงานอุตสาหกรรม",
    ],
    description:
      "ออกแบบ ผลิต และติดตั้ง Gasifier System และเครื่องจักรอบแห้งตามการใช้งานจริง พร้อมทดสอบเดินระบบและอบรมผู้ใช้งาน เพื่อช่วยลดต้นทุนเชื้อเพลิงและเพิ่มประสิทธิภาพการผลิต",
    benefits: ["ออกแบบตามหน้างาน", "ติดตั้งครบวงจร", "ทดสอบก่อนส่งมอบ"],
    actions: {
      primary: { label: "ขอใบเสนอราคา", action: "quote" },
      secondary: { label: "ดูสินค้าและบริการ", action: "products" },
      video: { label: "ดูวิดีโอ", action: "video" },
    },
  },
  aboutTeaser: {
    image: {
      url: "/assets/company/about-industrial-system.jpg",
      alt: "ระบบเครื่องจักรอุตสาหกรรมของ YAKYAI 2015",
    },
    badge: {
      title: "ออกแบบเฉพาะหน้างาน",
      description: "ประเมินจากกระบวนการผลิตจริง",
    },
    eyebrow: "เกี่ยวกับเรา",
    title: "ผู้เชี่ยวชาญระบบพลังงานชีวมวลอุตสาหกรรม",
    paragraphs: [
      "YAKYAI 2015 CO., LTD. เชี่ยวชาญด้านการออกแบบ ผลิต และติดตั้งระบบแก๊สซิไฟเออร์และเครื่องจักรสำหรับกระบวนการอบแห้งในภาคอุตสาหกรรม",
      "เราให้บริการครบวงจรตั้งแต่ให้คำปรึกษา สำรวจหน้างาน ออกแบบ ผลิต ติดตั้ง ทดสอบการเดินเครื่อง ไปจนถึงฝึกอบรมการใช้งานและการบำรุงรักษา",
      "ทุกระบบพัฒนาจากประเภทเชื้อเพลิง กระบวนการผลิต และความต้องการเฉพาะของแต่ละโรงงาน เพื่อช่วยลดต้นทุนพลังงานและเพิ่มประสิทธิภาพการผลิตอย่างเหมาะสมกับการใช้งานจริง",
    ],
    strengths: [
      { title: "สำรวจหน้างาน", description: "วิเคราะห์พื้นที่ เชื้อเพลิง และความต้องการความร้อน" },
      { title: "ออกแบบเฉพาะระบบ", description: "วางแนวทางให้สอดคล้องกับกระบวนการผลิต" },
      { title: "ทดสอบก่อนส่งมอบ", description: "ตรวจสอบการทำงานก่อนเริ่มใช้งานจริง" },
      { title: "ดูแลต่อเนื่อง", description: "วางแผนการบำรุงรักษาหลังติดตั้ง" },
    ],
    action: { label: "ดูหน้าเกี่ยวกับเรา", action: "about" },
  },
  quoteCta: {
    backgroundImage: {
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=600&fit=crop&auto=format",
      alt: "",
    },
    title: "กำลังมองหาระบบผลิตความร้อนที่เหมาะกับโรงงานของคุณ?",
    description: "ส่งรายละเอียดเบื้องต้นให้ทีมวิศวกรช่วยประเมินระบบ ไม่มีค่าใช้จ่าย",
    actions: [
      { label: "ขอใบเสนอราคา", action: "quote" },
      { label: "โทรปรึกษา", action: "phone" },
      { label: "LINE", action: "line" },
    ],
  },
}

export interface SiteContent {
  company: typeof COMPANY

  about: AboutContent

  home: HomeContent

  products: Product[]

  projects: Project[]

  news: Article[]

  downloads: FrontendDownload[]

  industries: Industry[]

  services: Service[]

  whyUs: WhyUsItem[]
}

export const fallbackSiteContent: SiteContent = {
  company: COMPANY,

  about: ABOUT,

  home: fallbackHomeContent,

  products: [],
  projects: [],
  news: [],
  downloads: [],
  industries: [],
  services: [],
  whyUs: [],
}

type UnknownRecord = Record<string, unknown>

const thaiDateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",

  month: "long",

  year: "numeric",

  timeZone: "Asia/Bangkok",
})

const thaiMonthYearFormatter = new Intl.DateTimeFormat("th-TH", {
  month: "short",

  year: "numeric",

  timeZone: "Asia/Bangkok",
})

function asRecord(value: unknown): UnknownRecord | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as UnknownRecord
    : undefined
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined
}

function integerValue(
  value: unknown,
  fallback: number | undefined,
): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.trunc(value)
    : fallback
}

function stringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback

  return value.flatMap((item, index) => {
    if (typeof item === "string") return [item]

    return fallback[index] === undefined ? [] : [fallback[index]]
  })
}

function mediaUrl(value: unknown, fallback: string): string {
  return stringValue(asRecord(value)?.url, fallback)
}

function frontendId(
  value: unknown,
  fallback: string | number,
): string | number {
  if (typeof value === "string") return value

  return typeof value === "number" && Number.isFinite(value)
    ? Math.trunc(value)
    : fallback
}

function formatThaiDate(value: unknown, fallback: string): string {
  const date = parseDate(value)

  return date ? thaiDateFormatter.format(date) : fallback
}

function formatThaiMonthYear(value: unknown, fallback: string): string {
  const date = parseDate(value)

  return date ? thaiMonthYearFormatter.format(date) : fallback
}

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== "string" && typeof value !== "number") return undefined

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date
}

function formatFileSize(value: unknown, fallback: string): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return fallback
  }

  if (value < 1024) return `${Math.round(value)} B`

  const units = ["KB", "MB", "GB"]

  let size = value

  let unitIndex = -1

  do {
    size /= 1024

    unitIndex += 1
  } while (size >= 1024 && unitIndex < units.length - 1)

  const formatted = size >= 10 ? Math.round(size).toString() : size.toFixed(1)

  return `${formatted} ${units[unitIndex]}`
}

function fileType(value: unknown, fallback: string): string {
  const mimeType = optionalString(value)

  if (!mimeType) return fallback

  if (mimeType.toLowerCase() === "application/pdf") return "PDF"

  const subtype = mimeType.split("/")[1]

  return subtype ? subtype.toUpperCase() : mimeType.toUpperCase()
}

function listData(response: unknown): unknown[] | undefined {
  const envelope = asRecord(response)

  return Array.isArray(envelope?.data) ? envelope.data : undefined
}

function mapList<T>(
  response: unknown,
  fallback: T[],
  mapper: (value: unknown, index: number) => T,
): T[] {
  const items = listData(response)

  return items !== undefined ? items.map(mapper) : fallback.map((item, index) => mapper(item, index))
}

function emptyProduct(index: number): Product {
  return {
    id: index + 1,

    category: "",

    name: "",

    subtitle: "",

    desc: "",

    image: "",

    highlights: [],

    specs: [],

    supportLabel: "",

    supportItems: [],

    catalogNote: "",

    suitableFor: "",

    workingPrinciple: "",
  }
}

function productSpecifications(
  value: unknown,

  fallback: Product["specs"],
): Product["specs"] {
  if (!Array.isArray(value)) return fallback

  return value.flatMap((item, index) => {
    const source = asRecord(item)

    const previous = fallback[index]

    const label = stringValue(source?.label, previous?.label ?? "")

    const specificationValue = stringValue(source?.value, previous?.value ?? "")

    return label || specificationValue
      ? [{ label, value: specificationValue }]
      : []
  })
}

function mapProduct(value: unknown, index: number): Product {
  const source = asRecord(value)

  const title = optionalString(source?.title)

  const matchingFallback = title
    ? PRODUCTS.find((product) => product.name === title)
    : undefined

  const fallback: Product =
    matchingFallback ?? PRODUCTS[index] ?? emptyProduct(index)

  if (!source) return fallback

  return {
    id: frontendId(source.id, fallback.id),

    slug: optionalString(source.slug) ?? fallback.slug,

    category: stringValue(source.category, fallback.category),

    name: stringValue(source.title, fallback.name),

    subtitle: stringValue(source.subtitle, fallback.subtitle),

    desc: stringValue(source.description, fallback.desc),

    image: mediaUrl(source.coverImage, fallback.image),

    highlights: stringArray(source.highlights, fallback.highlights),

    specs: productSpecifications(source.specifications, fallback.specs),

    supportLabel: stringValue(source.supportLabel, fallback.supportLabel),

    supportItems: stringArray(source.supportItems, fallback.supportItems),

    catalogNote: stringValue(source.catalogNote, fallback.catalogNote),

    suitableFor: stringValue(source.suitableFor, fallback.suitableFor),

    workingPrinciple: stringValue(
      source.workingPrinciple,

      fallback.workingPrinciple,
    ),
  }
}

function emptyProject(index: number): Project {
  return {
    id: index + 1,

    slug: "",

    name: "",

    province: "",

    industry: "",

    system: "",

    summary: "",

    image: "",

    gallery: [],

    challenge: "",

    solution: "",

    scope: [],

    result: "",

    relatedProductId: PRODUCTS[0]?.id ?? 0,
  }
}

function projectGallery(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback

  return value.flatMap((item, index) => {
    const url =
      typeof item === "string" ? item : optionalString(asRecord(item)?.url)

    return url ? [url] : fallback[index] === undefined ? [] : [fallback[index]]
  })
}

function mapProject(value: unknown, index: number): Project {
  const source = asRecord(value)

  const slug = optionalString(source?.slug)

  const matchingFallback = slug
    ? PROJECTS.find((project) => project.slug === slug)
    : undefined

  const fallback: Project =
    matchingFallback ?? PROJECTS[index] ?? emptyProject(index)

  if (!source) return fallback

  const relatedProduct = asRecord(source.relatedProduct)

  return {
    id: frontendId(source.id, fallback.id),

    slug: stringValue(source.slug, fallback.slug),

    name: stringValue(source.title, fallback.name),

    province: stringValue(source.province, fallback.province),

    industry: stringValue(source.industry, fallback.industry),

    year: integerValue(source.completedYear, fallback.year),

    system: stringValue(source.system, fallback.system),

    summary: stringValue(source.summary, fallback.summary),

    image: mediaUrl(source.coverImage, fallback.image),

    gallery: projectGallery(source.gallery, fallback.gallery),

    challenge: stringValue(source.challenge, fallback.challenge),

    solution: stringValue(source.solution, fallback.solution),

    scope: stringArray(source.scope, fallback.scope),

    result: stringValue(source.result, fallback.result),

    relatedProductId: frontendId(relatedProduct?.id, fallback.relatedProductId),
  }
}

function emptyArticle(index: number): Article {
  return {
    id: index + 1,

    slug: "",

    title: "",

    category: "",

    date: "",

    author: "",

    excerpt: "",

    image: "",

    body: [],
  }
}

function articleBody(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) return stringArray(value, fallback)

  if (typeof value !== "string") return fallback

  return value

    .split(/\n\s*\n/)

    .map((paragraph) => paragraph.trim())

    .filter(Boolean)
}

function mapArticle(value: unknown, index: number): Article {
  const source = asRecord(value)

  const slug = optionalString(source?.slug)

  const matchingFallback = slug
    ? NEWS.find((article) => article.slug === slug)
    : undefined

  const fallback: Article =
    matchingFallback ?? NEWS[index] ?? emptyArticle(index)

  if (!source) return fallback

  return {
    id: frontendId(source.id, fallback.id),

    slug: stringValue(source.slug, fallback.slug),

    title: stringValue(source.title, fallback.title),

    category: stringValue(source.category, fallback.category),

    date: formatThaiDate(source.publishedAt, fallback.date),

    author: stringValue(source.author, fallback.author),

    excerpt: stringValue(source.excerpt, fallback.excerpt),

    image: mediaUrl(source.coverImage, fallback.image),

    body: articleBody(source.body, fallback.body),
  }
}

function emptyDownload(index: number): FrontendDownload {
  return {
    id: index + 1,

    name: "",

    category: "",

    type: "",

    size: "",

    updated: "",
  }
}

function mapDownload(value: unknown, index: number): FrontendDownload {
  const source = asRecord(value)

  const title = optionalString(source?.title)

  const matchingFallback = title
    ? DOWNLOADS.find((download) => download.name === title)
    : undefined

  const fallback = matchingFallback ?? DOWNLOADS[index] ?? emptyDownload(index)

  if (!source) return fallback

  const file = asRecord(source.file)

  const href = optionalString(file?.url) ?? fallback.href

  return {
    id:
      typeof source.id === "string" || typeof source.id === "number"
        ? source.id
        : fallback.id,

    name: stringValue(source.title, fallback.name),

    category: stringValue(source.category, fallback.category),

    type: fileType(file?.mimeType, fallback.type),

    size: formatFileSize(file?.sizeBytes, fallback.size),

    updated: formatThaiMonthYear(source.updatedAt, fallback.updated),

    ...(href ? { href } : {}),
  }
}

function settingsFromEnvelope(response: unknown): UnknownRecord {
  const settings: UnknownRecord = {}

  for (const item of listData(response) ?? []) {
    const setting = asRecord(item)

    const key = optionalString(setting?.key)

    if (key && setting?.value !== null && setting?.value !== undefined) {
      settings[key] = setting.value
    }
  }

  return settings
}

function mergeWithFallback<T>(fallback: T, value: unknown): T {
  if (value === null || value === undefined) return fallback

  if (typeof fallback === "string") {
    return (typeof value === "string" ? value : fallback) as T
  }

  if (typeof fallback === "number") {
    return (
      typeof value === "number" && Number.isFinite(value) ? value : fallback
    ) as T
  }

  if (typeof fallback === "boolean") {
    return (typeof value === "boolean" ? value : fallback) as T
  }

  if (fallback === undefined) {
    return (typeof value === "string" ? value : fallback) as T
  }

  if (Array.isArray(fallback)) {
    if (!Array.isArray(value)) return fallback

    const template = fallback[0]

    return value.map((item, index) => {
      const fallbackItem = fallback[index] ?? template

      return fallbackItem === undefined
        ? item
        : mergeWithFallback(fallbackItem, item)
    }) as T
  }

  const fallbackRecord = asRecord(fallback)
  const source = asRecord(value)

  if (fallbackRecord && source) {
    const merged: UnknownRecord = {}

    for (const key of Object.keys(fallbackRecord)) {
      merged[key] = mergeWithFallback(fallbackRecord[key], source[key])
    }

    return merged as T
  }

  return fallback
}

function cmsEndpoint(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${path}`
}

function singleData(response: unknown): unknown | undefined {
  return asRecord(response)?.data
}

export async function loadProjectDetail(
  slug: string,
  signal?: AbortSignal,
): Promise<Project | null> {
  const cmsApiBaseUrl = environment.cmsApiBaseUrl
  if (!cmsApiBaseUrl) return null

  const response = await getJson<unknown>(
    cmsEndpoint(cmsApiBaseUrl, `/public/projects/${encodeURIComponent(slug)}`),
    { signal },
  )
  const project = singleData(response)
  if (!project) return null

  return mapProject(project, Math.max(0, PROJECTS.findIndex((item) => item.slug === slug)))
}

export async function loadArticleDetail(
  slug: string,
  signal?: AbortSignal,
): Promise<Article | null> {
  const cmsApiBaseUrl = environment.cmsApiBaseUrl
  if (!cmsApiBaseUrl) return null

  const response = await getJson<unknown>(
    cmsEndpoint(cmsApiBaseUrl, `/public/articles/${encodeURIComponent(slug)}`),
    { signal },
  )
  const article = singleData(response)
  if (!article) return null

  return mapArticle(article, Math.max(0, NEWS.findIndex((item) => item.slug === slug)))
}

export async function loadSiteContent(
  signal?: AbortSignal,
): Promise<SiteContent | null> {
  const cmsApiBaseUrl = environment.cmsApiBaseUrl

  if (!cmsApiBaseUrl) return null

  const [
    productsResponse,

    projectsResponse,

    articlesResponse,

    downloadsResponse,

    settingsResponse,
  ] = await Promise.all([
    getJson<unknown>(
      cmsEndpoint(cmsApiBaseUrl, "/public/products?pageSize=100"),

      { signal },
    ),

    getJson<unknown>(
      cmsEndpoint(cmsApiBaseUrl, "/public/projects?pageSize=100"),

      { signal },
    ),

    getJson<unknown>(
      cmsEndpoint(cmsApiBaseUrl, "/public/articles?pageSize=100"),

      { signal },
    ),

    getJson<unknown>(
      cmsEndpoint(cmsApiBaseUrl, "/public/downloads?pageSize=100"),

      { signal },
    ),

    getJson<unknown>(
      cmsEndpoint(
        cmsApiBaseUrl,

        "/public/site-settings?keys=site.company,site.about,site.home",
      ),

      { signal },
    ),
  ])

  const settings = settingsFromEnvelope(settingsResponse)

  const home = asRecord(settings["site.home"])

  return {
    company: mergeWithFallback(COMPANY, settings["site.company"]),

    about: mergeWithFallback(ABOUT, settings["site.about"]),

    home: mergeWithFallback(fallbackHomeContent, home),

    products: mapList(productsResponse, PRODUCTS, mapProduct),

    projects: mapList(projectsResponse, PROJECTS, mapProject),

    news: mapList(articlesResponse, NEWS, mapArticle),

    downloads: mapList(downloadsResponse, DOWNLOADS, mapDownload),

    industries: mergeWithFallback(INDUSTRIES, home?.industries),

    services: mergeWithFallback(SERVICES, home?.services),

    whyUs: mergeWithFallback(WHY_US, home?.whyUs),
  }
}
