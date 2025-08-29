import React from "react";
import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#0b0b0c] to-[#141416] px-4">
      <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#3b82f6] mb-6 text-center">
          Create Your Account
        </h2>
        <SignUp path="/signup" routing="path" />
      </div>
    </div>
  );
}
