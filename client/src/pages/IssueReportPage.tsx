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
  const createIssueMutation = trpc.issues.create.useMutation();

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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h / w) * maxSize; w = maxSize; }
          else { w = (w / h) * maxSize; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
        URL.revokeObjectURL(url);
        resolve(compressed);
      };
      img.src = url;
    });
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

    try {
      let photoBase64: string | undefined;

      if (formData.photo) {
        photoBase64 = await compressImage(formData.photo);
      }

      await createIssueMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        photoBase64,
        isAnonymous: formData.isAnonymous,
      });

      toast.success("Issue reported successfully!");
      navigate("/map");
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error("Failed to report issue. Please try again.");
    }
  };

  return (
    <div style={{ padding: "48px 20px", backgroundColor: "hsl(var(--background))" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>Report an Issue</h1>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            Help us improve your neighborhood by reporting local problems
          </p>
        </div>

        <Card style={{ padding: "32px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Photo Upload */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Label style={{ fontSize: "16px", fontWeight: "600" }}>Photo (Optional)</Label>
              <div
                style={{
                  border: "2px dashed hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "hsl(var(--muted)) 50%")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {preview ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ maxHeight: "256px", margin: "0 auto", borderRadius: "8px" }}
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Upload size={48} style={{ margin: "0 auto", color: "hsl(var(--muted-foreground))" }} />
                    <div>
                      <p style={{ fontWeight: "600", color: "hsl(var(--foreground))" }}>
                        Click to upload a photo
                      </p>
                      <p style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))" }}>
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
                style={{ display: "none" }}
              />
            </div>

            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Label htmlFor="title" style={{ fontSize: "16px", fontWeight: "600" }}>
                Issue Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Large pothole on Main Street"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Label htmlFor="description" style={{ fontSize: "16px", fontWeight: "600" }}>
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
                className="min-h-[128px]"
              />
            </div>

            {/* Category */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Label htmlFor="category" style={{ fontSize: "16px", fontWeight: "600" }}>
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Label style={{ fontSize: "16px", fontWeight: "600" }}>Location</Label>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={getLocation}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin size={16} />
                      Capture Location
                    </>
                  )}
                </Button>
              </div>

              {formData.latitude && formData.longitude && (
                <div style={{ backgroundColor: "hsl(var(--muted)) 50%", borderRadius: "8px", padding: "16px" }}>
                  <p style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))" }}>
                    Latitude: {formData.latitude.toFixed(6)}
                  </p>
                  <p style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))" }}>
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
              />
            </div>

            {/* Anonymous */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
              <Label htmlFor="anonymous" style={{ cursor: "pointer" }}>
                Report anonymously
              </Label>
            </div>

            {/* Submit */}
            <div style={{ display: "flex", gap: "12px", paddingTop: "16px" }}>
              <Button
                type="submit"
                disabled={createIssueMutation.isPending}
                className="flex-1"
                size="lg"
              >
                {createIssueMutation.isPending ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => navigate("/")}
                size="lg"
              >
                Cancel
              </Button>            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
