import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Heart, Share2, MessageCircle, Send, UserPlus, Users, UserCheck, Globe, Search,
  ThumbsUp, Image as ImageIcon, Camera, AtSign, MessageSquare, Bell
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Types for our business network models
interface BusinessProfile {
  id: number;
  userId: number;
  businessName: string;
  industry: string;
  description: string;
  location: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  founded?: string;
  size?: string;
  specialties: string[];
  verified: boolean;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    name?: string;
    username: string;
  };
}

interface BusinessPost {
  id: number;
  profileId: number;
  content: string;
  mediaUrls: string[];
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  profile?: BusinessProfile;
}

interface BusinessComment {
  id: number;
  postId: number;
  profileId: number;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  profile?: BusinessProfile;
}

const BusinessNetworkPage: React.FC = () => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("feed");
  const [newPostContent, setNewPostContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(null);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  // Query to get current user's business profile
  const { data: myProfile, isLoading: isLoadingMyProfile } = useQuery({
    queryKey: ["/api/business-network/my-profile"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/business-network/my-profile");
        return await res.json();
      } catch (error) {
        console.error("Error fetching my profile:", error);
        return null;
      }
    },
  });

  // Query to get feed posts
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/business-network/posts", activeTab],
    queryFn: async () => {
      try {
        let endpoint = "/api/business-network/posts";
        if (activeTab === "following") {
          endpoint = "/api/business-network/posts/following";
        }
        const res = await apiRequest("GET", endpoint);
        return await res.json();
      } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
      }
    },
  });

  // Query to get business profiles for discovery
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["/api/business-network/profiles", searchQuery],
    queryFn: async () => {
      try {
        let endpoint = "/api/business-network/profiles";
        if (searchQuery) {
          endpoint += `?search=${encodeURIComponent(searchQuery)}`;
        }
        const res = await apiRequest("GET", endpoint);
        return await res.json();
      } catch (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }
    },
  });

  // Mutation for creating a new post
  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/business-network/posts", { content });
      return await res.json();
    },
    onSuccess: () => {
      setNewPostContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/posts"] });
      toast({
        title: "Post Created",
        description: "Your post has been published successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for following a business profile
  const followMutation = useMutation({
    mutationFn: async (profileId: number) => {
      const res = await apiRequest("POST", `/api/business-network/follow/${profileId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/my-profile"] });
      toast({
        title: "Success",
        description: "You are now following this business.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to follow: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for unfollowing a business profile
  const unfollowMutation = useMutation({
    mutationFn: async (profileId: number) => {
      const res = await apiRequest("DELETE", `/api/business-network/follow/${profileId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/my-profile"] });
      toast({
        title: "Success",
        description: "You have unfollowed this business.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to unfollow: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for liking a post
  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await apiRequest("POST", `/api/business-network/posts/${postId}/like`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to like post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for commenting on a post
  const commentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      const res = await apiRequest("POST", `/api/business-network/posts/${postId}/comment`, { content });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to add comment: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: number; content: string }) => {
      const res = await apiRequest("POST", `/api/business-network/messages`, { 
        receiverId,
        content
      });
      return await res.json();
    },
    onSuccess: () => {
      setMessageContent("");
      setIsMessagingOpen(false);
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handler for submitting a new post
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      createPostMutation.mutate(newPostContent);
    }
  };

  // Handler for sending a message
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProfile && messageContent.trim()) {
      sendMessageMutation.mutate({
        receiverId: selectedProfile.id,
        content: messageContent
      });
    }
  };

  // Check if the current user is following a profile
  const isFollowing = (profileId: number) => {
    return false; // This would be replaced with actual logic once we have follow data
  };

  // Handle follow/unfollow action
  const handleFollowToggle = (profileId: number, isCurrentlyFollowing: boolean) => {
    if (isCurrentlyFollowing) {
      unfollowMutation.mutate(profileId);
    } else {
      followMutation.mutate(profileId);
    }
  };

  // Format time in a friendly way
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return "1 year ago";
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return "1 month ago";
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return "1 day ago";
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return "1 hour ago";
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return "1 minute ago";
    
    return "Just now";
  };

  // Open message dialog
  const openMessageDialog = (profile: BusinessProfile) => {
    setSelectedProfile(profile);
    setIsMessagingOpen(true);
  };

  return (
    <AdminLayout>
      <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Network</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar - User Profile */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="relative pb-0">
                <div className="h-24 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg"></div>
                <div className="absolute -bottom-10 left-6">
                  <Avatar className="h-20 w-20 border-4 border-white">
                    <AvatarImage 
                      src={myProfile?.logo || undefined} 
                      alt={myProfile?.businessName || "Business"} 
                    />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {myProfile?.businessName?.charAt(0) || user?.name?.charAt(0) || "B"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="pt-12 pb-4">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold">{myProfile?.businessName || "Your Business"}</h3>
                  {myProfile?.verified && (
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {myProfile?.industry || "Business"}
                </p>
                <p className="text-sm mt-3">
                  {myProfile?.description || "Complete your profile to add a description about your business."}
                </p>

                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm font-medium">{myProfile?.followers || 0} Followers</span>
                  </div>
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm font-medium">{myProfile?.following || 0} Following</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {!myProfile && (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800 text-sm">
                    <p>Create your business profile to start networking with other businesses.</p>
                    <Button variant="default" className="mt-2 w-full" size="sm">
                      Create Business Profile
                    </Button>
                  </div>
                )}

                <div className="text-sm text-muted-foreground mt-2">
                  <div className="flex items-center mb-1.5">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{myProfile?.website || "Add your website"}</span>
                  </div>
                  <div className="flex items-center">
                    <AtSign className="h-4 w-4 mr-2" />
                    <span>{user?.email || "Add your email"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Middle - Feed */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handlePostSubmit}>
                  <div className="flex">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage 
                        src={myProfile?.logo || undefined} 
                        alt={myProfile?.businessName || "Business"} 
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {myProfile?.businessName?.charAt(0) || user?.name?.charAt(0) || "B"}
                      </AvatarFallback>
                    </Avatar>
                    <Textarea
                      placeholder="Share news, updates, or insights..."
                      className="flex-1 resize-none"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      disabled={!myProfile}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <Button type="button" variant="ghost" size="sm" disabled={!myProfile}>
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Image
                      </Button>
                      <Button type="button" variant="ghost" size="sm" disabled={!myProfile}>
                        <Camera className="h-4 w-4 mr-1" />
                        Video
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!newPostContent.trim() || !myProfile || createPostMutation.isPending}
                    >
                      Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Tabs defaultValue="feed" className="mb-6" onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="feed" className="flex-1">All Posts</TabsTrigger>
                <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoadingPosts ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                {posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post: BusinessPost) => (
                      <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage 
                                src={post.profile?.logo || undefined} 
                                alt={post.profile?.businessName || "Business"} 
                              />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {post.profile?.businessName?.charAt(0) || "B"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <CardTitle className="text-base">
                                  {post.profile?.businessName || "Business"}
                                </CardTitle>
                                {post.profile?.verified && (
                                  <Badge variant="outline" className="ml-2 h-5 bg-blue-50 text-blue-700 border-blue-200">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="text-xs">
                                {post.profile?.industry} • {formatTimeAgo(post.createdAt)}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm">{post.content}</p>
                          {post.mediaUrls && post.mediaUrls.length > 0 && (
                            <div className="mt-3">
                              <img 
                                src={post.mediaUrls[0]} 
                                alt="Post media" 
                                className="rounded-lg w-full object-cover max-h-96" 
                              />
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <div className="flex space-x-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => likePostMutation.mutate(post.id)}
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              {post.shares}
                            </Button>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">More</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Save post</DropdownMenuItem>
                              <DropdownMenuItem>Report post</DropdownMenuItem>
                              <DropdownMenuItem>Hide this post</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openMessageDialog(post.profile!)}
                              >
                                Message
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground mb-4 text-center">
                        {activeTab === "feed" 
                          ? "No posts found. Be the first to post something!" 
                          : "You're not following anyone yet. Discover businesses to follow!"}
                      </p>
                      {activeTab === "following" && (
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab("feed")}
                        >
                          Discover Businesses
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>

        {/* Discovery Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Discover Businesses</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoadingProfiles ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles && profiles.length > 0 ? (
                profiles.map((profile: BusinessProfile) => (
                  <Card key={profile.id} className="overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                    <CardContent className="pt-4 relative">
                      <Avatar className="h-16 w-16 absolute -top-8 left-4 border-4 border-white">
                        <AvatarImage 
                          src={profile.logo || undefined} 
                          alt={profile.businessName} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {profile.businessName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-8">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{profile.businessName}</h3>
                          {profile.verified && (
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{profile.industry}</p>
                        <p className="text-sm mt-2 line-clamp-2">{profile.description}</p>
                        
                        <div className="flex items-center mt-3 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{profile.followers} followers</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button 
                        variant={isFollowing(profile.id) ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleFollowToggle(profile.id, isFollowing(profile.id))}
                        className="flex-1 mr-2"
                      >
                        {isFollowing(profile.id) ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => openMessageDialog(profile)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? `No businesses found matching "${searchQuery}"` 
                          : "No businesses found to connect with."}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messaging Dialog */}
      <Dialog open={isMessagingOpen} onOpenChange={setIsMessagingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message to {selectedProfile?.businessName}</DialogTitle>
            <DialogDescription>
              Send a direct message to connect with this business.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMessageSubmit}>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Write your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsMessagingOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!messageContent.trim() || sendMessageMutation.isPending}
              >
                {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BusinessNetworkPage;