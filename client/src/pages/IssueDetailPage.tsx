import { useParams, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Calendar, User, ThumbsUp, Flag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Open: { bg: "rgb(254, 226, 226)", text: "rgb(220, 38, 38)" },
  InProgress: { bg: "rgb(219, 234, 254)", text: "rgb(30, 58, 138)" },
  Resolved: { bg: "rgb(220, 252, 231)", text: "rgb(22, 101, 52)" },
};

const SEVERITY_COLORS: Record<number, string> = {
  1: "rgb(34, 197, 94)",
  2: "rgb(34, 197, 94)",
  3: "rgb(34, 197, 94)",
  4: "rgb(34, 197, 94)",
  5: "rgb(234, 179, 8)",
  6: "rgb(234, 179, 8)",
  7: "rgb(251, 146, 60)",
  8: "rgb(251, 146, 60)",
  9: "rgb(220, 38, 38)",
  10: "rgb(220, 38, 38)",
};

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const issueId = parseInt(id || "0");

  const { data: issue, isLoading } = trpc.issues.getById.useQuery({ id: issueId });
  const { data: verifications } = trpc.verifications.getForIssue.useQuery({
    issueId,
  });
  const createVerificationMutation = trpc.verifications.create.useMutation();

  const handleVerify = async (type: "upvote" | "confirm" | "flag") => {
    try {
      await createVerificationMutation.mutateAsync({
        issueId,
        type,
      });
      toast.success(`Issue ${type}d successfully!`);
    } catch (error) {
      toast.error("Failed to verify issue");
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!issue) {
    return (
      <div style={{ padding: "48px 20px", backgroundColor: "hsl(var(--background))" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Issue Not Found</h1>
          <Button onClick={() => navigate("/map")}>Back to Map</Button>
        </div>
      </div>
    );
  }

  const confirmCount = verifications?.filter((v) => v.verificationType === "confirm").length || 0;
  const upvoteCount = verifications?.filter((v) => v.verificationType === "upvote").length || 0;

  return (
    <div style={{ padding: "48px 20px", backgroundColor: "hsl(var(--background))" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/map")}
          style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <ArrowLeft size={16} />
          Back to Map
        </Button>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "12px" }}>{issue.title}</h1>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Badge
                  style={{
                    backgroundColor: STATUS_COLORS[issue.status]?.bg,
                    color: STATUS_COLORS[issue.status]?.text,
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {issue.status}
                </Badge>
                <Badge
                  style={{
                    backgroundColor: SEVERITY_COLORS[issue.severityScore] + "20",
                    color: SEVERITY_COLORS[issue.severityScore],
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  Severity: {issue.severityScore}/10
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Photo */}
        {issue.photoUrl && (
          <Card style={{ marginBottom: "32px", borderRadius: "12px", overflow: "hidden", border: "1px solid hsl(var(--border))" }}>
            <img
              src={issue.photoUrl}
              alt={issue.title}
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
          </Card>
        )}

        {/* Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
          {/* Description */}
          <div>
            <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Description</h2>
              <p style={{ color: "hsl(var(--muted-foreground))", lineHeight: "1.6" }}>
                {issue.description}
              </p>
            </Card>

            {issue.aiGeneratedSummary && (
              <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card)) 50%", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>AI Summary</h2>
                <p style={{ color: "hsl(var(--muted-foreground))", lineHeight: "1.6", fontStyle: "italic" }}>
                  {issue.aiGeneratedSummary}
                </p>
              </Card>
            )}

            {/* Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <Card style={{ padding: "16px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <MapPin size={16} style={{ color: "hsl(var(--accent))" }} />
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                    Location
                  </span>
                </div>
                <p style={{ fontSize: "14px" }}>
                  {issue.address || `${(issue.latitude as any)?.toFixed?.(4) || issue.latitude}, ${(issue.longitude as any)?.toFixed?.(4) || issue.longitude}`}
                </p>
              </Card>

              <Card style={{ padding: "16px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Calendar size={16} style={{ color: "hsl(var(--accent))" }} />
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                    Reported
                  </span>
                </div>
                <p style={{ fontSize: "14px" }}>
                  {new Date(issue.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </div>

            {/* Community Verification */}
            <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Community Verification</h2>
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1, textAlign: "center", padding: "12px", backgroundColor: "hsl(var(--muted)) 50%", borderRadius: "8px" }}>
                  <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}>
                    Confirmations
                  </p>
                  <p style={{ fontSize: "24px", fontWeight: "bold" }}>{confirmCount}</p>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "12px", backgroundColor: "hsl(var(--muted)) 50%", borderRadius: "8px" }}>
                  <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}>
                    Upvotes
                  </p>
                  <p style={{ fontSize: "24px", fontWeight: "bold" }}>{upvoteCount}</p>
                </div>
              </div>

              {user && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify("confirm")}
                    disabled={createVerificationMutation.isPending}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    ✓ Confirm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify("upvote")}
                    disabled={createVerificationMutation.isPending}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <ThumbsUp size={14} />
                    Upvote
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify("flag")}
                    disabled={createVerificationMutation.isPending}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <Flag size={14} />
                    Flag
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card style={{ padding: "20px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Issue Details</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}>
                    Category
                  </p>
                  <p style={{ fontSize: "14px" }}>{issue.category}</p>
                </div>

                <div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}>
                    Verifications
                  </p>
                  <p style={{ fontSize: "14px" }}>{issue.verificationCount || 0}</p>
                </div>

                <div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}>
                    Reporter
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    {issue.isAnonymous ? "Anonymous" : "Community Member"}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}>
                    ID
                  </p>
                  <p style={{ fontSize: "12px", fontFamily: "monospace", color: "hsl(var(--muted-foreground))" }}>
                    #{issue.id}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
