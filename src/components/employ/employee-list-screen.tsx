import * as React from "react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Plus, Search, ChevronRight, ChevronLeft, Users, Loader2, ArrowUpDown } from "lucide-react"
import { getEmployeesAction, getSiteByIdAction, type Employee, type Site } from "@/lib/actions"
import { cn } from "@/lib/utils"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"

interface Pagination {
  total: number
  page: number
  limit: number
}

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  Disabled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

function EmployeeListSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function EmployeeListScreen({ companyId }: { companyId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [siteData, setSiteData] = useState<Site | null>(null)
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10 })
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "10", 10)

  // Fetch site details (called once)
  useEffect(() => {
    async function fetchSiteDetails() {
      const response = await getSiteByIdAction(companyId)
      if (response.success && response.data) {
        setSiteData(response.data)
      }
    }
    fetchSiteDetails()
  }, [companyId])

  // Fetch employees
  const fetchEmployees = useCallback(async (page: number, limit: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getEmployeesAction(companyId, { page, limit })

      if (response.success && response.data) {
        const employeesData = Array.isArray(response.data) ? response.data : []
        setEmployees(employeesData)

        // Get pagination from response
        const paginationData = (response as { pagination?: Pagination }).pagination
        if (paginationData) {
          setPagination(paginationData)
        } else {
          setPagination({ total: employeesData.length, page, limit })
        }
      } else {
        setError(response.message || "Failed to fetch employees")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error fetching employees:", err)
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
    }
  }, [companyId])

  useEffect(() => {
    fetchEmployees(currentPage, limit)
  }, [currentPage, limit, fetchEmployees])

  const handleEmployeeClick = (employeeId: number) => {
    router.push(`/company/${companyId}/employees/${employeeId}`)
  }

  const handleBackClick = () => {
    router.push("/")
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    params.set("limit", limit.toString())
    router.push(`/company/${companyId}/employees?${params.toString()}`, { scroll: false })
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  // Client-side search filtering
  const filteredData = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.pin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employee_code && emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [employees, searchTerm])

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="w-4 h-4" />
          </div>
        ),
        cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue("name")}</span>,
      },
      {
        accessorKey: "pin",
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PIN
            <ArrowUpDown className="w-4 h-4" />
          </div>
        ),
        cell: ({ row }) => <span className="text-muted-foreground font-mono">{row.getValue("pin")}</span>,
      },
      {
        accessorKey: "employee_code",
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Employee Code
            <ArrowUpDown className="w-4 h-4" />
          </div>
        ),
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("employee_code") || "—"}</span>,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("phone") || "—"}</span>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="w-4 h-4" />
          </div>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string
          return (
            <Badge className={statusColors[status] || statusColors["Inactive"]}>
              {status}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleEmployeeClick(row.original.employee_id)
              }}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [companyId, router]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Counts
  const activeCount = employees.filter((e) => e.status === "Active").length
  const inactiveCount = employees.filter((e) => e.status !== "Active").length

  if (isInitialLoad) {
    return <EmployeeListSkeleton />
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Loading overlay for pagination */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 border shadow-lg rounded-xl px-6 py-4 flex items-center gap-3 pointer-events-auto">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">Loading employees...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {siteData?.name || "Employees"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {siteData?.site_code ? `${siteData.site_code} • ` : ""}
                {pagination.total} employee{pagination.total !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error State */}
        {error && !isLoading && employees.length === 0 && (
          <Card className="p-12 text-center mb-8">
            <h3 className="text-lg font-medium text-destructive">Error</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
            <Button className="mt-4" onClick={() => fetchEmployees(currentPage, limit)}>
              Try Again
            </Button>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{pagination.total}</p>
                </div>
                <Users className="w-8 h-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">{inactiveCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, PIN, employee code, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Employees Table */}
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
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-muted/50">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleEmployeeClick(row.original.employee_id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(cell.column.id === "actions" && "text-right")}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                        {searchTerm
                          ? "No employees found matching your search"
                          : "No employees found for this company"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {totalPages} • {pagination.total} total employees
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isLoading}
                        className="min-w-[36px]"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
