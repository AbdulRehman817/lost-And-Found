import React from "react";

// import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import Feed from "./Feed";
import Sidebar from "../components/Sidebar";
export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Feed */}
      <Feed />

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}

// import React from "react";
// import RightSidebar from "../components/RightSidebar";
// import Feed from "./Feed";
// import CustomSidebar from "../components/Sidebar";
// // import { Sidebar, SidebarProvider } from "../components/ui/sidebar";

// export default function Home() {
//   return (
//     // <SidebarProvider>

//     <div className="min-h-screen w-full bg-black text-white flex">
//       {/* Sidebar */}
//       <CustomSidebar />

//       {/* Feed */}
//       <Feed />

//       {/* Right Sidebar */}
//       <RightSidebar />
//     </div>
//     // </SidebarProvider>
//   );
// }
