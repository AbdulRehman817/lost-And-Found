import * as React from "react";
import axios from "axios";
import { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Calendar,
  MapPin,
  Tag,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Link, useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PostDetails() {
  const { id } = useParams();
  const [hasConnection, setHasConnection] = useState(false);
  const [post, setPost] = useState(null);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  // 🔹 Fetch post details
  React.useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://net-dareen-abdulrehmankashif-9dc9dc64.koyeb.app/api/v1/feed/${id}`
        );
        const data = response.data.data;
        console.log("postDescription", data);
        setPost({
          id: data?._id,
          _id: data?._id,
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
            clerkId: data?.userId?.clerkId,
            name: data?.userId?.name || "Anonymous",
            avatar: data?.userId?.avatar || "https://picsum.photos/seed/10/200",
            email: data?.userId?.email || "",
            phone: data?.userId?.phone || "",
            imageUrl: data?.userId?.profileImage,
          },
        });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post)
    return (
      <>
        <div className="flex justify-center items-center mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );

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
                        <h2 className="text-3xl font-bold mt-2">Reunited!</h2>
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
                    <h1 className="text-3xl font-bold lg:text-4xl mt-2">
                      {post.title}
                    </h1>
                  </div>

                  <div className="space-y-4 text-base">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 mt-1 text-primary" />
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-muted-foreground">{post.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Calendar className="h-6 w-6 mt-1 text-primary" />
                      <div>
                        <p className="font-semibold">Date</p>
                        <p className="text-muted-foreground">{post.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Tag className="h-6 w-6 mt-1 text-primary" />
                      <div>
                        <p className="font-semibold">Category</p>
                        <p className="text-muted-foreground">{post.category}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Poster */}
              <Card>
                <CardContent className="p-6">
                  <Link to={`/profile/${post.poster._id}`}>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={post.poster.imageUrl}
                          className="object-cover"
                          alt={post.poster.name}
                        />
                        <AvatarFallback>
                          {post.poster.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{post.poster.name}</p>
                        <p className="text-sm text-muted-foreground">Poster</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Description & Comments */}
            <div className="md:col-span-2 lg:col-span-3 space-y-8">
              {/* Description */}
              <Card className="bg-background">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">Description</h2>
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
                        className="bg-slate-800 text-white text-sm px-3 py-1 rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comments Only */}
              <Card className="bg-background">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Community Comments
                  </h2>

                  {/* Only CommentBox kept */}
                  <CommentBox />

                  <Separator className="my-6" />
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
