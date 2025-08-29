import React from "react";
import { Button } from "../components/ui/button";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      {/* Appearance Card */}
      <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-6 md:p-8 space-y-4">
        <h4 className="text-lg font-semibold text-white">Appearance</h4>
        <div className="flex gap-4">
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full px-6 py-2 shadow-md transition">
            Toggle Dark Mode
          </Button>
        </div>
      </div>

      {/* Additional Settings Cards can be added similarly */}
    </div>
  );
}
