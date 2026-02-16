"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Building2, ArrowLeft } from "lucide-react"

export function CompanyManagementSkeleton() {
  return (
    <div className="min-h-screen bg-muted/40 pb-20">
      {/* Header Skeleton */}
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <div className="flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <span>{">"}</span>
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary/50" />
                </div>
                <Skeleton className="h-8 w-64" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex gap-8">
          {/* Left Sidebar Preview Skeleton */}
          <aside className="w-80 flex-shrink-0 sticky top-32 h-fit">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                  <Building2 className="w-5 h-5 text-primary/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Form Skeleton */}
          <main className="flex-1">
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Tab Navigation Skeleton */}
              <div className="border-b border-border bg-muted/20">
                <nav className="flex gap-8 px-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="py-4 px-1">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </nav>
              </div>

              {/* Tab Content Skeleton */}
              <div className="p-8 min-h-[500px] space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
