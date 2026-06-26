import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Plus, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";

export default function Navigation() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/60">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-bold">
            🦸
          </div>
          <span className="text-lg font-bold text-[hsl(var(--foreground))] group-hover:text-accent transition-colors">
            Community Hero
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated && (
            <>
              <Link href="/map">
                <Button variant="ghost" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link href="/report">
              <Button size="sm" className="hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </Link>
          )}

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--muted))] animate-pulse" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] flex items-center justify-center font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{user?.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild>
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="md:hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="container py-4 flex flex-col gap-2">
            <Link href="/map">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Map
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Admin
                </Button>
              </Link>
            )}
            <Link href="/report">
              <Button size="sm" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
