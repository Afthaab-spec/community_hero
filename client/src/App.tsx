import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import IssueReportPage from "./pages/IssueReportPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import MapPage from "./pages/MapPage";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navigation from "./components/Navigation";
import { useAuth } from "./_core/hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";

function Router() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      <Route path="/report" component={IssueReportPage} />
      <Route path="/issue/:id" component={IssueDetailPage} />
      <Route path="/map" component={MapPage} />
      <Route path="/dashboard" component={CitizenDashboard} />
      {user?.role === "admin" && <Route path="/admin" component={AdminDashboard} />}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAuthenticated } = useAuth();
  const showNavigation = !window.location.pathname.includes("/login");

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            {showNavigation && <Navigation />}
            <main className="flex-1">
              <Router />
            </main>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
