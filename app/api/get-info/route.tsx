import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { getMaxContactsAccordingToPlan, getMaxFlowsAccordingToPlan } from "@/lib/subscription-utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.email as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        plans: true,
        whatsAppAccount: {
          select: {
            id: true,
            phoneNumbers: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
                phoneNumberId: true,
                isRegistered: true,
                codeVerificationStatus: true,
              },
            },
            status: true,
            businessVerificationStatus: true,
          }
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await checkIfPlanExpired(user.plans as any[], user.whatsAppAccount?.id);
    
    const userData = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      plans: user?.plans,
      whatsappAccount: {
        id: user?.whatsAppAccount?.id,
        status: user?.whatsAppAccount?.status,
        businessVerificationStatus: user?.whatsAppAccount?.businessVerificationStatus,
        phoneNumbers: user?.whatsAppAccount?.phoneNumbers,
        codeVerificationStatus: user?.whatsAppAccount?.phoneNumbers[0]?.codeVerificationStatus,
      },
    };

    return NextResponse.json({ userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

const checkIfPlanExpired = async (plans: any[], whatsAppAccountId?: string) => {
  if (!whatsAppAccountId) {
    return;
  }

  // Check if the primary plan is expired
  const primaryPlan = plans.find((plan: any) => plan.isAddOn === false);
  if (primaryPlan && new Date(primaryPlan.endDate) < new Date()) {
    await prisma.whatsAppRecipient.updateMany({
      where: {
        whatsAppAccountId: whatsAppAccountId,
      },
      data: {
        isDisabled: true,
      }
    })

    return true;
  }

  // Check if the contacts add ons are expired
  const contactsAddOn = plans.find((plan: any) => plan.name === "CONTACT");
  if (contactsAddOn && new Date(contactsAddOn.endDate) < new Date()) {
    // Remove the contacts add on from the plans
    const fillteredPlans = plans.filter((plan: any) => plan.name !== "CONTACT");
    await prisma.user.update({
      where: {
        whatsAppAccountId: whatsAppAccountId,
      },
      data: {
        plans: fillteredPlans,
        maxContacts: 0,
      }
    })

    const totalContacts = await prisma.whatsAppRecipient.count({
      where: {
        whatsAppAccountId: whatsAppAccountId,
      },
    });

    const maxContactsAccordingToPlan = getMaxContactsAccordingToPlan(primaryPlan?.name as string);

    if (!maxContactsAccordingToPlan) return;

    const maxContacts = maxContactsAccordingToPlan;

    if (totalContacts >= maxContacts) {
      const invalidContacts = totalContacts - maxContacts;

      // Get the contacts to disable, ordered by creation date (oldest first)
      const contactsToDisable = await prisma.whatsAppRecipient.findMany({
        where: {
          whatsAppAccountId: whatsAppAccountId,
          isDisabled: false,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: invalidContacts,
        select: {
          id: true,
        },
      });

      // Disable the selected contacts
      await prisma.whatsAppRecipient.updateMany({
        where: {
          id: {
            in: contactsToDisable.map(contact => contact.id),
          },
        },
        data: {
          isDisabled: true,
        },
      })

      return true;
    }
  }

  // Check if the flow add ons are expired
  const flowAddOn = plans.find((plan: any) => plan.name === "FLOW");
  if (flowAddOn && new Date(flowAddOn.endDate) < new Date()) {
    // Remove the flow add on from the plans
    const fillteredPlans = plans.filter((plan: any) => plan.name !== "FLOW");
    await prisma.user.update({
      where: {
        whatsAppAccountId: whatsAppAccountId,
      },
      data: {
        plans: fillteredPlans,
        maxFlows: 0,
      }
    })

    const totalFlows = await prisma.whatsAppFlow.count({
      where: {
        accountId: whatsAppAccountId,
      },
    });

    const maxFlowsAccordingToPlan = getMaxFlowsAccordingToPlan(primaryPlan?.name as string);

    if (!maxFlowsAccordingToPlan) return;

    const maxFlows = maxFlowsAccordingToPlan;

    if (totalFlows >= maxFlows) {
      const invalidFlows = totalFlows - maxFlows;

      // Get the flows to disable, ordered by creation date (oldest first)
      const flowsToDisable = await prisma.whatsAppFlow.findMany({
        where: {
          accountId: whatsAppAccountId,
          isDisabled: false,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: invalidFlows,
        select: {
          id: true,
        },
      });

      // Disable the selected flows
      await prisma.whatsAppFlow.updateMany({
        where: {
          id: {
            in: flowsToDisable.map(flow => flow.id),
          },
        },
        data: {
          isDisabled: true,
        },
      })

      return true;
    }
  }

  return false;
}