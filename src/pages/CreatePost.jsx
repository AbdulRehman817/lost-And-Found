import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("image", imageUrl);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/createPost",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("✅ Success:", res.data);
    } catch (err) {
      console.error("❌ Failed:", err);
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setImageUrl(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex justify-center items-start pt-10 px-4 sm:px-6">
      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl sm:max-w-2xl bg-[#111827] p-6 sm:p-8 rounded-xl shadow-xl border border-[#1f2937] flex flex-col gap-6"
      >
        {/* Heading */}
        <div className="pb-4 border-b border-[#1e293b]">
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Post</h1>
          <p className="text-sm text-gray-400 mt-1">
            Share something you lost or found with the community.
          </p>
        </div>

        {/* Avatar + Title */}
        <div className="flex items-start gap-4">
          <img
            src="https://api.dicebear.com/7.x/thumbs/svg?seed=user"
            alt="Avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#1e293b]"
          />
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What’s the item you've lost or found?"
            className="flex-1 bg-[#1f2937] text-gray-200 placeholder-gray-500 p-3 rounded-lg min-h-[80px] sm:min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details or context..."
          className="w-full bg-[#1f2937] text-gray-200 placeholder-gray-500 p-3 rounded-lg min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Category & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. Wallet, Phone, Pet)"
            className="bg-[#1f2937] text-gray-200 placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. Area, City)"
            className="bg-[#1f2937] text-gray-200 placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#374151] rounded-lg cursor-pointer bg-[#1f2937] hover:bg-[#2c3340] transition-all">
          <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
          <span className="text-sm text-gray-400">
            {imageUrl ? imageUrl.name : "Click or drag image here"}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setImageUrl(e.target.files[0])}
          />
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1e293b]">
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
