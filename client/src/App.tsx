import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Events from "@/pages/Events";
import MyBets from "@/pages/MyBets";
import Experts from "@/pages/Experts";
import Leaderboard from "@/pages/Leaderboard";
import CreateEvent from "@/pages/CreateEvent";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/events" component={Events} />
      <Route path="/my-bets" component={MyBets} />
      <Route path="/experts" component={Experts} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/create-event" component={CreateEvent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
