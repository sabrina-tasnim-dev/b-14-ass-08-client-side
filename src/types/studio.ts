export type StudioCategory =
  | "Photo Studios"
  | "Sound Stages"
  | "Podcast Rooms"
  | "Music Suites"
  | "Art Workshops"

export type Studio = {
  id: string
  title: string
  category: StudioCategory
  location: string
  hourlyRate: number
  rating: number
  image: string
  createdAt: string
}
