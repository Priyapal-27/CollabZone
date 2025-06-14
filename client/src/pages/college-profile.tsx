import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Calendar } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EventCard from "@/components/event-card";
import type { College, Event } from "@shared/schema";

interface CollegeProfileData {
  college: College;
  events: Event[];
}

export default function CollegeProfile() {
  const [, params] = useRoute("/colleges/:id");
  const collegeId = params?.id;

  const { data, isLoading } = useQuery<CollegeProfileData>({
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

  if (!data?.college) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              College Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              The college you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { college } = data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* College Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-2xl">
                {college.name.slice(0, 3).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {college.name}
                </h1>
                <Badge className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 w-fit">
                  Verified College
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{college.location}</span>
              </div>
              
              {college.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {college.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{data.events.length} Total Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{college.studentsCount || 0} Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Events by {college.name}
          </h2>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastEvents.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={{ ...event, collegeName: college.name }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No Upcoming Events
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This college hasn't scheduled any upcoming events yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-6">
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={{ ...event, collegeName: college.name }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No Past Events
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This college hasn't hosted any events yet.
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
