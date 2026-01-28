import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationBarProps {
  totalRecords: number
  showingStart: number
  showingEnd: number
  summary: {
    complete: number
    issues: number
    absent: number
  }
}

export function PaginationBar({ totalRecords, showingStart, showingEnd, summary }: PaginationBarProps) {
  return (
    <div className="bg-white border-t border-gray-200 px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
      <div className="text-sm text-gray-600 font-medium">
        Showing {showingStart}-{showingEnd} of {totalRecords} employees
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
          <span className="font-medium text-gray-700">{summary.complete} Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span className="font-medium text-gray-700">{summary.issues} Issues</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span className="font-medium text-gray-700">{summary.absent} Absent</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm font-medium text-gray-700 px-2">Page 1 of 5</span>
        <Button variant="outline" size="sm">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
