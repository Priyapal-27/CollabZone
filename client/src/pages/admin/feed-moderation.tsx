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
  Search, MessageSquare, User, Calendar, 
  Check, X, ArrowLeft, AlertTriangle, CheckCircle,
  Heart, MessageCircle, Image as ImageIcon
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { FeedPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function FeedModeration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: feedPosts, isLoading } = useQuery<FeedPost[]>({
    queryKey: ['/api/feed'],
  });

  const approveMutation = useMutation({
    mutationFn: async ({ postId, approved }: { postId: number; approved: boolean }) => {
      const response = await apiRequest("PUT", `/api/feed/${postId}`, { isApproved: approved });
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.approved ? "Post Approved!" : "Post Hidden",
        description: variables.approved 
          ? "The post has been approved and is now visible to all users."
          : "The post has been hidden from public view.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
    },
    onError: () => {
      toast({
        title: "Action Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("DELETE", `/api/feed/${postId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post Deleted",
        description: "The post has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
    },
    onError: () => {
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const statuses = ["all", "approved", "pending"];

  const filteredPosts = feedPosts?.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.college.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "approved" && post.isApproved) ||
                         (selectedStatus === "pending" && !post.isApproved);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleApprove = (post: FeedPost) => {
    approveMutation.mutate({ postId: post.id, approved: true });
  };

  const handleHide = (post: FeedPost) => {
    if (window.confirm("Are you sure you want to hide this post from public view?")) {
      approveMutation.mutate({ postId: post.id, approved: false });
    }
  };

  const handleDelete = (post: FeedPost) => {
    if (window.confirm("Are you sure you want to permanently delete this post? This action cannot be undone.")) {
      deleteMutation.mutate(post.id);
    }
  };

  // Calculate stats
  const approvedPosts = feedPosts?.filter(p => p.isApproved).length || 0;
  const pendingPosts = feedPosts?.filter(p => !p.isApproved).length || 0;
  const totalPosts = feedPosts?.length || 0;

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
                Feed Moderation
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Review and moderate social feed posts
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Posts</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {totalPosts}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved Posts</p>
                  <p className="text-2xl font-bold text-green-600">{approvedPosts}</p>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingPosts}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search posts by content, author, or college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className="capitalize"
                  >
                    {status === "all" ? "All Posts" : status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-20 w-full" />
                      <div className="flex items-center space-x-6">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
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
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {getInitials(post.author)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          {post.author}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {post.college}
                        </Badge>
                        <Badge className={post.isApproved 
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                          : "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                        }>
                          {post.isApproved ? "Approved" : "Pending"}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(post.createdAt!)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                        {post.content}
                      </p>
                      
                      {post.imageUrl && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <ImageIcon className="w-4 h-4" />
                            <span>Image attached</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Post ID: {post.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {!post.isApproved ? (
                        <Button
                          onClick={() => handleApprove(post)}
                          disabled={approveMutation.isPending}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleHide(post)}
                          disabled={approveMutation.isPending}
                          size="sm"
                          variant="outline"
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Hide
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleDelete(post)}
                        disabled={deleteMutation.isPending}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Delete
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
              {searchTerm || selectedStatus !== "all" ? (
                <>
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedStatus("all");
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No posts to moderate
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Posts will appear here as users create them
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
