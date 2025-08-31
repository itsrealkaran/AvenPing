"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useSupportTemplates } from "@/hooks/use-support-templates";

interface SupportTemplatesStatusProps {
  showCreateButton?: boolean;
  compact?: boolean;
}

export function SupportTemplatesStatus({
  showCreateButton = true,
  compact = false,
}: SupportTemplatesStatusProps) {
  const {
    createSupportTemplates,
    checkSupportTemplates,
    isCreating,
    isChecking,
  } = useSupportTemplates();
  const [templatesExist, setTemplatesExist] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Check if templates exist on mount
  useEffect(() => {
    const checkTemplates = async () => {
      const exist = await checkSupportTemplates();
      setTemplatesExist(exist);
      setHasChecked(true);
    };

    checkTemplates();
  }, [checkSupportTemplates]);

  const handleCreateTemplates = async () => {
    const success = await createSupportTemplates();
    if (success) {
      setTemplatesExist(true);
    }
  };

  const handleCheckAgain = async () => {
    const exist = await checkSupportTemplates();
    setTemplatesExist(exist);
  };

  if (isChecking && !hasChecked) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking support templates...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {templatesExist === true ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">
              Support templates ready
            </span>
          </>
        ) : templatesExist === false ? (
          <>
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-600">
              Support templates needed
            </span>
            {showCreateButton && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateTemplates}
                disabled={isCreating}
                className="ml-2"
              >
                {isCreating ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            )}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-3 border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {templatesExist === true ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : templatesExist === false ? (
            <AlertCircle className="w-5 h-5 text-orange-500" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-200" />
          )}

          <div>
            <h4 className="font-medium text-gray-900">Support Templates</h4>
            <p className="text-sm text-gray-600">
              {templatesExist === true
                ? "Ready for Call Support and WhatsApp Support nodes"
                : templatesExist === false
                ? "Required for support nodes in flows"
                : "Checking status..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCheckAgain}
            disabled={isChecking}
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>

          {templatesExist === false && showCreateButton && (
            <Button
              size="sm"
              onClick={handleCreateTemplates}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Templates"
              )}
            </Button>
          )}
        </div>
      </div>

      {templatesExist === false && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h5 className="text-sm font-medium text-orange-800 mb-1">
              Templates needed:
            </h5>
            <ul className="text-xs text-orange-700 space-y-1">
              <li>
                • <strong>call_support_alert</strong> - For Call Support nodes
              </li>
              <li>
                • <strong>whatsapp_support_alert</strong> - For WhatsApp Support
                nodes
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
