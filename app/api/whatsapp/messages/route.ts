import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import type { Prisma, WhatsAppMessage } from "@prisma/client";
import axios from "axios";

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
          take: 20,
          select: {
            id: true,
            message: true,
            createdAt: true,
            status: true,
            isOutbound: true,
            mediaIds: true,
          },
          orderBy: {
            createdAt: "asc",
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
        createdAt: "asc",
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
    }));

    items = await Promise.all(
      items.map(async (item: any) => ({
        ...item,
        messages: await Promise.all(item.messages.map(async (message: any) => ({
          ...message,
          media:
            message.media && message.media.length > 0
              ? await (async () => {
                  try {
                    const mediaResponse = await axios.get(
                      `https://graph.facebook.com/v23.0/${message?.media?.[0]?.mediaId}`,
                      {
                        headers: {
                          Authorization: `Bearer ${account.accessToken}`,
                        },
                      }
                    );

                    // Download the actual media file
                    const mediaFile = await axios.get(mediaResponse.data.url, {
                      headers: {
                        Authorization: `Bearer ${account.accessToken}`,
                      },
                      responseType: "arraybuffer",
                    });

                    // Convert to base64 for frontend display
                    const base64 = Buffer.from(mediaFile.data).toString(
                      "base64"
                    );
                    const dataUrl = `data:${mediaResponse.data.mime_type};base64,${base64}`;

                    return [
                      { type: mediaResponse.data.mime_type, mediaId: dataUrl },
                    ];
                  } catch (error) {
                    console.error(
                      "Failed to fetch media:",
                      error instanceof Error ? error.message : "Unknown error"
                    );
                    // Return empty array if media fetch fails
                    return [];
                  }
                })()
              : null,
        }))),
      }))
    );

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
    const { recipientId, message, templateId, templateParams, media } = body;

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

    // Create message in database
    const newMessage = await prisma.whatsAppMessage.create({
      data: {
        message,
        isOutbound: true,
        status: "PENDING",
        phoneNumber: recipient.phoneNumber,
        whatsAppPhoneNumberId: phoneNumberId,
        recipientId,
        mediaIds: media ? media.map((m: any) => m.mediaId) : [],
      },
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
                {
                  type: "body",
                  parameters: templateParams,
                },
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
