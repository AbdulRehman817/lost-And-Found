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
  Inbox,
  MessageSquare,
  Package,
} from "lucide-react";
import { SignInButton, useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import { ThemeToggle } from "./theme-toggle";
import * as React from "react";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
export function Header() {
  const [notificationCount, setNotificationCount] = React.useState(2);

  const { isSignedIn, user } = useUser();

  const { signOut } = useClerk();
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect if not signed in
    if (!isSignedIn) {
      navigate("/login"); // Or "/" depending on your app
    }
  }, [isSignedIn, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(); // wait for Clerk to finish logging out
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
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
            <Link
              to="/"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              to="/feed"
              className="text-foreground/70 transition-colors hover:text-foreground"
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3b82f6]"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <Badge variant="secondary">{notificationCount} New</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/chat/1" className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="https://picsum.photos/seed/15/100"
                      alt="Sarah Lee"
                    />
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-semibold">Request Accepted</p>
                    <p className="text-muted-foreground">
                      You can now chat with Sarah Lee about "Found: iPhone 14
                      Pro".
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/profile?tab=requests"
                  className="flex items-start gap-3"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="https://picsum.photos/seed/16/100"
                      alt="Mike Chen"
                    />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-semibold">New Request</p>
                    <p className="text-muted-foreground">
                      Mike Chen sent a request for "Found: Set of Keys".
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-xs text-primary hover:!text-primary">
                See all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="relative h-10 w-10 rounded-full "
              >
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profileImageUrl ||
                      "https://api.dicebear.com/7.x/thumbs/svg?seed=user"
                    }
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/profile?tab=requests"
                  className="flex items-center"
                >
                  <Inbox className="mr-2 h-4 w-4" />
                  <span>Requests</span>
                  {notificationCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {notificationCount}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/messages" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile?tab=profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden shrink-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <ReuniteLogo className="h-8 w-8 text-primary" />
                  <span className="sr-only">Reunite</span>
                </Link>
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
                <Link
                  to="/feed"
                  className="text-muted-foreground hover:text-primary"
                >
                  Lost & Found Feed
                </Link>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary"
                >
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
