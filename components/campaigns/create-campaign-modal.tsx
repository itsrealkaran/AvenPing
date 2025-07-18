"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Users, FileText, Settings, Clock, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContacts } from "@/context/contact-provider";
import { useTemplates } from "@/context/template-provider";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";

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
  type: 'HEADER' | 'BODY' | 'FOOTER';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
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
  variables: VariableData[];
  scheduleType: 'immediate' | 'scheduled';
  scheduledAt?: Date;
}

interface VariableData {
  id: string; // Unique identifier
  variableIndex: number;
  value: string;
  useAttribute: boolean;
  attributeName?: string;
  fallbackValue: string;
  componentType: 'HEADER' | 'BODY';
}

const STEPS = [
  { id: 1, title: "Select Contacts", icon: Users },
  { id: 2, title: "Choose Template", icon: FileText },
  { id: 3, title: "Configure Variables", icon: Settings },
  { id: 4, title: "Schedule Campaign", icon: Clock },
];

export function CreateCampaignModal({ open, onClose, onSubmit }: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeFilter, setActiveFilter] = useState<'UNDELIVERED' | 'UNREAD' | 'READ' | 'REPLIED'>('UNDELIVERED');
  const [contactSearch, setContactSearch] = useState('');
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    selectedContacts: [],
    templateName: "",
    variables: [],
    scheduleType: 'immediate',
  });

  const { attributes, contacts: allContacts } = useContacts();
  const { templates, selectedWhatsAppAccountId, setSelectedWhatsAppAccountId } = useTemplates();
  const { userInfo } = useUser();

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
  const categorizedContacts: Record<string, Contact[]> = (allContacts as Contact[] | undefined)?.reduce((acc: Record<string, Contact[]>, contact: Contact) => {
    const status = contact.status || 'undelivered';
    if (!acc[status]) acc[status] = [];
    acc[status].push(contact);
    return acc;
  }, {}) || {};

  // Get selected template
  const selectedTemplate = templates.find(t => t.name === campaignData.templateName);

  // Extract variables from template - separate header and body
  const headerVariables = selectedTemplate?.components
    .filter(comp => comp.type === 'HEADER' && comp.text)
    .flatMap(comp => {
      const matches = comp.text?.match(/{{(\d+)}}/g) || [];
      return matches.map(match => {
        const index = parseInt(match.match(/\d+/)![0]);
        return { index, original: match, componentType: 'HEADER' };
      });
    })
    .filter((v, i, arr) => arr.findIndex(item => item.index === v.index) === i)
    .sort((a, b) => a.index - b.index) || [];

  const bodyVariables = selectedTemplate?.components
    .filter(comp => comp.type === 'BODY' && comp.text)
    .flatMap(comp => {
      const matches = comp.text?.match(/{{(\d+)}}/g) || [];
      return matches.map(match => {
        const index = parseInt(match.match(/\d+/)![0]);
        return { index, original: match, componentType: 'BODY' };
      });
    })
    .filter((v, i, arr) => arr.findIndex(item => item.index === v.index) === i)
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
      }));
      setCampaignData(prev => ({ ...prev, variables: newVariables }));
    }
  }, [selectedTemplate]);

  const handleNext = () => {
    console.log("campaignData", campaignData);
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

    try {
      await onSubmit(campaignData);
      onClose();
      setCurrentStep(1);
      setCampaignData({
        name: "",
        selectedContacts: [],
        templateName: "",
        variables: [],
        scheduleType: 'immediate',
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    }
  };

  const handleContactToggle = (contact: Contact) => {
    setCampaignData(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.some(c => c.id === contact.id)
        ? prev.selectedContacts.filter(c => c.id !== contact.id)
        : [...prev.selectedContacts, contact]
    }));
  };

  const handleTemplateSelect = (templateName: string) => {
    setCampaignData(prev => ({ ...prev, templateName }));
  };

  const handleVariableChange = (variableId: string, field: keyof VariableData, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      variables: prev.variables.map(v => 
        v.id === variableId ? { ...v, [field]: value } : v
      )
    }));
  };

  const generatePreviewMessage = () => {
    if (!selectedTemplate) return "";

    // Get header and body components
    const headerComponent = selectedTemplate.components.find(comp => comp.type === 'HEADER');
    const bodyComponent = selectedTemplate.components.find(comp => comp.type === 'BODY');

    let previewText = "";

    // Process header if exists
    if (headerComponent?.text) {
      let headerText = headerComponent.text;
      campaignData.variables
        .filter(variable => variable.componentType === 'HEADER')
        .forEach(variable => {
          const placeholder = `{{${variable.variableIndex}}}`;
          const value = variable.useAttribute && variable.attributeName 
            ? `[${attributes?.find(attr => attr.name === variable.attributeName)?.name || 'Attribute'}]`
            : variable.value || variable.fallbackValue || `Variable ${variable.variableIndex}`;
          
          headerText = headerText.replace(placeholder, value);
        });
      previewText += `<strong>${headerText}</strong>\n\n`;
    }

    // Process body if exists
    if (bodyComponent?.text) {
      let bodyText = bodyComponent.text;
      campaignData.variables
        .filter(variable => variable.componentType === 'BODY')
        .forEach(variable => {
          const placeholder = `{{${variable.variableIndex}}}`;
          const value = variable.useAttribute && variable.attributeName 
            ? `[${attributes?.find(attr => attr.name === variable.attributeName)?.name || 'Attribute'}]`
            : variable.value || variable.fallbackValue || `Variable ${variable.variableIndex}`;
          
          bodyText = bodyText.replace(placeholder, value);
        });
      previewText += bodyText;
    }

    return previewText;
  };

  const contacts: Contact[] = categorizedContacts[activeFilter] || [];
  const filteredContacts: Contact[] = contacts.filter((contact: Contact) =>
    contact.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.phoneNumber.includes(contactSearch)
  );

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Campaign</h2>
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
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isActive 
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < STEPS.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
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
                    Select Contacts ({campaignData.selectedContacts.length} selected)
                  </Label>
                  
                  {/* Label Filters */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                                              {Object.entries(contactLabels).map(([key, label]) => {
                        const contactsInCategory = categorizedContacts[key] || [];
                        const selectedInCategory = contactsInCategory.filter(c => 
                          campaignData.selectedContacts.some(selected => selected.id === c.id)
                        );
                        
                        return (
                          <button
                            key={key}
                            onClick={() => setActiveFilter(key as 'UNDELIVERED' | 'UNREAD' | 'READ' | 'REPLIED')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              activeFilter === key
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
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
                            style={{ backgroundColor: contactLabels[activeFilter]?.color }}
                          />
                          <span className="font-medium text-gray-700">
                            {contactLabels[activeFilter]?.name} Contacts
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            {categorizedContacts[activeFilter]?.length || 0} total
                          </span>
                          <span className="text-sm text-blue-600 font-medium">
                            {categorizedContacts[activeFilter]?.filter(c => 
                              campaignData.selectedContacts.some(selected => selected.id === c.id)
                            ).length || 0} selected
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const currentContacts = categorizedContacts[activeFilter] || [];
                                const currentContactIds = currentContacts.map(c => c.id);
                                const alreadySelected = campaignData.selectedContacts.filter(contact => 
                                  !currentContactIds.includes(contact.id)
                                );
                                const newSelected = [...alreadySelected, ...currentContacts];
                                setCampaignData(prev => ({ ...prev, selectedContacts: newSelected }));
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Select All
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentContacts = categorizedContacts[activeFilter] || [];
                                const currentContactIds = currentContacts.map(c => c.id);
                                const newSelected = campaignData.selectedContacts.filter(contact => 
                                  !currentContactIds.includes(contact.id)
                                );
                                setCampaignData(prev => ({ ...prev, selectedContacts: newSelected }));
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
                          {filteredContacts.map(contact => (
                            <label key={contact.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <input
                                type="checkbox"
                                checked={campaignData.selectedContacts.some(c => c.id === contact.id)}
                                onChange={() => handleContactToggle(contact)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {contact.name || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {contact.phoneNumber}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: contactLabels[activeFilter]?.color }}
                                />
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="text-gray-500 mb-2">No contacts in this category</div>
                          <div className="text-sm text-gray-400">
                            Try selecting a different filter or add contacts first
                          </div>
                        </div>
                      )}
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
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          campaignData.templateName === template.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTemplateSelect(template.name)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
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
                      {campaignData.variables.map(variable => (
                        <div key={variable.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium text-gray-700">
                              Variable {variable.variableIndex}
                            </Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`use-attribute-${variable.variableIndex}`}
                                checked={variable.useAttribute}
                                onChange={(e) => handleVariableChange(variable.id, 'useAttribute', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <Label htmlFor={`use-attribute-${variable.variableIndex}`} className="text-xs text-gray-600">
                                Use Attribute
                              </Label>
                            </div>
                          </div>
                          
                          {variable.useAttribute ? (
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs text-gray-600 block mb-1">
                                  Select Attribute
                                </Label>
                                <select
                                  value={variable.attributeName || ""}
                                  onChange={(e) => handleVariableChange(variable.id, 'attributeName', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                >
                                  <option value="">Select an attribute</option>
                                  {attributes?.map(attr => (
                                    <option key={attr.name} value={attr.name}>
                                      {attr.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600 block mb-1">
                                  Fallback Value
                                </Label>
                                <Input
                                  value={variable.fallbackValue}
                                  onChange={(e) => handleVariableChange(variable.id, 'fallbackValue', e.target.value)}
                                  placeholder="Value if contact doesn't have this attribute"
                                  className="text-sm"
                                />
                              </div>
                            </div>
                          ) : (
                            <Input
                              value={variable.value}
                              onChange={(e) => handleVariableChange(variable.id, 'value', e.target.value)}
                              placeholder={`Enter value for variable ${variable.variableIndex}`}
                              className="text-sm"
                            />
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
                          <span className="text-sm font-medium text-gray-700">WhatsApp Preview</span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">W</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Your Business</div>
                              <div className="text-xs text-gray-500">Template Message</div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: generatePreviewMessage() }}>
                            </p>
                          </div>
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
                    onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
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
                          checked={campaignData.scheduleType === 'immediate'}
                          onChange={(e) => setCampaignData(prev => ({ 
                            ...prev, 
                            scheduleType: e.target.value as 'immediate' | 'scheduled' 
                          }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Send Immediately</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="scheduleType"
                          value="scheduled"
                          checked={campaignData.scheduleType === 'scheduled'}
                          onChange={(e) => setCampaignData(prev => ({ 
                            ...prev, 
                            scheduleType: e.target.value as 'immediate' | 'scheduled' 
                          }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Schedule for Later</span>
                      </label>
                    </div>
                    
                    {campaignData.scheduleType === 'scheduled' && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Schedule Date & Time
                        </Label>
                        <Input
                          type="datetime-local"
                          value={campaignData.scheduledAt ? new Date(campaignData.scheduledAt).toISOString().slice(0, 16) : ""}
                          onChange={(e) => setCampaignData(prev => ({ 
                            ...prev, 
                            scheduledAt: e.target.value ? new Date(e.target.value) : undefined 
                          }))}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Campaign Summary */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-3">Campaign Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Campaign Name:</span>
                      <span className="font-medium">{campaignData.name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Contacts:</span>
                      <span className="font-medium">{campaignData.selectedContacts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium">{selectedTemplate?.name || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="font-medium">
                        {campaignData.scheduleType === 'immediate' 
                          ? 'Send immediately' 
                          : campaignData.scheduledAt 
                            ? new Date(campaignData.scheduledAt).toLocaleString()
                            : 'Not set'
                        }
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
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <div className="flex items-center gap-2">
              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Create Campaign
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 