/**
 * Server Actions barrel export
 * Import all actions from here for clean imports
 */

export {
  loginAction,
  logoutAction,
  getCurrentUserAction,
  isAuthenticatedAction,
  forgotPasswordAction,
  resetPasswordAction,
  getProfileAction,
  type AdminProfile,
  type UserType,
} from "./auth.actions"

export { getSitesAction, getSiteByIdAction, createSiteAction, updateSiteAction, deleteSiteAction } from "./site.actions"
export type { Site, SitesPagination, SitesApiResponse } from "./site.actions"

export { getEmployeesAction, getEmployeeByIdAction, createEmployeeAction, updateEmployeeAction, deleteEmployeeAction } from "./employee.actions"
export type { Employee, EmployeePagination } from "./employee.actions"

export { createCalendarAction, getCalendarsAction, getSingleCalendarAction } from "./calendar.actions"
export type { CalendarApiItem, CalendarPagination } from "./calendar.actions"

export { createWeekendAction, getWeekendsAction } from "./weekend.actions"
export type { WeekendData } from "./weekend.actions"

export { createHolidayAction, getHolidaysAction, getSingleHolidayAction, deleteHolidayAction } from "./holiday.actions"
export type { HolidayApiItem, HolidayPagination } from "./holiday.actions"
