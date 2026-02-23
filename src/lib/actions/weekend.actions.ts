"use server"

/**
 * Weekend Server Actions
 * Manages weekend days for public holiday calendars
 */

import { cookies } from "next/headers"
import { serverApi, API_ENDPOINTS } from "@/lib/server"

// Types
export interface WeekendData {
  calendar_id: number
  days: number[] // 0=Sunday, 1=Monday, ..., 6=Saturday
}

/**
 * Create or update weekends for a calendar
 */
export async function createWeekendAction(siteId: number, calendarId: number, days: number[]) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.post<WeekendData>(
    API_ENDPOINTS.WEEKEND.CREATE,
    { site_id: siteId, calendar_id: calendarId, days },
    { token }
  )

  return response
}

/**
 * Get weekends for a calendar
 */
export async function getWeekendsAction(calendarId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.post<number[]>(
    API_ENDPOINTS.WEEKEND.GET,
    { calendar_id: calendarId },
    { token }
  )

  return response
}
