import React, { useState } from "react";
import { Node } from "@xyflow/react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DropdownButton } from "@/components/ui/dropdown-button";
import SearchableDropdown from "../ui/searchable-dropdown";
import { useUser } from "@/context/user-context";
import axios from "axios";
import { normalizePhoneNumber } from "@/lib/utils";
import { toast } from "sonner";

interface NodeDetailsSidebarProps {
  selectedNode: Node | null;
  onClose: () => void;
  onUpdateNodeData: (key: string, value: any) => void;
  flows?: any[]; // All available flows for Connect Flow nodes
  allNodes?: Node[]; // All nodes in the flow for connection validation
  allEdges?: any[]; // All edges in the flow for connection validation
}

const MAX_REPLY_BUTTONS = 3;

// Validation functions
const validateMessageAction = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.message || nodeData.message.trim() === "") {
    errors.push("Message body is required");
  }

  if (nodeData.headerType && nodeData.headerType !== "none") {
    if (!nodeData.header || nodeData.header.trim() === "") {
      errors.push(`${nodeData.headerType} header is required`);
    }
  }

  if (nodeData.replyButtons && nodeData.replyButtons.length > 0) {
    const emptyButtons = nodeData.replyButtons.filter(
      (btn: string) => !btn || btn.trim() === ""
    );
    if (emptyButtons.length > 0) {
      errors.push("All reply buttons must have labels");
    }
  }

  return errors;
};

const validateSupportNode = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.phoneNumber || nodeData.phoneNumber.trim() === "") {
    errors.push("Phone number is required");
  }

  return errors;
};

const validateMediaNode = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.file || nodeData.file.trim() === "") {
    errors.push("Media file is required");
  }

  return errors;
};

const validateConnectFlow = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.flowId || nodeData.flowId.trim() === "") {
    errors.push("Flow selection is required");
  }

  return errors;
};

const validateStartNode = (nodeData: any): string[] => {
  const errors: string[] = [];

  if (!nodeData.startKeywords || nodeData.startKeywords.length === 0) {
    errors.push("At least one start keyword is required");
  }

  return errors;
};

const validateNodeConnections = (nodes: Node[], edges: any[]): string[] => {
  const orphanedNodes: string[] = [];

  // Create a set of all target nodes (nodes that have incoming connections)
  const connectedNodes = new Set<string>();
  edges.forEach((edge) => {
    connectedNodes.add(String(edge.target));
  });

  // Check each node (except Start node) to see if it has incoming connections
  nodes.forEach((node) => {
    if (node.data.nodeType !== "Start" && !connectedNodes.has(node.id)) {
      orphanedNodes.push(String(node.data.label || node.data.nodeType));
    }
  });

  return orphanedNodes;
};

// WhatsApp file upload utility
async function uploadFileToWhatsApp(
  file: File,
  phoneNumberId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    toast.loading("Uploading file...", { id: "upload-progress" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("phoneNumberId", phoneNumberId);

    const response = await axios.post("/api/whatsapp/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    toast.success("File uploaded successfully!", { id: "upload-progress" });
    return response.data.mediaId;
  } catch (error) {
    console.error("Error uploading file to WhatsApp:", error);
    toast.error("Failed to upload file. Please try again.", {
      id: "upload-progress",
    });
    throw new Error("Failed to upload file to WhatsApp");
  }
}

function isFile(val: any): val is File {
  return (
    val &&
    typeof val === "object" &&
    typeof val.name === "string" &&
    typeof val.size === "number"
  );
}

const KeywordChips: React.FC<{
  keywords: string[];
  onAdd: (kw: string) => void;
  onRemove: (kw: string) => void;
}> = ({ keywords, onAdd, onRemove }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim() !== "") {
      e.preventDefault();
      if (!keywords.includes(input.trim())) {
        onAdd(input.trim());
      }
      setInput("");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {keywords.map((kw) => (
        <span
          key={kw}
          className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium"
        >
          {kw}
          <button
            type="button"
            className="ml-1 text-blue-400 hover:text-red-500"
            onClick={() => onRemove(kw)}
            aria-label={`Remove ${kw}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={keywords.length === 0 ? "Type and press Enter..." : ""}
      />
    </div>
  );
};

const renderNodeDetails = (
  selectedNode: Node,
  onUpdateNodeData: (key: string, value: any) => void,
  flows: any[],
  userInfo: any
) => {
  const nodeType = selectedNode.data.nodeType;

  // Message Action Node
  if (nodeType === "MessageAction") {
    const replyButtons: string[] = Array.isArray(selectedNode.data.replyButtons)
      ? selectedNode.data.replyButtons
      : [];
    return (
      <>
        <div>
          <Label htmlFor="headerType">Header Type:</Label>
          <DropdownButton
            options={[
              { label: "No Header", value: "none" },
              { label: "Text Header", value: "text" },
              { label: "Image Header", value: "image" },
              { label: "Video Header", value: "video" },
              { label: "Document Header", value: "document" },
            ]}
            selected={
              typeof selectedNode.data.headerType === "string"
                ? selectedNode.data.headerType
                : selectedNode.data.header && selectedNode.data.header !== ""
                ? "image" // Default to image if header exists but no type specified
                : "none"
            }
            onChange={(value) => onUpdateNodeData("headerType", value)}
            size="sm"
            variant="outline"
            className="ml-2"
            disabled={replyButtons.length === 0}
          />
        </div>
        {/* Text Header */}
        {selectedNode.data.headerType === "text" && (
          <div>
            <Label htmlFor="headerText">Header Text</Label>
            <Input
              id="headerText"
              value={
                typeof selectedNode.data.header === "string"
                  ? selectedNode.data.header
                  : ""
              }
              onChange={(e) => onUpdateNodeData("header", e.target.value)}
              className="mt-1"
              placeholder="Header text (maximum 60 characters)"
              maxLength={60}
            />
            <div className="text-xs text-gray-500 mt-1">
              Header text that appears above the message body. Maximum 60
              characters.
              {typeof selectedNode.data.header === "string" && (
                <span
                  className={`ml-2 ${
                    selectedNode.data.header.length > 60
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  ({selectedNode.data.header.length}/60)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Media Header */}
        {(selectedNode.data.headerType === "image" ||
          selectedNode.data.headerType === "video" ||
          selectedNode.data.headerType === "document") && (
          <div>
            <Label htmlFor="headerMedia">
              Upload{" "}
              {selectedNode.data.headerType === "image"
                ? "Image"
                : selectedNode.data.headerType === "video"
                ? "Video"
                : "Document"}
            </Label>
            <Input
              id="headerMedia"
              type="file"
              accept={
                selectedNode.data.headerType === "image"
                  ? "image/*"
                  : selectedNode.data.headerType === "video"
                  ? "video/*"
                  : selectedNode.data.headerType === "document"
                  ? "application/pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                  : "*"
              }
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const phoneNumberId =
                      userInfo?.whatsappAccount?.activePhoneNumber
                        ?.phoneNumberId;

                    if (!phoneNumberId) {
                      toast.error(
                        "No WhatsApp phone number configured. Please set up your WhatsApp account first."
                      );
                      return;
                    }

                    const mediaId = await uploadFileToWhatsApp(
                      file,
                      phoneNumberId
                    );
                    onUpdateNodeData("header", mediaId);
                  } catch (error) {
                    console.error("Upload failed:", error);
                    // Error toast is already handled in uploadFileToWhatsApp
                  }
                }
              }}
              className="mt-1"
            />
            {typeof selectedNode.data.header === "string" &&
              selectedNode.data.header &&
              (selectedNode.data.headerType === "image" ||
                selectedNode.data.headerType === "video" ||
                selectedNode.data.headerType === "document") && (
                <div className="text-xs text-green-600 mt-1">
                  {selectedNode.data.headerType} uploaded successfully! Media
                  ID: {selectedNode.data.header}
                </div>
              )}
          </div>
        )}
        <div>
          <Label htmlFor="message">Message Body</Label>
          <Textarea
            id="message"
            value={
              typeof selectedNode.data.message === "string"
                ? selectedNode.data.message
                : ""
            }
            onChange={(e) => onUpdateNodeData("message", e.target.value)}
            className="mt-1"
            rows={3}
            placeholder="Enter the main message text that will appear in the body of the interactive message..."
          />
          <div className="text-xs text-gray-500 mt-1">
            This text will appear in the message body. Maximum 1024 characters.
            {typeof selectedNode.data.message === "string" && (
              <span
                className={`ml-2 ${
                  selectedNode.data.message.length > 1024
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                ({selectedNode.data.message.length}/1024)
              </span>
            )}
          </div>
        </div>

        <div>
          <Label>Reply Buttons (max 3)</Label>
          <br />
          {replyButtons.length > 0 &&
            replyButtons.map((label, idx) => (
              <div key={idx} className="flex items-center gap-2 mt-2">
                <Input
                  value={typeof label === "string" ? label : ""}
                  onChange={(e) => {
                    const newButtons = [...replyButtons];
                    newButtons[idx] = e.target.value;
                    onUpdateNodeData("replyButtons", newButtons);
                  }}
                  placeholder={`Button ${idx + 1} label (max 20 chars)`}
                  className="flex-1"
                  maxLength={20}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newButtons = replyButtons.filter((_, i) => i !== idx);
                    onUpdateNodeData("replyButtons", newButtons);
                  }}
                  type="button"
                >
                  Remove
                </Button>
              </div>
            ))}
          {replyButtons.length < MAX_REPLY_BUTTONS && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                onUpdateNodeData("replyButtons", [...replyButtons, ""])
              }
              type="button"
            >
              Add Button
            </Button>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Number of outgoing connections: {replyButtons.length || 1}
        </div>
      </>
    );
  }

  // Connect Flow node
  if (nodeType === "ConnectFlowAction") {
    // Filter out the current flow being edited (if we have access to editingFlow)
    const availableFlows = flows.filter(
      (flow) => flow.id !== selectedNode.data.currentFlowId
    );

    // Find the currently selected flow
    const selectedFlow = flows.find(
      (flow) => flow.id === selectedNode.data.flowId
    );

    return (
      <div>
        <Label htmlFor="flow">Connect to Flow</Label>
        <SearchableDropdown
          placeholder="Select a flow..."
          variant="outline"
          items={availableFlows.map((flow) => ({
            id: flow.id,
            label: flow.name,
            value: flow.id,
          }))}
          onSelect={(flow) => onUpdateNodeData("flowId", flow.id)}
          selectedLabel={selectedFlow?.name || null}
        />
        {selectedFlow && (
          <div className="text-xs text-gray-500 mt-1">
            Will connect to: {selectedFlow.name}
          </div>
        )}
      </div>
    );
  }

  // Support nodes
  if (nodeType === "CallSupport" || nodeType === "WhatsAppSupport") {
    return (
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={normalizePhoneNumber(
            typeof selectedNode.data.phoneNumber === "string"
              ? selectedNode.data.phoneNumber
              : ""
          )}
          onChange={(e) => onUpdateNodeData("phoneNumber", e.target.value)}
          placeholder="Enter phone number"
          className="mt-1"
        />
        <div className="text-xs text-gray-500 mt-1">
          {nodeType === "CallSupport"
            ? "This agent will be specified to call"
            : "This agent will be specified to message"}
        </div>
      </div>
    );
  }

  // Start node
  if (nodeType === "Start") {
    // Store keywords as array in data
    const keywords: string[] = Array.isArray(selectedNode.data.startKeywords)
      ? selectedNode.data.startKeywords
      : typeof selectedNode.data.startKeywords === "string" &&
        selectedNode.data.startKeywords.trim() !== ""
      ? selectedNode.data.startKeywords
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean)
      : [];
    return (
      <div>
        <Label>Start Keywords</Label>
        <KeywordChips
          keywords={keywords}
          onAdd={(kw) => onUpdateNodeData("startKeywords", [...keywords, kw])}
          onRemove={(kw) =>
            onUpdateNodeData(
              "startKeywords",
              keywords.filter((k) => k !== kw)
            )
          }
        />
        <div className="text-xs text-gray-400 mt-1">
          Press Enter or comma to add.
        </div>
      </div>
    );
  }

  // Image node & all message blocks
  if (
    nodeType === "ImageMessage" ||
    nodeType === "VideoMessage" ||
    nodeType === "DocumentMessage" ||
    nodeType === "AudioMessage"
  ) {
    console.log("selectedNode.data", selectedNode.data);
    return (
      <>
        <div>
          <Label htmlFor="fileUpload">
            Upload {nodeType.replace("Message", "")}
          </Label>
          <Input
            id="fileUpload"
            type="file"
            accept={
              nodeType === "ImageMessage"
                ? "image/*"
                : nodeType === "VideoMessage"
                ? "video/*"
                : nodeType === "AudioMessage"
                ? "audio/*"
                : nodeType === "DocumentMessage"
                ? "application/pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                : "*"
            }
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const phoneNumberId =
                    userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId;

                  if (!phoneNumberId) {
                    toast.error(
                      "No WhatsApp phone number configured. Please set up your WhatsApp account first."
                    );
                    return;
                  }

                  const mediaId = await uploadFileToWhatsApp(
                    file,
                    phoneNumberId
                  );
                  onUpdateNodeData("file", mediaId);
                } catch (error) {
                  console.error("Upload failed:", error);
                  // Error toast is already handled in uploadFileToWhatsApp
                }
              }
            }}
            className="mt-1"
          />
          {typeof selectedNode.data.file === "string" &&
            selectedNode.data.file && (
              <div className="text-xs text-green-600 mt-1">
                File uploaded successfully! Media ID: {selectedNode.data.file}
              </div>
            )}
        </div>
        <div>
          <Label htmlFor="caption">Message (optional)</Label>
          <Input
            id="caption"
            value={
              typeof selectedNode.data.caption === "string"
                ? selectedNode.data.caption
                : ""
            }
            onChange={(e) => onUpdateNodeData("caption", e.target.value)}
            className="mt-1"
          />
        </div>
      </>
    );
  }

  // Default fallback
  return <div>No details available for this node type.</div>;
};

const NodeDetailsSidebar: React.FC<NodeDetailsSidebarProps> = ({
  selectedNode,
  onClose,
  onUpdateNodeData,
  flows = [],
  allNodes = [],
  allEdges = [],
}) => {
  const { userInfo } = useUser();
  if (!selectedNode) return null;

  // Get validation errors for the current node
  const getValidationErrors = (): string[] => {
    const nodeType = selectedNode.data.nodeType;
    let errors: string[] = [];

    switch (nodeType) {
      case "MessageAction":
        errors = validateMessageAction(selectedNode.data);
        break;
      case "CallSupport":
      case "WhatsAppSupport":
        errors = validateSupportNode(selectedNode.data);
        break;
      case "ImageMessage":
      case "VideoMessage":
      case "AudioMessage":
      case "DocumentMessage":
        errors = validateMediaNode(selectedNode.data);
        break;
      case "ConnectFlowAction":
        errors = validateConnectFlow(selectedNode.data);
        break;
      case "Start":
        errors = validateStartNode(selectedNode.data);
        break;
    }

    // Check if this node is orphaned (not connected to flow, except Start node)
    if (nodeType !== "Start" && allNodes.length > 0 && allEdges.length > 0) {
      const orphanedNodes = validateNodeConnections(allNodes, allEdges);
      const nodeLabel = selectedNode.data.label || nodeType;
      if (orphanedNodes.includes(String(nodeLabel))) {
        errors.push("This node is not connected to the flow");
      }
    }

    return errors;
  };

  const validationErrors = getValidationErrors();

  return (
    <div className="absolute z-30 top-16 right-4 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-h-[calc(100%-5rem)] min-w-[280px] w-[320px]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-500 pl-1">
          Node Details
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-4 overflow-auto px-2">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm font-medium text-red-800 mb-2">
              Required Fields Missing:
            </div>
            <ul className="text-xs text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-1">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Render node-specific details */}
        {renderNodeDetails(selectedNode, onUpdateNodeData, flows, userInfo)}

        {/* Node Type and Node ID are always shown */}
        <div>
          <Label>Node Type</Label>
          <div className="text-sm text-gray-700 mt-1 px-3 py-2 bg-gray-50 rounded border border-gray-200">
            {typeof selectedNode.data.nodeType === "string"
              ? selectedNode.data.nodeType
              : "Custom"}
          </div>
        </div>
        <div>
          <Label>Node ID</Label>
          <div className="text-xs text-gray-500 mt-1 px-3 py-2 bg-gray-50 rounded border border-gray-200 overflow-x-auto">
            {selectedNode.id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsSidebar;
