import type { Metadata } from "next"

import { Section, SectionHeading } from "@/components/home/section"
import { AddStudioForm } from "@/components/studios/add-studio-form"
import { toast } from "sonner"

export const metadata: Metadata = {
  title: "Add New Studio | StudioSpace",
  description: "List your creative space on StudioSpace.",
}

export default async function AddStudioPage() {

// const res=await fetch("http://localhost:5000/add-studio",{
// method:"POST",
// headers:{
//   "Content-Type":"application/json",
// },
// body:JSON.stringify(draft)
// })
// const data=await res.json()
// if (!res.ok) {
//   throw new Error(data.message || "Failed to add studio")
// }

toast.success("Studio added successfully!")

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
