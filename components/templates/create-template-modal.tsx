"use client";

import { useEffect, useState } from "react";
import {
  Info,
  Plus,
  Trash2,
  X,
  Upload,
  Image,
  Video,
  FileText,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Type,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownButton } from "@/components/ui/dropdown-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTemplates } from "@/context/template-provider";
import { useUser } from "@/context/user-context";
import SearchableDropdown from "../ui/searchable-dropdown";
import {
  formatWhatsAppMessage,
  unformatWhatsAppMessage,
  parseWhatsAppFormatting,
  getWhatsAppFormattingClasses,
  WhatsAppFormatting,
} from "@/lib/utils";

interface CreateTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onCreateTemplate: () => void;
  editingTemplate?: any;
}

type HeaderFormat = "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";

export function CreateTemplateModal({
  open,
  onClose,
  onCreateTemplate,
  editingTemplate,
}: CreateTemplateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(editingTemplate?.name || "");
  const [language, setLanguage] = useState(
    editingTemplate?.language || "en_US"
  );
  const [category, setCategory] = useState(
    editingTemplate?.category || "MARKETING"
  );

  // Header state
  const [headerFormat, setHeaderFormat] = useState<HeaderFormat>("TEXT");
  const [headerText, setHeaderText] = useState(
    editingTemplate?.components?.find((c: any) => c.type === "HEADER")?.text ||
      ""
  );
  const [headerExamples, setHeaderExamples] = useState<string[]>(
    editingTemplate?.components?.find((c: any) => c.type === "HEADER")?.example
      ?.header_text || []
  );
  const [headerMediaFile, setHeaderMediaFile] = useState<File | null>(null);
  const [headerMediaId, setHeaderMediaId] = useState<string>("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Body state
  const [bodyText, setBodyText] = useState(
    editingTemplate?.components?.find((c: any) => c.type === "BODY")?.text || ""
  );
  const [bodyExamples, setBodyExamples] = useState<string[]>(
    editingTemplate?.components?.find((c: any) => c.type === "BODY")?.example
      ?.body_text?.[0] || []
  );
  const [showRules, setShowRules] = useState(false);

  // Button state
  const [buttons, setButtons] = useState<any[]>(
    editingTemplate?.components?.find((c: any) => c.type === "BUTTONS")?.buttons || []
  );

  // Preview mode states
  const [isHeaderPreviewMode, setIsHeaderPreviewMode] = useState(false);
  const [isBodyPreviewMode, setIsBodyPreviewMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });

  const { userInfo } = useUser();
  const { createTemplate, selectedWhatsAppAccountId } = useTemplates();

  const fixVariableNumbering = (text: string): string => {
    let counter = 1;
    return text.replace(/{{(\d+)}}/g, () => `{{${counter++}}}`);
  };

  const uploadMediaFile = async (file: File): Promise<string> => {
    if (!userInfo?.whatsappAccount?.id) {
      throw new Error("WhatsApp account not found");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userInfo.whatsappAccount.id);

    const response = await fetch("/api/whatsapp/upload-session", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload media");
    }

    const data = await response.json();
    return data.fileHandle; // Return the file handle for WhatsApp templates
  };

  const handleHeaderMediaUpload = async () => {
    if (!headerMediaFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploadingMedia(true);
    try {
      const mediaId = await uploadMediaFile(headerMediaFile);
      setHeaderMediaId(mediaId);
      toast.success("Media uploaded successfully!");
    } catch (error) {
      console.error("Media upload error:", error);
      toast.error("Failed to upload media");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !language || !category || !bodyText) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedWhatsAppAccountId) {
      toast.error("No WhatsApp account selected");
      return;
    }

    // Validate header based on format
    if (headerFormat === "TEXT" && !headerText.trim()) {
      toast.error("Please enter header text");
      return;
    }

    if (headerFormat !== "TEXT" && !headerMediaId) {
      toast.error("Please upload media for header");
      return;
    }

    // Fix variable numbering in text components
    const fixedHeaderText = headerText ? fixVariableNumbering(headerText) : "";
    const fixedBodyText = fixVariableNumbering(bodyText);

    // Validate variable numbering in header and body text
    const headerVariables = (fixedHeaderText.match(/{{(\d+)}}/g) || []).map(
      (match: string) => parseInt(match.match(/\d+/)![0])
    );
    const bodyVariables = (fixedBodyText.match(/{{(\d+)}}/g) || []).map(
      (match: string) => parseInt(match.match(/\d+/)![0])
    );

    // Check if variables start from 1 and are sequential
    const isHeaderSequential =
      headerVariables.length === 0 ||
      (headerVariables[0] === 1 &&
        headerVariables.every((val: number, idx: number) => val === idx + 1));
    const isBodySequential =
      bodyVariables.length === 0 ||
      (bodyVariables[0] === 1 &&
        bodyVariables.every((val: number, idx: number) => val === idx + 1));

    if (!isHeaderSequential && headerVariables.length > 0) {
      toast.error(
        `Header variables must start from 1 and be sequential. Found: ${headerVariables.join(
          ", "
        )}`
      );
      return;
    }

    if (!isBodySequential && bodyVariables.length > 0) {
      toast.error(
        `Body variables must start from 1 and be sequential. Found: ${bodyVariables.join(
          ", "
        )}`
      );
      return;
    }

    // Count variables in header and body text
    const headerVarCount = headerVariables.length;
    const bodyVarCount = bodyVariables.length;

    // Validate examples match variables
    if (
      headerFormat === "TEXT" &&
      headerText &&
      headerExamples.length !== headerVarCount
    ) {
      toast.error(
        `Please provide ${headerVarCount} example${
          headerVarCount !== 1 ? "s" : ""
        } for the header variables`
      );
      return;
    }

    if (bodyExamples.length !== bodyVarCount) {
      toast.error(
        `Please provide ${bodyVarCount} example${
          bodyVarCount !== 1 ? "s" : ""
        } for the body variables`
      );
      return;
    }

    setIsLoading(true);

    try {
      const templateData = {
        name: name.toLowerCase().replace(/ /g, "_"),
        language,
        category,
        components: [
          ...(headerFormat === "TEXT" && fixedHeaderText
            ? [
                {
                  type: "HEADER",
                  format: "TEXT",
                  text: fixedHeaderText,
                  example: {
                    header_text: headerExamples,
                  },
                },
              ]
            : headerFormat !== "TEXT" && headerMediaId
            ? [
                {
                  type: "HEADER",
                  format: headerFormat,
                  example: {
                    header_handle: [headerMediaId], // This should be the mediaId from WhatsApp
                  },
                },
              ]
            : []),
          {
            type: "BODY",
            text: fixedBodyText,
            example: {
              body_text: [bodyExamples.map((example) => example || "")],
            },
          },
          {
            type: "FOOTER",
            text: "Sent using AvenPing. Reply STOP to opt-out.",
          },
          ...(buttons.length > 0 ? [{
            type: "BUTTONS",
            buttons: buttons.map(button => {
              const buttonData: any = { type: button.type, text: button.text };
              if (button.type === "URL") {
                buttonData.url = button.url;
              } else if (button.type === "PHONE_NUMBER") {
                buttonData.phone_number = button.phone_number;
              }
              return buttonData;
            })
          }] : []),
        ],
      };

      await createTemplate(selectedWhatsAppAccountId, templateData);
      onCreateTemplate();
      onClose();
    } catch (error) {
      console.error("Error creating/updating template:", error);
      toast.error(
        editingTemplate
          ? "Failed to update template"
          : "Failed to create template"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeaderExampleChange = (index: number, value: string) => {
    const newExamples = [...headerExamples];
    newExamples[index] = value;
    setHeaderExamples(newExamples);
  };

  const addHeaderExample = () => {
    const headerVariables = (headerText.match(/{{(\d+)}}/g) || []).length;
    if (headerExamples.length < headerVariables) {
      setHeaderExamples([...headerExamples, ""]);
    } else {
      toast.error("Maximum number of examples reached for header variables");
    }
  };

  const removeHeaderExample = (index: number) => {
    setHeaderExamples(headerExamples.filter((_, i) => i !== index));
  };

  const handleBodyExampleChange = (index: number, value: string) => {
    const newExamples = [...bodyExamples];
    newExamples[index] = value;
    setBodyExamples(newExamples);
  };

  const addBodyExample = () => {
    const bodyVariables = (bodyText.match(/{{(\d+)}}/g) || []).length;
    if (bodyExamples.length < bodyVariables) {
      setBodyExamples([...bodyExamples, ""]);
    } else {
      toast.error("Maximum number of examples reached for body variables");
    }
  };

  const removeBodyExample = (index: number) => {
    setBodyExamples(bodyExamples.filter((_, i) => i !== index));
  };

  // Button management functions
  const addButton = () => {
    if (buttons.length >= 3) {
      toast.error("Maximum 3 buttons allowed per template");
      return;
    }
    setButtons([...buttons, { type: "QUICK_REPLY", text: "", url: "", phone_number: "" }]);
  };

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const updateButton = (index: number, field: string, value: string) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setButtons(newButtons);
  };

  const updateButtonType = (index: number, type: string) => {
    const newButtons = [...buttons];
    newButtons[index] = { 
      type, 
      text: "", 
      url: type === "URL" ? "" : undefined, 
      phone_number: type === "PHONE_NUMBER" ? "" : undefined 
    };
    setButtons(newButtons);
  };

  // WhatsApp formatting functions
  const handleTextSelection = (
    e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setSelectedText(
      target.value.substring(
        target.selectionStart || 0,
        target.selectionEnd || 0
      )
    );
    setCursorPosition({
      start: target.selectionStart || 0,
      end: target.selectionEnd || 0,
    });
  };

  const applyFormatting = (
    formatting: WhatsAppFormatting,
    target: "header" | "body"
  ) => {
    let textToFormat = selectedText;
    const currentText = target === "header" ? headerText : bodyText;

    if (!textToFormat && !currentText.trim()) {
      toast.error("Please enter some text first.");
      return;
    }

    if (!textToFormat) {
      textToFormat = currentText;
    }

    const formattedText = formatWhatsAppMessage(textToFormat, formatting);
    let newText = currentText;

    if (selectedText) {
      // Format selected text
      newText =
        currentText.substring(0, cursorPosition.start) +
        formattedText +
        currentText.substring(cursorPosition.end);

      // Clear selection
      setSelectedText("");
    } else {
      // Format entire text
      newText = formattedText;
    }

    if (target === "header") {
      setHeaderText(newText);
    } else {
      setBodyText(newText);
    }
  };

  const clearFormatting = (target: "header" | "body") => {
    const currentText = target === "header" ? headerText : bodyText;
    if (currentText.trim()) {
      const unformatted = unformatWhatsAppMessage(currentText);
      if (target === "header") {
        setHeaderText(unformatted);
      } else {
        setBodyText(unformatted);
      }
      toast.success("Formatting cleared");
    }
  };

  // Update examples when text changes
  useEffect(() => {
    const headerVariables = (headerText.match(/{{(\d+)}}/g) || []).length;
    const bodyVariables = (bodyText.match(/{{(\d+)}}/g) || []).length;

    // Adjust header examples
    if (headerExamples.length > headerVariables) {
      setHeaderExamples(headerExamples.slice(0, headerVariables));
    } else if (headerExamples.length < headerVariables) {
      setHeaderExamples([
        ...headerExamples,
        ...Array(headerVariables - headerExamples.length).fill(""),
      ]);
    }

    // Adjust body examples
    if (bodyExamples.length > bodyVariables) {
      setBodyExamples(bodyExamples.slice(0, bodyVariables));
    } else if (bodyExamples.length < bodyVariables) {
      setBodyExamples([
        ...bodyExamples,
        ...Array(bodyVariables - bodyExamples.length).fill(""),
      ]);
    }
  }, [headerText, bodyText]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && !editingTemplate) {
      setName("");
      setLanguage("en_US");
      setCategory("MARKETING");
      setHeaderFormat("TEXT");
      setHeaderText("");
      setHeaderExamples([]);
      setHeaderMediaFile(null);
      setHeaderMediaId("");
      setBodyText("");
      setBodyExamples([]);
      setButtons([]);
    }
  }, [open, editingTemplate]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-100" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-[700px] w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </h2>
              <p className="text-sm text-gray-600">
                Templates must be approved by Meta before they can be used
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Template Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., seasonal_promotion"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="language"
                      className="text-sm font-medium text-gray-700"
                    >
                      Language
                    </Label>
                    <SearchableDropdown
                      items={[
                        { id: "af", label: "Afrikaans", value: "af" },
                        { id: "sq", label: "Albanian", value: "sq" },
                        { id: "ar", label: "Arabic", value: "ar" },
                        { id: "ar_EG", label: "Arabic (EGY)", value: "ar_EG" },
                        { id: "ar_AE", label: "Arabic (UAE)", value: "ar_AE" },
                        { id: "ar_LB", label: "Arabic (LBN)", value: "ar_LB" },
                        { id: "ar_MA", label: "Arabic (MAR)", value: "ar_MA" },
                        { id: "ar_QA", label: "Arabic (QAT)", value: "ar_QA" },
                        { id: "az", label: "Azerbaijani", value: "az" },
                        { id: "be_BY", label: "Belarusian", value: "be_BY" },
                        { id: "bn", label: "Bengali", value: "bn" },
                        { id: "bn_IN", label: "Bengali (IND)", value: "bn_IN" },
                        { id: "bg", label: "Bulgarian", value: "bg" },
                        { id: "ca", label: "Catalan", value: "ca" },
                        { id: "zh_CN", label: "Chinese (CHN)", value: "zh_CN" },
                        { id: "zh_HK", label: "Chinese (HKG)", value: "zh_HK" },
                        { id: "zh_TW", label: "Chinese (TAI)", value: "zh_TW" },
                        { id: "hr", label: "Croatian", value: "hr" },
                        { id: "cs", label: "Czech", value: "cs" },
                        { id: "da", label: "Danish", value: "da" },
                        { id: "prs_AF", label: "Dari", value: "prs_AF" },
                        { id: "nl", label: "Dutch", value: "nl" },
                        { id: "nl_BE", label: "Dutch (BEL)", value: "nl_BE" },
                        { id: "en", label: "English", value: "en" },
                        { id: "en_GB", label: "English (UK)", value: "en_GB" },
                        { id: "en_US", label: "English (US)", value: "en_US" },
                        { id: "en_AE", label: "English (UAE)", value: "en_AE" },
                        { id: "en_AU", label: "English (AUS)", value: "en_AU" },
                        { id: "en_CA", label: "English (CAN)", value: "en_CA" },
                        { id: "en_GH", label: "English (GHA)", value: "en_GH" },
                        { id: "en_IE", label: "English (IRL)", value: "en_IE" },
                        { id: "en_IN", label: "English (IND)", value: "en_IN" },
                        { id: "en_JM", label: "English (JAM)", value: "en_JM" },
                        { id: "en_MY", label: "English (MYS)", value: "en_MY" },
                        { id: "en_NZ", label: "English (NZL)", value: "en_NZ" },
                        { id: "en_QA", label: "English (QAT)", value: "en_QA" },
                        { id: "en_SG", label: "English (SGP)", value: "en_SG" },
                        { id: "en_UG", label: "English (UGA)", value: "en_UG" },
                        { id: "en_ZA", label: "English (ZAF)", value: "en_ZA" },
                        { id: "et", label: "Estonian", value: "et" },
                        { id: "fil", label: "Filipino", value: "fil" },
                        { id: "fi", label: "Finnish", value: "fi" },
                        { id: "fr", label: "French", value: "fr" },
                        { id: "fr_BE", label: "French (BEL)", value: "fr_BE" },
                        { id: "fr_CA", label: "French (CAN)", value: "fr_CA" },
                        { id: "fr_CH", label: "French (CHE)", value: "fr_CH" },
                        { id: "fr_CI", label: "French (CIV)", value: "fr_CI" },
                        { id: "fr_MA", label: "French (MAR)", value: "fr_MA" },
                        { id: "ka", label: "Georgian", value: "ka" },
                        { id: "de", label: "German", value: "de" },
                        { id: "de_AT", label: "German (AUT)", value: "de_AT" },
                        { id: "de_CH", label: "German (CHE)", value: "de_CH" },
                        { id: "el", label: "Greek", value: "el" },
                        { id: "gu", label: "Gujarati", value: "gu" },
                        { id: "ha", label: "Hausa", value: "ha" },
                        { id: "he", label: "Hebrew", value: "he" },
                        { id: "hi", label: "Hindi", value: "hi" },
                        { id: "hu", label: "Hungarian", value: "hu" },
                        { id: "id", label: "Indonesian", value: "id" },
                        { id: "ga", label: "Irish", value: "ga" },
                        { id: "it", label: "Italian", value: "it" },
                        { id: "ja", label: "Japanese", value: "ja" },
                        { id: "kn", label: "Kannada", value: "kn" },
                        { id: "kk", label: "Kazakh", value: "kk" },
                        { id: "rw_RW", label: "Kinyarwanda", value: "rw_RW" },
                        { id: "ko", label: "Korean", value: "ko" },
                        {
                          id: "ky_KG",
                          label: "Kyrgyz (Kyrgyzstan)",
                          value: "ky_KG",
                        },
                        { id: "lo", label: "Lao", value: "lo" },
                        { id: "lv", label: "Latvian", value: "lv" },
                        { id: "lt", label: "Lithuanian", value: "lt" },
                        { id: "mk", label: "Macedonian", value: "mk" },
                        { id: "ms", label: "Malay", value: "ms" },
                        { id: "ml", label: "Malayalam", value: "ml" },
                        { id: "mr", label: "Marathi", value: "mr" },
                        { id: "nb", label: "Norwegian", value: "nb" },
                        { id: "ps_AF", label: "Pashto", value: "ps_AF" },
                        { id: "fa", label: "Persian", value: "fa" },
                        { id: "pl", label: "Polish", value: "pl" },
                        {
                          id: "pt_BR",
                          label: "Portuguese (BR)",
                          value: "pt_BR",
                        },
                        {
                          id: "pt_PT",
                          label: "Portuguese (POR)",
                          value: "pt_PT",
                        },
                        { id: "pa", label: "Punjabi", value: "pa" },
                        { id: "ro", label: "Romanian", value: "ro" },
                        { id: "ru", label: "Russian", value: "ru" },
                        { id: "sr", label: "Serbian", value: "sr" },
                        { id: "si_LK", label: "Sinhala", value: "si_LK" },
                        { id: "sk", label: "Slovak", value: "sk" },
                        { id: "sl", label: "Slovenian", value: "sl" },
                        { id: "es", label: "Spanish", value: "es" },
                        { id: "es_AR", label: "Spanish (ARG)", value: "es_AR" },
                        { id: "es_CL", label: "Spanish (CHL)", value: "es_CL" },
                        { id: "es_CO", label: "Spanish (COL)", value: "es_CO" },
                        { id: "es_CR", label: "Spanish (CRI)", value: "es_CR" },
                        { id: "es_DO", label: "Spanish (DOM)", value: "es_DO" },
                        { id: "es_EC", label: "Spanish (ECU)", value: "es_EC" },
                        { id: "es_HN", label: "Spanish (HND)", value: "es_HN" },
                        { id: "es_MX", label: "Spanish (MEX)", value: "es_MX" },
                        { id: "es_PA", label: "Spanish (PAN)", value: "es_PA" },
                        { id: "es_PE", label: "Spanish (PER)", value: "es_PE" },
                        { id: "es_ES", label: "Spanish (SPA)", value: "es_ES" },
                        { id: "es_UY", label: "Spanish (URY)", value: "es_UY" },
                        { id: "sw", label: "Swahili", value: "sw" },
                        { id: "sv", label: "Swedish", value: "sv" },
                        { id: "ta", label: "Tamil", value: "ta" },
                        { id: "te", label: "Telugu", value: "te" },
                        { id: "th", label: "Thai", value: "th" },
                        { id: "tr", label: "Turkish", value: "tr" },
                        { id: "uk", label: "Ukrainian", value: "uk" },
                        { id: "ur", label: "Urdu", value: "ur" },
                        { id: "uz", label: "Uzbek", value: "uz" },
                        { id: "vi", label: "Vietnamese", value: "vi" },
                        { id: "zu", label: "Zulu", value: "zu" },
                      ]}
                      placeholder="Select Language"
                      onSelect={(item) => setLanguage(item.value)}
                      selectedLabel={
                        [
                          { id: "af", label: "Afrikaans", value: "af" },
                          { id: "sq", label: "Albanian", value: "sq" },
                          { id: "ar", label: "Arabic", value: "ar" },
                          {
                            id: "ar_EG",
                            label: "Arabic (EGY)",
                            value: "ar_EG",
                          },
                          {
                            id: "ar_AE",
                            label: "Arabic (UAE)",
                            value: "ar_AE",
                          },
                          {
                            id: "ar_LB",
                            label: "Arabic (LBN)",
                            value: "ar_LB",
                          },
                          {
                            id: "ar_MA",
                            label: "Arabic (MAR)",
                            value: "ar_MA",
                          },
                          {
                            id: "ar_QA",
                            label: "Arabic (QAT)",
                            value: "ar_QA",
                          },
                          { id: "az", label: "Azerbaijani", value: "az" },
                          { id: "be_BY", label: "Belarusian", value: "be_BY" },
                          { id: "bn", label: "Bengali", value: "bn" },
                          {
                            id: "bn_IN",
                            label: "Bengali (IND)",
                            value: "bn_IN",
                          },
                          { id: "bg", label: "Bulgarian", value: "bg" },
                          { id: "ca", label: "Catalan", value: "ca" },
                          {
                            id: "zh_CN",
                            label: "Chinese (CHN)",
                            value: "zh_CN",
                          },
                          {
                            id: "zh_HK",
                            label: "Chinese (HKG)",
                            value: "zh_HK",
                          },
                          {
                            id: "zh_TW",
                            label: "Chinese (TAI)",
                            value: "zh_TW",
                          },
                          { id: "hr", label: "Croatian", value: "hr" },
                          { id: "cs", label: "Czech", value: "cs" },
                          { id: "da", label: "Danish", value: "da" },
                          { id: "prs_AF", label: "Dari", value: "prs_AF" },
                          { id: "nl", label: "Dutch", value: "nl" },
                          { id: "nl_BE", label: "Dutch (BEL)", value: "nl_BE" },
                          { id: "en", label: "English", value: "en" },
                          {
                            id: "en_GB",
                            label: "English (UK)",
                            value: "en_GB",
                          },
                          {
                            id: "en_US",
                            label: "English (US)",
                            value: "en_US",
                          },
                          {
                            id: "en_AE",
                            label: "English (UAE)",
                            value: "en_AE",
                          },
                          {
                            id: "en_AU",
                            label: "English (AUS)",
                            value: "en_AU",
                          },
                          {
                            id: "en_CA",
                            label: "English (CAN)",
                            value: "en_CA",
                          },
                          {
                            id: "en_GH",
                            label: "English (GHA)",
                            value: "en_GH",
                          },
                          {
                            id: "en_IE",
                            label: "English (IRL)",
                            value: "en_IE",
                          },
                          {
                            id: "en_IN",
                            label: "English (IND)",
                            value: "en_IN",
                          },
                          {
                            id: "en_JM",
                            label: "English (JAM)",
                            value: "en_JM",
                          },
                          {
                            id: "en_MY",
                            label: "English (MYS)",
                            value: "en_MY",
                          },
                          {
                            id: "en_NZ",
                            label: "English (NZL)",
                            value: "en_NZ",
                          },
                          {
                            id: "en_QA",
                            label: "English (QAT)",
                            value: "en_QA",
                          },
                          {
                            id: "en_SG",
                            label: "English (SGP)",
                            value: "en_SG",
                          },
                          {
                            id: "en_UG",
                            label: "English (UGA)",
                            value: "en_UG",
                          },
                          {
                            id: "en_ZA",
                            label: "English (ZAF)",
                            value: "en_ZA",
                          },
                          { id: "et", label: "Estonian", value: "et" },
                          { id: "fil", label: "Filipino", value: "fil" },
                          { id: "fi", label: "Finnish", value: "fi" },
                          { id: "fr", label: "French", value: "fr" },
                          {
                            id: "fr_BE",
                            label: "French (BEL)",
                            value: "fr_BE",
                          },
                          {
                            id: "fr_CA",
                            label: "French (CAN)",
                            value: "fr_CA",
                          },
                          {
                            id: "fr_CH",
                            label: "French (CHE)",
                            value: "fr_CH",
                          },
                          {
                            id: "fr_CI",
                            label: "French (CIV)",
                            value: "fr_CI",
                          },
                          {
                            id: "fr_MA",
                            label: "French (MAR)",
                            value: "fr_MA",
                          },
                          { id: "ka", label: "Georgian", value: "ka" },
                          { id: "de", label: "German", value: "de" },
                          {
                            id: "de_AT",
                            label: "German (AUT)",
                            value: "de_AT",
                          },
                          {
                            id: "de_CH",
                            label: "German (CHE)",
                            value: "de_CH",
                          },
                          { id: "el", label: "Greek", value: "el" },
                          { id: "gu", label: "Gujarati", value: "gu" },
                          { id: "ha", label: "Hausa", value: "ha" },
                          { id: "he", label: "Hebrew", value: "he" },
                          { id: "hi", label: "Hindi", value: "hi" },
                          { id: "hu", label: "Hungarian", value: "hu" },
                          { id: "id", label: "Indonesian", value: "id" },
                          { id: "ga", label: "Irish", value: "ga" },
                          { id: "it", label: "Italian", value: "it" },
                          { id: "ja", label: "Japanese", value: "ja" },
                          { id: "kn", label: "Kannada", value: "kn" },
                          { id: "kk", label: "Kazakh", value: "kk" },
                          { id: "rw_RW", label: "Kinyarwanda", value: "rw_RW" },
                          { id: "ko", label: "Korean", value: "ko" },
                          {
                            id: "ky_KG",
                            label: "Kyrgyz (Kyrgyzstan)",
                            value: "ky_KG",
                          },
                          { id: "lo", label: "Lao", value: "lo" },
                          { id: "lv", label: "Latvian", value: "lv" },
                          { id: "lt", label: "Lithuanian", value: "lt" },
                          { id: "mk", label: "Macedonian", value: "mk" },
                          { id: "ms", label: "Malay", value: "ms" },
                          { id: "ml", label: "Malayalam", value: "ml" },
                          { id: "mr", label: "Marathi", value: "mr" },
                          { id: "nb", label: "Norwegian", value: "nb" },
                          { id: "ps_AF", label: "Pashto", value: "ps_AF" },
                          { id: "fa", label: "Persian", value: "fa" },
                          { id: "pl", label: "Polish", value: "pl" },
                          {
                            id: "pt_BR",
                            label: "Portuguese (BR)",
                            value: "pt_BR",
                          },
                          {
                            id: "pt_PT",
                            label: "Portuguese (POR)",
                            value: "pt_PT",
                          },
                          { id: "pa", label: "Punjabi", value: "pa" },
                          { id: "ro", label: "Romanian", value: "ro" },
                          { id: "ru", label: "Russian", value: "ru" },
                          { id: "sr", label: "Serbian", value: "sr" },
                          { id: "si_LK", label: "Sinhala", value: "si_LK" },
                          { id: "sk", label: "Slovak", value: "sk" },
                          { id: "sl", label: "Slovenian", value: "sl" },
                          { id: "es", label: "Spanish", value: "es" },
                          {
                            id: "es_AR",
                            label: "Spanish (ARG)",
                            value: "es_AR",
                          },
                          {
                            id: "es_CL",
                            label: "Spanish (CHL)",
                            value: "es_CL",
                          },
                          {
                            id: "es_CO",
                            label: "Spanish (COL)",
                            value: "es_CO",
                          },
                          {
                            id: "es_CR",
                            label: "Spanish (CRI)",
                            value: "es_CR",
                          },
                          {
                            id: "es_DO",
                            label: "Spanish (DOM)",
                            value: "es_DO",
                          },
                          {
                            id: "es_EC",
                            label: "Spanish (ECU)",
                            value: "es_EC",
                          },
                          {
                            id: "es_HN",
                            label: "Spanish (HND)",
                            value: "es_HN",
                          },
                          {
                            id: "es_MX",
                            label: "Spanish (MEX)",
                            value: "es_MX",
                          },
                          {
                            id: "es_PA",
                            label: "Spanish (PAN)",
                            value: "es_PA",
                          },
                          {
                            id: "es_PE",
                            label: "Spanish (PER)",
                            value: "es_PE",
                          },
                          {
                            id: "es_ES",
                            label: "Spanish (SPA)",
                            value: "es_ES",
                          },
                          {
                            id: "es_UY",
                            label: "Spanish (URY)",
                            value: "es_UY",
                          },
                          { id: "sw", label: "Swahili", value: "sw" },
                          { id: "sv", label: "Swedish", value: "sv" },
                          { id: "ta", label: "Tamil", value: "ta" },
                          { id: "te", label: "Telugu", value: "te" },
                          { id: "th", label: "Thai", value: "th" },
                          { id: "tr", label: "Turkish", value: "tr" },
                          { id: "uk", label: "Ukrainian", value: "uk" },
                          { id: "ur", label: "Urdu", value: "ur" },
                          { id: "uz", label: "Uzbek", value: "uz" },
                          { id: "vi", label: "Vietnamese", value: "vi" },
                          { id: "zu", label: "Zulu", value: "zu" },
                        ].find((lang) => lang.value === language)?.label || null
                      }
                      variant="outline"
                      className="w-full"
                    />
                  </div>
                </div>
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Category
                </Label>
                <div className="flex gap-2 items-center">
                  <DropdownButton
                    options={[
                      { value: "MARKETING", label: "Marketing" },
                      { value: "UTILITY", label: "Utility" },
                      { value: "AUTHENTICATION", label: "Authentication" },
                    ]}
                    variant="outline"
                    selected={category}
                    onChange={(value) => setCategory(value)}
                    className="w-full justify-between"
                  >
                    {category === "MARKETING"
                      ? "Marketing"
                      : category === "UTILITY"
                      ? "Utility"
                      : category === "AUTHENTICATION"
                      ? "Authentication"
                      : "Select Category"}
                  </DropdownButton>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRules(true)}
                  >
                    <Info className="h-4 w-4" />
                    Verification Rules
                  </Button>
                </div>
              </div>

              {/* Template Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Template Content
                </h3>

                {/* Header Section */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="header"
                        className="text-sm font-medium text-gray-700"
                      >
                        Header (Optional)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Optional header text or media for your template
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Header Format Selector */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-gray-600">Format:</Label>
                      <DropdownButton
                        variant="outline"
                        size="sm"
                        options={[
                          { value: "TEXT", label: "Text" },
                          { value: "IMAGE", label: "Image" },
                          { value: "VIDEO", label: "Video" },
                          { value: "DOCUMENT", label: "Document" },
                        ]}
                        selected={headerFormat}
                        onChange={(value) =>
                          setHeaderFormat(value as HeaderFormat)
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {headerFormat === "TEXT"
                          ? "Text"
                          : headerFormat === "IMAGE"
                          ? "Image"
                          : headerFormat === "VIDEO"
                          ? "Video"
                          : headerFormat === "DOCUMENT"
                          ? "Document"
                          : "Select Format"}
                      </DropdownButton>
                    </div>
                  </div>

                  {/* Text Header */}
                  {headerFormat === "TEXT" && (
                    <>
                      {/* Formatting Toolbar */}
                      <div className="flex items-center gap-1 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            applyFormatting({ bold: true }, "header")
                          }
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                          title="Bold"
                        >
                          <Bold className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            applyFormatting({ italic: true }, "header")
                          }
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                          title="Italic"
                        >
                          <Italic className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            applyFormatting({ strikethrough: true }, "header")
                          }
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                          title="Strikethrough"
                        >
                          <Strikethrough className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            applyFormatting({ monospace: true }, "header")
                          }
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                          title="Monospace"
                        >
                          <Code className="h-3 w-3" />
                        </Button>
                        <div className="w-px h-4 bg-gray-300 mx-1" />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => clearFormatting("header")}
                          className="h-6 px-2 text-xs hover:bg-gray-200"
                          title="Clear Formatting"
                        >
                          Clear
                        </Button>
                      </div>

                      {/* Header Input with Preview Toggle */}
                      <div className="relative">
                        {isHeaderPreviewMode ? (
                          /* Preview Mode */
                          <div className="w-full min-h-[40px] border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="text-sm text-gray-800 whitespace-pre-wrap">
                              {parseWhatsAppFormatting(headerText).map(
                                (part, index) => (
                                  <span
                                    key={index}
                                    className={getWhatsAppFormattingClasses(
                                      part.type
                                    )}
                                  >
                                    {part.text}
                                  </span>
                                )
                              )}
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsHeaderPreviewMode(false)}
                              className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-gray-200"
                              title="Switch to Edit Mode"
                            >
                              <EyeOff className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          /* Input Mode */
                          <div className="relative">
                            <Input
                              id="header"
                              value={headerText}
                              onChange={(e) => setHeaderText(e.target.value)}
                              onSelect={handleTextSelection}
                              placeholder="e.g., Our {{1}} is on!"
                              className="font-mono pr-10"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsHeaderPreviewMode(true)}
                              className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-gray-200"
                              title="Switch to Preview Mode"
                              disabled={!headerText.trim()}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-gray-600">
                            Variable Examples
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addHeaderExample}
                            className="h-8"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Example
                          </Button>
                        </div>
                        {headerExamples.map((example, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={example}
                              onChange={(e) =>
                                handleHeaderExampleChange(index, e.target.value)
                              }
                              placeholder={`Example ${index + 1}`}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeHeaderExample(index)}
                              className="h-10 w-10 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Media Header */}
                  {headerFormat !== "TEXT" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {headerFormat === "IMAGE" && (
                          <Image className="h-4 w-4" />
                        )}
                        {headerFormat === "VIDEO" && (
                          <Video className="h-4 w-4" />
                        )}
                        {headerFormat === "DOCUMENT" && (
                          <FileText className="h-4 w-4" />
                        )}
                        <span className="text-sm text-gray-600">
                          Upload {headerFormat.toLowerCase()} for header
                        </span>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="file"
                          accept={
                            headerFormat === "IMAGE"
                              ? "image/*"
                              : headerFormat === "VIDEO"
                              ? "video/*"
                              : ".pdf,.doc,.docx,.txt"
                          }
                          onChange={(e) =>
                            setHeaderMediaFile(e.target.files?.[0] || null)
                          }
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#D3F8FF] file:text-[#30CFED] hover:file:bg-[#D3F8FF]/80"
                        />

                        {headerMediaFile && (
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleHeaderMediaUpload}
                              disabled={isUploadingMedia}
                              className="text-[#30CFED] border-[#30CFED] hover:bg-[#D3F8FF]"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {isUploadingMedia
                                ? "Uploading..."
                                : "Upload Media"}
                            </Button>
                            {headerMediaId && (
                              <span className="text-sm text-green-600">
                                ✓ Uploaded
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Body Section */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="body"
                      className="text-sm font-medium text-gray-700"
                    >
                      Body (Required)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The main content of your template. Use
                            &#123;&#123;1&#125;&#125;,
                            &#123;&#123;2&#125;&#125;, etc. for variables.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 p-2 bg-white rounded-lg border border-gray-200">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormatting({ bold: true }, "body")}
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                      title="Bold"
                    >
                      <Bold className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormatting({ italic: true }, "body")}
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                      title="Italic"
                    >
                      <Italic className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        applyFormatting({ strikethrough: true }, "body")
                      }
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                      title="Strikethrough"
                    >
                      <Strikethrough className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        applyFormatting({ monospace: true }, "body")
                      }
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                      title="Monospace"
                    >
                      <Code className="h-3 w-3" />
                    </Button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => clearFormatting("body")}
                      className="h-6 px-2 text-xs hover:bg-gray-200"
                      title="Clear Formatting"
                    >
                      Clear
                    </Button>
                  </div>

                  {/* Body Input with Preview Toggle */}
                  <div className="relative">
                    {isBodyPreviewMode ? (
                      /* Preview Mode */
                      <div className="w-full min-h-[100px] border-2 border-gray-200 rounded-lg p-3 bg-white">
                        <div className="text-sm text-gray-800 whitespace-pre-wrap">
                          {parseWhatsAppFormatting(bodyText).map(
                            (part, index) => (
                              <span
                                key={index}
                                className={getWhatsAppFormattingClasses(
                                  part.type
                                )}
                              >
                                {part.text}
                              </span>
                            )
                          )}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsBodyPreviewMode(false)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-200"
                          title="Switch to Edit Mode"
                        >
                          <EyeOff className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      /* Input Mode */
                      <div className="relative">
                        <Textarea
                          id="body"
                          value={bodyText}
                          onChange={(e) => setBodyText(e.target.value)}
                          onSelect={handleTextSelection}
                          placeholder="e.g., Shop now through {{1}} and use code {{2}} to get {{3}} off of all merchandise."
                          className="min-h-[100px] font-mono pr-10"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsBodyPreviewMode(true)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-200"
                          title="Switch to Preview Mode"
                          disabled={!bodyText.trim()}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-600">
                        Variable Examples
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addBodyExample}
                        className="h-8"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Example
                      </Button>
                    </div>
                    {bodyExamples.map((example, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={example}
                          onChange={(e) =>
                            handleBodyExampleChange(index, e.target.value)
                          }
                          placeholder={`Example ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBodyExample(index)}
                          className="h-10 w-10 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Buttons (Optional)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Add up to 3 buttons to your template. Choose from Quick Reply, URL, or Phone Number buttons.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addButton}
                      disabled={buttons.length >= 3}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Button
                    </Button>
                  </div>

                  {buttons.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No buttons added yet</p>
                      <p className="text-xs mt-1">Click "Add Button" to get started</p>
                    </div>
                  )}

                  {buttons.map((button, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Button {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeButton(index)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">Button Type</Label><br />
                          <DropdownButton
                            options={[
                              { value: "QUICK_REPLY", label: "Quick Reply" },
                              { value: "URL", label: "URL" },
                              { value: "PHONE_NUMBER", label: "Phone Number" },
                            ]}
                            variant="outline"
                            selected={button.type}
                            onChange={(value) => updateButtonType(index, value)}
                            className="w-full justify-between"
                          >
                            {button.type === "QUICK_REPLY"
                              ? "Quick Reply"
                              : button.type === "URL"
                              ? "URL"
                              : button.type === "PHONE_NUMBER"
                              ? "Phone Number"
                              : "Select Type"}
                          </DropdownButton>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">Button Text</Label>
                          <Input
                            value={button.text}
                            onChange={(e) => updateButton(index, "text", e.target.value)}
                            placeholder="e.g., Shop Now, Call Us, Learn More"
                            maxLength={25}
                          />
                        </div>
                      </div>

                      {button.type === "URL" && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">URL</Label>
                          <Input
                            value={button.url}
                            onChange={(e) => updateButton(index, "url", e.target.value)}
                            placeholder="https://example.com"
                            type="url"
                          />
                        </div>
                      )}

                      {button.type === "PHONE_NUMBER" && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">Phone Number</Label>
                          <Input
                            value={button.phone_number}
                            onChange={(e) => updateButton(index, "phone_number", e.target.value)}
                            placeholder="+1234567890"
                            type="tel"
                          />
                        </div>
                        )}
                    </div>
                  ))}

                  {buttons.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Button Guidelines:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• <strong>Quick Reply:</strong> Simple text button (max 25 characters)</li>
                            <li>• <strong>URL:</strong> Links to websites (must be HTTPS)</li>
                            <li>• <strong>Phone Number:</strong> International format recommended</li>
                            <li>• Maximum 3 buttons per template</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading
                ? "Creating..."
                : editingTemplate
                ? "Update Template"
                : "Create Template"}
            </Button>
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-130"
            onClick={() => setShowRules(false)}
          />
          <div className="fixed inset-0 z-140 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-[500px] w-full">
              <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  WhatsApp Template Verification Rules
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowRules(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Follow these rules to ensure your template gets approved by
                  the WhatsApp team.
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Variable Format
                    </h4>
                    <p className="text-sm text-gray-600">
                      • Variables must use the correct format:{" "}
                      <code className="font-mono bg-gray-100 px-1 rounded">
                        &#123;&#123;1&#125;&#125;
                      </code>
                    </p>
                    <p className="text-sm text-gray-600">
                      • Variables must be sequential (e.g.,
                      &#123;&#123;1&#125;&#125;, &#123;&#123;2&#125;&#125;,
                      &#123;&#123;3&#125;&#125;)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Variable Restrictions
                    </h4>
                    <p className="text-sm text-gray-600">
                      • Variables cannot contain special characters (#, $, %)
                    </p>
                    <p className="text-sm text-gray-600">
                      • Template cannot end with a variable
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Message Length
                    </h4>
                    <p className="text-sm text-gray-600">
                      • Message length should be proportional to the number of
                      variables
                    </p>
                    <p className="text-sm text-gray-600">
                      • Too many variables in a short message may be rejected
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Media Headers</h4>
                    <p className="text-sm text-gray-600">
                      • Supported formats: Image, Video, Document (PDF)
                    </p>
                    <p className="text-sm text-gray-600">
                      • Media files are uploaded to WhatsApp servers
                    </p>
                    <p className="text-sm text-gray-600">
                      • Media must be approved by WhatsApp before use
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
