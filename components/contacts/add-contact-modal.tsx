"use client";

import React, { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useContacts } from "@/context/contact-provider";
import { normalizePhoneNumber } from "@/lib/utils";

interface Contact {
  id: string;
  name: string | null;
  phoneNumber: string;
  attributeValues?: { name: string; value: string }[];
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phoneNumber: string;
    attributes: { name: string; value: string }[];
  }) => Promise<void>;
  isLoading: boolean;
  editContact?: Contact | null;
}

const AddContactModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editContact,
}: AddContactModalProps) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string }>(
    {}
  );
  const { attributes } = useContacts();

  // Attribute-value pairs state
  const [attributeValues, setAttributeValues] = useState<
    { attributeId: string; value: string }[]
  >([]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editContact) {
      setName(editContact.name || "");
      setPhoneNumber(editContact.phoneNumber);
      // Pre-fill attributeValues if editing
      if (editContact.attributeValues && attributes) {
        const mapped = editContact.attributeValues
          .map((av) => {
            const attr = attributes.find((attr) => attr.name === av.name);
            return attr ? { attributeId: attr.id, value: av.value } : null;
          })
          .filter(Boolean) as { attributeId: string; value: string }[];
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
    const selectedIds = attributeValues
      .map((av, idx) => (idx !== currentIdx ? av.attributeId : null))
      .filter(Boolean);
    return attributes.filter((attr) => !selectedIds.includes(attr.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { name?: string; phoneNumber?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[\d\s\-\(\)]+$/.test(phoneNumber))
      newErrors.phoneNumber = "Please enter a valid phone number";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Prepare attribute values for submission
    const attributesToSubmit = attributeValues
      .filter((av) => av.attributeId && av.value)
      .map((av) => ({
        name:
          attributes?.find((attr) => attr.id === av.attributeId)?.name || "",
        value: av.value,
      }));

    console.log(attributesToSubmit, "attributesToSubmit");
    try {
      await onSubmit({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        attributes: attributesToSubmit,
      });
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
  const submitText = isLoading
    ? isEditing
      ? "Updating..."
      : "Creating..."
    : isEditing
    ? "Update Contact"
    : "Create Contact";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-100" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 z-120">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-200 flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">
                {isEditing
                  ? "Update contact information"
                  : "Add a new contact to your list"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter contact name"
                      className={`mt-1 ${
                        errors.name ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={normalizePhoneNumber(phoneNumber)}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`mt-1 ${
                        errors.phoneNumber
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      disabled={isLoading}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Attributes Section */}
              {attributes && attributes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      Attributes
                    </Label>
                    {attributeValues.length < attributes.length && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddAttribute}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        Add Attribute
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {attributeValues.map((av, idx) => {
                      const availableAttributes = getAvailableAttributes(idx);
                      const selectedAttribute = attributes.find(
                        (attr) => attr.id === av.attributeId
                      );
                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">
                              Attribute
                            </Label>
                            <select
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#30CFED] focus:border-[#30CFED]"
                              value={av.attributeId}
                              onChange={(e) =>
                                handleAttributeChange(idx, e.target.value)
                              }
                              disabled={isLoading}
                            >
                              <option value="">Select attribute</option>
                              {availableAttributes.map((attr) => (
                                <option key={attr.id} value={attr.id}>
                                  {attr.name}
                                </option>
                              ))}
                              {selectedAttribute &&
                                !availableAttributes.some(
                                  (attr) => attr.id === selectedAttribute.id
                                ) && (
                                  <option value={selectedAttribute.id}>
                                    {selectedAttribute.name}
                                  </option>
                                )}
                            </select>
                          </div>

                          {selectedAttribute && (
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Label className="text-xs text-gray-600 mb-1 block">
                                  Value
                                </Label>
                                <Input
                                  type={
                                    selectedAttribute.type === "NUMBER"
                                      ? "number"
                                      : "text"
                                  }
                                  value={av.value}
                                  onChange={(e) =>
                                    handleAttributeValueChange(
                                      idx,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Enter ${selectedAttribute.name}`}
                                  disabled={isLoading}
                                />
                              </div>
                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10"
                                  onClick={() => handleRemoveAttribute(idx)}
                                  disabled={isLoading}
                                  title="Remove attribute"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
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
              onClick={handleSubmit}
            >
              {submitText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddContactModal;
