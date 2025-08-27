"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  Settings,
  Clock,
  Check,
  Eye,
  Upload,
  Image as ImageIcon,
  Video,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContacts } from "@/context/contact-provider";
import { useTemplates } from "@/context/template-provider";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";
import SearchableDropdown from "../ui/searchable-dropdown";
import MessageBubble from "../messages/message-bubble";
import axios from "axios";

interface Contact {
  id: string;
  name: string | null;
  phoneNumber: string;
  status?: string;
  labels?: { id: string; name: string; color: string }[];
}

interface Template {
  id: string;
  name: string;
  language: string;
  category: string;
  status: string;
  components: TemplateComponent[];
}

interface TemplateComponent {
  type: "HEADER" | "BODY" | "FOOTER";
  format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
    header_media?: string[];
  };
}

// Extended interface for preview generation
interface PreviewTemplateComponent {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
  format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
  text?: string;
  mediaUrl?: string;
  mediaId?: string;
  buttons?: Array<{
    type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
    text: string;
    url?: string;
    phone_number?: string;
  }>;
  example?: {
    header_text?: string[];
    body_text?: string[][];
    header_media?: string[];
  };
}

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (campaignData: CampaignData) => Promise<void>;
}

interface CampaignData {
  name: string;
  selectedContacts: Contact[];
  templateName: string;
  templateData?: any; // Full template data from template provider
  variables: VariableData[];
  scheduleType: "immediate" | "scheduled";
  scheduledAt?: Date;
}

interface VariableData {
  id: string; // Unique identifier
  variableIndex: number;
  value: string;
  useAttribute: boolean;
  attributeName?: string;
  fallbackValue: string;
  componentType: "HEADER" | "BODY";
  format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT"; // Add format support
  mediaUrl?: string; // Add media URL support for media variables
  mediaId?: string; // WhatsApp media ID for uploaded files
  mediaFile?: File; // Local file for preview
  mediaPreview?: string; // Blob URL for preview
}

interface ExtractedVariable {
  index: number;
  original: string;
  componentType: "HEADER" | "BODY";
  format: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
}

const STEPS = [
  { id: 1, title: "Select Contacts", icon: Users },
  { id: 2, title: "Choose Template", icon: FileText },
  { id: 3, title: "Configure Variables", icon: Settings },
  { id: 4, title: "Schedule Campaign", icon: Clock },
];

export function CreateCampaignModal({
  open,
  onClose,
  onSubmit,
}: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "UNDELIVERED" | "UNREAD" | "READ" | "REPLIED"
  >("UNDELIVERED");
  const [contactSearch, setContactSearch] = useState("");
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    selectedContacts: [],
    templateName: "",
    variables: [],
    scheduleType: "immediate",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { contacts: allContactsRaw, attributes } = useContacts();
  const { templates, selectedWhatsAppAccountId, setSelectedWhatsAppAccountId } =
    useTemplates();
  const { userInfo } = useUser();

  const allContacts = allContactsRaw?.filter((contact) => !contact.isDisabled);

  // Media upload functions
  const handleMediaUpload = async (variableId: string, file: File) => {
    try {
      // Create blob preview
      const previewUrl = URL.createObjectURL(file);

      // Update variable with file and preview
      setCampaignData((prev) => ({
        ...prev,
        variables: prev.variables.map((v) =>
          v.id === variableId
            ? { ...v, mediaFile: file, mediaPreview: previewUrl }
            : v
        ),
      }));

      // Upload to WhatsApp API
      if (userInfo?.whatsappAccount?.phoneNumbers?.[0]?.phoneNumberId) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "phoneNumberId",
          userInfo.whatsappAccount.phoneNumbers[0].phoneNumberId
        );

        const response = await axios.post(
          "/api/whatsapp/upload-file",
          formData
        );

        if (response.data.mediaId) {
          // Update variable with media ID
          setCampaignData((prev) => ({
            ...prev,
            variables: prev.variables.map((v) =>
              v.id === variableId ? { ...v, mediaId: response.data.mediaId } : v
            ),
          }));

          toast.success("Media uploaded successfully!");
        }
      }
    } catch (error) {
      console.error("Media upload error:", error);
      toast.error("Failed to upload media");
    }
  };

  const handleMediaRemove = (variableId: string) => {
    setCampaignData((prev) => ({
      ...prev,
      variables: prev.variables.map((v) =>
        v.id === variableId
          ? {
              ...v,
              mediaFile: undefined,
              mediaPreview: undefined,
              mediaId: undefined,
              mediaUrl: "",
            }
          : v
      ),
    }));
  };

  const getMediaIcon = (format: string) => {
    switch (format) {
      case "IMAGE":
        return <ImageIcon className="h-4 w-4" />;
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "DOCUMENT":
        return <File className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Set the selected WhatsApp account ID when user info is available
  useEffect(() => {
    if (userInfo?.whatsappAccount?.id) {
      setSelectedWhatsAppAccountId(userInfo.whatsappAccount.id);
    }
  }, [userInfo, setSelectedWhatsAppAccountId]);

  // Contact labels for categorization
  const contactLabels = {
    UNDELIVERED: { name: "Undelivered", color: "#EF4444" },
    UNREAD: { name: "Unread", color: "#F59E0B" },
    READ: { name: "Read", color: "#10B981" },
    REPLIED: { name: "Replied", color: "#3B82F6" },
  };

  // Categorize contacts by their status
  const categorizedContacts: Record<string, Contact[]> =
    (allContacts as Contact[] | undefined)?.reduce(
      (acc: Record<string, Contact[]>, contact: Contact) => {
        const status = contact.status || "undelivered";
        if (!acc[status]) acc[status] = [];
        acc[status].push(contact);
        return acc;
      },
      {}
    ) || {};

  // Get selected template
  const selectedTemplate = templates.find(
    (t) => t.name === campaignData.templateName
  );

  // Extract variables from template - separate header and body
  const headerVariables: ExtractedVariable[] =
    selectedTemplate?.components
      .filter((comp) => comp.type === "HEADER")
      .flatMap((comp): ExtractedVariable[] => {
        if (comp.format === "TEXT" && comp.text) {
          // Text header variables
          const matches = comp.text.match(/{{(\d+)}}/g) || [];
          return matches.map((match) => {
            const index = parseInt(match.match(/\d+/)![0]);
            return {
              index,
              original: match,
              componentType: "HEADER" as const,
              format: "TEXT" as const,
            };
          });
        } else if (comp.format && comp.format !== "TEXT") {
          // Media header variables (IMAGE, VIDEO, DOCUMENT)
          return [
            {
              index: 1, // Media components typically have index 1
              original: "{{1}}",
              componentType: "HEADER" as const,
              format: comp.format as "IMAGE" | "VIDEO" | "DOCUMENT",
            },
          ];
        }
        return [];
      })
      .filter(
        (v, i, arr) => arr.findIndex((item) => item.index === v.index) === i
      )
      .sort((a, b) => a.index - b.index) || [];

  const bodyVariables: ExtractedVariable[] =
    selectedTemplate?.components
      .filter((comp) => comp.type === "BODY" && comp.text)
      .flatMap((comp): ExtractedVariable[] => {
        const matches = comp.text?.match(/{{(\d+)}}/g) || [];
        return matches.map((match) => {
          const index = parseInt(match.match(/\d+/)![0]);
          return {
            index,
            original: match,
            componentType: "BODY" as const,
            format: "TEXT" as const,
          };
        });
      })
      .filter(
        (v, i, arr) => arr.findIndex((item) => item.index === v.index) === i
      )
      .sort((a, b) => a.index - b.index) || [];

  const allVariables = [...headerVariables, ...bodyVariables];

  // Initialize variables when template changes
  useEffect(() => {
    if (selectedTemplate && allVariables.length > 0) {
      const newVariables = allVariables.map((v: any, index: number) => ({
        id: `${v.componentType}_${v.index}_${index}`, // Unique identifier
        variableIndex: v.index,
        value: "",
        useAttribute: false,
        attributeName: "",
        fallbackValue: "",
        componentType: v.componentType,
        format: v.format || "TEXT", // Include format
        mediaUrl: v.format && v.format !== "TEXT" ? "" : undefined, // Include mediaUrl for media variables
        mediaId: undefined, // Initialize mediaId
        mediaFile: undefined, // Initialize mediaFile
        mediaPreview: undefined, // Initialize mediaPreview
      }));
      setCampaignData((prev) => ({ ...prev, variables: newVariables }));
    }
  }, [selectedTemplate]);

  const handleNext = () => {
    console.log("campaignData", campaignData);

    // Validation checks based on current step
    if (currentStep === 1) {
      if (campaignData.selectedContacts.length === 0) {
        toast.error("Please select at least one contact to continue");
        return;
      }
    }

    if (currentStep === 2) {
      if (!campaignData.templateName) {
        toast.error("Please select a template to continue");
        return;
      }
    }

    if (currentStep === 3) {
      // Check if all variables have values or are configured with attributes
      const hasInvalidVariables = campaignData.variables.some((variable) => {
        if (variable.format === "TEXT") {
          // Text variables
          if (variable.useAttribute) {
            return (
              !variable.attributeName ||
              (variable.attributeName !== "name" &&
                variable.attributeName !== "phoneNumber" &&
                !variable.fallbackValue)
            );
          }
          return !variable.value && !variable.fallbackValue;
        } else {
          // Media variables (IMAGE, VIDEO, DOCUMENT) - only need uploaded media
          return !variable.mediaId;
        }
      });

      if (hasInvalidVariables) {
        toast.error(
          "Please configure all template variables or provide fallback values"
        );
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!campaignData.name.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    if (campaignData.selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }

    if (!campaignData.templateName) {
      toast.error("Please select a template");
      return;
    }

    // Final validation: ensure all media variables have uploaded files
    const missingMedia = campaignData.variables.filter(
      (variable) =>
        variable.format && variable.format !== "TEXT" && !variable.mediaId
    );

    if (missingMedia.length > 0) {
      toast.error(
        `Please upload media files for the following variables: ${missingMedia
          .map((v) => `Variable ${v.variableIndex} (${v.format})`)
          .join(", ")}`
      );
      return;
    }

    try {
      setIsLoading(true);
      // Include the full template data in the campaign data
      const campaignDataWithTemplate = {
        ...campaignData,
        templateData: selectedTemplate,
      };

      await onSubmit(campaignDataWithTemplate);
      onClose();
      setCurrentStep(1);
      setCampaignData({
        name: "",
        selectedContacts: [],
        templateName: "",
        variables: [],
        scheduleType: "immediate",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
      setIsLoading(false);
    }
  };

  const handleContactToggle = (contact: Contact) => {
    setCampaignData((prev) => ({
      ...prev,
      selectedContacts: prev.selectedContacts.some((c) => c.id === contact.id)
        ? prev.selectedContacts.filter((c) => c.id !== contact.id)
        : [...prev.selectedContacts, contact],
    }));
  };

  const handleTemplateSelect = (templateName: string) => {
    setCampaignData((prev) => ({ ...prev, templateName }));
  };

  const handleVariableChange = (
    variableId: string,
    field: keyof VariableData,
    value: any
  ) => {
    setCampaignData((prev) => ({
      ...prev,
      variables: prev.variables.map((v) =>
        v.id === variableId ? { ...v, [field]: value } : v
      ),
    }));
  };

  const generatePreviewMessage = () => {
    if (!selectedTemplate) return "";

    // Get header and body components
    const headerComponent = selectedTemplate.components.find(
      (comp) => comp.type === "HEADER"
    );
    const bodyComponent = selectedTemplate.components.find(
      (comp) => comp.type === "BODY"
    );

    let previewText = "";

    // Process header if exists
    if (headerComponent) {
      if (headerComponent.format === "TEXT" && headerComponent.text) {
        // Text header
        let headerText = headerComponent.text;
        campaignData.variables
          .filter(
            (variable) =>
              variable.componentType === "HEADER" && variable.format === "TEXT"
          )
          .forEach((variable) => {
            const placeholder = `{{${variable.variableIndex}}}`;
            let value = "";

            if (variable.useAttribute && variable.attributeName) {
              if (variable.attributeName === "name") {
                value = "[Name]";
              } else if (variable.attributeName === "phoneNumber") {
                value = "[Phone Number]";
              } else {
                // Custom attribute
                const attr = attributes?.find(
                  (attr) => attr.name === variable.attributeName
                );
                value = `[${attr?.name || variable.attributeName}]`;
              }
            } else {
              value =
                variable.value ||
                variable.fallbackValue ||
                `Variable ${variable.variableIndex}`;
            }

            headerText = headerText.replace(placeholder, value);
          });
        previewText += `${headerText}\n\n`;
      } else if (headerComponent.format && headerComponent.format !== "TEXT") {
        // Media header
        const mediaVariable = campaignData.variables.find(
          (v) =>
            v.componentType === "HEADER" && v.format === headerComponent.format
        );
        if (mediaVariable?.mediaId) {
          previewText += `📎 ${headerComponent.format}: [Uploaded Media ID: ${mediaVariable.mediaId}]\n\n`;
        } else if (mediaVariable?.mediaPreview) {
          previewText += `📎 ${headerComponent.format}: [Local Preview Available]\n\n`;
        } else {
          previewText += `📎 ${headerComponent.format}: [Media Required]\n\n`;
        }
      }
    }

    // Process body if exists
    if (bodyComponent?.text) {
      let bodyText = bodyComponent.text;
      campaignData.variables
        .filter(
          (variable) =>
            variable.componentType === "BODY" && variable.format === "TEXT"
        )
        .forEach((variable) => {
          const placeholder = `{{${variable.variableIndex}}}`;
          let value = "";

          if (variable.useAttribute && variable.attributeName) {
            if (variable.attributeName === "name") {
              value = "[Contact Name]";
            } else if (variable.attributeName === "phoneNumber") {
              value = "[Phone Number]";
            } else {
              // Custom attribute
              const attr = attributes?.find(
                (attr) => attr.name === variable.attributeName
              );
              value = `[${attr?.name || variable.attributeName}]`;
            }
          } else {
            value =
              variable.value ||
              variable.fallbackValue ||
              `Variable ${variable.variableIndex}`;
          }

          bodyText = bodyText.replace(placeholder, value);
        });
      previewText += bodyText;
    }

    return previewText;
  };

  // Generate proper template data for preview
  const generatePreviewTemplateData = (): PreviewTemplateComponent[] => {
    if (!selectedTemplate) return [];

    return selectedTemplate.components
      .map((comp) => {
        if (comp.type === "HEADER") {
          if (comp.format === "TEXT" && comp.text) {
            // Text header with variables replaced
            let headerText = comp.text;
            campaignData.variables
              .filter(
                (variable) =>
                  variable.componentType === "HEADER" &&
                  variable.format === "TEXT"
              )
              .forEach((variable) => {
                const placeholder = `{{${variable.variableIndex}}}`;
                let value = "";

                if (variable.useAttribute && variable.attributeName) {
                  if (variable.attributeName === "name") {
                    value = "[Name]";
                  } else if (variable.attributeName === "phoneNumber") {
                    value = "[Phone Number]";
                  } else {
                    // Custom attribute
                    const attr = attributes?.find(
                      (attr) => attr.name === variable.attributeName
                    );
                    value = `[${attr?.name || variable.attributeName}]`;
                  }
                } else {
                  value =
                    variable.value ||
                    variable.fallbackValue ||
                    `Variable ${variable.variableIndex}`;
                }

                headerText = headerText.replace(placeholder, value);
              });

            return {
              type: "HEADER" as const,
              format: "TEXT" as const,
              text: headerText,
            };
          } else if (comp.format && comp.format !== "TEXT") {
            // Media header
            const mediaVariable = campaignData.variables.find(
              (v) => v.componentType === "HEADER" && v.format === comp.format
            );

            return {
              type: "HEADER" as const,
              format: comp.format as "IMAGE" | "VIDEO" | "DOCUMENT",
              mediaUrl: mediaVariable?.mediaPreview || undefined,
              mediaId: mediaVariable?.mediaId || undefined,
            };
          }
        }

        if (comp.type === "BODY" && comp.text) {
          // Body with variables replaced
          let bodyText = comp.text;
          campaignData.variables
            .filter(
              (variable) =>
                variable.componentType === "BODY" && variable.format === "TEXT"
            )
            .forEach((variable) => {
              const placeholder = `{{${variable.variableIndex}}}`;
              let value = "";

              if (variable.useAttribute && variable.attributeName) {
                if (variable.attributeName === "name") {
                  value = "[Contact Name]";
                } else if (variable.attributeName === "phoneNumber") {
                  value = "[Phone Number]";
                } else {
                  // Custom attribute
                  const attr = attributes?.find(
                    (attr) => attr.name === variable.attributeName
                  );
                  value = `[${attr?.name || variable.attributeName}]`;
                }
              } else {
                value =
                  variable.value ||
                  variable.fallbackValue ||
                  `Variable ${variable.variableIndex}`;
              }

              bodyText = bodyText.replace(placeholder, value);
            });

          return {
            type: "BODY" as const,
            text: bodyText,
          };
        }

        if (comp.type === "FOOTER" && comp.text) {
          return {
            type: "FOOTER" as const,
            text: comp.text,
          };
        }

        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  };

  // Generate media array for preview with proper blob URL handling
  const generatePreviewMedia = () => {
    const mediaArray: Array<{
      type: string;
      mediaId: string;
    }> = [];

    campaignData.variables
      .filter((v) => v.format && v.format !== "TEXT")
      .forEach((variable) => {
        if (variable.mediaId || variable.mediaPreview) {
          let mediaType = "image/jpeg";
          if (variable.format === "VIDEO") mediaType = "video/mp4";
          if (variable.format === "DOCUMENT") mediaType = "application/pdf";

          // Use mediaPreview (blob URL) if available, otherwise use mediaId
          const mediaId = variable.mediaPreview || variable.mediaId || "";

          mediaArray.push({
            type: mediaType,
            mediaId: mediaId,
          });
        }
      });

    return mediaArray;
  };

  const contacts: Contact[] = categorizedContacts[activeFilter] || [];
  const filteredContacts: Contact[] = contacts.filter(
    (contact: Contact) =>
      contact.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.phoneNumber.includes(contactSearch)
  );

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-100" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Create Campaign
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Set up a new WhatsApp campaign to reach your contacts
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Step Indicator */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        isActive
                          ? "border-blue-500 bg-blue-500 text-white"
                          : isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-12 h-0.5 mx-4 ${
                          isCompleted ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-4 block">
                    Select Contacts ({campaignData.selectedContacts.length}{" "}
                    selected)
                  </Label>

                  {/* Label Filters */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(contactLabels).map(([key, label]) => {
                        const contactsInCategory =
                          categorizedContacts[key] || [];
                        const selectedInCategory = contactsInCategory.filter(
                          (c) =>
                            campaignData.selectedContacts.some(
                              (selected) => selected.id === c.id
                            )
                        );

                        return (
                          <button
                            key={key}
                            onClick={() =>
                              setActiveFilter(
                                key as
                                  | "UNDELIVERED"
                                  | "UNREAD"
                                  | "READ"
                                  | "REPLIED"
                              )
                            }
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              activeFilter === key
                                ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: label.color }}
                              />
                              <span>{label.name}</span>
                              <span className="text-xs bg-white px-1.5 py-0.5 rounded-full">
                                {contactsInCategory.length}
                              </span>
                              {selectedInCategory.length > 0 && (
                                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                  {selectedInCategory.length}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contacts List */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      {/* Search Input */}
                      <div className="mb-3">
                        <Input
                          type="text"
                          placeholder="Search contacts..."
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                contactLabels[activeFilter]?.color,
                            }}
                          />
                          <span className="font-medium text-gray-700">
                            {contactLabels[activeFilter]?.name} Contacts
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            {categorizedContacts[activeFilter]?.length || 0}{" "}
                            total
                          </span>
                          <span className="text-sm text-blue-600 font-medium">
                            {categorizedContacts[activeFilter]?.filter((c) =>
                              campaignData.selectedContacts.some(
                                (selected) => selected.id === c.id
                              )
                            ).length || 0}{" "}
                            selected
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const currentContacts =
                                  categorizedContacts[activeFilter] || [];
                                const currentContactIds = currentContacts.map(
                                  (c) => c.id
                                );
                                const alreadySelected =
                                  campaignData.selectedContacts.filter(
                                    (contact) =>
                                      !currentContactIds.includes(contact.id)
                                  );
                                const newSelected = [
                                  ...alreadySelected,
                                  ...currentContacts,
                                ];
                                setCampaignData((prev) => ({
                                  ...prev,
                                  selectedContacts: newSelected,
                                }));
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Select All
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentContacts =
                                  categorizedContacts[activeFilter] || [];
                                const currentContactIds = currentContacts.map(
                                  (c) => c.id
                                );
                                const newSelected =
                                  campaignData.selectedContacts.filter(
                                    (contact) =>
                                      !currentContactIds.includes(contact.id)
                                  );
                                setCampaignData((prev) => ({
                                  ...prev,
                                  selectedContacts: newSelected,
                                }));
                              }}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {filteredContacts.length > 0 ? (
                        <div className="p-4 space-y-2">
                          {filteredContacts.map((contact) => (
                            <label
                              key={contact.id}
                              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border border-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={campaignData.selectedContacts.some(
                                  (c) => c.id === contact.id
                                )}
                                onChange={() => handleContactToggle(contact)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {contact.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {contact.phoneNumber}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      contactLabels[activeFilter]?.color,
                                  }}
                                />
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="text-gray-500 mb-2">
                            No contacts in this category
                          </div>
                          <div className="text-sm text-gray-400">
                            Try selecting a different filter or add contacts
                            first
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Helper Text */}
                    <div className="p-3 bg-blue-50 border-t border-blue-100">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>
                          {campaignData.selectedContacts.length === 0
                            ? "Select at least one contact to continue to the next step"
                            : `Selected ${
                                campaignData.selectedContacts.length
                              } contact${
                                campaignData.selectedContacts.length > 1
                                  ? "s"
                                  : ""
                              }. You can now proceed to the next step.`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-4 block">
                    Select Template
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          campaignData.templateName === template.name
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleTemplateSelect(template.name)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {template.category} • {template.language}
                            </p>
                            <div className="mt-2 text-xs text-gray-400">
                              Status: {template.status}
                            </div>
                          </div>
                          {campaignData.templateName === template.name && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Helper Text */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>
                        {!campaignData.templateName
                          ? "Select a template to continue to the next step"
                          : `Template "${campaignData.templateName}" selected. You can now proceed to configure variables.`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && selectedTemplate && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-4 block">
                    Configure Template Variables
                  </Label>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Variables Configuration */}
                    <div className="space-y-4">
                      {campaignData.variables.map((variable) => (
                        <div
                          key={variable.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium text-gray-700">
                              Variable {variable.variableIndex}
                              {variable.format &&
                                variable.format !== "TEXT" && (
                                  <span className="ml-2 text-xs text-gray-500 capitalize">
                                    ({variable.format.toLowerCase()})
                                  </span>
                                )}
                            </Label>
                            {variable.format === "TEXT" && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`use-attribute-${variable.variableIndex}`}
                                  checked={variable.useAttribute}
                                  onChange={(e) =>
                                    handleVariableChange(
                                      variable.id,
                                      "useAttribute",
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label
                                  htmlFor={`use-attribute-${variable.variableIndex}`}
                                  className="text-xs text-gray-600"
                                >
                                  Use Attribute
                                </Label>
                              </div>
                            )}
                          </div>

                          {variable.format === "TEXT" ? (
                            // Text variable configuration
                            variable.useAttribute ? (
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs text-gray-600 block mb-1">
                                    Select Attribute
                                  </Label>
                                  <SearchableDropdown
                                    variant="outline"
                                    items={[
                                      // Built-in attributes
                                      {
                                        id: "name",
                                        label: "Name",
                                        value: "name",
                                        category: "built-in",
                                      },
                                      {
                                        id: "phoneNumber",
                                        label: "Phone Number",
                                        value: "phoneNumber",
                                        category: "built-in",
                                      },
                                      // Custom attributes
                                      ...(attributes?.map((attr) => ({
                                        id: `attr_${attr.name}`,
                                        label: `${attr.name} (Custom)`,
                                        value: `attr_${attr.name}`,
                                        category: "custom",
                                      })) || []),
                                    ]}
                                    onSelect={(item) => {
                                      // Extract the actual attribute name from the value
                                      let attributeName = item.value;
                                      if (item.value.startsWith("attr_")) {
                                        attributeName = item.value.replace(
                                          "attr_",
                                          ""
                                        );
                                      }
                                      handleVariableChange(
                                        variable.id,
                                        "attributeName",
                                        attributeName
                                      );
                                    }}
                                    selectedLabel={
                                      variable.attributeName
                                        ? variable.attributeName === "name"
                                          ? "Name"
                                          : variable.attributeName ===
                                            "phoneNumber"
                                          ? "Phone Number"
                                          : `${variable.attributeName} (Custom)`
                                        : null
                                    }
                                    placeholder="Select Attribute"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600 block mb-1">
                                    Fallback Value
                                  </Label>
                                  <Input
                                    value={variable.fallbackValue}
                                    onChange={(e) =>
                                      handleVariableChange(
                                        variable.id,
                                        "fallbackValue",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Value if contact doesn't have this attribute"
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                            ) : (
                              <Input
                                value={variable.value}
                                onChange={(e) =>
                                  handleVariableChange(
                                    variable.id,
                                    "value",
                                    e.target.value
                                  )
                                }
                                placeholder={`Enter value for variable ${variable.variableIndex}`}
                                className="text-sm"
                              />
                            )
                          ) : (
                            // Media variable configuration
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs text-gray-600 block mb-1">
                                  Upload Media
                                </Label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    id={`media-upload-${variable.id}`}
                                    accept={
                                      variable.format === "IMAGE"
                                        ? "image/*"
                                        : variable.format === "VIDEO"
                                        ? "video/*"
                                        : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                    }
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleMediaUpload(variable.id, file);
                                      }
                                    }}
                                    className="hidden"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `media-upload-${variable.id}`
                                        )
                                        ?.click()
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <Upload className="h-4 w-4" />
                                    Upload {variable.format?.toLowerCase()}
                                  </Button>
                                  {variable.mediaFile && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleMediaRemove(variable.id)
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Media Preview */}
                              {variable.mediaPreview && (
                                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                  <Label className="text-xs text-gray-600 block mb-2">
                                    Preview
                                  </Label>
                                  <div className="flex items-center gap-2">
                                    {getMediaIcon(variable.format || "TEXT")}
                                    <span className="text-sm text-gray-700">
                                      {variable.mediaFile?.name}
                                    </span>
                                    {variable.mediaId && (
                                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                        ✓ Uploaded
                                      </span>
                                    )}
                                  </div>
                                  {variable.format === "IMAGE" &&
                                    variable.mediaPreview && (
                                      <div className="mt-2">
                                        <img
                                          src={variable.mediaPreview}
                                          alt="Preview"
                                          className="max-w-full h-32 object-contain rounded border"
                                        />
                                      </div>
                                    )}
                                </div>
                              )}

                              <div className="text-xs text-gray-500">
                                Supported formats:{" "}
                                {variable.format === "IMAGE" && "JPG, PNG, GIF"}
                                {variable.format === "VIDEO" && "MP4, 3GP"}
                                {variable.format === "DOCUMENT" &&
                                  "PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX"}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Message Preview */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 block">
                        Message Preview
                      </Label>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            WhatsApp Preview
                          </span>
                        </div>

                        {/* Chat Background Container */}
                        <div
                          className="relative rounded-lg overflow-hidden shadow-lg border-2 border-gray-300"
                          style={{
                            backgroundImage: "url(/message-bg.png)",
                            backgroundSize: "200px",
                            backgroundPosition: "center",
                            backgroundRepeat: "repeat",
                            minHeight: "400px",
                          }}
                        >
                          {/* Background Overlay for better readability */}
                          <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>

                          {/* Chat Header */}
                          <div className="relative bg-white/90 backdrop-blur-sm border-b border-gray-200 p-3 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  W
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  Your Business
                                </div>
                                <div className="text-xs text-gray-500">
                                  Template Message
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Chat Messages Area */}
                          <div className="relative p-4 space-y-4 min-h-[300px]">
                            {/* Preview Message using MessageBubble */}
                            {selectedTemplate ? (
                              (() => {
                                // Create a proper message object for preview
                                const previewMessage = {
                                  id: "preview",
                                  message: "", // Empty message since we're using templateData
                                  isOutbound: true,
                                  status: "SENT" as const,
                                  createdAt: new Date().toISOString(),
                                  phoneNumber: "+1234567890",
                                  whatsAppPhoneNumberId: "preview",
                                  recipientId: "preview",
                                  updatedAt: new Date().toISOString(),
                                  // media: generatePreviewMedia(),
                                  mediaIds: [],
                                  templateData: generatePreviewTemplateData(),
                                  interactiveJson: [],
                                };

                                return (
                                  <MessageBubble message={previewMessage} />
                                );
                              })()
                            ) : (
                              <div className="flex items-center justify-center h-64 text-gray-500">
                                <div className="text-center">
                                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                  <p className="text-sm">
                                    Select a template to see preview
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Helper Text */}
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span>
                            {campaignData.variables.some((variable) => {
                              if (variable.format === "TEXT") {
                                // Text variables
                                if (variable.useAttribute) {
                                  return (
                                    !variable.attributeName ||
                                    (variable.attributeName !== "name" &&
                                      variable.attributeName !==
                                        "phoneNumber" &&
                                      !variable.fallbackValue)
                                  );
                                }
                                return (
                                  !variable.value && !variable.fallbackValue
                                );
                              } else {
                                // Media variables - only need uploaded media
                                return !variable.mediaId;
                              }
                            })
                              ? "Configure all template variables or provide fallback values"
                              : "All variables configured. You can now proceed to schedule your campaign."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Campaign Name
                  </Label>
                  <Input
                    value={campaignData.name}
                    onChange={(e) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter campaign name"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-4 block">
                    Campaign Schedule
                  </Label>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="scheduleType"
                          value="immediate"
                          checked={campaignData.scheduleType === "immediate"}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              scheduleType: e.target.value as
                                | "immediate"
                                | "scheduled",
                            }))
                          }
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Send Immediately
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="scheduleType"
                          value="scheduled"
                          checked={campaignData.scheduleType === "scheduled"}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              scheduleType: e.target.value as
                                | "immediate"
                                | "scheduled",
                            }))
                          }
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Schedule for Later
                        </span>
                      </label>
                    </div>

                    {campaignData.scheduleType === "scheduled" && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Schedule Date & Time
                        </Label>
                        <Input
                          type="datetime-local"
                          value={
                            campaignData.scheduledAt
                              ? new Date(campaignData.scheduledAt)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              scheduledAt: e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            }))
                          }
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Campaign Summary */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Campaign Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Campaign Name:</span>
                      <span className="font-medium">
                        {campaignData.name || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Contacts:</span>
                      <span className="font-medium">
                        {campaignData.selectedContacts.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium">
                        {selectedTemplate?.name || "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="font-medium">
                        {campaignData.scheduleType === "immediate"
                          ? "Send immediately"
                          : campaignData.scheduledAt
                          ? new Date(campaignData.scheduledAt).toLocaleString()
                          : "Not set"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? "Cancel" : "Previous"}
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 &&
                      campaignData.selectedContacts.length === 0) ||
                    (currentStep === 2 && !campaignData.templateName) ||
                    (currentStep === 3 &&
                      campaignData.variables.some((variable) => {
                        if (variable.format === "TEXT") {
                          // Text variables
                          if (variable.useAttribute) {
                            return (
                              !variable.attributeName ||
                              (variable.attributeName !== "name" &&
                                variable.attributeName !== "phoneNumber" &&
                                !variable.fallbackValue)
                            );
                          }
                          return !variable.value && !variable.fallbackValue;
                        } else {
                          // Media variables - only need uploaded media
                          return !variable.mediaId;
                        }
                      }))
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    "Create Campaign"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
