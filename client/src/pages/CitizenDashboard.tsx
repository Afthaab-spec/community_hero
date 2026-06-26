import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Flame, Award, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: stats, isLoading } = trpc.gamification.getStats.useQuery();
  const { data: userIssues } = trpc.issues.getByReporter.useQuery({
    reporterId: user?.id || 0,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "48px 20px", backgroundColor: "hsl(var(--background))" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
            Welcome back, {user?.name || "Community Hero"}! 👋
          </h1>
          <p style={{ fontSize: "16px", color: "hsl(var(--muted-foreground))" }}>
            Track your impact and earn rewards for making your neighborhood better
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {/* Points */}
          <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "hsl(var(--accent)) 10%", color: "hsl(var(--accent))" }}>
                <TrendingUp size={20} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                Total Points
              </span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {stats?.totalPoints || 0}
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              Keep contributing to earn more
            </p>
          </Card>

          {/* Current Streak */}
          <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgb(251, 146, 60) 10%", color: "rgb(251, 146, 60)" }}>
                <Flame size={20} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                Current Streak
              </span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {stats?.currentStreak || 0}
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              days in a row
            </p>
          </Card>

          {/* Longest Streak */}
          <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgb(34, 197, 94) 10%", color: "rgb(34, 197, 94)" }}>
                <Trophy size={20} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                Longest Streak
              </span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {stats?.longestStreak || 0}
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              days
            </p>
          </Card>

          {/* Badges */}
          <Card style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "hsl(var(--accent)) 10%", color: "hsl(var(--accent))" }}>
                <Award size={20} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>
                Badges Earned
              </span>
            </div>
            <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {stats?.badges?.length || 0}
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              achievements unlocked
            </p>
          </Card>
        </div>

        {/* Badges Section */}
        {stats?.badges && stats.badges.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Your Badges</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "16px" }}>
              {stats.badges.map((b) => (
                <Card
                  key={b.badge.id}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{b.badge.icon}</div>
                  <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    {b.badge.name}
                  </p>
                  <p style={{ fontSize: "11px", color: "hsl(var(--muted-foreground))" }}>
                    {b.badge.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Issues */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Your Recent Reports</h2>
            <Button onClick={() => navigate("/report")} variant="outline">
              Report New Issue
            </Button>
          </div>

          {userIssues && userIssues.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {userIssues.map((issue) => (
                <Card
                  key={issue.id}
                  onClick={() => navigate(`/issue/${issue.id}`)}
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", flex: 1 }}>
                      {issue.title}
                    </h3>
                    <Badge style={{ whiteSpace: "nowrap", marginLeft: "8px" }}>
                      {issue.status}
                    </Badge>
                  </div>

                  <p style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))", marginBottom: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {issue.description}
                  </p>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <Badge variant="outline" style={{ fontSize: "12px" }}>
                      {issue.category}
                    </Badge>
                    <Badge variant="outline" style={{ fontSize: "12px" }}>
                      Severity: {issue.severityScore}
                    </Badge>
                  </div>

                  <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
                    Reported {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card style={{ padding: "48px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", textAlign: "center" }}>
              <p style={{ fontSize: "16px", color: "hsl(var(--muted-foreground))", marginBottom: "16px" }}>
                You haven't reported any issues yet
              </p>
              <Button onClick={() => navigate("/report")}>
                Report Your First Issue
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
