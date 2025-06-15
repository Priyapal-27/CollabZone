import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";

// Public Pages
import Home from "@/pages/home";
import Colleges from "@/pages/colleges";
import CollegeProfile from "@/pages/college-profile";
import Events from "@/pages/events";
import EventDetail from "@/pages/event-detail";
import RegisterEvent from "@/pages/register-event";
import SocialFeed from "@/pages/social-feed";
import Contact from "@/pages/contact";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/colleges" component={Colleges} />
      <Route path="/colleges/:id" component={CollegeProfile} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/events/:id/register" component={RegisterEvent} />
      <Route path="/feed" component={SocialFeed} />
      <Route path="/contact" component={Contact} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="collabzone-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;