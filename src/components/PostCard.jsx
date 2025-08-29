import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post?.liked || false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post?.comments || []);
  const [showAllComments, setShowAllComments] = useState(false);

  const toggleLike = () => setLiked(!liked);
  const toggleCommentInput = () => setShowCommentInput(!showCommentInput);
  const toggleShowAllComments = () => setShowAllComments(!showAllComments);

  const addComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, { user: "You", text: newComment }]);
      setNewComment("");
    }
  };

  return (
    <div className="bg-[#1C1E21]/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-md transition hover:shadow-xl hover:scale-[1.01] overflow-hidden max-w-md mx-auto mb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-2">
        <div className="flex items-center gap-3">
          <img
            src={post?.avatar || `https://i.pravatar.cc/40?u=${post?.author}`}
            alt={post?.author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-white font-semibold text-sm">{post?.author}</h2>
            <p className="text-gray-400 text-xs">
              {post?.date} · {post?.location}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition">
          ⋯
        </button>
      </div>

      {/* Post Image */}
      {post?.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full max-h-72 object-cover mb-3"
        />
      )}

      {/* Post Content */}
      <div className="px-4 py-2 mb-3">
        {post?.title && (
          <h3 className="text-white font-semibold text-sm mb-1">
            {post.title}
          </h3>
        )}
        {post?.desc && <p className="text-gray-200 text-xs">{post.desc}</p>}
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-4 px-4 py-2 mb-2 text-gray-400 text-sm">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${
            liked ? "text-[#ef4444]" : "hover:text-[#ef4444]"
          }`}
        >
          <Heart className="h-4 w-4" fill={liked ? "red" : "none"} />
          {liked ? "Liked" : "Like"}
        </button>
        <button
          onClick={toggleCommentInput}
          className="flex items-center gap-1 hover:text-[#3b82f6]"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </button>
        <button className="flex items-center gap-1 hover:text-[#3b82f6]">
          <Send className="h-4 w-4 rotate-45" />
          Share
        </button>
      </div>

      {/* Likes & Comment Count */}
      <div className="px-4 py-1 text-gray-400 text-xs flex justify-between mb-2">
        <span>{liked ? 1 + comments.length : comments.length} Likes</span>
        <span>{comments.length} Comments</span>
      </div>

      {comments.length > 0 && (
        <div className="px-4 py-1 mb-2">
          <p
            className="text-gray-400 cursor-pointer hover:text-[#3b82f6] text-xs"
            onClick={toggleShowAllComments}
          >
            {showAllComments
              ? "Show less"
              : `View all ${comments.length} comments`}
          </p>
        </div>
      )}

      {/* Comments Section */}
      {showAllComments && (
        <div className="px-4 py-2 space-y-2 mb-2 text-xs">
          {comments.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                {c.user.charAt(0)}
              </div>
              <div className="bg-[#2b2d33] rounded-2xl p-1 flex-1">
                <p className="text-gray-200">
                  <span className="font-semibold text-white">{c.user}</span>{" "}
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Input */}
      {showCommentInput && (
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">
            Y
          </div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-full bg-[#2b2d33] text-white px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            onKeyDown={(e) => e.key === "Enter" && addComment()}
          />
          <button
            onClick={addComment}
            className="text-[#3b82f6] font-semibold px-2 py-1 rounded-full hover:bg-[#3b82f6]/20 transition text-xs"
          >
            Send
          </button>
          <button
            onClick={() => setShowCommentInput(false)}
            className="text-gray-400 font-semibold px-2 py-1 rounded-full hover:bg-gray-700 transition text-xs"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
