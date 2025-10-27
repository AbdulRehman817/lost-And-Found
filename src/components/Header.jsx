import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { ReuniteLogo } from "../components/icons";
import {
  Menu,
  User,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "../components/ui/badge";

export function Header() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const allRequests = [...pendingRequests, ...acceptedRequests]; // ✅ merged notifications

  useEffect(() => {
    if (!isSignedIn) navigate("/login");
  }, [isSignedIn, navigate]);

  useEffect(() => {
    if (isSignedIn) {
      fetchAllAcceptedRequets();
      fetchAllPendingRequets();
    }
  }, [isSignedIn]);

  // ✅ Auto refresh when Profile accepts request
  useEffect(() => {
    window.addEventListener("refresh-requests", refreshNotifications);
    return () =>
      window.removeEventListener("refresh-requests", refreshNotifications);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const refreshNotifications = () => {
    fetchAllAcceptedRequets();
    fetchAllPendingRequets();
  };

  const fetchAllAcceptedRequets = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        "http://localhost:3000/api/v1/connections/getAcceptedRequests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcceptedRequests(res.data.data);
    } catch (error) {
      console.error("❌ Error fetching accepted:", error);
    }
  };

  const fetchAllPendingRequets = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        "http://localhost:3000/api/v1/connections/getPendingRequests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRequests(res.data.data);
      console.log("getPendingRequests", res.data.data);
    } catch (error) {
      console.error("❌ Error fetching pending:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#3b82f6]/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 mr-4">
            <ReuniteLogo />
            <span className="font-headline text-2xl font-bold tracking-tight text-[#3b82f6]">
              Reunite
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link to="/" className="text-foreground/70 hover:text-foreground">
              Home
            </Link>
            <Link
              to="/about"
              className="text-foreground/70 hover:text-foreground"
            >
              About
            </Link>
            <Link
              to="/feed"
              className="text-foreground/70 hover:text-foreground"
            >
              Feed
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden sm:flex bg-[#3b82f6] hover:bg-[#3b82f6]/90"
          >
            <Link to="/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Report an Item
            </Link>
          </Button>

          <ThemeToggle />

          {/* ✅ Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {allRequests.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="absolute h-full w-full rounded-full bg-primary animate-ping opacity-75" />
                    <span className="relative h-2 w-2 rounded-full bg-[#3b82f6]" />
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <Badge variant="secondary">{allRequests.length}</Badge>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* ✅ Only 3 notifications */}
              {allRequests.slice(0, 3).map((u, index) => (
                <DropdownMenuItem asChild key={index}>
                  <Link
                    to={
                      u.status === "accepted"
                        ? `/chat/${u.requesterId?._id}`
                        : `/profile?tab=requests`
                    }
                    className="flex items-start gap-3"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.requesterId?.profileImage} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <div className="text-xs">
                      <p className="font-semibold">Request {u.status}</p>
                      <p className="text-muted-foreground">
                        {u.status === "accepted"
                          ? `Chat with ${u.requesterId?.name}`
                          : `${u.requesterId?.name} wants you to connect`}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}

              {allRequests.length === 0 && (
                <DropdownMenuItem
                  disabled
                  className="text-xs text-muted-foreground"
                >
                  No new notifications
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-xs text-primary">
                See all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ✅ User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" /> Messages
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/profile?tab=profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ✅ Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
                <Link to="/feed" className="hover:text-primary">
                  Lost & Found Feed
                </Link>
                <Link to="/about" className="hover:text-primary">
                  About
                </Link>
                <Button asChild>
                  <Link to="/create">Report an Item</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
