import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const search = url.searchParams.get('search');

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
        const labels = await prisma.label.findMany({
            where: {
                accountId: account.id,
                ...(search ? {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                } : {})
            },
            include: {
                recipients: {
                    select: {
                        id: true,
                        name: true,
                        phoneNumber: true,
                    }
                }
            }
        });
        if (!labels) {
            return NextResponse.json({ error: 'Labels not found' }, { status: 404 });
        }
        return NextResponse.json(labels);
        
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, color } = body;

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

        const existingLabel = await prisma.label.findFirst({
            where: {
                name: name,
                accountId: account.id
            }
        });
        if (existingLabel) {
            return NextResponse.json({ error: 'Label with this name already exists' }, { status: 400 });
        }

        await prisma.label.create({
            data: {
                name: name,
                description: description,
                color: color,
                accountId: account.id
            }
        });
        return NextResponse.json({ message: 'Label created successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, description, color } = body;

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
                name: name,
                description: description,
                color: color
            }
        });
        
        return NextResponse.json({ message: 'Label updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession();
        if (!session?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Label ID is required' }, { status: 400 });
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

        await prisma.label.delete({
            where: {
                id: id,
                accountId: account.id
            }
        });

        return NextResponse.json({ message: 'Label removed from account successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}