"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { RequiredInformationTab } from "@/components/required-information-tab"
import { PersonalDetailsTab } from "@/components/personal-details-tab"
import { DocumentsComplianceTab } from "@/components/documents-compliance-tab"
import { ArrowLeft } from "lucide-react"

export function EmployeeManagementScreen({
  employeeId,
  companyId,
}: {
  employeeId?: string
  companyId?: string
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"required" | "personal" | "documents">("required")

  const handleBackClick = () => {
    if (companyId) {
      router.push(`/company/${companyId}/employees`)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <button
                  onClick={handleBackClick}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Employees</span>
                </button>
                <span>{">"}</span>
                <span>{employeeId || "John Smith"}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">Employee Management</h1>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-gray-700 bg-transparent">
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
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
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex gap-8 px-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("required")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "required"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Required Information
                  <span className="text-red-500 ml-1">*</span>
                </button>
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "personal"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "documents"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Documents & Compliance
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "required" && <RequiredInformationTab />}
              {activeTab === "personal" && <PersonalDetailsTab />}
              {activeTab === "documents" && <DocumentsComplianceTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
