"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

const Page: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const salt = await bcrypt.genSalt(
        Number(process.env.NEXT_PUBLIC_SALT_ROUND)
      );

      const passwordHash = await bcrypt.hash(password, salt);

      const response = await axios.post("/api/auth/signin", {
        email,
        password: passwordHash,
      });

      console.log(response);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-whatsapp/20 to-transparent" />
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-whatsapp/10 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-whatsapp/10 blur-3xl" />

      <div className="w-full max-w-md relative">
        <div className="mb-8 flex flex-col items-center">
          <div className="text-4xl font-bold text-whatsapp-dark mb-2 animate-fadeIn">
            AvenPing
          </div>
          <div className="text-gray-600 text-sm">
            Your Business Communication Hub
          </div>
        </div>

        <div className="border shadow-2xl backdrop-blur-sm bg-white/90 animate-slideUp rounded-lg overflow-hidden">
          <div className="p-6 pb-4 space-y-1">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-sm text-center text-gray-600">
              Sign in to your account
            </p>
          </div>
          <div className="p-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-hover:text-whatsapp" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 transition-all border-gray-200 focus:border-whatsapp focus:ring-whatsapp hover:border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-hover:text-whatsapp" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 transition-all border-gray-200 focus:border-whatsapp focus:ring-whatsapp hover:border-gray-300"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:text-whatsapp"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-whatsapp hover:bg-whatsapp-dark transition-colors duration-200 shadow-lg hover:shadow-whatsapp/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                href="/signup"
                className="text-whatsapp hover:underline font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
