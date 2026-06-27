import { useAuth } from "@/_core/hooks/useAuth";
import { MapPin, Plus, Menu, X, ChevronDown, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";

export default function Navigation() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid hsl(var(--border))",
        backgroundColor: "hsl(var(--background))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link href="/">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
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
                color: "hsl(var(--accent-foreground))",
                fontWeight: "bold",
                fontSize: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              🦸
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  background: "linear-gradient(to right, hsl(var(--foreground)), hsl(var(--accent)))",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                Community Hero
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "hsl(var(--accent))",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Civic Platform
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: isAuthenticated ? "flex" : "none",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isAuthenticated && (
            <>
              <Link href="/map">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                    e.currentTarget.style.color = "hsl(var(--accent))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "hsl(var(--muted-foreground))";
                  }}
                >
                  <MapPin size={16} />
                  Map
                </div>
              </Link>
              <Link href="/dashboard">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                    e.currentTarget.style.color = "hsl(var(--accent))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "hsl(var(--muted-foreground))";
                  }}
                >
                  Dashboard
                </div>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      color: "hsl(var(--muted-foreground))",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                      e.currentTarget.style.color = "hsl(var(--accent))";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "hsl(var(--muted-foreground))";
                    }}
                  >
                    Admin
                  </div>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isAuthenticated && (
            <Link href="/report">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)) 80%)",
                  color: "hsl(var(--accent-foreground))",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Plus size={16} />
                Report
              </div>
            </Link>
          )}

          {loading ? (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "hsl(var(--muted))",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          ) : isAuthenticated ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: profileMenuOpen ? "hsl(var(--accent)) 8%" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!profileMenuOpen) {
                    e.currentTarget.style.backgroundColor = "hsl(var(--muted)) 50%";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!profileMenuOpen) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)) 80%)",
                    color: "hsl(var(--accent-foreground))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <ChevronDown
                  size={16}
                  style={{
                    transition: "transform 0.2s",
                    transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "8px",
                    width: "280px",
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                    zIndex: 1000,
                    animation: "slideDown 0.2s ease-out",
                  }}
                >
                  {/* Profile Header */}
                  <div style={{ padding: "16px", borderBottom: "1px solid hsl(var(--border))" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "hsl(var(--foreground))",
                        marginBottom: "4px",
                      }}
                    >
                      {user?.name}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: "8px" }}>
                    <Link href="/dashboard">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          color: "hsl(var(--foreground))",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                          e.currentTarget.style.color = "hsl(var(--accent))";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "hsl(var(--foreground))";
                        }}
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "6px",
                            background: "hsl(var(--accent)) 10%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          📊
                        </div>
                        <span>Dashboard</span>
                      </div>
                    </Link>

                    {user?.role === "admin" && (
                      <Link href="/admin">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            color: "hsl(var(--foreground))",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                            e.currentTarget.style.color = "hsl(var(--accent))";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "hsl(var(--foreground))";
                          }}
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "6px",
                              background: "hsl(var(--accent)) 10%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ⚙️
                          </div>
                          <span>Admin Panel</span>
                        </div>
                      </Link>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        color: "hsl(var(--foreground))",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                        e.currentTarget.style.color = "hsl(var(--accent))";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "hsl(var(--foreground))";
                      }}
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          background: "hsl(var(--accent)) 10%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LogOut size={16} />
                      </div>
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)) 80%)",
                color: "hsl(var(--accent-foreground))",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => (window.location.href = getLoginUrl())}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              Sign In
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              color: "hsl(var(--foreground))",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "hsl(var(--muted)) 50%";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && isAuthenticated && (
        <div
          style={{
            borderTop: "1px solid hsl(var(--border))",
            backgroundColor: "hsl(var(--card))",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Link href="/map">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
                color: "hsl(var(--muted-foreground))",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                e.currentTarget.style.color = "hsl(var(--accent))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "hsl(var(--muted-foreground))";
              }}
            >
              <MapPin size={16} />
              Map
            </div>
          </Link>
          <Link href="/dashboard">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
                color: "hsl(var(--muted-foreground))",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                e.currentTarget.style.color = "hsl(var(--accent))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "hsl(var(--muted-foreground))";
              }}
            >
              Dashboard
            </div>
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  color: "hsl(var(--muted-foreground))",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(var(--accent)) 8%";
                  e.currentTarget.style.color = "hsl(var(--accent))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "hsl(var(--muted-foreground))";
                }}
              >
                Admin
              </div>
            </Link>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </nav>
  );
}
