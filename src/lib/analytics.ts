import { environment } from "../config/environment"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let initialized = false

export function initializeAnalytics() {
  const measurementId = environment.gaMeasurementId
  if (!measurementId || initialized || typeof window === "undefined") return

  initialized = true
  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args) }
  window.gtag("js", new Date())
  window.gtag("config", measurementId, { send_page_view: false })

  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)
}

export function trackPageView(path: string) {
  if (!environment.gaMeasurementId || !window.gtag) return
  window.gtag("event", "page_view", { page_path: path })
}

/** Event payloads must not contain names, emails, phone numbers, or other PII. */
export function trackAnalyticsEvent(name: "generate_lead" | "click_line" | "click_phone" | "click_facebook") {
  if (!environment.gaMeasurementId || !window.gtag) return
  window.gtag("event", name)
}
