"use client"

import { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { studios, studioCategories } from "@/data/studios"
import { Section, SectionHeading } from "@/components/home/section"
import {
  CATEGORY_ALL,
  defaultFilters,
  StudioFilters,
  type Filters,
  type SortOption,
} from "@/components/studios/studio-filters"
import { StudioGrid } from "@/components/studios/studio-grid"
import { EmptyState } from "@/components/studios/empty-state"

function normalizeCategory(value: string | null): string {
  if (value && (studioCategories as string[]).includes(value)) return value
  return CATEGORY_ALL
}

function matchesQuery(studio: (typeof studios)[number], query: string) {
  if (!query) return true
  const needle = query.trim().toLowerCase()
  return (
    studio.title.toLowerCase().includes(needle) ||
    studio.location.toLowerCase().includes(needle)
  )
}

function matchesPrice(hourlyRate: number, maxPrice: string) {
  if (maxPrice === "any") return true
  return hourlyRate <= Number(maxPrice)
}

function sortStudios(list: (typeof studios)[number][], sort: SortOption) {
  const sorted = [...list]
  switch (sort) {
    case "top-rated":
      return sorted.sort((a, b) => b.rating - a.rating)
    case "price-asc":
      return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate)
    case "price-desc":
      return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate)
    case "newest":
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

function StudiosBrowser() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialCategory = normalizeCategory(searchParams.get("category"))
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    category: initialCategory,
  })

  const updateFilters = (update: Partial<Filters>) => {
    setFilters((current) => {
      const next = { ...current, ...update }
      if ("category" in update) {
        const params = new URLSearchParams(searchParams.toString())
        if (next.category === CATEGORY_ALL) {
          params.delete("category")
        } else {
          params.set("category", next.category)
        }
        const query = params.toString()
        router.replace(query ? `/studios?${query}` : "/studios", {
          scroll: false,
        })
      }
      return next
    })
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    router.replace("/studios", { scroll: false })
  }

  const filteredStudios = useMemo(() => {
    const result = studios.filter(
      (studio) =>
        matchesQuery(studio, filters.query) &&
        (filters.category === CATEGORY_ALL ||
          studio.category === filters.category) &&
        matchesPrice(studio.hourlyRate, filters.maxPrice)
    )
    return sortStudios(result, filters.sort)
  }, [filters])

  const hasActiveFilters =
    filters.query !== "" ||
    filters.category !== CATEGORY_ALL ||
    filters.maxPrice !== "any" ||
    filters.sort !== defaultFilters.sort

  return (
    <main className="flex-1">
      <div className="border-b border-border bg-card">
        <Section className="py-12 sm:py-16">
          <SectionHeading
            title="Explore Creative Spaces"
            description="Discover studios for photo shoots, recordings, podcasts, music and art — search, filter and book by the hour."
          />
          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            {filteredStudios.length}{" "}
            {filteredStudios.length === 1 ? "studio" : "studios"} available
          </p>
        </Section>
      </div>

      <Section>
        <div className="flex flex-col gap-6">
          <StudioFilters
            filters={filters}
            onChange={updateFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {filteredStudios.length > 0 ? (
            <StudioGrid studios={filteredStudios} />
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>
      </Section>
    </main>
  )
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1" aria-busy="true" aria-label="Loading studios" />
      }
    >
      <StudiosBrowser />
    </Suspense>
  )
}
