import { StandardPagination } from "@/components/ui/pagination"

interface PaginationBarProps {
  totalRecords: number
  showingStart: number
  showingEnd: number
  summary: {
    complete: number
    issues: number
    absent: number
  }
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
}

export function PaginationBar({
  totalRecords,
  showingStart,
  showingEnd,
  summary,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => { },
  isLoading = false
}: PaginationBarProps) {
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
        <StandardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
