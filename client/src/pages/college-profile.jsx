import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Calendar, Building2, Globe } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EventCard from "@/components/event-card";

export default function CollegeProfile() {
  const [, params] = useRoute("/colleges/:id");
  const collegeId = params?.id;

  const { data, isLoading } = useQuery({
    queryKey: [`/api/colleges/${collegeId}`],
    enabled: !!collegeId,
  });

  const currentDate = new Date();
  const upcomingEvents = data?.events?.filter(event => new Date(event.date) > currentDate) || [];
  const pastEvents = data?.events?.filter(event => new Date(event.date) <= currentDate) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data || !data.college) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            College Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The college you're looking for doesn't exist.
          </p>
          <Button>
            <a href="/colleges">Browse Colleges</a>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { college, events } = data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* College Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* College Logo */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {college.logoUrl ? (
                <img 
                  src={college.logoUrl} 
                  alt={`${college.name} logo`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {college.name.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>

            {/* College Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {college.name}
                </h1>
                <Badge variant={college.isApproved ? "default" : "secondary"}>
                  {college.isApproved ? "Verified" : "Pending"}
                </Badge>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {college.location}
              </div>

              {college.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                  {college.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Users className="w-4 h-4 mr-2" />
                  {college.studentsCount || 0} Students
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  {events?.length || 0} Events
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Building2 className="w-4 h-4 mr-2" />
                  Established College
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming Events ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Events ({pastEvents.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No Upcoming Events
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This college doesn't have any upcoming events scheduled.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-6">
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No Past Events
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This college hasn't organized any events yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}