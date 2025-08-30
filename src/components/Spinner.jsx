import React from "react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-[100px]">
      <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}
