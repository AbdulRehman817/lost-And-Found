import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        "http://localhost:3000/api/v1/connections/getPendingRequests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.data || [];
      setRequests(data);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const token = await getToken();
      await axios.post(
        `http://localhost:3000/api/v1/connections/acceptRequest/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("❌ Error accepting request:", error);
    }
  };

  const handleChat = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  const pending = requests.filter((r) => r.status === "pending");
  const responded = requests.filter((r) => r.status !== "pending");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-3">Contact Requests</h2>
      <p className="text-gray-400 mb-6">
        Manage your item contact requests below.
      </p>

      <section className="mb-10">
        <h3 className="text-xl font-semibold text-white mb-4">
          Pending Requests ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <EmptyState text="You have no pending requests." />
        ) : (
          <div className="space-y-5">
            {pending.map((req) => (
              <RequestCard
                key={req._id}
                request={req}
                onAccept={handleAccept}
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold text-white mb-4">Responded</h3>
        {responded.length === 0 ? (
          <EmptyState text="No requests have been responded to yet." />
        ) : (
          <div className="space-y-5">
            {responded.map((req) => (
              <RequestCard
                key={req._id}
                request={req}
                onAccept={handleAccept}
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RequestCard({ request, onAccept, onChat }) {
  const { requesterId, status, _id } = request;

  return (
    <div className="bg-white dark:bg-[#1e1f24] border border-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Section: Profile */}
        <div className="flex items-center gap-4">
          <img
            src={requesterId?.profileImage}
            alt={requesterId?.name}
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />
          <div>
            <p className="text-lg font-medium text-white">
              {requesterId?.name || "Unknown User"}
            </p>
            <p className="text-sm text-gray-400">{requesterId?.email}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              status === "accepted"
                ? "bg-green-200 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Optional Message */}
      <div className="mt-4">
        <p className="text-gray-300 italic">
          (No message provided — consider adding messaging support.)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col md:flex-row gap-3 justify-end">
        {status === "pending" ? (
          <>
            <Button
              onClick={() => onAccept(_id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Accept Request
            </Button>
            <Button className="border border-gray-600 text-white px-6 py-2">
              Decline
            </Button>
          </>
        ) : (
          <Alert
            variant="default"
            className="w-full md:w-auto bg-green-50 dark:bg-green-900/20 border border-green-700/30 mt-3 md:mt-0"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-400 w-5 h-5" />
                <div>
                  <AlertTitle className="text-green-300 font-semibold">
                    Request Accepted
                  </AlertTitle>
                  <AlertDescription className="text-green-300">
                    You can now chat to coordinate item return.
                  </AlertDescription>
                </div>
              </div>
              <Button
                onClick={() => onChat(_id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 mt-3 md:mt-0"
              >
                <MessageSquare className="w-4 h-4 mr-2" /> Chat
              </Button>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg border-gray-600 text-gray-400">
      <p className="font-semibold">{text}</p>
    </div>
  );
}
