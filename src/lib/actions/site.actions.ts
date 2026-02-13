"use server"

/**
 * Site Server Actions
 * Fetches sites/companies for Super Admin users
 */

import { cookies } from "next/headers"
import { serverApi, API_ENDPOINTS } from "@/lib/server"
import {
  type SiteFormValues,
  type CreateSitePayload,
  createSitePayloadSchema,
} from "@/lib/validations/site.schema"

// Types
export interface Site {
  site_id: number
  site_code: string
  name: string
  contact: string
  notes: string
  auto_remove_emp: string
  site_password: string | null
  agrigistics_site: string
  pull_employees: string
  send_attendance: string
  easyroster: string
  easyroster_token: string | null
  eduman: string
  send_agrigistics_gps: string
  employee_count: number
  department_count: number
}

export interface SitesPagination {
  total: number
  page: number
  limit: number
}

export interface SitesApiResponse {
  success: boolean
  message: string
  data: Site[]
  pagination: SitesPagination
}

interface GetSitesParams {
  page?: number
  limit?: number
}

/**
 * Get sites with pagination
 * Fetches sites/companies from the backend API
 */
export async function getSitesAction(params: GetSitesParams = {}) {
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

  const { page = 1, limit = 6 } = params

  const response = await serverApi.get<Site[]>(API_ENDPOINTS.SITES.BASE, {
    token,
    params: { page, limit },
  })

  return response
}

/**
 * Get a single site by ID
 */
export async function getSiteByIdAction(id: string | number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.get<Site>(API_ENDPOINTS.SITES.BY_ID(String(id)), {
    token,
  })

  return response
}

/**
 * Create a new site/company
 * Transforms form values (booleans) to API format ("Yes"/"No")
 */
export async function createSiteAction(formData: SiteFormValues) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  // Transform form booleans → "Yes"/"No" via the shared schema
  const parseResult = createSitePayloadSchema.safeParse(formData)

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validation failed",
      data: null,
      errors: parseResult.error.flatten().fieldErrors,
    }
  }

  const response = await serverApi.post<Site>(
    API_ENDPOINTS.SITES.BASE,
    parseResult.data,
    { token }
  )

  return response
}
