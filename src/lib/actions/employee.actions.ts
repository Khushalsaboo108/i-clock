"use server"

/**
 * Employee Server Actions
 */

import { cookies } from "next/headers"
import { serverApi, API_ENDPOINTS } from "@/lib/server"
import {
  type EmployeeFormValues,
  employeeFormSchema,
} from "@/lib/validations/employee.schema"

// Types
export interface Employee {
  employee_id: number
  agrigistics_employee_id: string | null
  pin: string
  name: string
  password: string
  upgrade: number
  priv: number
  card: string
  agri_card: number
  site_id: number
  status: string
  category_id: number
  sub_category_id: number | null
  address: string | null
  phone: string
  vehicle_reg_no: string | null
  id_no: string | null
  permanent_user: string
  mobile: string
  username: string | null
  access_code_generator: string | null
  employee_code: string
  alias_employee: string
  nif_dni: string
  date_birth: string | null
  picture: string
  town: string
  postal_code: string
  area: string
  telephone_number: string
  email: string
  mobile_number: string
  work_center_id: number
  notes: string
  property_number: string | null
  access_group: number | null
  is_antipass: string
  visit_multi_times: string
  start_date: string | null
  end_date: string | null
  emp_permission: string | null
  emp_type: string
  emp_m_address: string | null
  ignore_move_copy: string
}

export interface EmployeePagination {
  total: number
  page: number
  limit: number
}

interface GetEmployeesParams {
  page?: number
  limit?: number
}

/**
 * Get employees for a specific site with pagination
 */
export async function getEmployeesAction(
  siteId: string | number,
  params: GetEmployeesParams = {}
) {
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

  const { page = 1, limit = 10 } = params

  const response = await serverApi.get<Employee[]>(
    API_ENDPOINTS.EMPLOYEE.BY_SITE(String(siteId)),
    {
      token,
      params: { page, limit },
    }
  )

  return response
}

/**
 * Create a new employee
 */
export async function createEmployeeAction(formData: EmployeeFormValues) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  // Validate and transform data
  const parseResult = employeeFormSchema.safeParse(formData)

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validation failed",
      data: null,
      errors: parseResult.error.flatten().fieldErrors,
    }
  }

  const response = await serverApi.post<Employee>(
    "/employee",
    parseResult.data,
    { token }
  )

  return response
}
