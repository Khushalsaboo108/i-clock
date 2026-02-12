/**
 * API Types
 * Type definitions for API requests and responses
 */

// Generic API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// Error response from API
export interface ApiError {
  success: false
  message: string
  code?: string
  errors?: Record<string, string[]>
  statusCode: number
}

// Request options
export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
  skipAuth?: boolean
  retries?: number
}

// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user?: User
  access_token: string
  refresh_token: string
  expiresIn?: number
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  companyId?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = "admin" | "manager" | "employee"

// Company Types
export interface Company {
  id: string
  name: string
  employeeCount: number
  departments: number
  createdAt: string
  updatedAt: string
}

// Employee Types
export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  companyId: string
  createdAt: string
  updatedAt: string
}

// Clocking Types
export interface Clocking {
  id: string
  employeeId: string
  clockIn: string
  clockOut?: string
  type: ClockingType
  notes?: string
  createdAt: string
  updatedAt: string
}

export type ClockingType = "regular" | "overtime" | "leave"

// Shift Types
export interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  breakDuration: number
  createdAt: string
  updatedAt: string
}

// Holiday Types
export interface Holiday {
  id: string
  name: string
  date: string
  type: HolidayType
  createdAt: string
  updatedAt: string
}

export type HolidayType = "public" | "company"

// Absent Code Types
export interface AbsentCode {
  id: string
  code: string
  description: string
  isPaid: boolean
  createdAt: string
  updatedAt: string
}

// Work Cycle Types
export interface WorkCycle {
  id: string
  name: string
  daysOn: number
  daysOff: number
  createdAt: string
  updatedAt: string
}
