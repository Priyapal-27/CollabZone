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

// College Admin Pages
import CollegeLogin from "@/pages/college-admin/login";
import CollegeDashboard from "@/pages/college-admin/dashboard";
import CreateEvent from "@/pages/college-admin/create-event";
import ManageEvents from "@/pages/college-admin/manage-events";
import ViewRegistrations from "@/pages/college-admin/view-registrations";

// Super Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import CollegeApproval from "@/pages/admin/college-approval";
import AllEvents from "@/pages/admin/all-events";
import FeedModeration from "@/pages/admin/feed-moderation";
import AllUsers from "@/pages/admin/all-users";

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
      
      {/* College Admin Routes */}
      <Route path="/college/login" component={CollegeLogin} />
      <Route path="/college/dashboard" component={CollegeDashboard} />
      <Route path="/college/create-event" component={CreateEvent} />
      <Route path="/college/manage-events" component={ManageEvents} />
      <Route path="/college/events/:id/registrations" component={ViewRegistrations} />
      
      {/* Super Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/college-approval" component={CollegeApproval} />
      <Route path="/admin/events" component={AllEvents} />
      <Route path="/admin/feed-moderation" component={FeedModeration} />
      <Route path="/admin/users" component={AllUsers} />
      
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
