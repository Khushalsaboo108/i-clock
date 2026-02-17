"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmployeeSidebar } from "@/components/employ/employ-menagement-tab/employee-sidebar"
import { RequiredInformationTab } from "@/components/employ/employ-menagement-tab/required-information-tab"
import { PersonalDetailsTab } from "@/components/employ/employ-menagement-tab/personal-details-tab"
import { DocumentsComplianceTab } from "@/components/employ/employ-menagement-tab/documents-compliance-tab"
import { DisciplinaryRecordsTab } from "@/components/employ/employ-menagement-tab/disciplinary-records-tab"
import { ArrowLeft, Loader2 } from "lucide-react"
import { employeeFormSchema, type EmployeeFormValues } from "@/lib/validations/employee.schema"
import { createEmployeeAction } from "@/lib/actions/employee.actions"

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

  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      site_id: companyId ? parseInt(companyId) : 0,
      employee_id: "",
      first_name: "",
      last_name: "",
      pin: "",
      card_number: "",
      employment_date: new Date().toISOString().split("T")[0],
      public_holiday_calendar_id: "standard",
      work_rules_id: "standard",
      status: "Active",
      personal_details: {
        photo_url: "",
        dob: "",
        contact_number: "",
        address: {
          street: "",
          suburb: "",
          city: "",
          postal_code: "",
        },
        emergency_contact: {
          person: "",
          relationship: "",
          number: "",
        },
        banking: {
          bank_name: "",
          account_number: "",
          account_type: "Current",
          routing_code: "",
        },
        sex: "Other",
        marital_status: "Single",
        notes: "",
        birthday_notifications: true,
      },
      clocking_config: {
        method: "default",
        saved_as_received: true,
        smart_detection: {
          alternating_mode: false,
          first_clock_is_in: true,
          new_shift_threshold: {
            hours: 4,
            minutes: 0,
          },
        },
      },
      compliance_documents: {
        medical: [{ check_date: "", expiry_date: "", limitations: "", notify_user: true }],
        drivers_license: {
          code: "",
          number: "",
          type: "",
          issued_date: "",
          expiry_date: "",
          notify_user: true,
        },
        certificates: [{ name: "", number: "", issued_date: "", re_issue_date: "", description: "", notify_user: true }],
      },
      disciplinary_records: [{ offense_type: "none", notes: "", effective_until: "", times_reported: 0, status: "Active" }],
      reader_pin: "",
      category_id: 0,
      sbu_category_id: 0,
      work_center_id: 0,
    },
  })

  const { handleSubmit, formState: { errors } } = methods

  const handleBackClick = () => {
    if (companyId) {
      router.push(`/company/${companyId}/employees`)
    } else {
      router.push("/")
    }
  }

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await createEmployeeAction(data)
      if (result.success) {
        toast.success("Employee created successfully")
        handleBackClick()
      } else {
        toast.error(result.message || "Failed to create employee")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Debugging errors
  if (Object.keys(errors).length > 0) {
    console.log("Form Errors:", errors)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-muted/40">
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
                  <span>{isNew ? "New Employee" : (employeeId || "John Smith")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {isNew ? "Create Employee" : "Employee Management"}
                  </h1>
                  {!isNew && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="text-foreground bg-transparent"
                  onClick={handleBackClick}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isNew ? "Creating..." : "Saving..."}
                    </>
                  ) : (
                    isNew ? "Create Employee" : "Save Changes"
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
