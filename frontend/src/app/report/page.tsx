"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ClipboardList, Upload, MapPin, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { uploadService } from "@/services/upload.service"
import { issueService, ReportIssuePayload } from "@/services/issue.service"

const reportIssueSchema = z.object({
  category: z.string().min(1, "Please select a category."),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(100, "Title cannot exceed 100 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(1000, "Description cannot exceed 1000 characters."),
  image_url: z.string().optional(),
})

type ReportIssueForm = z.infer<typeof reportIssueSchema>

export default function ReportIssuePage() {
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<ReportIssueForm>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      category: "",
      title: "",
      description: "",
      image_url: "",
    },
  })

  const imageUrl = watch("image_url")

  const handleRemoveImage = () => {
    setValue("image_url", "", { shouldValidate: true });
    setFileName(null);
    setUploadError(null);
  };

  const onSubmit = async (data: ReportIssueForm) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage(null)

    try {
      const payload: ReportIssuePayload = {
        title: data.title,
        description: data.description,
        latitude: 37.7749,
        longitude: -122.4194,
        image_url: data.image_url || null,
      }

      const result = await issueService.reportIssue(payload)

      if (result.issue_created) {
        setSubmitStatus("success")
        reset()
        handleRemoveImage()
      } else {
        setSubmitStatus("error")
        setErrorMessage(result.message)
      }
    } catch (error: any) {
      console.error(error)
      setSubmitStatus("error")
      if (error.response) {
        setErrorMessage(error.response.data?.detail || "Server validation error. Please check your input.")
      } else if (error.request) {
        setErrorMessage("Network error: Failed to connect to the server.")
      } else {
        setErrorMessage(error.message || "An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateFile = (file: File) => {
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.";
    }

    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      return "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.";
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSizeInBytes) {
      return "File too large. Maximum size allowed is 10 MB.";
    }

    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setUploadError(errorMsg);
      e.target.value = "";
      return;
    }

    // Upload file
    setIsUploading(true);
    setFileName(file.name);

    try {
      const uploadedUrl = await uploadService.uploadImage(file);
      setValue("image_url", uploadedUrl, { shouldValidate: true });
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        setUploadError(`Upload failure: ${error.response.data?.detail || "Server error"}`);
      } else if (error.request) {
        setUploadError("Network error: Failed to connect to the server. Please check your connection.");
      } else {
        setUploadError(`Upload failure: ${error.message || "An unexpected error occurred."}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center mb-10 space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <ClipboardList className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Report a Civic Issue</h1>
        <p className="text-xl text-muted-foreground">
          Help improve your community by reporting local issues.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Main Content Card */}
        <Card className="max-w-3xl mx-auto w-full shadow-lg rounded-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Issue Details</CardTitle>
            <CardDescription>
              Please provide as much information as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitStatus === "success" && (
                <div className="p-4 text-sm text-emerald-800 bg-emerald-50 rounded-lg dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                  Issue reported successfully!
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                  {errorMessage || "Failed to report issue. Please try again."}
                </div>
              )}
              {/* Issue Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Issue Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="road">Road</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="streetlight">Streetlight</SelectItem>
                        <SelectItem value="waste">Waste</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Issue Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input id="title" placeholder="Brief summary of the issue" {...register("title")} />
                {errors.title && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide a detailed description of the issue..." 
                  className="min-h-[120px]"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <Separator />

              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">Location</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" disabled placeholder="e.g. 37.7749" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" disabled placeholder="e.g. -122.4194" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Location picker will be added in a later milestone.
                </p>
              </div>

              <Separator />

              {/* Image Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">Image</h3>
                </div>

                {isUploading ? (
                  /* Loading State */
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-3 bg-muted/20 animate-pulse">
                    <div className="bg-background p-3 rounded-full shadow-sm">
                      <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Uploading image...</p>
                      <p className="text-xs text-muted-foreground">Please wait</p>
                    </div>
                  </div>
                ) : imageUrl ? (
                  /* Success / Preview State */
                  <div className="relative border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 bg-muted/10">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Uploaded issue preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                      <p className="text-sm font-medium truncate">{fileName || "uploaded-image.jpg"}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-600 dark:text-emerald-500 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Upload successful</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="w-full sm:w-auto text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  /* Upload Input Area */
                  <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-3 bg-muted/20 hover:bg-muted/30 transition cursor-pointer">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    <div className="bg-background p-3 rounded-full shadow-sm">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Click to upload an image</p>
                      <p className="text-xs text-muted-foreground">Supports JPG, JPEG, PNG, WEBP (Max 10MB)</p>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {uploadError}
                  </p>
                )}

                <input type="hidden" {...register("image_url")} />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full h-12 text-lg rounded-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Report</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Information Panel */}
        <Card className="max-w-3xl mx-auto w-full bg-muted/40 shadow-sm border-dashed">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Tips for Better Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Provide a clear title.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Add detailed description.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Mention nearby landmarks.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Upload a clear image.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Ensure location is accurate.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
