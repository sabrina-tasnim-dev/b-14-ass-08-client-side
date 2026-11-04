
export type StudioCategory =
  | "Photo Studios"
  | "Sound Stages"
  | "Podcast Rooms"
  | "Music Suites"
  | "Art Workshops"

export type StudioHost = {
  name: string
  role: string
  avatar: string
  joinedAt: string
}

export type StudioReview = {
  id: string
  name: string
  rating: number
  date: string
  comment: string
}

export type Studio = {
  id: string
  title: string
  category: StudioCategory
  location: string
  hourlyRate: number
  rating: number
  image: string
  createdAt: string
  overview?: string
  securityDeposit?: number
  maxCapacity?: number
  amenities?: string[]
  gallery?: string[]
  host?: StudioHost
  reviews?: StudioReview[]
}
