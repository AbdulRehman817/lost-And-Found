import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

export default function CreatePostDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-md transition-all">
          + Create Post
        </Button>
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="max-w-lg bg-[#1E1E2F] text-white rounded-2xl shadow-2xl p-6 space-y-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-100">
            Create Lost/Found Post
          </DialogTitle>
        </DialogHeader>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            className="w-full bg-[#2A2A3C] text-gray-200 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Title"
          />
          <textarea
            className="w-full bg-[#2A2A3C] text-gray-200 border border-gray-600 rounded-lg px-4 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            placeholder="Description"
          ></textarea>
          <input
            className="w-full bg-[#2A2A3C] text-gray-200 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Location (Area, City)"
          />

          {/* File Upload (Styled) */}
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-[#2A2A3C] hover:bg-[#323248] transition-all">
            <span className="text-gray-400 text-sm">
              Click or drag & drop image
            </span>
            <input type="file" className="hidden" />
          </label>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all"
          >
            Cancel
          </Button>
          <Button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all">
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
