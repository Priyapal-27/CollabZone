import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, Building2, MapPin, Mail, Calendar, 
  Check, X, ArrowLeft, AlertCircle, CheckCircle
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { College } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function CollegeApproval() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingColleges, isLoading } = useQuery<College[]>({
    queryKey: ['/api/admin/pending-colleges'],
  });

  const { data: approvedColleges } = useQuery<College[]>({
    queryKey: ['/api/colleges'],
  });

  const approveMutation = useMutation({
    mutationFn: async (collegeId: number) => {
      const response = await apiRequest("PUT", `/api/admin/colleges/${collegeId}/approve`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "College Approved!",
        description: `${data.name} has been successfully approved.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-colleges'] });
      queryClient.invalidateQueries({ queryKey: ['/api/colleges'] });
    },
    onError: () => {
      toast({
        title: "Approval Failed",
        description: "There was an error approving the college. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredColleges = pendingColleges?.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleApprove = (college: College) => {
    if (window.confirm(`Are you sure you want to approve "${college.name}"?`)) {
      approveMutation.mutate(college.id);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                College Approval
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Review and approve college registration requests
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Approval</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-orange-600">
                      {pendingColleges?.length || 0}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved Colleges</p>
                  <p className="text-2xl font-bold text-green-600">
                    {approvedColleges?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Colleges</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(approvedColleges?.length || 0) + (pendingColleges?.length || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search colleges by name, location, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pending Colleges List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-16 w-full" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredColleges.length > 0 ? (
          <div className="space-y-4">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {college.name.slice(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                              {college.name}
                            </h3>
                            <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                              Pending Approval
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{college.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <a 
                                href={`mailto:${college.email}`}
                                className="hover:text-primary transition-colors"
                              >
                                {college.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                              <Calendar className="w-4 h-4" />
                              <span>Registered on {formatDate(college.createdAt!)}</span>
                            </div>
                          </div>

                          {college.description && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Description</h4>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {college.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => handleApprove(college)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              {searchTerm ? (
                <>
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No colleges found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Try adjusting your search terms
                  </p>
                  <Button 
                    onClick={() => setSearchTerm("")}
                    variant="outline"
                  >
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No Pending Approvals
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All college registration requests have been processed
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
