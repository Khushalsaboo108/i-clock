/**
 * Server Actions barrel export
 * Import all actions from here for clean imports
 */

export {
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
export { getWorkRules, getSingleWorkRule, createWorkRule, updateWorkRule, deleteWorkRule } from "./work-rules.actions"
export type { WorkRule, CreateWorkRulePayload, UpdateWorkRulePayload, WorkRulesPagination} from "./work-rules.actions"