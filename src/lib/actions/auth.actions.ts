"use server"

/**
 * Auth Server Actions
 * All authentication-related server actions
 * These run on the server - backend URL is NEVER exposed to browser
 */

import { cookies } from "next/headers"
import { serverApi, API_ENDPOINTS } from "@/lib/server"
import type { LoginResponse, User } from "@/lib/api/types"

// Profile Types
export type UserType = "Super Admin" | "Admin" | "Manager" | "User"

export interface AdminProfile {
  name: string
  user_type: UserType
  status: string
  horizontal_bulk_employee: string
  vertical_bulk_reader: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: AdminProfile
}

// Cookie configuration
const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

/**
 * Login action
 * Authenticates user and stores tokens in HTTP-only cookies
 */
export async function loginAction(username: string, password: string) {
  const response = await serverApi.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    name: username,
    password,
  })

  if (response.success && response.data) {
    const cookieStore = await cookies()

    // Store tokens in HTTP-only cookies (more secure than localStorage)
    // API returns snake_case: access_token, refresh_token
    cookieStore.set("access_token", response.data.access_token, TOKEN_COOKIE_OPTIONS)
    cookieStore.set("refresh_token", response.data.refresh_token, {
      ...TOKEN_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 30, // 30 days for refresh token
    })

    // Return user data (without tokens - they're in cookies now)
    // PLUS: Automatically fetch profile to set user_type/name cookies
    try {
      const profileResponse = await serverApi.get<AdminProfile>(API_ENDPOINTS.PROFILE.ME, {
        token: response.data.access_token,
      })

      if (profileResponse.success && profileResponse.data) {
        cookieStore.set("user_type", profileResponse.data.user_type, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })

        cookieStore.set("user_name", profileResponse.data.name, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
      }
    } catch (profileErr) {
    }

    return {
      success: true,
      data: {
        user: response.data.user,
      },
      message: response.message,
    }
  }

  // Return error
  return {
    success: false,
    message: response.message || "Login failed",
  }
}

/**
 * Logout action
 * Clears auth cookies
 */
export async function logoutAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  // Call logout endpoint if we have a token
  if (token) {
    await serverApi.post(API_ENDPOINTS.AUTH.LOGOUT, undefined, { token })
  }

  // Clear cookies
  cookieStore.delete("access_token")
  cookieStore.delete("refresh_token")

  return { success: true }
}

/**
 * Get current user action
 * Fetches the authenticated user's data
 */
export async function getCurrentUserAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
    }
  }

  const response = await serverApi.get<User>(API_ENDPOINTS.AUTH.ME, { token })

  return response
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticatedAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  return { authenticated: !!token }
}

/**
 * Forgot password action
 */
export async function forgotPasswordAction(email: string) {
  const response = await serverApi.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    email,
  })

  return response
}

/**
 * Reset password action
 */
export async function resetPasswordAction(
  token: string,
  password: string,
  confirmPassword: string
) {
  const response = await serverApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    token,
    password,
    confirmPassword,
  })

  return response
}

/**
 * Get admin profile
 * Fetches the authenticated admin's profile data
 */
export async function getProfileAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.get<AdminProfile>(API_ENDPOINTS.PROFILE.ME, {
    token,
  })

  // Store user type in a cookie for middleware/client access
  if (response.success && response.data) {
    cookieStore.set("user_type", response.data.user_type, {
      httpOnly: false, // Allow client-side access for menu rendering
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set("user_name", response.data.name, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  return response
}
