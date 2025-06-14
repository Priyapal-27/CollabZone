import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, Calendar, Users, MessageSquare, 
  CheckCircle, AlertCircle, TrendingUp, Activity,
  Settings, Shield, BarChart3, FileText
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Event, College, FeedPost } from "@shared/schema";

export default function AdminDashboard() {
  // Get admin data from localStorage
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['/api/admin/events'],
  });

  const { data: colleges, isLoading: collegesLoading } = useQuery<College[]>({
    queryKey: ['/api/colleges'],
  });

  const { data: pendingColleges, isLoading: pendingLoading } = useQuery<College[]>({
    queryKey: ['/api/admin/pending-colleges'],
  });

  const { data: feedPosts, isLoading: feedLoading } = useQuery<FeedPost[]>({
    queryKey: ['/api/feed'],
  });

  // Calculate stats
  const approvedColleges = colleges?.filter(c => c.isApproved).length || 0;
  const totalRegistrations = events?.reduce((sum, event) => sum + (event.currentParticipants || 0), 0) || 0;
  const totalRevenue = events?.reduce((sum, event) => {
    const fee = parseFloat(event.fee || '0');
    const participants = event.currentParticipants || 0;
    return sum + (fee * participants);
  }, 0) || 0;

  const quickActions = [
    {
      title: "College Approval",
      description: "Review pending colleges",
      icon: CheckCircle,
      href: "/admin/college-approval",
      color: "bg-green-500",
      count: pendingColleges?.length || 0,
    },
    {
      title: "All Events",
      description: "Manage all events",
      icon: Calendar,
      href: "/admin/events",
      color: "bg-blue-500",
      count: events?.length || 0,
    },
    {
      title: "Feed Moderation",
      description: "Moderate posts",
      icon: MessageSquare,
      href: "/admin/feed-moderation",
      color: "bg-purple-500",
      count: feedPosts?.filter(p => !p.isApproved).length || 0,
    },
    {
      title: "User Management",
      description: "View all users",
      icon: Users,
      href: "/admin/users",
      color: "bg-orange-500",
      count: totalRegistrations,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {admin.username}. Here's what's happening in CollabZone.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Colleges</p>
                  {collegesLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {approvedColleges}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-2">
                {pendingLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    {pendingColleges?.length || 0} pending approval
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Events</p>
                  {eventsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {events?.length || 0}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-green-600 dark:text-green-400">
                  {events?.filter(e => new Date(e.date) > new Date()).length || 0} upcoming
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                  {eventsLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {totalRegistrations}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Active participants
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                  {eventsLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      ₹{totalRevenue.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  From all events
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Button
                    variant="ghost"
                    className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800 relative"
                  >
                    {action.count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {action.count > 99 ? '99+' : action.count}
                      </div>
                    )}
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Pending Approvals
              </CardTitle>
              <Link href="/admin/college-approval">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="w-10 h-10 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingColleges && pendingColleges.length > 0 ? (
                <div className="space-y-4">
                  {pendingColleges.slice(0, 3).map((college) => (
                    <div key={college.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {college.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {college.location} • Registered {new Date(college.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No pending approvals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Healthy</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">API Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">File Storage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Available</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Payment Gateway</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">Limited</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Uptime</span>
                  <span className="font-medium text-gray-800 dark:text-white">99.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
