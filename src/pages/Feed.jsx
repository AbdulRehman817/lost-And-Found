// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Card, CardContent } from "../components/ui/card";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";

// const Feed = () => {
//   const [posts, setPost] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           "http://localhost:3000/api/v1/getAllPosts"
//         );
//         // Axios automatically parses JSON, so just use response.data
//         const data = response.data.data;
//         console.log(data);
//         setPost(data);
//       } catch (error) {
//         console.log(error, "error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, []);

//   // const posts = [
//   //   {
//   //     id: 1,
//   //     user: "Ayesha Khan",
//   //     username: "@ayesha",
//   //     avatar: "https://i.pravatar.cc/150?img=47",
//   //     content:
//   //       "Just found a wallet near Liberty Market. Contact me if it’s yours!",
//   //     image: "https://source.unsplash.com/random/600x300/?wallet",
//   //     time: "2h ago",
//   //   },
//   //   {
//   //     id: 2,
//   //     user: "Ali Raza",
//   //     username: "@ali",
//   //     avatar: "https://i.pravatar.cc/150?img=32",
//   //     content: "Lost my cat last night near Gulshan. Please DM if spotted 🐱",
//   //     image: "https://source.unsplash.com/random/600x300/?cat",
//   //     time: "5h ago",
//   //   },
//   // ];
//   return (
//     <>
//       <main className="flex-1 max-w-2xl border-r border-zinc-800">
//         {/* Sticky Header */}
//         <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
//           <h2 className="text-xl font-bold">Home</h2>
//         </div>

//         {/* Posts */}
//         <div className="divide-y divide-zinc-800">
//           {posts.map((post, i) => (
//             <div className="flex gap-3" key={i}>
//               <Avatar>
//                 <AvatarImage src={post.imageUrl} />
//                 <AvatarFallback>{post.userId.name}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">{post.userId.name}</span>

//                   <span className="text-muted-foreground text-xs">
//                     • {post.time}
//                   </span>
//                 </div>
//                 <p className="mt-2">{post.description}</p>
//                 {post.imageUrl && (
//                   <Card className="mt-3 overflow-hidden rounded-2xl border-zinc-800">
//                     <CardContent className="p-0">
//                       <img
//                         src={post.imageUrl}
//                         alt="post"
//                         className="w-full h-auto"
//                       />

//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </>
//   );
// };

// export default Feed;

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import React, { useEffect, useState } from "react";
import axios from "axios";

// 🕒 Utility: Format time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Feed = () => {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState({});
  const [commentText, setCommentText] = useState({}); // track input text

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/getAllPosts"
        );
        setPost(response.data.data);
      } catch (error) {
        console.log(error, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  // Like
  const handleLike = (postId) => {
    setPost((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, liked: !p.liked } : p))
    );
  };

  // Toggle Comments
  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Handle Comment Submit
  const handleCommentSubmit = (postId) => {
    if (!commentText[postId]?.trim()) return;

    setPost((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              comments: [
                ...(p.comments || []),
                { userName: "You", text: commentText[postId] },
              ],
              commentCount: (p.commentCount || 0) + 1,
            }
          : p
      )
    );

    // Clear input
    setCommentText((prev) => ({ ...prev, [postId]: "" }));

    // 👉 Optional: Send to backend here
    // axios.post(`/api/v1/posts/${postId}/comment`, { text: commentText[postId] });
  };

  return (
    <main className="flex-1 max-w-2xl border-r border-zinc-800">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
        <h2 className="text-xl font-bold">Home</h2>
      </div>

      {/* Posts */}
      <div className="divide-y divide-zinc-800">
        {posts.map((post) => (
          <div className="flex gap-3 p-4" key={post._id}>
            {/* Avatar */}
            <Avatar>
              <AvatarImage src={post.userId?.profileImage} />
              <AvatarFallback>
                {post.userId?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {/* Post Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.userId?.name}</span>
                <span className="text-muted-foreground text-xs">
                  • {formatTime(post.createdAt)}
                </span>
              </div>

              <p className="mt-2">{post.description}</p>

              {post.imageUrl && (
                <Card className="mt-3 overflow-hidden rounded-2xl border-zinc-800">
                  <CardContent className="p-0">
                    <img
                      src={post.imageUrl}
                      alt="post"
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 mt-3 text-sm text-zinc-400">
                <button
                  onClick={() => toggleComments(post._id)}
                  className="hover:text-blue-400"
                >
                  💬 {post.commentCount || 0}
                </button>
                <button
                  onClick={() => handleLike(post._id)}
                  className={`hover:text-red-400 ${
                    post.liked ? "text-red-500" : ""
                  }`}
                >
                  ❤️ {post.likeCount || 0}
                </button>
              </div>

              {/* Comments */}
              {openComments[post._id] && (
                <div className="mt-3 space-y-2 text-sm">
                  {post.comments?.length ? (
                    post.comments.map((c, idx) => (
                      <div
                        key={idx}
                        className="border-b border-zinc-800 pb-1 text-zinc-300"
                      >
                        <span className="font-semibold">{c.userName}: </span>
                        {c.text}
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500">No comments yet.</p>
                  )}

                  {/* Write a Comment */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCommentSubmit(post._id)
                      }
                      placeholder="Write a comment..."
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 text-sm text-white"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className="text-blue-400 text-sm"
                    >
                      Send
                    </button>
                  </div>

                  <button
                    onClick={() => toggleComments(post._id)}
                    className="text-xs text-blue-400 hover:underline mt-1"
                  >
                    Hide comments
                  </button>
                </div>
              )}

              {!openComments[post._id] && post.commentCount > 0 && (
                <button
                  onClick={() => toggleComments(post._id)}
                  className="text-xs text-blue-400 hover:underline mt-2"
                >
                  View all comments
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Feed;
