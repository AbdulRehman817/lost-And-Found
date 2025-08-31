"use client";
import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

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

  const onSubmit = async (values) => {
    if (!isLoaded) return;

    setError("");

    // Simple client-side password match validation
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

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
      setError(err?.errors?.[0]?.message || "Sign-up failed.");
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;

    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });

      if (attempt.status === "complete") {
        await setActive({
          session: attempt.createdSessionId,
          navigate: async () => navigate("/"),
        });
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please check your code.");
    }
  };

  return (
    <div className="min-h-screen dark w-full flex items-center mx-auto justify-center bg-black ">
      <div className="w-full max-w-md bg-[#0f172a] p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          {pendingVerification ? "Verify Your Email" : "Create an Account"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {!pendingVerification ? (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="your_username" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <p className="text-center">
                    Already have an account?
                    <a
                      className="text-blue-500 text-right hover:underline"
                      href="/login"
                    >
                      {" "}
                      just login
                    </a>
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </Form>
          </>
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
