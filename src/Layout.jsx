import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AuthGuard from "./components/AuthGaurd";

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
  const location = useLocation();

  // Paths where Sidebar should be hidden
  const hideSidebarPaths = ["/", "/login", "/signup"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  // Check if current page is Home
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0B0B0C] text-white">
      {/* <Navbar /> */}
      <div className="flex flex-1">
        {/* Sidebar (not on Home/Login/Signup) */}

        {/* Main content */}
        <main
          className={
            isHomePage
              ? "flex-1 w-full" // full width for Hero page
              : "flex-1 max-w-6xl mx-auto w-full p-6" // constrained layout for others
          }
        >
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
        </main>
      </div>
    </div>
  );
}
