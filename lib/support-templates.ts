import { prisma } from './prisma';

// Support template definitions
export const SUPPORT_TEMPLATES = {
  call_support_alert: {
    name: 'call_support_alert',
    language: 'en',
    category: 'UTILITY',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Support Alert - Call Required'
      },
      {
        type: 'BODY',
        text: 'Hello! A customer needs support and requires a call.\n\nCustomer Name: {{1}}\nCustomer Phone: {{2}}\nAction Required: Call\n\nPlease contact the customer as soon as possible.',
        example: {
          body_text: [
            [
              'John Doe',
              '+1234567890'
            ]
          ]
        }
      },
      {
        type: 'FOOTER',
        text: 'AvenPing Support System'
      }
    ]
  },
  whatsapp_support_alert: {
    name: 'whatsapp_support_alert',
    language: 'en',
    category: 'UTILITY',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Support Alert - WhatsApp Message Required'
      },
      {
        type: 'BODY',
        text: 'Hello! A customer needs support and requires a WhatsApp message.\n\nCustomer Name: {{1}}\nCustomer Phone: {{2}}\nAction Required: WhatsApp Message\n\nPlease contact the customer as soon as possible.',
        example: {
          body_text: [
            [
              'Jane Smith',
              '+1987654321'
            ]
          ]
        }
      },
      {
        type: 'FOOTER',
        text: 'AvenPing Support System'
      }
    ]
  }
};

/**
 * Create support templates for a WhatsApp Business Account
 * @param whatsAppAccountId - The WhatsApp Business Account ID
 * @param accessToken - The access token for the WhatsApp Business Account
 * @returns Promise<{ success: boolean; templates?: any[]; error?: string }>
 */
export async function createSupportTemplates(
  whatsAppAccountId: string,
  accessToken: string
): Promise<{ success: boolean; templates?: any[]; error?: string }> {
  try {
    const createdTemplates = [];

    for (const [templateKey, templateData] of Object.entries(SUPPORT_TEMPLATES)) {
      try {
        // Create template via WhatsApp Business API
        const response = await fetch(
          `https://graph.facebook.com/v23.0/${whatsAppAccountId}/message_templates`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(templateData)
          }
        );

        const result = await response.json();

        if (!response.ok) {
          console.error(`Failed to create template ${templateKey}:`, result);
          // Continue with other templates even if one fails
          continue;
        }

        createdTemplates.push({
          name: templateKey,
          templateId: result.id,
          status: result.status || 'PENDING'
        });

        console.log(`Successfully created template ${templateKey}:`, result);
      } catch (error) {
        console.error(`Error creating template ${templateKey}:`, error);
        // Continue with other templates
      }
    }

    return {
      success: createdTemplates.length > 0,
      templates: createdTemplates
    };
  } catch (error) {
    console.error('Error creating support templates:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if support templates exist for a WhatsApp Business Account
 * @param whatsAppAccountId - The WhatsApp Business Account ID
 * @param accessToken - The access token for the WhatsApp Business Account
 * @returns Promise<{ exists: boolean; templates?: any[] }>
 */
export async function checkSupportTemplates(
  whatsAppAccountId: string,
  accessToken: string
): Promise<{ exists: boolean; templates?: any[] }> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${whatsAppAccountId}/message_templates`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch templates:', result);
      return { exists: false };
    }

    const supportTemplates = result.data?.filter((template: any) => 
      template.name === 'call_support_alert' || template.name === 'whatsapp_support_alert'
    ) || [];

    return {
      exists: supportTemplates.length >= 2,
      templates: supportTemplates
    };
  } catch (error) {
    console.error('Error checking support templates:', error);
    return { exists: false };
  }
}

/**
 * Create support templates during onboarding if they don't exist
 * @param userId - The user ID
 * @returns Promise<{ success: boolean; message: string }>
 */
export async function ensureSupportTemplates(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        whatsAppAccount: {
          include: {
            phoneNumbers: true
          }
        }
      }
    });

    if (!user?.whatsAppAccount) {
      return {
        success: false,
        message: 'No WhatsApp account found for user'
      };
    }

    const { whatsAppAccount } = user;
    const accessToken = whatsAppAccount.accessToken;

    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found for WhatsApp account'
      };
    }

    // Check if templates already exist
    const templateCheck = await checkSupportTemplates(whatsAppAccount.wabaid, accessToken);
    
    if (templateCheck.exists) {
      return {
        success: true,
        message: 'Support templates already exist'
      };
    }

    // Create templates
    const result = await createSupportTemplates(whatsAppAccount.wabaid, accessToken);

    if (result.success) {
      return {
        success: true,
        message: `Successfully created ${result.templates?.length || 0} support templates`
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to create support templates'
      };
    }
  } catch (error) {
    console.error('Error ensuring support templates:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
