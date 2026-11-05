"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Loader2Icon, Pencil, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { studioCategories } from "@/data/studios"
import type { Studio, StudioCategory, StudioHost } from "@/types/studio"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type FormValues = {
  title: string
  category: StudioCategory | null
  location: string
  hourlyRate: string
  rating: string
  securityDeposit: string
  maxCapacity: string
  overview: string
  coverImage: string
  gallery: string[]
  amenities: string[]
  hostName: string
  hostRole: string
  hostAvatar: string
  hostJoinedAt: string
}

type FormErrors = {
  title?: string
  category?: string
  location?: string
  hourlyRate?: string
  rating?: string
  securityDeposit?: string
  maxCapacity?: string
  overview?: string
  coverImage?: string
  hostName?: string
  gallery: string[]
}

type UpdateStudioPayload = {
  _id: string
  title: string
  category: StudioCategory
  location: string
  hourlyRate: number
  rating: number
  image: string
  overview: string
  securityDeposit?: number
  maxCapacity?: number
  amenities: string[]
  gallery: string[]
  host: StudioHost
}

function toFormValues(studio: Studio): FormValues {
  const gallery = studio.gallery ?? []

  return {
    title: studio.title ?? "",
    category: studio.category ?? null,
    location: studio.location ?? "",
    hourlyRate: studio.hourlyRate != null ? String(studio.hourlyRate) : "",
    rating: studio.rating != null ? String(studio.rating) : "",
    securityDeposit:
      studio.securityDeposit != null ? String(studio.securityDeposit) : "",
    maxCapacity: studio.maxCapacity != null ? String(studio.maxCapacity) : "",
    overview: studio.overview ?? "",
    coverImage: studio.image ?? "",
    gallery: gallery.length > 0 ? [...gallery] : [""],
    amenities: [...(studio.amenities ?? [])],
    hostName: studio.host?.name ?? "",
    hostRole: studio.host?.role ?? "",
    hostAvatar: studio.host?.avatar ?? "",
    hostJoinedAt: studio.host?.joinedAt ?? "",
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function requiredError(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `${label} is required.`
}

function positiveNumberError(
  value: string,
  label: string,
  required: boolean
): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return required ? `${label} is required.` : undefined
  }

  const amount = Number(trimmed)

  if (Number.isNaN(amount)) {
    return `${label} must be a number.`
  }

  if (amount <= 0) {
    return `${label} must be greater than 0.`
  }

  return undefined
}

function ratingError(value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return "Rating is required."
  }

  const amount = Number(trimmed)

  if (Number.isNaN(amount)) {
    return "Rating must be a number."
  }

  if (amount < 0 || amount > 5) {
    return "Rating must be between 0 and 5."
  }

  return undefined
}

function validate(values: FormValues): FormErrors {
  const coverImage = values.coverImage.trim()

  return {
    title: requiredError(values.title, "Studio title"),
    category: values.category
      ? undefined
      : "Please select a category.",
    location: requiredError(values.location, "Location"),
    hourlyRate: positiveNumberError(values.hourlyRate, "Hourly rate", true),
    rating: ratingError(values.rating),
    securityDeposit: positiveNumberError(
      values.securityDeposit,
      "Security deposit",
      false
    ),
    maxCapacity: positiveNumberError(
      values.maxCapacity,
      "Maximum capacity",
      false
    ),
    overview: requiredError(values.overview, "Overview"),
    coverImage: !coverImage
      ? "Cover image URL is required."
      : !isHttpUrl(coverImage)
        ? "Enter a valid URL starting with http:// or https://."
        : undefined,
    hostName: requiredError(values.hostName, "Host name"),
    gallery: values.gallery.map((image) => {
      const trimmed = image.trim()
      if (!trimmed) return ""
      return isHttpUrl(trimmed)
        ? ""
        : "Enter a valid URL starting with http:// or https://."
    }),
  }
}

function hasErrors(errors: FormErrors): boolean {
  return Boolean(
    errors.title ||
      errors.category ||
      errors.location ||
      errors.hourlyRate ||
      errors.rating ||
      errors.securityDeposit ||
      errors.maxCapacity ||
      errors.overview ||
      errors.coverImage ||
      errors.hostName ||
      errors.gallery.some(Boolean)
  )
}

function FieldMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null

  return (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  )
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      <FieldMessage id={`${id}-error`} message={error} />
    </div>
  )
}

export function EditStudioDialog({ studio }: { studio: Studio }) {
  const router = useRouter()

  console.log(studio)
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<FormValues>(() => toFormValues(studio))
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [amenityDraft, setAmenityDraft] = useState("")
  const [amenityError, setAmenityError] = useState("")

  const errors = validate(values)

  const fieldError = (key: string, message?: string) =>
    submitted || touched[key] ? message || undefined : undefined

  const markTouched = (key: string) => {
    setTouched((current) => ({ ...current, [key]: true }))
  }

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSaving) return

    if (nextOpen) {
      setValues(toFormValues(studio))
      setSubmitted(false)
      setTouched({})
      setAmenityDraft("")
      setAmenityError("")
    }

    setOpen(nextOpen)
  }

  const updateGalleryField = (index: number, value: string) => {
    setValues((current) => ({
      ...current,
      gallery: current.gallery.map((image, imageIndex) =>
        imageIndex === index ? value : image
      ),
    }))
  }

  const addGalleryField = () => {
    setValues((current) => ({ ...current, gallery: [...current.gallery, ""] }))
  }

  const removeGalleryField = (index: number) => {
    setValues((current) => ({
      ...current,
      gallery: current.gallery.filter((_, imageIndex) => imageIndex !== index),
    }))
  }

  const addAmenity = () => {
    const trimmed = amenityDraft.trim()

    if (!trimmed) {
      setAmenityError("Enter an amenity before adding it.")
      return
    }

    if (values.amenities.includes(trimmed)) {
      setAmenityError("That amenity is already in the list.")
      return
    }

    setAmenityError("")
    setAmenityDraft("")
    setValues((current) => ({
      ...current,
      amenities: [...current.amenities, trimmed],
    }))
  }

  const removeAmenity = (amenity: string) => {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.filter((item) => item !== amenity),
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSaving) return

    setSubmitted(true)

    const currentErrors = validate(values)

    if (hasErrors(currentErrors)) {
      toast.error("Please fix the highlighted fields and try again.")
      return
    }

    const category = values.category
    if (!category) return

    const payload: UpdateStudioPayload = {
      _id: studio.id,
      title: values.title.trim(),
      category,
      location: values.location.trim(),
      hourlyRate: Number(values.hourlyRate),
      rating: Number(values.rating),
      image: values.coverImage.trim(),
      overview: values.overview.trim(),
      securityDeposit: values.securityDeposit.trim()
        ? Number(values.securityDeposit)
        : undefined,
      maxCapacity: values.maxCapacity.trim()
        ? Number(values.maxCapacity)
        : undefined,
      amenities: values.amenities,
      gallery: values.gallery.map((image) => image.trim()).filter(Boolean),
      host: {
        name: values.hostName.trim(),
        role: values.hostRole.trim(),
        avatar: values.hostAvatar.trim(),
        joinedAt: values.hostJoinedAt.trim(),
      },
    }

    setIsSaving(true)

    try {
      const res = await fetch(`http://localhost:5000/studio/${studio.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = (await res.json().catch(() => null)) as {
        message?: string
      } | null

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update studio")
      }

      toast.success("Studio updated successfully!")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const titleError = fieldError("title", errors.title)
  const categoryError = fieldError("category", errors.category)
  const locationError = fieldError("location", errors.location)
  const hourlyRateError = fieldError("hourlyRate", errors.hourlyRate)
  const ratingError = fieldError("rating", errors.rating)
  const securityDepositError = fieldError(
    "securityDeposit",
    errors.securityDeposit
  )
  const maxCapacityError = fieldError("maxCapacity", errors.maxCapacity)
  const overviewError = fieldError("overview", errors.overview)
  const coverImageError = fieldError("coverImage", errors.coverImage)
  const hostNameError = fieldError("hostName", errors.hostName)

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handleOpenChange(true)}
      >
        <Pencil />
        Edit Studio
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[85vh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-lg">
          <DialogHeader className="pr-8">
            <DialogTitle>Edit Studio</DialogTitle>
            <DialogDescription>
              Update the listing details below. Changes appear on this page
              right after saving.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 overflow-y-auto pr-1">
            <form
              id="edit-studio-form"
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Basic Information */}
              <section className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Basic Information</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The details guests see first when browsing studios.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      id="edit-studio-title"
                      label="Studio Title"
                      required
                      error={titleError}
                    >
                      <Input
                        id="edit-studio-title"
                        type="text"
                        value={values.title}
                        onChange={(event) => update("title", event.target.value)}
                        onBlur={() => markTouched("title")}
                        placeholder="e.g. Loft Photo Studio"
                        aria-invalid={Boolean(titleError)}
                        aria-describedby={
                          titleError ? "edit-studio-title-error" : undefined
                        }
                        className="h-9"
                      />
                    </Field>
                  </div>

                  <Field
                    id="edit-studio-category"
                    label="Category"
                    required
                    error={categoryError}
                  >
                    <Select
                      value={values.category}
                      onValueChange={(value) => {
                        update("category", value as StudioCategory | null)
                        markTouched("category")
                      }}
                    >
                      <SelectTrigger
                        id="edit-studio-category"
                        className="w-full"
                        aria-invalid={Boolean(categoryError)}
                        aria-describedby={
                          categoryError
                            ? "edit-studio-category-error"
                            : undefined
                        }
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {studioCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field
                    id="edit-studio-location"
                    label="Location"
                    required
                    error={locationError}
                  >
                    <Input
                      id="edit-studio-location"
                      type="text"
                      value={values.location}
                      onChange={(event) =>
                        update("location", event.target.value)
                      }
                      onBlur={() => markTouched("location")}
                      placeholder="e.g. Brooklyn, NY"
                      aria-invalid={Boolean(locationError)}
                      aria-describedby={
                        locationError ? "edit-studio-location-error" : undefined
                      }
                      className="h-9"
                    />
                  </Field>

                  <Field
                    id="edit-studio-hourly-rate"
                    label="Hourly Rate ($)"
                    required
                    error={hourlyRateError}
                  >
                    <Input
                      id="edit-studio-hourly-rate"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="1"
                      value={values.hourlyRate}
                      onChange={(event) =>
                        update("hourlyRate", event.target.value)
                      }
                      onBlur={() => markTouched("hourlyRate")}
                      placeholder="e.g. 85"
                      aria-invalid={Boolean(hourlyRateError)}
                      aria-describedby={
                        hourlyRateError
                          ? "edit-studio-hourly-rate-error"
                          : undefined
                      }
                      className="h-9"
                    />
                  </Field>

                  <Field
                    id="edit-studio-rating"
                    label="Rating (0 - 5)"
                    required
                    error={ratingError}
                  >
                    <Input
                      id="edit-studio-rating"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={5}
                      step="0.1"
                      value={values.rating}
                      onChange={(event) => update("rating", event.target.value)}
                      onBlur={() => markTouched("rating")}
                      placeholder="e.g. 4.9"
                      aria-invalid={Boolean(ratingError)}
                      aria-describedby={
                        ratingError ? "edit-studio-rating-error" : undefined
                      }
                      className="h-9"
                    />
                  </Field>

                  <Field
                    id="edit-studio-security-deposit"
                    label="Security Deposit ($)"
                    error={securityDepositError}
                  >
                    <Input
                      id="edit-studio-security-deposit"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="1"
                      value={values.securityDeposit}
                      onChange={(event) =>
                        update("securityDeposit", event.target.value)
                      }
                      onBlur={() => markTouched("securityDeposit")}
                      placeholder="e.g. 100"
                      aria-invalid={Boolean(securityDepositError)}
                      aria-describedby={
                        securityDepositError
                          ? "edit-studio-security-deposit-error"
                          : undefined
                      }
                      className="h-9"
                    />
                  </Field>

                  <Field
                    id="edit-studio-capacity"
                    label="Maximum Capacity (people)"
                    error={maxCapacityError}
                  >
                    <Input
                      id="edit-studio-capacity"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step="1"
                      value={values.maxCapacity}
                      onChange={(event) =>
                        update("maxCapacity", event.target.value)
                      }
                      onBlur={() => markTouched("maxCapacity")}
                      placeholder="e.g. 12"
                      aria-invalid={Boolean(maxCapacityError)}
                      aria-describedby={
                        maxCapacityError
                          ? "edit-studio-capacity-error"
                          : undefined
                      }
                      className="h-9"
                    />
                  </Field>
                </div>
              </section>

              <div className="border-t border-border" />

              {/* Overview */}
              <section className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Studio Overview</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Describe the space, its vibe and who it is best suited for.
                  </p>
                </div>

                <Field
                  id="edit-studio-overview"
                  label="Overview"
                  required
                  error={overviewError}
                >
                  <Textarea
                    id="edit-studio-overview"
                    value={values.overview}
                    onChange={(event) => update("overview", event.target.value)}
                    onBlur={() => markTouched("overview")}
                    placeholder="A bright, minimal studio designed for photoshoots, small productions and creative workshops..."
                    aria-invalid={Boolean(overviewError)}
                    aria-describedby={
                      overviewError ? "edit-studio-overview-error" : undefined
                    }
                    className="min-h-24"
                  />
                </Field>
              </section>

              <div className="border-t border-border" />

              {/* Photos */}
              <section className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Photos</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Update the cover image and gallery photos.
                  </p>
                </div>

                <Field
                  id="edit-studio-cover"
                  label="Cover Image URL"
                  required
                  error={coverImageError}
                >
                  <Input
                    id="edit-studio-cover"
                    type="url"
                    inputMode="url"
                    value={values.coverImage}
                    onChange={(event) => update("coverImage", event.target.value)}
                    onBlur={() => markTouched("coverImage")}
                    placeholder="https://example.com/studio-cover.jpg"
                    aria-invalid={Boolean(coverImageError)}
                    aria-describedby={
                      coverImageError ? "edit-studio-cover-error" : undefined
                    }
                    className="h-9"
                  />
                </Field>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Label>Gallery Images</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addGalleryField}
                    >
                      <ImagePlus />
                      Add Image
                    </Button>
                  </div>

                  {values.gallery.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No gallery images yet. Use the button above to add one.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {values.gallery.map((image, index) => {
                        const message = fieldError(
                          `gallery-${index}`,
                          errors.gallery[index]
                        )

                        return (
                          <div
                            key={`gallery-${index}`}
                            className="flex flex-col gap-1.5"
                          >
                            <div className="flex gap-2">
                              <Input
                                type="url"
                                inputMode="url"
                                value={image}
                                onChange={(event) =>
                                  updateGalleryField(index, event.target.value)
                                }
                                onBlur={() => markTouched(`gallery-${index}`)}
                                placeholder={`https://example.com/image-${index + 1}.jpg`}
                                aria-label={`Gallery image ${index + 1}`}
                                aria-invalid={Boolean(message)}
                                aria-describedby={
                                  message
                                    ? `edit-gallery-error-${index}`
                                    : undefined
                                }
                                className="h-9"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeGalleryField(index)}
                                aria-label={`Remove gallery image ${index + 1}`}
                              >
                                <X />
                              </Button>
                            </div>
                            <FieldMessage
                              id={`edit-gallery-error-${index}`}
                              message={message}
                            />
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Leave rows empty if you do not need them. Each filled row
                    must be a valid image URL.
                  </p>
                </div>
              </section>

              <div className="border-t border-border" />

              {/* Amenities */}
              <section className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Amenities</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    List what your studio offers, such as lighting or
                    equipment.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="edit-studio-amenity">Add Amenity</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-studio-amenity"
                      type="text"
                      value={amenityDraft}
                      onChange={(event) => {
                        setAmenityDraft(event.target.value)
                        setAmenityError("")
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          addAmenity()
                        }
                      }}
                      placeholder="e.g. Natural Lighting"
                      aria-invalid={Boolean(amenityError)}
                      aria-describedby={
                        amenityError ? "edit-studio-amenity-error" : undefined
                      }
                      className="h-9"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAmenity}
                      className="shrink-0"
                    >
                      <Plus />
                      Add
                    </Button>
                  </div>
                  <FieldMessage
                    id="edit-studio-amenity-error"
                    message={amenityError}
                  />

                  {values.amenities.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {values.amenities.map((amenity) => (
                        <li
                          key={amenity}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted py-1 pr-1 pl-3 text-sm"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            aria-label={`Remove ${amenity}`}
                            className="rounded-full p-1 transition-colors hover:bg-background"
                          >
                            <X className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No amenities added yet.
                    </p>
                  )}
                </div>
              </section>

              <div className="border-t border-border" />

              {/* Host Information */}
              <section className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Host Information</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The host details shown on this studio page.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      id="edit-studio-host-name"
                      label="Host Name"
                      required
                      error={hostNameError}
                    >
                      <Input
                        id="edit-studio-host-name"
                        type="text"
                        value={values.hostName}
                        onChange={(event) =>
                          update("hostName", event.target.value)
                        }
                        onBlur={() => markTouched("hostName")}
                        placeholder="e.g. Alex Morgan"
                        aria-invalid={Boolean(hostNameError)}
                        aria-describedby={
                          hostNameError
                            ? "edit-studio-host-name-error"
                            : undefined
                        }
                        className="h-9"
                      />
                    </Field>
                  </div>

                  <Field id="edit-studio-host-role" label="Host Role">
                    <Input
                      id="edit-studio-host-role"
                      type="text"
                      value={values.hostRole}
                      onChange={(event) =>
                        update("hostRole", event.target.value)
                      }
                      placeholder="e.g. Professional Studio Host"
                      className="h-9"
                    />
                  </Field>

                  <Field id="edit-studio-host-joined" label="Joined">
                    <Input
                      id="edit-studio-host-joined"
                      type="text"
                      value={values.hostJoinedAt}
                      onChange={(event) =>
                        update("hostJoinedAt", event.target.value)
                      }
                      placeholder="e.g. January 2025"
                      className="h-9"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field
                      id="edit-studio-host-avatar"
                      label="Host Avatar URL"
                    >
                      <Input
                        id="edit-studio-host-avatar"
                        type="url"
                        inputMode="url"
                        value={values.hostAvatar}
                        onChange={(event) =>
                          update("hostAvatar", event.target.value)
                        }
                        placeholder="https://example.com/host.jpg"
                        className="h-9"
                      />
                    </Field>
                  </div>
                </div>
              </section>
            </form>
          </div>

          <DialogFooter showCloseButton={false}>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-studio-form"
              disabled={isSaving}
            >
              {isSaving && <Loader2Icon className="animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
