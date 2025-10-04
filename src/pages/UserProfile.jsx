// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import axios from "axios";
// import { Badge } from "../components/ui/badge"; // ✅ adjust path
// import { Button } from "../components/ui/button"; // ✅ adjust path
// import { PlusCircle } from "lucide-react";
// import { cn } from "../lib/utils"; // ✅ adjust path if needed

// export default function UserProfilePage() {
//   const { userId } = useParams();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { getToken } = useAuth();

//   const [isConnecting, setIsConnecting] = useState(false);
//   const [noteMessage, setNoteMessage] = useState("");
//   const [showNoteBox, setShowNoteBox] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [hasConnection, setHasConnection] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState("");

//   // ✅ Fetch user
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = await getToken();
//         const res = await axios.get(
//           `http://localhost:3000/api/v1/profile/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setUser(res.data.user);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [userId, getToken]);

//   // ✅ Fetch posts
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const token = await getToken();
//         const res = await axios.get(
//           `http://localhost:3000/api/v1/posts/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setPosts(res.data.posts || []);
//       } catch (error) {
//         console.error("Error fetching user posts:", error);
//       }
//     };

//     fetchPosts();
//   }, [userId, getToken]);

//   // ✅ Check connection status
//   useEffect(() => {
//     if (!user?._id) return;

//     const checkConnection = async () => {
//       try {
//         const token = await getToken();
//         const res = await axios.get(
//           `http://localhost:3000/api/v1/connections/status/${user._id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         console.log("res.data.isConnected", res.data);
//         setHasConnection(res.data.isConnected);
//       } catch (err) {
//         console.error("Error checking connection:", err);
//       }
//     };

//     checkConnection();
//   }, [user, getToken]);

//   // ✅ Handle connection request
//   const handleConnection = async (message = null) => {
//     if (isConnecting || !user?._id) return;
//     setIsConnecting(true);

//     try {
//       const token = await getToken();
//       const res = await axios.post(
//         "http://localhost:3000/api/v1/connections/sendRequest",
//         { receiverId: user._id, message },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         setConnectionStatus("Connection request sent successfully!");
//         setHasConnection(true);
//       }
//       console.log("connectionStatus", res.data);
//     } catch (error) {
//       console.log("ConnectionError", error);
//       setConnectionStatus(
//         error.response?.data?.message || "Failed to send connection request"
//       );
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading...</p>;
//   if (!user)
//     return <p className="text-center mt-10 text-red-500">User not found</p>;

//   return (
//     <div className="min-h-screen bg-card w-full">
//       {/* Banner */}
//       <div className="h-52 bg-background relative flex items-end">
//         <div className="absolute bottom-[-60px] left-8">
//           <img
//             src={user.profileImage || "https://via.placeholder.com/150"}
//             alt={user.name}
//             className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
//           />
//         </div>
//       </div>

//       {/* Profile Info */}
//       <div className="px-8 mt-20">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-4xl font-bold ">
//               {user.name}
//             </h1>
//             {hasConnection && (
//               <Badge variant="outline" className="mt-1 text-green-600">
//                 Connected
//               </Badge>
//             )}
//           </div>
//           <div className="flex gap-3 mt-6 sm:mt-0">
//             <div>
//               {!hasConnection && (
//                 <Button
//                   onClick={() => handleConnection()}
//                   disabled={isConnecting}
//                   className="hidden sm:flex bg-blue-600 hover:bg-blue-700 p-[20px] mx-auto w-full"
//                 >
//                   <PlusCircle className="mr-2 h-4 w-4" />
//                   {isConnecting ? "Sending..." : "Send Connection"}
//                 </Button>
//               )}

//               {connectionStatus && (
//                 <p
//                   className={cn(
//                     "text-sm text-center mt-2",
//                     connectionStatus.includes("success")
//                       ? "text-green-600"
//                       : "text-red-600"
//                   )}
//                 >
//                   {connectionStatus}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* About */}
//       <div className="mt-10 px-8">
//         <div className="bg-muted/40 shadow-md rounded-xl p-6 w-full">
//           <h2 className="text-2xl font-semibold text-foreground">About</h2>
//           <p className="mt-3 text-muted-foreground leading-relaxed">
//             {user.bio || "This user hasn’t added a bio yet."}
//           </p>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="mt-10 px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
//         <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
//           <h3 className="text-3xl font-bold text-foreground">
//             {user.connections || 120}
//           </h3>
//           <p className="text-muted-foreground text-sm">Connections</p>
//         </div>
//         <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
//           <h3 className="text-3xl font-bold text-foreground">{posts.length}</h3>
//           <p className="text-muted-foreground text-sm">Posts</p>
//         </div>
//         <div className="bg-muted/40 shadow-md rounded-xl p-6 text-center">
//           <h3 className="text-3xl font-bold text-foreground">15</h3>
//           <p className="text-muted-foreground text-sm">Projects</p>
//         </div>
//       </div>

//       {/* Posts */}
//       <div className="mt-10 px-8 mb-12">
//         <div className="bg-muted/40 shadow-md rounded-xl p-6 w-full">
//           <h2 className="text-2xl font-semibold text-foreground">User Posts</h2>
//           {posts.length > 0 ? (
//             <ul className="mt-4 space-y-4">
//               {posts.map((post) => (
//                 <li
//                   key={post._id}
//                   className="p-4 border rounded-lg shadow hover:shadow-md transition"
//                 >
//                   <h3 className="text-lg font-semibold">{post.title}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     {post.description}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="mt-3 text-muted-foreground">
//               This user hasn’t created any posts yet.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "../lib/utils";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({
    acceptedCount: 0,
    pendingReceivedCount: 0,
    pendingSentCount: 0,
    rejectedCount: 0,
    totalConnections: 0,
  });
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const [isConnecting, setIsConnecting] = useState(false);
  const [hasConnection, setHasConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");

  // ✅ Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:3000/api/v1/profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, getToken]);

  // ✅ Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:3000/api/v1/posts/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    fetchPosts();
  }, [userId, getToken]);

  // ✅ Check connection status
  useEffect(() => {
    if (!user?._id) return;
    const checkConnection = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:3000/api/v1/connections/status/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHasConnection(res.data.isConnected);
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };
    checkConnection();
  }, [user, getToken]);

  // ✅ Fetch connection counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:3000/api/v1/connections/counts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCounts(res.data.data);
      } catch (error) {
        console.error("Error fetching connection counts:", error);
      }
    };
    fetchCounts();
  }, [getToken]);

  // ✅ Handle connection request
  const handleConnection = async (message = null) => {
    if (isConnecting || !user?._id) return;
    setIsConnecting(true);
    try {
      const token = await getToken();
      const res = await axios.post(
        "http://localhost:3000/api/v1/connections/sendRequest",
        { receiverId: user._id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setConnectionStatus("Connection request sent successfully!");
        setHasConnection(true);
      }
    } catch (error) {
      setConnectionStatus(
        error.response?.data?.message || "Failed to send connection request"
      );
    } finally {
      setIsConnecting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-white">Loading...</p>;
  if (!user)
    return <p className="text-center mt-10 text-red-400">User not found</p>;

  return (
    <div className="min-h-screen bg-card text-white w-full">
      {/* Banner */}
      <div className="h-48 sm:h-56 bg-background relative">
        <div className="absolute bottom-[-60px] left-8 flex items-center gap-4">
          <img
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-[#0D0D0D] shadow-lg object-cover"
          />
          <div className="mt-16 sm:mt-20">
            <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">
              {user.bio || "No bio added yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Header Actions */}
      <div className="px-8 pt-24 sm:pt-20 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        {hasConnection && (
          <Badge variant="outline" className="text-green-400 border-green-400">
            Connected
          </Badge>
        )}
        {!hasConnection && (
          <Button
            onClick={() => handleConnection()}
            disabled={isConnecting}
            className="bg-[#D43F52] hover:bg-[#b93648] text-white px-6 py-2 rounded-full shadow-md transition"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isConnecting ? "Sending..." : "Connect"}
          </Button>
        )}
      </div>

      {connectionStatus && (
        <p
          className={cn(
            "text-sm text-center mt-2",
            connectionStatus.includes("success")
              ? "text-green-400"
              : "text-red-400"
          )}
        >
          {connectionStatus}
        </p>
      )}

      {/* Stats Section */}
      <div className="mt-10 px-8 grid grid-cols-2 sm:grid-cols-4 gap-4 ">
        <div className="bg-muted/40 border border-gray-700 rounded-xl p-5 text-center hover:shadow-md transition">
          <h3 className="text-2xl font-boldb text-foreground">
            {counts.acceptedCount}
          </h3>
          <p className="text-muted-foreground text-sm">Connections</p>
        </div>
        <div className="bg-muted/40 border border-gray-700 rounded-xl p-5 text-center hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-foreground">
            {counts.pendingReceivedCount}
          </h3>
          <p className="text-muted-foreground text-sm">Pending</p>
        </div>
        <div className="bg-muted/40 border border-gray-700 rounded-xl p-5 text-center hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-foreground">
            {counts.pendingSentCount}
          </h3>
          <p className="text-muted-foreground text-sm">Sent</p>
        </div>
        <div className="bg-muted/40 border border-gray-700 rounded-xl p-5 text-center hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-foreground">{posts.length}</h3>
          <p className="text-muted-foreground text-sm">Posts</p>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-8 px-8">
        <div className="bg-muted/40 border border-gray-700 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-muted-foreground]">
            About
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {user.bio || "This user hasn’t added a bio yet."}
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-8 px-8 pb-12">
        <div className="bg-muted/40 border border-gray-700 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-foreground">Posts</h2>
          {posts.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className="p-4 border border-gray-700 rounded-lg bg-[#0D0D0D] hover:bg-[#151515] transition"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {post.title}
                  </h3>
                  <p className="text-sm text-foreground">{post.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-foreground">
              This user hasn’t created any posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
