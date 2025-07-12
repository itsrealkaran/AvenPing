"use client";

import React, { useState, useRef } from "react";
import { X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useContacts } from "@/context/contact-provider";
import { useUser } from "@/context/user-context";

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CSVRow {
  [key: string]: string;
}

interface FieldMapping {
  csvColumn: string;
  databaseField: string;
}

const ImportContactsModal = ({ isOpen, onClose }: ImportContactsModalProps) => {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { attributes, bulkImportContacts, isImporting } = useContacts();
  const { userInfo } = useUser();

  // Database fields that can be mapped
  const databaseFields = [
    { value: "name", label: "Name" },
    { value: "phoneNumber", label: "Phone Number" },
    { value: "group", label: "Group" },
    { value: "status", label: "Status" },
    ...(attributes || []).map(attr => ({
      value: `attribute_${attr.id}`,
      label: `Attribute: ${attr.name}`
    }))
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setError("CSV file must have at least a header row and one data row");
          return;
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        setCsvHeaders(headers);

        // Parse data rows
        const data: CSVRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row: CSVRow = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }

        setCsvData(data);
        
        // Auto-map common fields
        const autoMappings: FieldMapping[] = [];
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('name') || lowerHeader === 'name') {
            autoMappings.push({ csvColumn: header, databaseField: 'name' });
          } else if (lowerHeader.includes('phone') || lowerHeader.includes('number') || lowerHeader.includes('mobile')) {
            autoMappings.push({ csvColumn: header, databaseField: 'phoneNumber' });
          } else if (lowerHeader.includes('group')) {
            autoMappings.push({ csvColumn: header, databaseField: 'group' });
          } else if (lowerHeader.includes('status')) {
            autoMappings.push({ csvColumn: header, databaseField: 'status' });
          }
        });
        
        setFieldMappings(autoMappings);
        setError("");
        setSuccess(`Successfully loaded ${data.length} contacts from CSV`);
      } catch (err) {
        setError("Error parsing CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleFieldMappingChange = (csvColumn: string, databaseField: string) => {
    setFieldMappings(prev => {
      const existing = prev.find(m => m.csvColumn === csvColumn);
      if (existing) {
        return prev.map(m => m.csvColumn === csvColumn ? { ...m, databaseField } : m);
      } else {
        return [...prev, { csvColumn, databaseField }];
      }
    });
  };

  const handleImport = async () => {
    if (!userInfo?.whatsappAccount?.phoneNumbers?.[0]?.id) {
      setError("No phone number available for import");
      return;
    }

    if (csvData.length === 0) {
      setError("No data to import");
      return;
    }

    // Validate required mappings
    const hasName = fieldMappings.some(m => m.databaseField === 'name');
    const hasPhone = fieldMappings.some(m => m.databaseField === 'phoneNumber');
    
    if (!hasName || !hasPhone) {
      setError("Name and Phone Number are required fields");
      return;
    }

    setUploadProgress(0);
    setError("");
    setSuccess("");

    try {
      const contactsToImport = csvData.map(row => {
        const contact: any = {
          phoneNumberId: userInfo?.whatsappAccount?.phoneNumbers[0].id,
          attributes: []
        };

        fieldMappings.forEach(mapping => {
          const value = row[mapping.csvColumn];
          if (value) {
            if (mapping.databaseField === 'name') {
              contact.name = value;
            } else if (mapping.databaseField === 'phoneNumber') {
              contact.phoneNumber = value;
            } else if (mapping.databaseField === 'group') {
              contact.group = value;
            } else if (mapping.databaseField === 'status') {
              contact.status = value;
            } else if (mapping.databaseField.startsWith('attribute_')) {
              const attributeId = mapping.databaseField.replace('attribute_', '');
              const attribute = attributes?.find(attr => attr.id === attributeId);
              if (attribute) {
                contact.attributes.push({
                  name: attribute.name,
                  value: value
                });
              }
            }
          }
        });

        return contact;
      });

      // Use the bulk import function from context
      const result = await bulkImportContacts(contactsToImport);
      
      let message = `Successfully imported ${result.success} contacts`;
      if (result.failed > 0) {
        message += `, ${result.failed} failed`;
        if (result.errors && result.errors.length > 0) {
          message += ` (${result.errors.length} errors)`;
        }
      }
      
      setSuccess(message);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("Error importing contacts. Please try again.");
    }
  };

  const handleClose = () => {
    setCsvData([]);
    setCsvHeaders([]);
    setFieldMappings([]);
    setError("");
    setSuccess("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ['Name', 'Phone Number', 'Group', 'Status'],
      ['John Doe', '+1234567890', 'VIP', 'Active'],
      ['Jane Smith', '+1987654321', 'Regular', 'Active'],
      ['Bob Johnson', '+1122334455', 'VIP', 'Inactive']
    ];
    
    const csvContent = templateData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'contacts_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-90">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Import Contacts</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* File Upload Section */}
          {csvData.length === 0 && <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload CSV File
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-cyan-600 hover:text-cyan-500 font-medium"
                  >
                    Click to upload
                  </button>
                  {" "}or drag and drop
                </div>
                <p className="text-xs text-gray-500">CSV files only</p>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-xs text-cyan-600 hover:text-cyan-500 underline"
                >
                  Download template
                </button>
              </div>
            </div>
          </div>}

          {/* Success/Error Messages */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800">{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {/* Field Mapping Section */}
          {csvHeaders.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Map CSV Columns to Database Fields
              </Label>
              <div className="space-y-3">
                {csvHeaders.map((header, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600">CSV Column</Label>
                      <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {header}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600">Database Field</Label>
                      <select
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        value={fieldMappings.find(m => m.csvColumn === header)?.databaseField || ""}
                        onChange={(e) => handleFieldMappingChange(header, e.target.value)}
                        disabled={isImporting}
                      >
                        <option value="">Skip this column</option>
                        {databaseFields.map(field => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Section */}
          {csvData.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Preview (First 5 rows)
              </Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-600">
                    <div>Name</div>
                    <div>Phone Number</div>
                    <div>Group</div>
                    <div>Status</div>
                  </div>
                </div>
                <div className="divide-y">
                  {csvData.slice(0, 5).map((row, index) => {
                    const nameMapping = fieldMappings.find(m => m.databaseField === 'name');
                    const phoneMapping = fieldMappings.find(m => m.databaseField === 'phoneNumber');
                    const groupMapping = fieldMappings.find(m => m.databaseField === 'group');
                    const statusMapping = fieldMappings.find(m => m.databaseField === 'status');
                    
                    return (
                      <div key={index} className="px-4 py-2">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-gray-900">
                            {nameMapping ? row[nameMapping.csvColumn] || 'N/A' : 'N/A'}
                          </div>
                          <div className="text-gray-900">
                            {phoneMapping ? row[phoneMapping.csvColumn] || 'N/A' : 'N/A'}
                          </div>
                          <div className="text-gray-900">
                            {groupMapping ? row[groupMapping.csvColumn] || 'N/A' : 'N/A'}
                          </div>
                          <div className="text-gray-900">
                            {statusMapping ? row[statusMapping.csvColumn] || 'N/A' : 'N/A'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isImporting && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Importing Contacts...
              </Label>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {Math.round(uploadProgress)}% complete
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleImport}
              disabled={csvData.length === 0 || isImporting}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isImporting ? "Importing..." : `Import ${csvData.length} Contacts`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportContactsModal; 