import type { ReactNode } from "react"
import Link from "next/link"

interface CardProps {
  title: string
  children: ReactNode
  className?: string
  viewAllLink?: string
}

export default function Card({ title, children, className = "", viewAllLink }: CardProps) {
  return (
    <div className={`border rounded-lg border-gray-300 overflow-hidden ${className}`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-300">
        <div className="font-medium flex items-center gap-2">{title}</div>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-sm text-gray-600 flex items-center hover:text-gray-900">
            All {title} <span className="ml-1">→</span>
          </Link>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
