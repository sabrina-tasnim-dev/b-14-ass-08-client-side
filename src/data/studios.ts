
import type { Studio, StudioCategory } from "@/types/studio"

export const studioCategories: StudioCategory[] = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
]


const images = [
  "https://images.openai.com/static-rsc-4/icbEN3Fr1PkNHgBErBUkzddq90MnqQDVi15ze1FBVa-f9HsBe4VxMqo28fCZdsC-L71g7kVTp3eLzTu9mJEozhVizpTyIRS9GoQ4KQMsR5xvoluv1GLBOPIISite3m4OOQqfKEtFnuJe3Kem7zUvXtgl2H_d3jucT5XdMdxeP2ykMLts6VZ7ZmJq6NGOyubZ?purpose=fullsize",

  "https://images.openai.com/static-rsc-4/uTvDP6EFL1Y8bb5_jOkK0WrKpUUcuwRZxLQMnm-rrYgZ3So6lVZLl7DhV2I3Rg0E6ZeYDh8LyrDQjPMsduuBsN8wUgPv4CRxeU7w0v5QYIgPVHQzXaqnzBbtQdepjYmsm2ERKfwJQmyKF584yo-hrDn57NA40qnzqnJlm4WVu8POsREZ-EcpxHvmtDY97lzB?purpose=fullsize",

  "https://images.openai.com/static-rsc-4/9FtWIac0agrswsjkfY5bAfVDSMm1aOBRSht59JC40Oo4ua9vosBW1MeJwjf_X26fdjMOFj-jdVQW6Uun7ReEmHDJpWAKsnNnz5R_UTvAzbRy0ibAxWjpMyU7rqbXYYEmLUNap2rfYEpYI65GX4LMga_ALh66KY6_wyu2s8OzmnDCM5SKFQO3RJ5sDxyk7YA2?purpose=fullsize",
]


export const studios: Studio[] = [
  {
    id: "6710b1e4f3a2c8e9d1234501",
    title: "Loft Photo Studio",
    category: "Photo Studios",
    location: "Brooklyn, NY",
    hourlyRate: 85,
    rating: 4.9,
    image: images[0],
    createdAt: "2026-08-12",
    overview:
      "A beautiful photography space with natural lighting and a professional setup for creative photoshoots.",
    securityDeposit: 100,
    maxCapacity: 12,
    amenities: [
      "Natural Lighting",
      "Backdrops",
      "Changing Room",
      "Makeup Station",
      "Air Conditioning",
    ],
    gallery: [images[0], images[1], images[2], "/images/st-1.avif"],
    host: {
      name: "Alex Morgan",
      role: "Professional Studio Host",
      avatar: "/images/st-1.avif",
      joinedAt: "January 2025",
    },
    reviews: [
      {
        id: "review-1",
        name: "Sarah Wilson",
        rating: 5,
        date: "September 2026",
        comment:
          "Beautiful studio with excellent lighting. Everything was well organized.",
      },
    ],
  },

  {
    id: "6710b1e4f3a2c8e9d1234502",
    title: "Sound Stage 7",
    category: "Sound Stages",
    location: "Queens, NY",
    hourlyRate: 150,
    rating: 4.8,
    image: images[1],
    createdAt: "2026-07-30",
    overview:
      "A spacious production stage suitable for video production, commercial shoots, and creative projects.",
    securityDeposit: 200,
    maxCapacity: 25,
    amenities: [
      "Soundproof",
      "Studio Lighting",
      "Green Screen",
      "Production Equipment",
      "Air Conditioning",
    ],
    gallery: [images[1], images[0], "/images/st-2.avif", "/images/st-3.avif"],
    host: {
      name: "Daniel Brooks",
      role: "Production Studio Host",
      avatar: "/images/st-2.avif",
      joinedAt: "March 2025",
    },
    reviews: [
      {
        id: "review-2",
        name: "Michael Scott",
        rating: 5,
        date: "August 2026",
        comment:
          "Great production space with plenty of room and useful equipment.",
      },
    ],
  },

  {
    id: "6710b1e4f3a2c8e9d1234503",
    title: "Echo Podcast Room",
    category: "Podcast Rooms",
    location: "Manhattan, NY",
    hourlyRate: 45,
    rating: 4.9,
    image: images[2],
    createdAt: "2026-09-02",
    overview:
      "A comfortable podcast recording room equipped with professional audio recording equipment.",
    securityDeposit: 50,
    maxCapacity: 6,
    amenities: [
      "Soundproof",
      "Podcast Microphones",
      "Audio Mixer",
      "Headphones",
      "Recording Equipment",
    ],
    gallery: [images[2], images[1], "/images/st-3.avif"],
    host: {
      name: "Emma Wilson",
      role: "Podcast Studio Host",
      avatar: "/images/st-3.avif",
      joinedAt: "February 2025",
    },
    reviews: [
      {
        id: "review-3",
        name: "James Miller",
        rating: 5,
        date: "October 2026",
        comment:
          "Perfect place for podcast recording. The audio setup was excellent.",
      },
    ],
  },

  {
    id: "6710b1e4f3a2c8e9d1234504",
    title: "Midnight Music Suite",
    category: "Music Suites",
    location: "Williamsburg, NY",
    hourlyRate: 65,
    rating: 4.7,
    image: "/images/st-1.avif",
    createdAt: "2026-06-18",
    overview:
      "A creative music production space for musicians, composers, and audio producers.",
    securityDeposit: 75,
    maxCapacity: 8,
    amenities: [
      "Studio Monitors",
      "Audio Interface",
      "MIDI Keyboard",
      "Soundproof Room",
      "Recording Microphones",
    ],
    gallery: ["/images/st-1.avif", "/images/st-2.avif"],
    host: {
      name: "Ryan Carter",
      role: "Music Studio Host",
      avatar: "/images/st-1.avif",
      joinedAt: "April 2025",
    },
    reviews: [
      {
        id: "review-4",
        name: "Olivia Brown",
        rating: 5,
        date: "July 2026",
        comment:
          "A great music production environment with a comfortable setup.",
      },
    ],
  },

  {
    id: "6710b1e4f3a2c8e9d1234505",
    title: "Clay & Canvas Workshop",
    category: "Art Workshops",
    location: "SoHo, NY",
    hourlyRate: 55,
    rating: 4.8,
    image: "/images/st-2.avif",
    createdAt: "2026-05-25",
    overview:
      "An inspiring art workshop designed for painting, pottery, and hands-on creative activities.",
    securityDeposit: 60,
    maxCapacity: 15,
    amenities: [
      "Work Tables",
      "Art Supplies",
      "Pottery Equipment",
      "Storage Space",
      "Natural Lighting",
    ],
    gallery: [],
    host: {
      name: "Sophia Adams",
      role: "Art Workshop Host",
      avatar: "/images/st-2.avif",
      joinedAt: "May 2025",
    },
    reviews: [
      {
        id: "review-5",
        name: "Liam Davis",
        rating: 5,
        date: "June 2026",
        comment:
          "A lovely creative space with everything needed for an art session.",
      },
    ],
  },

  {
    id: "6710b1e4f3a2c8e9d1234506",
    title: "Daylight Studio A",
    category: "Photo Studios",
    location: "Chelsea, NY",
    hourlyRate: 95,
    rating: 5,
    image: "/images/st-3.avif",
    createdAt: "2026-09-14",
    overview:
      "A bright photography studio with large windows and a clean, minimal creative environment.",
    securityDeposit: 120,
    maxCapacity: 10,
    amenities: [
      "Large Windows",
      "Natural Lighting",
      "Backdrops",
      "Changing Room",
      "Makeup Station",
    ],
    gallery: [
      "/images/st-3.avif",
      "/images/st-1.avif",
      "/images/st-2.avif",
      images[0],
    ],
    host: {
      name: "Noah Taylor",
      role: "Photography Studio Host",
      avatar: "/images/st-3.avif",
      joinedAt: "June 2025",
    },
    reviews: [
      {
        id: "review-6",
        name: "Ava Johnson",
        rating: 5,
        date: "October 2026",
        comment:
          "Amazing natural light and a beautiful space for photography.",
      },
    ],
  },
]
