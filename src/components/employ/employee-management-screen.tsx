"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmployeeSidebar } from "@/components/employ/employ-menagement-tab/employee-sidebar"
import { RequiredInformationTab } from "@/components/employ/employ-menagement-tab/required-information-tab"
import { PersonalDetailsTab } from "@/components/employ/employ-menagement-tab/personal-details-tab"
import { DocumentsComplianceTab } from "@/components/employ/employ-menagement-tab/documents-compliance-tab"
import { ArrowLeft } from "lucide-react"

export function EmployeeManagementScreen({
  employeeId,
  companyId,
}: {
  employeeId?: string
  companyId?: string
}) {
  const router = useRouter()
  const isNew = employeeId === "new"
  const [activeTab, setActiveTab] = useState<"required" | "personal" | "documents">("required")

  const handleBackClick = () => {
    if (companyId) {
      router.push(`/company/${companyId}/employees`)
    } else {
      router.push("/")
    }
  }

  const handleSave = () => {
    // In a real app, this would submit to API
    // For now, we simulate success and return
    alert("Employee saved successfully!")
    handleBackClick()
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header Section */}
      <header className="bg-background border-b border-border">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <button
                  onClick={handleBackClick}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Employees</span>
                </button>
                <span>{">"}</span>
                <span>{isNew ? "New Employee" : (employeeId || "John Smith")}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">{isNew ? "Create Employee" : "Employee Management"}</h1>
                {!isNew && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-foreground bg-transparent" onClick={handleBackClick}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Sidebar */}
        <EmployeeSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Tab Navigation */}
          <div className="bg-card rounded-lg shadow-sm">
            <div className="border-b border-border">
              <nav className="flex gap-8 px-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("required")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "required"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                >
                  Required Information
                  <span className="text-red-500 ml-1">*</span>
                </button>
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "personal"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                >
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "documents"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                >
                  Documents & Compliance
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "required" && <RequiredInformationTab isNew={isNew} />}
              {activeTab === "personal" && <PersonalDetailsTab isNew={isNew} />}
              {activeTab === "documents" && <DocumentsComplianceTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
