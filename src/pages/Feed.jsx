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
import { useAuth } from "@clerk/clerk-react";

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
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      const token = await getToken();
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/getAllPosts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
                  <ItemCard key={item._id} {...item} />
                ))}
              </div>
            ) : (
              <Card className="h-[600px] w-full overflow-hidden rounded-xl">
                <div className="relative h-full w-full bg-muted">
                  <img
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
