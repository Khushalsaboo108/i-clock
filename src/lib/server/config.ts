/**
 * Server-side Configuration
 * These values are ONLY accessible on the server (not exposed to browser)
 */

export const SERVER_CONFIG = {
  // Backend API URL - NOT prefixed with NEXT_PUBLIC_ so it stays hidden
  API_URL: process.env.API_URL || "https://i-clock-backend.onrender.com/api",

  // Request timeout
  TIMEOUT: 30000,
} as const

// API Endpoints (same as before, but server-side only)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/admin/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
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
  SITES: {
    BASE: "/site",
    BY_ID: (id: string) => `/site/${id}`,
  },
} as const

