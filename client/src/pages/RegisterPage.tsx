import { useState } from "react";
import { useLocation, Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "hsl(var(--background))", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "40px", borderRadius: "16px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🦸</div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Create Account</h1>
          <p style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))" }}>Join Community Hero today</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(220, 38, 38, 0.1)", color: "rgb(220, 38, 38)", fontSize: "13px", fontWeight: "500" }}>{error}</div>}
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={18} />
          </Button>
          <p style={{ textAlign: "center", fontSize: "13px", color: "hsl(var(--muted-foreground))" }}>
            Already have an account? <Link href="/login" style={{ color: "hsl(var(--accent))", fontWeight: "600", textDecoration: "none" }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
