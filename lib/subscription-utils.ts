
/* 
 * calculate the total contacts or flows according to the planName and quantity of addons
 * @param planName - planName of the user
 * @param quantity - quantity of addons
 * @returns total contacts or flows
 */
export function getTotalContactsOrFlows(planName: string, quantity: number) {
  if (planName === "CONTACT") {
    return { maxContacts: quantity * 1000 };
  } else if (planName === "FLOW") {
    return { maxFlows: quantity };
  }
  return null;
}

/*
  calculate the total contacts or flows according to the planName and quantity of addons
  @param planName - planName of the user
  @param quantity - quantity of addons
  @returns total contacts or flows
*/
export function getMaxContactsAccordingToPlan(planName: string) {
  if (planName === "BASIC") {
    return 1500;
  } else if (planName === "PREMIUM") {
    return 3000;
  } else if (planName === "ENTERPRISE") {
    return 6000;
  }
  return null;
}

/*
  calculate the total contacts or flows according to the planName and quantity of addons
  @param planName - planName of the user
  @param quantity - quantity of addons
  @returns total contacts or flows
*/
export function getMaxFlowsAccordingToPlan(planName: string) {
  if (planName === "BASIC") {
    return 0;
  } else if (planName === "PREMIUM") {
    return 3;
  } else if (planName === "ENTERPRISE") {
    return 5;
  }
  return null;
}

/**
 * Validates if enabling a contact would exceed the user's contact limit
 * @param session - User session object
 * @param user - User object from database
 * @param currentContactsCount - Current count of disabled contacts
 * @returns Object with validation result and error message if applicable
 */
export async function validateContactLimit(
  session: any,
  user: any,
  currentContactsCount: number
) {
  // Check if plan is expired
  const planExpired = (user.plans as any[]).find((plan: any) => plan.isAddOn === false)?.endDate;
  if (planExpired && new Date(planExpired) < new Date()) {
    return {
      isValid: false,
      error: "Plan expired",
      maxContacts: 0
    };
  }

  // Get max contacts according to plan
  const maxContactsAccordingToPlan = getMaxContactsAccordingToPlan(session.plan as string);
  if (maxContactsAccordingToPlan === null) {
    return {
      isValid: false,
      error: "Invalid plan",
      maxContacts: 0
    };
  }

  // Calculate total max contacts (plan + addons)
  const maxContacts = maxContactsAccordingToPlan + user.maxContacts;
  if (maxContacts === null) {
    return {
      isValid: false,
      error: "Invalid plan",
      maxContacts: 0
    };
  }

  // Check if enabling the contact would exceed the limit
  if (currentContactsCount >= maxContacts) {
    return {
      isValid: false,
      error: `Max contacts of ${maxContacts} reached, Buy more contacts addon if you want to add more contacts`,
      maxContacts
    };
  }

  return {
    isValid: true,
    error: null,
    maxContacts
  };
}

/**
 * Validates if creating a flow would exceed the user's flow limit
 * @param session - User session object
 * @param user - User object from database
 * @param currentFlowsCount - Current count of active flows
 * @returns Object with validation result and error message if applicable
 */
export async function validateFlowLimit(
  session: any,
  user: any,
  currentFlowsCount: number
) {
  // Check if plan is expired
  const planExpired = (user.plans as any[]).find((plan: any) => plan.isAddOn === false)?.endDate;
  if (planExpired && new Date(planExpired) < new Date()) {
    return {
      isValid: false,
      error: "Plan expired",
      maxFlows: 0
    };
  }

  // Get max flows according to plan
  const maxFlowsAccordingToPlan = getMaxFlowsAccordingToPlan(session.plan as string);
  if (maxFlowsAccordingToPlan === null) {
    return {
      isValid: false,
      error: "Invalid plan",
      maxFlows: 0
    };
  }

  // Calculate total max flows (plan + addons)
  const maxFlows = maxFlowsAccordingToPlan + user.maxFlows;
  if (maxFlows === null) {
    return {
      isValid: false,
      error: "Invalid plan",
      maxFlows: 0
    };
  }

  // Check if creating a flow would exceed the limit
  if (currentFlowsCount >= maxFlows) {
    return {
      isValid: false,
      error: `Max flows of ${maxFlows} reached, Buy more flows addon if you want to add more flows`,
      maxFlows
    };
  }

  return {
    isValid: true,
    error: null,
    maxFlows
  };
}