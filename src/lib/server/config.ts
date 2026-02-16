/**
 * Server-side Configuration
 * These values are ONLY accessible on the server (not exposed to browser)
 */

export const SERVER_CONFIG = {
  // Backend API URL - NOT prefixed with NEXT_PUBLIC_ so it stays hidden
  API_URL: process.env.API_URL || "https://25fh9c86-8000.inc1.devtunnels.ms/api",

  // Request timeout
  TIMEOUT: 30000,
} as const

// API Endpoints (same as before, but server-side only)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    ME: "/me",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
  COMPANIES: {
    BASE: "/companies",
    BY_ID: (id: string) => `/companies/${id}`,
    EMPLOYEES: (companyId: string) => `/companies/${companyId}/employees`,
  },
  EMPLOYEES: {
    BASE: "/employees",
    BY_ID: (id: string) => `/employees/${id}`,
    CLOCKINGS: (employeeId: string) => `/employees/${employeeId}/clockings`,
  },
  CLOCKINGS: {
    BASE: "/clockings",
    BY_ID: (id: string) => `/clockings/${id}`,
  },
  SHIFTS: {
    BASE: "/shifts",
    BY_ID: (id: string) => `/shifts/${id}`,
  },
  HOLIDAYS: {
    BASE: "/holidays",
    BY_ID: (id: string) => `/holidays/${id}`,
  },
  ABSENT_CODES: {
    BASE: "/absent-codes",
    BY_ID: (id: string) => `/absent-codes/${id}`,
  },
  WORK_CYCLES: {
    BASE: "/work-cycles",
    BY_ID: (id: string) => `/work-cycles/${id}`,
  },
  PROFILE: {
    ME: "/profile",
  },
  EMPLOYEE: {
    BASE: "/employee",
    BY_SITE: (siteId: string) => `/employee/${siteId}`,
  },
  SITES: {
    BASE: "/site",
    BY_ID: (id: string) => `/site/${id}`,
  },
} as const

