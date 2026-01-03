import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast-custom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CreateSet from "@/pages/CreateSet";
import SetResponses from "@/pages/SetResponses";
import PublicResponse from "@/pages/PublicResponse";
import DemoWizard from "@/pages/DemoWizard";
import Login from "@/pages/Login";
import BiodataList from "@/pages/BiodataList";
import BiodataView from "@/pages/BiodataView";
import BiodataWizard from "@/pages/BiodataWizard";
import Community from "./pages/Community";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading, isAuthenticated } = useAuth();

  console.log("ProtectedRoute - user:", user, "isLoading:", isLoading, "isAuthenticated:", isAuthenticated);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated at all
    console.log("Not authenticated, redirecting to login");
    window.location.href = "/login";
    return null;
  }

  console.log("User authenticated, rendering component");
  return <Component />;
}

function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const { initialize } = useSupabaseAuth();

  useEffect(() => {
    // Initialize Supabase auth state on app start
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/demo" component={DemoWizard} />
      <Route path="/s/:token" component={PublicResponse} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/create">
        {() => <ProtectedRoute component={CreateSet} />}
      </Route>
      <Route path="/sets/:id">
        {() => <ProtectedRoute component={SetResponses} />}
      </Route>
      <Route path="/biodata">
        {() => <ProtectedRoute component={BiodataList} />}
      </Route>
      <Route path="/biodata/:id">
        {() => <ProtectedRoute component={BiodataView} />}
      </Route>
      <Route path="/biodata/create">
        {() => <ProtectedRoute component={BiodataWizard} />}
      </Route>

      <Route path="/community">
        {() => <ProtectedRoute component={Community} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <ToastProvider>
              <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
                <Router />
                <Toaster />
              </div>
            </ToastProvider>
          </TooltipProvider>
        </LanguageProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;