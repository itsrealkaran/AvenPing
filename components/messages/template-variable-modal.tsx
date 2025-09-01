"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Upload,
  Image as ImageIcon,
  Video,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContacts } from "@/context/contact-provider";
import { toast } from "sonner";
import SearchableDropdown from "../ui/searchable-dropdown";
import MessageBubble from "./message-bubble";
import axios from "axios";
import { useUser } from "@/context/user-context";

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

interface VariableData {
  id: string;
  variableIndex: number;
  value: string;
  useAttribute: boolean;
  attributeName?: string;
  fallbackValue: string;
  componentType: "HEADER" | "BODY";
  format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
  mediaUrl?: string;
  mediaId?: string;
  mediaFile?: File;
  mediaPreview?: string;
}

interface ExtractedVariable {
  index: number;
  original: string;
  componentType: "HEADER" | "BODY";
  format: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
}

interface TemplateVariableModalProps {
  open: boolean;
  onClose: () => void;
  template: Template | null;
  onSendTemplate: (templateId: string, variables: VariableData[]) => void;
}

export function TemplateVariableModal({
  open,
  onClose,
  template,
  onSendTemplate,
}: TemplateVariableModalProps) {
  const [variables, setVariables] = useState<VariableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { attributes } = useContacts();
  const { userInfo } = useUser();

  // Extract variables from template
  const headerVariables: ExtractedVariable[] =
    template?.components
      .filter((comp) => comp.type === "HEADER")
      .flatMap((comp): ExtractedVariable[] => {
        if (comp.format === "TEXT" && comp.text) {
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
          return [
            {
              index: 1,
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
    template?.components
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

  // Combine header and body variables, but keep them separate for component-specific handling
  // WhatsApp templates can use the same parameter in multiple components, but we need to track which component each belongs to
  const allVariables = [...headerVariables, ...bodyVariables]
    .sort((a, b) => a.index - b.index);

  // Initialize variables when template changes
  useEffect(() => {
    if (template) {
      console.log("Template structure:", template);
      console.log("Template components:", template.components);
      console.log("Extracted variables:", { headerVariables, bodyVariables, allVariables });
    }
    
    if (template && allVariables.length > 0) {
      const newVariables = allVariables.map((v: any, index: number) => ({
        id: `variable_${v.index}_${index}`,
        variableIndex: v.index,
        value: "",
        useAttribute: false,
        attributeName: "",
        fallbackValue: "",
        componentType: v.componentType,
        format: v.format || "TEXT",
        mediaUrl: v.format && v.format !== "TEXT" ? "" : undefined,
        mediaId: undefined,
        mediaFile: undefined,
        mediaPreview: undefined,
      }));
      setVariables(newVariables);
    } else {
      setVariables([]);
    }
  }, [template]);

  // Media upload functions
  const handleMediaUpload = async (variableId: string, file: File) => {
    try {
      const previewUrl = URL.createObjectURL(file);

      setVariables((prev) =>
        prev.map((v) =>
          v.id === variableId
            ? { ...v, mediaFile: file, mediaPreview: previewUrl }
            : v
        )
      );

      if (userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "phoneNumberId",
          userInfo.whatsappAccount.activePhoneNumber.phoneNumberId
        );

        const response = await axios.post(
          "/api/whatsapp/upload-file",
          formData
        );

        if (response.data.mediaId) {
          setVariables((prev) =>
            prev.map((v) =>
              v.id === variableId ? { ...v, mediaId: response.data.mediaId } : v
            )
          );
          toast.success("Media uploaded successfully!");
        }
      }
    } catch (error) {
      console.error("Media upload error:", error);
      toast.error("Failed to upload media");
    }
  };

  const handleMediaRemove = (variableId: string) => {
    setVariables((prev) =>
      prev.map((v) =>
        v.id === variableId
          ? {
              ...v,
              mediaFile: undefined,
              mediaPreview: undefined,
              mediaId: undefined,
              mediaUrl: "",
            }
          : v
      )
    );
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

  const handleVariableChange = (
    variableId: string,
    field: keyof VariableData,
    value: any
  ) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === variableId ? { ...v, [field]: value } : v))
    );
  };

  const handleSend = async () => {
    if (!template) return;

    // Validate variables
    const hasInvalidVariables = variables.some((variable) => {
      if (variable.format === "TEXT") {
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
        return !variable.mediaId;
      }
    });

    if (hasInvalidVariables) {
      toast.error(
        "Please configure all template variables or provide fallback values"
      );
      return;
    }

    try {
      setIsLoading(true);
      console.log("Sending template:", template.name, variables);
      onSendTemplate(template.name, variables);
      onClose();
    } catch (error) {
      console.error("Error sending template:", error);
      toast.error("Failed to send template");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate preview template data
  const generatePreviewTemplateData = () => {
    if (!template) return [];

    return template.components
      .map((comp) => {
        if (comp.type === "HEADER") {
          if (comp.format === "TEXT" && comp.text) {
            let headerText = comp.text;
            variables
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
            const mediaVariable = variables.find(
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
          let bodyText = comp.text;
          variables
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

  if (!open || !template) return null;

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
                Configure Template Variables
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Fill in the variables for "{template.name}" template
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Variables Configuration */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Template Variables
                </Label>

                {variables.length > 0 ? (
                  variables.map((variable) => (
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
                                  },
                                  {
                                    id: "phoneNumber",
                                    label: "Phone Number",
                                    value: "phoneNumber",
                                  },
                                  // Custom attributes
                                  ...(attributes?.map((attr) => ({
                                    id: `attr_${attr.name}`,
                                    label: `${attr.name} (Custom)`,
                                    value: `attr_${attr.name}`,
                                  })) || []),
                                ]}
                                onSelect={(item) => {
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
                                      : variable.attributeName === "phoneNumber"
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
                                    .getElementById(`media-upload-${variable.id}`)
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
                                  onClick={() => handleMediaRemove(variable.id)}
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
                                    Uploaded
                                  </span>
                                )}
                              </div>
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No variables to configure</p>
                  </div>
                )}
              </div>

              {/* Message Preview */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700 block">
                  Message Preview
                </Label>

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
                  {/* Chat Messages Area */}
                  <div className="relative p-4 space-y-4 min-h-[300px]">
                    {/* Preview Message using MessageBubble */}
                    {(() => {
                      const previewMessage = {
                        id: "preview",
                        message: "",
                        isOutbound: true,
                        status: "SENT" as const,
                        createdAt: new Date().toISOString(),
                        phoneNumber: "+1234567890",
                        whatsAppPhoneNumberId: "preview",
                        recipientId: "preview",
                        updatedAt: new Date().toISOString(),
                        mediaIds: [],
                        templateData: generatePreviewTemplateData(),
                        interactiveJson: [],
                      };

                      return <MessageBubble message={previewMessage} />;
                    })()}
                  </div>
                </div>

                {/* Helper Text */}
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>
                      {variables.some((variable) => {
                        if (variable.format === "TEXT") {
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
                          return !variable.mediaId;
                        }
                      })
                        ? "Configure all template variables or provide fallback values"
                        : "All variables configured. You can now send the template."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center p-6 border-t border-gray-200 gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={
                isLoading ||
                variables.some((variable) => {
                  if (variable.format === "TEXT") {
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
                    return !variable.mediaId;
                  }
                })
              }
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Template"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
