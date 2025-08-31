"use client";
import * as React from "react";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userLoaded && isSignedIn) {
      navigate("/"); // Redirect if already signed in
    }
  }, [isSignedIn, userLoaded, navigate]);

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [error, setError] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      await signIn.create({
        identifier: emailAddress,
        password,
      });

      await signIn.prepareFirstFactor({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      setError(
        err?.errors?.[0]?.message || "Sign-in failed. Please try again."
      );
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const signInAttempt = await signIn.attemptFirstFactor({ code });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async () => navigate("/"),
        });
      }
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Verification failed.");
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="min-h-screen w-full mx-auto flex items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-md bg-[#0F4C5C] p-8 rounded-xl shadow-lg border border-[#137C9E]">
        <h2 className="text-3xl font-semibold text-[#E0F7FA] mb-8 text-center tracking-tight">
          {pendingVerification ? "Verify Your Code" : "Sign In"}
        </h2>

        {error && (
          <div className="bg-[#FF5252]/20 text-[#FF5252] text-sm p-3 rounded mb-6 border border-[#FF5252]/40">
            {error}
          </div>
        )}

        {!pendingVerification ? (
          <>
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#B2EBF2] mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-[#195D6E] border border-[#29B6F6] text-[#E0F7FA] rounded-md px-4 py-3 placeholder-[#81D4FA] focus:outline-none focus:ring-4 focus:ring-[#29B6F6]/60 focus:border-[#29B6F6]"
                placeholder="you@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>

            <div className="mb-7">
              <label className="block text-sm font-medium text-[#B2EBF2] mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-[#195D6E] border border-[#29B6F6] text-[#E0F7FA] rounded-md px-4 py-3 placeholder-[#81D4FA] focus:outline-none focus:ring-4 focus:ring-[#29B6F6]/60 focus:border-[#29B6F6]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={onSignInPress}
              className="w-full bg-gradient-to-r from-[#00B8D4] to-[#00838F] text-white py-3 rounded-md shadow-md hover:from-[#00ACC1] hover:to-[#006064] transition"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div className="mb-7">
              <label className="block text-sm font-medium text-[#B2EBF2] mb-2">
                Verification Code
              </label>
              <input
                className="w-full bg-[#195D6E] border border-[#29B6F6] text-[#E0F7FA] rounded-md px-4 py-3 placeholder-[#81D4FA] focus:outline-none focus:ring-4 focus:ring-[#29B6F6]/60 focus:border-[#29B6F6]"
                placeholder="Enter the code sent to your email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <button
              onClick={onVerifyPress}
              className="w-full bg-gradient-to-r from-[#26A69A] to-[#00796B] text-white py-3 rounded-md shadow-md hover:from-[#43A047] hover:to-[#004D40] transition"
            >
              Verify & Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
