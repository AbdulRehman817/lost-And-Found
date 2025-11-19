import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [amRequester, setAmRequester] = useState(false);

  // Modal and message
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch connection status
  const fetchConnectionStatus = async (userMongoId) => {
    try {
      const token = await getToken();
      const statusRes = await axios.get(
        `http://localhost:3000/api/v1/connections/status/${userMongoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsConnected(statusRes.data.isConnected);
      setIsPending(statusRes.data.isPending);
      setAmRequester(statusRes.data.amRequester);
    } catch (err) {
      console.error("Error fetching connection status:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user data
        const userRes = await axios.get(
          `http://localhost:3000/api/v1/profile/${userId}`,
          { headers }
        );
        console.log("userData", userRes.data.user);
        setUser(userRes.data.user);

        // Fetch connection status first
        await fetchConnectionStatus(userRes.data.user._id);

        // Only fetch posts if connected
        // Note: We'll fetch after connection status is determined
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, getToken]);

  // Fetch posts only when connected
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?._id || !isConnected) return;

      try {
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };

        const postsRes = await axios.get(
          `http://localhost:3000/api/v1/posts/${userId}`,
          { headers }
        );
        setPosts(postsRes.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [user?._id, isConnected]);

  // Send connection request
  const handleSendRequest = async (msg = "") => {
    try {
      const token = await getToken();
      await axios.post(
        "http://localhost:3000/api/v1/connections/sendRequest",
        {
          receiverId: user._id,
          message: msg,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI immediately
      setIsPending(true);
      setAmRequester(true);
      setShowModal(false);
      setMessage("");
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Failed to send connection request. Please try again.");
    }
  };

  // Cancel connection request
  const handleCancelRequest = async () => {
    try {
      const token = await getToken();
      await axios.post(
        "http://localhost:3000/api/v1/connections/cancelRequest",
        { receiverId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI immediately
      setIsPending(false);
      setAmRequester(false);
    } catch (err) {
      console.error("Error cancelling request:", err);
      alert("Failed to cancel request. Please try again.");
    }
  };

  // Poll for connection status updates (optional - for real-time feel)
  useEffect(() => {
    if (!user?._id || !isPending) return;

    const interval = setInterval(async () => {
      await fetchConnectionStatus(user._id);
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [user?._id, isPending]);

  if (loading) {
    return (
      <div className="min-h-screen bg-card w-full flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-card w-full flex items-center justify-center">
        <p className="text-xl text-red-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card w-full">
      {/* Banner */}
      <div className="h-52 bg-background relative flex items-end">
        <div className="absolute bottom-[-60px] left-8">
          <img
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-8 mt-20 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          <p className="text-sm text-muted-foreground mt-1">
            📍 {user.location || "No location added"}
          </p>
        </div>

        {/* Connection buttons */}
        <div className="flex gap-3 mt-6 sm:mt-0">
          {isConnected ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/chat")}
            >
              Message
            </Button>
          ) : isPending && amRequester ? (
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleCancelRequest}
            >
              Cancel Request
            </Button>
          ) : isPending && !amRequester ? (
            <Button
              className="bg-gray-500 text-white cursor-not-allowed"
              disabled
            >
              Request Pending
            </Button>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowModal(true)}
            >
              Connect
            </Button>
          )}
        </div>
      </div>

      {/* About */}
      <div className="mt-10 px-8">
        <div className="bg-muted/40 shadow-md rounded-xl p-6 w-full">
          <h2 className="text-2xl font-semibold text-foreground">About</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {user.bio || "This user hasn't added a bio yet."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-3xl font-bold text-foreground">
            {user.connectionsCount || 0}
          </h3>
          <p className="text-muted-foreground text-sm">Connections</p>
        </div>
        <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-3xl font-bold text-foreground">
            {isConnected ? posts.length : "🔒"}
          </h3>
          <p className="text-muted-foreground text-sm">Posts</p>
        </div>
        <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-3xl font-bold text-foreground">
            {user.projectsCount || 0}
          </h3>
          <p className="text-muted-foreground text-sm">Projects</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-10 px-8 mb-12">
        <div className="bg-muted/40 shadow-md rounded-xl p-6 w-full">
          <h2 className="text-2xl font-semibold text-foreground">User Posts</h2>

          {/* Show posts only if connected */}
          {isConnected ? (
            posts.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {posts.map((post) => (
                  <li
                    key={post._id}
                    className="p-4 border rounded-lg shadow hover:shadow-md transition bg-card"
                  >
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {post.type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      📍 {post.location}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-muted-foreground">
                This user hasn't created any posts yet.
              </p>
            )
          ) : (
            // Locked state for non-connected users
            <div className="mt-6 text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-muted rounded-full p-4">
                  <Lock className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Posts are Private
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Connect with {user.name} to view their posts and activity.
              </p>

              {isPending && amRequester ? (
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  Your connection request is pending...
                </p>
              ) : isPending && !amRequester ? (
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  {user.name} sent you a connection request. Check your
                  notifications!
                </p>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowModal(true)}
                >
                  Send Connection Request
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connect Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Send Connection Request
            </h2>
            <p className="text-muted-foreground mb-2">
              Send a connection request to {user.name}
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message (optional)"
              className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mb-4">
              {message.length}/500 characters
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setMessage("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSendRequest(message)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {message ? "Send with Message" : "Send Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
