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
  username: z.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-z0-9._-]+$/, "Only lowercase letters, numbers, and . _ - are allowed"),
  pin: z.coerce.number().int(),
  card: z.coerce.number().int(),
  employment_date: z.string().min(1, "Employment date is required"),
  public_holiday_calendar_id: z.coerce.number().int().default(1),
  work_rules_id: z.coerce.number().int().default(1),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.coerce.number().optional(),
  mobile_number: z.coerce.number().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  permanent_user: z.boolean().default(true),
  mobile: z.boolean().default(true),
  access_code_generator: z.enum(["Enable", "Disable"]).default("Disable"),
  password: z.coerce.number().optional(),
  employee_code: z.string().optional().default(""),

  filters: z.array(z.object({
    group: z.string(),
    value: z.string()
  })).optional().default([]),

  clocking_config: z.object({
    source: z.enum(["work_rule", "employee_override"]).default("work_rule"),
    mode: z.enum(["directional", "alternating"]).default("directional"),
    new_shift_threshold: z.object({
      hours: z.coerce.number().min(0).max(23).default(4),
      minutes: z.coerce.number().min(0).max(59).default(0),
    }).optional()
  }).optional(),

  personal_details: z.object({
    photo_url: z.string().optional().default(""),
    dob: z.string().optional(),
    gender: z.enum(["M", "F", "Other"], { required_error: "Sex is required" }),
    marital_status: z.string().min(1, "Marital status is required"),
    id_number: z.string().max(50).optional().default(""),
    phone: z.coerce.number().min(1, "Phone number is required"),
    address: z.object({
      street: z.string().min(1, "Street is required").max(255),
      suburb: z.string().max(100).optional().default(""),
      city: z.string().min(1, "City is required").max(100),
      postal_code: z.coerce.number().min(1, "Postal code is required"),
    }),
    emergency_contact: z.object({
      person: z.string().min(1, "Emergency person is required").max(100),
      relationship: z.string().min(1, "Relationship is required").max(50),
      number: z.coerce.number().min(1, "Emergency number is required"),
    }),
    banking: z.object({
      bank_name: z.string().min(1, "Bank name is required").max(100),
      account_type: z.string().min(1, "Account type is required").max(50),
      account_number: z.coerce.number().min(1, "Account number is required"),
      routing_code: z.string().min(1, "Routing code is required").max(50),
    }),
    birthday_notifications: z.boolean().default(true),
  }),

  leave_balance: z.object({
    sick_leave_total: z.coerce.number().default(0),
    sick_leave_taken: z.coerce.number().default(0),
    sick_leave_paid: z.boolean().default(true),
    sick_leave_remaining: z.coerce.number().default(0),
    family_leave_total: z.coerce.number().default(0),
    family_leave_taken: z.coerce.number().default(0),
    family_leave_paid: z.boolean().default(true),
    family_leave_remaining: z.coerce.number().default(0),
    casual_leave_total: z.coerce.number().default(0),
    casual_leave_taken: z.coerce.number().default(0),
    casual_leave_paid: z.boolean().default(false),
    casual_leave_remaining: z.coerce.number().default(0),
  }).optional().default({
    sick_leave_total: 0, sick_leave_taken: 0, sick_leave_paid: true, sick_leave_remaining: 0,
    family_leave_total: 0, family_leave_taken: 0, family_leave_paid: true, family_leave_remaining: 0,
    casual_leave_total: 0, casual_leave_taken: 0, casual_leave_paid: false, casual_leave_remaining: 0
  }),

  salary: z.object({
    base_salary: z.coerce.number().default(0),
    hourly_rate: z.coerce.number().default(0),
    monthly_salary: z.coerce.number().default(0),
    currency: z.string().nullable().optional().default("USD").transform(v => v ?? "USD"),
    pay_frequency: z.string().nullable().optional().default("Monthly").transform(v => v ?? "Monthly"),
    bank_name: z.string().nullable().optional().default("").transform(v => v ?? ""),
    account_type: z.string().nullable().optional().default("Current").transform(v => v ?? "Current"),
    account_number: z.coerce.number().optional(),
    routing_code: z.string().nullable().optional().default("").transform(v => v ?? ""),
    is_active: z.boolean().default(true),
    effective_from: z.string().nullable().optional().default("").transform(v => v ?? ""),
  }).optional().default({
    base_salary: 0, hourly_rate: 0, monthly_salary: 0, currency: "USD", pay_frequency: "Monthly",
    bank_name: "", account_type: "Current", is_active: true
  }),

  departments: z.array(z.object({
    department_id: z.coerce.number().int(),
    is_primary: z.boolean()
  })).optional().default([]),

  compliance_documents: z.object({
    medical: z.array(z.object({
      check_date: z.string(),
      expiry_date: z.string(),
      limitations: z.string().optional().default(""),
      notify_user: z.boolean().default(true),
    })).optional().default([]),
    drivers_license: z.object({
      code: z.string().nullable().optional().default("").transform(v => v ?? ""),
      number: z.string().nullable().optional().default("").transform(v => v ?? ""),
      type: z.string().nullable().optional().default("").transform(v => v ?? ""),
      issued_date: z.string().nullable().optional().transform(v => v ?? ""),
      expiry_date: z.string().nullable().optional().transform(v => v ?? ""),
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
  }).optional().default({}),

  disciplinary_records: z.array(z.object({
    offense_type: z.string().nullable().optional().default("").transform(v => v ?? ""),
    notes: z.string().nullable().optional().default("").transform(v => v ?? ""),
    effective_until: z.string().nullable().optional().default("").transform(v => v ?? ""),
    times_reported: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    }, z.number().min(0).default(0)),
    status: z.enum(["Active", "Resolved"]).default("Active"),
  })).optional().default([]),

  // System fields
  reader_pin: z.string().max(50).optional().default(""),
  category_id: z.coerce.number().int().min(0).default(0),
  sub_category_id: z.coerce.number().int().min(0).default(0),
  property_number: z.string().max(50).optional().default(""),
  vehicle_reg_no: z.string().max(20).optional().default(""),
  access_group: z.coerce.number().int().min(0).optional().default(0),
  ignore_move_copy: z.boolean().default(false),
  priv: z.boolean().default(false),
  alias_employee: z.string().max(50).optional().default(""),
  nif_dni: z.string().max(50).optional().default(""),
  work_center_id: z.coerce.number().int().min(0).default(0),
})

export type EmployeeFormValues = z.input<typeof employeeFormSchema>
export type CreateEmployeePayload = z.output<typeof employeeFormSchema>
