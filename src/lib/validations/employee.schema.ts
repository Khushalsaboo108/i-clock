import { z } from "zod"

/**
 * Employee Form Validation Schema
 * Expanded to include all fields for Required, Personal, Documents, and Disciplinary tabs.
 */

export const employeeFormSchema = z.object({
  site_id: z.coerce.number().int().min(1, "Site ID is required"),
  employee_id: z.string().min(1, "Employee Number is required").max(50),
  first_name: z.string().min(1, "First Name is required").max(100),
  last_name: z.string().min(1, "Last Name is required").max(100),
  username: z.string().optional(), // Added for concatenation
  pin: z.string().min(1, "PIN is required").max(50),
  card_number: z.string().max(50).optional().default(""),
  employment_date: z.string().min(1, "Employment date is required"),
  public_holiday_calendar_id: z.string().min(1, "Holiday calendar is required").default("standard"),
  work_rules_id: z.string().min(1, "Work Rules choice is required").default("standard"),

  filters: z.array(z.object({
    group: z.string(),
    value: z.string()
  })).optional().default([]),

  clocking_config: z.object({
    method: z.enum(["default", "override"]).default("default"),
    override_type: z.enum(["smart", "manual", "biometric"]).optional().default("smart"),
    directional_clocking: z.boolean().default(true),
    saved_as_received: z.boolean().default(false),
    smart_detection: z.object({
      first_clock_is_in: z.boolean().default(true),
      alternating_mode: z.boolean().default(true),
      new_shift_threshold: z.object({
        hours: z.coerce.number().min(0).max(23).default(4),
        minutes: z.coerce.number().min(0).max(59).default(0),
      })
    })
  }),

  personal_details: z.object({
    photo_url: z.string().optional().default(""),
    photo_size_kb: z.number().max(50, "Photo must not exceed 50kb").optional(),
    dob: z.string().optional(),
    sex: z.enum(["M", "F", "Other"]).default("Other"),
    marital_status: z.string().optional().default(""),
    id_number: z.string().max(50).optional().default(""),
    contact_number: z.string().max(20).optional().default(""),
    address: z.object({
      street: z.string().max(255).optional().default(""),
      suburb: z.string().max(100).optional().default(""),
      city: z.string().max(100).optional().default(""),
      postal_code: z.string().max(20).optional().default(""),
    }),
    emergency_contact: z.object({
      person: z.string().max(100).optional().default(""),
      relationship: z.string().max(50).optional().default(""),
      number: z.string().max(20).optional().default(""),
    }),
    banking: z.object({
      bank_name: z.string().max(100).optional().default(""),
      account_type: z.string().max(50).optional().default(""),
      account_number: z.string().max(50).optional().default(""),
      routing_code: z.string().max(50).optional().default(""),
    }),
    notes: z.string().max(5000).optional().default(""),
    birthday_notifications: z.boolean().default(true),
  }),

  compliance_documents: z.object({
    medical: z.array(z.object({
      check_date: z.string(),
      expiry_date: z.string(),
      limitations: z.string().optional().default(""),
      notify_user: z.boolean().default(true),
    })).optional().default([]),
    drivers_license: z.object({
      code: z.string().optional().default(""),
      number: z.string().optional().default(""),
      type: z.string().optional().default(""),
      issued_date: z.string().optional(),
      expiry_date: z.string().optional(),
      notify_user: z.boolean().default(true),
    }).nullable().optional().default(null),
    certificates: z.array(z.object({
      name: z.string(),
      number: z.string(),
      issued_date: z.string(),
      re_issue_date: z.string(),
      description: z.string().optional().default(""),
      notify_user: z.boolean().default(true),
    })).optional().default([]),
  }),

  disciplinary_records: z.array(z.object({
    offense_type: z.string(),
    notes: z.string(),
    effective_until: z.string(),
    times_reported: z.coerce.number().min(0).default(0),
    status: z.enum(["Active", "Resolved"]).default("Active"),
  })).optional().default([]),

  // System/Other legacy fields (keeping for compatibility but might wrap later)
  reader_pin: z.string().max(50).optional().default(""),
  category_id: z.coerce.number().int().min(0).default(0),
  sbu_category_id: z.coerce.number().int().min(0).default(0),
  property_number: z.string().max(50).optional().default(""),
  vehicle_reg_no: z.string().max(20).optional().default(""),
  permanent_user: z.boolean().default(true),
  mobile: z.boolean().default(true),
  password: z.string().max(50).optional().default(""),
  access_code_generator: z.enum(["Enable", "Disable"]).default("Disable"),
  access_group: z.coerce.number().int().min(0).optional().default(0),
  ignore_move_copy: z.boolean().default(false),
  priv: z.boolean().default(false),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  alias_employee: z.string().max(50).optional().default(""),
  nif_dni: z.string().max(50).optional().default(""),
  work_center_id: z.coerce.number().int().min(0).default(0),
}).transform((data) => ({
  ...data,
  name: `${data.first_name} ${data.last_name}`.trim().toUpperCase(), // Sync with 'name' field
  username: data.username || `${data.first_name} ${data.last_name}`.trim(),
  permanent_user: data.permanent_user ? 'Yes' : 'No', // Sync with legacy string boolean
  mobile: data.mobile ? 'Yes' : 'No', // Sync with legacy string boolean
  ignore_move_copy: data.ignore_move_copy ? 'No' : 'No', // Example says 'No'
  is_antipass: 'No', // Default for legacy
  visit_multi_times: 'No', // Default for legacy
  priv: data.priv ? 1 : 0, // Sync with legacy 0/1
  emp_type: '1', // Default for legacy
  upgrade: 1, // Default for legacy
  agri_card: 1, // Default for legacy
}))

export type EmployeeFormValues = z.input<typeof employeeFormSchema>
export type CreateEmployeePayload = z.output<typeof employeeFormSchema>
