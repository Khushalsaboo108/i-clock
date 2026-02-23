/**
 * Server-side API Client
 * This runs ONLY on the server - backend URL is never exposed to the browser
 */

import { SERVER_CONFIG } from "./config"
import { cookies } from "next/headers"

export interface ServerApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  refreshToken?: string | null
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface ServerApiError {
  success: false
  message: string
  code?: string
  errors?: Record<string, string[]>
  statusCode: number
}

interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
  token?: string // For authenticated requests
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: RequestOptions["params"]): string {
  const url = new URL(`${SERVER_CONFIG.API_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Build request headers
 */
async function buildHeaders(options?: RequestOptions): Promise<HeadersInit> {
  const cookieStore = await cookies()

  // Get token from cookie (change name if needed)
  const tokenFromCookie = cookieStore.get("access_token")?.value

  const token = options?.token || tokenFromCookie

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options?.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}


/**
 * Handle API errors
 */
async function handleError(response: Response): Promise<ServerApiError> {
  let error: ServerApiError

  try {
    const data = await response.json()
    console.log("<< [API ERROR]", response.status, data)
    error = {
      success: false,
      message: data.message || "An unexpected error occurred",
      code: data.code,
      errors: data.errors,
      statusCode: response.status,
    }
  } catch {
    console.log("<< [API ERROR]", response.status, response.statusText)
    error = {
      success: false,
      message: response.statusText || "An unexpected error occurred",
      statusCode: response.status,
    }
  }

  return error
}

/**
 * Server-side API client
 * All methods run on the server only
 */
export const serverApi = {
  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ServerApiResponse<T> | ServerApiError> {
    const url = buildUrl(endpoint, options?.params)
    console.log(">> [API REQ] GET", url)
    try {
      const headers = await buildHeaders(options)

      const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store", // Don't cache API responses
      })

      if (!response.ok) {
        return await handleError(response)
      }

      const data = await response.json()
      console.log("<< [API RES] GET", url, data)
      return data
    } catch (error) {
      console.log("!! [API ERROR] GET", url, error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 0,
      }
    }
  },

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ServerApiResponse<T> | ServerApiError> {
    const url = buildUrl(endpoint, options?.params)
    console.log(">> [API REQ] POST", url, body)
    try {
      const headers = await buildHeaders(options)

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      })

      if (!response.ok) {
        return await handleError(response)
      }

      const data = await response.json()
      console.log("<< [API RES] POST", url, data)
      const setCookie = response.headers.get("set-cookie")

      let refreshToken: string | null = null

      if (setCookie) {
        const match = setCookie.match(/refresh_token=([^;]+)/)
        if (match) {
          refreshToken = match[1]
        }
      }

      return {
        ...data,
        refreshToken,
      }
    } catch (error) {
      console.log("!! [API ERROR] POST", url, error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 0,
      }
    }
  },

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ServerApiResponse<T> | ServerApiError> {
    const url = buildUrl(endpoint, options?.params)
    console.log(">> [API REQ] PUT", url, body)
    try {
      const headers = await buildHeaders(options)

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      })

      if (!response.ok) {
        return await handleError(response)
      }

      const data = await response.json()
      console.log("<< [API RES] PUT", url, data)
      return data
    } catch (error) {
      console.log("!! [API ERROR] PUT", url, error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 0,
      }
    }
  },

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ServerApiResponse<T> | ServerApiError> {
    const url = buildUrl(endpoint, options?.params)
    console.log(">> [API REQ] PATCH", url, body)
    try {
      const headers = await buildHeaders(options)

      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      })

      if (!response.ok) {
        return await handleError(response)
      }

      const data = await response.json()
      console.log("<< [API RES] PATCH", url, data)
      return data
    } catch (error) {
      console.log("!! [API ERROR] PATCH", url, error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 0,
      }
    }
  },

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ServerApiResponse<T> | ServerApiError> {
    const url = buildUrl(endpoint, options?.params)
    console.log(">> [API REQ] DELETE", url)
    try {
      const headers = await buildHeaders(options)

      const response = await fetch(url, {
        method: "DELETE",
        headers,
        body: JSON.stringify({}),
        cache: "no-store",
      })

      if (!response.ok) {
        return await handleError(response)
      }

      const data = await response.json()
      console.log("<< [API RES] DELETE", url, data)
      return data
    } catch (error) {
      console.log("!! [API ERROR] DELETE", url, error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 0,
      }
    }
  },
}