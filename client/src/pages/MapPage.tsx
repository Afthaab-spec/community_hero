import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MapView } from "@/components/Map";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, MapPin, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const STATUS_COLORS: Record<string, string> = {
  Open: "#ef4444",
  InProgress: "#3b82f6",
  Resolved: "#22c55e",
};

export default function MapPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const { data: mapKey, isLoading: mapKeyLoading } = trpc.config.getGoogleMapsKey.useQuery();

  const { data: issues, isLoading } = trpc.issues.list.useQuery({
    limit: 200,
    ...(status ? { status: status as any } : {}),
    ...(category ? { category } : {}),
  });

  const { data: heatmapData } = trpc.heatmap.getData.useQuery();

  const filteredIssues = issues?.filter((issue) => {
    if (!searchTerm) return true;
    return (
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ position: "relative", height: "calc(100vh - 64px)", overflow: "hidden" }}>
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "absolute",
          top: "12px",
          left: sidebarOpen ? "332px" : "12px",
          zIndex: 30,
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          padding: "8px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "left 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: sidebarOpen ? "0" : "-340px",
          width: "320px",
          height: "100%",
          borderRight: "1px solid hsl(var(--border))",
          backgroundColor: "hsl(var(--card))",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          zIndex: 20,
          transition: "left 0.3s ease",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid hsl(var(--border))" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Issues</h2>

          {isAuthenticated && (
            <Button
              onClick={() => navigate("/report")}
              className="w-full mb-4"
            >
              <Plus size={16} />
              Report Issue
            </Button>
          )}

          {/* Search */}
          <Input
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />

          {/* Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Select value={status || "all"} onValueChange={(val) => setStatus(val === "all" ? null : val)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category || "all"} onValueChange={(val) => setCategory(val === "all" ? null : val)}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Roads">Roads</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Sanitation">Sanitation</SelectItem>
                <SelectItem value="PublicSafety">Public Safety</SelectItem>
                <SelectItem value="GreenSpaces">Green Spaces</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Issues List */}
        <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
              <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : filteredIssues && filteredIssues.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredIssues.map((issue) => (
                <Card
                  key={issue.id}
                  onClick={() => navigate(`/issue/${issue.id}`)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--background))",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(var(--muted)) 50%";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(var(--background))";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: STATUS_COLORS[issue.status],
                        marginTop: "4px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {issue.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {issue.description}
                      </p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <Badge style={{ fontSize: "11px", padding: "2px 6px" }}>
                          {issue.category}
                        </Badge>
                        <Badge style={{ fontSize: "11px", padding: "2px 6px", backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                          Severity: {issue.severityScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "hsl(var(--muted-foreground))" }}>
              <MapPin size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p>No issues found</p>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {mapKeyLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "500px", backgroundColor: "hsl(var(--muted))" }}>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>Loading map...</p>
          </div>
        ) : !mapKey ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "500px", backgroundColor: "hsl(var(--muted))" }}>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>Google Maps API key is not configured. Ask an admin to set it in Settings.</p>
          </div>
        ) : (
          <MapView
            apiKey={mapKey}
            initialCenter={{ lat: 40.7128, lng: -74.006 }}
            initialZoom={14}
            onMapReady={(map) => {
              const markers: google.maps.Marker[] = [];
              filteredIssues?.forEach((issue) => {
                if (issue.latitude && issue.longitude) {
                  const marker = new google.maps.Marker({
                    map,
                    position: { lat: issue.latitude as any, lng: issue.longitude as any },
                    title: issue.title,
                  });
                  marker.addListener("click", () => navigate(`/issue/${issue.id}`));
                  markers.push(marker);
                }
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
