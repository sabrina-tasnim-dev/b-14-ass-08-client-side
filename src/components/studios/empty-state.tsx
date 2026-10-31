import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center sm:py-20">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold text-foreground">
          No studios match your filters
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try adjusting your search or price range, or clear the filters to
          browse every available studio.
        </p>
      </div>
      <Button variant="outline" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  )
}
