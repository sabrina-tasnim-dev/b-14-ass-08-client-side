"use client"

import { useEffect, useMemo, useState, type KeyboardEvent } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { Studio } from "@/types/studio"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MAX_THUMBNAILS = 4

function collectImages(studio: Studio): string[] {
  const candidates = [studio.image, ...(studio.gallery ?? [])]
  const seen = new Set<string>()
  const images: string[] = []

  for (const candidate of candidates) {
    const src = typeof candidate === "string" ? candidate.trim() : ""
    if (!src || seen.has(src)) continue
    seen.add(src)
    images.push(src)
  }

  return images
}

export function StudioGallery({ studio }: { studio: Studio }) {
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const [index, setIndex] = useState(0)

  const images = useMemo(
    () => collectImages(studio).filter((src) => !failed[src]),
    [studio, failed]
  )
  const total = images.length
  const active = total > 0 ? Math.min(index, total - 1) : 0
  const hasMany = total > 1

  useEffect(() => {
    if (!hasMany) return
    const previous = images[(active - 1 + total) % total]
    const next = images[(active + 1) % total]

    for (const src of [previous, next]) {
      const preload = new window.Image()
      preload.src = src
    }
  }, [active, hasMany, images, total])

  if (total === 0) return null

  const markFailed = (src: string) => {
    setFailed((current) => ({ ...current, [src]: true }))
  }

  const showPrevious = () => {
    if (!hasMany) return
    setIndex((active - 1 + total) % total)
  }

  const showNext = () => {
    if (!hasMany) return
    setIndex((active + 1) % total)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      showPrevious()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      showNext()
    }
  }

  const current = images[active]

  const thumbnails = images
    .map((src, i) => ({ src, i }))
    .filter(({ i }) => i !== active)
    .slice(0, MAX_THUMBNAILS)

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${studio.title} photo gallery`}
      onKeyDown={handleKeyDown}
      className={cn(
        "grid grid-cols-1 gap-3 overflow-hidden rounded-xl",
        hasMany && "md:grid-cols-2"
      )}
    >
      {/* Current image */}
      <div
        className={cn(
          "relative min-h-[280px] aspect-[4/3] bg-muted md:min-h-[400px]",
          !hasMany && "max-h-[520px]"
        )}
      >
        <Image
          key={current}
          src={current}
          alt={`${studio.title} photo ${active + 1}`}
          fill
          priority={active === 0}
          sizes={hasMany ? "(min-width: 768px) 50vw, 100vw" : "100vw"}
          onError={() => markFailed(current)}
          className="object-cover animate-in fade-in duration-300"
        />

        <div
          aria-live="polite"
          className="pointer-events-none absolute right-3 bottom-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
        >
          {active + 1} / {total}
        </div>

        {hasMany && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-3 sm:p-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Previous photo"
              onClick={showPrevious}
              className="pointer-events-auto size-10 rounded-full border border-white/25 bg-black/40 text-white hover:bg-black/70 hover:text-white"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Next photo"
              onClick={showNext}
              className="pointer-events-auto size-10 rounded-full border border-white/25 bg-black/40 text-white hover:bg-black/70 hover:text-white"
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>

      {/* Additional images */}
      {hasMany && (
        <div
          className={cn(
            "grid gap-3",
            thumbnails.length > 1 ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {thumbnails.map(({ src, i }) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className="group relative min-h-[130px] aspect-[4/3] overflow-hidden outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                onError={() => markFailed(src)}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
