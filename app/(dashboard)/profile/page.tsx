"use client";

import { useState, useRef, useEffect } from "react";
import Body from "@/components/layout/body";
import {
  Camera,
  ArrowLeft,
  MoreVertical,
  X,
  Edit3,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Card from "@/components/messages/message-card";
import { useProfile } from "@/context/profile-provider";
import { useUser } from "@/context/user-context";
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import { formatPhoneNumber } from "@/lib/utils";

export default function ProfilePage() {
  // Profile state
  const [profile, setProfile] = useState({
    displayName: "",
    phoneNumber: "",
    about: "",
    description: "",
    address: "",
    email: "",
    websites: ["", ""],
    profile_picture_url: "",
    vertical: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const { profile: profileDetails, updateProfile } = useProfile();
  const { userInfo } = useUser();

  useEffect(() => {
    if (profileDetails) {
      setProfile((prev) => {
        return {
          displayName: prev.displayName,
          phoneNumber:
            userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId ||
            prev.phoneNumber,
          about: profileDetails.about || "",
          description: profileDetails.description || "",
          address: profileDetails.address || "",
          email: profileDetails.email || "",
          websites: profileDetails.websites || ["", ""],
          profile_picture_url: profileDetails.profile_picture_url || "",
          vertical: profileDetails.vertical || "",
        };
      });
    }
  }, [profileDetails, userInfo]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "website") {
      // Handle website array updates
      setProfile((prev) => ({
        ...prev,
        websites: [value, prev.websites[1] || ""],
      }));
    } else if (name === "website2") {
      // Handle second website
      setProfile((prev) => ({
        ...prev,
        websites: [prev.websites[0] || "", value],
      }));
    } else {
      // Handle regular fields
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle dropdown changes
  const handleDropdownChange = (value: string) => {
    setProfile((prev) => ({
      ...prev,
      vertical: value,
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleProfilePictureChange({
        target,
      } as React.ChangeEvent<HTMLInputElement>);
    };
    input.click();
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "profile_picture");

        // Upload file to WhatsApp
        const uploadResponse = await fetch("/api/whatsapp/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        const uploadResult = await uploadResponse.json();

        // Update profile with the uploaded image URL
        const updatedProfile = {
          ...profile,
          profile_picture_url: uploadResult.h,
        };

        // Update the profile in WhatsApp
        await updateProfile(updatedProfile);

        // Update local state for immediate UI feedback
        setProfile(updatedProfile);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        // Fallback to local preview
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfile((prev) => ({
            ...prev,
            profile_picture_url: "",
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleClearPicture = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfile((prev) => ({
      ...prev,
      profile_picture_url: "",
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("isEditing", isEditing);
    if (!isEditing) {
      updateProfile(profile);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  // Helper function to get category display name
  const getCategoryDisplayName = (categoryValue: string) => {
    const categoryMap: { [key: string]: string } = {
      ALCOHOL: "Alcoholic Beverages",
      APPAREL: "Clothing and Apparel",
      AUTO: "Automotive",
      BEAUTY: "Beauty, Spa and Salon",
      EDU: "Education",
      ENTERTAIN: "Entertainment",
      EVENT_PLAN: "Event Planning and Service",
      FINANCE: "Finance and Banking",
      GOVT: "Public Service",
      GROCERY: "Food and Grocery",
      HEALTH: "Medical and Health",
      HOTEL: "Hotel and Lodging",
      NONPROFIT: "Non-profit",
      ONLINE_GAMBLING: "Online Gambling & Gaming",
      OTC_DRUGS: "Over-the-Counter Drugs",
      OTHER: "Other",
      PHYSICAL_GAMBLING: "Non-Online Gambling & Gaming (E.g. Brick and mortar)",
      PROF_SERVICES: "Professional Services",
      RESTAURANT: "Restaurant",
      RETAIL: "Shopping and Retail",
      TRAVEL: "Travel and Transportation",
    };
    return categoryMap[categoryValue] || categoryValue;
  };

  return (
    <Body title="Business Profile">
      <Card className="flex flex-row ">
        {/* Edit Form */}
        <div className="p-6 flex-1">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">WhatsApp Profile</h2>
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

            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column: Profile Picture */}
              <div className="flex gap-4">
                <div className="flex flex-col p-4 items-center justify-center">
                  <div
                    className="relative size-24 rounded-full bg-gray-100 cursor-pointer flex items-center justify-center mb-2 border-2 border-primary hover:border-primary/80 transition-all"
                    onClick={handleProfilePictureClick}
                  >
                    {profile.profile_picture_url ? (
                      <>
                        <img
                          src={profile.profile_picture_url}
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
                  <span className="text-sm text-gray-500">Profile Picture</span>
                </div>
                {/* Right Column: Business Name */}
                <div className="flex flex-1 flex-col gap-4">
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
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Right Column: About */}
                  <div>
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      About
                    </label>
                    <Input
                      id="about"
                      name="about"
                      value={profile.about}
                      onChange={handleChange}
                      className="w-full"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              {/* Section 3: Description (Full Width) */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
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
                  disabled={!isEditing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {profile.description.length}/300 characters
                </p>
              </div>
            </div>

            {/* Right Column: Category */}
            <div>
              <label
                htmlFor="vertical"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <SearchableDropdown
                items={[
                  { id: "1", label: "Select a category", value: "" },
                  { id: "2", label: "Alcoholic Beverages", value: "ALCOHOL" },
                  { id: "3", label: "Clothing and Apparel", value: "APPAREL" },
                  { id: "4", label: "Automotive", value: "AUTO" },
                  { id: "5", label: "Beauty, Spa and Salon", value: "BEAUTY" },
                  { id: "6", label: "Education", value: "EDU" },
                  { id: "7", label: "Entertainment", value: "ENTERTAIN" },
                  {
                    id: "8",
                    label: "Event Planning and Service",
                    value: "EVENT_PLAN",
                  },
                  { id: "9", label: "Finance and Banking", value: "FINANCE" },
                  { id: "10", label: "Public Service", value: "GOVT" },
                  { id: "11", label: "Food and Grocery", value: "GROCERY" },
                  { id: "12", label: "Medical and Health", value: "HEALTH" },
                  { id: "13", label: "Hotel and Lodging", value: "HOTEL" },
                  { id: "14", label: "Non-profit", value: "NONPROFIT" },
                  {
                    id: "15",
                    label: "Online Gambling & Gaming",
                    value: "ONLINE_GAMBLING",
                  },
                  {
                    id: "16",
                    label: "Over-the-Counter Drugs",
                    value: "OTC_DRUGS",
                  },
                  { id: "17", label: "Other", value: "OTHER" },
                  {
                    id: "18",
                    label:
                      "Non-Online Gambling & Gaming (E.g. Brick and mortar)",
                    value: "PHYSICAL_GAMBLING",
                  },
                  {
                    id: "19",
                    label: "Professional Services",
                    value: "PROF_SERVICES",
                  },
                  { id: "20", label: "Restaurant", value: "RESTAURANT" },
                  { id: "21", label: "Shopping and Retail", value: "RETAIL" },
                  {
                    id: "22",
                    label: "Travel and Transportation",
                    value: "TRAVEL",
                  },
                ]}
                placeholder="Select a category"
                onSelect={(item) =>
                  !isEditing ? null : handleDropdownChange(item.value)
                }
                variant="outline"
                disabled={!isEditing}
                className={`w-full ${
                  !isEditing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                selectedLabel={
                  profile.vertical
                    ? getCategoryDisplayName(profile.vertical)
                    : null
                }
              />
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  value={profile.websites[0] || ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="https://..."
                  disabled={!isEditing}
                />
              </div>

              {/* Right Column: Submit Button */}
              <div>
                <label
                  htmlFor="website2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website 2
                </label>
                <Input
                  id="website2"
                  name="website2"
                  type="url"
                  value={profile.websites[1] || ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="https://..."
                  disabled={!isEditing}
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
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
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
              {userInfo &&
                userInfo.whatsappAccount &&
                userInfo.whatsappAccount.activePhoneNumber &&
                formatPhoneNumber(
                  userInfo.whatsappAccount.activePhoneNumber.phoneNumber
                )}
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
            {profile.description && (
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
            )}

            {/* Category */}
            {profile.vertical && (
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
                <p className="text-xs text-gray-500">
                  {getCategoryDisplayName(profile.vertical)}
                </p>
              </div>
            )}

            {/* About */}
            {profile.about && (
              <div className="flex mb-2">
                <div className="mr-4 text-gray-500">
                  <img
                    src="https://static.xx.fbcdn.net/rsrc.php/v4/y3/r/jZeThiu706q.png"
                    alt="About icon"
                    style={{
                      maxWidth: "16px",
                      width: "16px",
                      height: "16px",
                      objectFit: "none",
                      objectPosition: "-318px -221px",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">{profile.about}</p>
              </div>
            )}

            {/* Address */}
            {profile.address && (
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
            )}

            {/* Email */}
            {profile.email && (
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
            )}

            {/* Website */}
            {profile.websites[0] && (
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
                  {profile.websites[0]}
                </a>
              </div>
            )}

            {profile.websites[1] && (
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
                  {profile.websites[1]}
                </a>
              </div>
            )}
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
