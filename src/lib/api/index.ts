/**
 * API Module Barrel Export
 * Central export point for all API-related utilities
 */

// Core
export { apiClient } from "./client"
export { API_CONFIG, API_ENDPOINTS } from "./config"

// Types
export type {
  ApiResponse,
  ApiError,
  RequestOptions,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
  UserRole,
  Company,
  Employee,
  Clocking,
  ClockingType,
  Shift,
  Holiday,
  HolidayType,
  AbsentCode,
  WorkCycle,
} from "./types"

