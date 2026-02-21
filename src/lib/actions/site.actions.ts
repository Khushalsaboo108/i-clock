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
  auto_remove_emp: boolean
  site_password: string | null
  agrigistics_site: boolean
  pull_employees: boolean
  send_attendance: boolean
  easyroster: boolean
  easyroster_token: string | null
  eduman: boolean
  send_agrigistics_gps: boolean
  employee_count: number
  department_count: number
  // Extended fields from /site/{id} detail response
  id?: number
  license_validity?: string
  data_format?: string
  data_format_other?: string
  license_key?: string
  server_ip?: string
  server_port?: number
  swver?: string
  status?: string
  access_user?: boolean
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
  site_name?: string
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

  const { page = 1, limit = 6, site_name } = params

  const response = await serverApi.post<Site[]>(API_ENDPOINTS.SITES.BASE, { page, limit, site_name }, {
    token,
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

  const response = await serverApi.post<Site>(API_ENDPOINTS.SITES.BY_ID(String(id)), { site_id: id }, {
    token,
  })

  return response
}

/**
 * Create a new site/company
 * Uses native booleans for toggle fields
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

  // Use the shared schema for validation
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
    API_ENDPOINTS.SITES.CREATE,
    parseResult.data,
    { token }
  )

  return response
}

/**
 * Update an existing site/company
 */
export async function updateSiteAction(id: string | number, formData: SiteFormValues) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  // Use the shared schema for validation
  const parseResult = createSitePayloadSchema.safeParse(formData)

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validation failed",
      data: null,
      errors: parseResult.error.flatten().fieldErrors,
    }
  }

  const response = await serverApi.patch<Site>(
    API_ENDPOINTS.SITES.UPDATE(String(id)),
    { ...parseResult.data, site_id: id },
    { token }
  )

  return response
}

/**
 * Delete an existing site/company
 */
export async function deleteSiteAction(id: string | number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.delete<null>(
    API_ENDPOINTS.SITES.DELETE(String(id)),
    { token }
  )

  return response
}
