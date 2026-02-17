"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ChevronRight, Plus, ChevronLeft, Loader2, Users, Layers, Hash, Settings2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getSitesAction, deleteSiteAction, type Site } from "@/lib/actions"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


interface Pagination {
  total: number
  page: number
  limit: number
}

export function CompanySkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 pb-5">
          <Skeleton className="w-8 h-8 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CompanySelectionScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sites, setSites] = useState<Site[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 6,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Get page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "6", 10)

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

        // Scroll to top after data is fetched (only for pagination, not initial load)
        if (!isInitialLoad) {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      } else {
        setError(response.message || "Failed to fetch sites")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Error fetching sites:", err)
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
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
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  const handleAddCompany = () => {
    router.push("/company/new")
  }

  const handleDeleteSite = async () => {
    if (!siteToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteSiteAction(siteToDelete.site_id)
      if (result.success) {
        toast.success("Company deleted successfully")
        setSites(sites.filter(s => s.site_id !== siteToDelete.site_id))
        setSiteToDelete(null)
      } else {
        toast.error(result.message || "Failed to delete company")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Show skeleton on initial page load
  if (isInitialLoad) {
    return <CompanySkeleton />
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Centralized Loading Overlay for pagination — content stays visible behind */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 border shadow-lg rounded-xl px-6 py-4 flex items-center gap-3 pointer-events-auto">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">Loading sites...</span>
          </div>
        </div>
      )}

      {/* Error Overlay — also centralized */}
      {error && !isLoading && sites.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
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
      )}

      {/* Main Content — always rendered */}
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
              {sites.length > 0
                ? `Showing ${sites.length} of ${pagination.total} companies`
                : "No companies loaded yet"}
            </p>
          </div>
          <Button className="gap-2" onClick={handleAddCompany}>
            <Plus className="w-4 h-4" />
            Add Company
          </Button>
        </div>

        {/* Companies Grid */}
        {sites.length === 0 && !isLoading ? (
          <Card className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No companies found</h3>
            <p className="text-muted-foreground mt-2">Get started by creating your first company.</p>
            <div className="mt-4">
              <Button className="gap-2" onClick={handleAddCompany}>
                <Plus className="w-4 h-4" />
                Add Company
              </Button>
            </div>
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
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Hash className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground font-medium">Site ID</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {site.site_id}
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground font-medium">Employees</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {site.employee_count ?? 0}
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Layers className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground font-medium">Depts</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {site.department_count ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent group-hover:border-primary/50 transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectCompany(site.site_id)
                      }}
                    >
                      Manage Employees
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent hover:text-primary transition-all"
                      title="Edit Company Details"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/company/${site.site_id}/edit`)
                      }}
                    >
                      <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent hover:text-destructive transition-all"
                      title="Delete Company"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSiteToDelete(site)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!siteToDelete} onOpenChange={(open) => !open && setSiteToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                <strong>{siteToDelete?.name}</strong> and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setSiteToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault()
                  handleDeleteSite()
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Company"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {pagination.page > 1 ? (
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(pagination.page - 1)
                      }}
                    />
                  ) : (
                    <PaginationPrevious className="pointer-events-none opacity-50" />
                  )}
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Basic logic to show current, first, last, and window around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === pagination.page}
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }

                  if (
                    (page === 2 && pagination.page > 3) ||
                    (page === totalPages - 1 && pagination.page < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return null
                })}

                <PaginationItem>
                  {pagination.page < totalPages ? (
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(pagination.page + 1)
                      }}
                    />
                  ) : (
                    <PaginationNext className="pointer-events-none opacity-50" />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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
