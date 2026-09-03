#!/usr/bin/env node
/**
 * import-customer-data.mjs
 * -----------------------------------------------------------------------------
 * Bulk-loads the customer-supplied portfolio + product content (and the project
 * photos) into the CMS through the admin API, so it does not have to be typed
 * in by hand.
 *
 * The text below was transcribed from:
 *   datacustomer/.../yakyai data/ผลงาน/ผลงานติดตั้ง.docx
 *   datacustomer/.../yakyai data/สินค้า/รายการสินค้า.docx
 * Edit the PROJECTS / PRODUCTS arrays if the wording needs to change, then
 * re-run. Existing items (matched by slug) are left untouched.
 *
 * Usage:
 *   # offline preview (no login, just prints the plan + image counts)
 *   node scripts/import-customer-data.mjs
 *
 *   # preview against the live API (also reports which slugs already exist)
 *   YAKYAI_ADMIN_EMAIL=admin@yakyai2015.com YAKYAI_ADMIN_PASSWORD=... \
 *     node scripts/import-customer-data.mjs
 *
 *   # actually write (creates DRAFT items; add --status published to publish)
 *   YAKYAI_ADMIN_EMAIL=... YAKYAI_ADMIN_PASSWORD=... \
 *     node scripts/import-customer-data.mjs --commit
 *
 * Flags:
 *   --commit              perform writes (otherwise dry run)
 *   --status published    create as PUBLISHED instead of DRAFT
 *   --only projects|products
 *   --api <url>           API base (default $YAKYAI_API_BASE or https://api.yakyai2015.com)
 *   --email / --password  credentials (or use env vars)
 *
 * Requires Node 20+ (global fetch / FormData / Blob).
 * -----------------------------------------------------------------------------
 */

import { readdir, readFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const REPO = join(HERE, "..");
const DATA_ROOT = join(
  REPO,
  "datacustomer",
  "yakyai data-20260903T184736Z-1-001",
  "yakyai data",
);
const PORTFOLIO_ROOT = join(DATA_ROOT, "ผลงาน");

/* ─── args ──────────────────────────────────────────────────────────────── */
const argv = process.argv.slice(2);
const hasFlag = (f) => argv.includes(f);
const flagValue = (f, fallback) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

if (hasFlag("--help") || hasFlag("-h")) {
  console.log("See the usage comment at the top of scripts/import-customer-data.mjs");
  process.exit(0);
}

const COMMIT = hasFlag("--commit");
const ONLY = flagValue("--only", "all");
const STATUS =
  flagValue("--status", "draft").toLowerCase() === "published"
    ? "PUBLISHED"
    : "DRAFT";
const API_BASE = flagValue(
  "--api",
  process.env.YAKYAI_API_BASE || "https://api.yakyai2015.com",
).replace(/\/+$/, "");
const EMAIL = flagValue("--email", process.env.YAKYAI_ADMIN_EMAIL || "");
const PASSWORD = flagValue("--password", process.env.YAKYAI_ADMIN_PASSWORD || "");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/* ─── content (transcribed from the .docx files) ────────────────────────── */

/** @type {Array<{slug:string,title:string,folder:string,province:string,industry:string,system:string,summary:string,description:string,year?:number}>} */
const PROJECTS = [
  {
    slug: "cassava-chip-gasifier-nakhon-ratchasima",
    title: "ระบบแก๊สซิไฟเออร์โรงงานอบมันเส้น จ.นครราชสีมา",
    folder: "บริษัท อบมันสำปะหลัง จ.นครราชสีมา",
    province: "นครราชสีมา",
    industry: "โรงงานแปรรูปผลิตผลทางการเกษตร (อบมันเส้น)",
    system: "เตาแก๊สซิไฟเออร์ 1 MW และ 750 kW พร้อมเครื่องอบมันสำปะหลัง",
    summary:
      "ออกแบบ ผลิต และติดตั้งเตาแก๊สซิไฟเออร์ 1 MW และ 750 kW พร้อมเครื่องอบมันสำปะหลัง สำหรับกระบวนการอบแห้งของโรงงาน",
    description:
      "ออกแบบเครื่องอบมันสำปะหลัง ผลิต และติดตั้งระบบเตาแก๊สซิไฟเออร์ขนาด 1 MW จำนวน 1 เครื่อง และ 750 kW จำนวน 1 เครื่อง สำหรับผลิตพลังงานความร้อนจากเชื้อเพลิงชีวมวล เพื่อใช้ในกระบวนการอบแห้งของโรงงาน โดยระบบได้รับการออกแบบให้รองรับการทำงานอย่างต่อเนื่อง และเชื่อมต่อกับระบบอบแห้งของกระบวนการผลิต",
  },
  {
    slug: "sand-drying-gasifier-nakhon-ratchasima",
    title: "ระบบแก๊สซิไฟเออร์โรงงานอบทราย จ.นครราชสีมา",
    folder: "บริษัท อบทราย จ.นครราชสีมา",
    province: "นครราชสีมา",
    industry: "โรงงานอบทราย",
    system: "เตาแก๊สซิไฟเออร์ 1 MW และ 1.5 MW",
    summary:
      "ออกแบบ ผลิต และติดตั้งเตาแก๊สซิไฟเออร์ 1 MW และ 1.5 MW สำหรับผลิตความร้อนในกระบวนการอบทราย",
    description:
      "ออกแบบ ผลิต และติดตั้งระบบเตาแก๊สซิไฟเออร์สำหรับผลิตความร้อนเพื่อใช้ในกระบวนการอบทราย โดยติดตั้งเตาแก๊สซิไฟเออร์ขนาด 1 MW และ 1.5 MW พร้อมระบบควบคุมและอุปกรณ์ประกอบที่เกี่ยวข้อง เพื่อรองรับการใช้งานในกระบวนการผลิตของโรงงาน",
    year: 2024,
  },
  {
    slug: "gypsum-gasifier-phichit",
    title: "ระบบแก๊สซิไฟเออร์โรงอบยิปซัม จ.พิจิตร",
    folder: "บริษัท อบยิบซั่ม จ.พิจิตร",
    province: "พิจิตร",
    industry: "โรงอบยิปซัม",
    system: "เตาแก๊สซิไฟเออร์ 1.5 MW",
    summary:
      "ออกแบบ ผลิต และติดตั้งเตาแก๊สซิไฟเออร์ 1.5 MW สำหรับผลิตความร้อนในกระบวนการอบยิปซัม",
    description:
      "ออกแบบ ผลิต และติดตั้งระบบเตาแก๊สซิไฟเออร์สำหรับผลิตความร้อนเพื่อใช้ในกระบวนการอบยิปซัม พร้อมระบบควบคุมและอุปกรณ์ประกอบที่เกี่ยวข้อง โดยออกแบบระบบให้เหมาะสมกับกระบวนการผลิตและลักษณะการใช้งานของโรงงาน",
    year: 2024,
  },
  {
    slug: "cassava-drying-kamphaeng-phet",
    title: "ระบบแก๊สซิไฟเออร์โรงงานอบมันสำปะหลัง จ.กำแพงเพชร",
    folder: "บริษัท อบมันสำปะหลัง จ.กำแพงเพชร",
    province: "กำแพงเพชร",
    industry: "โรงงานอบมันสำปะหลัง",
    system: "เตาแก๊สซิไฟเออร์ 1.5 MW จำนวน 2 เครื่อง พร้อมตู้อบมันสำปะหลัง",
    summary:
      "ออกแบบและผลิตตู้อบมันสำปะหลัง พร้อมเตาแก๊สซิไฟเออร์ 1.5 MW จำนวน 2 เครื่อง เป็นแหล่งความร้อน",
    description:
      "ออกแบบและผลิตตู้อบมันสำปะหลังให้เหมาะสมกับกระบวนการผลิต พร้อมออกแบบระบบให้สามารถทำงานร่วมกับเตาแก๊สซิไฟเออร์ขนาด 1.5 MW จำนวน 2 เครื่อง เพื่อใช้เป็นแหล่งผลิตความร้อนสำหรับกระบวนการอบมันสำปะหลัง โดยคำนึงถึงความเหมาะสมของระบบความร้อนและการใช้งานร่วมกันของอุปกรณ์ในกระบวนการผลิต",
    year: 2023,
  },
  {
    slug: "fertilizer-gasifier-ayutthaya",
    title: "ระบบแก๊สซิไฟเออร์โรงงานอบปุ๋ย จ.พระนครศรีอยุธยา",
    folder: "บริษัท อบปุ๋ย จ.พระนครศรีอยุธยา",
    province: "พระนครศรีอยุธยา",
    industry: "โรงงานอบปุ๋ย",
    system: "เตาแก๊สซิไฟเออร์ 1.5 MW จำนวน 3 เครื่อง",
    summary:
      "ผลิตและติดตั้งเตาแก๊สซิไฟเออร์ 1.5 MW จำนวน 3 เครื่อง จ่ายพลังงานความร้อนให้ระบบอบปุ๋ย",
    description:
      "ผลิต และติดตั้งระบบเตาแก๊สซิไฟเออร์ ขนาด 1.5 MW จำนวน 3 เครื่อง สำหรับผลิตและจ่ายพลังงานความร้อนให้แก่ระบบอบปุ๋ย เพื่อรองรับการใช้งานในกระบวนการผลิตของโรงงาน",
    year: 2025,
  },
  {
    slug: "fertilizer-gasifier-kanchanaburi",
    title: "ระบบแก๊สซิไฟเออร์โรงงานอบปุ๋ย จ.กาญจนบุรี",
    folder: "บริษัท อบปุ๋ย จ.กาญจนบุรี",
    province: "กาญจนบุรี",
    industry: "โรงงานอบปุ๋ย",
    system: "เตาแก๊สซิไฟเออร์ 1.5 MW จำนวน 2 เครื่อง",
    summary:
      "ผลิตและติดตั้งเตาแก๊สซิไฟเออร์ 1.5 MW จำนวน 2 เครื่อง จ่ายพลังงานความร้อนให้ระบบอบปุ๋ย",
    description:
      "ผลิต และติดตั้งระบบเตาแก๊สซิไฟเออร์ ขนาด 1.5 MW จำนวน 2 เครื่อง สำหรับผลิตและจ่ายพลังงานความร้อนให้แก่ระบบอบปุ๋ย เพื่อรองรับการใช้งานในกระบวนการผลิตของโรงงาน",
    year: 2022,
  },
  {
    slug: "cassava-pulp-dryer-surin",
    title: "ระบบอบกากแป้งมันสำปะหลังครบวงจร จ.สุรินทร์",
    folder: "บริษัท อบกากแป้ง จ.สุรินทร์",
    province: "สุรินทร์",
    industry: "โรงงานอบกากแป้งมันสำปะหลัง",
    system: "เตาแก๊สซิไฟเออร์ 1.5 MW พร้อมเครื่องอบกากมันสำปะหลัง 1 ชุด",
    summary:
      "ออกแบบ ผลิต และติดตั้งระบบอบกากแป้งมันสำปะหลังแบบครบวงจร พร้อมเตาแก๊สซิไฟเออร์ 1.5 MW",
    description:
      "ออกแบบ ผลิต และติดตั้งระบบอบกากแป้งมันสำปะหลังแบบครบวงจร โดยออกแบบและผลิตเครื่องอบกากมันสำปะหลังให้เหมาะสมกับกระบวนการผลิต พร้อมออกแบบและติดตั้งระบบเตาแก๊สซิไฟเออร์ ขนาด 1.5 MW สำหรับผลิตและจ่ายพลังงานความร้อนให้แก่เครื่องอบ เพื่อใช้ในการลดความชื้นของกากมันสำปะหลัง และให้ทั้งสองระบบสามารถทำงานร่วมกันได้อย่างมีประสิทธิภาพ",
  },
  {
    slug: "coal-gasifier-ayutthaya",
    title: "ระบบแก๊สซิไฟเออร์โรงงานผลิตเชื้อเพลิงแข็ง จ.พระนครศรีอยุธยา",
    folder: "บริษัท ผลิตเชื้อเพลิงแข็ง จ.พระนครศรีอยุธยา",
    province: "พระนครศรีอยุธยา",
    industry: "ถ่านหินและเชื้อเพลิงแข็ง",
    system: "เตาแก๊สซิไฟเออร์ 1.5 MW",
    summary:
      "ผลิตและติดตั้งเตาแก๊สซิไฟเออร์ 1.5 MW สำหรับกระบวนการผลิตเชื้อเพลิงแข็ง",
    description:
      "ผลิตและติดตั้งระบบเตาแก๊สซิไฟเออร์ ขนาด 1.5 MW จำนวน 1 เครื่อง เพื่อผลิตพลังงานความร้อนสำหรับนำไปใช้ในกระบวนการผลิตเชื้อเพลิงแข็ง โดยออกแบบระบบให้เหมาะสมกับลักษณะการใช้งานและกระบวนการผลิตของโรงงาน",
    year: 2024,
  },
  {
    slug: "steam-boiler-gasifier-lamphun",
    title: "ระบบแก๊สซิไฟเออร์สำหรับ Steam Boiler จ.ลำพูน",
    folder: "บริษัท นำไปใช้กับระบบสตีมบอยเลอร์ จ.ลำพูน",
    province: "ลำพูน",
    industry: "อุตสาหกรรมที่ใช้สตีมบอยเลอร์",
    system: "เตาแก๊สซิไฟเออร์ 1.5 MW พร้อมระบบแทงหัวฉีดอัตโนมัติ",
    summary:
      "ออกแบบ ผลิต และติดตั้งเตาแก๊สซิไฟเออร์ 1.5 MW พร้อมระบบแทงหัวฉีดอัตโนมัติ ป้อนความร้อนให้ระบบ Steam Boiler",
    description:
      "ออกแบบ ผลิต และติดตั้งระบบเตาแก๊สซิไฟเออร์ ขนาด 1.5 MW พร้อมระบบแทงหัวฉีดอัตโนมัติ เพื่อนำพลังงานความร้อนที่ได้จากเตาแก๊สซิไฟเออร์ไปใช้ในระบบ Steam Boiler เพื่อผลิตพลังงานไฟฟ้า รองรับการนำพลังงานความร้อนจากเชื้อเพลิงชีวมวลมาใช้ให้เกิดประโยชน์สูงสุดในกระบวนการผลิต",
  },
];

/** @type {Array<{slug:string,title:string,category:string,subtitle:string,description:string,highlights?:string[],suitableFor?:string,workingPrinciple?:string,specifications?:{label:string,value:string}[]}>} */
const PRODUCTS = [
  {
    slug: "gasifier-1-5mw",
    title: "เตาแก๊สซิไฟเออร์ 1.5 MW",
    category: "เตาแก๊สซิไฟเออร์",
    subtitle:
      "ระบบผลิตก๊าซเชื้อเพลิงจากชีวมวล สำหรับทดแทนพลังงานความร้อนในภาคอุตสาหกรรม",
    description:
      "เตาแก๊สซิไฟเออร์ขนาด 1.5 MW เหมาะสำหรับกระบวนการผลิตที่ต้องการพลังงานความร้อนอย่างต่อเนื่อง เช่น เครื่องอบแห้งมันสำปะหลังและผลิตผลทางการเกษตร ระบบอบแห้งแร่ ทราย และยิปซัม กระบวนการผลิตปุ๋ยและอาหารสัตว์ เตาเผาหรือเครื่องจักรที่สามารถประยุกต์ใช้ก๊าซเชื้อเพลิง และกระบวนการผลิตอื่นที่ต้องการทดแทน LPG หรือน้ำมันเชื้อเพลิง ระบบสามารถออกแบบให้เชื่อมต่อกับเครื่องจักรเดิมของโรงงาน หรือออกแบบเป็นระบบใหม่ร่วมกับเครื่องอบและอุปกรณ์ลำเลียงได้ตามความเหมาะสมของหน้างาน",
    highlights: [
      "ผลิตก๊าซเชื้อเพลิงจากพลังงานชีวมวล เหมาะสำหรับการผลิตพลังงานความร้อนระดับอุตสาหกรรม",
      "ช่วยลดการพึ่งพาก๊าซ LPG และเชื้อเพลิงฟอสซิล",
      "รองรับการทำงานต่อเนื่องตามเงื่อนไขที่กำหนด",
      "ควบคุมและตรวจสอบการทำงานผ่านระบบ PLC",
      "ปรับรูปแบบระบบให้เหมาะกับกระบวนการผลิตเดิมได้",
      "มีถ่านและเถ้าเป็นผลพลอยได้จากกระบวนการ",
    ],
    suitableFor:
      "โรงงานอบแห้งมันสำปะหลังและผลิตผลเกษตร, ระบบอบแร่ ทราย ยิปซัม, โรงงานปุ๋ยและอาหารสัตว์, กระบวนการที่ต้องการทดแทน LPG หรือน้ำมันเชื้อเพลิง",
  },
  {
    slug: "gasifier-1-5mw-auto-poker",
    title: "เตาแก๊สซิไฟเออร์ 1.5 MW พร้อมระบบแทงหัวฉีดอัตโนมัติ",
    category: "เตาแก๊สซิไฟเออร์",
    subtitle:
      "ยกระดับการควบคุมเตาแก๊สซิไฟเออร์ด้วยระบบแทงหัวฉีดอัตโนมัติ ลดภาระผู้ปฏิบัติงาน",
    description:
      "ระหว่างการเดินเตาแก๊สซิไฟเออร์ วัสดุที่เกิดจากกระบวนการอาจสะสมบริเวณหัวฉีดหรือช่องจ่ายอากาศภายในเตา หากปล่อยให้เกิดการอุดตัน อากาศอาจเข้าสู่เตาได้ไม่สม่ำเสมอและส่งผลต่อการควบคุมปฏิกิริยาภายในเตา เตาแก๊สซิไฟเออร์รุ่นนี้จึงติดตั้งระบบแทงหัวฉีดอัตโนมัติ เพื่อช่วยดันหรือกำจัดวัสดุที่สะสมบริเวณหัวฉีดตามลำดับการทำงานที่กำหนด ช่วยรักษาทางเดินของอากาศ ลดโอกาสเกิดการอุดตัน และลดความจำเป็นในการให้พนักงานเข้าไปแทงหัวฉีดด้วยมือเป็นประจำ การทำงานของชุดแทงหัวฉีดสามารถควบคุมร่วมกับระบบ PLC โดยกำหนดช่วงเวลาและลำดับการทำงานให้เหมาะกับสภาวะของเตาและเชื้อเพลิงที่ใช้",
    highlights: [
      "ลดการอุดตันบริเวณหัวฉีดและช่องจ่ายอากาศ",
      "รักษาการจ่ายอากาศให้สม่ำเสมอ ควบคุมปฏิกิริยาในเตาได้ดีขึ้น",
      "ลดการเข้าแทงหัวฉีดด้วยมือของผู้ปฏิบัติงาน",
      "ควบคุมช่วงเวลาและลำดับการทำงานผ่านระบบ PLC",
      "สนับสนุนการผลิตก๊าซเชื้อเพลิงอย่างต่อเนื่อง",
    ],
  },
  {
    slug: "gasifier-750k",
    title: "เตาแก๊สซิไฟเออร์ 750 kW",
    category: "เตาแก๊สซิไฟเออร์",
    subtitle: "ระบบขนาดกะทัดรัดสำหรับผู้ประกอบการ SME และโรงงานขนาดเล็ก",
    description:
      "เตาแก๊สซิไฟเออร์ 750 kW ออกแบบสำหรับผู้ประกอบการ SME และโรงงานขนาดเล็กที่ต้องการลดต้นทุนด้านพลังงาน ด้วยระบบที่มีขนาดกะทัดรัด ใช้งานง่าย และให้ประสิทธิภาพการผลิตความร้อนที่เหมาะสมกับกำลังการผลิตของธุรกิจ",
    highlights: [
      "ขนาดกะทัดรัด ติดตั้งในพื้นที่จำกัดได้",
      "ใช้งานง่าย เหมาะกับโรงงานขนาดเล็กและ SME",
      "ช่วยลดต้นทุนพลังงานด้วยเชื้อเพลิงชีวมวล",
    ],
    suitableFor: "ผู้ประกอบการ SME และโรงงานขนาดเล็กที่ต้องการลดต้นทุนพลังงาน",
  },
  {
    slug: "cassava-pulp-dryer",
    title: "เครื่องอบกากมันสำปะหลัง",
    category: "เครื่องจักรอบแห้ง",
    subtitle:
      "เครื่องอบกากแป้งมันสำปะหลังสำหรับโรงงานผลิตแป้งมันและผู้ที่ต้องการลดความชื้นของกากแป้ง",
    description:
      "เครื่องอบกากแป้งมันสำปะหลัง ออกแบบสำหรับโรงงานผลิตแป้งมันสำปะหลังและผู้ประกอบการที่ต้องการลดความชื้นของกากแป้ง เพื่อนำไปใช้ประโยชน์ต่อหรือเพิ่มมูลค่าของผลผลิต",
    highlights: [
      "ออกแบบสำหรับการอบกากแป้งมันสำปะหลังโดยเฉพาะ",
      "ลดความชื้นของกากแป้งเพื่อใช้งานหรือจำหน่ายต่อ",
      "ทำงานร่วมกับระบบผลิตความร้อนจากเตาแก๊สซิไฟเออร์",
      "ใช้พลังงานจากชีวมวล ช่วยลดต้นทุนเชื้อเพลิง",
      "ระบบอบแห้งแบบต่อเนื่อง เหมาะกับกำลังการผลิตสูง",
      "ออกแบบกำลังการผลิตและระบบให้เหมาะกับแต่ละโรงงาน",
    ],
  },
  {
    slug: "cassava-dryer",
    title: "เครื่องอบมันสำปะหลัง",
    category: "เครื่องจักรอบแห้ง",
    subtitle:
      "ระบบอบแห้งมันสำปะหลังด้วยชีวมวลแบบสายพานสแตนเลส พร้อมระบบผลิตความร้อนจากเตาแก๊สซิไฟเออร์",
    description:
      "ระบบเครื่องอบแห้งมันสำปะหลังด้วยชีวมวลแบบสายพานสแตนเลส พร้อมระบบผลิตความร้อนจากเตาแก๊สซิไฟเออร์ ออกแบบสำหรับโรงงานและผู้ประกอบการที่ต้องการอบแห้งมันสำปะหลังและลดต้นทุนด้านพลังงาน โดยใช้ชีวมวลเป็นเชื้อเพลิงในการผลิตความร้อน ระบบมีกำลังการผลิตมันสำปะหลังสดประมาณ 3.5–3.8 ตันต่อชั่วโมง และรับรองกำลังการผลิตไม่น้อยกว่า 3 ตันมันสำปะหลังสดต่อชั่วโมง ภายใต้เงื่อนไขวัตถุดิบที่มีเปอร์เซ็นต์แป้งไม่น้อยกว่า 25%",
    highlights: [
      "ใช้ชีวมวลเป็นเชื้อเพลิงผ่านระบบเตาแก๊สซิไฟเออร์ ลดต้นทุนพลังงาน",
      "ระบบผลิตความร้อนและระบบอบแห้งทำงานร่วมกัน",
      "สายพานสแตนเลส เหมาะกับการอบแห้งผลิตภัณฑ์เกษตร",
      "กำลังการผลิตประมาณ 3.5–3.8 ตันมันสำปะหลังสดต่อชั่วโมง",
      "รับรองกำลังการผลิตไม่น้อยกว่า 3 ตันต่อชั่วโมงภายใต้เงื่อนไขที่กำหนด",
    ],
    specifications: [
      { label: "กำลังการผลิต", value: "ประมาณ 3.5–3.8 ตันมันสำปะหลังสดต่อชั่วโมง" },
      { label: "กำลังการผลิตรับรอง", value: "ไม่น้อยกว่า 3 ตันต่อชั่วโมง" },
      { label: "เงื่อนไขวัตถุดิบ", value: "เปอร์เซ็นต์แป้งไม่น้อยกว่า 25%" },
      { label: "ประเภทสายพาน", value: "สแตนเลส" },
      { label: "แหล่งความร้อน", value: "เตาแก๊สซิไฟเออร์ (เชื้อเพลิงชีวมวล)" },
    ],
  },
];

/* ─── helpers ───────────────────────────────────────────────────────────── */

function die(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

async function login() {
  if (!EMAIL || !PASSWORD) {
    die(
      "credentials required for API calls — set YAKYAI_ADMIN_EMAIL / YAKYAI_ADMIN_PASSWORD (or pass --email/--password)",
    );
  }
  const res = await fetch(`${API_BASE}/api/v1/admin/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) die(`login failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  const cookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of cookies) {
    const m = /(?:^|;\s*)yakyai_admin_token=([^;]+)/.exec(c);
    if (m) return decodeURIComponent(m[1]);
  }
  die("login succeeded but no yakyai_admin_token cookie was returned");
}

async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function uploadImage(filePath, token) {
  const buf = await readFile(filePath);
  if (buf.byteLength > MAX_UPLOAD_BYTES) {
    console.warn(`    ⚠ skip (> 10 MB): ${basename(filePath)}`);
    return null;
  }
  const ext = extname(filePath).toLowerCase();
  const form = new FormData();
  form.append(
    "file",
    new Blob([buf], { type: MIME[ext] || "application/octet-stream" }),
    basename(filePath),
  );
  const res = await fetch(`${API_BASE}/api/v1/admin/media/upload`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: form,
  });
  const text = await res.text();
  if (!res.ok)
    throw new Error(`upload ${basename(filePath)} → ${res.status} ${text.slice(0, 200)}`);
  return JSON.parse(text).data.id;
}

async function collectImages(dir) {
  const found = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await collectImages(full)));
    else if (IMAGE_EXT.has(extname(entry.name).toLowerCase())) found.push(full);
  }
  return found.sort((a, b) => a.localeCompare(b));
}

/* ─── importers ─────────────────────────────────────────────────────────── */

async function importProducts(token) {
  console.log(`\n=== PRODUCTS (${PRODUCTS.length}) ===`);
  const existing = token
    ? new Set((await api("/admin/products?pageSize=200", { token })).data.map((p) => p.slug))
    : new Set();

  for (const [i, product] of PRODUCTS.entries()) {
    const tag = `[${i + 1}/${PRODUCTS.length}] ${product.slug}`;
    if (existing.has(product.slug)) {
      console.log(`  ${tag} — already exists, skipping`);
      continue;
    }
    if (!COMMIT) {
      console.log(`  ${tag} — would create (${STATUS})`);
      continue;
    }
    const payload = {
      slug: product.slug,
      title: product.title,
      status: STATUS,
      category: product.category,
      subtitle: product.subtitle,
      description: product.description,
      displayOrder: i,
      ...(product.highlights ? { highlights: product.highlights } : {}),
      ...(product.suitableFor ? { suitableFor: product.suitableFor } : {}),
      ...(product.workingPrinciple ? { workingPrinciple: product.workingPrinciple } : {}),
      ...(product.specifications ? { specifications: product.specifications } : {}),
    };
    const created = (await api("/admin/products", { method: "POST", body: payload, token }))
      .data;
    console.log(`  ${tag} — created ${created.id} (${STATUS})`);
  }
}

async function importProjects(token) {
  console.log(`\n=== PROJECTS (${PROJECTS.length}) ===`);
  const existing = token
    ? new Set((await api("/admin/projects?pageSize=200", { token })).data.map((p) => p.slug))
    : new Set();

  for (const [i, project] of PROJECTS.entries()) {
    const images = await collectImages(join(PORTFOLIO_ROOT, project.folder));
    const tag = `[${i + 1}/${PROJECTS.length}] ${project.slug}`;
    console.log(`  ${tag} — ${images.length} image(s) in "${project.folder}"`);

    if (existing.has(project.slug)) {
      console.log(`      already exists, skipping`);
      continue;
    }
    if (!COMMIT) {
      console.log(`      would create (${STATUS}) + upload ${images.length} image(s)`);
      continue;
    }

    const mediaIds = [];
    for (const image of images) {
      try {
        const id = await uploadImage(image, token);
        if (id) {
          mediaIds.push(id);
          process.stdout.write(".");
        }
      } catch (err) {
        console.warn(`\n      ⚠ ${err.message}`);
      }
    }
    if (mediaIds.length) process.stdout.write("\n");

    const payload = {
      slug: project.slug,
      title: project.title,
      status: STATUS,
      province: project.province,
      industry: project.industry,
      system: project.system,
      summary: project.summary,
      description: project.description,
      displayOrder: i,
      featured: i < 3,
      ...(project.year ? { completedYear: project.year } : {}),
      ...(mediaIds[0] ? { coverImageId: mediaIds[0] } : {}),
    };
    const created = (await api("/admin/projects", { method: "POST", body: payload, token }))
      .data;
    console.log(`      created ${created.id} (${STATUS}), cover: ${mediaIds[0] ? "yes" : "none"}`);

    let sort = 0;
    for (const mediaId of mediaIds.slice(1)) {
      try {
        await api(`/admin/projects/${created.id}/gallery`, {
          method: "POST",
          body: { mediaId, sortOrder: sort++ },
          token,
        });
      } catch (err) {
        console.warn(`      ⚠ gallery: ${err.message}`);
      }
    }
    console.log(`      gallery: ${Math.max(0, mediaIds.length - 1)} image(s)`);
  }
}

/* ─── main ──────────────────────────────────────────────────────────────── */

async function main() {
  const wantsApi = COMMIT || Boolean(EMAIL && PASSWORD);
  const token = wantsApi ? await login() : null;

  console.log(
    `\nAPI:    ${API_BASE}` +
      `\nmode:   ${COMMIT ? "COMMIT (writing)" : "DRY RUN"}` +
      `\nstatus: ${STATUS}` +
      `\nauth:   ${token ? "logged in" : "offline (plan only)"}` +
      `\nonly:   ${ONLY}`,
  );

  if (ONLY === "all" || ONLY === "products") await importProducts(token);
  if (ONLY === "all" || ONLY === "projects") await importProjects(token);

  console.log(
    COMMIT
      ? "\n✔ done. Review the items in the admin portal, then publish if they were created as drafts.\n"
      : "\n✔ dry run complete. Re-run with --commit (and credentials) to write.\n",
  );
}

main().catch((err) => die(err.stack || String(err)));
