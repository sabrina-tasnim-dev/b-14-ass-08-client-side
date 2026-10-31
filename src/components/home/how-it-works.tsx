import {
  Aperture,
  CalendarClock,
  CreditCard,
  Search,
  type LucideIcon,
} from "lucide-react"
import { Section, SectionHeading } from "@/components/home/section"

type Step = { title: string; description: string; icon: LucideIcon }

const steps: Step[] = [
  {
    title: "Discover Spaces",
    description: "Browse curated studios and compare spaces, gear and amenities.",
    icon: Search,
  },
  {
    title: "Select Shoot Hours",
    description: "Choose your date and hourly slots with live availability.",
    icon: CalendarClock,
  },
  {
    title: "Book Instantly",
    description: "Confirm and pay in seconds — no messages, no waiting.",
    icon: CreditCard,
  },
  {
    title: "Create & Produce",
    description: "Check in, plug in and focus on making great work.",
    icon: Aperture,
  },
]

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        title="How Booking Works"
        description="From first search to final take — four simple steps."
        className="mb-10 items-center text-center sm:mb-12"
      />

      <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div
          aria-hidden
          className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block"
        />
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div
              key={step.title}
              className="relative flex flex-col items-center gap-3 text-center"
            >
              <span className="relative z-10 flex size-14 items-center justify-center rounded-full border border-border bg-background transition-colors hover:border-foreground/40">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <span className="text-xs font-medium tracking-widest text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-medium text-foreground">
                {step.title}
              </h3>
              <p className="max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
