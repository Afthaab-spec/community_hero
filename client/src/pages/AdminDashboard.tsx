import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Open: { bg: "rgb(254, 226, 226)", text: "rgb(220, 38, 38)" },
  InProgress: { bg: "rgb(219, 234, 254)", text: "rgb(30, 58, 138)" },
  Resolved: { bg: "rgb(220, 252, 231)", text: "rgb(22, 101, 52)" },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div style={{ padding: "48px 20px", backgroundColor: "hsl(var(--background))" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <AlertCircle size={48} style={{ margin: "0 auto 16px", color: "rgb(220, 38, 38)" }} />
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
            Access Denied
          </h1>
          <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "24px" }}>
            You don't have permission to access the admin dashboard
          </p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const { data: stats, isLoading } = trpc.issues.list.useQuery({ limit: 1 }); // Placeholder for admin stats
  const { data: allIssues } = trpc.issues.list.useQuery({
    limit: 500,
    status: filterStatus as any,
  });
  const updateStatusMutation = trpc.issues.updateStatus.useMutation();

  const handleStatusUpdate = async (issueId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        issueId,
        newStatus: newStatus as any,
      });
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const openCount = allIssues?.filter((i) => i.status === "Open").length || 0;
  const inProgressCount = allIssues?.filter((i) => i.status === "InProgress").length || 0;
  const resolvedCount = allIssues?.filter((i) => i.status === "Resolved").length || 0;

  return (
    <div style={{ padding: "48px 20px", backgroundColor: "hsl(var(--background))" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
            Authority Dashboard
          </h1>
          <p style={{ fontSize: "16px", color: "hsl(var(--muted-foreground))" }}>
            Manage and track all community issues across your neighborhood
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {/* Open Issues */}
          <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgb(254, 226, 226)", color: "rgb(220, 38, 38)" }}>
                <AlertCircle size={20} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                Open Issues
              </span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {openCount}
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              Awaiting action
            </p>
          </Card>

          {/* In Progress */}
          <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgb(219, 234, 254)", color: "rgb(30, 58, 138)" }}>
                <Clock size={20} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                In Progress
              </span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {inProgressCount}
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              Currently being worked on
            </p>
          </Card>

          {/* Resolved */}
          <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgb(220, 252, 231)", color: "rgb(22, 101, 52)" }}>
                <CheckCircle size={20} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                Resolved
              </span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {resolvedCount}
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              Completed
            </p>
          </Card>

          {/* Total Reports */}
          <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "hsl(var(--accent)) 10%", color: "hsl(var(--accent))" }}>
                <AlertCircle size={20} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                Total Reports
              </span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {allIssues?.length || 0}
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              All time
            </p>
          </Card>
        </div>

        {/* Issues Table */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>All Issues</h2>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--background))",
                fontSize: "14px",
                width: "200px",
              }}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card style={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                      Title
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                      Category
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                      Severity
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                      Status
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                      Verifications
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allIssues && allIssues.length > 0 ? (
                    allIssues.map((issue) => (
                      <tr key={issue.id} style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <button
                            onClick={() => navigate(`/issue/${issue.id}`)}
                            style={{ color: "hsl(var(--accent))", textDecoration: "none", cursor: "pointer", fontWeight: "500" }}
                          >
                            {issue.title}
                          </button>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          {issue.category}
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <Badge style={{ fontSize: "12px" }}>
                            {issue.severityScore}/10
                          </Badge>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <Badge
                            style={{
                              backgroundColor: STATUS_COLORS[issue.status]?.bg,
                              color: STATUS_COLORS[issue.status]?.text,
                              fontSize: "12px",
                            }}
                          >
                            {issue.status}
                          </Badge>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          {issue.verificationCount || 0}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <Select
                            value={issue.status}
                            onValueChange={(newStatus) =>
                              handleStatusUpdate(issue.id, newStatus)
                            }
                          >
                            <SelectTrigger style={{
                              padding: "6px 10px",
                              borderRadius: "4px",
                              border: "1px solid hsl(var(--border))",
                              backgroundColor: "hsl(var(--background))",
                              fontSize: "12px",
                              width: "140px",
                            }}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="InProgress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "hsl(var(--muted-foreground))" }}>
                        No issues found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
