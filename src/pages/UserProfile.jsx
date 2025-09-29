import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // ✅ Added
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:3000/api/v1/posts/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("userposts", res.data);
        setPosts(res.data.posts || []); // ✅ Save posts in state
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:3000/api/v1/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("userdata", res.data.user);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchPosts();
  }, [userId, getToken]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user)
    return <p className="text-center mt-10 text-red-500">User not found</p>;

  return (
    <div className="min-h-screen bg-card w-full">
      {/* Banner */}
      <div className="h-52 bg-background relative flex items-end">
        <div className="absolute bottom-[-60px] left-8">
          <img
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-8 mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-muted-foreground">
              {user.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user.location || "No location added"}
            </p>
          </div>
          <div className="flex gap-3 mt-6 sm:mt-0">
            <button className="px-6 py-2 bg-[#3B82F6] text-white rounded-full font-medium shadow hover:bg-[#2563EB] transition">
              Connect
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-100 transition">
              Message
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mt-10 px-8">
        <div className="bg-muted/40 shadow-md rounded-xl p-6 w-full">
          <h2 className="text-2xl font-semibold text-foreground">About</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {user.bio || "This user hasn’t added a bio yet."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-3xl font-bold text-foreground">
            {user.connections || 120}
          </h3>
          <p className="text-muted-foreground text-sm">Connections</p>
        </div>
        <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-3xl font-bold text-foreground">{posts.length}</h3>
          <p className="text-muted-foreground text-sm">Posts</p>
        </div>
        <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-3xl font-bold text-foreground">15</h3>
          <p className="text-muted-foreground text-sm">Projects</p>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-10 px-8 mb-12">
        <div className="bg-muted/40 shadow-md rounded-xl p-6 w-full">
          <h2 className="text-2xl font-semibold text-foreground">User Posts</h2>
          {posts.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className="p-4 border rounded-lg shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {post.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted-foreground">
              This user hasn’t created any posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
