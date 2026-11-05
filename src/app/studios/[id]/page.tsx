
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  ShieldCheck,
  Check,
} from "lucide-react"

import BookingModal from "@/components/studios/booking-modal"
import { EditStudioDialog } from "@/components/studios/edit-studio-dialog"
import { StudioGallery } from "@/components/studios/studio-gallery"
import type { Studio } from "@/types/studio"

type StudioDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function StudioDetailsPage({
  params,
}: StudioDetailsPageProps) {
  const { id } = await params

  const res=await fetch(`http://localhost:5000/studio/${id}`)
    if (!res.ok) {
    notFound()
  }

  const data = (await res.json()) as Omit<Studio, "id"> & {
    id?: string
    _id?: string
  }

  const studio: Studio = {
    ...data,
    id: data.id ?? data._id ?? id,
  }

if (!studio) {
  notFound()
}

  // Show 404 if studio doesn't exist

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Link
          href="/studios"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Studios
        </Link>

        {/* Studio Heading */}
        <div className="mb-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {studio.category}
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {studio.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {studio.location}
                </span>

                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-current" />
                  {studio.rating} Rating
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold">
                ${studio.hourlyRate}
                <span className="text-sm font-normal text-muted-foreground">
                  / hour
                </span>
              </p>

              <div className="mt-4 flex sm:justify-end">
                <EditStudioDialog studio={studio} />
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <StudioGallery key={studio.id} studio={studio} />

        {/* Main Content */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* Left Content */}
          <div className="space-y-10 lg:col-span-2">

            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold">
                About This Studio
              </h2>

              <p className="mt-4 leading-7 text-muted-foreground">
                {studio.overview ||
                  "This creative space is designed to support your next project."}
              </p>
            </section>

            <div className="border-t border-border" />

            {/* Studio Information */}
            <section>
              <h2 className="text-xl font-semibold">
                Studio Information
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Maximum Capacity
                    </p>
                    <p className="font-medium">
                      {studio.maxCapacity ?? "N/A"} People
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Security Deposit
                    </p>
                    <p className="font-medium">
                      ${studio.securityDeposit ?? 0}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            <div className="border-t border-border" />

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-semibold">
                What This Studio Offers
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(studio.amenities ?? []).map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="size-4 shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>

              {(!studio.amenities || studio.amenities.length === 0) && (
                <p className="mt-3 text-sm text-muted-foreground">
                  No amenities listed yet.
                </p>
              )}
            </section>

            <div className="border-t border-border" />

            {/* Host Information */}
            <section>
              <h2 className="text-xl font-semibold">
                Meet Your Host
              </h2>

              {studio.host ? (
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                    {studio.host.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {studio.host.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {studio.host.role}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Joined {studio.host.joinedAt}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Host information is not available.
                </p>
              )}
            </section>

            <div className="border-t border-border" />

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-current" />
                <h2 className="text-xl font-semibold">
                  Guest Reviews
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({studio.reviews?.length ?? 0})
                </span>
              </div>

              <div className="mt-5 space-y-6">
                {studio.reviews?.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium">
                        {review.name}
                      </h3>

                      <div className="flex items-center gap-1 text-sm">
                        <Star className="size-4 fill-current" />
                        {review.rating}
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {review.date}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}

                {(!studio.reviews || studio.reviews.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Booking Card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">

              <p className="text-2xl font-bold">
                ${studio.hourlyRate}
                <span className="text-sm font-normal text-muted-foreground">
                  / hour
                </span>
              </p>

              <div className="my-5 border-t border-border" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Hourly Rate
                  </span>
                  <span>${studio.hourlyRate}</span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Security Deposit
                  </span>
                  <span>${studio.securityDeposit ?? 0}</span>
                </div>
              </div>

              <div className="my-5 border-t border-border" />

              <BookingModal studio={studio} />

              <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                You can review your booking details before continuing.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
