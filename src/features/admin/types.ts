export type AdminPortalProps = {
  onExit: () => void;
};

export type Screen = "dashboard" | "activity" | "portfolio" | "news" | "products" | "messages" | "downloads" | "discovery";
export type ContentType = "portfolio" | "news" | "products";
export type ContentStatus = "ร่าง" | "กำหนดเผยแพร่" | "เผยแพร่";
export type ActivityAction = "เพิ่ม" | "แก้ไข" | "เผยแพร่" | "กำหนดเผยแพร่" | "ยกเลิกเผยแพร่" | "ลบ";
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

export type ContentBlockKind = "ข้อความ" | "รายการ" | "รูปภาพ" | "วิดีโอ" | "ปุ่ม/ลิงก์";
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
  coverImageId?: string | null;
  highlights?: string[];
  displayOrder?: number;
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
  interest: string;
  source: string;
  status: MessageStatus;
  factoryLocation: string;
  projectStage: string;
  budgetRange: string;
  desiredTimeline: string;
  preferredContact: string;
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

export type DiscoverySettings = {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  shareTitle: string;
  shareDescription: string;
  shareImage: string;
  googleVerification: string;
  allowIndexing: boolean;
};
