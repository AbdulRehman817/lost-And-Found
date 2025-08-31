import React, { useState, useEffect } from "react";
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
import { SignInButton, useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function UserInfoDialog() {
  const [open, setOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not signed in
    if (!isSignedIn) {
      navigate("/login"); // Or "/" depending on your app
    }
  }, [isSignedIn, navigate]);

  let emailAddress = user?.primaryEmailAddress?.emailAddress || "";
  let username = user?.username || "";

  const handleLogout = () => {
    signOut();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="
            w-full flex items-center justify-between
            px-5 py-3
            bg-[#27293D] 
            rounded-lg
            hover:bg-[#353854]
            transition-colors duration-200
            cursor-pointer
            shadow-sm
          "
          aria-label="User info menu"
        >
          <div className="flex items-center gap-4">
            <img
              src={
                user?.profileImageUrl ||
                "https://api.dicebear.com/7.x/thumbs/svg?seed=user"
              }
              alt="User avatar"
              className="w-9 h-9 rounded-full border border-[#5E81F4]"
            />
            <div className="text-left text-sm relative right-[4px]">
              <p className="font-semibold text-gray-100 truncate max-w-[150px]">
                {username || "Guest"}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[150px]">
                {emailAddress || "Not signed in"}
              </p>
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm bg-[#1E1E2F] text-white rounded-2xl shadow-2xl p-6 space-y-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-100">
            User Info
          </DialogTitle>
        </DialogHeader>

        {/* Left aligned user info */}
        <div className="flex items-center gap-6">
          <img
            src={
              user?.profileImageUrl ||
              "https://api.dicebear.com/7.x/thumbs/svg?seed=user"
            }
            alt="avatar"
            className="w-20 h-20 rounded-full border-2 border-gray-600"
          />
          <div>
            <p className="text-lg font-semibold">{username || "Guest"}</p>
            <p className="text-sm text-gray-400">
              {emailAddress || "Not signed in"}
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-300 max-w-xs">
              <div className="flex justify-between">
                <span>Account Type:</span>
                <span className="text-gray-400">Standard</span>
              </div>
              <div className="flex justify-between">
                <span>Member Since:</span>
                <span className="text-gray-400">Jan 2024</span>
              </div>
            </div>
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
          {isSignedIn ? (
            <Button
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md transition-all"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          ) : (
            <SignInButton>
              <Button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all">
                Sign In
              </Button>
            </SignInButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
