import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { validateFlowLimit } from "@/lib/subscription-utils";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.email || !session.whatsAppAccountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { flowId } = await request.json();

    if (!flowId) {
      return NextResponse.json({ error: "Flow ID is required" }, { status: 400 });
    }

    // Get the current flow to check its status
    const currentFlow = await prisma.whatsAppFlow.findUnique({
      where: { id: flowId },
      select: { 
        id: true, 
        isDisabled: true,
        accountId: true 
      }
    });

    if (!currentFlow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }

    // Check if user has access to this flow's WhatsApp account
    if (currentFlow.accountId !== session.whatsAppAccountId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Toggle the disabled status (boolean field)
    const newDisabledStatus = !currentFlow.isDisabled;
    let updatedFlow: any;

    if (newDisabledStatus) {
      // Disabling a flow - no validation needed
      updatedFlow = await prisma.whatsAppFlow.update({
        where: { id: flowId },
        data: { isDisabled: newDisabledStatus },
        select: {
          id: true,
          name: true,
          triggers: true,
          automationJson: true,
          status: true,
          isDisabled: true,
          accountId: true,
          createdAt: true,
          updatedAt: true
        }
      });
    } else {
      // Enabling a flow - need to validate flow limits
      const user = await prisma.user.findUnique({
        where: {
          id: session.userId as string,
        },
      });
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
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

      // Update the flow status
      updatedFlow = await prisma.whatsAppFlow.update({
        where: { id: flowId },
        data: { isDisabled: newDisabledStatus },
        select: {
          id: true,
          name: true,
          triggers: true,
          automationJson: true,
          status: true,
          isDisabled: true,
          accountId: true,
          createdAt: true,
          updatedAt: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      flow: updatedFlow,
      message: `Flow ${newDisabledStatus ? 'disabled' : 'enabled'} successfully`
    });

  } catch (error) {
    console.error("Error toggling flow status:", error);
    return NextResponse.json(
      { error: "Failed to toggle flow status" },
      { status: 500 }
    );
  }
}
