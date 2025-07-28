'use client';

import { useEffect, useState } from 'react';
import { Info, Plus, Trash2, X, Upload, Image, Video, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTemplates } from '@/context/template-provider';
import { useUser } from '@/context/user-context';

interface CreateTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onCreateTemplate: () => void;
  editingTemplate?: any;
}

type HeaderFormat = 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';

export function CreateTemplateModal({
  open,
  onClose,
  onCreateTemplate,
  editingTemplate,
}: CreateTemplateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(editingTemplate?.name || '');
  const [language, setLanguage] = useState(editingTemplate?.language || 'en_US');
  const [category, setCategory] = useState(editingTemplate?.category || 'MARKETING');
  
  // Header state
  const [headerFormat, setHeaderFormat] = useState<HeaderFormat>('TEXT');
  const [headerText, setHeaderText] = useState(
    editingTemplate?.components?.find((c: any) => c.type === 'HEADER')?.text || ''
  );
  const [headerExamples, setHeaderExamples] = useState<string[]>(
    editingTemplate?.components?.find((c: any) => c.type === 'HEADER')?.example?.header_text || []
  );
  const [headerMediaFile, setHeaderMediaFile] = useState<File | null>(null);
  const [headerMediaId, setHeaderMediaId] = useState<string>('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  
  // Body state
  const [bodyText, setBodyText] = useState(
    editingTemplate?.components?.find((c: any) => c.type === 'BODY')?.text || ''
  );
  const [bodyExamples, setBodyExamples] = useState<string[]>(
    editingTemplate?.components?.find((c: any) => c.type === 'BODY')?.example?.body_text?.[0] || []
  );
  const [showRules, setShowRules] = useState(false);

  const { userInfo } = useUser();
  const { createTemplate, selectedWhatsAppAccountId } = useTemplates();

  const fixVariableNumbering = (text: string): string => {
    let counter = 1;
    return text.replace(/{{(\d+)}}/g, () => `{{${counter++}}}`);
  };

  const uploadMediaFile = async (file: File): Promise<string> => {
    if (!userInfo?.whatsappAccount?.id) {
      throw new Error('WhatsApp account not found');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userInfo.whatsappAccount.id);

    const response = await fetch('/api/whatsapp/upload-session', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload media');
    }

    const data = await response.json();
    return data.fileHandle; // Return the file handle for WhatsApp templates
  };

  const handleHeaderMediaUpload = async () => {
    if (!headerMediaFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploadingMedia(true);
    try {
      const mediaId = await uploadMediaFile(headerMediaFile);
      setHeaderMediaId(mediaId);
      toast.success('Media uploaded successfully!');
    } catch (error) {
      console.error('Media upload error:', error);
      toast.error('Failed to upload media');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !language || !category || !bodyText) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedWhatsAppAccountId) {
      toast.error('No WhatsApp account selected');
      return;
    }

    // Validate header based on format
    if (headerFormat === 'TEXT' && !headerText.trim()) {
      toast.error('Please enter header text');
      return;
    }

    if (headerFormat !== 'TEXT' && !headerMediaId) {
      toast.error('Please upload media for header');
      return;
    }

    // Fix variable numbering in text components
    const fixedHeaderText = headerText ? fixVariableNumbering(headerText) : '';
    const fixedBodyText = fixVariableNumbering(bodyText);

    // Validate variable numbering in header and body text
    const headerVariables = (fixedHeaderText.match(/{{(\d+)}}/g) || []).map((match: string) =>
      parseInt(match.match(/\d+/)![0])
    );
    const bodyVariables = (fixedBodyText.match(/{{(\d+)}}/g) || []).map((match: string) =>
      parseInt(match.match(/\d+/)![0])
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
        `Header variables must start from 1 and be sequential. Found: ${headerVariables.join(', ')}`
      );
      return;
    }

    if (!isBodySequential && bodyVariables.length > 0) {
      toast.error(
        `Body variables must start from 1 and be sequential. Found: ${bodyVariables.join(', ')}`
      );
      return;
    }

    // Count variables in header and body text
    const headerVarCount = headerVariables.length;
    const bodyVarCount = bodyVariables.length;

    // Validate examples match variables
    if (headerFormat === 'TEXT' && headerText && headerExamples.length !== headerVarCount) {
      toast.error(
        `Please provide ${headerVarCount} example${headerVarCount !== 1 ? 's' : ''} for the header variables`
      );
      return;
    }

    if (bodyExamples.length !== bodyVarCount) {
      toast.error(
        `Please provide ${bodyVarCount} example${bodyVarCount !== 1 ? 's' : ''} for the body variables`
      );
      return;
    }

    setIsLoading(true);

    try {
      const templateData = {
        name: name.toLowerCase().replace(/ /g, '_'),
        language,
        category,
        components: [
          ...(headerFormat === 'TEXT' && fixedHeaderText
            ? [
                {
                  type: 'HEADER',
                  format: 'TEXT',
                  text: fixedHeaderText,
                  example: {
                    header_text: headerExamples,
                  },
                },
              ]
            : headerFormat !== 'TEXT' && headerMediaId
            ? [
                {
                  type: 'HEADER',
                  format: headerFormat,
                  example: {
                    header_handle: [headerMediaId], // This should be the mediaId from WhatsApp
                  },
                },
              ]
            : []),
          {
            type: 'BODY',
            text: fixedBodyText,
            example: {
              body_text: [bodyExamples.map((example) => example || '')],
            },
          },
          {
            type: 'FOOTER',
            text: 'Sent using AvenPing. Reply STOP to opt-out.',
          },
        ],
      };

      await createTemplate(selectedWhatsAppAccountId, templateData);
      onCreateTemplate();
      onClose();
    } catch (error) {
      console.error('Error creating/updating template:', error);
      toast.error(editingTemplate ? 'Failed to update template' : 'Failed to create template');
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
      setHeaderExamples([...headerExamples, '']);
    } else {
      toast.error('Maximum number of examples reached for header variables');
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
      setBodyExamples([...bodyExamples, '']);
    } else {
      toast.error('Maximum number of examples reached for body variables');
    }
  };

  const removeBodyExample = (index: number) => {
    setBodyExamples(bodyExamples.filter((_, i) => i !== index));
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
        ...Array(headerVariables - headerExamples.length).fill(''),
      ]);
    }

    // Adjust body examples
    if (bodyExamples.length > bodyVariables) {
      setBodyExamples(bodyExamples.slice(0, bodyVariables));
    } else if (bodyExamples.length < bodyVariables) {
      setBodyExamples([...bodyExamples, ...Array(bodyVariables - bodyExamples.length).fill('')]);
    }
  }, [headerText, bodyText]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && !editingTemplate) {
      setName('');
      setLanguage('en_US');
      setCategory('MARKETING');
      setHeaderFormat('TEXT');
      setHeaderText('');
      setHeaderExamples([]);
      setHeaderMediaFile(null);
      setHeaderMediaId('');
      setBodyText('');
      setBodyExamples([]);
    }
  }, [open, editingTemplate]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-[700px] w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Create Template'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Create a new WhatsApp message template. Templates must be approved by Meta before they
                can be used.
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
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
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
                    <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                      Language
                    </Label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#30CFED] focus:border-[#30CFED]"
                    >
                      <option value="en_US">English (US)</option>
                      <option value="en_GB">English (UK)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="ar">Arabic</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#30CFED] focus:border-[#30CFED]"
                  >
                    <option value="MARKETING">Marketing</option>
                    <option value="UTILITY">Utility</option>
                    <option value="AUTHENTICATION">Authentication</option>
                  </select>
                </div>

                <div className="flex justify-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRules(true)}
                    className="text-[#30CFED] border-[#30CFED] hover:bg-[#D3F8FF]"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    View Verification Rules
                  </Button>
                </div>
              </div>

              {/* Template Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Template Content</h3>

                {/* Header Section */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="header" className="text-sm font-medium text-gray-700">
                        Header (Optional)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Optional header text or media for your template</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {/* Header Format Selector */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-gray-600">Format:</Label>
                      <select
                        value={headerFormat}
                        onChange={(e) => setHeaderFormat(e.target.value as HeaderFormat)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="TEXT">Text</option>
                        <option value="IMAGE">Image</option>
                        <option value="VIDEO">Video</option>
                        <option value="DOCUMENT">Document</option>
                      </select>
                    </div>
                  </div>

                  {/* Text Header */}
                  {headerFormat === 'TEXT' && (
                    <>
                      <Input
                        id="header"
                        value={headerText}
                        onChange={(e) => setHeaderText(e.target.value)}
                        placeholder="e.g., Our {{1}} is on!"
                        className="font-mono"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-gray-600">Variable Examples</Label>
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
                              onChange={(e) => handleHeaderExampleChange(index, e.target.value)}
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
                  {headerFormat !== 'TEXT' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {headerFormat === 'IMAGE' && <Image className="h-4 w-4" />}
                        {headerFormat === 'VIDEO' && <Video className="h-4 w-4" />}
                        {headerFormat === 'DOCUMENT' && <FileText className="h-4 w-4" />}
                        <span className="text-sm text-gray-600">
                          Upload {headerFormat.toLowerCase()} for header
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept={
                            headerFormat === 'IMAGE' 
                              ? 'image/*' 
                              : headerFormat === 'VIDEO' 
                              ? 'video/*' 
                              : '.pdf,.doc,.docx,.txt'
                          }
                          onChange={(e) => setHeaderMediaFile(e.target.files?.[0] || null)}
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
                              {isUploadingMedia ? 'Uploading...' : 'Upload Media'}
                            </Button>
                            {headerMediaId && (
                              <span className="text-sm text-green-600">✓ Uploaded</span>
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
                    <Label htmlFor="body" className="text-sm font-medium text-gray-700">
                      Body (Required)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The main content of your template. Use &#123;&#123;1&#125;&#125;,
                            &#123;&#123;2&#125;&#125;, etc. for variables.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="body"
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="e.g., Shop now through {{1}} and use code {{2}} to get {{3}} off of all merchandise."
                    className="min-h-[100px] font-mono"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-600">Variable Examples</Label>
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
                          onChange={(e) => handleBodyExampleChange(index, e.target.value)}
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
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating...' : editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowRules(false)} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-[500px] w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">WhatsApp Template Verification Rules</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowRules(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Follow these rules to ensure your template gets approved by the WhatsApp team.
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Variable Format</h4>
                    <p className="text-sm text-gray-600">
                      • Variables must use the correct format:{' '}
                      <code className="font-mono bg-gray-100 px-1 rounded">
                        &#123;&#123;1&#125;&#125;
                      </code>
                    </p>
                    <p className="text-sm text-gray-600">
                      • Variables must be sequential (e.g., &#123;&#123;1&#125;&#125;,
                      &#123;&#123;2&#125;&#125;, &#123;&#123;3&#125;&#125;)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Variable Restrictions</h4>
                    <p className="text-sm text-gray-600">
                      • Variables cannot contain special characters (#, $, %)
                    </p>
                    <p className="text-sm text-gray-600">
                      • Template cannot end with a variable
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Message Length</h4>
                    <p className="text-sm text-gray-600">
                      • Message length should be proportional to the number of variables
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
              <div className="flex justify-end p-6 border-t border-gray-200">
                <Button onClick={() => setShowRules(false)}>
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
