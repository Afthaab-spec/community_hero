import { useState } from "react";
import { useLocation, Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: "📍", title: "Report Issues", description: "Share neighborhood problems with photos and AI-powered insights" },
    { icon: "👥", title: "Community Verification", description: "Upvote and confirm issues to boost credibility" },
    { icon: "📈", title: "Track Impact", description: "Watch issues progress from report to resolution" },
    { icon: "🏆", title: "Earn Rewards", description: "Gain points, badges, and climb the leaderboard" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "40px", borderRight: "1px solid hsl(var(--border))" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)) 80%)", fontSize: "20px" }}>🦸</div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", background: "linear-gradient(to right, hsl(var(--foreground)), hsl(var(--accent)))", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>Community Hero</h1>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "hsl(var(--accent))", letterSpacing: "1px", textTransform: "uppercase" }}>Civic Platform</p>
            </div>
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1.3", marginBottom: "16px" }}>Empower Your Community</h2>
          <p style={{ fontSize: "16px", color: "hsl(var(--muted-foreground))", lineHeight: "1.6" }}>Report neighborhood issues, engage with your community, and earn rewards for making your area better.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {features.map((feature, i) => (
            <div key={i} style={{ padding: "16px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{feature.title}</h3>
              <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", lineHeight: "1.5" }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "32px" }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Welcome Back</h2>
          <p style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))" }}>Sign in with your email</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(220, 38, 38, 0.1)", color: "rgb(220, 38, 38)", fontSize: "13px", fontWeight: "500" }}>{error}</div>}
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Signing in..." : "Sign In"} <ArrowRight size={18} />
          </Button>
          <p style={{ textAlign: "center", fontSize: "13px", color: "hsl(var(--muted-foreground))" }}>
            Don't have an account? <Link href="/register" style={{ color: "hsl(var(--accent))", fontWeight: "600", textDecoration: "none" }}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
