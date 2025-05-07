import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

interface Step3Props {
  formData: {
    displayName: string;
    description: string;
    profilePic: File | null;
    headerPic: File | null;
  };
  updateFormData: (field: string, value: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const Step3ProfileSetup: React.FC<Step3Props> = ({
  formData,
  updateFormData,
  onSubmit,
  isLoading,
}) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profilePic" | "headerPic"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create FormData to send to our backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      try {
        // Send the file to our backend endpoint
        const uploadResponse = await axios.post('/api/whatsapp/upload-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(uploadResponse.data, "upload response");

        // Update the form data with the file
        updateFormData(type, file);
        
        // Create preview URL for the image
        const previewUrl = URL.createObjectURL(file);
        if (type === "profilePic") {
          setProfilePreview(previewUrl);
        } else {
          setHeaderPreview(previewUrl);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Customize Your Profile</h3>
        <p className="text-muted-foreground">
          Set up how your customers will see you on WhatsApp
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => updateFormData("displayName", e.target.value)}
            placeholder="Your business name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            placeholder="Tell customers about your business"
            className="min-h-[100px] w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
              {profilePreview ? (
                <div className="relative w-24 h-24 overflow-hidden rounded-full mb-4">
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M12 2a6 6 0 0 1 6 6c0 1.35-.5 2.59-1.33 3.54l-.8.79-1.33 1.32C13.8 14.38 13 15.5 13 17v.17a1 1 0 0 1-2 0V17c0-2.25 1.05-3.71 1.82-4.47l.67-.66A4 4 0 0 0 14 8a2 2 0 0 0-4 0 1 1 0 0 1-2 0 4 4 0 0 1 4-4Z" />
                    <circle cx="12" cy="20" r="1" />
                  </svg>
                </div>
              )}
              <Input
                type="file"
                id="profilePic"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profilePic")}
              />
              <Label
                htmlFor="profilePic"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer px-4 py-2 rounded text-sm"
              >
                Select Image
              </Label>
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: Square, 320x320px
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-6 bg-whatsapp hover:bg-whatsapp-dark"
        disabled={isLoading}
      >
        {isLoading ? "Finishing up..." : "Complete Setup"}
      </Button>
    </form>
  );
};

export default Step3ProfileSetup;
