import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className,
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


interface StandardPaginationProps {
  currentPage: number
  totalPages: number
  total?: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  limit?: number
  limitOptions?: number[]
  isLoading?: boolean
  className?: string
}

const pageSizeGenerator = (dataLength: number) => {
  if (dataLength <= 0) return [10];
  const pageSizeArray = [];
  const step = 10;
  const maxLimit = 100;
  let currentSize = step;

  while (currentSize <= dataLength && currentSize <= maxLimit) {
    pageSizeArray.push(currentSize);
    currentSize += step;
  }

  if (pageSizeArray.length === 0 || (pageSizeArray[pageSizeArray.length - 1] < dataLength && pageSizeArray[pageSizeArray.length - 1] < maxLimit)) {
    pageSizeArray.push(Math.min(currentSize, maxLimit));
  }

  return [...new Set(pageSizeArray)].sort((a, b) => a - b);
};

export function StandardPagination({
  currentPage,
  totalPages,
  total = 0,
  onPageChange,
  onLimitChange,
  limit,
  limitOptions,
  isLoading = false,
  className,
}: StandardPaginationProps) {
  if (totalPages === 0 && !onLimitChange) return null

  const resolvedLimitOptions = React.useMemo(() => {
    if (limitOptions) return limitOptions;
    if (total > 0) return pageSizeGenerator(total);
    return [10, 20, 50, 100];
  }, [limitOptions, total]);

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault()
    if (page !== currentPage && !isLoading && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("ellipsis")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis")
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {onLimitChange && limit !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              {resolvedLimitOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => handlePageClick(e, currentPage - 1)}
                aria-disabled={currentPage <= 1 || isLoading}
                className={cn(
                  currentPage <= 1 || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"
                )}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => handlePageClick(e, page as number)}
                    className={cn(isLoading && "pointer-events-none opacity-50", "cursor-pointer")}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => handlePageClick(e, currentPage + 1)}
                aria-disabled={currentPage >= totalPages || isLoading}
                className={cn(
                  currentPage >= totalPages || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
