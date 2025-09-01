import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
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
        
        // Build the messages query with proper pagination
        const messagesQuery: any = {
            take: take + 1, // Take one extra to check if there are more results
            orderBy: {
                createdAt: 'desc' // Latest messages first
            },
            ...(cursor ? {
                cursor: {
                    id: cursor
                },
                skip: 1 // Skip the cursor message itself
            } : {})
        };

        const conversation = await prisma.whatsAppRecipient.findUnique({
            where: { id: id },
            include: {
                messages: messagesQuery,
                labels: true
            }
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Update last checked time and mark messages as read
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
        const messages = hasMore ? conversation.messages.slice(0, take) : conversation.messages;

        // Get the cursor for the next page (use the oldest message ID from current page)
        const nextCursor = hasMore && messages.length > 0 ? messages[messages.length - 1].id : null;

        // Sort messages by createdAt ascending for frontend display (oldest to newest)
        // This maintains the chat flow while keeping pagination working
        const sortedMessages = messages.reverse();

        return NextResponse.json({
            id: conversation.id,
            phoneNumber: conversation.phoneNumber,
            name: conversation.name,
            labels: conversation.labels,
            messages: sortedMessages,
            nextCursor,
            hasMore
        });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}