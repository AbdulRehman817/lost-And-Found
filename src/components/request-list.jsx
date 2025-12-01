import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function RequestsList() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    fetchPendingRequests();
    fetchAcceptedRequests();
  }, []);

  // ✅ Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        "https://pure-helenka-abdulrehmankashif-2b35ede6.koyeb.app/api/v1/connections/getPendingRequests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRequests(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching pending requests:", error);
    }
  };

  // ✅ Fetch accepted requests
  const fetchAcceptedRequests = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        "https://pure-helenka-abdulrehmankashif-2b35ede6.koyeb.app/api/v1/connections/getAcceptedRequests", // 🔑 make sure this matches backend route
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcceptedRequests(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching accepted requests:", error);
    }
  };

  // ✅ Accept request
  const handleReject = async (requesterId) => {
    try {
      const token = await getToken();
      await axios.post(
        "https://pure-helenka-abdulrehmankashif-2b35ede6.koyeb.app/api/v1/connections/rejectRequest",
        { requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingRequests();
      fetchAcceptedRequests();
    } catch (error) {
      console.error("❌ Error accepting request:", error);
    }
  };
  const handleAccept = async (requesterId) => {
    try {
      const token = await getToken();
      await axios.post(
        "https://pure-helenka-abdulrehmankashif-2b35ede6.koyeb.app/api/v1/connections/acceptRequest",
        { requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingRequests();
      fetchAcceptedRequests();
    } catch (error) {
      console.error("❌ Error accepting request:", error);
    }
  };

  // ✅ Navigate to chat
  const handleChat = (connectionId) => {
    navigate(`/chat/${connectionId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <h2 className="text-2xl font-bold text-white mb-4">Connections</h2>

      {/* 🔸 Pending Requests */}
      <div>
        <h3 className="text-xl font-semibold text-orange-400 mb-4">
          Pending Requests
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg text-gray-400">
            No pending requests.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white dark:bg-[#1e1f24] border border-gray-700 rounded-lg p-5"
              >
                <p className="text-lg font-semibold text-white">
                  {req.requesterId?.name || "Unknown User"}
                </p>
                <p className="text-sm text-gray-400">
                  {req.requesterId?.email}
                </p>

                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={() => handleAccept(req.requesterId._id)}
                    className="bg-blue-600 text-white px-4"
                  >
                    Accept
                  </Button>
                  <Button
                    className="border border-gray-600 text-white px-4"
                    onClick={() => handleReject(req.requesterId._id)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔸 Accepted Requests */}
      <div>
        <h3 className="text-xl font-semibold text-green-400 mb-4">
          Accepted Requests
        </h3>

        {acceptedRequests.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg text-gray-400">
            No accepted requests.
          </div>
        ) : (
          <div className="space-y-4">
            {acceptedRequests.map((req) => (
              <Alert
                key={req._id}
                className="bg-green-50 dark:bg-green-900/20 border border-green-700/30"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <AlertDescription className="text-green-300">
                      You can now chat to{" "}
                      <span className="font-semibold">
                        {" "}
                        {req.requesterId.name || "Connection"}{" "}
                      </span>
                    </AlertDescription>
                  </div>
                  <Button
                    onClick={() => handleChat(req._id)}
                    className="bg-blue-600 text-white px-5"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Chat
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
