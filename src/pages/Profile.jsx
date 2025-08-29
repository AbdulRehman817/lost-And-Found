import React from "react";
import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import ProfileCard from "../components/ProfileCard";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <SignedIn>
        {/* Profile Card */}
        <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-6 md:p-8">
          <ProfileCard user={user} />
        </div>

        {/* User Posts */}
        <h3 className="text-xl font-semibold text-white">My Posts</h3>
        <div className="space-y-6">
          <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-6 md:p-8 transition hover:scale-[1.01] hover:shadow-xl">
            <PostCard
              post={{
                title: "Found Notebook",
                desc: "Blue notebook with notes",
                location: "College",
                author: user?.fullName || "You",
              }}
            />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-6 md:p-8 w-full max-w-md">
            <SignIn />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
