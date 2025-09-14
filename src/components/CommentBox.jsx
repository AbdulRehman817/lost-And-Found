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

  const fetchComments = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:3000/api/v1/posts/${id}/comments`,
        {
          headers: {
            //! my comments were not working because  i forgot to add authorization bearer token
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

  // 🔹 Add new comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = await getToken();
      const response = await axios.post(
        `http://localhost:3000/api/v1/posts/${id}/comments`,
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

  useEffect(() => {
    fetchComments();
  }, [id]);

  return (
    <div className="mt-6 p-5  rounded-2xl shadow-md border border-[#2c2e34] bg-background">
      <h4 className="font-semibold text-[#E5E7EB] mb-4 text-lg">Comments</h4>

      {/* 🔹 Comments List */}
      <div className="space-y-6 mb-6 ">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar>
                <AvatarImage
                  src={comment.userId?.profileImage || ""}
                  alt={comment.userId?.name || "User"}
                />
                <AvatarFallback>
                  {comment.userId?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">
                    {comment.userId?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <p className="text-muted-foreground mt-1">{comment.message}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first!
          </p>
        )}
      </div>

      {/* 🔹 Add Comment */}
      <div className="flex gap-3 bg-background">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handlePostComment} className="bg-[#3b82f6]">
          Post
        </Button>
      </div>
    </div>
  );
}
