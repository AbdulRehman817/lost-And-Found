import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-10 text-center max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-[#3b82f6] mb-4">404</h1>
        <p className="text-gray-400 mb-6 text-lg">Oops! Page not found</p>
        <Link
          to="/"
          className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-full px-6 py-3 shadow-md transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
