import type { ReactNode } from "react";
import Link from "next/link";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  viewAllLink?: string;
  headerButton?: ReactNode;
  headerIcon?: ReactNode;
  headerInfoButton?: ReactNode;
}

export default function Card({
  title,
  children,
  className = "",
  viewAllLink,
  headerButton,
  headerIcon,
  headerInfoButton,
}: CardProps) {
  const renderHeader = () => {
    if (!title && !headerIcon && !headerInfoButton && !headerButton)
      return null;

    return (
      <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          {headerIcon && <span className="text-xl">{headerIcon}</span>}
          {title && (
            <span className="font-400 text-lg text-gray-800">{title}</span>
          )}
          {headerInfoButton && <span className="ml-1">{headerInfoButton}</span>}
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
      className={`border-3 border-[#E0E0E0] rounded-2xl bg-white ${className}`}
    >
      {renderHeader()}
      <div className="px-6 pb-6 pt-2">{children}</div>
    </div>
  );
}
