import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Send } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PostCard from "@/components/post-card";
import type { FeedPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const postSchema = z.object({
  content: z.string().min(1, "Post content is required").max(1000, "Post content must be less than 1000 characters"),
});

type PostForm = z.infer<typeof postSchema>;

export default function SocialFeed() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<FeedPost[]>({
    queryKey: ['/api/feed'],
  });

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; author: string; college: string; imageUrl?: string }) => {
      const response = await apiRequest("POST", "/api/feed", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post Created!",
        description: "Your post has been shared with the community.",
      });
      form.reset();
      setSelectedImage(null);
      queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
    },
    onError: () => {
      toast({
        title: "Failed to create post",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostForm) => {
    // In a real app, these would come from user authentication
    const mockUser = {
      author: "Current User",
      college: "Your College",
    };

    let imageUrl = "";
    if (selectedImage) {
      // In a real implementation, this would upload the image
      imageUrl = `feed_image_${Date.now()}.jpg`;
    }

    createPostMutation.mutate({
      ...data,
      ...mockUser,
      imageUrl,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Social Feed
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stay connected with the college community
          </p>
        </div>

        {/* Create Post */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">You</span>
              </div>
              <div className="flex-1">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Share something with the community..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {selectedImage && (
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Selected image: {selectedImage.name}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="post-image"
                        />
                        <label htmlFor="post-image">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 dark:text-gray-400 hover:text-primary"
                            asChild
                          >
                            <span className="flex items-center space-x-2 cursor-pointer">
                              <Image className="w-4 h-4" />
                              <span>Add Photo</span>
                            </span>
                          </Button>
                        </label>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={createPostMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {createPostMutation.isPending ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed Posts */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Be the first to share something with the community!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
