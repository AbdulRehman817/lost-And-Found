import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Newspaper,
  PlusCircle,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "../lib/utils";
import UserInfoDialog from "./UserInfoDialog";
export default function Sidebar() {
  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/feed", label: "Feed", icon: Newspaper },
    { to: "/create", label: "Create Post", icon: PlusCircle },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className=" text-center hidden lg:flex flex-col w-64 h-screen sticky top-0  gap-10 border-r border-[#1e293b] bg-gradient-to-b from-[#0f172a] to-[#0b1120] shadow-lg ">
      {/* Header / Brand */}
      <div className="flex items-center justify-between px-4 py-5 border-b">
        <div className="px-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#3b82f6]">
            Lost <span className="text-white">&</span> Found
          </h2>
          <p className="text-sm text-[#94a3b8] mt-1">Community Lost & Found</p>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex-1  overflow-y-auto px-2 py-4 space-y-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex text-center items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#1e293b] text-[#3b82f6] shadow-md"
                  : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-white hover:shadow-sm"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Section */}
      <div className="border-t p-4 mt-auto flex items-center justify-between">
        <UserInfoDialog />
      </div>
    </aside>
  );
}
