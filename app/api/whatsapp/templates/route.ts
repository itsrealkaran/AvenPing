import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = await getSession();

        if (!user || !user.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const whatsappAccount = await prisma.whatsAppAccount.findFirst({
            where: {
                user: {
                    id: user.userId as string,
                },
            },
        });

        if (!whatsappAccount) {
            return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
        }

        const templates = await axios.get(`https://graph.facebook.com/v23.0/${whatsappAccount.wabaid}/message_templates`, {
            headers: {
                'Authorization': `Bearer ${whatsappAccount.accessToken}`,
            },
        });

        return NextResponse.json(templates.data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to get templates", message: error }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const user = await getSession();

        if (!user || !user.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const whatsappAccount = await prisma.whatsAppAccount.findFirst({
            where: {
                user: {
                    id: user.userId as string,
                },
            },
        });

        if (!whatsappAccount) {
            return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
        }

        const template = await axios.post(`https://graph.facebook.com/v23.0/${whatsappAccount.wabaid}/message_templates`, body, {
            headers: {
                'Authorization': `Bearer ${whatsappAccount.accessToken}`,
            },
        });

        return NextResponse.json(template.data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create template", message: error }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        const user = await getSession();

        if (!user || !user.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const whatsappAccount = await prisma.whatsAppAccount.findFirst({
            where: {
                user: {
                    id: user.userId as string,
                },
            },
        });

        if (!whatsappAccount) {
            return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
        }

        // Note: Facebook API doesn't support direct template updates
        // This would typically involve creating a new template version
        // For now, we'll return an error indicating this limitation
        return NextResponse.json({ 
            error: "Template updates are not supported by WhatsApp API. Please create a new template instead." 
        }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update template", message: error }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const names = searchParams.get('names');

        if (!names) {
            return NextResponse.json({ error: "Names are required" }, { status: 400 });
        }

        const user = await getSession();

        if (!user || !user.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const whatsappAccount = await prisma.whatsAppAccount.findFirst({
            where: {
                user: {
                    id: user.userId as string,
                },
            },
        });
        
        if (!whatsappAccount) {
            return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
        }

        for (const name of names.split(',')) {
            try {
            const template = await axios.delete(`https://graph.facebook.com/v23.0/${whatsappAccount.wabaid}/message_templates?name=${name}`, {
                headers: {
                    'Authorization': `Bearer ${whatsappAccount.accessToken}`,
                },
            });

            console.log(template.data, "template");
            } catch (error) {
                console.error(`Failed to delete template ${name}:`, error);
            }
        }

        return NextResponse.json({ message: "Templates deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete template", message: error }, { status: 500 });
    }
}
