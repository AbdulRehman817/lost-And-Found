import React from "react";

import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import Feed from "./Feed";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Feed */}
      <Feed />

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
