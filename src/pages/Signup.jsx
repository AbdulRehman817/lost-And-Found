// import React, { useState } from "react";
// import { useSignUp } from "@clerk/clerk-react";
// import { useNavigate, Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "../components/ui/form";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import { ReuniteLogo } from "../components/icons";
// import { Mail, Lock, User, Upload, X } from "lucide-react";

// export default function SignUp() {
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const navigate = useNavigate();

//   const [profileImage, setProfileImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [pendingVerification, setPendingVerification] = useState(false);
//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const form = useForm({
//     defaultValues: {
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   // Image handling
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
//       setProfileImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeImage = () => {
//     setProfileImage(null);
//     setImagePreview(null);
//   };

//   // Step 1: Create account in Clerk
//   const onSubmit = async (values) => {
//     if (!isLoaded) return;
//     setError("");
//     setLoading(true);

//     if (values.password !== values.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     if (values.password.length < 8) {
//       setError("Password must be at least 8 characters");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Create the sign up with username, email, and password
//       await signUp.create({
//         username: values.username,
//         emailAddress: values.email,
//         password: values.password,
//       });

//       // Prepare email verification
//       await signUp.prepareEmailAddressVerification({
//         strategy: "email_code",
//       });

//       setPendingVerification(true);
//       setError("");
//     } catch (err) {
//       console.error("Sign-up error:", err);
//       const errorMessage =
//         err?.errors?.[0]?.message ||
//         err?.errors?.[0]?.longMessage ||
//         "Sign-up failed. Please try again.";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2: Verify email and complete sign up
//   const onVerify = async () => {
//     if (!isLoaded || !code || code.length !== 6) {
//       setError("Please enter a valid 6-digit code");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Verify the email with the code
//       const completeSignUp = await signUp.attemptEmailAddressVerification({
//         code: code.trim(),
//       });

//       if (completeSignUp.status !== "complete") {
//         throw new Error("Verification incomplete");
//       }

//       if (!completeSignUp.createdSessionId) {
//         throw new Error("Session creation failed");
//       }

//       // Activate the session
//       await setActive({ session: completeSignUp.createdSessionId });

//       // Wait for the session to be fully active
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Upload profile image to Clerk if provided
//       if (profileImage) {
//         try {
//           // Convert image to base64
//           const base64Image = await new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsDataURL(profileImage);
//           });

//           // Update Clerk user with profile image
//           await signUp.update({
//             profileImageUrl: base64Image,
//           });

//           console.log("Profile image uploaded to Clerk successfully");
//         } catch (imgErr) {
//           console.error("Image upload error:", imgErr);
//           // Don't block the flow if image upload fails
//         }
//       }

//       // The backend will automatically sync the user to MongoDB
//       // when they make their first authenticated request
//       // No need to manually call the backend here

//       // Navigate to home page
//       navigate("/");
//     } catch (err) {
//       console.error("Verification error:", err);

//       // Extract error message
//       if (err?.errors && err.errors.length > 0) {
//         const errorMessage =
//           err.errors[0]?.message ||
//           err.errors[0]?.longMessage ||
//           "Invalid verification code";
//         setError(errorMessage);
//       } else if (err?.message) {
//         setError(err.message);
//       } else {
//         setError("Invalid or expired verification code. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend verification code
//   const resendCode = async () => {
//     if (!isLoaded) return;
//     setLoading(true);
//     setError("");

//     try {
//       await signUp.prepareEmailAddressVerification({
//         strategy: "email_code",
//       });
//       setCode("");
//     } catch (err) {
//       console.error("Resend error:", err);
//       setError("Failed to resend code. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8 mt-8">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <ReuniteLogo />
//             <span className="text-3xl font-bold text-[#3b82f6]">Reunite</span>
//           </div>
//           <p className="text-muted-foreground">
//             {pendingVerification ? "Check your email" : "Create your account"}
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-card border rounded-lg shadow-sm p-8">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm">
//               {error}
//             </div>
//           )}

//           {!pendingVerification ? (
//             <>
//               {/* Sign Up Form */}
//               <Form {...form}>
//                 <form
//                   onSubmit={form.handleSubmit(onSubmit)}
//                   className="space-y-4"
//                 >
//                   {/* Username */}
//                   <FormField
//                     control={form.control}
//                     name="username"
//                     rules={{
//                       required: "Username is required",
//                       minLength: {
//                         value: 3,
//                         message: "Username must be at least 3 characters",
//                       },
//                     }}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Username</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input
//                               {...field}
//                               placeholder="johndoe"
//                               className="pl-10"
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Profile Image */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Profile Image
//                     </label>
//                     <div className="flex items-center gap-4">
//                       {imagePreview ? (
//                         <div className="relative">
//                           <img
//                             src={imagePreview}
//                             alt="Preview"
//                             className="w-20 h-20 rounded-full object-cover border-2 border-border"
//                           />
//                           <button
//                             type="button"
//                             onClick={removeImage}
//                             className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
//                           <Upload className="h-6 w-6 text-muted-foreground" />
//                         </div>
//                       )}
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="cursor-pointer flex-1"
//                       />
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Max size: 5MB. Supported formats: JPG, PNG, GIF
//                     </p>
//                   </div>

//                   {/* Email */}
//                   <FormField
//                     control={form.control}
//                     name="email"
//                     rules={{
//                       required: "Email is required",
//                       pattern: {
//                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                         message: "Invalid email address",
//                       },
//                     }}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input
//                               {...field}
//                               type="email"
//                               className="pl-10"
//                               placeholder="you@example.com"
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Password */}
//                   <FormField
//                     control={form.control}
//                     name="password"
//                     rules={{
//                       required: "Password is required",
//                       minLength: {
//                         value: 8,
//                         message: "Password must be at least 8 characters",
//                       },
//                     }}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Password</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input
//                               {...field}
//                               type="password"
//                               className="pl-10"
//                               placeholder="••••••••"
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Confirm Password */}
//                   <FormField
//                     control={form.control}
//                     name="confirmPassword"
//                     rules={{
//                       required: "Please confirm password",
//                       validate: (value) =>
//                         value === form.getValues("password") ||
//                         "Passwords do not match",
//                     }}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Confirm Password</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input
//                               {...field}
//                               type="password"
//                               className="pl-10"
//                               placeholder="••••••••"
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <Button
//                     type="submit"
//                     className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 h-11"
//                     disabled={loading}
//                   >
//                     {loading ? "Creating account..." : "Create Account"}
//                   </Button>
//                 </form>
//               </Form>

//               <p className="text-center text-sm text-muted-foreground mt-6">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   className="text-[#3b82f6] hover:underline font-medium"
//                 >
//                   Sign in
//                 </Link>
//               </p>
//             </>
//           ) : (
//             // Verification step
//             <div className="space-y-4">
//               <div className="text-center mb-4">
//                 <p className="text-sm text-muted-foreground mb-2">
//                   We've sent a verification code to
//                 </p>
//                 <p className="font-medium text-foreground">
//                   {form.getValues("email")}
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Verification Code</label>
//                 <Input
//                   placeholder="000000"
//                   value={code}
//                   onChange={(e) => {
//                     const value = e.target.value.replace(/\D/g, "");
//                     setCode(value);
//                     if (error) setError("");
//                   }}
//                   className="text-center text-2xl tracking-widest"
//                   maxLength={6}
//                   autoFocus
//                 />
//               </div>

//               <Button
//                 className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 h-11"
//                 onClick={onVerify}
//                 disabled={loading || code.length !== 6}
//               >
//                 {loading ? "Verifying..." : "Verify Email"}
//               </Button>

//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   className="flex-1"
//                   onClick={resendCode}
//                   disabled={loading}
//                 >
//                   Resend Code
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   className="flex-1"
//                   onClick={() => {
//                     setPendingVerification(false);
//                     setCode("");
//                     setError("");
//                   }}
//                   disabled={loading}
//                 >
//                   Back
//                 </Button>
//               </div>

//               <p className="text-xs text-center text-muted-foreground mt-4">
//                 Didn't receive the code? Check your spam folder or click Resend
//                 Code
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Terms */}
//         <p className="text-center text-xs text-muted-foreground mt-6">
//           By continuing, you agree to our{" "}
//           <a href="/terms" className="underline hover:text-foreground">
//             Terms
//           </a>{" "}
//           and{" "}
//           <a href="/privacy" className="underline hover:text-foreground">
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
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
import { ReuniteLogo } from "../components/icons";
import { Mail, Lock, User } from "lucide-react";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [profileImege, setProfileImage] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle email/password sign-up
  const onSubmit = async (values) => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (values.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
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
      setError(
        err?.errors?.[0]?.message || "Sign-up failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify email code
  const onVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });

        const token = await getToken();
        if (token) {
          localStorage.setItem("token", token);

          // Optional: sync with backend
          await fetch("http://localhost:3000/api/v1/profile", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 mt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ReuniteLogo />
            <span className="text-3xl font-bold text-[#3b82f6]">Reunite</span>
          </div>
          <p className="text-muted-foreground">
            {pendingVerification ? "Check your email" : "Create your account"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card border rounded-lg shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {!pendingVerification ? (
            <>
              {/* Sign Up Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    rules={{ required: "Username is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              placeholder="johndoe"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              className="pl-10"
                              placeholder="you@example.com"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              className="pl-10"
                              placeholder="••••••••"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{ required: "Please confirm your password" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              className="pl-10"
                              placeholder="••••••••"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 h-11"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>

              {/* Sign In Link */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#3b82f6] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            // Email Verification
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#3b82f6]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We sent a verification code to your email address
                </p>
              </div>

              <div>
                <FormLabel>Verification Code</FormLabel>
                <Input
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button
                className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 h-11"
                onClick={onVerify}
                disabled={loading || code.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setPendingVerification(false)}
              >
                Back to sign up
              </Button>
            </div>
          )}
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
