import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { X, Users, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Connections
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                {acceptedRequests.length} active connection
                {acceptedRequests.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Connections Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : acceptedRequests.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 to-purple-900/20 border border-purple-500/20 backdrop-blur-xl p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
            <div className="relative text-center">
              <div className="inline-flex p-4 bg-purple-500/10 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                No connections yet
              </h3>
              <p className="text-purple-300 max-w-md mx-auto">
                Start connecting with others to see them here
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedRequests.map((req) => (
              <div
                key={req._id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-purple-900/30 border border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>

                <div className="relative p-6">
                  {/* Avatar & Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {(req.requesterId?.name || "U")[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate mb-1">
                        {req.requesterId?.name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-purple-300 truncate">
                        {req.requesterId?.email || "No email"}
                      </p>
                    </div>

                    {/* Discard Button (Top Right) */}
                    <Button
                      onClick={() => handleDiscard(req._id)}
                      className="flex-shrink-0 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white w-8 h-8 p-0 rounded-full transition-all duration-300"
                      title="Discard notification"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Connection accepted message */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                    <p className="text-green-300 text-sm">
                      ✓ Connection accepted
                    </p>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
