import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: {
                email: session.email as string,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');
        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '20');
        const take = Math.min(limit, 100); // Maximum 100 messages per request

        const conversation = await prisma.whatsAppRecipient.findUnique({
            where: {
                id: conversationId as string,
            },
            include: {
                messages: {
                    where: {
                        createdAt: {
                            gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) // 4 days ago
                        }
                    },
                    select: {
                        id: true,
                        message: true,
                        createdAt: true,
                        status: true,
                        isOutbound: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: take + 1, // Take one extra to check if there are more results
                    ...(cursor ? {
                        cursor: {
                            id: cursor
                        },
                        skip: 1
                    } : {})
                },
            },
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
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
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}