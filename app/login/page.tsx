"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Triangle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "@/components/landing/navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* So this is the bg I have added, ig you can change this with themes */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#DFFFF9] via-white to-[#FDCEFF]" />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-center space-y-1">
        <Navbar />
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-black/10 p-6 sm:p-8 w-full max-w-lg">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">
              Sign in to your account
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12 text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-left">
              <Link
                href="#"
                className="text-xs sm:text-sm text-[#43A2C9] hover:text-cyan-600 transition-colors"
              >
                Forgot Password
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#43A2C9] hover:bg-cyan-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-[#43A2C9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-xs sm:text-sm">Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              By proceeding, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="text-[#43A2C9] hover:text-cyan-600"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[#43A2C9] hover:text-cyan-600"
              >
                Privacy Policy
              </Link>
            </p>

            <p className="text-xs sm:text-sm text-gray-600">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="text-[#43A2C9] hover:text-cyan-600 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-500">
            Demo credentials: pushkarkamble23@gmail.com / 12345678
          </p>
        </div>
      </div>
    </div>
  );
}
