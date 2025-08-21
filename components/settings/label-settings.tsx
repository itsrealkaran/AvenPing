"use client"

import React, { useState } from "react"
import { ChevronRight, Plus, Trash2, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { useMessages } from "@/context/messages-context"

interface Label {
  id: string
  name: string
  description?: string | null
  color?: string | null
  accountId: string
  createdAt: Date
  updatedAt: Date
  recipients?: any[]
}

const colorOptions = [
  { name: "green", value: "#10b981" },
  { name: "blue", value: "#3b82f6" },
  { name: "black", value: "#1f2937" },
  { name: "red", value: "#ef4444" },
  { name: "gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }
]

export default function LabelSettings() {
  const { 
    labels: labelsData, 
    isLabelsLoading, 
    labelsError,
    createLabel,
    updateLabel,
    deleteLabel
  } = useMessages()

  const [loadingStates, setLoadingStates] = useState<{
    creating: boolean
    updating: { [key: string]: boolean }
    deleting: { [key: string]: boolean }
  }>({
    creating: false,
    updating: {},
    deleting: {}
  })
  
  const [newLabel, setNewLabel] = useState({
    name: "",
    color: "#ef4444" // Default to red
  })
  
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const setLoadingState = (operation: 'creating' | 'updating' | 'deleting', id?: string, loading: boolean = false) => {
    setLoadingStates(prev => {
      if (operation === 'creating') {
        return { ...prev, creating: loading }
      } else if (operation === 'updating' && id) {
        return {
          ...prev,
          updating: {
            ...prev.updating,
            [id]: loading
          }
        }
      } else if (operation === 'deleting' && id) {
        return {
          ...prev,
          deleting: {
            ...prev.deleting,
            [id]: loading
          }
        }
      }
      return prev
    })
  }



  const handleCreateLabel = async () => {
    if (!newLabel.name.trim()) {
      toast.error('Please enter a label name')
      return
    }

    try {
      setLoadingState('creating', undefined, true)
      const result = await createLabel({
        name: newLabel.name,
        description: newLabel.name,
        color: newLabel.color
      })
      
      setNewLabel({ name: "", color: "#ef4444" })
      toast.success('Label created successfully')
    } catch (error: any) {
      console.error('Error creating label:', error)
      toast.error(error.response?.data?.error || 'Failed to create label')
    } finally {
      setLoadingState('creating', undefined, false)
    }
  }

  const handleEditLabel = (label: Label) => {
    setEditingLabel(label)
    setNewLabel({
      name: label.name,
      color: label.color || "#ef4444" // Provide default color if null/undefined
    })
    setShowEditModal(true)
  }

  const handleUpdateLabel = async () => {
    if (!editingLabel || !newLabel.name.trim()) {
      toast.error('Please enter a label name')
      return
    }

    try {
      setLoadingState('updating', editingLabel.id, true)
      const result = await updateLabel(editingLabel.id, {
        name: newLabel.name,
        description: newLabel.name,
        color: newLabel.color
      })
      
      setEditingLabel(null)
      setNewLabel({ name: "", color: "#ef4444" })
      setShowEditModal(false)
      toast.success('Label updated successfully')
    } catch (error: any) {
      console.error('Error updating label:', error)
      toast.error(error.response?.data?.error || 'Failed to update label')
    } finally {
      setLoadingState('updating', editingLabel.id, false)
    }
  }

  const handleDeleteLabel = async (id: string) => {
    try {
      setLoadingState('deleting', id, true)
      await deleteLabel(id)
      toast.success('Label deleted successfully')
    } catch (error: any) {
      console.error('Error deleting label:', error)
      toast.error(error.response?.data?.error || 'Failed to delete label')
    } finally {
      setLoadingState('deleting', id, false)
    }
  }

  const handleDiscard = () => {
    setNewLabel({ name: "", color: "#ef4444" })
    setEditingLabel(null)
    setShowEditModal(false)
  }

  const getColorStyle = (color: string | null | undefined) => {
    // Provide default color if color is undefined/null
    const safeColor = color || "#ef4444" // Default to red
    
    if (safeColor.includes('gradient')) {
      return { background: safeColor }
    }
    return { backgroundColor: safeColor }
  }

  const isAnyUpdating = Object.values(loadingStates.updating || {}).some(Boolean)
  const isAnyDeleting = Object.values(loadingStates.deleting || {}).some(Boolean)

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Labels</span>
      </div>

      {/* Create Label Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Label</h3>
        
        <div className="space-y-6">
          {/* Label Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label Name
            </label>
            <Input
              placeholder="Urgent, Important, etc.."
              value={newLabel.name}
              onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setNewLabel({ ...newLabel, color: color.value })}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    newLabel.color === color.value 
                      ? 'border-cyan-400 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={getColorStyle(color.value)}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
              <div 
                className="w-3 h-3 rounded-full"
                style={getColorStyle(newLabel.color)}
              />
              <span className="text-sm font-medium">
                {newLabel.name || "Urgent"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={showEditModal ? handleUpdateLabel : handleCreateLabel}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={loadingStates.creating || isAnyUpdating}
            >
              {loadingStates.creating || isAnyUpdating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {showEditModal ? "Update Label" : "Add Label"}
            </Button>
            <Button
              onClick={handleDiscard}
              variant="outline"
              disabled={loadingStates.creating || isAnyUpdating}
            >
              Discard
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Labels Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Existing Labels</h3>
        
        {isLabelsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : labelsError ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading labels: {labelsError.message}</p>
          </div>
        ) : (labelsData || []).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No labels found. Create your first label to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(labelsData || []).map((label) => {
              const isUpdatingThis = loadingStates.updating[label.id] || false
              const isDeletingThis = loadingStates.deleting[label.id] || false
              
              return (
                <div 
                  key={label.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={getColorStyle(label.color)}
                    />
                    <span className="font-medium text-gray-900">{label.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditLabel(label)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      disabled={isUpdatingThis || isDeletingThis || isAnyUpdating}
                    >
                      {isUpdatingThis ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteLabel(label.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      disabled={isUpdatingThis || isDeletingThis || isAnyUpdating}
                    >
                      {isDeletingThis ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-120">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Label
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label Name
                </label>
                <Input
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                  placeholder="Enter label name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewLabel({ ...newLabel, color: color.value })}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        newLabel.color === color.value 
                          ? 'border-cyan-400 shadow-md' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={getColorStyle(color.value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                </label>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={getColorStyle(newLabel.color)}
                  />
                  <span className="text-sm font-medium">
                    {newLabel.name || "Label"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleUpdateLabel}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={isAnyUpdating}
              >
                {isAnyUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Update
              </Button>
              <Button
                onClick={handleDiscard}
                variant="outline"
                className="flex-1"
                disabled={isAnyUpdating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 