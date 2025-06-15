import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, MapPin, Users, DollarSign, Trophy, 
  Clock, Mail, Phone, Building2, ArrowLeft, ExternalLink
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function EventDetail() {
  const [, params] = useRoute("/events/:id");
  const eventId = params?.id;

  const { data: event, isLoading } = useQuery({
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const spotsRemaining = event.maxParticipants ? event.maxParticipants - event.currentParticipants : null;

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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {event.posterUrl && (
            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <img 
                src={event.posterUrl} 
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant={isUpcoming ? "default" : "secondary"}>
                {isUpcoming ? "Upcoming" : "Past Event"}
              </Badge>
              <Badge variant="outline">{event.category}</Badge>
              {event.fee > 0 && <Badge variant="outline">Paid Event</Badge>}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {event.name}
            </h1>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <div className="font-medium">{eventDate.toLocaleDateString()}</div>
                  <div className="text-sm">{eventDate.toLocaleTimeString()}</div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-green-500" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm">{event.location}</div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <DollarSign className="w-5 h-5 mr-3 text-yellow-500" />
                <div>
                  <div className="font-medium">Fee</div>
                  <div className="text-sm">₹{event.fee}</div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Users className="w-5 h-5 mr-3 text-purple-500" />
                <div>
                  <div className="font-medium">Participants</div>
                  <div className="text-sm">
                    {event.currentParticipants}
                    {event.maxParticipants && ` / ${event.maxParticipants}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {isUpcoming && (
              <div className="mb-6">
                {spotsRemaining === 0 ? (
                  <Button disabled className="w-full md:w-auto">
                    Event Full
                  </Button>
                ) : (
                  <Link href={`/events/${event.id}/register`}>
                    <Button size="lg" className="w-full md:w-auto">
                      Register Now
                      {spotsRemaining && spotsRemaining <= 10 && (
                        <span className="ml-2 text-xs">({spotsRemaining} spots left)</span>
                      )}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Description & Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
                  <p className="text-gray-600 dark:text-gray-300">
                    {event.eligibility}
                  </p>
                </CardContent>
              </Card>
            )}

            {event.prizeDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Prizes & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {event.prizeDetails}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.hosts && event.hosts.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">Event Hosts</h4>
                    <div className="space-y-1">
                      {event.hosts.map((host, index) => (
                        <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                          <Building2 className="w-4 h-4 mr-2" />
                          {host}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {event.contactNumbers && event.contactNumbers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">Phone Numbers</h4>
                    <div className="space-y-1">
                      {event.contactNumbers.map((phone, index) => (
                        <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${phone}`} className="hover:text-blue-500">
                            {phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code */}
            {event.qrCodeUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Registration</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <img 
                    src={event.qrCodeUrl} 
                    alt="Registration QR Code"
                    className="w-32 h-32 mx-auto mb-3"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Scan to register instantly
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <Badge variant={event.isActive ? "default" : "secondary"}>
                      {event.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Registrations</span>
                    <span className="font-medium">{event.currentParticipants}</span>
                  </div>
                  {event.maxParticipants && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Capacity</span>
                      <span className="font-medium">{event.maxParticipants}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}