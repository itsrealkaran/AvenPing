import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMessageToUserSafe } from "@/lib/websocket-utils";
import { flowRunner } from "@/lib/flow-runner";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // check the mode and token sent are correct
  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  ) {
    // respond with 200 OK and challenge token from the request
    console.log("Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    return new NextResponse(null, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("WhatsApp webhook received:", JSON.stringify(data));

    // Handle delivery status updates
    if (data.entry && data.entry.length > 0) {
      for (const entry of data.entry) {
        for (const change of entry.changes) {
          const phoneNumberId = change.value.metadata.phone_number_id;

          // Find all matching phone numbers
          const whatsAppPhoneNumbers =
            await prisma.whatsAppPhoneNumber.findMany({
              where: {
                phoneNumberId,
              },
              include: {
                recipients: true,
                account: {
                  include: {
                    user: true,
                  },
                },
              },
            });

          if (!whatsAppPhoneNumbers || whatsAppPhoneNumbers.length === 0) {
            console.error("WhatsApp phone number not found");
            continue;
          }

          // Process each matching phone number
          for (const whatsAppPhoneNumber of whatsAppPhoneNumbers) {
            // Emit event for status updates
            if (
              change.field === "messages" &&
              change.value &&
              change.value.statuses
            ) {
              for (const status of change.value.statuses) {
                const wamid = status.id;
                const statusValue = status.status;
                const phoneNumber = status.recipient_id;

                if (statusValue === "failed") {
                  await prisma.whatsAppMessage.updateMany({
                    where: { wamid },
                    data: {
                      status: "FAILED",
                      errorMessage: status.errors[0].error_data.details,
                    },
                  });
                } else {
                  // Update message status
                  await prisma.whatsAppMessage.updateMany({
                    where: { wamid },
                    data: {
                      status: statusValue.toUpperCase(),
                      deliveredAt:
                      statusValue === "delivered" ? new Date() : undefined,
                      readAt: statusValue === "read" ? new Date() : undefined,
                      errorMessage: status.errors
                        ? JSON.stringify(status.errors)
                        : null,
                    },
                  });

                  const recipient = whatsAppPhoneNumber.recipients.find(
                    (recipient) => recipient.phoneNumber === phoneNumber
                  );

                  if (recipient && recipient.activeCampaignId) {
                    // Map WhatsApp status to our enum values
                    let mappedStatus: "UNDELIVERED" | "UNREAD" | "READ" | "REPLIED";
                    switch (statusValue) {
                      case "sent":
                        mappedStatus = "UNREAD";
                        break;
                      case "delivered":
                        mappedStatus = "UNREAD";
                        break;
                      case "read":
                        mappedStatus = "READ";
                        break;
                      case "failed":
                        mappedStatus = "UNDELIVERED";
                        break;
                      default:
                        mappedStatus = "UNREAD";
                    }

                    await prisma.whatsAppRecipient.updateMany({
                      where: {
                        id: recipient.id,
                      },
                      data: {
                        status: mappedStatus,
                      },
                    })
                    await prisma.whatsAppCampaign.update({
                      where: {
                        id: recipient.activeCampaignId,
                      },
                      data: {
                        recipientStats: {
                          push: {
                            id: recipient.id,
                            name: recipient.name || "",
                            phoneNumber: recipient.phoneNumber,
                            status: mappedStatus,
                          }
                        }
                      }
                    });
                  }
                }

                // Emit status update event
                const eventData = {
                  type: "status_update",
                  userId: whatsAppPhoneNumber.account.user?.id,
                  data: {
                    wamid,
                    status: statusValue.toUpperCase(),
                    phoneNumberId,
                    phoneNumber,
                    error: status.errors
                      ? status.errors[0].error_data.details
                      : null,
                  },
                };
                await sendMessageToUserSafe(whatsAppPhoneNumber.account.user?.id!, eventData);
              }
            } else if (
              change.field === "messages" &&
              change.value &&
              !change.value.statuses
            ) {
              for (const message of change.value.messages) {
                const recipient = whatsAppPhoneNumber.recipients.find(
                  (recipient) => recipient.phoneNumber === message.from
                );
                let isOptedOut = false;
                if (message.text.body.toLowerCase().replace(/\s/g, "") === "stop") {
                  isOptedOut = true;
                }
                let newMessage;

                if (recipient) {
                  if (
                    !recipient.name &&
                    change.value.contacts[0].profile.name
                  ) {
                    await prisma.whatsAppRecipient.update({
                      where: {
                        id: recipient.id,
                      },
                      data: {
                        name: change.value.contacts[0].profile.name,
                        isOptedOut,
                      },
                    });
                  }
                  newMessage = await prisma.whatsAppMessage.create({
                    data: {
                      recipientId: recipient.id,
                      phoneNumber: message.from,
                      wamid: message.id,
                      message: message.text.body,
                      sentAt: new Date(message.timestamp * 1000),
                      status: "PENDING",
                      whatsAppPhoneNumberId: whatsAppPhoneNumber.id,
                    },
                  });

                  if (!recipient.hasConversation) {
                    await prisma.whatsAppRecipient.update({
                      where: {
                        id: recipient.id,
                      },
                      data: {
                        hasConversation: true,
                      },
                    });
                  }
                } else {
                  const newData = await prisma.$transaction(async (tx) => {
                    const newRecipient = await tx.whatsAppRecipient.create({
                      data: {
                        phoneNumber: message.from,
                        name: change.value.contacts[0].profile.name || null,
                        whatsAppPhoneNumberId: whatsAppPhoneNumber.id,
                        isOptedOut,
                        source: "AI_SYNC",
                      },
                    });
                    newMessage = await tx.whatsAppMessage.create({
                      data: {
                        recipientId: newRecipient.id,
                        wamid: message.id,
                        phoneNumber: message.from,
                        message: message.text.body,
                        sentAt: new Date(message.timestamp * 1000),
                        status: "PENDING",
                        whatsAppPhoneNumberId: whatsAppPhoneNumber.id,
                      },
                    });

                    if (!newRecipient.hasConversation) {
                      await prisma.whatsAppRecipient.update({
                        where: {
                          id: newRecipient.id,
                        },
                        data: {
                          hasConversation: true,
                        },
                      });
                    }
                    return { newRecipient, newMessage };
                  });

                  // Process flow automation for new recipient
                  if (whatsAppPhoneNumber.account.user?.id && !isOptedOut) {
                    try {
                      await flowRunner.processMessage(
                        whatsAppPhoneNumber.account.user.id,
                        newData.newRecipient.id,
                        message.text.body,
                        whatsAppPhoneNumber.id
                      );
                    } catch (flowError) {
                      console.error('Error processing flow:', flowError);
                    }
                  }
                }

                if (recipient && recipient.activeCampaignId) {
                  await prisma.whatsAppRecipient.update({
                    where: {
                      id: recipient.id,
                    },
                    data: {
                      status: "REPLIED",
                    },
                  });
                  await prisma.whatsAppCampaign.update({
                    where: {
                      id: recipient.activeCampaignId,
                    },
                    data: {
                      recipientStats: {
                        push: {
                          id: recipient.id,
                          name: recipient.name || "",
                          phoneNumber: recipient.phoneNumber,
                          status: "REPLIED",
                        }
                      }
                    }});
                  }

                // Process flow automation for existing recipient
                if (recipient && whatsAppPhoneNumber.account.user?.id && !isOptedOut) {
                  try {
                    await flowRunner.processMessage(
                      whatsAppPhoneNumber.account.user.id,
                      recipient.id,
                      message.text.body,
                      whatsAppPhoneNumber.id
                    );
                  } catch (flowError) {
                    console.error('Error processing flow:', flowError);
                  }
                }

                // Emit new message event
                const eventData = {
                  type: "new_message",
                  userId: whatsAppPhoneNumber.account.user?.id,
                  data: {
                    message: newMessage,
                    phoneNumberId,
                  },
                };
                await sendMessageToUserSafe(whatsAppPhoneNumber.account.user?.id!, eventData);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling WhatsApp webhook:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
