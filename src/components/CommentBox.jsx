import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function CommentBox() {
  return (
    <div className="mt-6 p-5 bg-[#1E1F24] rounded-2xl shadow-md border border-[#2c2e34]">
      <h4 className="font-semibold text-[#E5E7EB] mb-4 text-lg">Comments</h4>

      {/* Example Comment */}
      <div className="space-y-5 mb-6">
        <div className="flex gap-3 items-start">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#2b2d33] flex items-center justify-center text-white font-bold">
            J
          </div>

          {/* Comment Content */}
          <div className="flex flex-col">
            <p className="text-sm text-[#E5E7EB]">
              <strong>John</strong>{" "}
              <span className="text-xs text-[#9CA3AF]">• 1h ago</span>
            </p>
            <p className="text-sm text-[#D1D5DB] mt-1">
              Hope you find it soon!
            </p>
          </div>
        </div>
      </div>

      {/* Add Comment */}
      <div className="flex gap-3 items-center">
        <Input
          placeholder="Add a comment..."
          className="flex-1 bg-[#2b2d33] border-none text-[#E5E7EB] placeholder-[#9CA3AF] rounded-xl focus:ring-2 focus:ring-[#3b82f6]"
        />
        <Button className="bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl">
          Send
        </Button>
      </div>
    </div>
  );
}
