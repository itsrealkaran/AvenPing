import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        
        if (!session?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const account = await prisma.whatsAppAccount.findFirst({
            where: {
                user: {
                    email: session?.email
                }
            }
        });

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        // Get pagination parameters from URL
        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '20');
        const take = Math.min(limit, 100); // Maximum 100 messages per request
        
        const conversation = await prisma.whatsAppRecipient.findUnique({
            where: { id: id },
            include: {
                messages: {
                    take: take + 1,
                    orderBy: {
                        createdAt: 'asc'
                    },
                    ...(cursor ? {
                        cursor: {
                            id: cursor
                        },
                        skip: 1
                    } : {})
                },
                labels: true
            }
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        prisma.whatsAppRecipient.update({
            where: { id: id },
            data: {
                lastCheckedTime: new Date(),
            }
        }).then(() => {
            console.log('Last checked time updated');
            // Update unread messages separately
            prisma.whatsAppMessage.updateMany({
                where: {
                    recipientId: id,
                    createdAt: {
                        gt: conversation.lastCheckedTime
                    },
                    isOutbound: false,
                    status: {
                        not: "READ"
                    }
                },
                data: {
                    readAt: new Date(),
                    status: "READ"
                }
            }).then(() => {
                console.log('Unread messages updated');
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });


        // Check if there are more results
        const hasMore = conversation.messages.length > take;
        let messages = hasMore ? conversation.messages.slice(0, take) : conversation.messages;

        messages = await Promise.all(messages.map(async (item: any) => ({
            ...item,
                media: item.media.length > 0 ? await (async () => {
                try {
                  const mediaResponse = await axios.get(`https://graph.facebook.com/v23.0/${item.media[0].mediaId}`, {
                    headers: {
                      'Authorization': `Bearer ${account.accessToken}`
                    }
                  });
                  
                  // Download the actual media file
                  const mediaFile = await axios.get(mediaResponse.data.url, {
                    headers: {
                      'Authorization': `Bearer ${account.accessToken}`
                    },
                    responseType: 'arraybuffer'
                  });
                  
                  // Convert to base64 for frontend display
                  const base64 = Buffer.from(mediaFile.data).toString('base64');
                  const dataUrl = `data:${mediaResponse.data.mime_type};base64,${base64}`;
                  
                  return [{type: mediaResponse.data.mime_type, mediaId: dataUrl}];
                } catch (error) {
                  console.error('Failed to fetch media:', error instanceof Error ? error.message : 'Unknown error');
                  // Return empty array if media fetch fails
                  return [];
                }
              })() : []
          })));

        // Get the cursor for the next page
        const nextCursor = hasMore ? messages[messages.length - 1].id : null;

        return NextResponse.json({
            id: conversation.id,
            phoneNumber: conversation.phoneNumber,
            name: conversation.name,
            labels: conversation.labels,
            messages,
            nextCursor,
            hasMore
        });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}