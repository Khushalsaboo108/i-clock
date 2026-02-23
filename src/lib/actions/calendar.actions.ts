"use server"

/**
 * Calendar Server Actions
 * Manages public holiday calendars
 */

import { cookies } from "next/headers"
import { serverApi, API_ENDPOINTS } from "@/lib/server"

// Types
export interface CalendarApiItem {
  id: number
  site_id: number
  name: string
  code?: string | null
  timezone?: string
  created_at?: string
  updated_at?: string
}

export interface CalendarPagination {
  total: number
  page: number
  limit: number
}

/**
 * Create a new public holiday calendar
 */
export async function createCalendarAction(siteId: number, name: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  if (!name.trim()) {
    return {
      success: false,
      message: "Calendar name is required",
      data: null,
    }
  }

  const response = await serverApi.post<CalendarApiItem>(
    API_ENDPOINTS.CALENDAR.CREATE,
    { site_id: siteId, name: name.trim() },
    { token }
  )

  return response
}

/**
 * Get all calendars for a site (paginated)
 */
export async function getCalendarsAction(siteId: number, page = 1, limit = 10) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
      pagination: null,
    }
  }

  const response = await serverApi.post<CalendarApiItem[]>(
    API_ENDPOINTS.CALENDAR.GET,
    { site_id: siteId, page, limit },
    { token }
  )

  return response
}

/**
 * Get a single calendar by ID
 */
export async function getSingleCalendarAction(siteId: number, calendarId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.post<CalendarApiItem>(
    API_ENDPOINTS.CALENDAR.SINGLE,
    { site_id: siteId, calendar_id: calendarId },
    { token }
  )

  return response
}
