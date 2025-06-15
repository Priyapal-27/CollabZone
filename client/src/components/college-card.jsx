import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function CollegeCard({ college }) {
  return (
    <Link href={`/colleges/${college.id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              {college.logoUrl ? (
                <img 
                  src={college.logoUrl} 
                  alt={`${college.name} logo`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {college.name.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {college.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {college.location}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{college.eventsCount || 0} Events</span>
              <span>•</span>
              <span>{college.studentsCount || 0} Students</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}