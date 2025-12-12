import * as React from "react";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
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

function Filters({ onFilterChange }) {
  const [date, setDate] = useState();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleApplyFilters = () => {
    onFilterChange({
      keyword,
      category,
      location,
      date,
    });
  };

  return (
    <Card className="border-none shadow-none lg:border lg:shadow-sm">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="font-headline flex items-center gap-2 text-lg sm:text-xl">
          <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" /> Filter Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="space-y-2">
          <Label className="text-sm">Keyword</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="e.g., wallet, phone"
              className="pl-10 text-sm sm:text-base"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="text-sm sm:text-base">
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
          <Label className="text-sm">Location</Label>
          <Input
            placeholder="e.g., Central Park"
            className="text-sm sm:text-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Date Lost/Found</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal text-sm sm:text-base",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          className="w-full text-sm sm:text-base"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Feed() {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [filters, setFilters] = useState({});
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.location) params.append("location", filters.location);

      // Prepare headers
      const headers = {};

      // Add authentication token if user is signed in
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await axios.get(
        `https://net-dareen-abdulrehmankashif-9dc9dc64.koyeb.app/api/v1/getAllPosts?${params.toString()}`,
        { headers }
      );

      // Client-side filtering for keyword (if needed)
      let filteredPosts = response.data.data || [];

      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.title?.toLowerCase().includes(keyword) ||
            post.description?.toLowerCase().includes(keyword) ||
            post.tags?.some((tag) => tag.toLowerCase().includes(keyword))
        );
      }

      setPost(filteredPosts);
      console.log("feed", filteredPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-muted/40">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 md:py-12 lg:py-16">
          <div>
            {/* Header section with better mobile spacing */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Lost & Found Feed
              </h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* View toggle buttons */}
                <div className="flex items-center rounded-md bg-background p-1 border flex-1 sm:flex-initial">
                  <Button
                    variant={view === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className="px-3 h-8 flex-1 sm:flex-initial"
                  >
                    <List className="h-4 w-4" />
                    <span className="ml-2 text-xs sm:text-sm">List</span>
                  </Button>
                  <Button
                    variant={view === "map" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("map")}
                    aria-label="Map view"
                    className="px-3 h-8 flex-1 sm:flex-initial"
                  >
                    <Map className="h-4 w-4" />
                    <span className="ml-2 text-xs sm:text-sm">Map</span>
                  </Button>
                </div>
                {/* Filter button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 sm:px-4"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="ml-2 text-xs sm:text-sm">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="p-0 w-full sm:w-[400px] sm:max-w-[90vw]"
                  >
                    <SheetHeader className="p-4 sm:p-6 pb-0">
                      <SheetTitle className="text-lg sm:text-xl">
                        Filters
                      </SheetTitle>
                      <SheetDescription className="text-sm">
                        Refine your search results.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="p-4 sm:p-6">
                      <Filters onFilterChange={handleFilterChange} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
              </div>
            ) : view === "list" ? (
              <>
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                    {posts.map((item) => (
                      <ItemCard key={item._id} {...item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16 md:py-20 px-4">
                    <p className="text-muted-foreground text-base sm:text-lg">
                      No posts found. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <Card className="h-[400px] sm:h-[500px] md:h-[600px] w-full overflow-hidden rounded-lg sm:rounded-xl">
                <div className="relative h-full w-full bg-muted">
                  <img
                    src="https://picsum.photos/seed/99/1200/600"
                    alt="Map of items"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/90 p-4 sm:p-6 rounded-lg shadow-lg backdrop-blur-sm mx-4 max-w-sm">
                    <p className="text-center font-semibold text-base sm:text-lg">
                      Interactive Map View
                    </p>
                    <p className="text-center text-muted-foreground text-sm sm:text-base mt-1">
                      Coming Soon!
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Load more button */}
            {posts.length > 0 && (
              <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
                <Button
                  variant="outline"
                  className="text-sm sm:text-base px-6 sm:px-8"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
