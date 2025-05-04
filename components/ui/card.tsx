import type { ReactNode } from "react";
import Link from "next/link";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  viewAllLink?: string;
  variant?: "default" | "header" | "darkHeader";
}

export default function Card({
  title,
  children,
  className = "",
  viewAllLink,
  variant = "default",
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
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-xs text-gray-600 flex items-center hover:text-gray-900"
          >
            All {title} <span className="ml-1">→</span>
          </Link>
        )}
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

import * as React from "react"

import { cn } from "@/lib/utils"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
