import type { Studio } from "@/types/studio"
import { StudioCard } from "@/components/studios/studio-card"

export function StudioGrid({ studios }: { studios: Studio[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
        <StudioCard key={studio.id} studio={studio} />
      ))}
    </div>
  )
}
