import { COMPANY } from "../../config/company";
import { Screen, DiscoverySettings } from "./types";

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
