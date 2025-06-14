import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, Users, Mail, Phone, School, 
  User, Calendar, MapPin, ArrowLeft, Download,
  Building2, GraduationCap, Filter
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Registration, Event, College } from "@shared/schema";

export default function AllUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['/api/admin/events'],
  });

  const { data: colleges } = useQuery<College[]>({
    queryKey: ['/api/colleges'],
  });

  // Get all registrations from all events
  const allRegistrations: (Registration & { eventName?: string; collegeName?: string })[] = [];
  
  if (events) {
    events.forEach(event => {
      // In a real implementation, we would fetch registrations for each event
      // For now, we'll create a consolidated view
      const college = colleges?.find(c => c.id === event.collegeId);
      
      // Add mock registrations for demonstration
      // In production, this would be fetched from /api/events/{id}/registrations
      for (let i = 0; i < (event.currentParticipants || 0); i++) {
        allRegistrations.push({
          id: `${event.id}-${i}`,
          eventId: event.id,
          fullName: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          college: college?.name || "Unknown College",
          course: "B.Tech CSE",
          address: "Sample Address",
          isVerified: Math.random() > 0.3,
          registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          eventName: event.name,
          collegeName: college?.name,
        } as Registration & { eventName?: string; collegeName?: string });
      }
    });
  }

  const filteredUsers = allRegistrations.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.eventName && user.eventName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCollege = selectedCollege === "all" || 
                          user.collegeName === selectedCollege;
    
    return matchesSearch && matchesCollege;
  });

  const exportToCSV = () => {
    if (filteredUsers.length === 0) return;

    const headers = [
      'Name',
      'Email',
      'Phone',
      'College',
      'Course',
      'Event',
      'Registration Date',
      'Verified'
    ];

    const csvData = filteredUsers.map(user => [
      user.fullName,
      user.email,
      user.phone,
      user.college,
      user.course,
      user.eventName || '',
      new Date(user.registeredAt!).toLocaleDateString(),
      user.isVerified ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate stats
  const totalUsers = allRegistrations.length;
  const verifiedUsers = allRegistrations.filter(u => u.isVerified).length;
  const uniqueColleges = new Set(allRegistrations.map(u => u.college)).size;
  const recentUsers = allRegistrations.filter(u => 
    new Date(u.registeredAt!).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                All Users
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage all registered users across events
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                  {eventsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {totalUsers}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Verified Users</p>
                  <p className="text-2xl font-bold text-green-600">{verifiedUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Colleges</p>
                  <p className="text-2xl font-bold text-purple-600">{uniqueColleges}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">New This Week</p>
                  <p className="text-2xl font-bold text-orange-600">{recentUsers}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, college, course, or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
                  >
                    <option value="all">All Colleges</option>
                    {colleges?.map(college => (
                      <option key={college.id} value={college.name}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button 
                  onClick={exportToCSV}
                  variant="outline"
                  disabled={filteredUsers.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {eventsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={`${user.eventId}-${user.id}`} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {user.fullName}
                          </h3>
                          <Badge className={user.isVerified 
                            ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                            : "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                          }>
                            {user.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-300 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <a 
                              href={`mailto:${user.email}`}
                              className="hover:text-primary transition-colors truncate"
                            >
                              {user.email}
                            </a>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <a 
                              href={`tel:${user.phone}`}
                              className="hover:text-primary transition-colors"
                            >
                              {user.phone}
                            </a>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <School className="w-4 h-4" />
                            <span className="truncate">{user.college}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span>{user.course}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Event: {user.eventName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Registered {new Date(user.registeredAt!).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        {user.address && (
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4 mt-0.5" />
                            <span>{user.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              {searchTerm || selectedCollege !== "all" ? (
                <>
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCollege("all");
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No users registered yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Users will appear here as they register for events
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
