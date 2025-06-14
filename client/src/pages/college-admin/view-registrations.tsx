import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, Search, Mail, Phone, MapPin, 
  School, User, Calendar, Download 
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Event, Registration } from "@shared/schema";

interface EventWithRegistrations {
  event: Event;
  registrations: Registration[];
}

export default function ViewRegistrations() {
  const [, params] = useRoute("/college/events/:id/registrations");
  const [searchTerm, setSearchTerm] = useState("");
  const eventId = params?.id;

  const { data, isLoading } = useQuery<Registration[]>({
    queryKey: [`/api/events/${eventId}/registrations`],
    enabled: !!eventId,
  });

  const { data: event } = useQuery<Event>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  const filteredRegistrations = data?.filter(registration =>
    registration.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.course.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    const headers = [
      'Name',
      'Email',
      'Phone',
      'College',
      'Course',
      'Address',
      'Registration Date',
      'Verified'
    ];

    const csvData = data.map(reg => [
      reg.fullName,
      reg.email,
      reg.phone,
      reg.college,
      reg.course,
      reg.address || '',
      new Date(reg.registeredAt!).toLocaleDateString(),
      reg.isVerified ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.name || 'event'}_registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Event Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The event you're looking for doesn't exist.
            </p>
            <Link href="/college/manage-events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/college/manage-events">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Event Registrations
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {event.name} • {filteredRegistrations.length} registration{filteredRegistrations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Event Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {data?.length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Registrations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data?.filter(r => r.isVerified).length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {data?.filter(r => !r.isVerified).length || 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ₹{((data?.filter(r => r.isVerified).length || 0) * parseFloat(event.fee || '0')).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Export */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search registrations by name, email, college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={exportToCSV}
                variant="outline"
                disabled={!data || data.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registrations List */}
        {filteredRegistrations.length > 0 ? (
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <Card key={registration.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {registration.fullName}
                        </h3>
                        <Badge className={registration.isVerified 
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                          : "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                        }>
                          {registration.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Mail className="w-4 h-4" />
                          <a 
                            href={`mailto:${registration.email}`}
                            className="hover:text-primary transition-colors"
                          >
                            {registration.email}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Phone className="w-4 h-4" />
                          <a 
                            href={`tel:${registration.phone}`}
                            className="hover:text-primary transition-colors"
                          >
                            {registration.phone}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <School className="w-4 h-4" />
                          <span>{registration.college}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <User className="w-4 h-4" />
                          <span>{registration.course}</span>
                        </div>
                        
                        {registration.address && (
                          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 md:col-span-2">
                            <MapPin className="w-4 h-4 mt-0.5" />
                            <span>{registration.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(registration.registeredAt!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {parseFloat(event.fee || '0') > 0 && (
                        <div className="text-lg font-semibold text-gray-800 dark:text-white">
                          ₹{event.fee}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {searchTerm ? "No registrations found" : "No registrations yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Registrations will appear here as people sign up for your event"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
