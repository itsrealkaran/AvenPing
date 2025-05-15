import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
}

export function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-[#fcfcfd]", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-16 w-16">
          <div className="absolute h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <div className="absolute h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary" style={{ animationDelay: "-0.5s" }}></div>
        </div>
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    </div>
  );
} 