"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useContacts } from "@/context/contact-provider";

interface Contact {
  id: string;
  name: string | null;
  phoneNumber: string;
  attributeValues?: { name: string; value: string }[];
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phoneNumber: string; attributes: { name: string; value: string }[] }) => Promise<void>;
  isLoading: boolean;
  editContact?: Contact | null;
}

const AddContactModal = ({ isOpen, onClose, onSubmit, isLoading, editContact }: AddContactModalProps) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string }>({});
  const { attributes } = useContacts();

  // Attribute-value pairs state
  const [attributeValues, setAttributeValues] = useState<{ attributeId: string; value: string }[]>([]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editContact) {
      setName(editContact.name || "");
      setPhoneNumber(editContact.phoneNumber);
      // Pre-fill attributeValues if editing
      if (editContact.attributeValues && attributes) {
        const mapped = editContact.attributeValues.map(av => {
          // Try to find the attribute by name (since that's what is submitted)
          const attr = attributes.find(attr => attr.name === av.name);
          return attr ? { attributeId: attr.id, value: av.value } : null;
        }).filter(Boolean) as { attributeId: string; value: string }[];
        setAttributeValues(mapped);
      } else {
        setAttributeValues([]);
      }
    } else {
      setName("");
      setPhoneNumber("");
      setAttributeValues([]);
    }
    setErrors({});
  }, [editContact, isOpen, attributes]);

  // Handle attribute dropdown change
  const handleAttributeChange = (idx: number, attributeId: string) => {
    setAttributeValues((prev) => {
      const updated = [...prev];
      updated[idx].attributeId = attributeId;
      updated[idx].value = ""; // Reset value when attribute changes
      return updated;
    });
  };

  // Handle attribute value input change
  const handleAttributeValueChange = (idx: number, value: string) => {
    setAttributeValues((prev) => {
      const updated = [...prev];
      updated[idx].value = value;
      return updated;
    });
  };

  // Add new attribute-value row
  const handleAddAttribute = () => {
    setAttributeValues((prev) => [...prev, { attributeId: "", value: "" }]);
  };

  // Remove attribute-value row
  const handleRemoveAttribute = (idx: number) => {
    setAttributeValues((prev) => prev.filter((_, i) => i !== idx));
  };

  // Get available attributes for a dropdown (exclude already selected in other rows)
  const getAvailableAttributes = (currentIdx: number) => {
    if (!attributes) return [];
    const selectedIds = attributeValues.map((av, idx) => idx !== currentIdx ? av.attributeId : null).filter(Boolean);
    return attributes.filter(attr => !selectedIds.includes(attr.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { name?: string; phoneNumber?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[\d\s\-\(\)]+$/.test(phoneNumber)) newErrors.phoneNumber = "Please enter a valid phone number";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Prepare attribute values for submission
    const attributesToSubmit = attributeValues
      .filter(av => av.attributeId && av.value)
      .map(av => ({
        name: attributes?.find(attr => attr.id === av.attributeId)?.name || "",
        value: av.value,
      }));

    console.log(attributesToSubmit, "attributesToSubmit");
    try {
      await onSubmit({ name: name.trim(), phoneNumber: phoneNumber.trim(), attributes: attributesToSubmit });
      setName("");
      setPhoneNumber("");
      setAttributeValues([]);
      onClose();
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleClose = () => {
    setName("");
    setPhoneNumber("");
    setAttributeValues([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!editContact;
  const title = isEditing ? "Edit Contact" : "Add New Contact";
  const submitText = isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Contact" : "Create Contact");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-90">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter contact name"
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={`mt-1 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {attributes && attributes.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Attributes</Label>
              <div className="flex flex-col gap-2 mt-2">
                {attributeValues.map((av, idx) => {
                  const availableAttributes = getAvailableAttributes(idx);
                  const selectedAttribute = attributes.find(attr => attr.id === av.attributeId);
                  return (
                    <div key={idx} className="flex gap-2 items-center">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 min-w-[120px]"
                        value={av.attributeId}
                        onChange={e => handleAttributeChange(idx, e.target.value)}
                        disabled={isLoading}
                      >
                        <option value="">Select attribute</option>
                        {availableAttributes.map(attr => (
                          <option key={attr.id} value={attr.id}>{attr.name}</option>
                        ))}
                        {selectedAttribute && !availableAttributes.some(attr => attr.id === selectedAttribute.id) && (
                          <option value={selectedAttribute.id}>{selectedAttribute.name}</option>
                        )}
                      </select>
                      {selectedAttribute && (
                        <Input
                          type={selectedAttribute.type === "NUMBER" ? "number" : "text"}
                          value={av.value}
                          onChange={e => handleAttributeValueChange(idx, e.target.value)}
                          placeholder={`Enter ${selectedAttribute.name}`}
                          className="flex-1"
                          disabled={isLoading}
                        />
                      )}
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 ml-1"
                        onClick={() => handleRemoveAttribute(idx)}
                        disabled={isLoading}
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
                {attributeValues.length < attributes.length && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-fit"
                    onClick={handleAddAttribute}
                    disabled={isLoading}
                  >
                    + Add Attribute
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal; 