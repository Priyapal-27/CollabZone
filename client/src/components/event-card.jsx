import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, Users } from "lucide-react";

export default function EventCard({ event }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
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

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center relative">
        {event.posterUrl ? (
          <img 
            src={event.posterUrl} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-lg font-semibold">Event Poster</span>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant={isUpcoming ? "default" : "secondary"}>
            {isUpcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getCategoryColor(event.category)}>
            {event.category}
          </Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(event.date)}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors">
          {event.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {event.description || "No description available"}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <DollarSign className="w-4 h-4 mr-2" />
              ₹{event.fee}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              {event.currentParticipants}
              {event.maxParticipants && ` / ${event.maxParticipants}`}
            </div>
          </div>
        </div>

        <Link href={`/events/${event.id}`}>
          <Button className="w-full group-hover:bg-primary-dark transition-colors">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}