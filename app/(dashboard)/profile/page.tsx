"use client";

import { useState, useRef } from "react";
import Body from "@/components/layout/body";
import {
  User,
  Camera,
  ArrowLeft,
  MoreVertical,
  X,
  Edit3,
  Check,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import Card from "@/components/messages/message-card";

// Business categories for the dropdown
const BUSINESS_CATEGORIES = [
  "Retail",
  "Food & Beverage",
  "Health & Wellness",
  "Professional Services",
  "Education",
  "Technology",
  "Arts & Entertainment",
  "Travel & Tourism",
  "Non-profit",
  "Other",
];

export default function ProfilePage() {
  // Profile state
  const [profile, setProfile] = useState({
    displayName: "AvenCRM",
    phoneNumber: "+1 587-332-4680",
    category: "Other",
    description:
      "AvenCRM is a real-estate CRM that enables realtors to manage their leads, deals and manage campaigns and ads.",
    address: "7/2 OCL Colony, Rajgangpur, India",
    email: "karan@duck.com",
    website: "https://duck.com/",
    website2: "https://duck.com/",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPicture = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfile((prev) => ({
      ...prev,
      profilePicture: "",
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    alert("Profile updated successfully!");
  };

  return (
    <Body icon={User} title="Business Profile">
      <Card className="flex flex-row ">
        {/* Edit Form */}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Edit Your Profile</h2>
            <Button
              type="submit"
              size="sm"
              className="text-sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <CheckCircle className="size-4" />
              ) : (
                <Edit3 className="size-4" />
              )}
              {isEditing ? "Save Updates" : "Edit Profile"}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column: Profile Picture */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className="relative w-20 h-20 rounded-full bg-gray-100 cursor-pointer flex items-center justify-center mb-2 border-2 border-primary hover:border-primary/80 transition-all"
                  onClick={handleProfilePictureClick}
                >
                  {profile.profilePicture ? (
                    <>
                      <img
                        src={profile.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <button
                        onClick={handleClearPicture}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <Camera className="text-gray-400 h-6 w-6" />
                  )}
                </div>
                <span className="text-xs text-gray-500">Change picture</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>

              {/* Right Column: Business Name */}
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Name
                  </label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>

                {/* Right Column: Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Category
                  </label>
                  <Select
                    id="category"
                    name="category"
                    value={profile.category}
                    onChange={handleChange}
                    className="w-full"
                    required
                  >
                    <option value="">Select a category</option>
                    {BUSINESS_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 3: Description (Full Width) */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                About
              </label>
              <Textarea
                id="description"
                name="description"
                value={profile.description}
                onChange={handleChange}
                className="w-full"
                rows={3}
                maxLength={300}
                placeholder="Tell customers about your business"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {profile.description.length}/300 characters
              </p>
            </div>

            {/* Section 4: Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column: Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Right Column: Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Section 5: Website and Submit */}
            <div className="grid grid-cols-2 gap-4 items-end">
              {/* Left Column: Website */}
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website
                </label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={profile.website}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="https://..."
                />
              </div>

              {/* Right Column: Submit Button */}
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website
                </label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={profile.website}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="https://..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Divider for mobile */}
        <div className="border-t border-gray-200 lg:hidden my-2"></div>

        {/* WhatsApp Profile Preview */}
        <div className="border-l border-gray-200 bg-[#F1F4F7] p-4 max-w-sm mx-auto lg:mx-0">
          {/* Profile header with picture and name */}
          <div className="bg-white p-2 mb-2 flex flex-col items-center">
            <div className="flex justify-between w-full">
              <button className="text-gray-600">
                <ArrowLeft size={20} />
              </button>
              <button className="text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="w-30 h-30 rounded-full bg-gray-200 overflow-hidden mb-2">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {profile.displayName}
            </h3>
            <p className="font-medium text-lg text-gray-800 mt-1">
              {profile.phoneNumber}
            </p>

            {/* Share button */}
            <div className="mt-4 flex flex-col items-center">
              <img
                src="https://static.xx.fbcdn.net/rsrc.php/v4/y3/r/jZeThiu706q.png"
                alt="Description icon"
                style={{
                  width: "20px",
                  height: "20px",
                  objectFit: "none",
                  objectPosition: "-276px -221px",
                }}
              />
              <span className="text-sm text-gray-800 mt-2">Share</span>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Profile information */}
          <div className="p-4 bg-white">
            {/* Description */}
            <div className="flex mb-2">
              <div className="mr-4 text-gray-500">
                <img
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/yA/r/WnArqot5JSj.png"
                  alt="Description icon"
                  style={{
                    maxWidth: "16px",
                    width: "16px",
                    height: "16px",
                    objectFit: "none",
                    objectPosition: "-68px -338px",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{profile.description}</p>
            </div>

            {/* Category */}
            <div className="flex mb-2">
              <div className="mr-4 text-gray-500">
                <img
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/y3/r/jZeThiu706q.png"
                  alt="Category icon"
                  style={{
                    maxWidth: "16px",
                    width: "16px",
                    height: "16px",
                    objectFit: "none",
                    objectPosition: "-318px -221px",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{profile.category}</p>
            </div>

            {/* Address */}
            <div className="flex mb-2">
              <div className="mr-4 text-gray-500">
                <img
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/yJ/r/CJ4Zti0ZGNK.png"
                  alt="Category icon"
                  style={{
                    maxWidth: "16px",
                    width: "16px",
                    height: "16px",
                    objectFit: "none",
                    objectPosition: "0px -313px",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{profile.address}</p>
            </div>

            {/* Email */}
            <div className="flex mb-2">
              <div className="mr-4 text-gray-500">
                <img
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/yA/r/WnArqot5JSj.png"
                  alt="Category icon"
                  style={{
                    maxWidth: "16px",
                    width: "16px",
                    height: "16px",
                    objectFit: "none",
                    objectPosition: "-136px -321px",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{profile.email}</p>
            </div>

            {/* Website */}
            <div className="flex mb-2">
              <div className="mr-4 text-gray-500">
                <img
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/ym/r/k0gSR9QfhKU.png"
                  alt="Category icon"
                  style={{
                    maxWidth: "16px",
                    width: "16px",
                    height: "16px",
                    objectFit: "none",
                    objectPosition: "0px -264px",
                  }}
                />
              </div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-600"
              >
                {profile.website}
              </a>
            </div>

            <div className="flex mb-2">
              <div className="mr-4 text-gray-500">
                <img
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/ym/r/k0gSR9QfhKU.png"
                  alt="Category icon"
                  style={{
                    maxWidth: "16px",
                    width: "16px",
                    height: "16px",
                    objectFit: "none",
                    objectPosition: "0px -264px",
                  }}
                />
              </div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-600"
              >
                {profile.website2}
              </a>
            </div>
          </div>
          {/* Bottom message */}
          <div className="text-center mt-4 text-xs text-gray-500">
            This experience may look different across devices.
          </div>
        </div>
      </Card>
    </Body>
  );
}
