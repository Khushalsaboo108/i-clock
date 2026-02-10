/**
 * API Client
 * Production-grade HTTP client with interceptors, retry logic, and error handling
 */

import { API_CONFIG } from "./config"
import type { ApiError, ApiResponse, RequestOptions } from "./types"

class ApiClient {
  private baseUrl: string
  private defaultTimeout: number

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.defaultTimeout = API_CONFIG.TIMEOUT
  }

  /**
   * Get the access token from storage
   */
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
  }

  /**
   * Get the refresh token from storage
   */
  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN)
  }

  /**
   * Set tokens in storage
   */
  public setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  }

  /**
   * Clear tokens from storage
   */
  public clearTokens(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER)
  }

  /**
   * Set user in storage
   */
  public setUser(user: unknown): void {
    if (typeof window === "undefined") return
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user))
  }

  /**
   * Get user from storage
   */
  public getUser<T>(): T | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  }

  /**
   * Build request headers
   */
  private buildHeaders(options?: RequestOptions): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    }

    if (!options?.skipAuth) {
      const token = this.getAccessToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: RequestOptions["params"]): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    
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
   * Handle API errors
   */
  private async handleError(response: Response): Promise<never> {
    let error: ApiError

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

    // Handle specific status codes
    if (response.status === 401) {
      // Token expired or invalid - attempt refresh or logout
      await this.handleUnauthorized()
    }

    throw error
  }

  /**
   * Handle 401 Unauthorized - attempt token refresh
   */
  private async handleUnauthorized(): Promise<void> {
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      this.clearTokens()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      return
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        this.setTokens(data.data.accessToken, data.data.refreshToken)
      } else {
        this.clearTokens()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }
    } catch {
      this.clearTokens()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<Response>,
    retries: number = API_CONFIG.RETRY.MAX_ATTEMPTS
  ): Promise<ApiResponse<T>> {
    let lastError: ApiError | null = null
    let delay = API_CONFIG.RETRY.DELAY_MS

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await requestFn()

        if (!response.ok) {
          await this.handleError(response)
        }

        const data = await response.json()
        return data as ApiResponse<T>
      } catch (error) {
        lastError = error as ApiError

        // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
        if (
          lastError.statusCode >= 400 &&
          lastError.statusCode < 500 &&
          lastError.statusCode !== 408 &&
          lastError.statusCode !== 429
        ) {
          throw lastError
        }

        // Wait before retrying
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay))
          delay *= API_CONFIG.RETRY.BACKOFF_MULTIPLIER
        }
      }
    }

    throw lastError
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = this.buildHeaders(options)
    const timeout = options?.timeout || this.defaultTimeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      return await this.executeWithRetry<T>(
        () =>
          fetch(url, {
            method: "GET",
            headers,
            signal: controller.signal,
          }),
        options?.retries
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = this.buildHeaders(options)
    const timeout = options?.timeout || this.defaultTimeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      return await this.executeWithRetry<T>(
        () =>
          fetch(url, {
            method: "POST",
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          }),
        options?.retries
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = this.buildHeaders(options)
    const timeout = options?.timeout || this.defaultTimeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      return await this.executeWithRetry<T>(
        () =>
          fetch(url, {
            method: "PUT",
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          }),
        options?.retries
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = this.buildHeaders(options)
    const timeout = options?.timeout || this.defaultTimeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      return await this.executeWithRetry<T>(
        () =>
          fetch(url, {
            method: "PATCH",
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          }),
        options?.retries
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = this.buildHeaders(options)
    const timeout = options?.timeout || this.defaultTimeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      return await this.executeWithRetry<T>(
        () =>
          fetch(url, {
            method: "DELETE",
            headers,
            signal: controller.signal,
          }),
        options?.retries
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
