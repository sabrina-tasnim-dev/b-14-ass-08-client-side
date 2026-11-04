import type { Metadata } from "next"

import { MyStudioListings } from "@/components/studios/my-studio-listings"

export const metadata: Metadata = {
  title: "My Studio Listings | StudioSpace",
  description: "View and manage the creative spaces you list on StudioSpace.",
}

export default function MyListingsPage() {
  return <MyStudioListings />
}
