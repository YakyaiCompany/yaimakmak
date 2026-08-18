import { COMPANY } from "../../config/company";
import { NEWS, PRODUCTS, PROJECTS } from "../../data/siteContent";
import { Screen, ContentItem, DemoMessage, DownloadItem, ContentActivity, DiscoverySettings } from "./types";

export const navItems: Array<{ id: Screen; label: string }> = [
  { id: "dashboard", label: "ภาพรวม" },
  { id: "activity", label: "ประวัติการเปลี่ยนแปลง" },
  { id: "portfolio", label: "ผลงาน" },
  { id: "news", label: "ข่าวสาร" },
  { id: "products", label: "สินค้า" },
  { id: "messages", label: "ข้อความติดต่อ" },
  { id: "downloads", label: "เอกสารดาวน์โหลด" },
  { id: "discovery", label: "การค้นหาและการแชร์" },
];

export const initialDiscoverySettings: DiscoverySettings = {
  siteTitle: `${COMPANY.legalNameEn} | ระบบพลังงานชีวมวลอุตสาหกรรม`,
  siteDescription: "ออกแบบ ผลิต ติดตั้ง และดูแลระบบเตาแก๊สซิไฟเออร์และเครื่องจักรอบแห้งสำหรับโรงงานอุตสาหกรรม",
  siteUrl: "https://www.yakyai2015.co.th",
  shareTitle: `${COMPANY.shortName} — ระบบพลังงานชีวมวลสำหรับโรงงาน`,
  shareDescription: "ระบบผลิตความร้อนชีวมวลและเครื่องจักรอบแห้ง ออกแบบให้เหมาะกับการใช้งานจริงของแต่ละโรงงาน",
  shareImage: "",
  googleVerification: "",
  allowIndexing: true,
};

export const initialPortfolio: ContentItem[] = PROJECTS.map((project) => ({
  id: `portfolio-${project.id}`,
  title: project.name,
  category: project.industry,
  summary: project.summary,
  body: `${project.summary}\n\n${project.solution}`,
  seoTitle: `${project.name} | ${COMPANY.shortName}`,
  seoDescription: `${project.system} จังหวัด${project.province}`,
  status: "เผยแพร่",
  updatedAt: "อัปเดตจากข้อมูลบริษัท",
  author: "ผู้ดูแลระบบ",
  slug: project.slug,
  province: project.province,
  installedYear: project.year ? String(project.year) : "",
  system: project.system,
  challenge: project.challenge,
  solution: project.solution,
  scope: project.scope.join("\n"),
  result: project.result,
  coverImage: project.image,
  gallery: project.gallery.join("\n"),
  tags: `${project.industry}, ${project.system}, ${project.province}`,
  contentBlocks: [],
}));

export const initialNews: ContentItem[] = NEWS.map((article) => ({
  id: `news-${article.id}`,
  title: article.title,
  category: article.category,
  summary: article.excerpt,
  body: article.body.join("\n\n"),
  seoTitle: `${article.title} | ${COMPANY.shortName}`,
  seoDescription: article.excerpt,
  status: "เผยแพร่",
  updatedAt: article.date,
  author: article.author,
  slug: article.slug,
  publishDate: article.date,
  coverImage: article.image,
  tags: article.category,
  contentBlocks: [],
}));

export const initialProducts: ContentItem[] = PRODUCTS.map((product) => ({
  id: `product-${product.id}`,
  title: product.name,
  category: product.category,
  summary: product.desc,
  body: product.highlights.join("\n"),
  seoTitle: `${product.name} | ${COMPANY.shortName}`,
  seoDescription: product.subtitle,
  status: "เผยแพร่",
  updatedAt: "16 มิ.ย. 2568",
  author: "ผู้ดูแลระบบ",
  slug: product.name.toLowerCase().replace(/\s+/g, "-"),
  subtitle: product.subtitle,
  specifications: product.specs.map((item) => `${item.label}: ${item.value}`).join("\n"),
  fuelTypes: product.supportItems.join(", "),
  coverImage: product.image,
  tags: `${product.category}, ${product.supportItems.join(", ")}`,
  contentBlocks: [
    { id: `product-${product.id}-block-1`, kind: "รายการ", title: "จุดเด่นของระบบ", content: product.highlights.join("\n") },
    { id: `product-${product.id}-block-2`, kind: "ข้อความ", title: "การประเมินก่อนติดตั้ง", content: "ทีมวิศวกรจะพิจารณาความต้องการความร้อน ชนิดเชื้อเพลิง พื้นที่ และจุดเชื่อมต่อก่อนสรุปแบบระบบ" },
  ],
}));

export const initialMessages: DemoMessage[] = [
  { id: "message-1", sender: "สมชาย ใจดี", company: "โรงงานผลิตปุ๋ยภาคอีสาน", subject: "สอบถามระบบแก๊สซิไฟเออร์", detail: "สนใจประเมินระบบผลิตความร้อนสำหรับโรงงาน ปัจจุบันใช้ LPG ในกระบวนการอบวันละประมาณ 10 ชั่วโมง ต้องการให้ทีมงานติดต่อกลับเพื่อขอข้อมูลที่ใช้ประเมินเบื้องต้น", receivedAt: "วันนี้ 10:24", phone: "081-111-1111", contact: "somchai@example.com", interest: "เตาแก๊สซิไฟเออร์ 1.5 MW", source: "แบบฟอร์มติดต่อหน้าแรก", status: "ใหม่", factoryLocation: "นครราชสีมา", projectStage: "กำลังศึกษาความเป็นไปได้", budgetRange: "รอประเมิน", desiredTimeline: "ภายใน 6 เดือน", preferredContact: "โทรศัพท์ ช่วง 09:00–11:00", assignedTo: "ยังไม่มอบหมาย", followUpAt: "", internalNote: "" },
  { id: "message-2", sender: "วราภรณ์ พัฒนา", company: "โรงงานแปรรูปมันสำปะหลัง", subject: "ขอรายละเอียดสินค้า", detail: "ต้องการข้อมูลระบบอบแห้งและรายละเอียดทางเทคนิคเพื่อประกอบการวางแผนโครงการ มีพื้นที่ติดตั้งเดิมและต้องการเชื่อมต่อกับระบบลำเลียงที่ใช้งานอยู่", receivedAt: "เมื่อวาน 15:40", phone: "082-222-2222", contact: "LINE: woraporn-plant", interest: "Cassava Pulp Rotary Dryer", source: "แบบฟอร์มขอใบเสนอราคา", status: "กำลังดำเนินการ", factoryLocation: "กำแพงเพชร", projectStage: "จัดทำงบประมาณ", budgetRange: "3–5 ล้านบาท", desiredTimeline: "ไตรมาส 4", preferredContact: "LINE", assignedTo: "ฝ่ายขายโครงการ", followUpAt: "2026-07-30T10:00", internalNote: "ขอข้อมูลความชื้นวัตถุดิบและกำลังการผลิตต่อวันเพิ่มเติม" },
  { id: "message-3", sender: "นรินทร์ วิศวกรรม", company: "โรงงานวัสดุก่อสร้างภาคกลาง", subject: "ขอเอกสาร Company Profile", detail: "ต้องการ Company Profile และผลงานติดตั้งบางส่วนสำหรับนำเสนอฝ่ายบริหาร ก่อนนัดประชุมเก็บข้อมูลหน้างาน", receivedAt: "12 มิ.ย. 2568", phone: "083-333-3333", contact: "narin@example.com", interest: "Company Profile", source: "หน้าดาวน์โหลด", status: "ปิดงาน", factoryLocation: "สระบุรี", projectStage: "รวบรวมข้อมูลภายใน", budgetRange: "ยังไม่ระบุ", desiredTimeline: "ยังไม่กำหนด", preferredContact: "อีเมล", assignedTo: "ฝ่ายประสานงาน", followUpAt: "", internalNote: "ส่งเอกสารแนะนำบริษัทแล้ว" },
];

export const initialDownloads: DownloadItem[] = [
  { id: "download-1", name: "Company Profile.pdf", category: "ข้อมูลบริษัท", updatedAt: "16 มิ.ย. 2568", status: "เผยแพร่" },
  { id: "download-2", name: "Product Catalog.pdf", category: "แคตตาล็อกสินค้า", updatedAt: "14 มิ.ย. 2568", status: "เผยแพร่" },
  { id: "download-3", name: "Gasifier Specification Sheet.pdf", category: "เอกสารเทคนิค", updatedAt: "12 มิ.ย. 2568", status: "ร่าง" },
];

export const initialActivities: ContentActivity[] = [
  { id: "activity-1", contentId: "news-1", action: "เผยแพร่", contentType: "ข่าวสาร", title: NEWS[0]?.title ?? "บทความใหม่", at: "วันนี้ 11:42", actor: "ผู้ดูแลระบบ", createdAt: 9, screen: "news" },
  { id: "activity-2", contentId: "portfolio-1", action: "แก้ไข", contentType: "ผลงาน", title: PROJECTS[0]?.name ?? "ผลงานติดตั้ง", at: "วันนี้ 10:18", actor: "ผู้ดูแลระบบ", createdAt: 8, screen: "portfolio" },
  { id: "activity-3", contentId: "product-1", action: "แก้ไข", contentType: "สินค้า", title: PRODUCTS[0]?.name ?? "เตาแก๊สซิไฟเออร์ 1.5 MW", at: "เมื่อวาน 16:05", actor: "ผู้ดูแลระบบ", createdAt: 7, screen: "products" },
  { id: "activity-4", contentId: "download-3", action: "เพิ่ม", contentType: "เอกสาร", title: "Gasifier Specification Sheet.pdf", at: "เมื่อวาน 14:26", actor: "ผู้ดูแลระบบ", createdAt: 6, screen: "downloads" },
  { id: "activity-5", contentId: "news-2", action: "เพิ่ม", contentType: "ข่าวสาร", title: NEWS[1]?.title ?? "บทความพลังงานชีวมวล", at: "26 ก.ค. 2569 09:34", actor: "ผู้ดูแลระบบ", createdAt: 5, screen: "news" },
  { id: "activity-6", contentId: "portfolio-2", action: "เผยแพร่", contentType: "ผลงาน", title: PROJECTS[1]?.name ?? "โครงการติดตั้งระบบ", at: "25 ก.ค. 2569 15:12", actor: "ผู้ดูแลระบบ", createdAt: 4, screen: "portfolio" },
  { id: "activity-7", contentId: "product-2", action: "กำหนดเผยแพร่", contentType: "สินค้า", title: PRODUCTS[1]?.name ?? "เตาแก๊สซิไฟเออร์ 750 kW", at: "24 ก.ค. 2569 13:48", actor: "ผู้ดูแลระบบ", createdAt: 3, screen: "products" },
  { id: "activity-8", contentId: "news-removed", action: "ลบ", contentType: "ข่าวสาร", title: "ประกาศกำหนดการเดิม", at: "23 ก.ค. 2569 17:20", actor: "ผู้ดูแลระบบ", createdAt: 2, screen: "news" },
];
