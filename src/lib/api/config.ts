/**
 * API Configuration
 * Centralized configuration for all API-related settings
 */

export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://25fh9c86-8000.inc1.devtunnels.ms/api",
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
    BACKOFF_MULTIPLIER: 2,
  },
  
  // Token storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER: "user",
  },
} as const

// API Endpoints organized by feature
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/admin/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
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
} as const
