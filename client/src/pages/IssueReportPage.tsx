import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, MapPin, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const CATEGORIES = [
  { value: "Roads", label: "🛣️ Roads & Potholes" },
  { value: "Water", label: "💧 Water & Drainage" },
  { value: "Electricity", label: "⚡ Electricity & Streetlights" },
  { value: "Sanitation", label: "🗑️ Sanitation & Waste" },
  { value: "PublicSafety", label: "🚨 Public Safety" },
  { value: "GreenSpaces", label: "🌳 Green Spaces" },
  { value: "Other", label: "📋 Other" },
];

interface FormData {
  title: string;
  description: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  photo: File | null;
  isAnonymous: boolean;
}

export default function IssueReportPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    latitude: null,
    longitude: null,
    address: "",
    photo: null,
    isAnonymous: false,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    category?: string;
    severity?: number;
    summary?: string;
  } | null>(null);

  // Get current location
  const getLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setIsLoadingLocation(false);
          toast.success("Location captured");
        },
        () => {
          setIsLoadingLocation(false);
          toast.error("Unable to get location. Please enable location services.");
        }
      );
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Photo must be less than 10MB");
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file }));

      // Preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // TODO: Call LLM to analyze photo and suggest category/severity
      // For now, show a placeholder
      setAiSuggestions({
        category: "Roads",
        severity: 7,
        summary: "Analyzing image...",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (formData.latitude === null || formData.longitude === null) {
      toast.error("Please capture your location");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Upload photo to S3 and get URL
      // TODO: Call LLM to get category, severity, and summary
      // TODO: Create issue via tRPC

      toast.success("Issue reported successfully!");
      navigate("/map");
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error("Failed to report issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Help us improve your neighborhood by reporting local problems
          </p>
        </div>

        <Card className="card-elevated">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Upload */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Photo (Optional)</Label>
              <div
                className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center cursor-pointer hover:bg-[hsl(var(--muted))]/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-[hsl(var(--muted-foreground))]" />
                    <div>
                      <p className="font-semibold text-[hsl(var(--foreground))]">
                        Click to upload a photo
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* AI Suggestions */}
            {aiSuggestions && (
              <div className="bg-[hsl(var(--accent))]/5 border border-accent/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[hsl(var(--foreground))] mb-2">
                      AI Suggestions
                    </p>
                    <div className="space-y-2 text-sm">
                      {aiSuggestions.category && (
                        <p>
                          <span className="text-[hsl(var(--muted-foreground))]">Category:</span>{" "}
                          <span className="font-medium">{aiSuggestions.category}</span>
                        </p>
                      )}
                      {aiSuggestions.severity && (
                        <p>
                          <span className="text-[hsl(var(--muted-foreground))]">Severity:</span>{" "}
                          <span className="font-medium">
                            {aiSuggestions.severity}/10
                          </span>
                        </p>
                      )}
                      {aiSuggestions.summary && (
                        <p>
                          <span className="text-[hsl(var(--muted-foreground))]">Summary:</span>{" "}
                          <span className="font-medium">{aiSuggestions.summary}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Issue Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Large pothole on Main Street"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="input-elegant"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="input-elegant min-h-32"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="input-elegant">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Location</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getLocation}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      Capture Location
                    </>
                  )}
                </Button>
              </div>

              {formData.latitude && formData.longitude && (
                <div className="bg-[hsl(var(--muted))]/50 rounded-lg p-4">
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Latitude: {formData.latitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Longitude: {formData.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              <Input
                placeholder="Address (optional)"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="input-elegant"
              />
            </div>

            {/* Anonymous */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAnonymous: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="anonymous" className="cursor-pointer">
                Report anonymously
              </Label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
