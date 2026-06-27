import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ClipboardList, Upload, MapPin, CheckCircle2, Image as ImageIcon } from "lucide-react"

export default function ReportIssuePage() {
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
          <CardContent className="space-y-6">
            
            {/* Issue Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Issue Category</Label>
              <Select>
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
            </div>

            {/* Issue Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input id="title" placeholder="Brief summary of the issue" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Provide a detailed description of the issue..." 
                className="min-h-[120px]"
              />
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
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-3 bg-muted/20">
                <div className="bg-background p-3 rounded-full shadow-sm">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Image upload coming soon</p>
                  <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button disabled className="w-full h-12 text-lg rounded-xl">
                Submit Report
              </Button>
            </div>
            
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
