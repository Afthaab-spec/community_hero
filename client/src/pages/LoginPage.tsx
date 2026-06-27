import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowRight, MapPin, Users, TrendingUp, Award } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: "📍",
      title: "Report Issues",
      description: "Share neighborhood problems with photos and AI-powered insights",
    },
    {
      icon: "👥",
      title: "Community Verification",
      description: "Upvote and confirm issues to boost credibility",
    },
    {
      icon: "📈",
      title: "Track Impact",
      description: "Watch issues progress from report to resolution",
    },
    {
      icon: "🏆",
      title: "Earn Rewards",
      description: "Gain points, badges, and climb the leaderboard",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridAutoFlow: "dense",
      }}
    >
      {/* Left Section - Features */}
      <div
        style={{
          padding: "60px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "40px",
          borderRight: "1px solid hsl(var(--border))",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)) 80%)",
                fontSize: "20px",
              }}
            >
              🦸
            </div>
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  background: "linear-gradient(to right, hsl(var(--foreground)), hsl(var(--accent)))",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Community Hero
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "hsl(var(--accent))",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Civic Platform
              </p>
            </div>
          </div>

          <h2
            style={{
              fontSize: "32px",
              fontWeight: "700",
              lineHeight: "1.3",
              marginBottom: "16px",
            }}
          >
            Empower Your Community
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "hsl(var(--muted-foreground))",
              lineHeight: "1.6",
            }}
          >
            Report neighborhood issues, engage with your community, and earn rewards for making your area better.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "hsl(var(--accent))";
                e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 5%";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "hsl(var(--border))";
                e.currentTarget.style.backgroundColor = "hsl(var(--card))";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "hsl(var(--muted-foreground))",
                  lineHeight: "1.5",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            paddingTop: "24px",
            borderTop: "1px solid hsl(var(--border))",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "hsl(var(--accent))",
              }}
            >
              2,500+
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              Active Citizens
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "hsl(var(--accent))",
              }}
            >
              1,200+
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              Issues Resolved
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div
        style={{
          padding: "60px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "32px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => (window.location.href = getLoginUrl())}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "14px 20px",
              background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)) 80%)",
              color: "hsl(var(--accent-foreground))",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              border: "none",
              transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
            }}
          >
            <span>🔐</span>
            Sign In with Manus OAuth
            <ArrowRight size={18} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "16px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "hsl(var(--border))",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "hsl(var(--muted-foreground))",
                fontWeight: "500",
              }}
            >
              OR
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "hsl(var(--border))",
              }}
            />
          </div>

          <button
            onClick={() => (window.location.href = getLoginUrl())}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "14px 20px",
              background: "transparent",
              color: "hsl(var(--foreground))",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              border: "2px solid hsl(var(--border))",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
              e.currentTarget.style.borderColor = "hsl(var(--accent))";
              e.currentTarget.style.color = "hsl(var(--accent))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "hsl(var(--border))";
              e.currentTarget.style.color = "hsl(var(--foreground))";
            }}
          >
            <span>👤</span>
            Continue as Guest
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid hsl(var(--border))",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "hsl(var(--muted-foreground))",
              lineHeight: "1.6",
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
