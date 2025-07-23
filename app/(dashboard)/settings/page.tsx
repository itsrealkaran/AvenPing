"use client"

import * as React from "react"
import Card from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Settings, User, Bell, Tag, ShoppingCart, Phone, Users, Trash2, Link, Plus, Edit, X } from "lucide-react"
import Body from "@/components/layout/body"

const settingsNavigation = [
  { id: "general", title: "General Settings", icon: Settings },
  { id: "contacts", title: "Contact Settings", icon: User },
  { id: "notifications", title: "Notifications", icon: Bell },
  { id: "labels", title: "Label Settings", icon: Tag },
  { id: "catalog", title: "Catalog", icon: ShoppingCart },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("general")
  const [whatsappConnected, setWhatsappConnected] = React.useState(false)
  const [optInStatus, setOptInStatus] = React.useState(true)
  const [notifications, setNotifications] = React.useState({
    chats: true,
    campaigns: true,
    planExpiry: true,
    systemUpdates: false,
  })
  const [labels, setLabels] = React.useState([
    { id: 1, name: "Important", color: "#ef4444" },
    { id: 2, name: "Follow Up", color: "#f59e0b" },
    { id: 3, name: "Completed", color: "#10b981" },
  ])
  const [newLabelName, setNewLabelName] = React.useState("")
  const [newLabelColor, setNewLabelColor] = React.useState("#3b82f6")

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

  const renderGeneralSettings = () => (
    <div className="h-full flex-1 flex flex-col">
      <Card title="General Settings" headerIcon={<Settings className="h-6 w-6 text-cyan-500" />} className="bg-white border border-gray-200 rounded-xl p-0 flex-1 flex flex-col min-h-0">
        <div className="space-y-8 px-8 py-8 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Opt-in Status</Label>
              <p className="text-sm text-gray-500">Allow receiving promotional messages and updates</p>
            </div>
            <input
              type="checkbox"
              checked={optInStatus}
              onChange={e => setOptInStatus(e.target.checked)}
              className="w-5 h-5 accent-cyan-500 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-300 transition"
            />
          </div>
          <hr className="my-6 border-gray-100" />
          <div className="space-y-4">
            <Label className="text-base font-semibold">WhatsApp Connection</Label>
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
              <div className={`p-2 rounded-full ${whatsappConnected ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1 ml-4">
                <p className="font-medium text-base">{whatsappConnected ? "Connected" : "Not Connected"}</p>
                <p className="text-sm text-gray-500">{whatsappConnected ? "WhatsApp Business API is active" : "Connect your WhatsApp Business account"}</p>
              </div>
              <Button
                variant={whatsappConnected ? "outline" : "default"}
                onClick={() => setWhatsappConnected(!whatsappConnected)}
                className="rounded-md px-5 py-2 text-sm font-medium"
              >
                <Link className="h-5 w-5 mr-2" />
                {whatsappConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
          <hr className="my-6 border-gray-100" />
          <div className="space-y-4">
            <Label className="text-base font-semibold text-red-600">Danger Zone</Label>
            <Button
              variant="destructive"
              className="w-full rounded-md py-2 text-sm font-medium"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
                  // handle delete
                }
              }}
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete My Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderContactSettings = () => (
    <div className="">
      <Card title="Contact Settings" headerIcon={<User className="h-6 w-6 text-cyan-500" />} className="bg-white border border-gray-200 rounded-xl p-0 flex-1 flex flex-col min-h-0">
        <div className="space-y-8 px-8 py-8 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold">First Name</Label>
              <Input placeholder="Enter attribute name" className="rounded-md border-gray-200 focus:ring-cyan-300" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Last Name</Label>
              <Input placeholder="Enter attribute name" className="rounded-md border-gray-200 focus:ring-cyan-300" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Email</Label>
              <Input placeholder="Enter attribute name" className="rounded-md border-gray-200 focus:ring-cyan-300" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Phone</Label>
              <Input placeholder="Enter attribute name" className="rounded-md border-gray-200 focus:ring-cyan-300" />
            </div>
          </div>
          <Button className="w-full rounded-md py-2 text-sm font-medium bg-cyan-500 text-white hover:bg-cyan-600">
            <Plus className="h-5 w-5 mr-2" />
            Add Custom Attribute
          </Button>
          <hr className="my-6 border-gray-100" />
          <Label className="text-base font-semibold">Contact Groups</Label>
          <div className="space-y-3">
            {["VIP Customers", "Newsletter Subscribers", "Product Updates"].map((group, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-base">{group}</p>
                  <p className="text-sm text-gray-500">{Math.floor(Math.random() * 500) + 50} contacts</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-md">
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-md">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full rounded-md py-2 text-sm font-medium bg-cyan-500 text-white hover:bg-cyan-600">
            <Plus className="h-5 w-5 mr-2" />
            Create New Group
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="h-full flex-1 flex flex-col">
      <Card title="Notification Settings" headerIcon={<Bell className="h-6 w-6 text-cyan-500" />} className="bg-white border border-gray-200 rounded-xl p-0 flex-1 flex flex-col min-h-0">
        <div className="space-y-8 px-8 py-8 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {[
            { key: "chats", label: "Chat Notifications", desc: "Get notified when you receive new messages" },
            { key: "campaigns", label: "Campaign Completion", desc: "Notifications when your campaigns are completed" },
            { key: "planExpiry", label: "Plan Expiry Alerts", desc: "Get reminded before your subscription expires" },
            { key: "systemUpdates", label: "System Updates", desc: "Notifications about new features and updates" },
          ].map((item, idx) => (
            <div key={item.key} className={`flex items-center justify-between ${idx !== 0 ? "pt-6 border-t border-gray-100" : ""}`}>
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">{item.label}</Label>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={e => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="w-5 h-5 accent-cyan-500 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-300 transition"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderLabelSettings = () => (
    <div className="h-full flex-1 flex flex-col">
      <Card title="Label Settings" headerIcon={<Tag className="h-6 w-6 text-cyan-500" />} className="bg-white border border-gray-200 rounded-xl p-0 flex-1 flex flex-col min-h-0">
        <div className="space-y-8 px-8 py-8 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold">Label Name</Label>
              <Input
                placeholder="Enter label name"
                value={newLabelName}
                onChange={e => setNewLabelName(e.target.value)}
                className="rounded-md border-gray-200 focus:ring-cyan-300"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  value={newLabelColor}
                  onChange={e => setNewLabelColor(e.target.value)}
                  className="w-10 h-10 p-1 border rounded"
                />
                <Input
                  value={newLabelColor}
                  onChange={e => setNewLabelColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="rounded-md border-gray-200 focus:ring-cyan-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={addLabel} className="w-full rounded-md py-2 text-sm font-medium bg-cyan-500 text-white hover:bg-cyan-600">
                <Plus className="h-5 w-5 mr-2" />
                Add Label
              </Button>
            </div>
          </div>
          <hr className="my-6 border-gray-100" />
          <Label className="text-base font-semibold">Existing Labels</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labels.map(label => (
              <div key={label.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full inline-block border border-gray-200" style={{ backgroundColor: label.color }} />
                  <span className="font-medium text-base">{label.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeLabel(label.id)} className="rounded-md">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )

  const renderCatalogSettings = () => (
    <div className="h-full flex-1 flex flex-col">
      <Card title="Catalog Settings" headerIcon={<ShoppingCart className="h-6 w-6 text-cyan-500" />} className="bg-white border border-gray-200 rounded-xl p-0 flex-1 flex flex-col min-h-0">
        <div className="space-y-8 px-8 py-8 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Catalog Name</Label>
                <Input placeholder="My Business Catalog" className="rounded-md border-gray-200 focus:ring-cyan-300" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Business Description</Label>
                <Textarea placeholder="Describe your business and products..." className="rounded-md border-gray-200 focus:ring-cyan-300" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Currency</Label>
                <Select options={[
                  { value: "usd", label: "USD ($)" },
                  { value: "eur", label: "EUR (€)" },
                  { value: "gbp", label: "GBP (£)" },
                  { value: "inr", label: "INR (₹)" },
                ]} className="rounded-md border-gray-200 focus:ring-cyan-300" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Catalog Visibility</Label>
                <Select options={[
                  { value: "public", label: "Public" },
                  { value: "private", label: "Private" },
                ]} className="rounded-md border-gray-200 focus:ring-cyan-300" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Auto-sync Inventory</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-5 h-5 accent-cyan-500 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-300 transition" />
                  <Label className="text-sm">Automatically sync product availability</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Product Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {["Electronics", "Clothing", "Home & Garden", "Sports"].map(category => (
                    <span key={category} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">
                      {category}
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-md mt-2">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-100" />
          <div className="flex gap-4">
            <Button className="rounded-md px-6 py-2 text-sm font-medium bg-cyan-500 text-white hover:bg-cyan-600">Save Catalog Settings</Button>
            <Button variant="outline" className="rounded-md px-6 py-2 text-sm font-medium">Sync with WhatsApp</Button>
            <Button variant="outline" className="rounded-md px-6 py-2 text-sm font-medium">
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings()
      case "contacts":
        return renderContactSettings()
      case "notifications":
        return renderNotificationSettings()
      case "labels":
        return renderLabelSettings()
      case "catalog":
        return renderCatalogSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <Body title="Settings">
    <div className="flex gap-12 w-full max-w-7xl mx-auto p-8">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-16">
          <nav className="space-y-1">
            {settingsNavigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 my-2 text-base rounded-lg font-medium transition-all border-l-4 ${
                  activeSection === item.id
                    ? "bg-gray-100 border-cyan-500 text-cyan-700"
                    : "bg-white border-transparent text-gray-600 hover:bg-gray-50 hover:text-cyan-700"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 max-w-4xl flex flex-col h-full min-h-0">{renderContent()}</div>
    </div>
    </Body>
  )
}
