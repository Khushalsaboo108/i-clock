"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowLeft, Loader2, Building2, AlertCircle } from "lucide-react"
import { CompanySidebar } from "./company-sidebar"
import { BasicInfoTab } from "./company-management-tabs/basic-info-tab"
import { IntegrationsTab } from "./company-management-tabs/integrations-tab"
import { AdvancedConfigTab } from "./company-management-tabs/advanced-config-tab"

import { siteFormSchema, type SiteFormValues } from "@/lib/validations/site.schema"
import { createSiteAction, updateSiteAction, deleteSiteAction } from "@/lib/actions/site.actions"
import { DeleteConfirmationDialog } from "@/components/common/DeleteConfirmationDialog"
import { showError, showSuccess } from "@/lib/toast"

export function CompanyManagementScreen({
  siteId,
  initialData,
}: {
  siteId?: string
  initialData?: Partial<SiteFormValues>
}) {
  const router = useRouter()
  const isEdit = !!siteId
  const [activeTab, setActiveTab] = useState<"basic" | "integrations" | "advanced">("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const methods = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      site_code: initialData?.site_code || "",
      contact: initialData?.contact || "",
      site_password: initialData?.site_password || "",
      agrigistics_site: initialData?.agrigistics_site ?? false,
      send_agrigistics_gps: initialData?.send_agrigistics_gps ?? false,
      pull_employees: initialData?.pull_employees ?? false,
      send_attendance: initialData?.send_attendance ?? false,
      easyroster: initialData?.easyroster ?? false,
      eduman: initialData?.eduman ?? false,
      auto_remove_emp: initialData?.auto_remove_emp ?? false,
      access_user: initialData?.access_user ?? false,
      easyroster_token: initialData?.easyroster_token || "",
      data_format: initialData?.data_format || "<9,Pin><2,Day><2,Month><4,Year><2,Hour><2,Minute><2,Second><1,Status><-5,SN>",
      data_format_other: initialData?.data_format_other || "<9,Pin><2,Day><2,Month><4,Year><2,Hour><2,Minute><2,Second><1,Status><-5,SN>",
      server_ip: initialData?.server_ip || "",
    },
  })

  const { handleSubmit, formState: { errors } } = methods

  const handleBackClick = () => {
    router.push("/")
  }

  const onSubmit = async (data: SiteFormValues) => {
    setIsSubmitting(true)
    try {
      const result = isEdit
        ? await updateSiteAction(siteId, data)
        : await createSiteAction(data)

      if (result.success) {
        showSuccess(isEdit ? "Company updated successfully" : "Company created successfully")
        router.push("/")
      } else {
        showError(result.message || `Failed to ${isEdit ? 'update' : 'create'} company`)
      }
    } catch (error) {
      showError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    if (!siteId) return
    setIsDeleting(true)
    try {
      const result = await deleteSiteAction(siteId)
      if (result.success) {
        showSuccess("Company deleted successfully")
        router.push("/")
      } else {
        showError(result.message || "Failed to delete company")
      }
    } catch (error) {
      showError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-muted/40 pb-20">
        {/* Header Section */}
        <header className="bg-background border-b border-border sticky top-0 z-30">
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
                    <span>Companies</span>
                  </Button>
                  <span>{">"}</span>
                  <span>{isEdit ? "Edit Company" : "New Company"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    {isEdit ? `Edit ${initialData?.name || 'Company'}` : "Register New Company"}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isEdit && (
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
                          company <strong> {initialData?.name}</strong> and all associated data.
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
                  className="bg-transparent border-border hover:bg-muted"
                  onClick={handleBackClick}
                  disabled={isSubmitting || isDeleting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isDeleting} className="min-w-[120px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    isEdit ? "Save Changes" : "Create Company"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="flex gap-8">
            {/* Left Sidebar Preview */}
            <CompanySidebar />

            {/* Main Content Form */}
            <main className="flex-1">
              <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-border bg-muted/20">
                  <nav className="flex gap-8 px-8" aria-label="Tabs">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab("basic")}
                      className={`py-4 px-1 rounded-none border-b-2 font-medium text-sm transition-all h-auto ${activeTab === "basic"
                        ? "border-primary text-primary hover:bg-transparent"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-transparent"
                        }`}
                    >
                      Basic Information
                      <span className="text-red-500 ml-1">*</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab("integrations")}
                      className={`py-4 px-1 rounded-none border-b-2 font-medium text-sm transition-all h-auto ${activeTab === "integrations"
                        ? "border-primary text-primary hover:bg-transparent"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-transparent"
                        }`}
                    >
                      Integrations
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTab("advanced")}
                      className={`py-4 px-1 rounded-none border-b-2 font-medium text-sm transition-all h-auto ${activeTab === "advanced"
                        ? "border-primary text-primary hover:bg-transparent"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-transparent"
                        }`}
                    >
                      Advanced Configuration
                    </Button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-8 min-h-[500px]">
                  {activeTab === "basic" && <BasicInfoTab />}
                  {activeTab === "integrations" && <IntegrationsTab />}
                  {activeTab === "advanced" && <AdvancedConfigTab />}
                </div>
              </div>

              {/* Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-destructive/20 rounded-full">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-sm font-medium text-destructive">
                    Please correct the errors in the <strong>Basic Information</strong> tab before submitting.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
