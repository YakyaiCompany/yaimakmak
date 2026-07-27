export type DownloadCategory = "ข้อมูลบริษัท" | "สินค้า" | "โบรชัวร์"

export interface DownloadDocument {
  id: number
  name: string
  category: DownloadCategory
  type: "PDF"
  size: string
  updated: string
  href?: string
}

/**
 * Public document metadata. Add an approved HTTPS `href` only after the file
 * is reviewed and uploaded through the CMS.
 */
export const DOWNLOADS: DownloadDocument[] = [
  { id: 1, name: "Company Profile", category: "ข้อมูลบริษัท", type: "PDF", size: "2.4 MB", updated: "มิ.ย. 2568" },
  { id: 2, name: "Product Catalog", category: "สินค้า", type: "PDF", size: "5.8 MB", updated: "มิ.ย. 2568" },
  { id: 3, name: "Gasifier Specification Sheet", category: "สินค้า", type: "PDF", size: "1.2 MB", updated: "เม.ย. 2568" },
  { id: 4, name: "Rotary Dryer Specification", category: "สินค้า", type: "PDF", size: "980 KB", updated: "เม.ย. 2568" },
  { id: 5, name: "Company Brochure", category: "โบรชัวร์", type: "PDF", size: "3.1 MB", updated: "ม.ค. 2568" },
]
