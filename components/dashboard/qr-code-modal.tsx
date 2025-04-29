"use client"

import { Copy, Download, Share2, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  phoneNumber: string
}

export default function QRCodeModal({ isOpen, onClose, text, phoneNumber }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  // Generate WhatsApp link
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappLink)}`

  const copyLink = () => {
    navigator.clipboard.writeText(whatsappLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = "whatsapp-qr.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Your QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="border p-2 rounded-lg">
            <Image src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" width={200} height={200} />
          </div>

          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">WhatsApp Link:</p>
            <div className="flex items-center gap-2">
              <input type="text" value={whatsappLink} readOnly className="flex-1 p-2 text-sm border rounded-md" />
              <button onClick={copyLink} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200" title="Copy link">
                <Copy size={16} />
              </button>
            </div>
            {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={downloadQR}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              <Download size={16} />
              Download
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
