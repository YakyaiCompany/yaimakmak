import { useMemo, useState } from "react";
import { COMPANY } from "./config/company";
import { PRODUCTS } from "./data/siteContent";

type AdminPortalProps = {
  onExit: () => void;
};

type Screen = "dashboard" | "portfolio" | "news" | "products" | "messages" | "downloads" | "settings";
type ContentType = "portfolio" | "news" | "products";
type ContentStatus = "ร่าง" | "กำหนดเผยแพร่" | "เผยแพร่";
type ContentItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  status: ContentStatus;
  updatedAt: string;
  author: string;
  slug?: string;
  province?: string;
  installedYear?: string;
  system?: string;
  challenge?: string;
  solution?: string;
  scope?: string;
  result?: string;
  subtitle?: string;
  specifications?: string;
  fuelTypes?: string;
  coverImage?: string;
  gallery?: string;
  videoUrl?: string;
  publishDate?: string;
  scheduledAt?: string;
  featured?: boolean;
};
type MessageStatus = "ใหม่" | "กำลังดำเนินการ" | "ติดต่อแล้ว" | "ปิดงาน" | "สแปม";
type DemoMessage = {
  id: string;
  sender: string;
  company: string;
  subject: string;
  detail: string;
  receivedAt: string;
  phone: string;
  contact: string;
  interest: string;
  source: string;
  status: MessageStatus;
};
type DownloadItem = {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status: ContentStatus;
};
type WebsiteSettingsState = {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  lineUrl: string;
  lineQrImage: string;
  facebookUrl: string;
  googleMapsUrl: string;
  businessHours: string;
};

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";
const demoEmail = "admin@yakyai2015.co.th";
const demoPassword = "admin2015";

const navItems: Array<{ id: Screen; label: string }> = [
  { id: "dashboard", label: "ภาพรวม" },
  { id: "portfolio", label: "ผลงาน" },
  { id: "news", label: "ข่าวสาร" },
  { id: "products", label: "สินค้า" },
  { id: "messages", label: "ข้อความติดต่อ" },
  { id: "downloads", label: "เอกสารดาวน์โหลด" },
  { id: "settings", label: "ตั้งค่าเว็บไซต์" },
];

const initialPortfolio: ContentItem[] = [
  {
    id: "portfolio-1",
    title: "ระบบแก๊สซิไฟเออร์ 1.5 MW โรงงานอบปุ๋ย",
    category: "โรงงานอบปุ๋ย",
    summary: "ออกแบบและติดตั้งระบบผลิตความร้อนสำหรับกระบวนการอบปุ๋ย พร้อมทดสอบก่อนส่งมอบ",
    body: "โครงการตัวอย่างสำหรับแสดงรูปแบบเนื้อหาผลงานในระบบหลังบ้าน\n\nผู้ดูแลสามารถแก้ไขข้อมูลโครงการ บันทึกเป็นร่าง และดูตัวอย่างหน้าที่จะแสดงบนเว็บไซต์ก่อนเผยแพร่ได้จากหน้านี้",
    seoTitle: "ระบบแก๊สซิไฟเออร์ 1.5 MW โรงงานอบปุ๋ย | ยักษ์ใหญ่ 2015",
    seoDescription: "ผลงานติดตั้งระบบแก๊สซิไฟเออร์สำหรับโรงงานอบปุ๋ย",
    status: "เผยแพร่",
    updatedAt: "16 มิ.ย. 2568",
    author: "ผู้ดูแลระบบ",
    slug: "gasifier-15mw-fertilizer",
    province: "นครราชสีมา",
    installedYear: "2566",
    system: "Gasifier 1.5 MW",
    challenge: "ต้องการระบบความร้อนต่อเนื่องสำหรับกระบวนการอบปุ๋ย",
    solution: "ออกแบบระบบให้สอดคล้องกับพื้นที่ เชื้อเพลิง และเครื่องจักรเดิม",
    scope: "สำรวจหน้างาน\nออกแบบและผลิต\nติดตั้งและเชื่อมต่อ\nทดสอบและอบรม",
    result: "ติดตั้งและทดสอบตามขอบเขตโครงการ ข้อมูลสมรรถนะรอการยืนยันก่อนเผยแพร่",
  },
  {
    id: "portfolio-2",
    title: "ระบบอบแห้งกากมัน 10 ตัน/ชม.",
    category: "โรงงานมันสำปะหลัง",
    summary: "ระบบอบแห้งแบบหมุนที่ออกแบบให้เหมาะกับกำลังการผลิตและพื้นที่หน้างาน",
    body: "ข้อมูลโครงการตัวอย่างสำหรับหน้า CMS\n\nสามารถใช้หน้าจอนี้ประกอบการอธิบายขั้นตอนจัดการผลงานให้ผู้ใช้งานเห็นภาพก่อนเชื่อมต่อฐานข้อมูลจริง",
    seoTitle: "ระบบอบแห้งกากมัน 10 ตัน/ชม. | ยักษ์ใหญ่ 2015",
    seoDescription: "ผลงานระบบอบแห้งกากมันสำปะหลัง",
    status: "เผยแพร่",
    updatedAt: "12 มิ.ย. 2568",
    author: "ผู้ดูแลระบบ",
    slug: "cassava-dryer-kamphaeng-phet",
    province: "กำแพงเพชร",
    installedYear: "2565",
    system: "Rotary Dryer + Gasifier 750 kW",
    challenge: "ต้องการระบบอบกากมันที่รองรับกำลังการผลิตของหน้างาน",
    solution: "ออกแบบระบบอบแบบหมุนทำงานร่วมกับระบบผลิตความร้อนชีวมวล",
    scope: "เก็บข้อมูลวัตถุดิบ\nออกแบบและผลิต\nติดตั้งระบบ\nเดินระบบและอบรม",
    result: "ติดตั้งและทดสอบระบบตามข้อมูลโครงการ",
  },
  {
    id: "portfolio-3",
    title: "ระบบทดแทน LPG โรงงานเซรามิก",
    category: "โรงงานเซรามิก",
    summary: "ร่างข้อมูลโครงการสำหรับตรวจสอบรายละเอียดก่อนเผยแพร่บนเว็บไซต์",
    body: "เนื้อหาร่างตัวอย่าง ยังไม่ได้เผยแพร่สู่หน้าเว็บไซต์\n\nเมื่อรายละเอียดครบถ้วน ผู้ดูแลสามารถเปิดดูตัวอย่างและกดเผยแพร่ได้ทันที",
    seoTitle: "ระบบทดแทน LPG โรงงานเซรามิก",
    seoDescription: "ร่างผลงานระบบทดแทน LPG",
    status: "ร่าง",
    updatedAt: "10 มิ.ย. 2568",
    author: "ผู้ดูแลระบบ",
    slug: "lpg-replacement-ceramic",
    province: "ลำปาง",
    installedYear: "2566",
    system: "Gasifier 750 kW",
    challenge: "ประเมินแนวทางทดแทน LPG ในกระบวนการเดิม",
    solution: "วางระบบผลิตความร้อนชีวมวลให้เหมาะกับพื้นที่และจุดเชื่อมต่อ",
    scope: "สำรวจระบบเดิม\nออกแบบ\nผลิตและติดตั้ง\nทดสอบ",
    result: "อยู่ระหว่างตรวจสอบข้อมูลก่อนเผยแพร่",
  },
];

const initialNews: ContentItem[] = [
  {
    id: "news-1",
    title: "เปรียบเทียบต้นทุน LPG กับระบบแก๊สซิไฟเออร์ชีวมวล",
    category: "พลังงานชีวมวล",
    summary: "แนวทางประเมินต้นทุนพลังงานและความคุ้มค่าของการเปลี่ยนมาใช้เชื้อเพลิงชีวมวลในโรงงาน",
    body: "เนื้อหาตัวอย่างสำหรับหน้าข่าวสารของเว็บไซต์\n\nก่อนเผยแพร่ ผู้ดูแลสามารถตรวจหัวข้อ คำอธิบาย เนื้อหา และตัวอย่าง SEO จากหน้าดูตัวอย่าง เพื่อให้มั่นใจว่าข่าวแสดงผลถูกต้อง",
    seoTitle: "เปรียบเทียบต้นทุน LPG กับแก๊สซิไฟเออร์ชีวมวล",
    seoDescription: "บทความเปรียบเทียบต้นทุนพลังงาน LPG และระบบแก๊สซิไฟเออร์ชีวมวล",
    status: "เผยแพร่",
    updatedAt: "15 ก.ค. 2568",
    author: "ผู้ดูแลระบบ",
  },
  {
    id: "news-2",
    title: "ส่งมอบระบบอบแห้งกากมันสำปะหลัง จ.กำแพงเพชร",
    category: "ผลงานติดตั้ง",
    summary: "ส่งมอบระบบอบแห้งพร้อมทดสอบและอบรมผู้ใช้งานที่หน้างาน",
    body: "ตัวอย่างข่าวส่งมอบงาน\n\nเนื้อหาจริงสามารถแก้ไขได้โดยผู้ดูแลเพียงคนเดียว และแสดงผลในหน้าดูตัวอย่างก่อนกดเผยแพร่ทุกครั้ง",
    seoTitle: "ส่งมอบระบบอบแห้งกากมันสำปะหลัง",
    seoDescription: "ข่าวส่งมอบระบบอบแห้งกากมันสำปะหลัง จังหวัดกำแพงเพชร",
    status: "เผยแพร่",
    updatedAt: "3 มิ.ย. 2568",
    author: "ผู้ดูแลระบบ",
  },
  {
    id: "news-3",
    title: "หลักการทำงานของเตาแก๊สซิไฟเออร์ชีวมวลแบบง่าย",
    category: "ความรู้",
    summary: "ร่างบทความอธิบายภาพรวมของกระบวนการแปลงชีวมวลเป็นแก๊สเชื้อเพลิง",
    body: "ร่างบทความตัวอย่างสำหรับนำเสนอขั้นตอนทำงานของ CMS\n\nกด ดูตัวอย่าง เพื่อเช็กบทความในรูปแบบหน้าเว็บไซต์ก่อนกดเผยแพร่",
    seoTitle: "หลักการทำงานของเตาแก๊สซิไฟเออร์ชีวมวล",
    seoDescription: "บทความความรู้เกี่ยวกับระบบแก๊สซิไฟเออร์ชีวมวล",
    status: "ร่าง",
    updatedAt: "20 พ.ค. 2568",
    author: "ผู้ดูแลระบบ",
  },
];

const initialProducts: ContentItem[] = PRODUCTS.map((product) => ({
  id: `product-${product.id}`,
  title: product.name,
  category: "สินค้า",
  summary: product.desc,
  body: product.highlights.join("\n"),
  seoTitle: `${product.name} | ยักษ์ใหญ่ 2015`,
  seoDescription: product.subtitle,
  status: "เผยแพร่",
  updatedAt: "16 มิ.ย. 2568",
  author: "ผู้ดูแลระบบ",
  slug: product.name.toLowerCase().replace(/\s+/g, "-"),
  subtitle: product.subtitle,
  specifications: product.specs.map((item) => `${item.label}: ${item.value}`).join("\n"),
  fuelTypes: product.fuels.join(", "),
  coverImage: product.image,
}));

const initialMessages: DemoMessage[] = [
  { id: "message-1", sender: "สมชาย ใจดี", company: "โรงงานตัวอย่าง", subject: "สอบถามระบบแก๊สซิไฟเออร์", detail: "สนใจประเมินระบบผลิตความร้อนสำหรับโรงงาน รบกวนทีมงานติดต่อกลับเพื่อขอข้อมูลเบื้องต้น", receivedAt: "วันนี้ 10:24", phone: "081-111-1111", contact: "somchai@example.com", interest: "เตาแก๊สซิไฟเออร์ 1.5 MW", source: "แบบฟอร์มติดต่อหน้าแรก", status: "ใหม่" },
  { id: "message-2", sender: "วราภรณ์ พัฒนา", company: "บริษัทตัวอย่าง จำกัด", subject: "ขอรายละเอียดสินค้า", detail: "ต้องการข้อมูลระบบอบแห้งและ specification เพื่อประกอบการวางแผนโครงการ", receivedAt: "เมื่อวาน 15:40", phone: "082-222-2222", contact: "LINE: demo-contact", interest: "Cassava Pulp Rotary Dryer", source: "แบบฟอร์มขอใบเสนอราคา", status: "กำลังดำเนินการ" },
  { id: "message-3", sender: "นรินทร์ วิศวกรรม", company: "โรงงานตัวอย่าง", subject: "ขอเอกสาร Company Profile", detail: "ต้องการ Company Profile และตัวอย่างผลงานติดตั้งสำหรับนำเสนอฝ่ายบริหาร", receivedAt: "12 มิ.ย. 2568", phone: "083-333-3333", contact: "narin@example.com", interest: "Company Profile", source: "หน้าดาวน์โหลด", status: "ปิดงาน" },
];

const initialDownloads: DownloadItem[] = [
  { id: "download-1", name: "Company Profile.pdf", category: "ข้อมูลบริษัท", updatedAt: "16 มิ.ย. 2568", status: "เผยแพร่" },
  { id: "download-2", name: "Product Catalog.pdf", category: "แคตตาล็อกสินค้า", updatedAt: "14 มิ.ย. 2568", status: "เผยแพร่" },
  { id: "download-3", name: "Gasifier Specification Sheet.pdf", category: "เอกสารเทคนิค", updatedAt: "12 มิ.ย. 2568", status: "ร่าง" },
];

function StatusBadge({ status }: { status: ContentStatus | MessageStatus }) {
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

function PrototypeLabel() {
  return <span className="inline-flex rounded-full bg-brand-900/5 px-3 py-1.5 text-xs font-semibold text-brand-700">Prototype · ข้อมูลจำลอง</span>;
}

function PageHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold tracking-[0.16em] text-brand-700 uppercase">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

function MockLogin({ onLogin, onExit }: { onLogin: () => void; onExit: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim().toLowerCase() !== demoEmail || password !== demoPassword) {
      setError("อีเมลหรือรหัสผ่านตัวอย่างไม่ถูกต้อง");
      return;
    }
    setError("");
    onLogin();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 font-sans text-slate-800 sm:grid sm:place-items-center">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-sm font-bold text-white">YY</div>
        <p className="mt-6 text-xs font-bold tracking-[0.16em] text-brand-700 uppercase">ระบบจัดการเนื้อหา</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">เข้าสู่ระบบผู้ดูแล</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">ต้นแบบสำหรับผู้ดูแลเพียง 1 บัญชี เพื่อแสดงขั้นตอนการจัดการข้อมูลเว็บไซต์</p>

        <div className="mt-6 rounded-2xl border border-brand-700/15 bg-brand-900/5 p-4 text-sm leading-6 text-brand-900">
          <p className="font-semibold">ข้อมูลทดลองสำหรับเข้าดู prototype</p>
          <p className="mt-1">อีเมล: {demoEmail}</p>
          <p>รหัสผ่าน: {demoPassword}</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">อีเมล</span>
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@yakyai2015.co.th" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 ${focusRing}`} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">รหัสผ่าน</span>
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="กรอกรหัสผ่าน" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 ${focusRing}`} />
          </label>
          {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>}
          <button type="submit" className={`w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>เข้าสู่ระบบ</button>
        </form>
        <button type="button" onClick={onExit} className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}>กลับสู่เว็บไซต์</button>
        <p className="mt-5 text-xs leading-5 text-slate-400">สำหรับ prototype เท่านั้น: หน้านี้ยังไม่มีการยืนยันตัวตนหรือจัดเก็บ session จากระบบหลังบ้าน</p>
      </section>
    </main>
  );
}

function Dashboard({ portfolio, news, products, messages, documents, onNavigate }: { portfolio: ContentItem[]; news: ContentItem[]; products: ContentItem[]; messages: DemoMessage[]; documents: DownloadItem[]; onNavigate: (screen: Screen) => void }) {
  const publishedCount = [...portfolio, ...news, ...products].filter((item) => item.status === "เผยแพร่").length;
  const draftsCount = [...portfolio, ...news, ...products].filter((item) => item.status !== "เผยแพร่").length;
  const unreadCount = messages.filter((message) => message.status === "ใหม่").length;
  const publishedDocuments = documents.filter((document) => document.status === "เผยแพร่").length;
  const recentItems = [
    ...news.slice(0, 2).map((item) => ({ ...item, type: "ข่าวสาร" })),
    ...portfolio.slice(0, 2).map((item) => ({ ...item, type: "ผลงาน" })),
    ...products.slice(0, 1).map((item) => ({ ...item, type: "สินค้า" })),
  ];

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="ภาพรวมระบบ" title="สวัสดี, ผู้ดูแลระบบ">
        <PrototypeLabel />
      </PageHeading>
      <p className="-mt-3 text-sm text-slate-500">ข้อมูลในหน้านี้เปลี่ยนตามการบันทึกและเผยแพร่ที่ทดลองทำภายใน prototype</p>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="สรุปเนื้อหา">
        {[
          { label: "เนื้อหาที่เผยแพร่", value: publishedCount, action: "ดูเนื้อหา", screen: "news" as Screen },
          { label: "ร่างที่ต้องตรวจ", value: draftsCount, action: "จัดการร่าง", screen: "news" as Screen },
          { label: "ข้อความใหม่", value: unreadCount, action: "เปิดข้อความ", screen: "messages" as Screen },
          { label: "เอกสารพร้อมใช้งาน", value: publishedDocuments, action: "ดูเอกสาร", screen: "downloads" as Screen },
        ].map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
            <button type="button" onClick={() => onNavigate(stat.screen)} className={`mt-4 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 ${focusRing}`}>{stat.action}</button>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div><h2 className="font-semibold text-slate-900">เนื้อหาล่าสุด</h2><p className="mt-0.5 text-sm text-slate-500">รายการตัวอย่างที่พร้อมแก้ไขหรือดูตัวอย่าง</p></div>
            <button type="button" onClick={() => onNavigate("news")} className={`text-sm font-semibold text-brand-700 hover:text-brand-900 ${focusRing}`}>จัดการข่าวสาร</button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentItems.map((item) => (
              <article key={`${item.type}-${item.id}`} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.type} · {item.updatedAt}</p></div>
                <StatusBadge status={item.status} />
              </article>
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-brand-900 p-5 text-white shadow-sm sm:p-6 xl:col-span-2">
          <p className="text-sm font-medium text-white/70">ขั้นตอนแนะนำ</p>
          <h2 className="mt-2 text-lg font-semibold">ตรวจดูตัวอย่างก่อนเผยแพร่</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">แก้ไขข่าวหรือผลงาน บันทึกเป็นร่าง แล้วกดดูตัวอย่างเพื่อตรวจข้อความและ SEO ก่อนกดเผยแพร่</p>
          <button type="button" onClick={() => onNavigate("news")} className={`mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:bg-ink-100 ${focusRing}`}>ลองจัดการข่าวสาร</button>
        </section>
      </div>
    </div>
  );
}

function contentTypeLabel(type: ContentType) {
  if (type === "news") return "ข่าวสาร";
  if (type === "products") return "สินค้า";
  return "ผลงาน";
}

function emptyContent(type: ContentType): ContentItem {
  const label = contentTypeLabel(type);
  return {
    id: `${type}-${Date.now()}`,
    title: type === "news" ? "หัวข้อข่าวใหม่" : type === "products" ? "ชื่อสินค้าใหม่" : "ชื่อผลงานใหม่",
    category: type === "news" ? "ข่าวบริษัท" : type === "products" ? "สินค้า" : "โครงการใหม่",
    summary: "สรุปเนื้อหาแบบสั้นสำหรับแสดงในหน้ารายการ",
    body: "เขียนเนื้อหาหลักที่ต้องการแสดงบนเว็บไซต์\n\nสามารถกดดูตัวอย่างเพื่อตรวจสอบก่อนเผยแพร่ได้",
    seoTitle: `${label}ใหม่ | ยักษ์ใหญ่ 2015`,
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
    coverImage: "",
    gallery: "",
    videoUrl: "",
    publishDate: "",
    scheduledAt: "",
    featured: false,
  };
}

function ContentManager({ type, items, onSave, onDelete }: { type: ContentType; items: ContentItem[]; onSave: (item: ContentItem) => void; onDelete: (id: string) => void }) {
  const title = contentTypeLabel(type);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "ทั้งหมด">("ทั้งหมด");
  const [draft, setDraft] = useState<ContentItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.trim().toLowerCase()) || item.category.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === "ทั้งหมด" || item.status === statusFilter;
    return matchesQuery && matchesStatus;
  }), [items, query, statusFilter]);

  const openEditor = (item: ContentItem) => {
    setNotice("");
    setDraft({ ...item });
  };

  const openPreview = (item: ContentItem) => {
    setNotice("");
    setDraft({ ...item });
    setPreviewOpen(true);
  };

  const duplicate = (item: ContentItem) => {
    onSave({ ...item, id: `${type}-${Date.now()}`, title: `${item.title} (สำเนา)`, status: "ร่าง", updatedAt: "เมื่อสักครู่" });
    setNotice(`สร้างสำเนา${title}เป็นร่างแล้ว`);
  };

  const remove = (item: ContentItem) => {
    if (!window.confirm(`ลบ "${item.title}" ออกจากข้อมูลจำลองหรือไม่?`)) return;
    onDelete(item.id);
    setNotice(`ลบ${title}ตัวอย่างแล้ว`);
  };

  const save = (status: ContentStatus) => {
    if (!draft) return;
    onSave({ ...draft, status, updatedAt: "เมื่อสักครู่", author: "ผู้ดูแลระบบ" });
    setNotice(status === "เผยแพร่" ? "เผยแพร่เนื้อหาตัวอย่างแล้ว" : status === "กำหนดเผยแพร่" ? "กำหนดเวลาเผยแพร่เนื้อหาตัวอย่างแล้ว" : "บันทึกเนื้อหาเป็นร่างแล้ว");
    setPreviewOpen(false);
    setDraft(null);
  };

  if (draft) {
    return (
      <>
        <ContentEditor type={type} item={draft} onChange={(patch) => setDraft((current) => current ? { ...current, ...patch } : current)} onBack={() => { setPreviewOpen(false); setDraft(null); }} onSaveDraft={() => save("ร่าง")} onSchedule={() => save("กำหนดเผยแพร่")} onPreview={() => setPreviewOpen(true)} />
        {previewOpen && <ContentPreview type={type} item={draft} onClose={() => setPreviewOpen(false)} onPublish={() => save("เผยแพร่")} />}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="จัดการเนื้อหา" title={title}>
        <button type="button" onClick={() => openEditor(emptyContent(type))} className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>เพิ่ม{title}</button>
      </PageHeading>
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="block min-w-0 flex-1"><span className="sr-only">ค้นหา{title}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`ค้นหา${title}หรือหมวดหมู่...`} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 ${focusRing}`} /></label>
        <label><span className="sr-only">กรองสถานะ</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ContentStatus | "ทั้งหมด")} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm sm:w-44 ${focusRing}`}><option>ทั้งหมด</option><option>เผยแพร่</option><option>กำหนดเผยแพร่</option><option>ร่าง</option></select></label>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase"><tr><th className="px-6 py-4">รายการ</th><th className="px-4 py-4">หมวดหมู่</th><th className="px-4 py-4">อัปเดตล่าสุด</th><th className="px-4 py-4">สถานะ</th><th className="px-6 py-4 text-right">จัดการ</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-6 py-4"><p className="max-w-md text-sm font-semibold text-slate-800">{item.title}</p><p className="mt-1 line-clamp-1 max-w-md text-xs text-slate-500">{item.summary}</p>{type === "portfolio" && <p className="mt-1 text-xs text-brand-700">{item.province || "ยังไม่ระบุจังหวัด"} · {item.system || "ยังไม่ระบุระบบ"}</p>}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{item.category}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{item.updatedAt}</td>
                  <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-6 py-4 text-right"><div className="flex justify-end gap-1"><button type="button" onClick={() => openPreview(item)} className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 ${focusRing}`}>ดูตัวอย่าง</button><button type="button" onClick={() => openEditor(item)} className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-900/5 ${focusRing}`}>แก้ไข</button><button type="button" onClick={() => duplicate(item)} className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 ${focusRing}`}>ทำสำเนา</button><button type="button" onClick={() => remove(item)} className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 ${focusRing}`}>ลบ</button></div></td>
                </tr>
              ))}
              {!filteredItems.length && <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">ไม่พบรายการที่ตรงกับการค้นหา</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-6 py-3.5 text-sm text-slate-500">แสดง {filteredItems.length} จาก {items.length} รายการตัวอย่าง</div>
      </section>
    </div>
  );
}

function ContentEditor({ type, item, onChange, onBack, onSaveDraft, onSchedule, onPreview }: { type: ContentType; item: ContentItem; onChange: (patch: Partial<ContentItem>) => void; onBack: () => void; onSaveDraft: () => void; onSchedule: () => void; onPreview: () => void }) {
  const title = `แก้ไข${contentTypeLabel(type)}`;
  return (
    <section aria-labelledby="editor-title" className="space-y-6">
      <PageHeading eyebrow="จัดการเนื้อหา" title={title}>
        <button type="button" onClick={onBack} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}>กลับไปรายการ</button>
      </PageHeading>
      <form onSubmit={(event) => { event.preventDefault(); onSaveDraft(); }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 id="editor-title" className="text-lg font-semibold text-slate-900">รายละเอียดเนื้อหา</h2><p className="mt-1 text-sm text-slate-500">แก้ไขข้อมูล แล้วกดดูตัวอย่างเพื่อตรวจสอบก่อนเผยแพร่</p></div>
          <StatusBadge status={item.status} />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">หัวข้อ</span><input value={item.title} onChange={(event) => onChange({ title: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">หมวดหมู่</span><input value={item.category} onChange={(event) => onChange({ category: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Slug</span><input value={item.slug ?? ""} onChange={(event) => onChange({ slug: event.target.value })} placeholder="ชื่อสำหรับ URL" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /></label></div>
            {type === "portfolio" && <div className="rounded-2xl border border-brand-700/15 bg-brand-900/5 p-4 sm:p-5"><h3 className="text-sm font-semibold text-brand-900">ข้อมูลโครงการ</h3><div className="mt-4 grid gap-4 sm:grid-cols-3"><label><span className="mb-2 block text-sm font-medium text-slate-700">จังหวัด</span><input value={item.province ?? ""} onChange={(event) => onChange({ province: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">ปีที่ติดตั้ง</span><input value={item.installedYear ?? ""} onChange={(event) => onChange({ installedYear: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">ระบบที่ติดตั้ง</span><input value={item.system ?? ""} onChange={(event) => onChange({ system: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-medium text-slate-700">โจทย์ของลูกค้า</span><textarea rows={4} value={item.challenge ?? ""} onChange={(event) => onChange({ challenge: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">แนวทางแก้ไข</span><textarea rows={4} value={item.solution ?? ""} onChange={(event) => onChange({ solution: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">ขอบเขตงาน (1 บรรทัดต่อรายการ)</span><textarea rows={5} value={item.scope ?? ""} onChange={(event) => onChange({ scope: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">ผลการดำเนินงาน</span><textarea rows={5} value={item.result ?? ""} onChange={(event) => onChange({ result: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label></div></div>}
            {type === "products" && <div className="rounded-2xl border border-brand-700/15 bg-brand-900/5 p-4 sm:p-5"><h3 className="text-sm font-semibold text-brand-900">ข้อมูลสินค้า</h3><div className="mt-4 space-y-4"><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">ข้อความรอง</span><input value={item.subtitle ?? ""} onChange={(event) => onChange({ subtitle: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-medium text-slate-700">Specification</span><textarea rows={6} value={item.specifications ?? ""} onChange={(event) => onChange({ specifications: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">เชื้อเพลิงที่รองรับ</span><textarea rows={6} value={item.fuelTypes ?? ""} onChange={(event) => onChange({ fuelTypes: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label></div></div></div>}
            {type === "news" && <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-semibold text-slate-700">ผู้เขียน</span><input value={item.author} onChange={(event) => onChange({ author: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-semibold text-slate-700">วันที่เผยแพร่</span><input value={item.publishDate ?? ""} onChange={(event) => onChange({ publishDate: event.target.value })} placeholder="เช่น 20 กรกฎาคม 2568" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label></div>}
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">รายละเอียดโดยย่อ</span><textarea rows={3} value={item.summary} onChange={(event) => onChange({ summary: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">เนื้อหาหลัก</span><textarea rows={9} value={item.body} onChange={(event) => onChange({ body: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /></label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-800">รูปภาพและสื่อ</h3><p className="mt-1 text-xs text-slate-500">เตรียมช่องไว้สำหรับเชื่อมระบบอัปโหลดเมื่อได้รับไฟล์จริง</p><div className="mt-4 grid gap-4"><label><span className="mb-2 block text-sm font-medium text-slate-700">ภาพหน้าปก URL</span><input value={item.coverImage ?? ""} onChange={(event) => onChange({ coverImage: event.target.value })} placeholder="https://..." className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label>{type !== "products" && <><label><span className="mb-2 block text-sm font-medium text-slate-700">Gallery URLs (1 บรรทัดต่อภาพ)</span><textarea rows={4} value={item.gallery ?? ""} onChange={(event) => onChange({ gallery: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">Video URL</span><input value={item.videoUrl ?? ""} onChange={(event) => onChange({ videoUrl: event.target.value })} placeholder="YouTube หรือ Vimeo" className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label></>}</div></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-800">การแสดงผลบน Google</h3><div className="mt-4 grid gap-4"><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">ชื่อสำหรับการค้นหา</span><input value={item.seoTitle} onChange={(event) => onChange({ seoTitle: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /></label><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">คำอธิบายสำหรับการค้นหา</span><textarea rows={3} value={item.seoDescription} onChange={(event) => onChange({ seoDescription: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /></label></div></div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4"><h3 className="text-sm font-semibold text-slate-800">ขั้นตอนเผยแพร่</h3><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">สถานะ</dt><dd className="font-medium text-slate-700">{item.status}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">ผู้แก้ไข</dt><dd className="font-medium text-slate-700">ผู้ดูแลระบบ</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">แก้ไขล่าสุด</dt><dd className="font-medium text-slate-700">{item.updatedAt}</dd></div></dl><label className="mt-5 block"><span className="mb-2 block text-xs font-medium text-slate-600">วันและเวลาที่ต้องการเผยแพร่</span><input type="datetime-local" value={item.scheduledAt ?? ""} onChange={(event) => onChange({ scheduledAt: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><label className="mt-4 flex items-start gap-2.5"><input type="checkbox" checked={item.featured ?? false} onChange={(event) => onChange({ featured: event.target.checked })} className="mt-0.5 h-4 w-4 accent-brand-700" /><span className="text-xs leading-5 text-slate-600">แสดงเป็นรายการเด่นบนหน้าแรก</span></label><div className="mt-6 space-y-2"><button type="button" onClick={onPreview} className={`w-full rounded-xl border border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white ${focusRing}`}>ดูตัวอย่างก่อนเผยแพร่</button><button type="button" onClick={onSchedule} disabled={!item.scheduledAt} className={`w-full rounded-xl border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}>กำหนดเวลาเผยแพร่</button><button type="submit" className={`w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-900 ${focusRing}`}>บันทึกเป็นร่าง</button></div></aside>
        </div>
      </form>
    </section>
  );
}

function ContentPreview({ type, item, onClose, onPublish }: { type: ContentType; item: ContentItem; onClose: () => void; onPublish: () => void }) {
  const contentLabel = contentTypeLabel(type);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={`ตัวอย่าง${contentLabel}`}>
      <button type="button" onClick={onClose} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" aria-label="ปิดตัวอย่าง" />
      <section className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7"><div><p className="text-xs font-bold tracking-[0.14em] text-brand-700 uppercase">ตัวอย่างก่อนเผยแพร่</p><h2 className="mt-0.5 font-semibold text-slate-900">มุมมองหน้าเว็บไซต์</h2></div><button type="button" onClick={onClose} className={`rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 ${focusRing}`}>กลับไปแก้ไข</button></div>
        <article className="mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-12"><p className="text-sm font-medium text-brand-700">{item.category}</p><h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink-950 sm:text-4xl">{item.title}</h1><p className="mt-4 text-sm text-slate-500">{contentLabel} · อัปเดต {item.updatedAt}</p>{item.coverImage ? <img src={item.coverImage} alt="" className="mt-7 aspect-[16/8] w-full rounded-2xl object-cover" /> : <div className="mt-7 grid aspect-[16/8] place-items-center rounded-2xl bg-brand-900/10 text-sm text-brand-700">พื้นที่ภาพหน้าปก</div>}{type === "portfolio" && <dl className="mt-6 grid gap-3 rounded-2xl bg-ink-100 p-5 text-sm sm:grid-cols-3"><div><dt className="text-slate-500">จังหวัด</dt><dd className="mt-1 font-semibold text-slate-800">{item.province || "ยังไม่ระบุ"}</dd></div><div><dt className="text-slate-500">ปีที่ติดตั้ง</dt><dd className="mt-1 font-semibold text-slate-800">{item.installedYear || "ยังไม่ระบุ"}</dd></div><div><dt className="text-slate-500">ระบบ</dt><dd className="mt-1 font-semibold text-slate-800">{item.system || "ยังไม่ระบุ"}</dd></div></dl>}<p className="mt-8 text-lg leading-8 text-slate-700">{item.summary}</p><div className="mt-6 space-y-4 text-base leading-8 text-slate-700">{item.body.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>{type === "portfolio" && <div className="mt-8 grid gap-4 sm:grid-cols-2"><section className="rounded-2xl border border-slate-200 p-5"><h2 className="font-semibold text-slate-900">โจทย์ของโครงการ</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.challenge || "รอกรอกข้อมูล"}</p></section><section className="rounded-2xl border border-slate-200 p-5"><h2 className="font-semibold text-slate-900">แนวทางที่ออกแบบ</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.solution || "รอกรอกข้อมูล"}</p></section></div>}<section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5"><p className="text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">ตัวอย่าง SEO</p><p className="mt-3 text-lg font-medium text-brand-700">{item.seoTitle}</p><p className="mt-1 text-sm leading-6 text-slate-600">{item.seoDescription}</p></section></article>
        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7"><button type="button" onClick={onClose} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 ${focusRing}`}>แก้ไขต่อ</button><button type="button" onClick={onPublish} className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>{item.status === "เผยแพร่" ? "อัปเดตและเผยแพร่" : "เผยแพร่เนื้อหา"}</button></div>
      </section>
    </div>
  );
}

function Messages({ messages, onOpenMessage, onStatusChange }: { messages: DemoMessage[]; onOpenMessage: (id: string) => void; onStatusChange: (id: string, status: MessageStatus) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
      <PageHeading eyebrow="การสื่อสาร" title="ข้อความติดต่อ"><PrototypeLabel /></PageHeading>
      <div className="grid gap-6 xl:grid-cols-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-3"><div className="divide-y divide-slate-100">{messages.map((message) => <article key={message.id} className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold text-slate-800">{message.sender}</h2><StatusBadge status={message.status} /></div><p className="mt-1 text-sm text-slate-600">{message.subject}</p><p className="mt-1 text-xs text-slate-500">{message.company} · {message.receivedAt}</p></div><button type="button" onClick={() => openMessage(message.id)} className={`self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-900/5 sm:self-auto ${focusRing}`}>เปิดอ่าน</button></article>)}</div></section>
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2"><h2 className="font-semibold text-slate-900">รายละเอียดข้อความ</h2>{selected ? <div className="mt-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{selected.subject}</p><p className="mt-1 text-sm text-slate-500">จาก {selected.sender} · {selected.company}</p></div><StatusBadge status={selected.status} /></div><dl className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm"><div><dt className="text-xs text-slate-500">เบอร์โทร</dt><dd className="mt-1 font-medium text-slate-800">{selected.phone}</dd></div><div><dt className="text-xs text-slate-500">Email / LINE</dt><dd className="mt-1 font-medium text-slate-800">{selected.contact}</dd></div><div><dt className="text-xs text-slate-500">สนใจ</dt><dd className="mt-1 font-medium text-slate-800">{selected.interest}</dd></div><div><dt className="text-xs text-slate-500">แหล่งที่มา</dt><dd className="mt-1 font-medium text-slate-800">{selected.source}</dd></div></dl><p className="mt-5 text-sm leading-7 text-slate-700">{selected.detail}</p><label className="mt-5 block"><span className="mb-2 block text-sm font-medium text-slate-700">สถานะการติดตาม</span><select value={selected.status} onChange={(event) => onStatusChange(selected.id, event.target.value as MessageStatus)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`}><option>ใหม่</option><option>กำลังดำเนินการ</option><option>ติดต่อแล้ว</option><option>ปิดงาน</option><option>สแปม</option></select></label><button type="button" onClick={simulateReply} className={`mt-4 w-full rounded-xl border border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white ${focusRing}`}>จำลองการตอบกลับ</button>{replySent && <p role="status" className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">บันทึกสถานะ “ติดต่อแล้ว” (ข้อมูลจำลอง)</p>}</div> : <p className="mt-4 text-sm leading-6 text-slate-500">เลือกข้อความจากรายการเพื่อดูข้อมูลติดต่อ ความสนใจ แหล่งที่มา และสถานะติดตาม</p>}</aside>
      </div>
    </div>
  );
}

function Downloads({ documents, onAddDocument, onToggleStatus }: { documents: DownloadItem[]; onAddDocument: () => void; onToggleStatus: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="คลังเอกสาร" title="เอกสารดาวน์โหลด">
        <button type="button" onClick={onAddDocument} className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>เพิ่มเอกสารตัวอย่าง</button>
      </PageHeading>
      <p className="-mt-3 text-sm text-slate-500">ปุ่มนี้จำลองการเพิ่มไฟล์ลงรายการเท่านั้น ยังไม่มีการอัปโหลดไฟล์จริง</p>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {documents.map((document) => (
            <article key={document.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold text-slate-800">{document.name}</h2><p className="mt-1 text-sm text-slate-500">{document.category} · อัปเดต {document.updatedAt}</p></div>
              <StatusBadge status={document.status} />
              <button type="button" onClick={() => onToggleStatus(document.id)} className={`self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-900/5 sm:self-auto ${focusRing}`}>{document.status === "เผยแพร่" ? "ยกเลิกเผยแพร่" : "เผยแพร่"}</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function WebsiteSettings({ settings, onSave }: { settings: WebsiteSettingsState; onSave: (settings: WebsiteSettingsState) => void }) {
  const [draft, setDraft] = useState(settings);
  const [notice, setNotice] = useState("");
  const update = (field: keyof WebsiteSettingsState, value: string) => setDraft((current) => ({ ...current, [field]: value }));

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="ข้อมูลเว็บไซต์" title="ตั้งค่าเว็บไซต์"><PrototypeLabel /></PageHeading>
      <p className="-mt-3 text-sm text-slate-500">รวบรวมข้อมูลบริษัทและช่องทางติดต่อไว้จุดเดียว เพื่อเตรียมเชื่อม CMS จริงภายหลัง</p>
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}
      <form onSubmit={(event) => { event.preventDefault(); onSave(draft); setNotice("บันทึกการตั้งค่าตัวอย่างแล้ว"); }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block lg:col-span-2"><span className="mb-2 block text-sm font-semibold text-slate-700">ชื่อบริษัท</span><input value={draft.companyName} onChange={(event) => update("companyName", event.target.value)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
          <label className="block lg:col-span-2"><span className="mb-2 block text-sm font-semibold text-slate-700">ที่อยู่</span><textarea rows={3} value={draft.address} onChange={(event) => update("address", event.target.value)} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">เบอร์โทร</span><input value={draft.phone} onChange={(event) => update("phone", event.target.value)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">อีเมล</span><input value={draft.email} onChange={(event) => update("email", event.target.value)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">LINE URL</span><input value={draft.lineUrl} onChange={(event) => update("lineUrl", event.target.value)} placeholder="https://line.me/..." className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">LINE QR Code URL</span><input value={draft.lineQrImage} onChange={(event) => update("lineQrImage", event.target.value)} placeholder="รอไฟล์ QR Code จากบริษัท" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">Facebook URL</span><input value={draft.facebookUrl} onChange={(event) => update("facebookUrl", event.target.value)} placeholder="รอลิงก์จากบริษัท" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">Google Maps URL</span><input value={draft.googleMapsUrl} onChange={(event) => update("googleMapsUrl", event.target.value)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">เวลาทำการ</span><input value={draft.businessHours} onChange={(event) => update("businessHours", event.target.value)} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-slate-500">การบันทึกใน prototype ยังไม่เปลี่ยนข้อมูลหน้า public และจะกลับค่าเดิมเมื่อรีเฟรช</p><button type="submit" className={`shrink-0 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>บันทึกการตั้งค่า</button></div>
      </form>
    </div>
  );
}

export default function AdminPortal({ onExit }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [news, setNews] = useState(initialNews);
  const [products, setProducts] = useState(initialProducts);
  const [messages, setMessages] = useState(initialMessages);
  const [documents, setDocuments] = useState(initialDownloads);
  const [settings, setSettings] = useState<WebsiteSettingsState>({
    companyName: COMPANY.name,
    address: COMPANY.publicAddress,
    phone: COMPANY.phone,
    email: COMPANY.email,
    lineUrl: COMPANY.lineUrl,
    lineQrImage: COMPANY.lineQrImage ?? "",
    facebookUrl: COMPANY.facebookUrl ?? "",
    googleMapsUrl: COMPANY.map.googleMapsUrl,
    businessHours: COMPANY.businessHours,
  });

  const selectScreen = (nextScreen: Screen) => {
    setScreen(nextScreen);
    setMobileNavOpen(false);
  };

  const saveContent = (type: ContentType, item: ContentItem) => {
    const setItems = type === "news" ? setNews : type === "products" ? setProducts : setPortfolio;
    setItems((current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? item : entry) : [item, ...current]);
  };

  const deleteContent = (type: ContentType, id: string) => {
    const setItems = type === "news" ? setNews : type === "products" ? setProducts : setPortfolio;
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const openMessage = (id: string) => {
    setMessages((current) => current.map((message) => message.id === id && message.status === "ใหม่" ? { ...message, status: "กำลังดำเนินการ" } : message));
  };

  const changeMessageStatus = (id: string, status: MessageStatus) => {
    setMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message));
  };

  const addDocument = () => {
    setDocuments((current) => [{ id: `download-${Date.now()}`, name: "เอกสารใหม่ (ตัวอย่าง).pdf", category: "เอกสารประกอบ", updatedAt: "เมื่อสักครู่", status: "ร่าง" }, ...current]);
  };

  const toggleDocumentStatus = (id: string) => {
    setDocuments((current) => current.map((document) => document.id === id ? { ...document, status: document.status === "เผยแพร่" ? "ร่าง" : "เผยแพร่", updatedAt: "เมื่อสักครู่" } : document));
  };

  if (!isAuthenticated) {
    return <MockLogin onLogin={() => setIsAuthenticated(true)} onExit={onExit} />;
  }

  const page = screen === "dashboard"
    ? <Dashboard portfolio={portfolio} news={news} products={products} messages={messages} documents={documents} onNavigate={selectScreen} />
    : screen === "portfolio"
      ? <ContentManager type="portfolio" items={portfolio} onSave={(item) => saveContent("portfolio", item)} onDelete={(id) => deleteContent("portfolio", id)} />
    : screen === "news"
        ? <ContentManager type="news" items={news} onSave={(item) => saveContent("news", item)} onDelete={(id) => deleteContent("news", id)} />
        : screen === "products"
          ? <ContentManager type="products" items={products} onSave={(item) => saveContent("products", item)} onDelete={(id) => deleteContent("products", id)} />
          : screen === "messages"
            ? <Messages messages={messages} onOpenMessage={openMessage} onStatusChange={changeMessageStatus} />
            : screen === "downloads"
              ? <Downloads documents={documents} onAddDocument={addDocument} onToggleStatus={toggleDocumentStatus} />
              : <WebsiteSettings settings={settings} onSave={setSettings} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="lg:flex">
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:sticky lg:top-0 lg:block lg:h-screen lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`} aria-label="เมนูผู้ดูแลระบบ">
          <div className="px-2 pb-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm">YY</div><div><p className="font-semibold text-slate-900">ยักษ์ใหญ่ 2015</p><p className="text-xs text-slate-500">ระบบจัดการเนื้อหา</p></div></div><p className="mt-5 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">ผู้ใช้งาน: ผู้ดูแลระบบ</p></div>
          <nav className="space-y-1" aria-label="เมนูหลัก">{navItems.map((item) => { const isActive = screen === item.id; return <button key={item.id} type="button" onClick={() => selectScreen(item.id)} aria-current={isActive ? "page" : undefined} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${focusRing} ${isActive ? "bg-brand-700 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>{item.label}</button>; })}</nav>
          <div className="absolute right-4 bottom-5 left-4 space-y-1 border-t border-slate-100 pt-4"><button type="button" onClick={() => setIsAuthenticated(false)} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}>ออกจากระบบ</button><button type="button" onClick={onExit} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}>กลับสู่เว็บไซต์</button></div>
        </aside>
        {mobileNavOpen && <button type="button" aria-label="ปิดเมนูนำทาง" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-20 bg-slate-950/20 lg:hidden" />}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-9"><div className="mx-auto max-w-7xl"><button type="button" onClick={() => setMobileNavOpen(true)} className={`mb-5 inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden ${focusRing}`}>เมนูผู้ดูแล</button><section role="note" className="mb-7 rounded-2xl border border-brand-700/15 bg-brand-900/5 px-4 py-3.5 text-sm leading-6 text-brand-900"><span className="font-semibold">โหมด prototype:</span> การแก้ไข บันทึกร่าง และเผยแพร่ทำงานในหน้าจอนี้ด้วยข้อมูลจำลอง และจะกลับค่าเดิมเมื่อรีเฟรชหน้าเว็บ</section>{page}</div></main>
      </div>
    </div>
  );
}
