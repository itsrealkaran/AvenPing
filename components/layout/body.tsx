import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface BodyProps {
  title: string;
  children: ReactNode;
}

export default function Body({ title, children }: BodyProps) {
  return (
    <div className="flex flex-col w-full h-full p-6 overflow-y-auto">
      <div className="flex items-center gap-1 mb-6">
        <h1 className="text-2xl font-300 text-gray-800">{title}</h1>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
