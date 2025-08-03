"use client"

import React, { useState, useEffect } from "react"
import { ChevronRight, Plus, Trash2, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useContacts } from "@/context/contact-provider"
import { toast } from "sonner"

interface Attribute {
  id: string
  name: string
  type: "TEXT" | "NUMBER"
}

export default function ContactSettings() {
  const { 
    attributes, 
    createAttribute, 
    updateAttribute, 
    deleteAttribute,
    isCreatingAttribute,
    createAttributeError,
    updateAttributeError,
    deleteAttributeError
  } = useContacts()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null)
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    type: "TEXT" as Attribute["type"]
  })
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { updating?: boolean; deleting?: boolean }
  }>({})

  // Handle API errors
  useEffect(() => {
    if (createAttributeError) {
      toast.error(createAttributeError.message || "Failed to create attribute")
    }
    if (updateAttributeError) {
      toast.error(updateAttributeError.message || "Failed to update attribute")
    }
    if (deleteAttributeError) {
      toast.error(deleteAttributeError.message || "Failed to delete attribute")
    }
  }, [createAttributeError, updateAttributeError, deleteAttributeError])

  const setLoadingState = (id: string, operation: 'updating' | 'deleting', loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [operation]: loading
      }
    }))
  }

  const handleAddAttribute = async () => {
    if (newAttribute.name.trim()) {
      try {
        await createAttribute({
          name: newAttribute.name,
          type: newAttribute.type
        })
        setNewAttribute({ name: "", type: "TEXT" })
        setShowAddModal(false)
        toast.success("Attribute created successfully")
      } catch (error) {
        console.error("Error creating attribute:", error)
      }
    }
  }

  const handleEditAttribute = (attribute: Attribute) => {
    setEditingAttribute(attribute)
    setNewAttribute({
      name: attribute.name,
      type: attribute.type
    })
    setShowAddModal(true)
  }

  const handleUpdateAttribute = async () => {
    if (editingAttribute && newAttribute.name.trim()) {
      setLoadingState(editingAttribute.id, 'updating', true)
      try {
        await updateAttribute({
          id: editingAttribute.id,
          name: newAttribute.name,
          type: newAttribute.type
        })
        setEditingAttribute(null)
        setNewAttribute({ name: "", type: "TEXT" })
        setShowAddModal(false)
        toast.success("Attribute updated successfully")
      } catch (error) {
        console.error("Error updating attribute:", error)
      } finally {
        setLoadingState(editingAttribute.id, 'updating', false)
      }
    }
  }

  const handleDeleteAttribute = async (id: string) => {
    setLoadingState(id, 'deleting', true)
    try {
      await deleteAttribute(id)
      toast.success("Attribute deleted successfully")
    } catch (error) {
      console.error("Error deleting attribute:", error)
    } finally {
      setLoadingState(id, 'deleting', false)
    }
  }

  const isUpdating = editingAttribute ? loadingStates[editingAttribute.id]?.updating : false

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Contacts</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Attributes</h3>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
            disabled={isCreatingAttribute}
          >
            {isCreatingAttribute ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Attribute
          </Button>
        </div>

        {/* Attributes Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Attribute Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4"></th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {attributes?.map((attribute) => {
                const isUpdatingThis = loadingStates[attribute.id]?.updating
                const isDeletingThis = loadingStates[attribute.id]?.deleting
                
                return (
                  <tr key={attribute.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{attribute.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 capitalize">{attribute.type.toLowerCase()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEditAttribute(attribute)}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isUpdatingThis || isDeletingThis}
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeleteAttribute(attribute.id)}
                        className="text-gray-400 hover:text-red-600"
                        disabled={isUpdatingThis || isDeletingThis}
                      >
                        {isDeletingThis ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {(!attributes || attributes.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p>No attributes found. Create your first attribute to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-120">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAttribute ? "Edit Attribute" : "Add Attribute"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attribute Name
                </label>
                <Input
                  value={newAttribute.name}
                  onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                  placeholder="Enter attribute name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newAttribute.type}
                  onChange={(e) => setNewAttribute({ ...newAttribute, type: e.target.value as Attribute["type"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={editingAttribute ? handleUpdateAttribute : handleAddAttribute}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={isCreatingAttribute || isUpdating}
              >
                {isCreatingAttribute || isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {editingAttribute ? "Update" : "Add"}
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingAttribute(null)
                  setNewAttribute({ name: "", type: "TEXT" })
                }}
                variant="outline"
                className="flex-1"
                disabled={isCreatingAttribute || isUpdating}
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