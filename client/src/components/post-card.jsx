import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return postDate.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {getInitials(post.author)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-800 dark:text-white">
                {post.author}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post.college}
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(post.createdAt)}
              </span>
            </div>
            
            <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
              {post.content}
            </p>

            {post.imageUrl && (
              <div className="mb-4">
                <img 
                  src={post.imageUrl} 
                  alt="Post image"
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}

            <div className="flex items-center space-x-6 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-2 ${
                  liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}