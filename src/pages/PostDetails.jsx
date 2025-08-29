import React from "react";
import { useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import PostCard from "../components/PostCard";

export default function PostDetails() {
  const { id } = useParams();
  const post = {
    id,
    title: "Lost Wallet",
    desc: "Black leather wallet found near the library. Contains ID and cash.",
    location: "G-10",
    author: "Amina",
    image: null,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main post and comments */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-6 md:p-8 space-y-6 transition hover:scale-[1.01] hover:shadow-xl">
          <PostCard post={post} />
        </div>

        <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-6 md:p-8">
          <CommentBox />
        </div>
      </div>

      {/* Sidebar with author info */}
      <aside className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-lg p-6 space-y-4">
        <h4 className="text-lg font-semibold text-[#D43F52]">Posted by</h4>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-xl text-white">
            A
          </div>
          <div>
            <p className="font-medium text-white">{post.author}</p>
            <p className="text-sm text-gray-400">Member since 2024</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
