import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowRight, Shield, BarChart3, Users, AlertCircle } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const { isAuthenticated, user } = useAuth();

  const capabilities = [
    {
      icon: "📊",
      title: "Real-Time Dashboard",
      description: "Monitor all reported issues with live status updates",
    },
    {
      icon: "🎯",
      title: "Issue Management",
      description: "Prioritize, assign, and track resolution progress",
    },
    {
      icon: "👥",
      title: "Team Coordination",
      description: "Collaborate with teams to resolve community issues",
    },
    {
      icon: "📈",
      title: "Analytics & Reports",
      description: "Track metrics and generate performance reports",
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
      }}
    >
      {/* Left Section - Admin Features */}
      <div
        style={{
          padding: "60px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "40px",
          borderRight: "1px solid hsl(var(--border))",
          background: "linear-gradient(135deg, hsl(var(--accent)) 2%, hsl(var(--background)) 100%)",
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
              ⚙️
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
                Admin Portal
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
                Authority Control
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
            Manage Your Community
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "hsl(var(--muted-foreground))",
              lineHeight: "1.6",
            }}
          >
            Access powerful tools to oversee, prioritize, and resolve neighborhood issues efficiently.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {capabilities.map((cap, i) => (
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
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{cap.icon}</div>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                {cap.title}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "hsl(var(--muted-foreground))",
                  lineHeight: "1.5",
                }}
              >
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        {/* Admin Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
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
              156
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              Open Issues
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
              42
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              In Progress
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
              1,200
            </p>
            <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              Resolved
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Admin Login Form */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Shield size={24} style={{ color: "hsl(var(--accent))" }} />
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "hsl(var(--accent))",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Admin Access
            </span>
          </div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Authority Login
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Sign in with your admin credentials to access the control panel
          </p>
        </div>

        {/* Security Notice */}
        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid hsl(var(--accent)) 30%",
            backgroundColor: "hsl(var(--accent)) 5%",
            display: "flex",
            gap: "12px",
          }}
        >
          <AlertCircle size={20} style={{ color: "hsl(var(--accent))", flexShrink: 0 }} />
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "hsl(var(--foreground))",
                marginBottom: "4px",
              }}
            >
              Restricted Access
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "hsl(var(--muted-foreground))",
                lineHeight: "1.5",
              }}
            >
              This portal is for authorized administrators only. All access is logged and monitored.
            </p>
          </div>
        </div>

        {/* Login Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="w-full"
            size="lg"
          >
            <Shield size={18} />
            Sign In as Administrator
            <ArrowRight size={18} />
          </Button>

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

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
            size="lg"
          >
            <span>👤</span>
            Back to Home
          </Button>
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
            For security reasons, admin access is restricted to authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
