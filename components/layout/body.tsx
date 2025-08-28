import type { LucideIcon } from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { forwardRef } from "react";

interface BodyProps {
  title: string;
  children: ReactNode;
  className?: string;
  onScrollRef?: (scrollRef: RefObject<HTMLDivElement>) => void;
}

const Body = forwardRef<HTMLDivElement, BodyProps>(
  ({ title, children, className, onScrollRef }, ref) => {
    return (
      <div
        className={`flex flex-col w-full h-full p-6 overflow-y-auto ${className}`}
        ref={ref}
      >
        <div className="flex items-center gap-1 mb-4">
          <h1 className="text-2xl font-400 text-gray-800">{title}</h1>
        </div>
        <div className="flex flex-col flex-1">{children}</div>
      </div>
    );
  }
);

Body.displayName = "Body";

export default Body;
