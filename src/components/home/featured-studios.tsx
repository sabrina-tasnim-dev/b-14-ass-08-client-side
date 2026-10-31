import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { studios } from "@/data/studios"
import { StudioCard } from "@/components/studios/studio-card"
import { Section, SectionHeading } from "@/components/home/section"
import { buttonVariants } from "@/components/ui/button"

export function FeaturedStudios() {
  return (
    <Section>
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Featured Creative Spaces"
          description="Hand-picked studios loved by creators."
        />
        <Link
          href="/studios"
          className={buttonVariants({ variant: "outline" })}
        >
          Explore All Studios
          <ArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </div>
    </Section>
  )
}
