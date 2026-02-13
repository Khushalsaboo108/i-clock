import { z } from "zod"

/**
 * Site Form Validation Schema
 *
 * This schema validates the Create Site form on the client,
 * and its transform converts boolean toggles to "Yes"/"No" for the API.
 *
 * Usage:
 *   - Client form: use `siteFormSchema` with react-hook-form
 *   - Server action: use `createSitePayloadSchema` for API payload validation
 */

// ---------------------------------------------------------------------------
// Form Schema (what the user fills in)
// ---------------------------------------------------------------------------

export const siteFormSchema = z.object({
  // Basic Info
  name: z.string().min(1, "Company name is required").max(100),
  site_code: z
    .string()
    .min(1, "Site code is required")
    .max(50, "Site code must be 50 characters or less"),
  contact: z.string().max(50).optional().default(""),
  site_password: z.string().min(1, "Site password is required").max(50),

  // Integration Toggles (user sees true/false switches)
  agrigistics_site: z.boolean().default(false),
  send_agrigistics_gps: z.boolean().default(false),
  pull_employees: z.boolean().default(false),
  send_attendance: z.boolean().default(false),
  easyroster: z.boolean().default(false),
  eduman: z.boolean().default(false),
  auto_remove_emp: z.boolean().default(false),
  access_user: z.boolean().default(false),

  // Optional text for integrations
  easyroster_token: z.string().optional().default(""),

  // Advanced Config
  data_format: z.string().optional().default(
    "<9,Pin><2,Day><2,Month><4,Year><2,Hour><2,Minute><2,Second><1,Status><-5,SN>"
  ),
  data_format_other: z.string().optional().default(
    "<9,Pin><2,Day><2,Month><4,Year><2,Hour><2,Minute><2,Second><1,Status><-5,SN>"
  ),
  server_ip: z.string().optional().default(""),
})

/** Type for the form values (booleans, not "Yes"/"No") */
export type SiteFormValues = z.infer<typeof siteFormSchema>

// ---------------------------------------------------------------------------
// API Payload Schema (transforms booleans → "Yes" | "No")
// ---------------------------------------------------------------------------

/** Helper: converts a boolean to "Yes" | "No" */
const boolToYesNo = (val: boolean): "Yes" | "No" => (val ? "Yes" : "No")

/** Schema that transforms form values into the API payload format */
export const createSitePayloadSchema = siteFormSchema.transform((data) => ({
  name: data.name,
  site_code: data.site_code,
  contact: data.contact,
  site_password: data.site_password,

  agrigistics_site: boolToYesNo(data.agrigistics_site),
  send_agrigistics_gps: boolToYesNo(data.send_agrigistics_gps),
  pull_employees: boolToYesNo(data.pull_employees),
  send_attendance: boolToYesNo(data.send_attendance),
  easyroster: boolToYesNo(data.easyroster),
  eduman: boolToYesNo(data.eduman),
  auto_remove_emp: boolToYesNo(data.auto_remove_emp),
  access_user: boolToYesNo(data.access_user),

  easyroster_token: data.easyroster_token,
  data_format: data.data_format,
  data_format_other: data.data_format_other,
  server_ip: data.server_ip,
}))

/** Type for the API payload (after transform) */
export type CreateSitePayload = z.output<typeof createSitePayloadSchema>
