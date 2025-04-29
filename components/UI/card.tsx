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
    <div className={`border rounded-lg border-gray-300 overflow-hidden shadow-xs ${className}`}>
      <div className="py-2 px-4 flex items-center justify-between border-b border-gray-300">
        <div className="font-large flex items-center gap-2">{title}</div>
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
