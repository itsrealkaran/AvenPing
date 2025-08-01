"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, ChevronRight } from "lucide-react"

interface Label {
  id: number
  name: string
  color: string
}

interface LabelSettingsProps {
  labels: Label[]
  setLabels: (labels: Label[]) => void
  newLabelName: string
  setNewLabelName: (name: string) => void
  newLabelColor: string
  setNewLabelColor: (color: string) => void
}

export default function LabelSettings({ 
  labels, 
  setLabels, 
  newLabelName, 
  setNewLabelName, 
  newLabelColor, 
  setNewLabelColor 
}: LabelSettingsProps) {
  const addLabel = () => {
    if (newLabelName.trim()) {
      setLabels([
        ...labels,
        {
          id: Date.now(),
          name: newLabelName,
          color: newLabelColor,
        },
      ])
      setNewLabelName("")
      setNewLabelColor("#3b82f6")
    }
  }

  const removeLabel = (id: number) => {
    setLabels(labels.filter((label) => label.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Labels</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Labels</h3>
        <div className="space-y-4">
          {labels.map((label) => (
            <div key={label.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                <span className="font-medium">{label.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLabel(label.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Label name"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              className="flex-1"
            />
            <input
              type="color"
              value={newLabelColor}
              onChange={(e) => setNewLabelColor(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300"
            />
            <Button onClick={addLabel}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 