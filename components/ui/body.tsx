import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface BodyProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export default function Body({ icon: Icon, title, children }: BodyProps) {
  return (
    <div className="flex flex-col w-full h-full p-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-8 h-8 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
