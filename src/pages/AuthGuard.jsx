import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function AuthGuard({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
