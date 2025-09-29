import React from "react";
import { Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar";
import AuthGuard from "./pages/AuthGuard";

import Home from "./pages/Home";
import Feed from "./pages/Feed";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import ProfilePage from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/About";
import UserProfilePage from "./pages/UserProfile"; // ✅ renamed import to match

export default function Layout() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0B0B0C] text-white">
      {/* <Navbar /> */}
      <div className="flex flex-1">
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

          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />

          <Route path="/feed/:id" element={<PostDetails />} />

          {/* ✅ fixed param name to match useParams in UserProfilePage */}
          <Route path="/profile/:userId" element={<UserProfilePage />} />

          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/create"
            element={
              <AuthGuard>
                <CreatePost />
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
