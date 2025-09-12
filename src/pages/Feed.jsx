// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Card, CardContent } from "../components/ui/card";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// // 🕒 Utility: Format time

// const Feed = () => {
//

//   // Like
//   const handleLike = (postId) => {
//     setPost((prev) =>
//       prev.map((p) => (p._id === postId ? { ...p, liked: !p.liked } : p))
//     );
//   };

//   // Toggle Comments
//   const toggleComments = (postId) => {
//     setOpenComments((prev) => ({
//       ...prev,
//       [postId]: !prev[postId],
//     }));
//   };

//   // Handle Comment Submit
//   const handleCommentSubmit = (postId) => {
//     if (!commentText[postId]?.trim()) return;

//     setPost((prev) =>
//       prev.map((p) =>
//         p._id === postId
//           ? {
//               ...p,
//               comments: [
//                 ...(p.comments || []),
//                 { userName: "You", text: commentText[postId] },
//               ],
//               commentCount: (p.commentCount || 0) + 1,
//             }
//           : p
//       )
//     );

//     // Clear input
//     setCommentText((prev) => ({ ...prev, [postId]: "" }));

//     // 👉 Optional: Send to backend here
//     // axios.post(`/api/v1/posts/${postId}/comment`, { text: commentText[postId] });
//   };

//   return (
//     <main className="flex-1 max-w-2xl border-r border-zinc-800">
//       {/* Sticky Header */}
//       <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
//         <h2 className="text-xl font-bold">Home</h2>
//       </div>

//       {/* Posts */}
//       <div className="divide-y divide-zinc-800">
//         {posts.map((post) => (
//           <div className="flex gap-3 p-4" key={post._id}>
//             {/* Avatar */}
//             <Avatar>
//               <AvatarImage src={post.userId?.profileImage} />
//               <AvatarFallback>
//                 {post.userId?.name?.charAt(0).toUpperCase() || "U"}
//               </AvatarFallback>
//             </Avatar>

//             {/* Post Content */}
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold">{post.userId?.name}</span>
//                 <span className="text-muted-foreground text-xs">
//                   • {formatTime(post.createdAt)}
//                 </span>
//               </div>

//               <p className="mt-2">{post.description}</p>

//               {post.imageUrl && (
//                 <Card className="mt-3 overflow-hidden rounded-2xl border-zinc-800">
//                   <CardContent className="p-0">
//                     <img
//                       src={post.imageUrl}
//                       alt="post"
//                       className="w-full h-auto"
//                     />
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Actions */}
//               <div className="flex items-center gap-6 mt-3 text-sm text-zinc-400">
//                 <button
//                   onClick={() => toggleComments(post._id)}
//                   className="hover:text-blue-400"
//                 >
//                   💬 {post.commentCount || 0}
//                 </button>
//                 <button
//                   onClick={() => handleLike(post._id)}
//                   className={`hover:text-red-400 ${
//                     post.liked ? "text-red-500" : ""
//                   }`}
//                 >
//                   ❤️ {post.likeCount || 0}
//                 </button>
//               </div>

//               {/* Comments */}
//               {openComments[post._id] && (
//                 <div className="mt-3 space-y-2 text-sm">
//                   {post.comments?.length ? (
//                     post.comments.map((c, idx) => (
//                       <div
//                         key={idx}
//                         className="border-b border-zinc-800 pb-1 text-zinc-300"
//                       >
//                         <span className="font-semibold">{c.userName}: </span>
//                         {c.text}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-zinc-500">No comments yet.</p>
//                   )}

//                   {/* Write a Comment */}
//                   <div className="flex gap-2 mt-2">
//                     <input
//                       type="text"
//                       value={commentText[post._id] || ""}
//                       onChange={(e) =>
//                         setCommentText((prev) => ({
//                           ...prev,
//                           [post._id]: e.target.value,
//                         }))
//                       }
//                       onKeyDown={(e) =>
//                         e.key === "Enter" && handleCommentSubmit(post._id)
//                       }
//                       placeholder="Write a comment..."
//                       className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 text-sm text-white"
//                     />
//                     <button
//                       onClick={() => handleCommentSubmit(post._id)}
//                       className="text-blue-400 text-sm"
//                     >
//                       Send
//                     </button>
//                   </div>

//                   <button
//                     onClick={() => toggleComments(post._id)}
//                     className="text-xs text-blue-400 hover:underline mt-1"
//                   >
//                     Hide comments
//                   </button>
//                 </div>
//               )}

//               {!openComments[post._id] && post.commentCount > 0 && (
//                 <button
//                   onClick={() => toggleComments(post._id)}
//                   className="text-xs text-blue-400 hover:underline mt-2"
//                 >
//                   View all comments
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// };

// export default Feed;

"use client";

import * as React from "react";

import { Header } from "../components/Header";
import { Footer } from "../components/footer";
import { ItemCard } from "../components/item-card";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Calendar as CalendarIcon,
  List,
  Map,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Calendar } from "../components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { useState, useEffect } from "react";
import axios from "axios";

// const items = [
//   {
//     id: "1",
//     title: "Lost: Black Leather Wallet",
//     status: "Lost",
//     location: "Central Park, New York",
//     date: "2024-07-20",
//     imageUrl: "https://picsum.photos/seed/1/400/300",
//     imageHint: "wallet",
//     user: {
//         name: "John Doe",
//         avatar: "https://picsum.photos/seed/10/100"
//     }
//   },
//   {
//     id: "2",
//     title: "Found: iPhone 14 Pro",
//     status: "Found",
//     location: "Starbucks, 12th Street",
//     date: "2024-07-19",
//     imageUrl: "https://picsum.photos/seed/2/400/300",
//     imageHint: "phone",
//      user: {
//         name: "Jane Smith",
//         avatar: "https://picsum.photos/seed/11/100"
//     }
//   },
//   {
//     id: "3",
//     title: "Lost: Golden Retriever 'Buddy'",
//     status: "Lost",
//     location: "Near Westlake Shopping Center",
//     date: "2024-07-18",
//     imageUrl: "https://picsum.photos/seed/3/400/300",
//     imageHint: "dog",
//      user: {
//         name: "Peter Jones",
//         avatar: "https://picsum.photos/seed/12/100"
//     }
//   },
//   {
//     id: "4",
//     title: "Found: Set of Keys",
//     status: "Found",
//     location: "Metro Station Platform B",
//     date: "2024-07-21",
//     imageUrl: "https://picsum.photos/seed/4/400/300",
//     imageHint: "keys",
//      user: {
//         name: "Maria Garcia",
//         avatar: "https://picsum.photos/seed/13/100"
//     }
//   },
//   {
//     id: "5",
//     title: "Lost: Blue Jansport Backpack",
//     status: "Lost",
//     location: "City University Library",
//     date: "2024-07-17",
//     imageUrl: "https://picsum.photos/seed/5/400/300",
//     imageHint: "backpack",
//      user: {
//         name: "Chris Williams",
//         avatar: "https://picsum.photos/seed/14/100"
//     }
//   },
//   {
//     id: "6",
//     title: "Found: Prescription Glasses",
//     status: "Found",
//     location: "Bus Stop on 5th Ave",
//     date: "2024-07-20",
//     imageUrl: "https://picsum.photos/seed/6/400/300",
//     imageHint: "glasses",
//      user: {
//         name: "Patricia Miller",
//         avatar: "https://picsum.photos/seed/15/100"
//     }
//   },
// ];

function Filters() {
  const [date, setDate] = useState();
  return (
    <Card className="border-none shadow-none lg:border lg:shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-xl">
          <SlidersHorizontal className="h-5 w-5" /> Filter Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Keyword</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="e.g., wallet, phone" className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="pets">Pets</SelectItem>
              <SelectItem value="personal">Personal Items</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input placeholder="e.g., Central Park" />
        </div>
        <div className="space-y-2">
          <Label>Date Lost/Found</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  );
}

export default function Feed() {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState({});
  const [commentText, setCommentText] = useState({}); // track input text

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/getAllPosts"
        );
        console.log(response);
        setPost(response.data.data);
      } catch (error) {
        console.log(error, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  const [view, setView] = React.useState("list");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4 py-12 md:px-6 lg:py-16">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Lost & Found Feed
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md bg-background p-1 border">
                  <Button
                    variant={view === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className="px-3 h-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "map" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("map")}
                    aria-label="Map view"
                    className="px-3 h-8"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="sr-only">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0">
                    <SheetHeader className="p-6 pb-0">
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Refine your search results.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="p-6">
                      <Filters />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {view === "list" ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((item) => (
                  <ItemCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <Card className="h-[600px] w-full overflow-hidden rounded-xl">
                <div className="relative h-full w-full bg-muted">
                  <Image
                    src="https://picsum.photos/seed/99/1200/600"
                    alt="Map of items"
                    fill
                    className="object-cover"
                    data-ai-hint="map"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/80 p-6 rounded-lg shadow-lg backdrop-blur-sm">
                    <p className="text-center font-semibold text-lg">
                      Interactive Map View
                    </p>
                    <p className="text-center text-muted-foreground mt-1">
                      Coming Soon!
                    </p>
                  </div>
                </div>
              </Card>
            )}
            <div className="flex justify-center mt-12">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
