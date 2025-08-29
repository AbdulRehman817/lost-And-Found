import React from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function ProfileCard({ user }) {
  return (
    <Card className="bg-[#1E1F23]/70 backdrop-blur-md border border-[#2A2B2F] p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 max-w-sm mx-auto">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <Avatar className="h-16 w-16 ring-2 ring-[#2F80ED] ring-offset-2 ring-offset-[#1E1F23] hover:scale-105 transition-transform duration-300">
          <AvatarImage
            src={user?.imageUrl || "https://i.pravatar.cc/60"}
            alt={user?.fullName || "User"}
          />
          <AvatarFallback className="bg-[#2A2B2F] text-white font-bold text-lg">
            {(user?.fullName || "U")[0]}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] leading-tight">
            {user?.fullName || "User"}
          </h3>
          <p className="text-sm text-gray-400 mt-1 truncate max-w-[180px]">
            {user?.primaryEmailAddress?.emailAddress || "—"}
          </p>
        </div>
      </div>

      {/* Optional Follow Button */}
      <div className="mt-4 flex justify-end">
        <button className="px-4 py-1 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 text-sm">
          Follow
        </button>
      </div>
    </Card>
  );
}
