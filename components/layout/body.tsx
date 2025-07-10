import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface BodyProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Body({ title, children, className }: BodyProps) {
  return (
    <div className={`flex flex-col w-full h-full p-6 overflow-y-auto ${className}`}>
      <div className="flex items-center gap-1 mb-4">
        <h1 className="text-2xl font-400 text-gray-800">{title}</h1>
      </div>
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
}
