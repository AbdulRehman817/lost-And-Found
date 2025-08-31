import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Spinner from "../components/Spinner";

export default function AuthGuard({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-900 text-zinc-100">
        <Spinner />
        <span className="ml-2">Loading...</span>
      </div>
    );

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
