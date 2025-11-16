"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  paginate: (pageNumber: number) => void
}

export default function BlogPagination({ currentPage, totalPages, paginate }: BlogPaginationProps) {
  return (
    <nav aria-label="Blog pagination" className="flex justify-center items-center gap-2 my-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="icon"
            onClick={() => paginate(number)}
            className="w-8 h-8"
            aria-label={`Page ${number}`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            {number}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  )
}

