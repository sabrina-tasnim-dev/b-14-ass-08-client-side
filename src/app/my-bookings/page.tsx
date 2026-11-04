import type { Metadata } from "next"

import { MyBookings } from "@/components/bookings/my-bookings"

export const metadata: Metadata = {
  title: "My Bookings | StudioSpace",
  description: "View and manage your studio bookings on StudioSpace.",
}

export default function MyBookingsPage() {
  return <MyBookings />
}
