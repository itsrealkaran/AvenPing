import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FlowHeaderProps {
  onBack: () => void;
  onSave: () => void;
  hasValidationErrors?: boolean;
  validationErrorCount?: number;
  validationErrors?: string[];
}

const FlowHeader = ({
  onBack,
  onSave,
  hasValidationErrors = false,
  validationErrorCount = 0,
  validationErrors = [],
}: FlowHeaderProps) => {
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowValidationDetails(false);
      }
    };

    if (showValidationDetails) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showValidationDetails]);

  const handleSaveClick = () => {
    if (hasValidationErrors) {
      // Show detailed validation errors in a toast
      toast.error("Cannot save flow with validation errors");
      setShowValidationDetails(true);
    } else {
      onSave();
    }
  };
  return (
    <div className="absolute rounded-t-lg top-0 left-0 right-0 z-20 flex items-center justify-between p-3 bg-white border-b border-gray-200">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 px-2 py-1 rounded transition"
      >
        <ArrowLeft size={16} /> Back
      </button>
      <div className="relative">
        <Button
          onClick={handleSaveClick}
          size="sm"
          variant={hasValidationErrors ? "secondary" : "default"}
        >
          {hasValidationErrors ? (
            <AlertTriangle size={16} />
          ) : (
            <Save size={16} />
          )}
          {hasValidationErrors
            ? `Save (${validationErrorCount} issues)`
            : "Save"}
        </Button>

        {/* Validation Details Tooltip */}
        {showValidationDetails && hasValidationErrors && (
          <div
            ref={tooltipRef}
            className="absolute top-full right-0 mt-2 w-80 bg-white border border-red-200 rounded-lg shadow-lg p-3 z-50"
          >
            <div className="text-sm font-medium text-red-800 mb-2">
              Validation Issues ({validationErrorCount}):
            </div>
            <ul className="text-xs text-red-700 space-y-1 max-h-40 overflow-y-auto">
              {validationErrors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2 mt-0.5">•</span>
                  <span className="flex-1">{error}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-2 border-t border-red-100">
              <button
                onClick={() => setShowValidationDetails(false)}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowHeader;
