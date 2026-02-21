"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmployeeSidebar } from "@/components/employ/employ-menagement-tab/employee-sidebar"
import { RequiredInformationTab } from "@/components/employ/employ-menagement-tab/required-information-tab"
import { PersonalDetailsTab } from "@/components/employ/employ-menagement-tab/personal-details-tab"
import { DocumentsComplianceTab } from "@/components/employ/employ-menagement-tab/documents-compliance-tab"
import { DisciplinaryRecordsTab } from "@/components/employ/employ-menagement-tab/disciplinary-records-tab"
import { ArrowLeft, Loader2, Trash2, AlertCircle } from "lucide-react"
import { employeeFormSchema, type EmployeeFormValues } from "@/lib/validations/employee.schema"
import { createEmployeeAction, getEmployeeByIdAction, updateEmployeeAction, deleteEmployeeAction } from "@/lib/actions/employee.actions"
import { showError, showSuccess } from "@/lib/toast"
import { useEffect } from "react"
import { DeleteConfirmationDialog } from "@/components/common/DeleteConfirmationDialog"

export function EmployeeManagementScreen({
  employeeId,
  companyId,
}: {
  employeeId?: string
  companyId?: string
}) {
  const router = useRouter()
  const isNew = employeeId === "new"
  const [activeTab, setActiveTab] = useState<"required" | "personal" | "documents" | "disciplinary">("required")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      site_id: companyId ? parseInt(companyId) : 0,
      employee_id: "",
      first_name: "",
      last_name: "",
      pin: 0,
      card: 0,
      employment_date: new Date().toISOString().split("T")[0],
      public_holiday_calendar_id: 1,
      work_rules_id: 1,
      email: "",
      status: "Active",
      personal_details: {
        photo_url: "",
        dob: "",
        phone: 0,
        address: {
          street: "",
          suburb: "",
          city: "",
          postal_code: 0,
        },
        emergency_contact: {
          person: "",
          relationship: "",
          number: 0,
        },
        banking: {
          bank_name: "",
          account_number: 0,
          account_type: "Current",
          routing_code: "",
        },
        gender: "" as any,
        marital_status: "",
        birthday_notifications: true,
      },
      clocking_config: {
        source: "work_rule",
        mode: "directional",
        new_shift_threshold: {
          hours: 4,
          minutes: 0,
        },
      },
      leave_balance: {
        sick_leave_total: 0,
        sick_leave_taken: 0,
        sick_leave_paid: true,
        sick_leave_remaining: 0,
        family_leave_total: 0,
        family_leave_taken: 0,
        family_leave_paid: true,
        family_leave_remaining: 0,
        casual_leave_total: 0,
        casual_leave_taken: 0,
        casual_leave_paid: false,
        casual_leave_remaining: 0,
      },
      salary: {
        base_salary: 0,
        hourly_rate: 0,
        monthly_salary: 0,
        currency: "USD",
        pay_frequency: "Monthly",
        bank_name: "",
        account_type: "Current",
        account_number: 0,
        routing_code: "",
        is_active: true,
        effective_from: "",
      },
      departments: [],
      compliance_documents: {
        medical: [],
        drivers_license: null,
        certificates: [],
      },
      disciplinary_records: [],
      reader_pin: "",
      category_id: 0,
      sub_category_id: 0,
      work_center_id: 0,
    },
  })

  // Fetch employee data if editing
  useEffect(() => {
    async function fetchEmployee() {
      if (isNew || !employeeId) return

      setIsLoading(true)
      try {
        const result = await getEmployeeByIdAction(employeeId)
        if (result.success && result.data) {
          const emp = result.data as any

          // Split name into first and last if needed
          const nameParts = (emp.name || "").split(" ")
          const firstName = nameParts[0] || ""
          const lastName = nameParts.slice(1).join(" ") || ""

          // Reset form with fetched data (mapping fields as needed)
          methods.reset({
            site_id: Number(emp.site_id || (companyId ? parseInt(companyId) : 0)),
            employee_id: String(emp.employee_id || ""),
            first_name: firstName,
            last_name: lastName,
            username: emp.username || "",
            pin: Number(emp.pin || 0),
            card: Number(emp.card || 0),
            employment_date: emp.employment_date || emp.start_date || new Date().toISOString().split("T")[0],
            public_holiday_calendar_id: Number(emp.public_holiday_calendar_id || 1),
            work_rules_id: Number(emp.work_rules_id || 1),
            status: (emp.status === "Active" || emp.status === "Inactive") ? emp.status : "Active",
            password: emp.password ? Number(emp.password) : undefined,
            email: emp.email || "",
            permanent_user: emp.permanent_user === true || emp.permanent_user === "Yes",
            mobile: emp.mobile === true || emp.mobile === "Yes",
            access_code_generator: (emp.access_code_generator === "Enable" || emp.access_code_generator === "Disable")
              ? emp.access_code_generator
              : "Disable",
            category_id: emp.category_id || 0,
            sub_category_id: emp.sub_category_id || 0,
            work_center_id: emp.work_center_id || 0,
            reader_pin: String(emp.pin || ""),
            property_number: emp.property_number || "",
            vehicle_reg_no: emp.vehicle_reg_no || "",
            personal_details: {
              photo_url: emp.details?.personal_details?.photo_url || emp.picture || "",
              phone: Number(emp.details?.personal_details?.phone || emp.details?.personal_details?.contact_number || emp.phone || emp.mobile_number || 0),
              address: {
                street: emp.details?.personal_details?.address?.street || emp.address || "",
                city: emp.details?.personal_details?.address?.city || emp.town || "",
                postal_code: Number(emp.details?.personal_details?.address?.postal_code || emp.postal_code || 0),
                suburb: emp.details?.personal_details?.address?.suburb || emp.area || "",
              },
              gender: (emp.details?.gender === "M" || emp.details?.gender === "F" || emp.details?.gender === "Other") ? emp.details.gender : (emp.sex === "M" || emp.sex === "F" || emp.sex === "Other" ? emp.sex : "" as any),
              marital_status: emp.details?.marital_status || emp.marital_status || "",
              dob: emp.details?.personal_details?.dob || emp.date_birth || "",
              birthday_notifications: emp.details?.personal_details?.birthday_notifications !== false,
              emergency_contact: emp.details?.personal_details?.emergency_contact || {
                person: "",
                relationship: "",
                number: 0,
              },
              banking: emp.details?.personal_details?.banking || {
                bank_name: "",
                account_number: 0,
                account_type: "",
                routing_code: "",
              },
            },

            leave_balance: emp.leave_balance || {
              sick_leave_total: 0, sick_leave_taken: 0, sick_leave_paid: true, sick_leave_remaining: 0,
              family_leave_total: 0, family_leave_taken: 0, family_leave_paid: true, family_leave_remaining: 0,
              casual_leave_total: 0, casual_leave_taken: 0, casual_leave_paid: false, casual_leave_remaining: 0
            },
            salary: emp.salary || {
              base_salary: 0, hourly_rate: 0, monthly_salary: 0, currency: "USD", pay_frequency: "Monthly",
              bank_name: "", account_type: "Current", is_active: true
            },
            departments: emp.departments || [],
            // Fallback for nested objects if not in response
            clocking_config: emp.clocking_config || {
              source: "work_rule",
              mode: "directional",
              new_shift_threshold: { hours: 4, minutes: 0 },
            },
            compliance_documents: emp.compliance_documents || {
              medical: [],
              drivers_license: null,
              certificates: [],
            },
            disciplinary_records: emp.disciplinary_records || [],
          })
        } else {
          showError(result.message || "Failed to fetch employee details")
        }
      } catch (error) {
        showError("Failed to load employee data")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployee()
  }, [employeeId, isNew, companyId, methods])

  const { handleSubmit, formState: { errors } } = methods

  const handleBackClick = () => {
    if (companyId) {
      router.push(`/company/${companyId}/employees`)
    } else {
      router.push("/")
    }
  }

  const onSubmit = async (data: EmployeeFormValues) => {
    console.log("[EmployeeManagementScreen] Submitting data:", data)
    setIsSubmitting(true)
    try {
      const result = isNew
        ? await createEmployeeAction(data)
        : await updateEmployeeAction(employeeId!, data)

      console.log("[EmployeeManagementScreen] Submit result:", result)
      if (result.success) {
        showSuccess(isNew ? "Employee created successfully" : "Employee updated successfully")
        handleBackClick()
      } else {
        showError(result.message || `Failed to ${isNew ? "create" : "update"} employee`)
      }
    } catch (error) {
      showError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    if (isNew || !employeeId) return
    setIsDeleting(true)
    try {
      const result = await deleteEmployeeAction(employeeId)
      if (result.success) {
        showSuccess("Employee deleted successfully")
        handleBackClick()
      } else {
        showError(result.message || "Failed to delete employee")
      }
    } catch (error) {
      showError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  // Debugging errors
  if (Object.keys(errors).length > 0) {
    console.log("Form Errors:", errors)
  }

  // Helper to determine if a specific tab has errorss
  const hasErrors = (tabName: string) => {
    switch (tabName) {
      case "required":
        return !!(errors.first_name || errors.last_name || errors.employment_date || errors.employee_id || errors.email);
      case "personal":
        return !!errors.personal_details;
      // You can add more specific checks here if Document or Disciplinary tabs add required fields later
      default:
        return false;
    }
  }

  const onInvalid = (errors: any) => {
    console.log("Validation Failed:", errors)
    showError("Please fill out all required fields across the tabs.");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading employee details...</p>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="min-h-screen bg-muted/40">
        {/* Header Section */}
        <header className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={handleBackClick}
                    className="flex items-center gap-1 hover:text-foreground transition-colors p-0 h-auto font-normal"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Employees</span>
                  </Button>
                  <span>{">"}</span>
                  <span>{isNew ? "New Employee" : (methods.getValues("first_name") + " " + methods.getValues("last_name") || "Edit Employee")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {isNew ? "Create Employee" : "Employee Management"}
                  </h1>
                  {!isNew && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20">
                      {methods.watch("status")}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isNew && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={isSubmitting || isDeleting}
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <DeleteConfirmationDialog
                      open={isDeleteDialogOpen}
                      onOpenChange={setIsDeleteDialogOpen}
                      description={
                        <>
                          This action cannot be undone. This will permanently delete the
                          employee <strong>{methods.getValues("first_name")} {methods.getValues("last_name")}</strong> and all associated data.
                        </>
                      }
                      onConfirm={onDelete}
                      isDeleting={isDeleting}
                      confirmText="Permanently Delete"
                    />
                  </>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="text-foreground bg-transparent"
                  onClick={handleBackClick}
                  disabled={isSubmitting || isDeleting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isDeleting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isNew ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    isNew ? "Create" : "Update"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="flex gap-8">
            {/* Left Sidebar */}
            <EmployeeSidebar />

            {/* Main Content */}
            <main className="flex-1">
              {/* Tab Navigation */}
              <div className="bg-card rounded-lg shadow-sm border border-border">
                <div className="border-b border-border">
                  <nav className="flex gap-8 px-8" aria-label="Tabs">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab("required")}
                      className={`py-4 px-1 rounded-none border-b-2 font-medium text-sm transition-colors h-auto ${activeTab === "required"
                        ? "border-primary text-primary hover:bg-transparent"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-transparent"
                        }`}
                    >
                      Required Information
                      <span className="text-red-500 ml-1">*</span>
                      {hasErrors("required") && <AlertCircle className="w-4 h-4 ml-2 text-destructive inline" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab("personal")}
                      className={`py-4 px-1 rounded-none border-b-2 font-medium text-sm transition-colors h-auto ${activeTab === "personal"
                        ? "border-primary text-primary hover:bg-transparent"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-transparent"
                        }`}
                    >
                      Personal Details
                      {hasErrors("personal") && <AlertCircle className="w-4 h-4 ml-2 text-destructive inline" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab("documents")}
                      className={`py-4 px-1 rounded-none border-b-2 font-medium text-sm transition-colors h-auto ${activeTab === "documents"
                        ? "border-primary text-primary hover:bg-transparent"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-transparent"
                        }`}
                    >
                      Documents & Compliance
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab("disciplinary")}
                      className={`py-4 px-1 rounded-none border-b-2 font-medium text-sm transition-colors h-auto ${activeTab === "disciplinary"
                        ? "border-primary text-primary hover:bg-transparent"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-transparent"
                        }`}
                    >
                      Disciplinary Records
                    </Button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {activeTab === "required" && <RequiredInformationTab isNew={isNew} />}
                  {activeTab === "personal" && <PersonalDetailsTab isNew={isNew} />}
                  {activeTab === "documents" && <DocumentsComplianceTab />}
                  {activeTab === "disciplinary" && <DisciplinaryRecordsTab />}
                </div>
              </div>
            </main>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
