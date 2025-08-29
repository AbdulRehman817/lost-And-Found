import React from "react";
import CreatePostDialog from "../components/CreatePostDialog";

export default function CreatePost() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
        {/* Heading */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Create a New Post
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Share your thoughts or updates with the community.
          </p>
        </div>

        {/* Create Post Dialog */}
        <div>
          <CreatePostDialog />
        </div>

        {/* Note Section */}
        <p className="text-xs text-gray-400 italic text-center">
          ⚡ UI only — this form is static and ready to connect with your
          backend.
        </p>
      </div>
    </div>
  );
}
