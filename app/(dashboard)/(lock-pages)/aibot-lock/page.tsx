import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Lock, ArrowRight } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6 text-center">
        {/* Lock Icon */}
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>

        {/* Main Message */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Feature Locked
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          AI Bot is an Enterprise feature. Upgrade your plan to unlock advanced
          automation and AI-powered workflows.
        </p>

        {/* Upgrade Button */}
        <div className="mb-6">
          <Link href="/settings">
            <button className="flex justify-center items-center w-full bg-[#43A2C9] hover:bg-cyan-600 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-[#43A2C9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base">
              Upgrade to Enterprise
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
