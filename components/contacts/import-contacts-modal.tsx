"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Users,
  MapPin,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useContacts } from "@/context/contact-provider";
import { useUser } from "@/context/user-context";
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import Table from "@/components/ui/table";
import * as XLSX from "xlsx";

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
    { value: "status", label: "Status" },
    ...(attributes || []).map((attr) => ({
      value: `attribute_${attr.id}`,
      label: `Attribute: ${attr.name}`,
    })),
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split("\n").filter((line) => line.trim());
          if (lines.length < 2) {
            setError(
              "CSV file must have at least a header row and one data row"
            );
            return;
          }
          // Parse headers
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));
          setCsvHeaders(headers);
          // Parse data rows
          const data: CSVRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i]
              .split(",")
              .map((v) => v.trim().replace(/"/g, ""));
            const row: CSVRow = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || "";
            });
            data.push(row);
          }
          setCsvData(data);
          // Auto-map common fields
          const autoMappings: FieldMapping[] = [];
          headers.forEach((header) => {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader.includes("name") || lowerHeader === "name") {
              autoMappings.push({ csvColumn: header, databaseField: "name" });
            } else if (
              lowerHeader.includes("phone") ||
              lowerHeader.includes("number") ||
              lowerHeader.includes("mobile")
            ) {
              autoMappings.push({
                csvColumn: header,
                databaseField: "phoneNumber",
              });
            } else if (lowerHeader.includes("status")) {
              autoMappings.push({ csvColumn: header, databaseField: "status" });
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
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          if (json.length < 2) {
            setError(
              "XLSX file must have at least a header row and one data row"
            );
            return;
          }
          const headers = json[0].map((h: any) => String(h).trim());
          setCsvHeaders(headers);
          const dataRows: CSVRow[] = json.slice(1).map((rowArr) => {
            const row: CSVRow = {};
            headers.forEach((header: string, idx: number) => {
              row[header] =
                rowArr[idx] !== undefined ? String(rowArr[idx]) : "";
            });
            return row;
          });
          setCsvData(dataRows);
          // Auto-map common fields
          const autoMappings: FieldMapping[] = [];
          headers.forEach((header) => {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader.includes("name") || lowerHeader === "name") {
              autoMappings.push({ csvColumn: header, databaseField: "name" });
            } else if (
              lowerHeader.includes("phone") ||
              lowerHeader.includes("number") ||
              lowerHeader.includes("mobile")
            ) {
              autoMappings.push({
                csvColumn: header,
                databaseField: "phoneNumber",
              });
            } else if (lowerHeader.includes("status")) {
              autoMappings.push({ csvColumn: header, databaseField: "status" });
            }
          });
          setFieldMappings(autoMappings);
          setError("");
          setSuccess(
            `Successfully loaded ${dataRows.length} contacts from XLSX`
          );
        } catch (err) {
          setError("Error parsing XLSX file. Please check the format.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Please upload a CSV or XLSX file");
    }
  };

  const handleFieldMappingChange = (
    csvColumn: string,
    databaseField: string
  ) => {
    setFieldMappings((prev) => {
      const existing = prev.find((m) => m.databaseField === databaseField);
      if (existing) {
        if (csvColumn === "") {
          // Remove mapping if "Skip this field" is selected
          return prev.filter((m) => m.databaseField !== databaseField);
        } else {
          // Update existing mapping
          return prev.map((m) =>
            m.databaseField === databaseField ? { ...m, csvColumn } : m
          );
        }
      } else if (csvColumn !== "") {
        // Add new mapping only if a CSV column is selected
        return [...prev, { csvColumn, databaseField }];
      }
      return prev;
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
    const hasName = fieldMappings.some((m) => m.databaseField === "name");
    const hasPhone = fieldMappings.some(
      (m) => m.databaseField === "phoneNumber"
    );

    if (!hasName || !hasPhone) {
      setError("Name and Phone Number are required fields");
      return;
    }

    setUploadProgress(0);
    setError("");
    setSuccess("");

    try {
      const contactsToImport = csvData.map((row) => {
        const contact: any = {
          phoneNumberId: userInfo?.whatsappAccount?.phoneNumbers[0].id,
          attributes: [],
        };

        fieldMappings.forEach((mapping) => {
          const value = row[mapping.csvColumn] || "";

          if (mapping.databaseField === "name") {
            contact.name = value;
          } else if (mapping.databaseField === "phoneNumber") {
            contact.phoneNumber = value;
          } else if (mapping.databaseField === "status") {
            contact.status = value;
          } else if (mapping.databaseField.startsWith("attribute_")) {
            const attributeId = mapping.databaseField.replace("attribute_", "");
            const attribute = attributes?.find(
              (attr) => attr.id === attributeId
            );
            if (attribute) {
              // Only add attribute if it has a value or if it's required
              if (value.trim() !== "") {
                contact.attributes.push({
                  name: attribute.name,
                  value: value.trim(),
                });
              }
            }
          }
        });

        // Debug: Log each contact being processed
        console.log("Processing contact:", contact);
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
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ["Name", "Phone Number", "Status"],
      ["John Doe", "+1234567890", "Active"],
      ["Jane Smith", "+1987654321", "Active"],
      ["Bob Johnson", "+1122334455", "Inactive"],
    ];

    const csvContent = templateData
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "contacts_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare table data for preview
  const getPreviewData = () => {
    if (csvData.length === 0) return [];

    const nameMapping = fieldMappings.find((m) => m.databaseField === "name");
    const phoneMapping = fieldMappings.find(
      (m) => m.databaseField === "phoneNumber"
    );
    const statusMapping = fieldMappings.find(
      (m) => m.databaseField === "status"
    );

    // Get all attribute mappings
    const attributeMappings = fieldMappings.filter((m) =>
      m.databaseField.startsWith("attribute_")
    );

    return csvData.slice(0, 3).map((row, index) => {
      const baseData = {
        id: index.toString(),
        name: nameMapping ? row[nameMapping.csvColumn] || "N/A" : "N/A",
        phoneNumber: phoneMapping
          ? row[phoneMapping.csvColumn] || "N/A"
          : "N/A",
        status: statusMapping ? row[statusMapping.csvColumn] || "N/A" : "N/A",
      };

      // Add attribute data
      const attributeData: Record<string, string> = {};
      attributeMappings.forEach((mapping) => {
        const attributeId = mapping.databaseField.replace("attribute_", "");
        const attribute = attributes?.find((attr) => attr.id === attributeId);
        if (attribute) {
          // Use the actual CSV column value for the attribute
          const csvValue = row[mapping.csvColumn];
          attributeData[attribute.name] =
            csvValue !== undefined ? csvValue : "N/A";
        }
      });

      return { ...baseData, ...attributeData };
    });
  };

  // Table columns for preview
  const getPreviewColumns = () => {
    const baseColumns = [
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        size: 200,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
    ];

    // Add attribute columns
    const attributeColumns = fieldMappings
      .filter((m) => m.databaseField.startsWith("attribute_"))
      .map((mapping) => {
        const attributeId = mapping.databaseField.replace("attribute_", "");
        const attribute = attributes?.find((attr) => attr.id === attributeId);
        return {
          accessorKey: attribute?.name || "",
          header: `Attribute: ${attribute?.name || ""}`,
          size: 150,
        };
      });

    return [...baseColumns, ...attributeColumns];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-100" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 z-120">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Import Contacts
                </h2>
                <p className="text-sm text-gray-600">
                  Upload CSV or XLSX files to bulk import contacts
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* File Upload Section */}
              {csvData.length === 0 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-[#D3F8FF] rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-[#30CFED]" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Download Sample Template
                    </h3>
                    <Button
                      size="sm"
                      className="text-sm text-gray-600"
                      onClick={handleDownloadTemplate}
                    >
                      XLSX Template
                    </Button>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#30CFED] transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="space-y-3">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[#30CFED] hover:text-[#30CFED]/80 font-medium"
                        >
                          Click to upload
                        </button>{" "}
                        or drag and drop
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV and XLSX files only
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success/Error Messages */}
              {success && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    {success}
                  </span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-800 font-medium">
                    {error}
                  </span>
                </div>
              )}

              {/* Field Mapping Section */}
              {csvHeaders.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Map Database Fields to CSV Columns
                  </Label>
                  <div className="space-y-3">
                    {databaseFields.map((field) => (
                      <div
                        key={field.value}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600 mb-1 block">
                            Database Field
                          </Label>
                          <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                            {field.label}
                          </div>
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600 mb-1 block">
                            CSV Column
                          </Label>
                          <SearchableDropdown
                            items={[
                              { id: "", label: "Skip this field", value: "" },
                              ...csvHeaders.map((header) => ({
                                id: header,
                                label: header,
                                value: header,
                              })),
                            ]}
                            placeholder="Select CSV column"
                            onSelect={(item) =>
                              handleFieldMappingChange(item.value, field.value)
                            }
                            selectedLabel={
                              fieldMappings.find(
                                (m) => m.databaseField === field.value
                              )?.csvColumn || null
                            }
                            variant="outline"
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Section */}
              {csvData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[#30CFED]" />
                    <Label className="text-sm font-medium text-gray-700">
                      Preview (First 3 rows)
                    </Label>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table
                      data={getPreviewData()}
                      columns={getPreviewColumns()}
                      enableRowSelection={false}
                      enableColumnResizing={false}
                      enableColumnOrdering={false}
                      enableGlobalFilter={false}
                      enableColumnFilters={false}
                      enablePagination={false}
                      enableSorting={false}
                      enableRowActions={false}
                      tableHeight="200px"
                      primaryColor="#30CFED"
                    />
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {isImporting && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Importing Contacts...
                  </Label>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#30CFED] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {Math.round(uploadProgress)}% complete
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isImporting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleImport}
              disabled={csvData.length === 0 || isImporting}
              className="flex-1"
            >
              {isImporting
                ? "Importing..."
                : `Import ${csvData.length} Contacts`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportContactsModal;
