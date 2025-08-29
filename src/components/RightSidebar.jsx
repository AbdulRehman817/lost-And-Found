import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const RightSidebar = () => {
  return (
    <>
      <aside className="hidden lg:flex flex-col w-80 p-6">
        <div className="bg-zinc-900 rounded-2xl p-4">
          <h3 className="font-semibold mb-4">Trending Now</h3>
          <div className="flex flex-col gap-3 text-sm">
            <p>#LostWallet • 1.2k posts</p>
            <p>#FoundKeys • 800 posts</p>
            <p>#MissingCat • 2.3k posts</p>
          </div>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 mt-6">
          <h3 className="font-semibold mb-4">Who to follow</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Sara</p>
                <p className="text-xs text-muted-foreground">@sara</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs"
            >
              Follow
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;
