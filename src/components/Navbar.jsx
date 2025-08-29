import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { cn } from "../lib/utils";
import { Search, Bell } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Feed", path: "/feed" },
    { label: "Explore", path: "/explore" },
  ];

  return (
    <header className="w-full border-b border-[rgba(255,255,255,0.08)] bg-gradient-to-r from-[#0b0b0c]/95 to-[#141416]/95 backdrop-blur-xl z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand + nav */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-[#3b82f6] hover:opacity-90 transition"
          >
            Lost<span className="text-white">&</span>Found
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium relative">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative pb-1 transition-colors hover:text-[#3b82f6]",
                  location.pathname === link.path
                    ? "text-[#3b82f6] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#3b82f6] after:rounded-full"
                    : "text-[#a1a1aa]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search + auth */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="hidden md:flex items-center w-72 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6b7280]" />
            <Input
              placeholder="Search lost & found..."
              className="pl-9 bg-[#1c1c1e] border border-[#2a2a2d] text-sm text-gray-200 placeholder:text-[#6b7280] focus-visible:ring-2 focus-visible:ring-[#3b82f6] rounded-xl"
            />
          </div>

          {/* Notifications */}
          {isSignedIn && (
            <button className="relative p-2 rounded-full hover:bg-[#1c1c1e] transition">
              <Bell className="h-5 w-5 text-[#a1a1aa] hover:text-[#3b82f6]" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border border-[#0b0b0c]" />
            </button>
          )}

          {/* Auth */}
          {isSignedIn ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 hover:opacity-90 transition"
            >
              <Avatar className="h-9 w-9 ring-2 ring-[#1c1c1e] rounded-full shadow-md">
                <AvatarImage src="https://i.pravatar.cc/40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full px-6 py-2 shadow-md">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
