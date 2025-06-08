import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
    const { id } = await params;
    const body = await request.json();
    const { recipientId } = body;
    const session = await getSession();
    
    if (!session?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await prisma.whatsAppAccount.findFirst({
        where: {
            user: {
                email: session.email
            }
        }
    });

    if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const label = await prisma.label.findUnique({
        where: {
            id: id,
            accountId: account.id
        }
    });

    if (!label) {
        return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    await prisma.label.update({
        where: {
            id: id,
            accountId: account.id
        },
        data: {
            recipients: {
                connect: {
                    id: recipientId
                }
            }
        }
    });

    return NextResponse.json({ message: 'Recipient added to label successfully' });
    } catch (error) {
        console.error('Error adding recipient to label', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { recipientId } = body;
        const session = await getSession();
        
        if (!session?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const account = await prisma.whatsAppAccount.findFirst({
            where: {
                user: {
                    email: session.email
                }
            }
        });

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        const label = await prisma.label.findUnique({
            where: {
                id: id,
                accountId: account.id
            }
        });

        if (!label) {
            return NextResponse.json({ error: 'Label not found' }, { status: 404 });
        }
        
        await prisma.label.update({
            where: {
                id: id,
                accountId: account.id
            },
            data: {
                recipients: {
                    disconnect: {
                        id: recipientId
                    }
                }
            }
        });

        return NextResponse.json({ message: 'Recipient removed from label successfully' });
    } catch (error) {
        console.error('Error removing recipient from label', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}