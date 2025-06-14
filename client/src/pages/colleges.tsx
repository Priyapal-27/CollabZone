import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CollegeCard from "@/components/college-card";
import type { College } from "@shared/schema";
import { useState } from "react";
import { Search } from "lucide-react";

export default function Colleges() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: colleges, isLoading } = useQuery<College[]>({
    queryKey: ['/api/colleges'],
  });

  const filteredColleges = colleges?.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Participating Colleges
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Discover amazing colleges and their upcoming events. Join the collaborative community!
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search colleges or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <div className="flex justify-center space-x-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Colleges Grid */}
        {!isLoading && (
          <>
            {filteredColleges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredColleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  No colleges found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "No colleges have registered yet"}
                </p>
                {!searchTerm && (
                  <Button className="bg-primary hover:bg-primary/90">
                    Be the First to Register
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Register CTA */}
        {!isLoading && filteredColleges.length > 0 && (
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Don't see your college?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Register your college today and start hosting amazing events!
            </p>
            <Button size="lg" className="bg-accent-custom hover:bg-accent-custom-dark text-white">
              Register Your College
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
