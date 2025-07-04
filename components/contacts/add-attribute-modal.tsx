"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useContacts } from "@/context/contact-provider";
import { toast } from "sonner";

interface AddAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { name: string; type: "TEXT" | "NUMBER" }) => void;
  isLoading?: boolean;
}

const AddAttributeModal = ({ isOpen, onClose, onSubmit, isLoading }: AddAttributeModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"TEXT" | "NUMBER">("TEXT");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const { createAttribute, isCreatingAttribute, createAttributeError } = useContacts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors({});
    if (!name.trim()) {
      setErrors({ name: "Attribute name is required" });
      return;
    }

    const attributeData = { name: name.trim(), type };

    try {
      console.log("Creating attribute:", attributeData); // Debug log
      
      if (onSubmit) {
        // Use the onSubmit prop if provided (for backward compatibility)
        onSubmit(attributeData);
      } else {
        // Use the context function
        await createAttribute(attributeData);
        toast.success("Attribute created successfully");
      }
      
      setName("");
      setType("TEXT");
      onClose();
    } catch (error) {
      console.error("Error creating attribute:", error);
      toast.error("Failed to create attribute");
    }
  };

  const handleClose = () => {
    setName("");
    setType("TEXT");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-90">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Attribute</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="attributeName" className="text-sm font-medium text-gray-700">
              Attribute Name *
            </Label>
            <Input
              id="attributeName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter attribute name"
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
              disabled={isLoading || isCreatingAttribute}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="attributeType" className="text-sm font-medium text-gray-700">
              Attribute Type *
            </Label>
            <select
              id="attributeType"
              value={type}
              onChange={e => setType(e.target.value as "TEXT" | "NUMBER")}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isCreatingAttribute}
            >
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading || isCreatingAttribute}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || isCreatingAttribute}
            >
              {isCreatingAttribute ? "Creating..." : "Add Attribute"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttributeModal; 