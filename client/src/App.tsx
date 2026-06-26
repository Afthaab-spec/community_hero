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

function Router() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
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
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navigation />
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
