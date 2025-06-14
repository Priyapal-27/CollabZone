import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, MapPin, Users, DollarSign, Trophy, 
  Clock, Mail, Phone, Building2, ArrowLeft 
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Event } from "@shared/schema";

export default function EventDetail() {
  const [, params] = useRoute("/events/:id");
  const eventId = params?.id;

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Event Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/events">
              <Button>Browse Other Events</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
      case 'cultural':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300';
      case 'sports':
        return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
      case 'workshop':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
    }
  };

  const isEventFull = event.maxParticipants && event.currentParticipants && 
                     event.currentParticipants >= event.maxParticipants;

  const isEventPast = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/events">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>

        {/* Event Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Event Poster Placeholder */}
            <div className="w-full h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-6 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">Event Poster</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                  {isEventPast && (
                    <Badge variant="secondary">Past Event</Badge>
                  )}
                  {isEventFull && (
                    <Badge variant="destructive">Event Full</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  {event.name}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.currentParticipants || 0}
                      {event.maxParticipants && ` / ${event.maxParticipants}`} registered
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold text-accent-custom mb-2">
                  {parseFloat(event.fee || '0') === 0 ? 'Free' : `₹${event.fee}`}
                </div>
                {!isEventPast && !isEventFull && (
                  <Link href={`/events/${event.id}/register`}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Register Now
                    </Button>
                  </Link>
                )}
                {isEventPast && (
                  <Button size="lg" disabled>
                    Event Ended
                  </Button>
                )}
                {isEventFull && !isEventPast && (
                  <Button size="lg" disabled>
                    Event Full
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description & Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description || "No description available for this event."}
                </p>
              </CardContent>
            </Card>

            {event.eligibility && (
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {event.eligibility}
                  </p>
                </CardContent>
              </Card>
            )}

            {event.prizeDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Prizes & Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {event.prizeDetails}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Event Info & Contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Registration Fee</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {parseFloat(event.fee || '0') === 0 ? 'Free Entry' : `₹${event.fee}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {event.currentParticipants || 0} registered
                      {event.maxParticipants && ` (Max: ${event.maxParticipants})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Venue</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {event.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(event.hosts?.length || event.contactNumbers?.length) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.hosts && event.hosts.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Event Hosts</p>
                      <div className="space-y-1">
                        {event.hosts.map((host, index) => (
                          <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
                            {host}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.contactNumbers && event.contactNumbers.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Contact Numbers</p>
                      <div className="space-y-1">
                        {event.contactNumbers.map((number, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a 
                              href={`tel:${number}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {number}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
