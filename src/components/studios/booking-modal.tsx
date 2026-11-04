
"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CalendarDays, Clock, X } from "lucide-react"
import type { Studio } from "@/types/studio"

export default function BookingModal({ studio }: { studio: Studio }) {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [message, setMessage] = useState("")

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        setMessage("")
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const start = startTime
    ? startTime.split(":").reduce(
        (total, value) => total * 60 + Number(value),
        0
      )
    : 0

  const end = endTime
    ? endTime.split(":").reduce(
        (total, value) => total * 60 + Number(value),
        0
      )
    : 0

  const totalHours =
    startTime && endTime && end > start
      ? (end - start) / 60
      : 0

  const totalPrice = totalHours * studio.hourlyRate

  const handleBooking = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setMessage(
      "Your booking details are ready! Booking submission will be available soon."
    )
  }

  const closeModal = () => {
    setIsOpen(false)
    setMessage("")
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
      >
        Book This Studio
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="my-auto w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 id="booking-title" className="text-xl font-semibold">
                  Book Your Studio
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {studio.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close booking modal"
                className="rounded-md p-2 hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              <div>
                <label htmlFor="booking-date" className="mb-2 block text-sm font-medium">
                  Booking Date
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="booking-date"
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value)
                      setMessage("")
                    }}
                    required
                    className="w-full rounded-md border border-input bg-background py-3 pl-10 pr-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="start-time" className="mb-2 block text-sm font-medium">
                    Start Time
                  </label>

                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value)
                        setMessage("")
                      }}
                      required
                      className="w-full rounded-md border border-input bg-background py-3 pl-10 pr-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="end-time" className="mb-2 block text-sm font-medium">
                    End Time
                  </label>

                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value)
                        setMessage("")
                      }}
                      required
                      className="w-full rounded-md border border-input bg-background py-3 pl-10 pr-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {startTime && endTime && end <= start && (
                <p className="text-sm text-destructive">
                  End time must be later than start time.
                </p>
              )}

              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${studio.hourlyRate} × {totalHours} hours
                  </span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                  <span>Estimated Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Security deposit: ${studio.securityDeposit ?? 0}
                </p>
              </div>

              {message && (
                <p role="status" className="rounded-md bg-muted p-3 text-sm">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={!date || !totalHours}
                className="w-full rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
