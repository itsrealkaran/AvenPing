import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseSupportTemplatesReturn {
  createSupportTemplates: () => Promise<boolean>;
  checkSupportTemplates: () => Promise<boolean>;
  isCreating: boolean;
  isChecking: boolean;
}

export function useSupportTemplates(): UseSupportTemplatesReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const createSupportTemplates = useCallback(async (): Promise<boolean> => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/whatsapp/create-support-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'Support templates created successfully');
        return true;
      } else {
        toast.error(result.error || 'Failed to create support templates');
        return false;
      }
    } catch (error) {
      console.error('Error creating support templates:', error);
      toast.error('Failed to create support templates');
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const checkSupportTemplates = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/whatsapp/create-support-templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        return result.templatesExist;
      } else {
        console.error('Error checking support templates:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error checking support templates:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    createSupportTemplates,
    checkSupportTemplates,
    isCreating,
    isChecking,
  };
}
