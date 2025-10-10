'use client';
import { LawyerCard } from "./lawyer-card"
import { ListControls } from "./list-controls"
import type { Lawyer } from "app/types/lawyer"

interface LawyersListProps {
  lawyers: Lawyer[]
}

export function LawyersList({ lawyers }: LawyersListProps) {

  return (
    <div className="space-y-6">
      <ListControls totalItems={lawyers.length} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lawyers.slice(0, 6).map((lawyer) => (
          <div key={lawyer.id} className="relative">
            <LawyerCard lawyer={lawyer} />
          </div>
        ))}
      </div>
    </div>
  )
}
