import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { validateFlowLimit } from "@/lib/subscription-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const phoneNumberId = searchParams.get("phoneNumberId") as string;

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const flows = await prisma.whatsAppFlow.findMany({
      where: {
        accountId: user.whatsAppAccount.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(flows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const { name, triggers, automationJson, status = "INACTIVE" } = body;
    
    // Ensure status is uppercase to match FlowStatus enum
    const normalizedStatus = status?.toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE";

    // Validate required fields
    if (!name || !triggers || !automationJson) {
      console.log("Missing required fields:", { name: !!name, triggers: !!triggers, automationJson: !!automationJson });
      return NextResponse.json({ 
        error: "Missing required fields: name, triggers, and automationJson are required" 
      }, { status: 400 });
    }

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    // Get current count of active flows
    const totalFlows = await prisma.whatsAppFlow.count({
      where: {
        accountId: session.whatsAppAccountId as string,
        isDisabled: false
      },
    });

    // Validate flow limit using utility function
    const validation = await validateFlowLimit(session, user, totalFlows);
    
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const existingFlows = await prisma.whatsAppFlow.findMany({
      where: {
        accountId: user.whatsAppAccount.id,
      },
    });
    
    // Check for trigger conflicts
    const hasTriggerConflict = existingFlows.some(flow => {
      return flow.automationJson.some((automation: any) => {
        if (automation.triggers && Array.isArray(automation.triggers)) {
          return automation.triggers.some((existingTrigger: string) => 
            triggers.includes(existingTrigger)
          );
        }
        return false;
      });
    });
    
    if (hasTriggerConflict) {
      console.log("Trigger conflict detected:", { triggers, existingFlows: existingFlows.map(f => f.automationJson) });
      return NextResponse.json({ error: "One or more triggers already exist in another flow" }, { status: 400 });
    }

    const flow = await prisma.whatsAppFlow.create({
      data: {
        name,
        triggers,
        automationJson,
        recipientArray: [],
        status: normalizedStatus,
        accountId: user.whatsAppAccount.id,
      },
    });

    console.log("Flow created successfully:", flow.id);
    return NextResponse.json(flow);
  } catch (error) {
    console.error("Error in POST /api/whatsapp/flow:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, triggers, automationJson, status } = await req.json();

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const currentFlow = await prisma.whatsAppFlow.findUnique({
      where: {
        id,
      },
    });
    
    if (currentFlow?.isDisabled) {
      return NextResponse.json({ error: "Flow is disabled" }, { status: 400 });
    }

    const existingFlows = await prisma.whatsAppFlow.findMany({
      where: {
        accountId: user.whatsAppAccount.id,
      },
    });

    // Check for existing triggers with proper null/undefined checks
    // Exclude the current flow being updated from conflict check
    if (triggers && Array.isArray(triggers)) {
      const hasConflict = existingFlows.some(flow => {
        // Skip checking the current flow being updated
        if (id && flow.id === id) {
          return false;
        }
        
        // Check the direct triggers array first
        if (flow.triggers && Array.isArray(flow.triggers)) {
          return flow.triggers.some((existingTrigger: string) => 
            triggers.some((newTrigger: string) => 
              existingTrigger === newTrigger
            )
          );
        }
        
        // Also check automationJson triggers if they exist
        if (flow.automationJson && Array.isArray(flow.automationJson)) {
          return flow.automationJson.some((automation: any) => {
            if (automation && automation.triggers && Array.isArray(automation.triggers)) {
              return automation.triggers.some((existingTrigger: string) => 
                triggers.some((newTrigger: string) => 
                  existingTrigger === newTrigger
                )
              );
            }
            return false;
          });
        }
        
        return false;
      });

      if (hasConflict) {
        console.log("Trigger conflict detected, returning 400");
        return NextResponse.json({ error: "Trigger already exists" }, { status: 400 });
      }
      
      console.log("No trigger conflicts found");
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (triggers !== undefined) updateData.triggers = triggers;
    if (automationJson !== undefined) updateData.automationJson = automationJson;
    if (status !== undefined) {
      // Ensure status is uppercase to match FlowStatus enum
      updateData.status = status?.toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE";
    }

    const flow = await prisma.whatsAppFlow.update({
      where: { 
        id,
        accountId: user.whatsAppAccount.id, // Ensure user can only update their own flows
      },
      data: updateData,
    });

    return NextResponse.json(flow);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const flow = await prisma.whatsAppFlow.delete({
      where: { 
        id,
        accountId: user.whatsAppAccount.id, // Ensure user can only delete their own flows
      },
    });

    return NextResponse.json(flow);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}