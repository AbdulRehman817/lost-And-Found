import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Step 1: Handle sign-up
  const onSubmit = async (values) => {
    if (!isLoaded) return;
    setError("");

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signUp.create({
        username: values.username,
        emailAddress: values.email,
        password: values.password,
      });

      // Prepare verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
      setError(err?.errors?.[0]?.message || "Sign-up failed.");
    }
  };

  // Step 2: Verify email
  const onVerify = async () => {
    if (!isLoaded) return;

    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });

        // ✅ Get token from Clerk after session is active
        const token = await getToken();
        if (token) {
          localStorage.setItem("token", token);
        }
        const res = await fetch("http://localhost:3000/api/v1/profile", {
          method: "GET", // just GET is enough, because syncClerkUser will create user if missing
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please check your code.");
    }
  };

  return (
    <div className="min-h-screen w-full mx-auto flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-[#0f172a] p-8 rounded-xl shadow-md border border-[#137C9E]">
        <h2 className="text-3xl font-semibold text-[#E0F7FA] mb-8 text-center tracking-tight">
          {pendingVerification ? "Verify Your Email" : "Create an Account"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {!pendingVerification ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-[#B2EBF2] mb-2">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full bg-[#195D6E] border border-[#29B6F6] text-[#E0F7FA] rounded-md px-4 py-3 placeholder-[#81D4FA] focus:outline-none focus:ring-4 focus:ring-[#29B6F6]/60 focus:border-[#29B6F6]"
                        placeholder="your_username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-[#B2EBF2] mb-2">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-[#195D6E] border border-[#29B6F6] text-[#E0F7FA] rounded-md px-4 py-3 placeholder-[#81D4FA] focus:outline-none focus:ring-4 focus:ring-[#29B6F6]/60 focus:border-[#29B6F6]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required", minLength: 6 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-[#B2EBF2] mb-2">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#195D6E] border border-[#29B6F6] text-[#E0F7FA] rounded-md px-4 py-3 placeholder-[#81D4FA] focus:outline-none focus:ring-4 focus:ring-[#29B6F6]/60 focus:border-[#29B6F6]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{ required: "Please confirm your password" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-[#B2EBF2] mb-2">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#195D6E] border border-[#29B6F6] text-[#E0F7FA] rounded-md px-4 py-3 placeholder-[#81D4FA] focus:outline-none focus:ring-4 focus:ring-[#29B6F6]/60 focus:border-[#29B6F6]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <p className="text-center text-gray-400">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-500 hover:underline">
                    just login
                  </a>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00B8D4] to-[#00838F] text-white py-3 rounded-md shadow-md hover:from-[#00ACC1] hover:to-[#006064] transition"
              >
                Continue
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button className="w-full" onClick={onVerify}>
              Verify & Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
