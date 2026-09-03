export type AdminPortalProps = {
  onExit: () => void;
};

export type Screen = "dashboard" | "activity" | "portfolio" | "news" | "products" | "messages" | "downloads";
export type ContentType = "portfolio" | "news" | "products";
export type ContentStatus = "ร่าง" | "เผยแพร่";
export type ActivityAction = "เพิ่ม" | "แก้ไข" | "เผยแพร่" | "ยกเลิกเผยแพร่" | "ลบ";
export type ActivityContentType = "ผลงาน" | "ข่าวสาร" | "สินค้า" | "เอกสาร";

export type ContentActivity = {
  id: string;
  contentId: string;
  action: ActivityAction;
  contentType: ActivityContentType;
  title: string;
  at: string;
  actor: string;
  createdAt: number;
  screen: Screen;
};

export type ContentBlockKind = "ข้อความ" | "รูปภาพ" | "ปุ่ม/ลิงก์";
export type ContentBlock = {
  id: string;
  kind: ContentBlockKind;
  title: string;
  content: string;
};

export type ContentItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string;
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
  suitableFor?: string;
  workingPrinciple?: string;
  coverImage?: string;
  coverImageId?: string | null;
  displayOrder?: number;
  gallery?: string;
  featured?: boolean;
  tags?: string;
  contentBlocks?: ContentBlock[];
};

export type MessageStatus = "ใหม่" | "กำลังดำเนินการ" | "ติดต่อแล้ว" | "ปิดงาน" | "สแปม";

export type DemoMessage = {
  id: string;
  sender: string;
  company: string;
  subject: string;
  detail: string;
  receivedAt: string;
  phone: string;
  contact: string;
  source: string;
  status: MessageStatus;
  assignedTo: string;
  assignedToUserId?: string | null;
  followUpAt: string;
  internalNote: string;
};

export type DownloadItem = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  description?: string;
  fileId?: string | null;
  fileUrl?: string | null;
  updatedAt: string;
  status: ContentStatus;
};

