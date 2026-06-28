import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Save, RefreshCw, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const SETTINGS_FIELDS = [
  { key: "openai_api_key", label: "OpenAI API Key", type: "password", placeholder: "sk-...", description: "Used for AI categorization, severity scoring, image generation, and voice transcription" },
  { key: "google_maps_api_key", label: "Google Maps API Key", type: "password", placeholder: "AIza...", description: "Used for the interactive map and location features" },
  { key: "aws_access_key_id", label: "AWS Access Key ID", type: "password", placeholder: "AKIA...", description: "For S3 file storage (photos)" },
  { key: "aws_secret_access_key", label: "AWS Secret Access Key", type: "password", placeholder: "Enter your secret key", description: "AWS secret key for S3" },
  { key: "aws_region", label: "AWS Region", type: "text", placeholder: "us-east-1", description: "e.g., us-east-1, us-west-2, eu-west-1" },
  { key: "aws_s3_bucket", label: "AWS S3 Bucket Name", type: "text", placeholder: "my-bucket", description: "The S3 bucket where photos will be stored" },
  { key: "jwt_secret", label: "JWT Secret Key", type: "password", placeholder: "Random secret string", description: "Used to sign authentication tokens (set once)" },
  { key: "site_name", label: "Site Name", type: "text", placeholder: "Community Hero", description: "The name displayed on the site" },
];

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const configQuery = trpc.config.getAll.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const setConfig = trpc.config.set.useMutation();

  useEffect(() => {
    if (configQuery.data) {
      const initial: Record<string, string> = {};
      for (const [k, v] of Object.entries(configQuery.data)) {
        if (v !== null) initial[k] = v;
      }
      setValues(initial);
    }
  }, [configQuery.data]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      for (const [key, value] of Object.entries(values)) {
        if (value) {
          await setConfig.mutateAsync({ key, value });
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !user || user.role !== "admin") {
    return <div style={{ padding: "40px", textAlign: "center", color: "hsl(var(--muted-foreground))" }}>Access denied. Admin only.</div>;
  }

  if (configQuery.isLoading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading settings...</div>;
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>API Settings</h1>
        <p style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))" }}>
          Configure your API keys to enable all features. Keys are stored encrypted in the database.
          You can also set them via environment variables in your .env file.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {SETTINGS_FIELDS.map((field) => (
          <div key={field.key} style={{ padding: "20px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>{field.label}</label>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", marginBottom: "12px" }}>{field.description}</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type={field.type === "password" && !showPasswords[field.key] ? "password" : "text"}
                value={values[field.key] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", fontSize: "13px" }}
              />
              {field.type === "password" && (
                <Button type="button" variant="outline" size="icon" onClick={() => setShowPasswords((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}>
                  {showPasswords[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
        {saving ? <RefreshCw size={18} className="animate-spin" /> : saved ? <Check size={18} /> : <Save size={18} />}
        {saving ? "Saving..." : saved ? "Saved!" : "Save All Settings"}
      </Button>

      <div style={{ marginTop: "32px", padding: "20px", borderRadius: "12px", backgroundColor: "hsl(var(--muted))" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Quick Tips</h3>
        <ul style={{ fontSize: "13px", color: "hsl(var(--muted-foreground))", lineHeight: "1.8", paddingLeft: "20px" }}>
          <li><strong>OpenAI API Key</strong> is required for AI features (auto-categorization, severity scoring, image generation, voice transcription). Get one at <a href="https://platform.openai.com/api-keys" target="_blank" style={{ color: "hsl(var(--accent))" }}>platform.openai.com</a></li>
          <li><strong>Google Maps API Key</strong> enables the interactive map. Get one at <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style={{ color: "hsl(var(--accent))" }}>console.cloud.google.com</a></li>
          <li><strong>AWS S3</strong> is needed for photo uploads. Create a bucket in the AWS console and generate access keys.</li>
          <li>All keys can also be set via environment variables in <code style={{ backgroundColor: "hsl(var(--background))", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>.env</code> file.</li>
          <li>The first registered user automatically becomes admin.</li>
        </ul>
      </div>
    </div>
  );
}
