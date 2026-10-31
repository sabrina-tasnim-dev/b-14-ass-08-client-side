import Link from "next/link"
import {
  Camera,
  Clapperboard,
  Music,
  Paintbrush,
  type LucideIcon,
  Mic,
} from "lucide-react"
import { studioCategories } from "@/data/studios"
import { Section, SectionHeading } from "@/components/home/section"

const categoryIcons: Record<string, LucideIcon> = {
  "Photo Studios": Camera,
  "Sound Stages": Clapperboard,
  "Podcast Rooms": Mic,
  "Music Suites": Music,
  "Art Workshops": Paintbrush,
}

export function Categories() {
  return (
    <div className="border-y border-border bg-card">
      <Section>
        <SectionHeading
          title="Browse by Studio Categories"
          description="Find the right kind of space for the work you make."
          className="mb-10 sm:mb-12"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {studioCategories.map((name) => {
            const Icon = categoryIcons[name]
            return (
              <Link
                key={name}
                href={`/studios?category=${encodeURIComponent(name)}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-5 text-center transition-all hover:-translate-y-0.5 hover:border-foreground/30 sm:p-6"
              >
                <span className="flex size-12 items-center justify-center rounded-full border border-border bg-card transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {name}
                </span>
              </Link>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
