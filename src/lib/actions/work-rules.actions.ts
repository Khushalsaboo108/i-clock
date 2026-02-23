"use server"

/**
 * Work Rules Server Actions
 * Handles all working-rule API calls
 */

import { cookies } from "next/headers"
import { serverApi, API_ENDPOINTS } from "@/lib/server"

// Types
export interface WorkRule {
  working_rule_id: number
  site_id: number
  working_rule_name: string
  shift_type: string
  daily_hours: number
  weekly_hours: number
  start_time: string
  end_time: string
  break_minutes: number
  late_threshold_minutes: number
  early_leave_threshold_minutes: number
  overtime_enabled: boolean
  overtime_threshold_hours: number
  is_default: boolean
  status: string
  created_at: string
  updated_at: string
}

export interface CreateWorkRulePayload {
  site_id: string | number
  working_rule_name: string
  shift_type: string
  daily_hours: string | number
  weekly_hours: string | number
  start_time: string
  end_time: string
  break_minutes: string | number
  late_threshold_minutes: string | number
  early_leave_threshold_minutes: string | number
  overtime_enabled: boolean
  overtime_threshold_hours: string | number
  is_default: boolean
  status: string
}

export interface UpdateWorkRulePayload {
  site_id?: string | number
  working_rule_name?: string
  shift_type?: string
  daily_hours?: string | number
  weekly_hours?: string | number
  start_time?: string
  end_time?: string
  break_minutes?: string | number
  late_threshold_minutes?: string | number
  early_leave_threshold_minutes?: string | number
  overtime_enabled?: boolean
  overtime_threshold_hours?: string | number
  is_default?: boolean
  status?: string
}

export interface WorkRulesPagination {
  total: number
  page: number
  length: number
}

/**
 * Get all work rules with pagination
 */
export async function getWorkRules(
  siteId: string | number,
  page: number = 1,
  length: number = 10
): Promise<{
  success: boolean
  data?: WorkRule[] | [];
  pagination?: WorkRulesPagination
  message: string
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const response = await serverApi.post<WorkRule[]>(
      API_ENDPOINTS.WORKING_RULES.BASE,
      {
        site_id: siteId,
        page,
        length,
      },
      {
        token,
      }
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch work rules",
      }
    }

    return {
      success: response.success,
      message: response.message || "Work rules fetched successfully",
      data: (Array.isArray(response.data) ? response.data : []),
      pagination: response.meta as WorkRulesPagination | undefined,
    }
  } catch (error) {
    console.error("Error fetching work rules:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

/**
 * Get a single work rule
 */
export async function getSingleWorkRule(
  siteId: string | number,
  workingRuleId: string | number
): Promise<{
  success: boolean
  data?: WorkRule
  message?: string
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const response = await serverApi.post<WorkRule>(
      API_ENDPOINTS.WORKING_RULES.SINGLE,
      {
        site_id: siteId,
        working_rule_id: workingRuleId,
      },
      {
        token,
      }
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to fetch work rule",
      }
    }

    return {
      success: response.success,
      data: response.data,
    }
  } catch (error) {
    console.error("Error fetching single work rule:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

/**
 * Create a new work rule
 */
export async function createWorkRule(
  payload: CreateWorkRulePayload
): Promise<{
  success: boolean
  data?: WorkRule
  message?: string
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const response = await serverApi.post<WorkRule>(
      API_ENDPOINTS.WORKING_RULES.CREATE,
      payload,
      {
        token,
      }
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to create work rule",
      }
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error creating work rule:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

/**
 * Update a work rule
 */
export async function updateWorkRule(
  ruleId: string | number,
  payload: UpdateWorkRulePayload
): Promise<{
  success: boolean
  data?: WorkRule
  message?: string
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const response = await serverApi.patch<WorkRule>(
      API_ENDPOINTS.WORKING_RULES.UPDATE(ruleId.toString()),
      payload,
      {
        token,
      }
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to update work rule",
      }
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error updating work rule:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

/**
 * Delete a work rule
 */
export async function deleteWorkRule(
  ruleId: string | number
): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const response = await serverApi.delete(
      API_ENDPOINTS.WORKING_RULES.DELETE(ruleId.toString()),
      {
        token,
      }
    )

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to delete work rule",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting work rule:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
