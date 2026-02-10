"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ChevronRight, Plus, ChevronLeft, Loader2 } from "lucide-react"
import { getSitesAction, type Site } from "@/lib/actions"

interface Pagination {
  total: number
  page: number
  limit: number
}

export function CompanySelectionScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sites, setSites] = useState<Site[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 3,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "3", 10)

  const fetchSites = useCallback(async (page: number, limit: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getSitesAction({ page, limit })

      if (response.success && response.data) {
        // Handle the API response - data is the array of sites
        const sitesData = Array.isArray(response.data) ? response.data : []
        setSites(sitesData)

        // Get pagination from response
        const paginationData = (response as { pagination?: Pagination }).pagination
        if (paginationData) {
          setPagination(paginationData)
        } else {
          setPagination({
            total: sitesData.length,
            page,
            limit,
          })
        }
      } else {
        setError(response.message || "Failed to fetch sites")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error fetching sites:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSites(currentPage, limit)
  }, [currentPage, limit, fetchSites])

  const handleSelectCompany = (siteId: number) => {
    router.push(`/company/${siteId}/employees`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    params.set("limit", limit.toString())
    router.push(`/?${params.toString()}`)
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading sites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => fetchSites(currentPage, limit)}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 pb-5">
          <Building2 />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Time & Attendance System</h1>
            <p className="text-sm text-muted-foreground">
              Select a company to manage employees and attendance
            </p>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Companies</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {sites.length} of {pagination.total} companies
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Company
          </Button>
        </div>

        {/* Companies Grid */}
        {sites.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No companies found</h3>
            <p className="text-muted-foreground mt-2">Get started by creating your first company.</p>
            <Button className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card
                key={site.site_id}
                className="group hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => handleSelectCompany(site.site_id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {site.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{site.site_code}</CardDescription>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium">Agrigistics</p>
                      <p className="text-lg font-bold text-foreground mt-1">
                        {site.agrigistics_site === "Yes" ? "✓ Active" : "✗ Inactive"}
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium">Attendance</p>
                      <p className="text-lg font-bold text-foreground mt-1">
                        {site.send_attendance === "Yes" ? "✓ Sending" : "✗ Disabled"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectCompany(site.site_id)
                    }}
                  >
                    Manage Employees
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Page Info */}
        {pagination.total > 0 && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Page {pagination.page} of {totalPages}
          </div>
        )}
      </div>
    </div>
  )
}
