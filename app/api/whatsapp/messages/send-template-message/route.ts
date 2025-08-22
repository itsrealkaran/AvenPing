import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { contacts, templateName, templateData, variables, campaignId, campaignName, phoneNumberId } = await request.json();

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

    let campaignStats: {
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
          
          const param = {
            type: "text",
            text: paramValue,
          };
          
          if (variable.componentType === "HEADER") {
            headerParams.push(param);
          } else if (variable.componentType === "BODY") {
            bodyParams.push(param);
          }
          
          // Store the replaced template data for this contact
          const originalComponent = templateData.components.find((comp: any) => comp.type === variable.componentType);
          if (originalComponent) {
            let replacedText = originalComponent.text || "";
            const placeholder = `{{${variable.variableIndex}}}`;
            replacedText = replacedText.replace(placeholder, paramValue);
            
            replacedTemplateData.push({
              ...originalComponent,
              text: replacedText,
              originalText: originalComponent.text,
              replacedValue: paramValue,
              variableIndex: variable.variableIndex,
              attributeName: variable.attributeName,
              useAttribute: variable.useAttribute
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
        if (headerParams.length > 0) {
          templateStructure.template.components.push({ type: "header", parameters: headerParams });
        }
        if (bodyParams.length > 0) {
          templateStructure.template.components.push({ type: "body", parameters: bodyParams });
        }

        console.log("templateStructure", templateStructure.template.components)

        // Send message via WhatsApp API
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

        
        const result = await response.json();
        
        console.log("response from send template message", JSON.stringify(result, null, 2))

        // Create message with campaign data and replaced values
        const message = await prisma.whatsAppMessage.create({
          data: {
            templateData: {
              // Store the replaced template data
              components: replacedTemplateData,
              // Store campaign metadata
              campaignId: campaignId,
              campaignName: campaignName || "Template Campaign",
              templateName: templateName,
              variables: variables, // Store the original variables configuration
              replacedValues: replacedTemplateData.map(item => ({
                variableIndex: item.variableIndex,
                attributeName: item.attributeName,
                useAttribute: item.useAttribute,
                replacedValue: item.replacedValue,
                originalText: item.originalText,
                finalText: item.text
              }))
            },
            recipientId: contact.id,
            whatsAppPhoneNumberId: account.phoneNumbers[0].id,
            isOutbound: true,  // Template messages are sent by business
            message: "",  // Template messages don't have regular text
            phoneNumber: contact.phoneNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "PENDING", // Initial status
          },
        });

        console.log("result from send template message", message)

        if (result.error) {
          // Update message with error status
          await prisma.whatsAppMessage.update({
            where: { id: message.id },
            data: {
              status: "FAILED",
              errorMessage: result.error.message,
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
        } else {
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
        }
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