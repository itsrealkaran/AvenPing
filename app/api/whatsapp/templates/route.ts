import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        const user = await getSession();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const whatsappAccount = await prisma.whatsAppAccount.findUnique({
            where: {
                id: id,
            },
        });

        if (!whatsappAccount) {
            return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
        }

        const templates = await axios.get(`https://graph.facebook.com/v22.0/${whatsappAccount.wabaid}/message_templates&access_token=${whatsappAccount.accessToken}`);

        return NextResponse.json(templates.data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to get templates", message: error }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const user = await getSession();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const whatsappAccount = await prisma.whatsAppAccount.findUnique({
            where: {
                id: id,
            },
        });

        if (!whatsappAccount) {
            return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
        }

        const template = await axios.post(`https://graph.facebook.com/v22.0/${whatsappAccount.wabaid}/message_templates&access_token=${whatsappAccount.accessToken}`, body);

        return NextResponse.json(template.data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create template", message: error }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const user = await getSession();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const whatsappAccount = await prisma.whatsAppAccount.findUnique({
            where: {
                id: id,
            },
        });
        
        if (!whatsappAccount) {
            return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
        }

        const template = await axios.delete(`https://graph.facebook.com/v22.0/${whatsappAccount.wabaid}/message_templates&access_token=${whatsappAccount.accessToken}`, {
            data: body,
        });

        return NextResponse.json(template.data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete template", message: error }, { status: 500 });
    }
}
