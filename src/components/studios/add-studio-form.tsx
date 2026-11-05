"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { studioCategories } from "@/data/studios"
import type { Studio, StudioCategory } from "@/types/studio"
import { Button } from "@/components/ui/button"
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
import Image from "next/image"

type FormValues = {
  title: string
  category: StudioCategory | null
  hourlyRate: string
  securityDeposit: string
  maxCapacity: string
  location: string
  fullAddress: string
  coverImage: string
  gallery: string[]
  amenities: string[]
  overview: string
}

type FormErrors = {
  title?: string
  category?: string
  hourlyRate?: string
  securityDeposit?: string
  maxCapacity?: string
  location?: string
  fullAddress?: string
  coverImage?: string
  overview?: string
  gallery: string[]
}

const initialValues: FormValues = {
  title: "",
  category: null,
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  fullAddress: "",
  coverImage: "",
  gallery: [""],
  amenities: [],
  overview: "",
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

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = { gallery: [] }

  errors.title = requiredError(values.title, "Studio title")
  errors.category = values.category
    ? undefined
    : "Please select a category."
  errors.hourlyRate = positiveNumberError(values.hourlyRate, "Hourly rate", true)
  errors.securityDeposit = positiveNumberError(
    values.securityDeposit,
    "Security deposit",
    false
  )
  errors.maxCapacity = positiveNumberError(
    values.maxCapacity,
    "Maximum capacity",
    false
  )
  errors.location = requiredError(values.location, "Location")
  errors.fullAddress = requiredError(values.fullAddress, "Full address")

  const coverImage = values.coverImage.trim()
  if (!coverImage) {
    errors.coverImage = "Cover image URL is required."
  } else if (!isHttpUrl(coverImage)) {
    errors.coverImage = "Enter a valid URL starting with http:// or https://."
  }

  errors.overview = requiredError(values.overview, "Studio overview")

  errors.gallery = values.gallery.map((image) => {
    const trimmed = image.trim()
    if (!trimmed) return ""
    return isHttpUrl(trimmed)
      ? ""
      : "Enter a valid URL starting with http:// or https://."
  })

  return errors
}

function hasErrors(errors: FormErrors): boolean {
  return Boolean(
    errors.title ||
      errors.category ||
      errors.hourlyRate ||
      errors.securityDeposit ||
      errors.maxCapacity ||
      errors.location ||
      errors.fullAddress ||
      errors.coverImage ||
      errors.overview ||
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

export function AddStudioForm() {
  const router = useRouter()

  const [values, setValues] = useState<FormValues>(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [previewFailed, setPreviewFailed] = useState(false)
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

  const handleCancel = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/studios")
    }
  }

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)

    const currentErrors = validate(values)

    if (hasErrors(currentErrors)) {
      toast.error("Please fix the highlighted fields and try again.")
      return
    }

    const category = values.category
    if (!category) return

    const draft: Omit<Studio, "id" | "rating" | "createdAt"> & {
      fullAddress: string
    } = {
      title: values.title.trim(),
      category,
      location: values.location.trim(),
      hourlyRate: Number(values.hourlyRate),
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
      fullAddress: values.fullAddress.trim(),
    }

    toast.success("Your studio form is ready", {
      description: `"${draft.title}" passed validation but has not been saved yet — database integration is coming soon.`,
    })

    try{
      const res=await fetch("http://localhost:5000/add-studio",{
method:"POST",
headers:{
  "Content-Type":"application/json",
},
body:JSON.stringify(draft)
})
const data=await res.json()
if (!res.ok) {
  throw new Error(data.message || "Failed to add studio")
}
toast.success("Studio added successfully!")
}
 catch(error){
console.error(error)
toast.error(
  error instanceof Error ? error.message : "Something went wrong"
)
 }
  }

  const coverUrl = values.coverImage.trim()
  const coverIsValid = isHttpUrl(coverUrl)
  const coverMessage = fieldError("coverImage", errors.coverImage)

  const titleError = fieldError("title", errors.title)
  const categoryError = fieldError("category", errors.category)
  const hourlyRateError = fieldError("hourlyRate", errors.hourlyRate)
  const securityDepositError = fieldError(
    "securityDeposit",
    errors.securityDeposit
  )
  const maxCapacityError = fieldError("maxCapacity", errors.maxCapacity)
  const locationError = fieldError("location", errors.location)
  const fullAddressError = fieldError("fullAddress", errors.fullAddress)
  const overviewError = fieldError("overview", errors.overview)

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-8 rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      {/* Basic Information */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold">Basic Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The details guests see first when browsing studios.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="studio-title">
              Studio Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="studio-title"
              type="text"
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              onBlur={() => markTouched("title")}
              placeholder="e.g. Loft Photo Studio"
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? "studio-title-error" : undefined}
              className="h-9"
            />
            <FieldMessage id="studio-title-error" message={titleError} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="studio-category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={values.category}
              onValueChange={(value) => {
                update("category", value as StudioCategory | null)
                markTouched("category")
              }}
            >
              <SelectTrigger
                id="studio-category"
                className="w-full"
                aria-invalid={Boolean(categoryError)}
                aria-describedby={
                  categoryError ? "studio-category-error" : undefined
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
            <FieldMessage id="studio-category-error" message={categoryError} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="studio-location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="studio-location"
              type="text"
              value={values.location}
              onChange={(event) => update("location", event.target.value)}
              onBlur={() => markTouched("location")}
              placeholder="e.g. Brooklyn, NY"
              aria-invalid={Boolean(locationError)}
              aria-describedby={
                locationError ? "studio-location-error" : undefined
              }
              className="h-9"
            />
            <FieldMessage id="studio-location-error" message={locationError} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="studio-address">
              Full Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="studio-address"
              type="text"
              value={values.fullAddress}
              onChange={(event) => update("fullAddress", event.target.value)}
              onBlur={() => markTouched("fullAddress")}
              placeholder="e.g. 128 Wythe Avenue, Brooklyn, NY 11249"
              aria-invalid={Boolean(fullAddressError)}
              aria-describedby={
                fullAddressError ? "studio-address-error" : undefined
              }
              className="h-9"
            />
            <FieldMessage
              id="studio-address-error"
              message={fullAddressError}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="studio-hourly-rate">
              Hourly Rate ($) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="studio-hourly-rate"
              type="number"
              inputMode="decimal"
              min={0}
              step="1"
              value={values.hourlyRate}
              onChange={(event) => update("hourlyRate", event.target.value)}
              onBlur={() => markTouched("hourlyRate")}
              placeholder="e.g. 85"
              aria-invalid={Boolean(hourlyRateError)}
              aria-describedby={
                hourlyRateError ? "studio-hourly-rate-error" : undefined
              }
              className="h-9"
            />
            <FieldMessage
              id="studio-hourly-rate-error"
              message={hourlyRateError}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="studio-security-deposit">
              Security Deposit ($)
            </Label>
            <Input
              id="studio-security-deposit"
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
                  ? "studio-security-deposit-error"
                  : undefined
              }
              className="h-9"
            />
            <FieldMessage
              id="studio-security-deposit-error"
              message={securityDepositError}
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="studio-capacity">Maximum Capacity (people)</Label>
            <Input
              id="studio-capacity"
              type="number"
              inputMode="numeric"
              min={0}
              step="1"
              value={values.maxCapacity}
              onChange={(event) => update("maxCapacity", event.target.value)}
              onBlur={() => markTouched("maxCapacity")}
              placeholder="e.g. 12"
              aria-invalid={Boolean(maxCapacityError)}
              aria-describedby={
                maxCapacityError ? "studio-capacity-error" : undefined
              }
              className="h-9"
            />
            <FieldMessage id="studio-capacity-error" message={maxCapacityError} />
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Media */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold">Photos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a cover image and optional gallery photos.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="studio-cover">
            Cover Image URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="studio-cover"
            type="url"
            inputMode="url"
            value={values.coverImage}
            onChange={(event) => {
              update("coverImage", event.target.value)
              setPreviewFailed(false)
            }}
            onBlur={() => markTouched("coverImage")}
            placeholder="https://example.com/studio-cover.jpg"
            aria-invalid={Boolean(coverMessage)}
            aria-describedby={coverMessage ? "studio-cover-error" : undefined}
            className="h-9"
          />
          <FieldMessage id="studio-cover-error" message={coverMessage} />

          {coverUrl && coverIsValid && !previewFailed && (
            <div className="mt-1 overflow-hidden rounded-lg border border-border">
          <Image
  src={coverUrl}
  alt="Cover image preview"
  width={800}
  height={400}
  className="h-48 w-full object-cover"
  onError={() => setPreviewFailed(true)}
/>
            </div>
          )}

          {coverUrl && (!coverIsValid || previewFailed) && (
            <div className="mt-1 flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted px-4 text-center text-sm text-muted-foreground">
              {coverIsValid
                ? "That image could not be loaded. Try a different URL."
                : "Enter a valid image URL to see a live preview."}
            </div>
          )}
        </div>

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
                  <div key={`gallery-${index}`} className="flex flex-col gap-1.5">
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
                          message ? `gallery-error-${index}` : undefined
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
                      id={`gallery-error-${index}`}
                      message={message}
                    />
                  </div>
                )
              })}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Leave rows empty if you do not need them. Each filled row must be a
            valid image URL.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Amenities */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold">Amenities</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            List what your studio offers, such as lighting or equipment.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="studio-amenity">Add Amenity</Label>
          <div className="flex gap-2">
            <Input
              id="studio-amenity"
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
                amenityError ? "studio-amenity-error" : undefined
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
          <FieldMessage id="studio-amenity-error" message={amenityError} />

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

      {/* Overview */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold">Studio Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe the space, its vibe and who it is best suited for.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="studio-overview">
            Overview <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="studio-overview"
            value={values.overview}
            onChange={(event) => update("overview", event.target.value)}
            onBlur={() => markTouched("overview")}
            placeholder="A bright, minimal studio designed for photoshoots, small productions and creative workshops..."
            aria-invalid={Boolean(overviewError)}
            aria-describedby={
              overviewError ? "studio-overview-error" : undefined
            }
            className="min-h-32"
          />
          <FieldMessage id="studio-overview-error" message={overviewError} />
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Frontend preview only — your listing is not saved to a database yet.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg">
            Submit Studio
          </Button>
        </div>
      </div>
    </form>
  )
}
