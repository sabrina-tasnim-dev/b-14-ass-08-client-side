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
  "https://images.openai.com/static-rsc-4/taYRWtGzAmkDWhNxeYV4QTm4NFTtyK41KdPC47THGYSiRhmUJB7hfNVJk1TXkQ-X7WyK-vB-9CtzN-Wv91T08FikF3Gd5uWAiETZYm-1sD-H2tZes50zP_E-o6ZlNY21nwmb0b0xPrPec39FIbeYrQnRERU6CbGIaaEgdLyyQnRZ3aFPRh5peUUoLi4QS5QB?purpose=fullsize",
  "https://images.openai.com/static-rsc-4/s4uJFEfbPJX6HJilEHXvzFL52IZVg8Gg79LC4sjoSXryWcCXlq8pyHrAgNSfu_UMeSITKOpi9PEwy6g76WBMqf3Qfng4EU_F4fF6zq82hsF6zFTLib9FH--m1oQX_PBP86zK9xeBj7HubXX8w6Y-QImwUBrx3QN9c2gujNuqvZP32cxCk5CRLd4VKBdP2yJ4?purpose=fullsize",
]

export const studios: Studio[] = [
  {
    id: "6710b1e4f3a2c8e9d1234501",
    title: "Loft Photo Studio",
    category: "Photo Studios",
    location: "Brooklyn, NY",
    hourlyRate: 85,
    rating: 4.9,
    image: "/images/st-1.avif",
    createdAt: "2026-08-12",
  },
  {
    id: "6710b1e4f3a2c8e9d1234502",
    title: "Sound Stage 7",
    category: "Sound Stages",
    location: "Queens, NY",
    hourlyRate: 150,
    rating: 4.8,
    image: "/images/st-2.avif",
    createdAt: "2026-07-30",
  },
  {
    id: "6710b1e4f3a2c8e9d1234503",
    title: "Echo Podcast Room",
    category: "Podcast Rooms",
    location: "Manhattan, NY",
    hourlyRate: 45,
    rating: 4.9,
    image: "/images/st-3.avif",
    createdAt: "2026-09-02",
  },
  {
    id: "6710b1e4f3a2c8e9d1234504",
    title: "Midnight Music Suite",
    category: "Music Suites",
    location: "Williamsburg, NY",
    hourlyRate: 65,
    rating: 4.7,
    image: images[0],
    createdAt: "2026-06-18",
  },
  {
    id: "6710b1e4f3a2c8e9d1234505",
    title: "Clay & Canvas Workshop",
    category: "Art Workshops",
    location: "SoHo, NY",
    hourlyRate: 55,
    rating: 4.8,
    image: images[1],
    createdAt: "2026-05-25",
  },
  {
    id: "6710b1e4f3a2c8e9d1234506",
    title: "Daylight Studio A",
    category: "Photo Studios",
    location: "Chelsea, NY",
    hourlyRate: 95,
    rating: 5,
    image: images[2],
    createdAt: "2026-09-14",
  },
]
