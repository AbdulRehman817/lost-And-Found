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
import { ChevronDown } from "lucide-react";

export default function UserInfoDialog() {
  const [open, setOpen] = useState(false);

  // Example user data
  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=user",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1e293b] rounded-md transition-all">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm bg-[#1E1E2F] text-white rounded-2xl shadow-2xl p-6 space-y-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-100">
            User Info
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full border-2 border-gray-600"
          />
          <div className="text-center">
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Account Type:</span>
            <span className="text-gray-400">Standard</span>
          </div>
          <div className="flex justify-between">
            <span>Member Since:</span>
            <span className="text-gray-400">Jan 2024</span>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all"
          >
            Close
          </Button>
          <Button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md transition-all">
            Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
