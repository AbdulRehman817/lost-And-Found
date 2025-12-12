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
    <div className="w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="keyword" className="text-sm font-medium">
            Keyword
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="keyword"
              placeholder="e.g., wallet, phone"
              className="pl-10 w-full"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="w-full">
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
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="location"
            placeholder="e.g., Central Park"
            className="w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Date Lost/Found</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="w-full mt-2" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
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
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.location) params.append("location", filters.location);

      const headers = {};

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
    <div className="flex min-h-screen flex-col bg-background w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 bg-muted/40 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8 lg:py-12">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                Lost & Found Feed
              </h2>

              {/* View Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center rounded-md bg-background border overflow-hidden">
                  <Button
                    variant={view === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className="rounded-none h-9 px-4"
                  >
                    <List className="h-4 w-4 mr-2" />
                    <span className="hidden xs:inline">List</span>
                  </Button>
                  <Button
                    variant={view === "map" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setView("map")}
                    aria-label="Map view"
                    className="rounded-none h-9 px-4"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    <span className="hidden xs:inline">Map</span>
                  </Button>
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md p-0">
                    <SheetHeader className="px-4 py-6 sm:px-6 border-b">
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Refine your search results
                      </SheetDescription>
                    </SheetHeader>
                    <div className="px-4 py-6 sm:px-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                      <Filters onFilterChange={handleFilterChange} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex justify-center items-center py-16 md:py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : view === "list" ? (
            <>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                  {posts.map((item) => (
                    <ItemCard key={item._id} {...item} />
                  ))}
                </div>
              ) : (
                <Card className="w-full">
                  <CardContent className="flex flex-col items-center justify-center py-16 md:py-24">
                    <p className="text-muted-foreground text-center text-base md:text-lg">
                      No posts found. Try adjusting your filters.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="w-full overflow-hidden rounded-lg">
              <div className="relative h-[50vh] min-h-[400px] md:h-[600px] w-full bg-muted">
                <img
                  src="https://picsum.photos/seed/99/1200/600"
                  alt="Map of items"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm">
                  <div className="bg-background/95 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
                    <p className="font-semibold text-lg mb-1">
                      Interactive Map View
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Coming Soon!
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Load More Button */}
          {posts.length > 0 && view === "list" && (
            <div className="flex justify-center mt-8 md:mt-12">
              <Button variant="outline" size="lg" className="min-w-[140px]">
                Load More
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
