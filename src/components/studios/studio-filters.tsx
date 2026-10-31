"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { studioCategories } from "@/data/studios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SortOption = "newest" | "top-rated" | "price-asc" | "price-desc"

export type Filters = {
  query: string
  category: string
  maxPrice: string
  sort: SortOption
}

export const PRICE_OPTIONS = [
  { value: "any", label: "Any Price" },
  { value: "50", label: "Under $50" },
  { value: "100", label: "Under $100" },
  { value: "150", label: "Under $150" },
  { value: "200", label: "Under $200" },
] as const

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "top-rated", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const

export const CATEGORY_ALL = "all"

export const defaultFilters: Filters = {
  query: "",
  category: CATEGORY_ALL,
  maxPrice: "any",
  sort: "newest",
}

export function StudioFilters({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
}: {
  filters: Filters
  onChange: (update: Partial<Filters>) => void
  onClear: () => void
  hasActiveFilters: boolean
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:gap-4 sm:p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Search by title or location"
          aria-label="Search studios by title or location"
          className="h-9 pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Category
          </span>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              onChange({ category: value as string })
            }
          >
            <SelectTrigger className="w-full" aria-label="Filter by category">
              <SelectValue>
                {(value) =>
                  value === CATEGORY_ALL
                    ? "All Categories"
                    : String(value)
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CATEGORY_ALL}>All Categories</SelectItem>
              {studioCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Hourly Price
          </span>
          <Select
            value={filters.maxPrice}
            onValueChange={(value) =>
              onChange({ maxPrice: value as string })
            }
          >
            <SelectTrigger className="w-full" aria-label="Filter by hourly price">
              <SelectValue>
                {(value) =>
                  PRICE_OPTIONS.find((option) => option.value === value)
                    ?.label ?? "Any Price"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PRICE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Sort By
          </span>
          <Select
            value={filters.sort}
            onValueChange={(value) =>
              onChange({ sort: value as SortOption })
            }
          >
            <SelectTrigger className="w-full" aria-label="Sort studios">
              <SelectValue>
                {(value) =>
                  SORT_OPTIONS.find((option) => option.value === value)
                    ?.label ?? "Newest"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onClear}
            disabled={!hasActiveFilters}
            className="h-9 w-full"
          >
            <X />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
