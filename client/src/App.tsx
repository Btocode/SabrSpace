import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/landing";
import AnswerPage from "@/pages/answer";
import Dashboard from "@/pages/dashboard";
import CreateSetPage from "@/pages/create-set";
import EditSetPage from "@/pages/edit-set";
import ResponsesPage from "@/pages/responses";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/s/:token" component={AnswerPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/sets/new" component={CreateSetPage} />
      <Route path="/dashboard/sets/:setId/edit" component={EditSetPage} />
      <Route path="/dashboard/sets/:setId/responses" component={ResponsesPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
