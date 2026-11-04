import type { Metadata } from "next"

import { Section, SectionHeading } from "@/components/home/section"
import { AddStudioForm } from "@/components/studios/add-studio-form"


export const metadata: Metadata = {
  title: "Add New Studio | StudioSpace",
  description: "List your creative space on StudioSpace.",
}

export default async function AddStudioPage() {

  return (
    <main className="flex-1">
      <div className="border-b border-border bg-card">
        <Section className="py-12 sm:py-16">
          <SectionHeading
            title="Add New Studio"
            description="Share your space with creators — fill in the details below and preview your listing before it goes live."
          />
        </Section>
      </div>

      <Section>
        <AddStudioForm />
      </Section>
    </main>
  )
}
