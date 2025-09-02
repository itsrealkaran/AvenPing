import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import type { Prisma, WhatsAppMessage } from "@prisma/client";
import axios from "axios";
import { storeWhatsAppMessage } from "@/lib/store-message";

// Get all messages for an account with pagination
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");
    const take = Math.min(limit, 100); // Maximum 100 messages per request
    const phoneNumberId = searchParams.get("phoneNumberId");
    const search = searchParams.get("search");
    const label = searchParams.get("label");

    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          email: session?.email,
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Build the query
    const query: Prisma.WhatsAppRecipientFindManyArgs = {
      where: {
        whatsAppPhoneNumber: {
          id: phoneNumberId as string,
          account: {
            user: {
              email: session?.email,
            },
          },
        },
        hasConversation: true,
        ...(search
          ? {
              OR: [
                { phoneNumber: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(label && label === "unread"
          ? {
              messages: {
                some: {
                  status: "PENDING",
                },
              },
            }
          : label
          ? {
              labels: {
                some: {
                  name: label,
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        lastCheckedTime: true,
        messages: {
          take: take + 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        labels: {
          select: {
            name: true,
            description: true,
            color: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: take + 1, // Take one extra to check if there are more results
    };

    // Add cursor if provided
    if (cursor) {
      query.where = {
        ...query.where,
        createdAt: {
          lt: new Date(cursor),
        },
      };
    }

    const messages = await prisma.whatsAppRecipient.findMany(query);

    // Check if there are more results
    const hasMore = messages.length > take;
    let items = hasMore ? messages.slice(0, take) : messages;

    // add a unread count to the items, Compare the lastCheckedTime with the createdAt of the messages
    items = items.map((item: any) => ({
      ...item,
      unreadCount: item.messages.filter(
        (message: WhatsAppMessage) =>
          !message.isOutbound && message.createdAt > item.lastCheckedTime
      ).length,
      hasMore: item.messages.length > take,
      nextCursor: item.messages[0].id,
    }));
    
    // items = await Promise.all(
    //   items.map(async (item: any) => ({
    //     ...item,
    //     messages: await Promise.all(item.messages.map(async (message: any) => ({
    //       ...message,
    //       media:
    //         message.media && message.media.length > 0
    //           ? await (async () => {
    //               try {
    //                 const mediaResponse = await axios.get(
    //                   `https://graph.facebook.com/v23.0/${message?.media?.[0]?.mediaId}`,
    //                   {
    //                     headers: {
    //                       Authorization: `Bearer ${account.accessToken}`,
    //                     },
    //                   }
    //                 );

    //                 // Download the actual media file
    //                 const mediaFile = await axios.get(mediaResponse.data.url, {
    //                   headers: {
    //                     Authorization: `Bearer ${account.accessToken}`,
    //                   },
    //                   responseType: "arraybuffer",
    //                 });

    //                 // Convert to base64 for frontend display
    //                 const base64 = Buffer.from(mediaFile.data).toString(
    //                   "base64"
    //                 );
    //                 const dataUrl = `data:${mediaResponse.data.mime_type};base64,${base64}`;

    //                 return [
    //                   { type: mediaResponse.data.mime_type, mediaId: dataUrl },
    //                 ];
    //               } catch (error) {
    //                 console.error(
    //                   "Failed to fetch media:",
    //                   error instanceof Error ? error.message : "Unknown error"
    //                 );
    //                 // Return empty array if media fetch fails
    //                 return [];
    //               }
    //             })()
    //           : null,
    //     }))),
    //   }))
    // );

    // reverse the messages in items.messages
    items = items.map((item: any) => ({
      ...item,
      messages: item.messages.reverse(),
    }));

    // Get the cursor for the next page
    const nextCursor = hasMore
      ? items[items.length - 1].createdAt.toISOString()
      : null;

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// Create a new message
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { recipientId, message, templateId, templateParams, headerParams, bodyParams, media } = body;

    // For now, let's try sending the template without parameters to see the structure
    if (templateId && templateParams && templateParams.length > 0) {
      console.log("Attempting to send template with parameters...");
    }

    const { searchParams } = new URL(request.url);
    const phoneNumberId = searchParams.get("phoneNumberId");

    if (!phoneNumberId || !recipientId || (!message && !templateId && !media)) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: message,
          templateId: templateId,
          templateParams: templateParams,
          recipientId: recipientId,
          phoneNumberId: phoneNumberId,
          media: media,
        },
        { status: 400 }
      );
    }

    // Get account details for WhatsApp API
    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          email: session.email,
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get phone number details
    const phoneNumber = await prisma.whatsAppPhoneNumber.findUnique({
      where: { id: phoneNumberId },
    });

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number not found" },
        { status: 404 }
      );
    }

    // Get recipient details
    const recipient = await prisma.whatsAppRecipient.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    // Get template data from WhatsApp API if templateId is provided
    let templateData = null;
    if (templateId) {
      try {
        const templatesResponse = await fetch(
          `https://graph.facebook.com/v23.0/${account.wabaid}/message_templates`,
          {
            headers: {
              'Authorization': `Bearer ${account.accessToken}`,
            },
          }
        );
        
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          const template = templatesData.data?.find((t: any) => t.name === templateId);
          if (template) {
            templateData = template;
          }
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    }

    // Create message in database using storeWhatsAppMessage
    const newMessage = await storeWhatsAppMessage({
      message,
      isOutbound: true,
      status: "PENDING",
      phoneNumber: recipient.phoneNumber,
      whatsAppPhoneNumberId: phoneNumberId,
      recipientId,
      mediaIds: media ? media.map((m: any) => m.mediaId) : [],
      timestamp: Math.floor(Date.now() / 1000),
      templateData: templateId && templateData ? (() => {
        // Create structured templateData with replaced values (similar to send-template-message route)
        const structuredTemplateData: Array<{
          type: "HEADER" | "BODY" | "FOOTER" | "BUTTON" | "BUTTONS";
          text?: string;
          mediaUrl?: string;
          mediaId?: string;
          format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
          buttonText?: string;
          buttonType?: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
          buttonValue?: string;
          buttons?: Array<{
            type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
            text: string;
            url?: string;
            phone_number?: string;
          }>;
        }> = [];
        
        // Add header component if exists
        const headerComponent = templateData.components.find((comp: any) => comp.type === "HEADER");
        if (headerComponent) {
          if (headerComponent.format === "TEXT") {
            // Text header - replace variables with actual values
            let headerText = headerComponent.text || "";
            
            // Replace header variables with actual parameter values
            if (headerParams && headerParams.length > 0) {
              headerParams.forEach((param: any, index: number) => {
                if (param.type === "text") {
                  const placeholder = `{{${index + 1}}}`;
                  headerText = headerText.replace(placeholder, param.text || "");
                }
              });
            }
            
            structuredTemplateData.push({
              type: "HEADER" as const,
              text: headerText,
              format: "TEXT" as const
            });
          } else if (headerComponent.format && headerComponent.format !== "TEXT") {
            // Media header
            const mediaParam = headerParams?.find((p: any) => p.type !== "text");
            if (mediaParam) {
              structuredTemplateData.push({
                type: "HEADER" as const,
                mediaId: mediaParam.image?.id || mediaParam.video?.id || mediaParam.document?.id,
                format: headerComponent.format as "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO"
              });
            }
          }
        }
        
        // Add body component if exists
        const bodyComponent = templateData.components.find((comp: any) => comp.type === "BODY");
        if (bodyComponent) {
          let bodyText = bodyComponent.text || "";
          
          // Replace body variables with actual parameter values
          if (bodyParams && bodyParams.length > 0) {
            bodyParams.forEach((param: any, index: number) => {
              if (param.type === "text") {
                const placeholder = `{{${index + 1}}}`;
                bodyText = bodyText.replace(placeholder, param.text || "");
              }
            });
          }
          
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
        
        return structuredTemplateData;
      })() : undefined,
    });

    // Send message via WhatsApp API
    try {
      const messageData = templateId
        ? {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient.phoneNumber,
            type: "template",
            template: {
              name: templateId,
              language: {
                code: "en_US",
              },
              components: [
                ...(headerParams && headerParams.length > 0 ? [{
                  type: "header",
                  parameters: headerParams,
                }] : []),
                ...(bodyParams && bodyParams.length > 0 ? [{
                  type: "body",
                  parameters: bodyParams,
                }] : []),
              ],
            },
          }
        : media && media[0] && (media[0].type == "image" || media[0].type == "video" || media[0].type == "document" || media[0].type == "audio")
        ? {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient.phoneNumber,
            type: media[0].type,
            [media[0].type]: {
              id: media[0].mediaId,
              ...(media[0].type != "audio" && {caption: message}),
              ...(media[0].type == "document" && {
                filename: media[0].name,
              }), 
            },
          }
        : {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient.phoneNumber,
            type: "text",
            text: {
              body: message,
            },
          };

      const response = await fetch(
        `https://graph.facebook.com/v23.0/${phoneNumber.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );

      const result = await response.json();

      console.log("result", result);

      // Update message with WhatsApp ID and status
      await prisma.whatsAppMessage.update({
        where: { id: newMessage.id },
        data: {
          wamid: result.messages?.[0]?.id,
          status: "SENT",
          sentAt: new Date(),
        },
      });

      return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
      // Update message with error status
      await prisma.whatsAppMessage.update({
        where: { id: newMessage.id },
        data: {
          status: "FAILED",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
      });

      throw error;
    }
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
