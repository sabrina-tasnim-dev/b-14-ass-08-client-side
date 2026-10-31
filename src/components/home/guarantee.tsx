import {
  BadgeCheck,
  Headphones,
  PackageCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { Section, SectionHeading } from "@/components/home/section"
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

type Feature = { title: string; description: string; icon: LucideIcon }

const features: Feature[] = [
  {
    title: "Liability Protection",
    description: "Up to $1M host liability coverage on every confirmed booking.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description: "ID-verified hosts and creators, so you know who you're meeting.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment Safety",
    description: "Secure handover and damage protection for every piece of gear.",
    icon: PackageCheck,
  },
  {
    title: "24/7 Host Support",
    description: "Real humans on call around the clock — whenever you need us.",
    icon: Headphones,
  },
]

export function HostGuarantee() {
  return (
    <div className="border-y border-border bg-card">
      <Section id="about">
        <SectionHeading
          title="Host Guarantee & Creator Support"
          description="Every booking is backed by protection, verified people and real support."
          className="mb-10 sm:mb-12"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                size="sm"
                className="gap-3 bg-background p-5 transition-all hover:-translate-y-0.5 hover:ring-foreground/25"
              >
                <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-card">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </Card>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
