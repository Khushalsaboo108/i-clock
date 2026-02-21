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
  pin: number
  name: string
  password: number | string
  upgrade: number
  priv: number
  card: number
  agri_card: number
  site_id: number
  status: string
  category_id: number
  sub_category_id: number | null
  address: string | null
  phone: number | string
  vehicle_reg_no: string | null
  id_no: string | null
  permanent_user: boolean | string
  mobile: boolean | string
  username: string | null
  access_code_generator: string | null
  employee_code: string
  alias_employee: string
  nif_dni: string
  date_birth: string | null
  picture: string
  town: string
  postal_code: number | string
  area: string
  telephone_number: string
  email: string
  mobile_number: number | string
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
  details?: any
  leave_balance?: any
  salary?: any
  departments?: any[]
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

  const response = await serverApi.post<Employee[]>(
    API_ENDPOINTS.EMPLOYEE.BASE,
    { site_id: siteId, page, limit },
    { token }
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

  const { first_name, last_name, ...rest } = parseResult.data
  const payload = {
    site_id: rest.site_id,
    name: `${first_name} ${last_name}`.trim().toUpperCase(),
    pin: rest.pin,
    card: rest.card,
    username: (rest.username || `${first_name}_${last_name}`).toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9._-]/g, ""),
    password: rest.password,
    employee_code: rest.employee_code,
    email: rest.email,
    phone: rest.phone,
    mobile_number: rest.mobile_number,
    status: rest.status,
    permanent_user: rest.permanent_user,
    mobile: rest.mobile,
    access_code_generator: rest.access_code_generator,
    public_holiday_calendar_id: rest.public_holiday_calendar_id,
    work_rules_id: rest.work_rules_id,
    details: {
      gender: rest.personal_details.gender,
      marital_status: rest.personal_details.marital_status,
      personal_details: {
        ...rest.personal_details,
        gender: undefined,
        marital_status: undefined,
      }
    },
    leave_balance: rest.leave_balance,
    salary: rest.salary,
    departments: rest.departments,
  }

  const response = await serverApi.post<Employee>(
    API_ENDPOINTS.EMPLOYEE.CREATE,
    payload,
    { token }
  )

  return response
}

/**
 * Get a specific employee by ID
 */
export async function getEmployeeByIdAction(employeeId: string | number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    }
  }

  const response = await serverApi.post<Employee>(
    API_ENDPOINTS.EMPLOYEE.BY_ID,
    { employee_id: employeeId },
    { token }
  )

  console.log(`[getEmployeeByIdAction] Fetching employee ${employeeId}:`, response)

  return response
}

/**
 * Update an existing employee
 */
export async function updateEmployeeAction(employeeId: string | number, formData: EmployeeFormValues) {
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

  const { first_name, last_name, ...rest } = parseResult.data
  const payload = {
    site_id: rest.site_id,
    employee_id: typeof employeeId === 'string' ? parseInt(employeeId, 10) : employeeId,
    name: `${first_name} ${last_name}`.trim().toUpperCase(),
    pin: rest.pin,
    card: rest.card,
    username: (rest.username || `${first_name}_${last_name}`).toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9._-]/g, ""),
    password: rest.password,
    employee_code: rest.employee_code,
    email: rest.email,
    phone: rest.phone,
    mobile_number: rest.mobile_number,
    status: rest.status,
    permanent_user: rest.permanent_user,
    mobile: rest.mobile,
    access_code_generator: rest.access_code_generator,
    public_holiday_calendar_id: rest.public_holiday_calendar_id,
    work_rules_id: rest.work_rules_id,
    details: {
      gender: rest.personal_details.gender,
      marital_status: rest.personal_details.marital_status,
      personal_details: {
        ...rest.personal_details,
        gender: undefined,            // Remove from inner object
        marital_status: undefined, // Remove from inner object
      }
    },
    leave_balance: rest.leave_balance,
    salary: rest.salary,
    departments: rest.departments,
  }

  console.log(">> [updateEmployeeAction] Sending payload:", payload)

  const response = await serverApi.patch<Employee>(
    API_ENDPOINTS.EMPLOYEE.UPDATE(String(employeeId)),
    payload,
    { token }
  )

  console.log("<< [updateEmployeeAction] Response:", response)

  return response
}

/**
 * Delete an existing employee
 */
export async function deleteEmployeeAction(employeeId: string | number) {
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
    API_ENDPOINTS.EMPLOYEE.DELETE(String(employeeId)),
    { token }
  )

  return response
}
