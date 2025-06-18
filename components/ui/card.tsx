import type { ReactNode } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  viewAllLink?: string;
  headerButton?: ReactNode;
  headerIcon?: ReactNode;
  headerInfo?: string;
}

export default function Card({
  title,
  children,
  className = "",
  viewAllLink,
  headerButton,
  headerIcon,
  headerInfo,
}: CardProps) {
  const renderHeader = () => {
    if (!title && !headerIcon && !headerInfo && !headerButton) return null;

    return (
      <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          {headerIcon && <span className="text-xl">{headerIcon}</span>}
          {title && (
            <span className="font-500 text-base text-gray-800">{title}</span>
          )}
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
          {headerInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Info className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs leading-relaxed">{headerInfo}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
