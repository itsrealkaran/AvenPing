import React, { forwardRef, type ReactNode } from "react";
import Link from "next/link";
import { Info, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  viewAllLink?: string;
  headerButton?: ReactNode;
  headerIcon?: ReactNode;
  headerInfo?: string;
  onClick?: () => void;
  hoverable?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  compact?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      children,
      className = "",
      viewAllLink,
      headerButton,
      headerIcon,
      headerInfo,
      onClick,
      hoverable = false,
      disabled = false,
      size = "md",
      fullWidth = false,
      compact = false,
    },
    ref
  ) => {
    const renderHeader = () => {
      if (!title && !headerIcon && !headerInfo && !headerButton) return null;

      const headerPadding = compact ? "px-4 pt-4 pb-2" : "px-6 pt-5 pb-2";
      const titleSize =
        size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

      return (
        <div
          className={cn(
            "flex items-center justify-between bg-white rounded-t-2xl",
            headerPadding
          )}
        >
          <div className="flex items-center gap-2">
            {headerIcon && <span className="text-xl">{headerIcon}</span>}
            {title && (
              <span className={cn("font-500 text-gray-800", titleSize)}>
                {title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="text-xs text-gray-600 flex items-center hover:text-gray-900 transition-colors"
              >
                All {title} <ExternalLink className="ml-1 size-3" />
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

    // Size-based styling
    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return compact ? "px-4 pb-4 pt-2" : "px-4 pb-4 pt-2";
        case "lg":
          return compact ? "px-8 pb-8 pt-2" : "px-8 pb-8 pt-2";
        default:
          return compact ? "px-6 pb-6 pt-2" : "px-6 pb-6 pt-2";
      }
    };

    const baseClasses = cn(
      "rounded-2xl",
      "border-3 border-[#E0E0E0] bg-white",
      fullWidth ? "w-full" : "",
      getSizeClasses()
    );

    const interactiveClasses = onClick || hoverable ? "cursor-pointer" : "";
    const hoverClasses =
      hoverable && !disabled
        ? "hover:shadow-lg hover:border-gray-300 transition-all duration-200"
        : "";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    const combinedClasses = cn(
      baseClasses,
      interactiveClasses,
      hoverClasses,
      disabledClasses,
      className
    );

    return (
      <div
        ref={ref}
        className={combinedClasses}
        onClick={onClick && !disabled ? onClick : undefined}
        role={onClick ? "button" : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && !disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
        aria-disabled={disabled}
      >
        {renderHeader()}
        <div className={getSizeClasses()}>{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

// Export additional utility components
export { Card };
export type { CardProps };
