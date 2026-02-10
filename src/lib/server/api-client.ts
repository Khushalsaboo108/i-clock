/**
 * Server-side API Client
 * This runs ONLY on the server - backend URL is never exposed to the browser
 */

import { StarHalf } from "lucide-react"
import { SERVER_CONFIG } from "./config"

export interface ServerApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
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
function buildHeaders(options?: RequestOptions): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options?.headers,
  }

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`
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
    error = {
      success: false,
      message: data.message || "An unexpected error occurred",
      code: data.code,
      errors: data.errors,
      statusCode: response.status,
    }
  } catch {
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
    try {
      const url = buildUrl(endpoint, options?.params)
      const headers = buildHeaders(options)

      const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store", // Don't cache API responses
      })

      if (!response.ok) {
        return await handleError(response)
      }

      return await response.json()
    } catch (error) {
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
    try {
      const url = buildUrl(endpoint, options?.params)
      const headers = buildHeaders(options)

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      })

      if (!response.ok) {
        return await handleError(response)
      }

      return await response.json()
    } catch (error) {
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
    try {
      const url = buildUrl(endpoint, options?.params)
      const headers = buildHeaders(options)

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      })

      if (!response.ok) {
        return await handleError(response)
      }

      return await response.json()
    } catch (error) {
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
    try {
      const url = buildUrl(endpoint, options?.params)
      const headers = buildHeaders(options)

      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      })

      if (!response.ok) {
        return await handleError(response)
      }

      return await response.json()
    } catch (error) {
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
    try {
      const url = buildUrl(endpoint, options?.params)
      const headers = buildHeaders(options)

      const response = await fetch(url, {
        method: "DELETE",
        headers,
        cache: "no-store",
      })

      if (!response.ok) {
        return await handleError(response)
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 0,
      }
    }
  },
}