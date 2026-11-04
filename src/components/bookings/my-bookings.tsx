"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarCheck,
  CalendarDays,
  CalendarX,
  CheckCheck,
  Clock,
  Eye,
  MapPin,
  Search,
  Timer,
  X,
 
} from "lucide-react"
import { toast } from "sonner"

import { studios } from "@/data/studios"
import { mockBookings } from "@/data/bookings"
import type { Booking, BookingStatus } from "@/types/booking"
import { Section, SectionHeading } from "@/components/home/section"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const

type StatusFilter = (typeof STATUS_FILTERS)[number]

const STATUS_BADGE: Record<
  BookingStatus,
  { variant: "default" | "secondary" | "outline"; className?: string }
> = {
  Pending: { variant: "secondary" },
  Confirmed: { variant: "default" },
  Completed: { variant: "outline" },
  Cancelled: {
    variant: "outline",
    className: "border-dashed text-muted-foreground",
  },
}

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
]

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-")
  const monthIndex = Number(month) - 1
  if (!year || !day || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) {
    return isoDate
  }
  return `${MONTHS[monthIndex]} ${Number(day)}, ${year}`
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0
  return hours * 60 + minutes
}

function bookingHours(booking: Booking): number {
  const total = toMinutes(booking.endTime) - toMinutes(booking.startTime)
  return total > 0 ? total / 60 : 0
}

function formatHours(hours: number): string {
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const badge = STATUS_BADGE[status]
  return (
    <Badge variant={badge.variant} className={badge.className}>
      {status}
    </Badge>
  )
}

function SummaryCard({
  label,
  count,
  icon: Icon,
}: {
  label: string
  count: number
  icon: typeof CalendarDays
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="rounded-lg bg-muted p-2.5">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  )
}

function BookingCard({
  booking,
  studio,
  onCancel,
}: {
  booking: Booking
  studio: (typeof studios)[number]
  onCancel: (booking: Booking) => void
}) {
  const hours = bookingHours(booking)
  const totalPrice = hours * studio.hourlyRate
  const canCancel = booking.status === "Pending"

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
          <StatusBadge status={booking.status} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatDate(booking.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {booking.startTime} – {booking.endTime}
          </span>
          <span className="flex items-center gap-1.5">
            <Timer className="size-3.5" />
            {formatHours(hours)} {hours === 1 ? "hour" : "hours"}
          </span>
        </div>

        <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">
              ${studio.hourlyRate} × {formatHours(hours)} hours
            </span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-3 border-t border-border pt-2 font-semibold">
            <span>Estimated Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          {typeof studio.securityDeposit === "number" && (
            <div className="flex justify-between gap-3 text-muted-foreground">
              <span>Security Deposit</span>
              <span>${studio.securityDeposit}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Link
            href={`/studios/${studio.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Eye />
            View Details
          </Link>
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              className="sm:ml-auto"
              onClick={() => onCancel(booking)}
            >
              <X />
              Cancel Booking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [filter, setFilter] = useState<StatusFilter>("All")
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null)

  const counts = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === "Pending")
        .length,
      confirmed: bookings.filter((booking) => booking.status === "Confirmed")
        .length,
      completed: bookings.filter((booking) => booking.status === "Completed")
        .length,
    }),
    [bookings],
  )

  const visibleBookings = useMemo(
    () =>
      bookings.filter(
        (booking) => filter === "All" || booking.status === filter,
      ),
    [bookings, filter],
  )

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return

    const cancelledId = bookingToCancel.id
    const studio = studios.find((item) => item.id === bookingToCancel.studioId)

    setBookings((current) =>
      current.map((booking) =>
        booking.id === cancelledId
          ? { ...booking, status: "Cancelled" as const }
          : booking,
      ),
    )

    toast.success("Booking cancelled", {
      description: studio
        ? `Your booking for "${studio.title}" has been cancelled.`
        : "Your booking has been cancelled.",
    })

    setBookingToCancel(null)
  }

  return (
    <main className="flex-1">
      <div className="border-b border-border bg-card">
        <Section className="py-12 sm:py-16">
          <SectionHeading
            title="My Bookings"
            description="Keep every session on track — review upcoming dates, check booking statuses and cancel any pending reservation you no longer need."
          />
          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            {counts.total} {counts.total === 1 ? "booking" : "bookings"} total
          </p>
        </Section>
      </div>

      <Section>
        <div className="flex flex-col gap-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <SummaryCard
              label="Total Bookings"
              count={counts.total}
              icon={CalendarCheck}
            />
            <SummaryCard
              label="Pending"
              count={counts.pending}
              icon={Clock}
            />
            <SummaryCard
              label="Confirmed"
              count={counts.confirmed}
              icon={CheckCheck}
            />
            <SummaryCard
              label="Completed"
              count={counts.completed}
              icon={CalendarDays}
            />
          </div>

          {/* Status filter */}
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter bookings by status"
          >
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={filter === status ? "default" : "outline"}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing {visibleBookings.length} of {bookings.length}{" "}
            {bookings.length === 1 ? "booking" : "bookings"}
          </p>

          {/* Booking list */}
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center sm:py-20">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <CalendarX className="size-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-base font-semibold text-foreground">
                  No bookings yet
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  You have not booked any studios. Explore creative spaces and
                  reserve your first session by the hour.
                </p>
              </div>
              <Link href="/studios" className={buttonVariants()}>
                <Search />
                Explore Studios
              </Link>
            </div>
          ) : visibleBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center sm:py-20">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <CalendarX className="size-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-base font-semibold text-foreground">
                  No {filter.toLowerCase()} bookings
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  You do not have any bookings with this status right now.
                </p>
              </div>
              <Button variant="outline" onClick={() => setFilter("All")}>
                Show All Bookings
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {visibleBookings.map((booking) => {
                const studio = studios.find(
                  (item) => item.id === booking.studioId,
                )
                if (!studio) return null

                return (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    studio={studio}
                    onCancel={setBookingToCancel}
                  />
                )
              })}
            </div>
          )}
        </div>
      </Section>

      <ConfirmDialog
        open={bookingToCancel !== null}
        onOpenChange={(open) => {
          if (!open) setBookingToCancel(null)
        }}
        title={
          bookingToCancel
            ? `Cancel booking for "${
                studios.find((item) => item.id === bookingToCancel.studioId)
                  ?.title ?? "this studio"
              }"?`
            : "Cancel booking?"
        }
        description="This marks the booking as cancelled in this local demo view only. No database record will be changed."
        confirmLabel="Cancel Booking"
        cancelLabel="Keep Booking"
        onConfirm={handleConfirmCancel}
        icon={<CalendarX />}
      />
    </main>
  )
}
