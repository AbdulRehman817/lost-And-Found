import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function CommentBox() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [postAuthorId, setPostAuthorId] = useState(null); // Store post author ID

  // Fetch post details to get author ID
  const fetchPostAuthor = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://net-dareen-abdulrehmankashif-9dc9dc64.koyeb.app/api/v1/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Adjust based on your API response structure
      setPostAuthorId(
        response.data.post?.userId?._id || response.data.post?.userId
      );
    } catch (error) {
      console.error("Error fetching post author:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://net-dareen-abdulrehmankashif-9dc9dc64.koyeb.app/api/v1/posts/${id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const comments = response.data.comments;
      setComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Check if current user is the post author
  const isPostAuthor = user?.id === postAuthorId;

  // 🔹 Add new comment
  const handlePostComment = async () => {
    if (!newComment.trim() || isPostAuthor) return;

    try {
      const token = await getToken();
      const response = await axios.post(
        `https://net-dareen-abdulrehmankashif-9dc9dc64.koyeb.app/api/v1/posts/${id}/comments`,
        {
          message: newComment,
          parentId: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const comment = response.data.data;
        const normalizedComment = { ...comment, replies: [] };
        setComments((prev) => [normalizedComment, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error.response?.data || error);
    }
  };

  // 🔹 Add reply to comment
  const handlePostReply = async (parentCommentId) => {
    if (!replyText.trim()) return;

    try {
      const token = await getToken();
      const response = await axios.post(
        `https://net-dareen-abdulrehmankashif-9dc9dc64.koyeb.app/api/v1/posts/${id}/comments`,
        {
          message: replyText,
          parentId: parentCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const reply = response.data.data;
        setComments((prev) =>
          prev.map((comment) => {
            if (comment._id === parentCommentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), reply],
              };
            }
            return comment;
          })
        );
        setReplyText("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error posting reply:", error.response?.data || error);
    }
  };

  // 🔹 Show reply box
  const showReplyBox = (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  // 🔹 Hide reply box
  const hideReplyBox = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  useEffect(() => {
    fetchPostAuthor();
    fetchComments();
  }, [id]);

  return (
    <div className="mt-8 bg-background">
      {/* Header */}
      <div className="border-b border-gray-800/50 pb-4 mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-5 mb-8">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={comment._id}
              className={`group ${
                index !== comments.length - 1
                  ? "border-b border-gray-800/30 pb-5"
                  : ""
              }`}
            >
              {/* Main Comment */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="w-10 h-10 ring-2 ring-gray-800/50">
                    <AvatarImage
                      src={comment.userId?.profileImage || ""}
                      className="object-cover"
                      alt={comment.userId?.name || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {comment.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Comment header */}
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white text-sm">
                      {comment.userId?.name || "Anonymous User"}
                    </h4>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <time className="text-xs text-gray-400">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Just now"}
                    </time>
                  </div>

                  {/* Comment message */}
                  <div className="bg-gray-800/30 rounded-xl px-4 py-3 mb-3">
                    <p className="text-gray-200 text-sm leading-relaxed break-words">
                      {comment.message}
                    </p>
                  </div>

                  {/* Comment actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => showReplyBox(comment._id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      Reply
                    </button>
                    {comment.replies && comment.replies.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reply Box */}
              {replyingTo === comment._id && (
                <div className="mt-4 ml-14">
                  <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage
                          src={user?.imageUrl || ""}
                          alt={user?.fullName || "You"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-xs">
                          {user?.firstName?.charAt(0)?.toUpperCase() || "Y"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder="Write a thoughtful reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="bg-gray-900/50 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 text-sm"
                        />

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handlePostReply(comment._id)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-medium"
                          >
                            Post Reply
                          </Button>
                          <Button
                            onClick={hideReplyBox}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-gray-700 px-4 py-1.5 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-14 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <Avatar className="w-8 h-8 ring-1 ring-gray-700/50">
                          <AvatarImage
                            src={reply.userId?.profileImage || ""}
                            alt={reply.userId?.name || "User"}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                            {reply.userId?.name?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-white text-sm">
                            {reply.userId?.name || "Anonymous User"}
                          </h5>
                          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          <time className="text-xs text-gray-500">
                            {reply.createdAt
                              ? new Date(reply.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "Just now"}
                          </time>
                        </div>

                        <div className="bg-gray-800/20 rounded-lg px-3 py-2">
                          <p className="text-gray-300 text-sm leading-relaxed break-words">
                            {reply.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h4 className="text-gray-400 font-medium mb-1">No comments yet</h4>
            <p className="text-sm text-gray-500">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>

      {/* Add Comment - Only show if NOT post author */}
      {!isPostAuthor ? (
        <div className="border-t border-gray-800/50 pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Avatar className="w-10 h-10 ring-2 ring-gray-800/50">
                <AvatarImage
                  src={user?.imageUrl || ""}
                  alt={user?.fullName || "You"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white font-semibold">
                  {user?.firstName?.charAt(0)?.toUpperCase() || "Y"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-3">
              <Input
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-gray-800/30 border-gray-700 focus:border-blue-500 text-white placeholder-gray-400 py-3 px-4 text-sm"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handlePostComment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium transition-colors duration-200"
                  disabled={!newComment.trim()}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-800/50 pt-6">
          <div className="bg-gray-800/20 rounded-xl p-6 text-center border border-gray-700/30">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <h4 className="text-gray-400 font-medium mb-1">
              You cannot comment on your own post
            </h4>
            <p className="text-sm text-gray-500">
              You can reply to other users' comments
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
