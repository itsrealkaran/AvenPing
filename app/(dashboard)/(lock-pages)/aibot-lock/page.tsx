import Link from "next/link";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lock } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#DFFFF9] via-white to-[#FDCEFF]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 w-full max-w-2xl px-4 sm:px-6 py-8">
        <Card className="w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 border-2 border-cyan-200">
              <Lock className="h-7 w-7 text-cyan-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Bot is an Enterprise feature</h1>
            <p className="text-gray-600 max-w-lg">
              Your current plan does not include access to AI Bot. Upgrade to the Enterprise plan to
              unlock advanced automation, smarter workflows, and premium support.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-left">
                <div className="flex items-center gap-2 mb-1 text-gray-900 font-medium">
                  <Bot className="h-4 w-4 text-cyan-600" />
                  Smarter Automation
                </div>
                <p className="text-xs text-gray-600">LLM-powered replies and flow actions.</p>
              </div>
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-left">
                <div className="flex items-center gap-2 mb-1 text-gray-900 font-medium">
                  <Lock className="h-4 w-4 text-cyan-600" />
                  Unlimited Contacts
                </div>
                <p className="text-xs text-gray-600">Unlimited contacts and unlimited messages.</p>
              </div>
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-left">
                <div className="flex items-center gap-2 mb-1 text-gray-900 font-medium">
                  <Bot className="h-4 w-4 text-cyan-600" />
                  Premium Support
                </div>
                <p className="text-xs text-gray-600">Priority support and SLAs.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <Link href="/settings">
                <Button className="px-6">Upgrade to Enterprise</Button>
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 text-sm">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Page;