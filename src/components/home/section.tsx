import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-7xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-20 lg:px-8",
        className
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
