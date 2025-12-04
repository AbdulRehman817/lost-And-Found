import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { X, Users, Inbox } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function RequestsList() {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  // ✅ Fetch accepted requests
  const fetchAcceptedRequests = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        "https://pure-helenka-abdulrehmankashif-2b35ede6.koyeb.app/api/v1/connections/getAcceptedRequests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcceptedRequests(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching accepted requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Discard notification (local only)
  const handleDiscard = (notificationId) => {
    setAcceptedRequests((prev) =>
      prev.filter((req) => req._id !== notificationId)
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[#3b82f6]" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Connection Notifications
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {acceptedRequests.length} notification
                {acceptedRequests.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Connections List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#3b82f6] border-t-transparent"></div>
          </div>
        ) : acceptedRequests.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-background">
            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
              <Inbox className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No notifications
            </h3>
            <p className="text-muted-foreground text-sm">
              You're all caught up! New connection notifications will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {acceptedRequests.map((req) => (
              <div
                key={req._id}
                className="bg-background border rounded-lg p-4 hover:border-[#3b82f6]/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-semibold">
                      {(req.requesterId?.name || "U")[0].toUpperCase()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {req.requesterId?.name || "Unknown User"}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {req.requesterId?.email || "No email"}
                        </p>
                      </div>

                      {/* Discard Button */}
                      <Button
                        onClick={() => handleDiscard(req._id)}
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        title="Dismiss notification"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">
                        Connection accepted
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
