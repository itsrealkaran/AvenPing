"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background matching your app theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#DFFFF9] via-white to-[#FDCEFF]" />

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-center space-y-1">
        {/* 404 Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-black/10 p-6 sm:p-8 w-full max-w-md sm:max-w-lg mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-6xl sm:text-8xl font-bold text-gray-200 select-none flex items-center justify-center">
              <img
                src="/AvenPing-404.png"
                alt="AvenPing Logo"
                className="h-20 sm:h-24 inline-block opacity-50"
              />
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#43A2C9] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>

            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[#43A2C9] hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#43A2C9] transition-all duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
