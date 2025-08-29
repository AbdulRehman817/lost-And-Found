import React from "react";
import { NavLink } from "react-router-dom";
import CreatePostDialog from "./CreatePostDialog";
import { cn } from "../lib/utils";
import { Home, Newspaper, PlusCircle, User, Settings } from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/feed", label: "Feed", icon: Newspaper },
    { to: "/create", label: "Create Post", icon: PlusCircle },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 p-6 gap-10 border-r border-[#1e293b] bg-gradient-to-b from-[#0f172a] to-[#0b1120] shadow-lg">
      {/* Branding */}
      <div className="px-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#3b82f6]">
          Lost <span className="text-white">&</span> Found
        </h2>
        <p className="text-sm text-[#94a3b8] mt-1">Community Lost & Found</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#1e293b] text-[#3b82f6] shadow-md"
                  : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-white hover:shadow-sm"
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom action */}
      <div className="mt-auto">
        <CreatePostDialog />
      </div>
    </aside>
  );
}
