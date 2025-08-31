import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// import Navbar from "./components/Navbar";
import AuthGuard from "./pages/AuthGuard";

import Home from "./pages/Home";
import Feed from "./pages/Feed";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function Layout() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0B0B0C] text-white">
      {/* <Navbar /> */}
      <div className="flex flex-1">
        {/* Sidebar (not on Home/Login/Signup) */}

        {/* Main content */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/feed"
            element={
              <AuthGuard>
                <Feed />
              </AuthGuard>
            }
          />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route
            path="/create"
            element={
              <AuthGuard>
                <CreatePost />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />

          <Route
            path="/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
