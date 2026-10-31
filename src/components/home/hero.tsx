"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

type Slide = { image: string; title: string; description: string }

const AUTOPLAY_DELAY = 6000

const slides: Slide[] = [
  {
    image:
      "https://images.openai.com/static-rsc-4/icbEN3Fr1PkNHgBErBUkzddq90MnqQDVi15ze1FBVa-f9HsBe4VxMqo28fCZdsC-L71g7kVTp3eLzTu9mJEozhVizpTyIRS9GoQ4KQMsR5xvoluv1GLBOPIISite3m4OOQqfKEtFnuJe3Kem7zUvXtgl2H_d3jucT5XdMdxeP2ykMLts6VZ7ZmJq6NGOyubZ?purpose=fullsize",
    title: "Where Ideas Take Shape",
    description:
      "Book premium creative studios by the hour — photo, film and production spaces ready when you are.",
  },
  {
    image:
      "https://images.openai.com/static-rsc-4/taYRWtGzAmkDWhNxeYV4QTm4NFTtyK41KdPC47THGYSiRhmUJB7hfNVJk1TXkQ-X7WyK-vB-9CtzN-Wv91T08FikF3Gd5uWAiETZYm-1sD-H2tZes50zP_E-o6ZlNY21nwmb0b0xPrPec39FIbeYrQnRERU6CbGIaaEgdLyyQnRZ3aFPRh5peUUoLi4QS5QB?purpose=fullsize",
    title: "Light. Space. Craft.",
    description:
      "Hand-picked studios with cinematic lighting, professional gear and calm, focused environments.",
  },
  {
    image:
      "https://images.openai.com/static-rsc-4/s4uJFEfbPJX6HJilEHXvzFL52IZVg8Gg79LC4sjoSXryWcCXlq8pyHrAgNSfu_UMeSITKOpi9PEwy6g76WBMqf3Qfng4EU_F4fF6zq82hsF6zFTLib9FH--m1oQX_PBP86zK9xeBj7HubXX8w6Y-QImwUBrx3QN9c2gujNuqvZP32cxCk5CRLd4VKBdP2yJ4?purpose=fullsize",
    title: "Create Without Limits",
    description:
      "From intimate shoots to full-scale productions — find a space that moves at your pace.",
  },
]

const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}
const getMotionPreference = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function Hero() {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const reduced = useSyncExternalStore(
    subscribeMotion,
    getMotionPreference,
    () => false
  )

  const autoplay = useMemo(
    () =>
      reduced
        ? []
        : [
            Autoplay({
              delay: AUTOPLAY_DELAY,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
              stopOnInteraction: false,
            }),
          ],
    [reduced]
  )

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  const motion = (classes: string) => (reduced ? "" : classes)

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <Carousel
        aria-label="Featured studios"
        setApi={setApi}
        opts={{ loop: true }}
        plugins={autoplay}
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, i) => {
            const active = i === selected
            return (
              <CarouselItem
                key={slide.title}
                aria-hidden={!active}
                inert={!active}
                className="relative h-[calc(100svh-4rem)] min-h-[560px] pl-0"
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className={cn(
                    "object-cover",
                    motion("transition-transform duration-[6000ms] ease-out"),
                    active ? "scale-100" : "scale-105"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" />
                <div className="relative flex h-full items-center justify-center px-6">
                  <div className="flex max-w-3xl flex-col items-center gap-5 text-center">
                    <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="max-w-xl text-base text-white/70 sm:text-lg">
                      {slide.description}
                    </p>
                    <div className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                      <Link
                        href="/studios"
                        className={cn(
                          buttonVariants(),
                          "h-11 w-full px-6 sm:w-auto"
                        )}
                      >
                        Explore Studios
                      </Link>
                      <Link
                        href="/studios"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-11 w-full border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white sm:w-auto dark:border-white/40 dark:bg-transparent dark:hover:bg-white/10"
                        )}
                      >
                        Host Your Space
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <CarouselPrevious
          variant="ghost"
          size="icon"
          className="left-4 size-10 border border-white/25 bg-black/40 text-white hover:bg-black/70 hover:text-white sm:left-6"
        />
        <CarouselNext
          variant="ghost"
          size="icon"
          className="right-4 size-10 border border-white/25 bg-black/40 text-white hover:bg-black/70 hover:text-white sm:right-6"
        />

        <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={selected === i}
              className={cn(
                "h-1.5 rounded-full",
                motion("transition-all duration-300"),
                selected === i
                  ? "w-8 bg-white"
                  : "w-4 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
