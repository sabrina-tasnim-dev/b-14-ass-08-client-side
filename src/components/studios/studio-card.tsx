import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Star } from "lucide-react"
import type { Studio } from "@/types/studio"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <Card className="group gap-0 p-0 transition-all hover:-translate-y-1 hover:ring-foreground/25">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={studio.image}
          alt={studio.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 border-white/20 bg-black/55 text-white backdrop-blur-sm"
        >
          {studio.category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2.5 py-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{studio.title}</CardTitle>
          <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-foreground text-foreground" />
            {studio.rating}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {studio.location}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground">
            <span className="text-lg font-semibold text-foreground">
              ${studio.hourlyRate}
            </span>
            /hour
          </p>
          <Link
            href={`/studios/${studio.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View Details
            <ArrowRight />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
