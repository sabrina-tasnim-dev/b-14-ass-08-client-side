"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { studios, studioCategories } from "@/data/studios";
import type { Studio } from "@/types/studio";
import { Section, SectionHeading } from "@/components/home/section";
import { EmptyState } from "@/components/studios/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ListingStatus = "Active" | "Pending";
type SortOrder = "newest" | "oldest";

const CATEGORY_ALL = "all";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const STATUS_BY_ID: Record<string, ListingStatus> = {
  "6710b1e4f3a2c8e9d1234501": "Active",
  "6710b1e4f3a2c8e9d1234502": "Active",
  "6710b1e4f3a2c8e9d1234503": "Active",
  "6710b1e4f3a2c8e9d1234504": "Pending",
  "6710b1e4f3a2c8e9d1234505": "Active",
  "6710b1e4f3a2c8e9d1234506": "Pending",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function statusFor(studio: Studio): ListingStatus {
  return STATUS_BY_ID[studio.id] ?? "Pending";
}

function formatListedDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  const monthIndex = Number(month) - 1;
  if (!year || !day || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) {
    return isoDate;
  }
  return `${MONTHS[monthIndex]} ${Number(day)}, ${year}`;
}

function ListingCard({
  studio,
  onDelete,
}: {
  studio: Studio;
  onDelete: (studio: Studio) => void;
}) {
  const status = statusFor(studio);

  return (
    <Card className="gap-0 p-0 sm:flex-row">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-auto sm:size-44 lg:size-52">
        <Image
          src={studio.image}
          alt={studio.title}
          fill
          sizes="(min-width: 1024px) 208px, (min-width: 640px) 176px, 100vw"
          className="object-cover"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <CardTitle className="truncate">{studio.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {studio.location}
              </span>
              <Badge variant="outline">{studio.category}</Badge>
            </div>
          </div>
          <Badge variant={status === "Active" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">
              ${studio.hourlyRate}
            </span>
            /hour
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-foreground text-foreground" />
            {studio.rating}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Listed {formatListedDate(studio.createdAt)}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Link
            href={`/studios/${studio.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Eye />
            View Details
          </Link>
          <Link
            href={`/studios/edit/${studio.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Pencil />
            Edit
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="sm:ml-auto"
            onClick={() => onDelete(studio)}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function MyStudioListings() {
  const [listings, setListings] = useState<Studio[]>(studios);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(CATEGORY_ALL);
  const [sort, setSort] = useState<SortOrder>("newest");
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);

  const visibleListings = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = listings.filter((studio) => {
      const matchesQuery =
        !needle || studio.title.toLowerCase().includes(needle);
      const matchesCategory =
        category === CATEGORY_ALL || studio.category === category;
      return matchesQuery && matchesCategory;
    });

    return filtered.sort((a, b) =>
      sort === "newest"
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt),
    );
  }, [listings, query, category, sort]);

  const hasActiveFilters =
    query.trim() !== "" || category !== CATEGORY_ALL || sort !== "newest";

  const clearFilters = () => {
    setQuery("");
    setCategory(CATEGORY_ALL);
    setSort("newest");
  };

  const handleConfirmDelete = () => {
    if (!studioToDelete) return;

    const deletedTitle = studioToDelete.title;
    setListings((current) =>
      current.filter((item) => item.id !== studioToDelete.id),
    );
    toast.success(`"${deletedTitle}" removed from your listings`, {
      description:
        "Local demo only — your studio was removed from this page's state, not from any database.",
    });
    setStudioToDelete(null);
  };

  return (
    <main className="flex-1">
      <div className="border-b border-border bg-card">
        <Section className="py-12 sm:py-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <SectionHeading
                title="My Studio Listings"
                description="View and manage your creative spaces — check listing statuses, update details and keep every space ready for bookings."
              />
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {listings.length}{" "}
                {listings.length === 1 ? "listing" : "listings"} total
              </p>
            </div>
            <Link href="/add-studio" className={buttonVariants({ size: "lg" })}>
              <Plus />
              Add New Studio
            </Link>
          </div>
        </Section>
      </div>

      <Section>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:gap-4 sm:p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by studio title"
                aria-label="Search listings by studio title"
                className="h-9 pl-9"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Category
                </span>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as string)}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-label="Filter listings by category"
                  >
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
                    {studioCategories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
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
                  value={sort}
                  onValueChange={(value) => setSort(value as SortOrder)}
                >
                  <SelectTrigger className="w-full" aria-label="Sort listings">
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

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Reset
                </span>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="h-8 w-full"
                >
                  <X />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing {visibleListings.length} of {listings.length}{" "}
            {listings.length === 1 ? "listing" : "listings"}
          </p>

          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center sm:py-20">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Building2 className="size-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-base font-semibold text-foreground">
                  No studios listed yet
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  You have not added any creative spaces. Create your first
                  listing to start welcoming creators.
                </p>
              </div>
              <Link href="/add-studio" className={buttonVariants()}>
                <Plus />
                Add New Studio
              </Link>
            </div>
          ) : visibleListings.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <div className="flex flex-col gap-4">
              {visibleListings.map((studio) => (
                <ListingCard
                  key={studio.id}
                  studio={studio}
                  onDelete={setStudioToDelete}
                />
              ))}
            </div>
          )}
        </div>
      </Section>

      <ConfirmDialog
        open={studioToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setStudioToDelete(null);
        }}
        title={
          studioToDelete
            ? `Delete "${studioToDelete.title}"?`
            : "Delete listing?"
        }
        description="This removes the listing from your local demo view only. No database record will be deleted."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        icon={<Trash2 />}
      />
    </main>
  );
}
