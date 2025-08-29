import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import React from "react";
import { motion } from "framer-motion";

const Feed = () => {
  const posts = [
    {
      id: 1,
      user: "Ayesha Khan",
      username: "@ayesha",
      avatar: "https://i.pravatar.cc/150?img=47",
      content:
        "Just found a wallet near Liberty Market. Contact me if it’s yours!",
      image: "https://source.unsplash.com/random/600x300/?wallet",
      time: "2h ago",
    },
    {
      id: 2,
      user: "Ali Raza",
      username: "@ali",
      avatar: "https://i.pravatar.cc/150?img=32",
      content: "Lost my cat last night near Gulshan. Please DM if spotted 🐱",
      image: "https://source.unsplash.com/random/600x300/?cat",
      time: "5h ago",
    },
  ];
  return (
    <>
      <main className="flex-1 max-w-2xl border-r border-zinc-800">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
          <h2 className="text-xl font-bold">Home</h2>
        </div>

        {/* Posts */}
        <div className="divide-y divide-zinc-800">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4"
            >
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback>{post.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.user}</span>
                    <span className="text-muted-foreground text-sm">
                      {post.username}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      • {post.time}
                    </span>
                  </div>
                  <p className="mt-2">{post.content}</p>
                  {post.image && (
                    <Card className="mt-3 overflow-hidden rounded-2xl border-zinc-800">
                      <CardContent className="p-0">
                        <img
                          src={post.image}
                          alt="post"
                          className="w-full h-auto"
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Feed;
