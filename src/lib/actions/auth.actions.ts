"use server"

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


export async function getProfileAction() {

  const response = await serverApi.get<AdminProfile>(API_ENDPOINTS.PROFILE.ME, )

  console.log("PROFILE RESPONSE:", response);

  return response
}

// export async function loginAction(username: string, password: string) {
//   const response = await serverApi.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
//     name: username,
//     password,
//   })
  
//   console.log("LOGIN RESPONSE:", response);

// if (!response.success) {
//   return {
//     success: false,
//     message: response.message || "Login failed",
//   };
// }

// return {
//   success: true,
//   message: "Login successful",
//   data: response.data,
// };
// }

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

