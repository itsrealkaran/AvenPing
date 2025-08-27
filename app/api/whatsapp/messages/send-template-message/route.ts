import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { storeWhatsAppMessage } from "@/lib/store-message";

export async function POST(request: NextRequest) {
  try {
    const { contacts, templateName, templateData, variables, campaignId, campaignName, phoneNumberId } = await request.json();

    // Validate required fields
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'Contacts array is required and must not be empty' }, { status: 400 });
    }

    if (!templateName || !templateData || !variables || !Array.isArray(variables)) {
      return NextResponse.json({ error: 'Template name, data, and variables are required' }, { status: 400 });
    }

    if (!campaignId || !phoneNumberId) {
      return NextResponse.json({ error: 'Campaign ID and phone number ID are required' }, { status: 400 });
    }

    const session = await getSession();
    console.log("session from send template message", session)

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          id: session.userId
        },
        phoneNumbers: {
          some: {
            phoneNumberId: phoneNumberId
          }
        }
      },
      include: {
        phoneNumbers: true
      }
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Validate that all required media files are uploaded
    const missingMedia = variables.filter((variable: any) => 
      variable.format && variable.format !== "TEXT" && !variable.mediaId
    );
    
    if (missingMedia.length > 0) {
      return NextResponse.json({ 
        error: 'Missing media files', 
        details: `The following media variables require uploaded files: ${missingMedia.map((v: any) => `Variable ${v.variableIndex} (${v.format})`).join(', ')}`
      }, { status: 400 });
    }

    const campaignStats: {
      id: string;
      name: string;
      phoneNumber: string;
      status: string;
    }[] = [];

    // Send messages to each contact
    for (const contact of contacts) {
      try {
        // Build personalized template parameters for this contact
        const headerParams: any[] = [];
        const bodyParams: any[] = [];
        const replacedTemplateData: any[] = [];
        
        variables.forEach((variable: any) => {
          let paramValue = variable.value || variable.fallbackValue || "";
          let paramType = "text";
          
          if (variable.useAttribute && variable.attributeName) {
            if (variable.attributeName === "name") {
              // Built-in attribute: contact name
              paramValue = contact.name || variable.fallbackValue || "";
            } else if (variable.attributeName === "phoneNumber") {
              // Built-in attribute: phone number
              paramValue = contact.phoneNumber || variable.fallbackValue || "";
            } else {
              // Custom attribute: find in contact's attributeValues
              const attr = contact.attributeValues?.find((a: any) => a.name === variable.attributeName);
              paramValue = attr?.value || variable.fallbackValue || "";
            }
          }
          
          // Handle media variables
          if (variable.format && variable.format !== "TEXT") {
            paramType = variable.format.toLowerCase();
            // For media, only use mediaId (uploaded file) - no fallback
            paramValue = variable.mediaId || "";
            
            // Skip media variables without uploaded files
            if (!variable.mediaId) {
              console.warn(`Skipping media variable ${variable.id} - no uploaded media`);
              return;
            }
          }
          
          // Create parameter object based on type
          let param;
          if (paramType === "text") {
            param = {
              type: "text",
              text: paramValue
            };
          } else {
            // Media parameter - use WhatsApp media ID
            param = {
              type: paramType,
              id: paramValue
            };
          }
          
          if (variable.componentType === "HEADER") {
            headerParams.push(param);
          } else if (variable.componentType === "BODY") {
            bodyParams.push(param);
          }
          
          // Store the replaced template data for this contact
          const originalComponent = templateData.components.find((comp: any) => comp.type === variable.componentType);
          if (originalComponent) {
            let replacedText = originalComponent.text || "";
            let replacedMedia = "";
            
            if (variable.format === "TEXT" && originalComponent.text) {
              // Text replacement
              const placeholder = `{{${variable.variableIndex}}}`;
              replacedText = replacedText.replace(placeholder, paramValue);
            } else if (variable.format && variable.format !== "TEXT") {
              // Media replacement
              replacedMedia = paramValue;
            }
            
            replacedTemplateData.push({
              ...originalComponent,
              text: replacedText || undefined,
              mediaUrl: replacedMedia || undefined,
              mediaId: variable.mediaId || undefined,
              originalText: originalComponent.text,
              originalMedia: originalComponent.format !== "TEXT" ? originalComponent.example?.header_media?.[0] : undefined,
              replacedValue: paramValue,
              variableIndex: variable.variableIndex,
              attributeName: variable.attributeName,
              useAttribute: variable.useAttribute,
              format: variable.format
            });
          }
        });

        // Build the template structure for this contact
        const templateStructure = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          type: "template",
          to: contact.phoneNumber.replace(/[^\d]/g, ''),
          template: {
            name: templateName,
            language: {
              code: "en_US",
            },
            components: [] as any[],
          },
        };
        
        // Add header component if we have header parameters
        if (headerParams.length > 0) {
          const headerComponent = templateData.components.find((comp: any) => comp.type === "HEADER");
          if (headerComponent) {
            if (headerComponent.format === "TEXT") {
              // Text header - only add if we have text parameters
              const textParams = headerParams.filter(p => p.type === "text");
              if (textParams.length > 0) {
                templateStructure.template.components.push({ 
                  type: "header", 
                  parameters: textParams
                });
              }
            } else if (headerComponent.format && headerComponent.format !== "TEXT") {
              // Media header component
              const mediaParam = headerParams.find(p => p.type !== "text");
              if (mediaParam && mediaParam.id) {
                // For media, we only use uploaded files (mediaId)
                const mediaVariable = variables.find((v: any) => 
                  v.componentType === "HEADER" && v.format === headerComponent.format
                );
                
                if (mediaVariable?.mediaId) {
                  // Use media ID for uploaded files
                  templateStructure.template.components.push({
                    type: "header",
                    parameters: [{ 
                      type: mediaParam.type, 
                      [mediaParam.type]: { id: mediaParam.id }
                    }]
                  });
                  console.log(`Added media header component for ${contact.phoneNumber}:`, {
                    type: mediaParam.type,
                    mediaId: mediaParam.id,
                    format: headerComponent.format
                  });
                } else {
                  console.warn(`Skipping media header for ${contact.phoneNumber} - no mediaId found`);
                }
                // If no mediaId, skip this component (media is required)
              }
            }
          }
        }
        
        // Add body component if we have body parameters
        if (bodyParams.length > 0) {
          templateStructure.template.components.push({ 
            type: "body", 
            parameters: bodyParams 
          });
        }

        console.log(`Template structure for ${contact.phoneNumber}:`, JSON.stringify(templateStructure.template.components, null, 2));

        // Send message via WhatsApp API
        console.log(`Sending to WhatsApp API for ${contact.phoneNumber}:`, JSON.stringify(templateStructure, null, 2));
        
        const response = await fetch(
          `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${account.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(templateStructure)
          }
        );

        // Check if the request was successful
        if (!response.ok) {
          console.error(`HTTP error for ${contact.phoneNumber}:`, response.status, response.statusText);
          const errorText = await response.text();
          console.error(`Error response body:`, errorText);
          
          // Create structured templateData for error case
          const errorTemplateData: Array<{
            type: "HEADER" | "BODY" | "FOOTER" | "BUTTON";
            text?: string;
            mediaUrl?: string;
            mediaId?: string;
            format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
            buttonText?: string;
            buttonType?: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
            buttonValue?: string;
          }> = [];
          
          // Add components from replacedTemplateData
          replacedTemplateData.forEach((item: any) => {
            if (item.type === "HEADER") {
              errorTemplateData.push({
                type: "HEADER" as const,
                text: item.text,
                format: item.format || "TEXT" as const
              });
            } else if (item.type === "BODY") {
              errorTemplateData.push({
                type: "BODY" as const,
                text: item.text,
                format: "TEXT" as const
              });
            } else if (item.type === "FOOTER") {
              errorTemplateData.push({
                type: "FOOTER" as const,
                text: item.text,
                format: "TEXT" as const
              });
            } else if (item.type === "BUTTON") {
              errorTemplateData.push({
                type: "BUTTON" as const,
                text: item.text,
                buttonText: item.text,
                buttonType: "QUICK_REPLY" as const
              });
            }
          });

          // Create message with error status using storeWhatsAppMessage
          const message = await storeWhatsAppMessage({
            recipientId: contact.id,
            phoneNumber: contact.phoneNumber,
            whatsAppPhoneNumberId: account.phoneNumbers[0].id,
            isOutbound: true,
            message: "",
            timestamp: Math.floor(Date.now() / 1000),
            status: "FAILED",
            errorMessage: `HTTP ${response.status}: ${response.statusText}`,
            templateData: errorTemplateData,
          });

          await prisma.whatsAppRecipient.update({
            where: { id: contact.id },
            data: {
              status: "UNDELIVERED",
              activeCampaignId: campaignId,
            },
          });

          campaignStats.push({
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            status: "UNDELIVERED",
          });
          
          continue; // Skip to next contact
        }
        
        const result = await response.json();
        
        console.log(`WhatsApp API response for ${contact.phoneNumber}:`, JSON.stringify(result, null, 2));

        // Create structured templateData with replaced values
        const structuredTemplateData: Array<{
          type: "HEADER" | "BODY" | "FOOTER" | "BUTTON";
          text?: string;
          mediaUrl?: string;
          mediaId?: string;
          format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
          buttonText?: string;
          buttonType?: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
          buttonValue?: string;
        }> = [];
        
        // Add header component if exists
        const headerComponent = templateData.components.find((comp: any) => comp.type === "HEADER");
        if (headerComponent) {
          const headerVariable = variables.find((v: any) => v.componentType === "HEADER");
          if (headerVariable) {
            if (headerVariable.format === "TEXT") {
              // Text header
              const headerText = headerComponent.text?.replace(
                `{{${headerVariable.variableIndex}}}`,
                headerVariable.useAttribute && headerVariable.attributeName
                  ? (contact[headerVariable.attributeName] || headerVariable.fallbackValue || "")
                  : (headerVariable.value || headerVariable.fallbackValue || "")
              ) || headerComponent.text || "";
              
              structuredTemplateData.push({
                type: "HEADER" as const,
                text: headerText,
                format: "TEXT" as const
              });
            } else if (headerVariable.mediaId) {
              // Media header
              structuredTemplateData.push({
                type: "HEADER" as const,
                mediaId: headerVariable.mediaId,
                format: headerVariable.format as "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO",
                mediaUrl: headerVariable.mediaUrl
              });
            }
          }
        }
        
        // Add body component if exists
        const bodyComponent = templateData.components.find((comp: any) => comp.type === "BODY");
        if (bodyComponent) {
          let bodyText = bodyComponent.text || "";
          
          // Replace all body variables
          variables.forEach((variable: any) => {
            if (variable.componentType === "BODY" && variable.format === "TEXT") {
              const replacementValue = variable.useAttribute && variable.attributeName
                ? (contact[variable.attributeName] || variable.fallbackValue || "")
                : (variable.value || variable.fallbackValue || "");
              
              bodyText = bodyText.replace(`{{${variable.variableIndex}}}`, replacementValue);
            }
          });
          
          if (bodyText) {
            structuredTemplateData.push({
              type: "BODY" as const,
              text: bodyText,
              format: "TEXT" as const
            });
          }
        }
        
        // Add footer component if exists
        const footerComponent = templateData.components.find((comp: any) => comp.type === "FOOTER");
        if (footerComponent) {
          structuredTemplateData.push({
            type: "FOOTER" as const,
            text: footerComponent.text || "",
            format: "TEXT" as const
          });
        }
        
        // Add button components if exist
        const buttonComponents = templateData.components.filter((comp: any) => comp.type === "BUTTON");
        buttonComponents.forEach((buttonComp: any, index: number) => {
          const buttonVariable = variables.find((v: any) => 
            v.componentType === "BUTTON" && v.variableIndex === buttonComp.variable_index
          );
          
          if (buttonVariable) {
            const buttonText = buttonVariable.useAttribute && buttonVariable.attributeName
              ? (contact[buttonVariable.attributeName] || buttonVariable.fallbackValue || "")
              : (buttonVariable.value || buttonVariable.fallbackValue || "");
            
            structuredTemplateData.push({
              type: "BUTTON" as const,
              text: buttonText,
              buttonText: buttonText,
              buttonType: (buttonComp.sub_type || "QUICK_REPLY") as "QUICK_REPLY" | "URL" | "PHONE_NUMBER",
              buttonValue: buttonComp.variable_index ? buttonText : undefined
            });
          }
        });

        // Create message with structured templateData using storeWhatsAppMessage
        const message = await storeWhatsAppMessage({
          recipientId: contact.id,
          phoneNumber: contact.phoneNumber,
          whatsAppPhoneNumberId: account.phoneNumbers[0].id,
          isOutbound: true,  // Template messages are sent by business
          message: "",  // Template messages don't have regular text
          timestamp: Math.floor(Date.now() / 1000),
          status: "PENDING", // Initial status
          templateData: structuredTemplateData,
        });

        // Check for WhatsApp API errors
        if (result.error) {
          console.error(`WhatsApp API error for ${contact.phoneNumber}:`, result.error);
          
          // Update message with error status
          await prisma.whatsAppMessage.update({
            where: { id: message.id },
            data: {
              status: "FAILED",
              errorMessage: result.error.message || result.error.error_user_msg || "WhatsApp API error",
              wamid: result.error.message_id,
            },
          });

          await prisma.whatsAppRecipient.update({
            where: { id: contact.id },
            data: {
              status: "UNDELIVERED",
              activeCampaignId: campaignId,
            },
          });

          campaignStats.push({
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            status: "UNDELIVERED",
          });
          
          continue; // Skip to next contact
        }

        // Validate successful response structure
        if (!result.messages || !Array.isArray(result.messages) || result.messages.length === 0) {
          console.error(`Invalid WhatsApp API response for ${contact.phoneNumber}:`, result);
          
          // Update message with error status
          await prisma.whatsAppMessage.update({
            where: { id: message.id },
            data: {
              status: "FAILED",
              errorMessage: "Invalid response from WhatsApp API - no message ID received",
            },
          });

          await prisma.whatsAppRecipient.update({
            where: { id: contact.id },
            data: {
              status: "UNDELIVERED",
              activeCampaignId: campaignId,
            },
          });

          campaignStats.push({
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            status: "UNDELIVERED",
          });
          
          continue; // Skip to next contact
        }

        // Update message with success status and WhatsApp message ID
        await prisma.whatsAppMessage.update({
          where: { id: message.id },
          data: {
            status: "SENT", // Success status
            wamid: result.messages?.[0]?.id,
            sentAt: new Date(),
          },
        });

        await prisma.whatsAppRecipient.update({
          where: { id: contact.id },
          data: {
            status: "UNREAD",
            activeCampaignId: campaignId,
          },
        });

        campaignStats.push({
          id: contact.id,
          name: contact.name,
          phoneNumber: contact.phoneNumber,
          status: "SENT",
        });
      } catch (error) {
        console.error(`Error sending message to ${contact.phoneNumber}:`, error);
      }
    }
    // Update campaign status to COMPLETED
    await prisma.whatsAppCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        recipientStats: campaignStats
      }
    });
    return NextResponse.json({ message: 'Messages sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending template message:', error);
    return NextResponse.json({ error: 'Failed to send template message' }, { status: 500 });
  }
}