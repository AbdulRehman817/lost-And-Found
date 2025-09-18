import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
// Dummy Requests

const initialRequests = [
  {
    id: 1,
    conversationId: "1",
    item: {
      id: "2",
      title: "Found: iPhone 14 Pro",
      imageUrl: "https://picsum.photos/seed/2/400/300",
    },
    requester: {
      name: "Sarah Lee",
      avatar: "https://picsum.photos/seed/15/100",
    },
    message:
      "Hi John, I think this might be my phone. It has a golden retriever lock screen. Can we meet at Starbucks tomorrow at 3 PM?",
    status: "pending",
  },
  {
    id: 2,
    conversationId: "2",
    item: {
      id: "4",
      title: "Found: Set of Keys",
      imageUrl: "https://picsum.photos/seed/4/400/300",
    },
    requester: {
      name: "Mike Chen",
      avatar: "https://picsum.photos/seed/16/100",
    },
    message:
      "Hey! Are these the keys with the small Eiffel Tower keychain? I lost mine near the metro station.",
    status: "pending",
  },
  {
    id: 3,
    conversationId: "3",
    item: {
      id: "1",
      title: "Lost: Black Leather Wallet",
      imageUrl: "https://picsum.photos/seed/1/400/300",
    },
    requester: {
      name: "David Kim",
      avatar: "https://picsum.photos/seed/17/100",
    },
    message:
      "I saw you found a wallet in Central Park. It's a black bifold wallet with a license for 'David K'.",
    status: "accepted",
  },
];

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const token = getToken();

  // Accept request

  const handleAccept = async (id) => {
    try {
      const token = await getToken();

      const res = await axios.get(
        "http://localhost:3000/api/v1/connections/getConnections",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data); // assuming API returns an array
    } catch (error) {
      console.error("❌ Error fetching connections:", error);
    }
  };

  // Navigate to chat
  const handleChat = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  const pending = requests.filter((r) => r.status === "pending");
  const responded = requests.filter((r) => r.status !== "pending");

  return (
    <div className="p-4 max-w-5xl  mx-auto bg-background rounded-md">
      <h2 className="text-2xl font-bold mb-2">Contact Requests</h2>
      <p className="text-gray-500 mb-6">
        Review and respond to requests about your items.
      </p>

      {/* Pending Requests */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">
          Pending Requests ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <EmptyState text="You have no pending requests." />
        ) : (
          <div className="space-y-6">
            {pending.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onAccept={handleAccept}
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </section>

      {/* Responded Requests */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Responded</h3>
        {responded.length === 0 ? (
          <EmptyState text="No requests have been responded to yet." />
        ) : (
          <div className="space-y-6">
            {responded.map((req) => (
              <RequestCard
                className="bg-background"
                key={req.id}
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

// Request Card Component
// Request Card Component
// Request Card Component
function RequestCard({ request, onAccept, onChat }) {
  return (
    <div className="rounded-xl shadow-lg overflow-hidden bg-background">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Image */}
        <div className="h-64 md:h-full w-full">
          <img
            src={request.item.imageUrl}
            alt={request.item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8 md:col-span-3 flex flex-col justify-between bg-background">
          {/* Title + Status */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-2xl">{request.item.title}</h4>
            <span
              className={`inline-block px-3 py-1.5 text-sm rounded-md font-medium ${
                request.status === "accepted"
                  ? "border-green-700/50 bg-green-900/20 text-green-400"
                  : "bg-muted text-white  rounded-md"
              }`}
            >
              {request.status}
            </span>
          </div>

          {/* Message */}
          <div className="flex items-start gap-4 mt-6 pt-4">
            <img
              src={request.requester.avatar}
              alt={request.requester.name}
              className="w-14 h-14 rounded-full"
            />
            <div className="bg-muted p-4 rounded-lg flex-1">
              <p className="text-base font-semibold">
                {request.requester.name} says:
              </p>
              <p className="text-base italic text-muted-foreground">
                "{request.message}"
              </p>
            </div>
          </div>

          {/* Actions */}
          {request.status === "pending" && (
            <div className="flex gap-3 justify-end mt-6">
              <Button
                onClick={() => onAccept(request.id)}
                className="px-5 py-2 text-base bg-[#3b82f6] hover:bg-blue-700"
              >
                Accept Request
              </Button>
              <Button className="px-5 py-2 text-base bg-background border-muted text-white border-2">
                Decline
              </Button>
            </div>
          )}

          {request.status === "accepted" && (
            <Alert
              variant="default"
              className="mt-6 border-green-200 bg-green-50 dark:border-green-700/50 dark:bg-green-900/20"
            >
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle className="font-semibold text-green-800 dark:text-green-200 text-lg">
                Request Accepted!
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                <div className="flex justify-between items-center">
                  <p className="text-base">
                    You can now securely chat to coordinate the return.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => onChat(request.conversationId)}
                    className="bg-[#3b82f6] px-5 py-2 text-base"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" /> Chat with{" "}
                    {request.requester.name}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ text }) {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-500">
      <p className="font-semibold">{text}</p>
    </div>
  );
}
