
export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled"

export type Booking = {
  id: string
  studioId: string
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  createdAt: string
}
