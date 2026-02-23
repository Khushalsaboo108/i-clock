"use server"

/**
 * Holiday Server Actions
 * Manages individual holidays within calendars
 */

import { cookies } from "next/headers"
import { serverApi, API_ENDPOINTS } from "@/lib/server"

// Types
export interface HolidayApiItem {
  id?: number
  holiday_id?: number
  calendar_id: number
  name: string
  holiday_date: string
  is_optional: boolean | string
  descripti: string
  created_at?: string
  updated_at?: string
}

export interface HolidayPagination {
  total: number
  page: number
  limit: number
}

/**
 * Create a holiday in a calendar
 */
export async function createHolidayAction(
  calendarId: number,
  name: string,
  holidayDate: string,
  isOptional: boolean,
  description: string
) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.post<HolidayApiItem>(
    API_ENDPOINTS.HOLIDAY.CREATE,
    {
      calendar_id: calendarId,
      name: name.trim(),
      holiday_date: holidayDate,
      is_optional: isOptional,
      descripti: description.trim(),
    },
    { token }
  )

  return response
}

/**
 * Get all holidays in a calendar (paginated)
 */
export async function getHolidaysAction(calendarId: number, page = 1, limit = 10) {
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

  const response = await serverApi.post<HolidayApiItem[]>(
    API_ENDPOINTS.HOLIDAY.GET,
    { calendar_id: calendarId, page, limit },
    { token }
  )

  return response
}

/**
 * Get a single holiday detail
 */
export async function getSingleHolidayAction(calendarId: number, page = 1, limit = 10) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.post<HolidayApiItem>(
    API_ENDPOINTS.HOLIDAY.SINGLE,
    { calendar_id: calendarId, page, limit },
    { token }
  )

  return response
}

/**
 * Delete a holiday by ID
 */
export async function deleteHolidayAction(holidayId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.delete(
    API_ENDPOINTS.HOLIDAY.DELETE(holidayId),
    { token }
  )

  return response
}
