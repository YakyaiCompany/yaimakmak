import { useMemo, useState } from "react";
import { PRODUCTS } from "./data/siteContent";

type AdminPortalProps = {
  onExit: () => void;
};

type Screen = "dashboard" | "portfolio" | "news" | "products" | "messages" | "downloads" | "discovery";
type ContentType = "portfolio" | "news" | "products";
type ContentStatus = "ร่าง" | "กำหนดเผยแพร่" | "เผยแพร่";
type ContentBlockKind = "ข้อความ" | "รายการ" | "รูปภาพ" | "วิดีโอ" | "ปุ่ม/ลิงก์";
type ContentBlock = {
  id: string;
  kind: ContentBlockKind;
  title: string;
  content: string;
};
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
  tags?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  documentUrl?: string;
  contentBlocks?: ContentBlock[];
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
  factoryLocation: string;
  projectStage: string;
  budgetRange: string;
  desiredTimeline: string;
  preferredContact: string;
  assignedTo: string;
  followUpAt: string;
  internalNote: string;
};
type DownloadItem = {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status: ContentStatus;
};
type DiscoverySettings = {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  shareTitle: string;
  shareDescription: string;
  shareImage: string;
  googleVerification: string;
  allowIndexing: boolean;
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
  { id: "discovery", label: "การค้นหาและการแชร์" },
];

const initialDiscoverySettings: DiscoverySettings = {
  siteTitle: "บริษัท ยักษ์ใหญ่ 2015 จำกัด | ระบบพลังงานชีวมวลอุตสาหกรรม",
  siteDescription: "ออกแบบ ผลิต ติดตั้ง และดูแลระบบเตาแก๊สซิไฟเออร์และเครื่องจักรอบแห้งสำหรับโรงงานอุตสาหกรรม",
  siteUrl: "https://www.yakyai2015.co.th",
  shareTitle: "ยักษ์ใหญ่ 2015 — ระบบพลังงานชีวมวลสำหรับโรงงาน",
  shareDescription: "ระบบผลิตความร้อนชีวมวลและเครื่องจักรอบแห้ง ออกแบบให้เหมาะกับการใช้งานจริงของแต่ละโรงงาน",
  shareImage: "",
  googleVerification: "",
  allowIndexing: true,
};

const initialPortfolio: ContentItem[] = [
  {
    id: "portfolio-1",
    title: "ระบบแก๊สซิไฟเออร์ 1.5 MW โรงงานอบปุ๋ย",
    category: "โรงงานอบปุ๋ย",
    summary: "ออกแบบและติดตั้งระบบผลิตความร้อนสำหรับกระบวนการอบปุ๋ย พร้อมทดสอบก่อนส่งมอบ",
    body: "ระบบผลิตความร้อนถูกออกแบบจากข้อมูลการใช้พลังงาน พื้นที่ติดตั้ง และจุดเชื่อมต่อกับเครื่องอบเดิมของโรงงาน\n\nทีมงานรับผิดชอบตั้งแต่สำรวจหน้างาน ผลิตอุปกรณ์ ติดตั้งระบบควบคุม ไปจนถึงทดสอบและอบรมก่อนส่งมอบ",
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
    tags: "Gasifier, 1.5 MW, โรงงานอบปุ๋ย, ชีวมวล",
    contentBlocks: [
      { id: "portfolio-1-block-1", kind: "ข้อความ", title: "ข้อมูลหน้างานเพิ่มเติม", content: "ทีมงานสำรวจจุดติดตั้ง แนวทางลำเลียงเชื้อเพลิง และจุดเชื่อมต่อกับเครื่องอบเดิมก่อนเริ่มออกแบบรายละเอียด" },
      { id: "portfolio-1-block-2", kind: "รายการ", title: "รายการส่งมอบ", content: "ชุดเตาแก๊สซิไฟเออร์\nระบบควบคุม\nอุปกรณ์ประกอบ\nคู่มือและการอบรม" },
    ],
  },
  {
    id: "portfolio-2",
    title: "ระบบอบแห้งกากมัน 10 ตัน/ชม.",
    category: "โรงงานมันสำปะหลัง",
    summary: "ระบบอบแห้งแบบหมุนที่ออกแบบให้เหมาะกับกำลังการผลิตและพื้นที่หน้างาน",
    body: "ระบบอบแห้งแบบหมุนทำงานร่วมกับชุดผลิตความร้อนชีวมวล โดยกำหนดขนาดจากความชื้นเริ่มต้น ปริมาณวัตถุดิบต่อวัน และเวลาการทำงานของโรงงาน\n\nผังระบบคำนึงถึงพื้นที่ปฏิบัติงานเดิม แนวลำเลียงวัตถุดิบ และความสะดวกในการตรวจเช็กอุปกรณ์",
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
    tags: "Rotary Dryer, มันสำปะหลัง, ระบบอบแห้ง",
    contentBlocks: [
      { id: "portfolio-2-block-1", kind: "ข้อความ", title: "แนวทางการออกแบบ", content: "ข้อมูลความชื้นเริ่มต้น ปริมาณวัตถุดิบ และเวลาทำงานต่อวันถูกนำมาใช้ประกอบการกำหนดขนาดระบบอบและระบบผลิตความร้อน" },
    ],
  },
  {
    id: "portfolio-3",
    title: "ระบบทดแทน LPG โรงงานเซรามิก",
    category: "โรงงานเซรามิก",
    summary: "ร่างข้อมูลโครงการสำหรับตรวจสอบรายละเอียดก่อนเผยแพร่บนเว็บไซต์",
    body: "โครงการอยู่ระหว่างรวบรวมข้อมูลการใช้ LPG ชั่วโมงการทำงาน และพื้นที่สำหรับติดตั้งระบบชีวมวล\n\nเมื่อข้อมูลหน้างานครบ ทีมวิศวกรจะสรุปกำลังความร้อนและแนวทางเชื่อมต่อที่เหมาะสมกับกระบวนการเดิม",
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
    tags: "Gasifier, 750 kW, ทดแทน LPG, เซรามิก",
    contentBlocks: [
      { id: "portfolio-3-block-1", kind: "ข้อความ", title: "สถานะโครงการ", content: "อยู่ระหว่างตรวจสอบข้อมูลการใช้เชื้อเพลิงและเงื่อนไขพื้นที่ ก่อนสรุปแนวทางออกแบบและแผนการติดตั้ง" },
    ],
  },
];

const initialNews: ContentItem[] = [
  {
    id: "news-1",
    title: "เปรียบเทียบต้นทุน LPG กับระบบแก๊สซิไฟเออร์ชีวมวล",
    category: "พลังงานชีวมวล",
    summary: "แนวทางประเมินต้นทุนพลังงานและความคุ้มค่าของการเปลี่ยนมาใช้เชื้อเพลิงชีวมวลในโรงงาน",
    body: "การเปรียบเทียบต้นทุนไม่ควรดูเฉพาะราคาต่อหน่วยของเชื้อเพลิง แต่ควรรวมประสิทธิภาพระบบ ชั่วโมงการทำงาน ค่าเตรียมเชื้อเพลิง และค่าใช้จ่ายในการดูแลรักษา\n\nข้อมูลการใช้พลังงานจริงของโรงงานจะช่วยให้ประเมินขนาดระบบและระยะเวลาคืนทุนได้ใกล้เคียงการใช้งานมากขึ้น",
    seoTitle: "เปรียบเทียบต้นทุน LPG กับแก๊สซิไฟเออร์ชีวมวล",
    seoDescription: "บทความเปรียบเทียบต้นทุนพลังงาน LPG และระบบแก๊สซิไฟเออร์ชีวมวล",
    status: "เผยแพร่",
    updatedAt: "15 ก.ค. 2568",
    author: "ผู้ดูแลระบบ",
    tags: "LPG, ชีวมวล, ต้นทุนพลังงาน",
    contentBlocks: [
      { id: "news-1-block-1", kind: "รายการ", title: "ข้อมูลที่ควรเตรียมก่อนเปรียบเทียบ", content: "ปริมาณ LPG ที่ใช้ต่อเดือน\nชั่วโมงการทำงาน\nชนิดชีวมวลที่หาได้\nพื้นที่สำหรับติดตั้ง" },
    ],
  },
  {
    id: "news-2",
    title: "ส่งมอบระบบอบแห้งกากมันสำปะหลัง จ.กำแพงเพชร",
    category: "ผลงานติดตั้ง",
    summary: "ส่งมอบระบบอบแห้งพร้อมทดสอบและอบรมผู้ใช้งานที่หน้างาน",
    body: "ทีมงานดำเนินการติดตั้งระบบอบแห้ง เชื่อมต่ออุปกรณ์ประกอบ และทดสอบการทำงานร่วมกันที่หน้างาน\n\nก่อนส่งมอบมีการอบรมขั้นตอนเริ่ม–หยุดเครื่อง จุดตรวจสอบประจำวัน และแนวทางดูแลอุปกรณ์ให้กับผู้ปฏิบัติงานของโรงงาน",
    seoTitle: "ส่งมอบระบบอบแห้งกากมันสำปะหลัง",
    seoDescription: "ข่าวส่งมอบระบบอบแห้งกากมันสำปะหลัง จังหวัดกำแพงเพชร",
    status: "เผยแพร่",
    updatedAt: "3 มิ.ย. 2568",
    author: "ผู้ดูแลระบบ",
    tags: "ส่งมอบงาน, Rotary Dryer, กำแพงเพชร",
    contentBlocks: [
      { id: "news-2-block-1", kind: "ข้อความ", title: "ขอบเขตการส่งมอบ", content: "ติดตั้งระบบ ทดสอบการทำงานร่วมกัน และอบรมขั้นตอนเริ่ม–หยุดเครื่องให้กับผู้ปฏิบัติงานของโรงงาน" },
    ],
  },
  {
    id: "news-3",
    title: "หลักการทำงานของเตาแก๊สซิไฟเออร์ชีวมวลแบบง่าย",
    category: "ความรู้",
    summary: "ร่างบทความอธิบายภาพรวมของกระบวนการแปลงชีวมวลเป็นแก๊สเชื้อเพลิง",
    body: "เตาแก๊สซิไฟเออร์เปลี่ยนเชื้อเพลิงชีวมวลให้เป็นแก๊สเชื้อเพลิงด้วยกระบวนการควบคุมอากาศและอุณหภูมิภายในเตา\n\nแก๊สที่ได้สามารถนำไปใช้เป็นแหล่งความร้อนในกระบวนการอบแห้ง โดยการออกแบบต้องพิจารณาชนิดเชื้อเพลิง ความชื้น และความต้องการความร้อนของโรงงาน",
    seoTitle: "หลักการทำงานของเตาแก๊สซิไฟเออร์ชีวมวล",
    seoDescription: "บทความความรู้เกี่ยวกับระบบแก๊สซิไฟเออร์ชีวมวล",
    status: "ร่าง",
    updatedAt: "20 พ.ค. 2568",
    author: "ผู้ดูแลระบบ",
    tags: "Gasifier, ความรู้, พลังงานชีวมวล",
    contentBlocks: [],
  },
];

const initialProducts: ContentItem[] = PRODUCTS.map((product) => ({
  id: `product-${product.id}`,
  title: product.name,
  category: product.category,
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
  tags: `${product.category}, ${product.fuels.join(", ")}`,
  contentBlocks: [
    { id: `product-${product.id}-block-1`, kind: "รายการ", title: "จุดเด่นของระบบ", content: product.highlights.join("\n") },
    { id: `product-${product.id}-block-2`, kind: "ข้อความ", title: "การประเมินก่อนติดตั้ง", content: "ทีมวิศวกรจะพิจารณาความต้องการความร้อน ชนิดเชื้อเพลิง พื้นที่ และจุดเชื่อมต่อก่อนสรุปแบบระบบ" },
  ],
}));

const initialMessages: DemoMessage[] = [
  { id: "message-1", sender: "สมชาย ใจดี", company: "โรงงานผลิตปุ๋ยภาคอีสาน", subject: "สอบถามระบบแก๊สซิไฟเออร์", detail: "สนใจประเมินระบบผลิตความร้อนสำหรับโรงงาน ปัจจุบันใช้ LPG ในกระบวนการอบวันละประมาณ 10 ชั่วโมง ต้องการให้ทีมงานติดต่อกลับเพื่อขอข้อมูลที่ใช้ประเมินเบื้องต้น", receivedAt: "วันนี้ 10:24", phone: "081-111-1111", contact: "somchai@example.com", interest: "เตาแก๊สซิไฟเออร์ 1.5 MW", source: "แบบฟอร์มติดต่อหน้าแรก", status: "ใหม่", factoryLocation: "นครราชสีมา", projectStage: "กำลังศึกษาความเป็นไปได้", budgetRange: "รอประเมิน", desiredTimeline: "ภายใน 6 เดือน", preferredContact: "โทรศัพท์ ช่วง 09:00–11:00", assignedTo: "ยังไม่มอบหมาย", followUpAt: "", internalNote: "" },
  { id: "message-2", sender: "วราภรณ์ พัฒนา", company: "โรงงานแปรรูปมันสำปะหลัง", subject: "ขอรายละเอียดสินค้า", detail: "ต้องการข้อมูลระบบอบแห้งและรายละเอียดทางเทคนิคเพื่อประกอบการวางแผนโครงการ มีพื้นที่ติดตั้งเดิมและต้องการเชื่อมต่อกับระบบลำเลียงที่ใช้งานอยู่", receivedAt: "เมื่อวาน 15:40", phone: "082-222-2222", contact: "LINE: woraporn-plant", interest: "Cassava Pulp Rotary Dryer", source: "แบบฟอร์มขอใบเสนอราคา", status: "กำลังดำเนินการ", factoryLocation: "กำแพงเพชร", projectStage: "จัดทำงบประมาณ", budgetRange: "3–5 ล้านบาท", desiredTimeline: "ไตรมาส 4", preferredContact: "LINE", assignedTo: "ฝ่ายขายโครงการ", followUpAt: "2026-07-30T10:00", internalNote: "ขอข้อมูลความชื้นวัตถุดิบและกำลังการผลิตต่อวันเพิ่มเติม" },
  { id: "message-3", sender: "นรินทร์ วิศวกรรม", company: "โรงงานวัสดุก่อสร้างภาคกลาง", subject: "ขอเอกสาร Company Profile", detail: "ต้องการ Company Profile และผลงานติดตั้งบางส่วนสำหรับนำเสนอฝ่ายบริหาร ก่อนนัดประชุมเก็บข้อมูลหน้างาน", receivedAt: "12 มิ.ย. 2568", phone: "083-333-3333", contact: "narin@example.com", interest: "Company Profile", source: "หน้าดาวน์โหลด", status: "ปิดงาน", factoryLocation: "สระบุรี", projectStage: "รวบรวมข้อมูลภายใน", budgetRange: "ยังไม่ระบุ", desiredTimeline: "ยังไม่กำหนด", preferredContact: "อีเมล", assignedTo: "ฝ่ายประสานงาน", followUpAt: "", internalNote: "ส่งเอกสารแนะนำบริษัทแล้ว" },
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
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
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
        <p className="mt-2 text-sm leading-6 text-slate-500">เข้าสู่ระบบเพื่อจัดการผลงาน ข่าวสาร สินค้า เอกสาร และข้อความจากลูกค้า</p>

        <div className="mt-6 rounded-2xl border border-brand-700/15 bg-brand-900/5 p-4 text-sm leading-6 text-brand-900">
          <p className="font-semibold">บัญชีสำหรับเข้าชมระบบ</p>
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
      <PageHeading eyebrow="ภาพรวมระบบ" title="ภาพรวมเว็บไซต์" />
      <p className="-mt-3 text-sm text-slate-500">ติดตามเนื้อหาที่เผยแพร่ รายการที่รอตรวจ ข้อความใหม่ และเอกสารจากหน้าเดียว</p>

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
            <div><h2 className="font-semibold text-slate-900">เนื้อหาล่าสุด</h2><p className="mt-0.5 text-sm text-slate-500">รายการที่แก้ไขล่าสุดและสถานะการเผยแพร่</p></div>
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
          <p className="mt-2 text-sm leading-6 text-white/70">แก้ไขข่าวหรือผลงาน บันทึกเป็นร่าง แล้วกดดูตัวอย่างเพื่อตรวจข้อความ รูปภาพ และข้อมูลสำหรับผลการค้นหาก่อนเผยแพร่</p>
          <button type="button" onClick={() => onNavigate("news")} className={`mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:bg-ink-100 ${focusRing}`}>จัดการข่าวสาร</button>
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
    tags: "",
    ctaLabel: "",
    ctaUrl: "",
    documentUrl: "",
    contentBlocks: [
      { id: `block-${Date.now()}`, kind: "ข้อความ", title: "หัวข้อเนื้อหา", content: "" },
    ],
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
    if (!window.confirm(`ต้องการลบ "${item.title}" หรือไม่?`)) return;
    onDelete(item.id);
    setNotice(`ลบ${title}แล้ว`);
  };

  const save = (status: ContentStatus) => {
    if (!draft) return;
    onSave({ ...draft, status, updatedAt: "เมื่อสักครู่", author: "ผู้ดูแลระบบ" });
    setNotice(status === "เผยแพร่" ? "เผยแพร่เนื้อหาแล้ว" : status === "กำหนดเผยแพร่" ? "กำหนดเวลาเผยแพร่แล้ว" : "บันทึกเนื้อหาเป็นร่างแล้ว");
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
        <div className="border-t border-slate-100 px-6 py-3.5 text-sm text-slate-500">แสดง {filteredItems.length} จาก {items.length} รายการ</div>
      </section>
    </div>
  );
}

function ContentEditor({ type, item, onChange, onBack, onSaveDraft, onSchedule, onPreview }: { type: ContentType; item: ContentItem; onChange: (patch: Partial<ContentItem>) => void; onBack: () => void; onSaveDraft: () => void; onSchedule: () => void; onPreview: () => void }) {
  const title = `แก้ไข${contentTypeLabel(type)}`;
  const contentBlocks = item.contentBlocks ?? [];
  const addBlock = () => onChange({ contentBlocks: [...contentBlocks, { id: `block-${Date.now()}`, kind: "ข้อความ", title: "", content: "" }] });
  const updateBlock = (id: string, patch: Partial<ContentBlock>) => onChange({ contentBlocks: contentBlocks.map((block) => block.id === id ? { ...block, ...patch } : block) });
  const removeBlock = (id: string) => onChange({ contentBlocks: contentBlocks.filter((block) => block.id !== id) });
  const moveBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= contentBlocks.length) return;
    const nextBlocks = [...contentBlocks];
    [nextBlocks[index], nextBlocks[targetIndex]] = [nextBlocks[targetIndex], nextBlocks[index]];
    onChange({ contentBlocks: nextBlocks });
  };

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
            <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">หมวดหมู่</span><input value={item.category} onChange={(event) => onChange({ category: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">ที่อยู่ของหน้านี้</span><input value={item.slug ?? ""} onChange={(event) => onChange({ slug: event.target.value })} placeholder="เช่น gasifier-15mw" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /><span className="mt-1.5 block text-xs leading-5 text-slate-500">ใช้เป็นส่วนท้ายของลิงก์ ควรสั้น อ่านง่าย และไม่ซ้ำกับหน้าอื่น</span></label></div>
            {type === "portfolio" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">จังหวัด</span>
                  <input value={item.province ?? ""} onChange={(event) => onChange({ province: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">ปีที่ติดตั้ง</span>
                  <input value={item.installedYear ?? ""} onChange={(event) => onChange({ installedYear: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">ระบบที่ติดตั้ง</span>
                  <input value={item.system ?? ""} onChange={(event) => onChange({ system: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} />
                </label>
              </div>
            )}
            {type === "products" && <div className="rounded-2xl border border-brand-700/15 bg-brand-900/5 p-4 sm:p-5"><h3 className="text-sm font-semibold text-brand-900">ข้อมูลสินค้า</h3><div className="mt-4 space-y-4"><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">ข้อความรอง</span><input value={item.subtitle ?? ""} onChange={(event) => onChange({ subtitle: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-medium text-slate-700">รายละเอียดทางเทคนิค</span><textarea rows={6} value={item.specifications ?? ""} onChange={(event) => onChange({ specifications: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">เชื้อเพลิงที่รองรับ</span><textarea rows={6} value={item.fuelTypes ?? ""} onChange={(event) => onChange({ fuelTypes: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label></div></div></div>}
            {type === "news" && <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-semibold text-slate-700">ผู้เขียน</span><input value={item.author} onChange={(event) => onChange({ author: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-semibold text-slate-700">วันที่เผยแพร่</span><input value={item.publishDate ?? ""} onChange={(event) => onChange({ publishDate: event.target.value })} placeholder="เช่น 20 กรกฎาคม 2568" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${focusRing}`} /></label></div>}
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">รายละเอียดโดยย่อ</span><textarea rows={3} value={item.summary} onChange={(event) => onChange({ summary: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">เนื้อหาหลัก</span><textarea rows={9} value={item.body} onChange={(event) => onChange({ body: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /></label>
            {type === "portfolio" && (
              <details className="group rounded-xl border border-slate-200 bg-slate-50">
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 ${focusRing}`}>
                  <span><span className="block">รายละเอียดเพิ่มเติมของโครงการ</span><span className="mt-1 block text-xs font-normal leading-5 text-slate-500">กรอกเมื่อมีข้อมูลโจทย์ แนวทาง ขอบเขตงาน หรือผลการดำเนินงานเพิ่มเติม</span></span>
                  <span aria-hidden="true" className="text-lg text-brand-700 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="grid gap-4 border-t border-slate-200 p-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">โจทย์ของลูกค้า</span>
                    <textarea rows={4} value={item.challenge ?? ""} onChange={(event) => onChange({ challenge: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">แนวทางที่นำเสนอ</span>
                    <textarea rows={4} value={item.solution ?? ""} onChange={(event) => onChange({ solution: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">ขอบเขตงาน</span>
                    <textarea rows={4} value={item.scope ?? ""} onChange={(event) => onChange({ scope: event.target.value })} placeholder="พิมพ์ 1 รายการต่อบรรทัด" className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">ผลการดำเนินงาน</span>
                    <textarea rows={4} value={item.result ?? ""} onChange={(event) => onChange({ result: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} />
                  </label>
                </div>
              </details>
            )}
            <section className="rounded-2xl border border-brand-700/15 bg-brand-900/5 p-4 sm:p-5" aria-labelledby="flexible-content-heading">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><h3 id="flexible-content-heading" className="text-sm font-semibold text-brand-900">ส่วนเนื้อหาเพิ่มเติม</h3><p className="mt-1 text-xs leading-5 text-slate-500">ใช้เมื่อต้องการแทรกหัวข้อ รายการ รูปภาพ วิดีโอ หรือปุ่มต่อจากเนื้อหาหลัก และสามารถเรียงลำดับได้</p></div>
                <button type="button" onClick={addBlock} className={`shrink-0 rounded-xl border border-brand-700 px-3 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white ${focusRing}`}>+ เพิ่มส่วน</button>
              </div>
              <div className="mt-4 space-y-3">
                {contentBlocks.map((block, index) => (
                  <article key={block.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="sm:w-40"><span className="mb-1.5 block text-xs font-medium text-slate-600">รูปแบบ</span><select value={block.kind} onChange={(event) => updateBlock(block.id, { kind: event.target.value as ContentBlockKind })} className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm ${focusRing}`}><option>ข้อความ</option><option>รายการ</option><option>รูปภาพ</option><option>วิดีโอ</option><option>ปุ่ม/ลิงก์</option></select></label>
                      <label className="min-w-0 flex-1"><span className="mb-1.5 block text-xs font-medium text-slate-600">หัวข้อของส่วน</span><input value={block.title} onChange={(event) => updateBlock(block.id, { title: event.target.value })} placeholder="ไม่ใส่ก็ได้" className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm ${focusRing}`} /></label>
                    </div>
                    <label className="mt-3 block"><span className="mb-1.5 block text-xs font-medium text-slate-600">{block.kind === "รูปภาพ" || block.kind === "วิดีโอ" || block.kind === "ปุ่ม/ลิงก์" ? "URL หรือรายละเอียด" : block.kind === "รายการ" ? "รายการ (1 บรรทัดต่อข้อ)" : "เนื้อหา"}</span><textarea rows={block.kind === "ข้อความ" ? 4 : 3} value={block.content} onChange={(event) => updateBlock(block.id, { content: event.target.value })} placeholder={block.kind === "รูปภาพ" ? "URL รูปภาพ" : block.kind === "วิดีโอ" ? "YouTube หรือ Vimeo URL" : block.kind === "ปุ่ม/ลิงก์" ? "ข้อความปุ่ม | URL" : "กรอกเนื้อหาส่วนนี้"} className={`w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 ${focusRing}`} /></label>
                    <div className="mt-3 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 ${focusRing}`}>เลื่อนขึ้น</button><button type="button" onClick={() => moveBlock(index, 1)} disabled={index === contentBlocks.length - 1} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 ${focusRing}`}>เลื่อนลง</button><button type="button" onClick={() => removeBlock(block.id)} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 ${focusRing}`}>ลบส่วนนี้</button></div>
                  </article>
                ))}
                {!contentBlocks.length && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">ยังไม่มีส่วนเพิ่มเติม กด “เพิ่มส่วน” เมื่อต้องการแทรกเนื้อหาประเภทอื่น</div>}
              </div>
            </section>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-800">รูปภาพ เอกสาร และสื่อ</h3><p className="mt-1 text-xs leading-5 text-slate-500">ลิงก์เหล่านี้ใช้แสดงภาพหน้าปก แกลเลอรี วิดีโอ และเอกสารประกอบในหน้าที่กำลังแก้ไข</p><div className="mt-4 grid gap-4"><label><span className="mb-2 block text-sm font-medium text-slate-700">ลิงก์ภาพหน้าปก</span><input value={item.coverImage ?? ""} onChange={(event) => onChange({ coverImage: event.target.value })} placeholder="https://..." className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">ลิงก์รูปภาพเพิ่มเติม (1 บรรทัดต่อภาพ)</span><textarea rows={4} value={item.gallery ?? ""} onChange={(event) => onChange({ gallery: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 ${focusRing}`} /></label><div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-medium text-slate-700">ลิงก์วิดีโอ</span><input value={item.videoUrl ?? ""} onChange={(event) => onChange({ videoUrl: event.target.value })} placeholder="YouTube หรือ Vimeo" className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">ลิงก์เอกสารแนบ</span><input value={item.documentUrl ?? ""} onChange={(event) => onChange({ documentUrl: event.target.value })} placeholder="PDF หรือเอกสารประกอบ" className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label></div></div></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-800">ข้อมูลช่วยจัดหมวดและปุ่มปลายทาง</h3><div className="mt-4 grid gap-4"><label><span className="mb-2 block text-sm font-medium text-slate-700">แท็ก (คั่นด้วยเครื่องหมายจุลภาค)</span><input value={item.tags ?? ""} onChange={(event) => onChange({ tags: event.target.value })} placeholder="เช่น Gasifier, ชีวมวล, 1.5 MW" className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-medium text-slate-700">ข้อความบนปุ่ม</span><input value={item.ctaLabel ?? ""} onChange={(event) => onChange({ ctaLabel: event.target.value })} placeholder="เช่น ขอใบเสนอราคา" className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><label><span className="mb-2 block text-sm font-medium text-slate-700">ลิงก์ของปุ่ม</span><input value={item.ctaUrl ?? ""} onChange={(event) => onChange({ ctaUrl: event.target.value })} placeholder="/contact หรือ https://..." className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label></div></div></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-800">ข้อมูลของหน้านี้ในผลการค้นหา</h3><p className="mt-1 text-xs leading-5 text-slate-500">ช่วยให้คนเข้าใจว่าหน้านี้เกี่ยวกับอะไร ก่อนกดเข้าจาก Google หรือบริการค้นหาอื่น ข้อความที่แสดงจริงอาจถูกระบบค้นหาปรับให้เหมาะกับคำค้น</p><div className="mt-4 grid gap-4"><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">ชื่อที่ต้องการให้เห็น</span><input value={item.seoTitle} onChange={(event) => onChange({ seoTitle: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /><span className="mt-1.5 block text-xs leading-5 text-slate-500">สรุปชื่อหน้าและหัวข้อสำคัญให้ชัดเจน โดยไม่ใส่คำซ้ำเกินจำเป็น</span></label><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">ข้อความอธิบายใต้ชื่อ</span><textarea rows={3} value={item.seoDescription} onChange={(event) => onChange({ seoDescription: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /><span className="mt-1.5 block text-xs leading-5 text-slate-500">สรุปประโยชน์หรือสาระของหน้านี้ให้ผู้อ่านตัดสินใจก่อนเปิดดู</span></label></div></div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4"><h3 className="text-sm font-semibold text-slate-800">ขั้นตอนเผยแพร่</h3><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">สถานะ</dt><dd className="font-medium text-slate-700">{item.status}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">ผู้แก้ไข</dt><dd className="font-medium text-slate-700">ผู้ดูแลระบบ</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">แก้ไขล่าสุด</dt><dd className="font-medium text-slate-700">{item.updatedAt}</dd></div></dl><label className="mt-5 block"><span className="mb-2 block text-xs font-medium text-slate-600">วันและเวลาที่ต้องการเผยแพร่</span><input type="datetime-local" value={item.scheduledAt ?? ""} onChange={(event) => onChange({ scheduledAt: event.target.value })} className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm ${focusRing}`} /></label><label className="mt-4 flex items-start gap-2.5"><input type="checkbox" checked={item.featured ?? false} onChange={(event) => onChange({ featured: event.target.checked })} className="mt-0.5 h-4 w-4 accent-brand-700" /><span className="text-xs leading-5 text-slate-600">แสดงเป็นรายการเด่นบนหน้าแรก</span></label><div className="mt-6 space-y-2"><button type="button" onClick={onPreview} className={`w-full rounded-xl border border-brand-700 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white ${focusRing}`}>ดูตัวอย่างก่อนเผยแพร่</button><button type="button" onClick={onSchedule} disabled={!item.scheduledAt} className={`w-full rounded-xl border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}>กำหนดเวลาเผยแพร่</button><button type="submit" className={`w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-900 ${focusRing}`}>บันทึกเป็นร่าง</button></div></aside>
        </div>
      </form>
    </section>
  );
}

function FlexibleBlockPreview({ block }: { block: ContentBlock }) {
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

function ContentPreview({ type, item, onClose, onPublish }: { type: ContentType; item: ContentItem; onClose: () => void; onPublish: () => void }) {
  const contentLabel = contentTypeLabel(type);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={`ตัวอย่าง${contentLabel}`}>
      <button type="button" onClick={onClose} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" aria-label="ปิดตัวอย่าง" />
      <section className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7"><div><p className="text-xs font-bold tracking-[0.14em] text-brand-700 uppercase">ตัวอย่างก่อนเผยแพร่</p><h2 className="mt-0.5 font-semibold text-slate-900">มุมมองหน้าเว็บไซต์</h2></div><button type="button" onClick={onClose} className={`rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 ${focusRing}`}>กลับไปแก้ไข</button></div>
        <article className="mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-12"><p className="text-sm font-medium text-brand-700">{item.category}</p><h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink-950 sm:text-4xl">{item.title}</h1><p className="mt-4 text-sm text-slate-500">{contentLabel} · อัปเดต {item.updatedAt}</p>{item.coverImage ? <img src={item.coverImage} alt="" className="mt-7 aspect-[16/8] w-full rounded-2xl object-cover" /> : <div className="mt-7 grid aspect-[16/8] place-items-center rounded-2xl bg-brand-900/10 text-sm text-brand-700">พื้นที่ภาพหน้าปก</div>}{type === "portfolio" && <dl className="mt-6 grid gap-3 rounded-2xl bg-ink-100 p-5 text-sm sm:grid-cols-3"><div><dt className="text-slate-500">จังหวัด</dt><dd className="mt-1 font-semibold text-slate-800">{item.province || "ยังไม่ระบุ"}</dd></div><div><dt className="text-slate-500">ปีที่ติดตั้ง</dt><dd className="mt-1 font-semibold text-slate-800">{item.installedYear || "ยังไม่ระบุ"}</dd></div><div><dt className="text-slate-500">ระบบ</dt><dd className="mt-1 font-semibold text-slate-800">{item.system || "ยังไม่ระบุ"}</dd></div></dl>}<p className="mt-8 text-lg leading-8 text-slate-700">{item.summary}</p><div className="mt-6 space-y-4 text-base leading-8 text-slate-700">{item.body.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>{type === "portfolio" && <div className="mt-8 grid gap-4 sm:grid-cols-2"><section className="rounded-2xl border border-slate-200 p-5"><h2 className="font-semibold text-slate-900">โจทย์ของโครงการ</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.challenge || "รอกรอกข้อมูล"}</p></section><section className="rounded-2xl border border-slate-200 p-5"><h2 className="font-semibold text-slate-900">แนวทางที่ออกแบบ</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.solution || "รอกรอกข้อมูล"}</p></section></div>}{item.contentBlocks && item.contentBlocks.length > 0 && <div className="mt-9 space-y-8 border-t border-slate-200 pt-8">{item.contentBlocks.map((block) => <FlexibleBlockPreview key={block.id} block={block} />)}</div>}<section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5"><p className="text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">ตัวอย่างผลการค้นหา</p><p className="mt-3 text-lg font-medium text-brand-700">{item.seoTitle}</p><p className="mt-1 text-sm leading-6 text-slate-600">{item.seoDescription}</p></section></article>
        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7"><button type="button" onClick={onClose} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 ${focusRing}`}>แก้ไขต่อ</button><button type="button" onClick={onPublish} className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>{item.status === "เผยแพร่" ? "อัปเดตและเผยแพร่" : "เผยแพร่เนื้อหา"}</button></div>
      </section>
    </div>
  );
}

function Messages({ messages, onOpenMessage, onStatusChange, onUpdateMessage }: { messages: DemoMessage[]; onOpenMessage: (id: string) => void; onStatusChange: (id: string, status: MessageStatus) => void; onUpdateMessage: (id: string, patch: Partial<DemoMessage>) => void }) {
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

function Downloads({ documents, onAddDocument, onToggleStatus }: { documents: DownloadItem[]; onAddDocument: () => void; onToggleStatus: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="คลังเอกสาร" title="เอกสารดาวน์โหลด">
        <button type="button" onClick={onAddDocument} className={`rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 ${focusRing}`}>เพิ่มเอกสาร</button>
      </PageHeading>
      <p className="-mt-3 text-sm text-slate-500">จัดการโบรชัวร์ แคตตาล็อก ข้อมูลจำเพาะ และเอกสารที่เปิดให้ดาวน์โหลดบนเว็บไซต์</p>
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

function DiscoverySettingsPage({ settings, onChange }: { settings: DiscoverySettings; onChange: (settings: DiscoverySettings) => void }) {
  const [notice, setNotice] = useState("");
  const update = (patch: Partial<DiscoverySettings>) => {
    setNotice("");
    onChange({ ...settings, ...patch });
  };

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="ตั้งค่าครั้งเดียว" title="การค้นหาและการแชร์" />
      <section className="rounded-2xl border border-brand-700/15 bg-brand-900/5 p-5 text-sm leading-6 text-brand-900">
        <h2 className="font-semibold">ข้อมูลส่วนกลางของเว็บไซต์</h2>
        <p className="mt-1 text-brand-900/75">ใช้เป็นข้อมูลหลักเมื่อหน้าแรกปรากฏใน Google และเมื่อมีคนแชร์ลิงก์เว็บไซต์ จึงกรอกครั้งเดียวและแก้เฉพาะเมื่อชื่อบริษัท ที่อยู่เว็บไซต์ หรือข้อความแนะนำหลักเปลี่ยน</p>
      </section>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}

      <form onSubmit={(event) => { event.preventDefault(); setNotice("บันทึกการตั้งค่าการค้นหาและการแชร์แล้ว"); }} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-semibold text-slate-900">ข้อมูลหลักสำหรับผลการค้นหา</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">ใช้เป็นค่าเริ่มต้นของหน้าแรก และช่วยให้ระบบค้นหาเข้าใจชื่อและบริการหลักของบริษัท</p>
            </div>
            <div className="mt-5 grid gap-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">ชื่อเว็บไซต์ในผลการค้นหา</span>
                <input value={settings.siteTitle} onChange={(event) => update({ siteTitle: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">ควรมีชื่อบริษัทและบริการหลัก เพื่อให้คนรู้ว่าเว็บไซต์นี้เกี่ยวกับอะไร</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">คำอธิบายเว็บไซต์</span>
                <textarea rows={4} value={settings.siteDescription} onChange={(event) => update({ siteDescription: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">สรุปว่าบริษัทให้บริการอะไรและเหมาะกับลูกค้ากลุ่มใด ข้อความนี้อาจปรากฏใต้ชื่อเว็บไซต์</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">ที่อยู่หลักของเว็บไซต์</span>
                <input type="url" value={settings.siteUrl} onChange={(event) => update({ siteUrl: event.target.value })} placeholder="https://www.example.com" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">ใช้บอกระบบค้นหาว่าที่อยู่นี้เป็นเว็บไซต์หลักของบริษัท ควรแก้เมื่อเปลี่ยนโดเมนเท่านั้น</span>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-semibold text-slate-900">เมื่อแชร์ลิงก์ใน LINE และ Facebook</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">กำหนดข้อความและภาพเริ่มต้นที่ช่วยให้ลิงก์ดูน่าเชื่อถือและเข้าใจง่ายก่อนกดเปิด</p>
            </div>
            <div className="mt-5 grid gap-5">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">ชื่อบนการ์ดแชร์</span><input value={settings.shareTitle} onChange={(event) => update({ shareTitle: event.target.value })} className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">ข้อความบนการ์ดแชร์</span><textarea rows={3} value={settings.shareDescription} onChange={(event) => update({ shareDescription: event.target.value })} className={`w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-800 ${focusRing}`} /></label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">ลิงก์ภาพสำหรับการแชร์</span>
                <input type="url" value={settings.shareImage} onChange={(event) => update({ shareImage: event.target.value })} placeholder="https://.../share-cover.jpg" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">แนะนำภาพแนวนอนที่มีชื่อบริษัทและภาพเครื่องจักรชัดเจน ใช้เป็นภาพสำรองเมื่อหน้านั้นไม่มีภาพเฉพาะ</span>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-semibold text-slate-900">การเชื่อมต่อกับ Google</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">ตั้งค่าเฉพาะตอนเปิดเว็บไซต์หรือเมื่อทีมดูแลระบบแจ้งให้เปลี่ยน</p>
            </div>
            <div className="mt-5 grid gap-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">รหัสยืนยัน Google Search Console</span>
                <input value={settings.googleVerification} onChange={(event) => update({ googleVerification: event.target.value })} placeholder="เว้นว่างได้จนกว่าจะได้รับรหัสจาก Google" className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 ${focusRing}`} />
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">ใช้ยืนยันว่าเว็บไซต์นี้เป็นของบริษัท เพื่อดูสถานะการค้นหาและปัญหาที่ Google ตรวจพบ ไม่ใช่ช่องสำหรับใส่คำค้นหา</span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input type="checkbox" checked={settings.allowIndexing} onChange={(event) => update({ allowIndexing: event.target.checked })} className="mt-0.5 h-5 w-5 accent-brand-700" />
                <span><span className="block text-sm font-semibold text-slate-800">อนุญาตให้ระบบค้นหาเก็บข้อมูลเว็บไซต์</span><span className="mt-1 block text-xs leading-5 text-slate-500">ควรเปิดเมื่อเว็บไซต์พร้อมใช้งานจริง หากปิด หน้าเว็บอาจไม่ปรากฏในผลการค้นหา</span></span>
              </label>
            </div>
          </section>

          <button type="submit" className={`w-full rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900 sm:w-auto ${focusRing}`}>บันทึกการตั้งค่า</button>
        </div>

        <aside className="h-fit space-y-5 xl:sticky xl:top-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">ตั้งค่าตรงไหน?</h2>
            <div className="mt-4 space-y-4 text-sm leading-6">
              <div><p className="font-semibold text-slate-800">ข้อมูลส่วนกลาง</p><p className="text-slate-500">ชื่อเว็บไซต์ โดเมน ภาพแชร์หลัก และการเชื่อมต่อ Google ตั้งในหน้านี้ครั้งเดียว</p></div>
              <div className="border-t border-slate-100 pt-4"><p className="font-semibold text-slate-800">ข้อมูลของแต่ละหน้า</p><p className="text-slate-500">ข่าว ผลงาน และสินค้ามีชื่อกับคำอธิบายสำหรับการค้นหาของตัวเอง จึงแก้ในหน้ารายการนั้น</p></div>
            </div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">ตัวอย่างผลการค้นหา</h2></div>
            <div className="p-5">
              <p className="truncate text-xs text-emerald-700">{settings.siteUrl || "https://www.yakyai2015.co.th"}</p>
              <p className="mt-1 text-lg font-medium leading-6 text-blue-700">{settings.siteTitle || "ชื่อเว็บไซต์"}</p>
              <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{settings.siteDescription || "คำอธิบายเว็บไซต์จะแสดงบริเวณนี้"}</p>
            </div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[1.91/1] bg-slate-100">
              {settings.shareImage ? <img src={settings.shareImage} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center px-6 text-center text-sm text-slate-500">ภาพสำหรับการแชร์ลิงก์</div>}
            </div>
            <div className="p-4"><p className="font-semibold leading-6 text-slate-900">{settings.shareTitle || "ชื่อบนการ์ดแชร์"}</p><p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{settings.shareDescription || "ข้อความบนการ์ดแชร์"}</p></div>
          </section>
        </aside>
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
  const [discoverySettings, setDiscoverySettings] = useState(initialDiscoverySettings);

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

  const updateMessage = (id: string, patch: Partial<DemoMessage>) => {
    setMessages((current) => current.map((message) => message.id === id ? { ...message, ...patch } : message));
  };

  const addDocument = () => {
    setDocuments((current) => [{ id: `download-${Date.now()}`, name: "เอกสารใหม่.pdf", category: "เอกสารประกอบ", updatedAt: "เมื่อสักครู่", status: "ร่าง" }, ...current]);
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
            ? <Messages messages={messages} onOpenMessage={openMessage} onStatusChange={changeMessageStatus} onUpdateMessage={updateMessage} />
            : screen === "downloads"
              ? <Downloads documents={documents} onAddDocument={addDocument} onToggleStatus={toggleDocumentStatus} />
              : <DiscoverySettingsPage settings={discoverySettings} onChange={setDiscoverySettings} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="lg:flex">
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:sticky lg:top-0 lg:block lg:h-screen lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`} aria-label="เมนูผู้ดูแลระบบ">
          <div className="px-2 pb-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm">YY</div><div><p className="font-semibold text-slate-900">ยักษ์ใหญ่ 2015</p><p className="text-xs text-slate-500">ระบบจัดการเนื้อหา</p></div></div></div>
          <nav className="space-y-1" aria-label="เมนูหลัก">{navItems.map((item) => { const isActive = screen === item.id; return <button key={item.id} type="button" onClick={() => selectScreen(item.id)} aria-current={isActive ? "page" : undefined} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${focusRing} ${isActive ? "bg-brand-700 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>{item.label}</button>; })}</nav>
          <div className="absolute right-4 bottom-5 left-4 space-y-1 border-t border-slate-100 pt-4"><button type="button" onClick={() => setIsAuthenticated(false)} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}>ออกจากระบบ</button><button type="button" onClick={onExit} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusRing}`}>กลับสู่เว็บไซต์</button></div>
        </aside>
        {mobileNavOpen && <button type="button" aria-label="ปิดเมนูนำทาง" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-20 bg-slate-950/20 lg:hidden" />}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-9"><div className="mx-auto max-w-7xl"><button type="button" onClick={() => setMobileNavOpen(true)} className={`mb-5 inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden ${focusRing}`}>เมนูผู้ดูแล</button>{page}</div></main>
      </div>
    </div>
  );
}
