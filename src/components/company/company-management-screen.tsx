"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Building2 } from "lucide-react"

import { CompanySidebar } from "./company-sidebar"
import { BasicInfoTab } from "./company-management-tabs/basic-info-tab"
import { IntegrationsTab } from "./company-management-tabs/integrations-tab"
import { AdvancedConfigTab } from "./company-management-tabs/advanced-config-tab"

import { siteFormSchema, type SiteFormValues } from "@/lib/validations/site.schema"
import { createSiteAction } from "@/lib/actions"

export function CompanyManagementScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"basic" | "integrations" | "advanced">("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: "",
      site_code: "",
      contact: "",
      site_password: "",
      agrigistics_site: false,
      send_agrigistics_gps: false,
      pull_employees: false,
      send_attendance: false,
      easyroster: false,
      eduman: false,
      auto_remove_emp: false,
      access_user: false,
      easyroster_token: "",
      data_format: "<9,Pin><2,Day><2,Month><4,Year><2,Hour><2,Minute><2,Second><1,Status><-5,SN>",
      data_format_other: "<9,Pin><2,Day><2,Month><4,Year><2,Hour><2,Minute><2,Second><1,Status><-5,SN>",
      server_ip: "",
    },
  })

  const { handleSubmit, formState: { errors } } = methods

  const handleBackClick = () => {
    router.push("/")
  }

  const onSubmit = async (data: SiteFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await createSiteAction(data)
      if (result.success) {
        toast.success("Company created successfully")
        router.push("/")
      } else {
        toast.error(result.message || "Failed to create company")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
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
                  <button
                    type="button"
                    onClick={handleBackClick}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Companies</span>
                  </button>
                  <span>{">"}</span>
                  <span>New Company</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    Register New Company
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-transparent border-border hover:bg-muted"
                  onClick={handleBackClick}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Company"
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
                    <button
                      type="button"
                      onClick={() => setActiveTab("basic")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${activeTab === "basic"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                    >
                      Basic Information
                      <span className="text-red-500 ml-1">*</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("integrations")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${activeTab === "integrations"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                    >
                      Integrations
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("advanced")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${activeTab === "advanced"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                    >
                      Advanced Configuration
                    </button>
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
                    <svg className="w-4 h-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="I12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
