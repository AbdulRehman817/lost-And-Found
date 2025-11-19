import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Bell, MessageCircle, X } from "lucide-react";

export default function CommentNotifications() {
  const { getToken } = useAuth();
  const [comments, setComments] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    const saved = localStorage.getItem("dismissedCommentNotifications");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Filter out dismissed notifications
  const visibleComments = comments.filter((c) => !dismissedIds.has(c._id));

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "dismissedCommentNotifications",
      JSON.stringify([...dismissedIds])
    );
  }, [dismissedIds]);

  // Fetch comments
  const fetchCommentNotifications = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        "http://localhost:3000/api/v1/notifications/comments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.notifications || []);
      console.log("commentNotifications", res.data);
    } catch (error) {
      console.error("❌ Error fetching comment notifications:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCommentNotifications();
  }, []);

  // Poll every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchCommentNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    setDismissedIds((prev) => {
      const ns = new Set(prev);
      ns.add(id);
      return ns;
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {visibleComments.length > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="absolute h-full w-full rounded-full bg-primary animate-ping opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-[#3b82f6]" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-96 max-h-[500px] overflow-y-auto"
        align="end"
      >
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Comment Notifications</span>
          <Badge variant="secondary">{visibleComments.length}</Badge>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {visibleComments.map((comment) => (
          <div
            key={comment._id}
            className="px-2 py-3 hover:bg-muted/50 rounded-md"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user?.profileImage} />
                <AvatarFallback>
                  {comment.user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="h-3 w-3 text-blue-500" />
                  <p className="font-semibold text-sm">New Comment</p>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">
                    {comment.fromUser?.name}
                  </span>{" "}
                  commented on your post
                </p>

                <p className="text-xs text-muted-foreground italic border-l-2 border-muted pl-2 mb-2">
                  "{comment.text}"
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    asChild
                    className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    <Link to={`/post/${comment.postId}`}>View Post</Link>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={(e) => handleDismiss(comment._id, e)}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {visibleComments.length === 0 && (
          <div className="py-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No new comment notifications
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
