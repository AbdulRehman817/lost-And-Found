import * as React from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/footer";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Calendar,
  MapPin,
  Tag,
  MessageSquare,
  Heart,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Link, useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import { useAuth } from "@clerk/clerk-react";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = React.useState(null);
  const { getToken } = useAuth();
  const [likes, setLikes] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isLiking, setIsLiking] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);

  // Function to fetch like status and count
  const fetchLikeData = async () => {
    try {
      const token = await getToken();

      // Get total likes for the post - Fixed URL
      const likesResponse = await axios.get(
        `http://localhost:3000/api/v1/likes/${id}`, // Fixed: Added 'likes' to the path
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (likesResponse.data.success) {
        setLikes(likesResponse.data.count || 0);
      }

      // Check if current user has liked the post - Fixed URL
      const userLikeResponse = await axios.get(
        `http://localhost:3000/api/v1/likes/user/${id}`, // Fixed: Added 'likes' to the path
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userLikeResponse.data.success) {
        setIsLiked(userLikeResponse.data.isLiked || false);
      }
    } catch (error) {
      console.log("Error fetching like data:", error);
    }
  };

  const handleLike = async () => {
    if (isLiking) return; // Prevent multiple rapid clicks

    setIsLiking(true);
    const token = await getToken();

    try {
      if (isLiked) {
        // Unlike the post - Fixed URL
        const response = await axios.delete(
          `http://localhost:3000/api/v1/likes/${id}`, // Fixed: Added 'likes' to the path
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success || response.status === 200) {
          setIsLiked(false);
          setLikes((prev) => Math.max(0, prev - 1));
        }
      } else {
        // Like the post - Fixed URL
        const response = await axios.post(
          `http://localhost:3000/api/v1/likes/${id}`, // Fixed: Added 'likes' to the path
          {}, // Empty body, postId comes from URL params
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setIsLiked(true);
          setLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Error handling like:", error);
      // Optionally show error message to user
    } finally {
      setIsLiking(false);
    }
  };

  React.useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/feed/${id}`
        );
        const data = response.data.data;

        setPost({
          id: data?._id,
          title: data?.title,
          status: data?.type === "lost" ? "Lost" : "Found",
          location: data?.location,
          date: new Date(data?.createdAt).toLocaleDateString(),
          imageUrl: data?.imageUrl,
          description: data?.description,
          category: data?.category,
          tags: data?.tags || [],
          poster: {
            _id: data?.userId?._id,
            name: data?.userId?.name || "Anonymous",
            avatar: data?.userId?.avatar || "https://picsum.photos/seed/10/200",
            email: data?.userId?.email || "",
            phone: data?.userId?.phone || "",
          },
        });

        // Set initial like count from post data
        setLikes(data?.likeCount || 0);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
    fetchLikeData(); // Fetch like data when component mounts
  }, [id]);

  const handleConnection = async () => {
    if (isConnecting) return; // Prevent multiple clicks

    setIsConnecting(true);
    try {
      const token = await getToken();

      const res = await axios.post(
        "http://localhost:3000/api/v1/connections/sendRequest",
        { receiverId: post.poster._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setConnectionStatus("Connection request sent successfully!");
      }
    } catch (error) {
      console.log("ConnectionError", error);
      if (error.response?.data?.message) {
        setConnectionStatus(error.response.data.message);
      } else {
        setConnectionStatus("Failed to send connection request");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  if (!post) return <p className="text-center py-12">Loading item...</p>;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 sm:py-16 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Image */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-xl rounded-xl">
                <div className="relative aspect-[4/3] w-full">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                  {post.status === "Reunited" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                        <CheckCircle className="h-16 w-16 mx-auto text-green-400" />
                        <h2 className="text-3xl font-bold font-headline mt-2">
                          Reunited!
                        </h2>
                        <p className="text-green-200">
                          This item has been returned to its owner.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Post Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Badge
                      variant={
                        post.status === "Lost" ? "destructive" : "default"
                      }
                      className={cn("text-sm py-1 px-3 shadow-md")}
                    >
                      {post.status}
                    </Badge>
                    <h1 className="font-headline text-3xl font-bold lg:text-4xl mt-2">
                      {post.title}
                    </h1>
                  </div>

                  <div className="space-y-4 text-base">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Location
                        </p>
                        <p className="text-muted-foreground">{post.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Calendar className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Date</p>
                        <p className="text-muted-foreground">{post.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Tag className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Category
                        </p>
                        <p className="text-muted-foreground">{post.category}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Poster */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={post.poster.avatar}
                        alt={post.poster.name}
                      />
                      <AvatarFallback>
                        {post.poster.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {post.poster.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Poster</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Button
                  onClick={handleConnection}
                  disabled={isConnecting}
                  className="hidden sm:flex bg-[#3b82f6] hover:bg-[#3b82f6]/90 p-[20px] mx-auto w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {isConnecting ? "Sending..." : "Send Connection"}
                </Button>
                {connectionStatus && (
                  <p
                    className={cn(
                      "text-sm text-center mt-2",
                      connectionStatus.includes("success")
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {connectionStatus}
                  </p>
                )}
              </div>
            </div>

            {/* Description & Comments */}
            <div className="md:col-span-2 lg:col-span-3 space-y-8">
              <Card className="bg-background">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-headline text-2xl font-bold">
                    Description
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(Array.isArray(post.tags)
                      ? post.tags.join(",").split(",")
                      : post.tags.split(",")
                    ).map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="bg-[#1e293b] text-white text-sm px-3 py-1 rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background">
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-headline text-2xl font-bold flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" /> Community
                    Comments
                  </h2>

                  <CommentBox />

                  <Separator className="my-6" />

                  {/* Like Button */}
                  <div className="flex gap-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        disabled={isLiking}
                        className="flex items-center gap-2 text-muted-foreground hover:text-red-500"
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4",
                            isLiked ? "text-red-500 fill-current" : "",
                            isLiking ? "opacity-50" : ""
                          )}
                        />
                        <span>{likes}</span>
                        {isLiking && <span className="text-xs">...</span>}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
