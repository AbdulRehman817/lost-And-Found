// ChatPage.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
export default function ChatPage() {
  const { getToken } = useAuth();
  const [meId, setMeId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [typingUserId, setTypingUserId] = useState(null);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const authAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: "https://pure-helenka-abdulrehmankashif-2b35ede6.koyeb.app",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const api = await authAxios();
        const meRes = await api.get("/api/v1/chat/me");
        const my = meRes.data.user || meRes.data;
        const myId = my._id || my.userId || my.id;
        if (!myId) throw new Error("Missing my ID");
        if (!mounted) return;
        setMeId(myId);

        socketRef.current = io(
          "https://pure-helenka-abdulrehmankashif-2b35ede6.koyeb.app",
          {
            query: { userId: myId },
          }
        );

        socketRef.current.on("connect", () => {
          socketRef.current.emit("join", myId);
        });

        socketRef.current.on("newMessage", (m) => {
          setMsgs((prev) => [...prev, m]);
          if (
            selected &&
            (m.senderId === selected._id || m.receiverId === selected._id)
          ) {
            scrollToBottom();
          }
        });

        socketRef.current.on("user-status", ({ userId, isOnline }) => {
          setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, isOnline } : u))
          );
        });

        socketRef.current.on("typing", ({ from }) => {
          setTypingUserId(from);
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(
            () => setTypingUserId(null),
            2000
          );
        });

        socketRef.current.on("stop-typing", () => setTypingUserId(null));

        await loadUsers(api);
      } catch (err) {
        console.error("init error", err);
      }
    })();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const loadUsers = async (apiClient) => {
    try {
      const api = apiClient || (await authAxios());
      const res = await api.get("/api/v1/chat/connected-users");
      const list = res.data.connectedUsers || res.data;
      setUsers(list.map((u) => ({ ...u, _id: u._id.toString() })));
    } catch (err) {
      console.error("loadUsers error", err);
    }
  };

  const openChat = async (user) => {
    setSelected(user);
    setMsgs([]);
    const api = await authAxios();
    const res = await api.get(`/api/v1/chat/messages/${user._id}`);
    const all = res.data.allMessages || res.data;
    setMsgs(all || []);
    scrollToBottom();
  };

  const sendMessage = async () => {
    if (!text.trim() || !selected || !meId) return;
    const content = text.trim();
    const to = selected._id;

    setMsgs((p) => [
      ...p,
      { message: content, senderId: meId, createdAt: new Date() },
    ]);
    setText("");
    scrollToBottom();
    socketRef.current.emit("stop-typing", { to });

    try {
      const api = await authAxios();
      await api.post("/api/v1/chat/send", { receiverId: to, message: content });
    } catch (err) {
      console.error("sendMessage error", err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  };

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <Header />
      <div className="flex h-screen w-full bg-[#0b141a] text-white">
        {/* Sidebar */}
        <div
          className={`md:flex flex-col w-full md:w-1/4 bg-[#202c33] border-r p-2 ${
            selected ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-4 font-bold border-b">Chats</div>

          {users.length ? (
            users.map((u) => (
              <div
                key={u._id}
                onClick={() => openChat(u)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#2a3942] ${
                  selected?._id === u._id ? "bg-[#2a3942]" : ""
                }`}
              >
                <img
                  src={u.profileImage || "/default-avatar.png"}
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="font-medium">{u.name}</div>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-400">No connected users</p>
          )}
        </div>

        {/* Chat area */}
        <div
          className={`flex-1 flex flex-col ${
            selected ? "flex" : "hidden md:flex"
          }`}
        >
          {selected ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b bg-[#202c33]">
                <button className="md:hidden" onClick={() => setSelected(null)}>
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={selected.profileImage || "/default-avatar.png"}
                  alt={selected.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold">{selected.name}</div>
                  <div
                    className={`text-sm ${
                      selected.isOnline ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {selected.isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-auto flex flex-col gap-3 bg-[#111b21]"
              >
                {msgs.length ? (
                  msgs.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-xs p-2 rounded-2xl ${
                        m.senderId === meId
                          ? "self-end bg-[#005c4b]"
                          : "self-start bg-[#202c33]"
                      }`}
                    >
                      <div>{m.message}</div>
                      <div className="text-xs text-gray-400 text-right mt-1">
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center">No messages</div>
                )}
              </div>

              {/* Typing */}
              {typingUserId === selected._id && (
                <div className="px-4 py-1 bg-red-600 text-sm text-gray-300 italic">
                  {selected.name} is typing...
                </div>
              )}

              {/* Input */}
              <div className="p-3 bg-[#202c33] flex gap-3 items-center border-t">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 rounded-full bg-[#2a3942] outline-none"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-[#00a884] px-4 py-2 rounded-full"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center justify-center flex-1 text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </>
  );
}
