"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ChevronRight, Plus } from "lucide-react"

interface Company {
  id: string
  name: string
  employeeCount: number
  departments: number
}

const mockCompanies: Company[] = [
  { id: "1", name: "Acme Corporation", employeeCount: 245, departments: 8 },
  { id: "2", name: "TechFlow Systems", employeeCount: 128, departments: 5 },
  { id: "3", name: "Global Industries", employeeCount: 512, departments: 12 },
  { id: "4", name: "Innovation Labs", employeeCount: 67, departments: 3 },
]

export function CompanySelectionScreen() {
  const router = useRouter()
  const [companies] = useState<Company[]>(mockCompanies)

  const handleSelectCompany = (companyId: string) => {
    router.push(`/company/${companyId}/employees`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Time & Attendance System</h1>
          </div>
          <p className="text-muted-foreground">Select a company to manage employees and attendance</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Companies</h2>
            <p className="text-sm text-muted-foreground mt-1">You have access to {companies.length} companies</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Company
          </Button>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card
              key={company.id}
              className="group hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => handleSelectCompany(company.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="group-hover:text-primary transition-colors">{company.name}</CardTitle>
                    <CardDescription className="mt-1">Company ID: {company.id}</CardDescription>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground font-medium">Employees</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{company.employeeCount}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground font-medium">Departments</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{company.departments}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectCompany(company.id)
                  }}
                >
                  Manage Employees
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
