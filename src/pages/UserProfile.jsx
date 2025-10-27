// src/pages/UserProfilePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Button } from "../components/ui/button";
import {
  PlusCircle,
  MessageCircle,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
} from "lucide-react";
import { cn } from "../lib/utils";

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // New status flags
  const [isConnected, setIsConnected] = useState(false); // accepted
  const [isPending, setIsPending] = useState(false); // pending
  const [amRequester, setAmRequester] = useState(false); // did I send the pending request?
  const [connectionId, setConnectionId] = useState(null);

  const [connectionStatusMsg, setConnectionStatusMsg] = useState("");
  const [counts, setCounts] = useState();

  // helper axios with token
  const authAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: "http://localhost:3000",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const api = await authAxios();
        const res = await api.get(`/api/v1/profile/${userId}`);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, getToken]);

  // Fetch posts (only load but will show only when accepted)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const api = await authAxios();
        const res = await api.get(`/api/v1/posts/${userId}`);
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    fetchPosts();
  }, [userId, getToken]);

  // Check connection status (returns isConnected / isPending)
  useEffect(() => {
    if (!userId) return;
    const check = async () => {
      try {
        const api = await authAxios();
        const res = await api.get(`/api/v1/connections/status/${userId}`);
        const data = res.data;
        // API now returns isConnected & isPending & amRequester & connectionId
        setIsConnected(Boolean(data.isConnected));
        setIsPending(Boolean(data.isPending));
        setAmRequester(Boolean(data.amRequester));
        setConnectionId(data.connectionId || null);
      } catch (err) {
        console.error("Error checking connection status:", err);
      }
    };
    check();
  }, [userId, getToken]);

  // connection counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const api = await authAxios();
        const res = await api.get("/api/v1/connections/counts");
        setCounts(res.data.data.acceptedCount);
      } catch (error) {
        console.error("Error fetching connection counts:", error);
      }
    };
    fetchCounts();
  }, [getToken]);

  // Send connection request
  const handleConnection = async (message = null) => {
    if (isConnecting || !user?._id) return;
    setIsConnecting(true);
    try {
      const api = await authAxios();
      const res = await api.post("/api/v1/connections/sendRequest", {
        receiverId: user._id,
        message,
      });

      if (res.data.success) {
        // Now it's pending and caller is the requester
        setIsPending(true);
        setAmRequester(true);
        setIsConnected(false);
        setConnectionStatusMsg("Request sent successfully!");
        // If API returned connection id
        setConnectionId(res.data.data?._id || res.data.data?._id || null);
      }
    } catch (error) {
      setConnectionStatusMsg(
        error.response?.data?.message || "Failed to send connection request"
      );
      console.error("send request error", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Cancel pending request (current user must be requester)
  const handleCancelRequest = async () => {
    if (!user?._id) return;
    try {
      const api = await authAxios();
      // API expects { receiverId }
      const res = await api.post("/api/v1/connections/cancelRequest", {
        receiverId: user._id,
      });
      if (res.data.success) {
        setIsPending(false);
        setAmRequester(false);
        setConnectionId(null);
        setConnectionStatusMsg("Request cancelled.");
      }
    } catch (err) {
      console.error("cancel error", err);
      setConnectionStatusMsg("Failed to cancel request");
    }
  };

  // Open chat (only available when accepted)
  const openChat = () => {
    if (!user?._id) return;
    navigate(`/chat/${user._id}`);
  };

  if (loading)
    return <p className="text-center mt-10 text-white">Loading...</p>;
  if (!user)
    return <p className="text-center mt-10 text-red-400">User not found</p>;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white w-full">
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            {/* Profile Card */}
            <div className="bg-muted/40 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition">
              {/* Profile Header */}
              <div className="relative">
                <div className="h-14 bg-gradient-to-r from-gray-700 to-gray-600"></div>
                <div className="px-3 text-center -mt-8">
                  <img
                    src={user.profileImage || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-20 h-20 rounded-full border-2 border-muted/40 object-cover mx-auto mb-2"
                  />
                  <h1 className="text-base font-semibold text-foreground mb-1">
                    {user.name}
                  </h1>
                  <p className="text-xs text-muted-foreground mb-3 leading-snug px-2">
                    {user.bio?.substring(0, 60) || "No bio added yet."}
                    {user.bio?.length > 60 && "..."}
                  </p>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="border-t border-gray-700 px-3 py-2 hover:bg-muted/20 cursor-pointer transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Profile viewers
                  </span>
                  <span className="text-xs text-blue-400 font-semibold">
                    {counts * 3 || 0}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 px-3 py-2 hover:bg-muted/20 cursor-pointer transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Connections
                  </span>
                  <span className="text-xs text-blue-400 font-semibold">
                    {counts || 0}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-700 px-3 py-3 space-y-2">
                {isConnected ? (
                  // Accepted -> show Message
                  <Button
                    onClick={openChat}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-full h-9 font-semibold text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                ) : isPending && amRequester ? (
                  // Pending & current user is requester -> show Cancel Request
                  <Button
                    onClick={handleCancelRequest}
                    className="w-full bg-gray-600 text-white flex items-center justify-center gap-2 rounded-full h-9 font-semibold text-sm"
                  >
                    Cancel Request
                  </Button>
                ) : isPending && !amRequester ? (
                  // Pending & current user is receiver -> show Pending (can accept elsewhere)
                  <Button
                    disabled
                    className="w-full bg-gray-700 text-white flex items-center justify-center gap-2 rounded-full h-9 font-semibold text-sm opacity-80"
                  >
                    Request Pending
                  </Button>
                ) : (
                  // No connection -> show Connect
                  <Button
                    onClick={() => handleConnection()}
                    disabled={isConnecting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-full h-9 font-semibold text-sm disabled:opacity-60"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                )}

                {connectionStatusMsg && (
                  <p
                    className={cn(
                      "text-xs text-center mt-3",
                      connectionStatusMsg.toLowerCase().includes("success")
                        ? "text-green-400"
                        : "text-red-400"
                    )}
                  >
                    {connectionStatusMsg}
                  </p>
                )}
              </div>
            </div>

            {/* About Card */}
            <div className="bg-muted/40 border border-gray-700 rounded-lg p-4 hover:shadow-lg transition">
              <h2 className="text-sm font-semibold text-foreground mb-2">
                About
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {user.bio || "This user hasn't added a bio yet."}
              </p>
            </div>
          </div>

          {/* Right Content - Activity Feed */}
          <div className="lg:col-span-9 space-y-4">
            {/* Action Buttons Card */}
            <div className="bg-muted/40 border border-gray-700 rounded-lg p-4">
              <div className="flex gap-2"></div>
            </div>

            {/* Activity Section */}
            <div className="bg-muted/40 border border-gray-700 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">
                    Activity
                  </h2>
                  <span className="text-xs text-blue-400 font-medium">
                    {posts.length} post{posts.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Show posts ONLY when accepted */}
              {isConnected ? (
                posts.length > 0 ? (
                  <div>
                    {posts.map((post, index) => (
                      <div
                        key={post._id}
                        className={cn(
                          "hover:bg-muted/20 transition",
                          index !== posts.length - 1 &&
                            "border-b border-gray-700"
                        )}
                      >
                        {/* Post contents (kept same as before) */}
                        <div className="px-4 pt-3 pb-2">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={
                                  user.profileImage ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="text-sm font-semibold text-foreground hover:underline cursor-pointer">
                                  {user.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {user.bio?.substring(0, 40) || "Professional"}
                                  {user.bio?.length > 40 && "..."}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {post.createdAt
                                    ? new Date(
                                        post.createdAt
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : "Recently"}{" "}
                                  • 🌐
                                </p>
                              </div>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground p-1">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </div>

                          {(post.title || post.description) && (
                            <div className="mb-2">
                              {post.title && (
                                <h4 className="text-sm font-medium text-foreground mb-1">
                                  {post.title}
                                </h4>
                              )}
                              {post.description && (
                                <p className="text-sm text-muted-foreground">
                                  {post.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {post.imageUrl && (
                          <div className="w-full">
                            <img
                              src={post.imageUrl}
                              alt={post.title || "Post image"}
                              className="w-full h-auto object-contain bg-black"
                              style={{ maxHeight: "450px" }}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          </div>
                        )}

                        <div className="px-4 py-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">
                                  👍
                                </div>
                              </div>
                              <span className="hover:underline cursor-pointer hover:text-blue-400">
                                {Math.floor(Math.random() * 50)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <span className="hover:underline cursor-pointer hover:text-blue-400">
                                {Math.floor(Math.random() * 10)} comments
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-around border-t border-gray-700 pt-1">
                            <button className="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:bg-muted/40 rounded text-sm font-medium transition">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Like</span>
                            </button>
                            <button className="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:bg-muted/40 rounded text-sm font-medium transition">
                              <MessageSquare className="h-4 w-4" />
                              <span>Comment</span>
                            </button>
                            <button className="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:bg-muted/40 rounded text-sm font-medium transition">
                              <Share2 className="h-4 w-4" />
                              <span>Share</span>
                            </button>
                            <button className="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:bg-muted/40 rounded text-sm font-medium transition">
                              <Send className="h-4 w-4" />
                              <span>Send</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-8 h-8 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      No posts yet
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {user.name} hasn't shared anything
                    </p>
                  </div>
                )
              ) : (
                // Not connected -> prompt to connect (no posts)
                <div className="text-center py-16 px-4">
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    Connect to view posts
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    You must connect with {user.name} to see their posts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
