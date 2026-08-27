import { environment } from "../config/environment"

const DEFAULT_TIMEOUT_MS = 15_000

export type ApiRequestErrorCode =
  | "aborted"
  | "configuration"
  | "invalid_request"
  | "invalid_response"
  | "network"
  | "timeout"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "rate_limited"
  | "server"
  | "http"

interface ApiRequestErrorOptions {
  readonly code: ApiRequestErrorCode
  readonly status?: number
  readonly cause?: unknown
}

export class ApiRequestError extends Error {
  readonly code: ApiRequestErrorCode
  readonly status: number | undefined
  readonly cause: unknown

  constructor(message: string, options: ApiRequestErrorOptions) {
    super(message)
    this.name = "ApiRequestError"
    this.code = options.code
    this.status = options.status
    this.cause = options.cause
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export interface JsonPostOptions {
  /** Defaults to 15 seconds and includes receiving the JSON response body. */
  readonly timeoutMs?: number
  /** Cancels this request when the calling UI is no longer active. */
  readonly signal?: AbortSignal
}

export interface ContactLeadPayload {
  readonly name: string
  readonly company?: string
  readonly email?: string
  readonly phone?: string
  readonly message: string
  readonly consent: boolean
  readonly source?: string
}

interface AbortContext {
  readonly signal: AbortSignal
  readonly didTimeout: () => boolean
  readonly cleanup: () => void
}

function createAbortContext(timeoutMs: number, parentSignal?: AbortSignal): AbortContext {
  const controller = new AbortController()
  let timedOut = false
  let parentAbortHandler: (() => void) | undefined

  if (parentSignal?.aborted) {
    controller.abort()
  } else if (parentSignal) {
    parentAbortHandler = () => controller.abort()
    parentSignal.addEventListener("abort", parentAbortHandler, { once: true })
  }

  const timeoutId = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    cleanup: () => {
      clearTimeout(timeoutId)
      if (parentSignal && parentAbortHandler) {
        parentSignal.removeEventListener("abort", parentAbortHandler)
      }
    },
  }
}

function normalizeTimeout(timeoutMs: number | undefined): number {
  const value = timeoutMs ?? DEFAULT_TIMEOUT_MS

  if (!Number.isFinite(value) || value <= 0) {
    throw new ApiRequestError("เวลารอการเชื่อมต่อต้องมากกว่า 0 มิลลิวินาที", {
      code: "invalid_request",
    })
  }

  return value
}

function normalizeEndpoint(endpoint: string): string {
  let value = endpoint.trim()
  if (!value) {
    throw new ApiRequestError("ยังไม่ได้กำหนดปลายทางของบริการ", {
      code: "configuration",
    })
  }

  if (value.startsWith("/api/v1") && environment.cmsApiBaseUrl && !import.meta.env.DEV) {
    value = environment.cmsApiBaseUrl + value.substring(7)
  }

  try {
    const baseUrl = typeof window === "undefined" ? undefined : window.location.href
    const url = baseUrl ? new URL(value, baseUrl) : new URL(value)

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new ApiRequestError("ปลายทางของบริการต้องใช้ HTTP หรือ HTTPS", {
        code: "configuration",
      })
    }

    if (url.username || url.password) {
      throw new ApiRequestError("ปลายทางของบริการต้องไม่มีข้อมูลรับรองใน URL", {
        code: "configuration",
      })
    }

    if (baseUrl && new URL(baseUrl).protocol === "https:" && url.protocol !== "https:") {
      throw new ApiRequestError("หน้าเว็บ HTTPS ต้องเรียกบริการผ่าน HTTPS", {
        code: "configuration",
      })
    }

    url.hash = ""
    return url.toString()
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error
    }

    throw new ApiRequestError("ปลายทางของบริการไม่ถูกต้อง", {
      code: "configuration",
      cause: error,
    })
  }
}

function serializeJson(payload: unknown): string {
  try {
    const body = JSON.stringify(payload)
    if (typeof body !== "string") {
      throw new TypeError("Payload is not JSON serializable")
    }
    return body
  } catch (error) {
    throw new ApiRequestError("ข้อมูลที่ส่งไม่สามารถแปลงเป็น JSON ได้", {
      code: "invalid_request",
      cause: error,
    })
  }
}

function errorForStatus(status: number): ApiRequestError {
  if (status === 400 || status === 422) {
    return new ApiRequestError("ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่", {
      code: "validation",
      status,
    })
  }

  if (status === 401) {
    return new ApiRequestError("กรุณาเข้าสู่ระบบก่อนดำเนินการ", {
      code: "unauthorized",
      status,
    })
  }

  if (status === 403) {
    return new ApiRequestError("คุณไม่มีสิทธิ์ดำเนินการนี้", {
      code: "forbidden",
      status,
    })
  }

  if (status === 404) {
    return new ApiRequestError("ไม่พบข้อมูลหรือบริการที่ร้องขอ", {
      code: "not_found",
      status,
    })
  }

  if (status === 429) {
    return new ApiRequestError("มีการส่งคำขอมากเกินไป กรุณาลองใหม่ภายหลัง", {
      code: "rate_limited",
      status,
    })
  }

  if (status >= 500) {
    return new ApiRequestError("ระบบขัดข้องชั่วคราว กรุณาลองใหม่ภายหลัง", {
      code: "server",
      status,
    })
  }

  return new ApiRequestError("ไม่สามารถดำเนินการตามคำขอได้", {
    code: "http",
    status,
  })
}

function parseJsonResponse<TResponse>(body: string): TResponse {
  if (!body.trim()) {
    throw new ApiRequestError("บริการส่งข้อมูลตอบกลับไม่ครบถ้วน", {
      code: "invalid_response",
    })
  }

  try {
    return JSON.parse(body) as TResponse
  } catch (error) {
    throw new ApiRequestError("บริการส่งข้อมูลตอบกลับในรูปแบบไม่ถูกต้อง", {
      code: "invalid_response",
      cause: error,
    })
  }
}

/**
 * Sends JSON without exposing cross-origin cookies. The backend must return a
 * JSON body for both successful and unsuccessful requests.
 */
export async function postJson<TResponse, TPayload>(
  endpoint: string,
  payload: TPayload,
  options: JsonPostOptions = {},
): Promise<TResponse> {
  const requestUrl = normalizeEndpoint(endpoint)
  const body = serializeJson(payload)
  const abortContext = createAbortContext(normalizeTimeout(options.timeoutMs), options.signal)

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
      signal: abortContext.signal,
    })

    const responseBody = await response.text()
    if (!response.ok) {
      throw errorForStatus(response.status)
    }

    return parseJsonResponse<TResponse>(responseBody)
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error
    }

    if (abortContext.didTimeout()) {
      throw new ApiRequestError("การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่", {
        code: "timeout",
        cause: error,
      })
    }

    if (abortContext.signal.aborted) {
      throw new ApiRequestError("ยกเลิกการส่งคำขอแล้ว", {
        code: "aborted",
        cause: error,
      })
    }

    throw new ApiRequestError("ไม่สามารถเชื่อมต่อกับบริการได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", {
      code: "network",
      cause: error,
    })
  } finally {
    abortContext.cleanup()
  }
}

/** Uploads multipart form data while retaining the same timeout and error semantics as JSON requests. */
export async function postFormData<TResponse>(
  endpoint: string,
  formData: FormData,
  options: JsonPostOptions = {},
): Promise<TResponse> {
  const requestUrl = normalizeEndpoint(endpoint)
  const abortContext = createAbortContext(normalizeTimeout(options.timeoutMs), options.signal)

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      body: formData,
      signal: abortContext.signal,
    })
    const responseBody = await response.text()
    if (!response.ok) throw errorForStatus(response.status)
    return parseJsonResponse<TResponse>(responseBody)
  } catch (error) {
    if (error instanceof ApiRequestError) throw error
    if (abortContext.didTimeout()) {
      throw new ApiRequestError("การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่", { code: "timeout", cause: error })
    }
    if (abortContext.signal.aborted) {
      throw new ApiRequestError("ยกเลิกการส่งคำขอแล้ว", { code: "aborted", cause: error })
    }
    throw new ApiRequestError("ไม่สามารถเชื่อมต่อกับบริการได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", { code: "network", cause: error })
  } finally {
    abortContext.cleanup()
  }
}

export async function getJson<TResponse>(
  endpoint: string,
  options: JsonPostOptions = {},
): Promise<TResponse> {
  const requestUrl = normalizeEndpoint(endpoint)
  const abortContext = createAbortContext(normalizeTimeout(options.timeoutMs), options.signal)

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      signal: abortContext.signal,
    })
    const responseBody = await response.text()
    if (!response.ok) throw errorForStatus(response.status)

    return parseJsonResponse<TResponse>(responseBody)
  } catch (error) {
    if (error instanceof ApiRequestError) throw error
    if (abortContext.didTimeout()) {
      throw new ApiRequestError("การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่", {
        code: "timeout",
        cause: error,
      })
    }
    if (abortContext.signal.aborted) {
      throw new ApiRequestError("ยกเลิกการส่งคำขอแล้ว", {
        code: "aborted",
        cause: error,
      })
    }
    throw new ApiRequestError("ไม่สามารถเชื่อมต่อกับบริการได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", {
      code: "network",
      cause: error,
    })
  } finally {
    abortContext.cleanup()
  }
}

export async function putJson<TResponse, TPayload>(
  endpoint: string,
  payload: TPayload,
  options: JsonPostOptions = {},
): Promise<TResponse> {
  const requestUrl = normalizeEndpoint(endpoint)
  const body = serializeJson(payload)
  const abortContext = createAbortContext(normalizeTimeout(options.timeoutMs), options.signal)

  try {
    const response = await fetch(requestUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
      signal: abortContext.signal,
    })

    const responseBody = await response.text()
    if (!response.ok) {
      throw errorForStatus(response.status)
    }

    return parseJsonResponse<TResponse>(responseBody)
  } catch (error) {
    if (error instanceof ApiRequestError) throw error
    if (abortContext.didTimeout()) {
      throw new ApiRequestError("การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่", { code: "timeout", cause: error })
    }
    if (abortContext.signal.aborted) {
      throw new ApiRequestError("ยกเลิกการส่งคำขอแล้ว", { code: "aborted", cause: error })
    }
    throw new ApiRequestError("ไม่สามารถเชื่อมต่อกับบริการได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", { code: "network", cause: error })
  } finally {
    abortContext.cleanup()
  }
}

export async function patchJson<TResponse, TPayload>(
  endpoint: string,
  payload: TPayload,
  options: JsonPostOptions = {},
): Promise<TResponse> {
  const requestUrl = normalizeEndpoint(endpoint)
  const body = serializeJson(payload)
  const abortContext = createAbortContext(normalizeTimeout(options.timeoutMs), options.signal)

  try {
    const response = await fetch(requestUrl, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
      signal: abortContext.signal,
    })

    const responseBody = await response.text()
    if (!response.ok) {
      throw errorForStatus(response.status)
    }

    return parseJsonResponse<TResponse>(responseBody)
  } catch (error) {
    if (error instanceof ApiRequestError) throw error
    if (abortContext.didTimeout()) {
      throw new ApiRequestError("การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่", { code: "timeout", cause: error })
    }
    if (abortContext.signal.aborted) {
      throw new ApiRequestError("ยกเลิกการส่งคำขอแล้ว", { code: "aborted", cause: error })
    }
    throw new ApiRequestError("ไม่สามารถเชื่อมต่อกับบริการได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", { code: "network", cause: error })
  } finally {
    abortContext.cleanup()
  }
}

export async function deleteJson<TResponse>(
  endpoint: string,
  options: JsonPostOptions = {},
): Promise<TResponse> {
  const requestUrl = normalizeEndpoint(endpoint)
  const abortContext = createAbortContext(normalizeTimeout(options.timeoutMs), options.signal)

  try {
    const response = await fetch(requestUrl, {
      method: "DELETE",
      credentials: "include",
      headers: { Accept: "application/json" },
      signal: abortContext.signal,
    })
    const responseBody = await response.text()
    if (!response.ok) throw errorForStatus(response.status)

    return parseJsonResponse<TResponse>(responseBody)
  } catch (error) {
    if (error instanceof ApiRequestError) throw error
    if (abortContext.didTimeout()) {
      throw new ApiRequestError("การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่", { code: "timeout", cause: error })
    }
    if (abortContext.signal.aborted) {
      throw new ApiRequestError("ยกเลิกการส่งคำขอแล้ว", { code: "aborted", cause: error })
    }
    throw new ApiRequestError("ไม่สามารถเชื่อมต่อกับบริการได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", { code: "network", cause: error })
  } finally {
    abortContext.cleanup()
  }
}

export function submitContactLead<TResponse>(
  payload: ContactLeadPayload,
  options?: JsonPostOptions,
): Promise<TResponse> {
  if (!environment.contactEndpoint) {
    throw new ApiRequestError("ยังไม่ได้กำหนด VITE_CONTACT_ENDPOINT", {
      code: "configuration",
    })
  }

  return postJson<TResponse, ContactLeadPayload>(environment.contactEndpoint, payload, options)
}

