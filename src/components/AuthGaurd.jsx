import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const { isSignedIn } = useUser();
  if (!isSignedIn) return <Navigate to="/login" replace />;
  return children;
}
