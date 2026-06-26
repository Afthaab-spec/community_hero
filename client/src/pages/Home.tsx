import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  MapPin,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Award,
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
      {/* Hero Section */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h1 style={{ fontSize: "56px", fontWeight: "bold", lineHeight: "1.2" }}>
                  Turn Every Citizen Into a{" "}
                  <span style={{ background: "linear-gradient(to right, hsl(var(--accent)), hsl(var(--accent)) 70%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                    Local Guardian
                  </span>
                </h1>
                <p style={{ fontSize: "20px", color: "hsl(var(--muted-foreground))", lineHeight: "1.6" }}>
                  Report neighborhood issues with a photo, let AI understand the problem,
                  and watch your community come together to resolve it. Earn rewards for
                  making your neighborhood better.
                </p>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {isAuthenticated ? (
                  <>
                    <Link href="/report">
                      <Button style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        Report an Issue
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link href="/map">
                      <Button variant="outline" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        View Map
                        <MapPin size={16} />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button asChild style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <a href={getLoginUrl()}>
                        Get Started
                        <ArrowRight size={16} />
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="#features">Learn More</a>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div style={{ display: "none" }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, hsl(var(--accent)) 20%, hsl(var(--accent)) 10%)", borderRadius: "16px", filter: "blur(48px)" }} />
                <div style={{ position: "relative", backgroundColor: "hsl(var(--card))", borderRadius: "16px", border: "1px solid hsl(var(--border))", padding: "32px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ height: "256px", background: "linear-gradient(to bottom right, hsl(var(--accent)) 10%, hsl(var(--accent)) 5%)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MapPin size={96} style={{ opacity: 0.3 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "80px 20px", borderTop: "1px solid hsl(var(--border))" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px" }}>Powerful Features</h2>
            <p style={{ fontSize: "18px", color: "hsl(var(--muted-foreground))", maxWidth: "600px", margin: "0 auto" }}>
              Everything you need to report issues, engage your community, and track
              real-world impact
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            {[
              {
                icon: Zap,
                title: "AI-Powered Auto-Fill",
                description:
                  "Upload a photo and AI instantly categorizes the issue, scores severity, and generates a summary",
              },
              {
                icon: MapPin,
                title: "Interactive Map",
                description:
                  "See all reported issues on a beautiful map with color-coded pins and heatmap visualization",
              },
              {
                icon: Users,
                title: "Community Verification",
                description:
                  "Upvote and confirm issues reported by neighbors to boost credibility and visibility",
              },
              {
                icon: TrendingUp,
                title: "Real-Time Tracking",
                description:
                  "Follow the complete lifecycle of every issue from report to resolution with status updates",
              },
              {
                icon: Award,
                title: "Gamification",
                description:
                  "Earn points, unlock badges, build streaks, and climb the leaderboard as you contribute",
              },
              {
                icon: Shield,
                title: "Authority Dashboard",
                description:
                  "Administrators get a clear operational overview to prioritize and manage resolutions",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} style={{ padding: "24px", borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "hsl(var(--accent)) 10%", color: "hsl(var(--accent))" }}>
                        <Icon size={24} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: "600", color: "hsl(var(--foreground))", marginBottom: "8px" }}>
                        {feature.title}
                      </h3>
                      <p style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))", lineHeight: "1.6" }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section style={{ padding: "80px 20px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", background: "linear-gradient(to right, hsl(var(--accent)), hsl(var(--accent)) 80%)", borderRadius: "16px", padding: "64px", textAlign: "center", color: "hsl(var(--accent-foreground))" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px" }}>Ready to Make a Difference?</h2>
            <p style={{ fontSize: "18px", marginBottom: "32px", opacity: 0.9, maxWidth: "600px", margin: "0 auto 32px" }}>
              Join thousands of citizens who are transforming their neighborhoods
              into thriving communities
            </p>
            <Button variant="secondary" asChild style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <a href={getLoginUrl()}>
                Get Started Today
                <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ borderTop: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card)) 50%", padding: "48px 20px", textAlign: "center", color: "hsl(var(--muted-foreground))" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ marginBottom: "8px" }}>Community Hero • Making neighborhoods better, together</p>
          <p style={{ fontSize: "14px" }}>© 2026 Community Hero. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
