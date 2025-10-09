'use client';
import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "app/components/ui/button"
import { LawyerCard } from "./lawyer-card"
import type { Lawyer } from "app/types/lawyer"

const LAWYERS_PER_PAGE = 2

interface LawyersListProps {
  lawyers: Lawyer[]
}

export function LawyersList({ lawyers }: LawyersListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(lawyers.length / LAWYERS_PER_PAGE)
  const startIndex = (currentPage - 1) * LAWYERS_PER_PAGE
  const currentLawyers = lawyers.slice(startIndex, startIndex + LAWYERS_PER_PAGE)

  if (lawyers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No lawyers found matching your criteria. Try adjusting your search.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {currentLawyers.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
