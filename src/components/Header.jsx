import { useEffect } from "react";
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
  MessageSquare,
  MessageCircle,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
// import ConnectionNotifications from "./ConnectionNotifications";
// import CommentNotifications from "./CommentNotifications";
import UnifiedNotifications from "./UnifiedNotifications";

export function Header() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) navigate("/login");
  }, [isSignedIn, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
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

        <div className="flex items-center gap-5">
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

          {/* Chat Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/chat")}
            className="relative"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          {/* Connection Notifications Component */}
          {/* <ConnectionNotifications />
          <CommentNotifications /> */}
          <UnifiedNotifications />
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 object-cover">
                  <AvatarImage
                    src={user?.imageUrl}
                    className="object-coverupdated "
                  />
                  <AvatarFallback>
                    {user?.firstName?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
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

          {/* Mobile Menu */}
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
