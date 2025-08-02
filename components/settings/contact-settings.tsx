"use client"

import React, { useState } from "react"
import { ChevronRight, Plus, Trash2, Edit, Check, Minus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Attribute {
  id: string
  name: string
  status: "active" | "inactive"
  type: "text" | "number" | "email" | "date"
  isSelected?: boolean
}

export default function ContactSettings() {
  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: "1", name: "Name", status: "active", type: "text", isSelected: true },
    { id: "2", name: "Surname", status: "inactive", type: "text", isSelected: false },
    { id: "3", name: "Contact No.", status: "inactive", type: "number", isSelected: false },
    { id: "4", name: "Email", status: "active", type: "text", isSelected: true },
    { id: "5", name: "Gender", status: "inactive", type: "text", isSelected: false },
    { id: "6", name: "Address", status: "active", type: "text", isSelected: true },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null)
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    type: "text" as Attribute["type"],
    status: "active" as Attribute["status"]
  })

  const handleSelectAll = () => {
    const allSelected = attributes.every(attr => attr.isSelected)
    setAttributes(attributes.map(attr => ({ ...attr, isSelected: !allSelected })))
  }

  const handleSelectAttribute = (id: string) => {
    setAttributes(attributes.map(attr => 
      attr.id === id ? { ...attr, isSelected: !attr.isSelected } : attr
    ))
  }

  const handleAddAttribute = () => {
    if (newAttribute.name.trim()) {
      const attribute: Attribute = {
        id: Date.now().toString(),
        name: newAttribute.name,
        type: newAttribute.type,
        status: newAttribute.status,
        isSelected: false
      }
      setAttributes([...attributes, attribute])
      setNewAttribute({ name: "", type: "text", status: "active" })
      setShowAddModal(false)
    }
  }

  const handleEditAttribute = (attribute: Attribute) => {
    setEditingAttribute(attribute)
    setNewAttribute({
      name: attribute.name,
      type: attribute.type,
      status: attribute.status
    })
    setShowAddModal(true)
  }

  const handleUpdateAttribute = () => {
    if (editingAttribute && newAttribute.name.trim()) {
      setAttributes(attributes.map(attr => 
        attr.id === editingAttribute.id 
          ? { ...attr, name: newAttribute.name, type: newAttribute.type, status: newAttribute.status }
          : attr
      ))
      setEditingAttribute(null)
      setNewAttribute({ name: "", type: "text", status: "active" })
      setShowAddModal(false)
    }
  }

  const handleDeleteAttribute = (id: string) => {
    setAttributes(attributes.filter(attr => attr.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setAttributes(attributes.map(attr => 
      attr.id === id 
        ? { ...attr, status: attr.status === "active" ? "inactive" : "active" }
        : attr
    ))
  }

  const selectedCount = attributes.filter(attr => attr.isSelected).length

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
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Attribute
          </Button>
        </div>

        {/* Attributes Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center"
                    >
                      {selectedCount === attributes.length ? (
                        <Check className="h-3 w-3 text-cyan-500" />
                      ) : selectedCount > 0 ? (
                        <Minus className="h-3 w-3 text-gray-400" />
                      ) : null}
                    </button>
                    <span className="font-medium text-gray-700">Attribute Name</span>
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4"></th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attribute) => (
                <tr key={attribute.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectAttribute(attribute.id)}
                        className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center"
                      >
                        {attribute.isSelected && (
                          <Check className="h-3 w-3 text-cyan-500" />
                        )}
                      </button>
                      <span className="font-medium text-gray-900">{attribute.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(attribute.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        attribute.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {attribute.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 capitalize">{attribute.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEditAttribute(attribute)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteAttribute(attribute.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="date">Date</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newAttribute.status}
                  onChange={(e) => setNewAttribute({ ...newAttribute, status: e.target.value as Attribute["status"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={editingAttribute ? handleUpdateAttribute : handleAddAttribute}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {editingAttribute ? "Update" : "Add"}
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingAttribute(null)
                  setNewAttribute({ name: "", type: "text", status: "active" })
                }}
                variant="outline"
                className="flex-1"
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