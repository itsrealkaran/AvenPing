import type { ReactNode } from "react";
import Link from "next/link";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  viewAllLink?: string;
  variant?: "default" | "header" | "darkHeader";
  headerButton?: ReactNode;
}

export default function Card({
  title,
  children,
  className = "",
  viewAllLink,
  variant = "default",
  headerButton,
}: CardProps) {
  const renderHeader = () => {
    if (!title && variant === "default") return null;

    const headerBgClass = variant === "darkHeader" ? "bg-gray-100" : "";

    return (
      <div
        className={`py-2 px-4 flex items-center justify-between border-b border-gray-300 ${headerBgClass}`}
      >
        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
          {title}
        </div>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-xs text-gray-600 flex items-center hover:text-gray-900"
            >
              All {title} <span className="ml-1">→</span>
            </Link>
          )}
          {headerButton}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`border rounded-lg border-gray-300 bg-white overflow-hidden shadow-xs ${className}`}
    >
      {renderHeader()}
      <div>{children}</div>
    </div>
  );
}
