"use client"

import { Copy, X } from "lucide-react"
import { useState } from "react"

interface WAButtonModalProps {
  isOpen: boolean
  onClose: () => void
  color: string
  roundness: string
  text: string
}

export default function WAButtonModal({ isOpen, onClose, color, roundness, text }: WAButtonModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  // Generate React code snippet
  const codeSnippet = `import React from 'react';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: '${color}',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '${roundness}px',
        textDecoration: 'none',
        display: 'inline-block',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        textAlign: 'center',
      }}
    >
      ${text}
    </a>
  );
};

export default WhatsAppButton;`

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">React Code Snippet</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{codeSnippet}</code>
          </pre>
          <button
            onClick={copyCode}
            className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            title="Copy code"
          >
            <Copy size={16} />
          </button>
        </div>

        {copied && <p className="text-green-600 mt-2 text-sm">Code copied to clipboard!</p>}
      </div>
    </div>
  )
}
