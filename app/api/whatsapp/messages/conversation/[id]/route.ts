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
                }
            }
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Check if there are more results
        const hasMore = conversation.messages.length > take;
        const messages = hasMore ? conversation.messages.slice(0, take) : conversation.messages;

        // Get the cursor for the next page
        const nextCursor = hasMore ? messages[messages.length - 1].id : null;

        return NextResponse.json({
            id: conversation.id,
            phoneNumber: conversation.phoneNumber,
            name: conversation.name,
            messages,
            nextCursor,
            hasMore
        });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}