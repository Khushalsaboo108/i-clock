import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
