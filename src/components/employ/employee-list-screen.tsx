"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Search, ChevronRight, Users } from "lucide-react"

interface Employee {
  id: string
  name: string
  employeeId: string
  department: string
  position: string
  email: string
  status: "active" | "inactive" | "on-leave"
}

const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "John Smith",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    email: "john.smith@company.com",
    status: "active",
  },
  {
    id: "emp-002",
    name: "Sarah Johnson",
    employeeId: "EMP002",
    department: "HR",
    position: "HR Manager",
    email: "sarah.johnson@company.com",
    status: "active",
  },
  {
    id: "emp-003",
    name: "Michael Brown",
    employeeId: "EMP003",
    department: "Sales",
    position: "Sales Executive",
    email: "michael.brown@company.com",
    status: "on-leave",
  },
  {
    id: "emp-004",
    name: "Emily Davis",
    employeeId: "EMP004",
    department: "Engineering",
    position: "Junior Developer",
    email: "emily.davis@company.com",
    status: "active",
  },
  {
    id: "emp-005",
    name: "Robert Wilson",
    employeeId: "EMP005",
    department: "Finance",
    position: "Finance Analyst",
    email: "robert.wilson@company.com",
    status: "inactive",
  },
  {
    id: "emp-006",
    name: "Lisa Anderson",
    employeeId: "EMP006",
    department: "Marketing",
    position: "Marketing Manager",
    email: "lisa.anderson@company.com",
    status: "active",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  "on-leave": "bg-amber-100 text-amber-800",
  inactive: "bg-gray-100 text-gray-800",
}

export function EmployeeListScreen({ companyId }: { companyId: string }) {
  const router = useRouter()
  const [employees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEmployeeClick = (employeeId: string) => {
    router.push(`/company/${companyId}/employees/${employeeId}`)
  }

  const handleBackClick = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className=" border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Employees</h1>
              <p className="text-sm text-muted-foreground">
                Company ID: {companyId} • {filteredEmployees.length} total
              </p>
            </div>
          </div>

          {/* Search Bar */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{employees.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {employees.filter((e) => e.status === "active").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {employees.filter((e) => e.status === "on-leave").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">
                  {employees.filter((e) => e.status === "inactive").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees Table */}
        <div className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, employee ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Employee Directory</CardTitle>
            <Button className="gap-2" onClick={() => router.push(`/company/${companyId}/employees/new`)}>
              <Plus className="w-4 h-4" />
              Add Employee
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow
                        key={employee.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleEmployeeClick(employee.id)}
                      >
                        <TableCell className="font-medium text-foreground">{employee.name}</TableCell>
                        <TableCell className="text-muted-foreground">{employee.employeeId}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell className="text-muted-foreground">{employee.position}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{employee.email}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[employee.status]}>
                            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEmployeeClick(employee.id)
                            }}
                            className="rounded-full"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No employees found matching your search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
