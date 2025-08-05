"use client"

import React, { useState } from "react"
import { ChevronRight, Plus, X, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface CatalogSettings {
  name: string
  description: string
  visibility: "public" | "private"
  autoSync: boolean
  categories: string[]
  currency: string
}

const currencyOptions = [
  { value: "USD", label: "USD $", symbol: "$" },
  { value: "EUR", label: "EUR €", symbol: "€" },
  { value: "GBP", label: "GBP £", symbol: "£" },
  { value: "INR", label: "INR ₹", symbol: "₹" },
  { value: "CAD", label: "CAD C$", symbol: "C$" },
  { value: "AUD", label: "AUD A$", symbol: "A$" }
]

const defaultCategories = ["Electronics", "Clothing", "Home & Garden", "Sports"]

export default function CatalogSettings() {
  const [settings, setSettings] = useState<CatalogSettings>({
    name: "",
    description: "",
    visibility: "public",
    autoSync: true,
    categories: defaultCategories,
    currency: "USD"
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)

  const handleSaveSettings = async () => {
    if (!settings.name.trim()) {
      toast.error("Please enter a catalog name")
      return
    }

    try {
      setIsSaving(true)
      // TODO: Implement API call to save catalog settings
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("Catalog settings saved successfully")
    } catch (error) {
      console.error("Error saving catalog settings:", error)
      toast.error("Failed to save catalog settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSyncWithWhatsApp = async () => {
    try {
      setIsSyncing(true)
      // TODO: Implement WhatsApp catalog sync
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      toast.success("Catalog synced with WhatsApp successfully")
    } catch (error) {
      console.error("Error syncing with WhatsApp:", error)
      toast.error("Failed to sync with WhatsApp")
    } finally {
      setIsSyncing(false)
    }
  }

  const handleAddProduct = () => {
    // TODO: Navigate to add product page or open modal
    toast.info("Add product functionality coming soon")
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !settings.categories.includes(newCategory.trim())) {
      setSettings(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }))
      setNewCategory("")
      setShowCategoryInput(false)
    }
  }

  const handleRemoveCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }))
  }

  const handleToggleVisibility = () => {
    setSettings(prev => ({
      ...prev,
      visibility: prev.visibility === "public" ? "private" : "public"
    }))
  }

  const handleToggleAutoSync = () => {
    setSettings(prev => ({
      ...prev,
      autoSync: !prev.autoSync
    }))
  }

  const selectedCurrency = currencyOptions.find(c => c.value === settings.currency)

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Catalog</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Catalog Settings</h3>
        
        <div className="space-y-6">
          {/* Catalog Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catalog Name
            </label>
            <Input
              placeholder="Urgent, Important, etc..."
              value={settings.name}
              onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description
            </label>
            <textarea
              placeholder="Urgent, Important, etc..."
              value={settings.description}
              onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={4}
            />
          </div>

          {/* Catalog Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catalog Visibility
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleToggleVisibility}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  settings.visibility === "public"
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Public
              </button>
              <button
                onClick={handleToggleVisibility}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  settings.visibility === "private"
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Private
              </button>
            </div>
          </div>

          {/* Auto-sync Inventory */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-sync Inventory
              </label>
              <p className="text-sm text-gray-500">Automatically sync product availability</p>
            </div>
            <button
              onClick={handleToggleAutoSync}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSync ? "bg-cyan-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoSync ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Product Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Categories
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {settings.categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md"
                  >
                    <span className="text-sm text-gray-700">{category}</span>
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {showCategoryInput ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                  <Button
                    onClick={handleAddCategory}
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCategoryInput(false)
                      setNewCategory("")
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowCategoryInput(true)}
                  variant="outline"
                  size="sm"
                  className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Categories
                </Button>
              )}
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <span>{selectedCurrency?.label}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              
              {showCurrencyDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {currencyOptions.map((currency) => (
                    <button
                      key={currency.value}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, currency: currency.value }))
                        setShowCurrencyDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50"
                    >
                      {currency.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSaveSettings}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={isSaving || isSyncing}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Save Catalog Settings
            </Button>
            <Button
              onClick={handleSyncWithWhatsApp}
              variant="outline"
              className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
              disabled={isSaving || isSyncing}
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Sync With WhatsApp
            </Button>
            <Button
              onClick={handleAddProduct}
              variant="outline"
              className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
              disabled={isSaving || isSyncing}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 