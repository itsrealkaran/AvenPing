import Redis from 'ioredis';
import { prisma } from './prisma';
import { storeWhatsAppMessage } from './store-message';

// Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('connect', () => {
  console.log('Redis connected');
});
redis.on('error', (error) => {
  console.error('Redis error:', error);
});

// Flow Session Interface
export interface FlowSession {
  userId: string;
  recipientId: string;
  flowId: string;
  currentStepId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Flow Step Interface
export interface FlowStep {
  id: string;
  type: string;
  file?: string;
  message?: string;
  next?: string | null;
  link?: string;
  buttons?: { label: string; next: string | null }[];
  flowId?: string;
  phoneNumber?: string;
  position: { x: number; y: number };
}

// Flow Interface
export interface Flow {
  id: string;
  name: string;
  status: string;
  date: string;
  triggers: string[];
  steps: FlowStep[];
}

// Message Interface
export interface IncomingMessage {
  id: string;
  from: string;
  text: string;
  timestamp: number;
  type: string;
}

// Flow Runner Class
export class FlowRunner {
  private redis: Redis;

  constructor() {
    this.redis = redis;
  }

  // Generate session key for Redis
  private getSessionKey(userId: string, recipientId: string): string {
    return `flow_session:${userId}:${recipientId}`;
  }

  // Get flow session from Redis
  async getFlowSession(userId: string, recipientId: string): Promise<FlowSession | null> {
    try {
      const sessionKey = this.getSessionKey(userId, recipientId);
      const sessionData = await this.redis.get(sessionKey);
      
      if (!sessionData) return null;
      
      const session: FlowSession = JSON.parse(sessionData);
      return {
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
      };
    } catch (error) {
      console.error('Error getting flow session:', error);
      return null;
    }
  }

  // Save flow session to Redis
  async saveFlowSession(session: FlowSession): Promise<void> {
    try {
      const sessionKey = this.getSessionKey(session.userId, session.recipientId);
      await this.redis.setex(sessionKey, 900, JSON.stringify(session)); // 15 minutes TTL
    } catch (error) {
      console.error('Error saving flow session:', error);
    }
  }

  // Delete flow session from Redis
  async deleteFlowSession(userId: string, recipientId: string): Promise<void> {
    try {
      const sessionKey = this.getSessionKey(userId, recipientId);
      await this.redis.del(sessionKey);
    } catch (error) {
      console.error('Error deleting flow session:', error);
    }
  }

  // Check if message matches any trigger keywords
  private matchesTrigger(message: string, triggers: string[]): boolean {
    const normalizedMessage = message.toLowerCase().trim();
    return triggers.some(trigger => 
      normalizedMessage.includes(trigger.toLowerCase())
    );
  }

  // Find flow by trigger keywords
  async findFlowByTrigger(userId: string, message: string): Promise<Flow | null> {
    try {
      const flows = await prisma.whatsAppFlow.findMany({
        where: {
          account: {
            user: {
              id: userId
            }
          },
          status: 'ACTIVE'
        }
      });

      for (const flow of flows) {
          const triggers = flow.triggers ? flow.triggers : [];
          console.log("flow.automationJson", flow.automationJson);
         if (this.matchesTrigger(message, triggers)) {
           return {
             id: flow.id,
             name: flow.name,
             status: flow.status,
             date: flow.createdAt.toISOString(),
             triggers,
             steps: (flow.automationJson as unknown) as FlowStep[]
           };
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding flow by trigger:', error);
      return null;
    }
  }

  // Send support message to agent
  private async sendSupportMessage(
    phoneNumberId: string,
    supportPhoneNumber: string,
    supportType: string,
    customerPhoneNumber: string,
    userId: string
  ): Promise<boolean> {
    try {
      // Get customer details
      const customer = await prisma.whatsAppRecipient.findFirst({
        where: {
          phoneNumber: customerPhoneNumber,
          whatsAppPhoneNumberId: phoneNumberId
        }
      });

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      const customerName = customer?.name || 'Unknown Customer';
      const templateName = supportType === 'CallSupport' ? 'call_support_alert' : 'whatsapp_support_alert';

      // Prepare template parameters (only 2 parameters needed)
      const templateParams = [
        customerName,
        customerPhoneNumber
      ];

      // Send template message to support agent
      const success = await this.sendTemplateMessage(
        phoneNumberId,
        supportPhoneNumber,
        templateName,
        templateParams
      );

      return success;
    } catch (error) {
      console.error('Error sending support message:', error);
      return false;
    }
  }

  // Send template message via WhatsApp API
  private async sendTemplateMessage(
    phoneNumberId: string,
    recipientPhoneNumber: string,
    templateName: string,
    parameters: string[]
  ): Promise<boolean> {
    try {
      // Get account details
      const phoneNumber = await prisma.whatsAppPhoneNumber.findUnique({
        where: { id: phoneNumberId },
        include: {
          account: true
        }
      });

      if (!phoneNumber) {
        console.error('Phone number not found');
        return false;
      }

      // Prepare template message data
      const messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en'
          },
          components: [
            {
              type: 'body',
              parameters: parameters.map(param => ({
                type: 'text',
                text: param
              }))
            }
          ]
        }
      };

      console.log("Template message data:", messageData);

      // Send via WhatsApp API
      const response = await fetch(
        `https://graph.facebook.com/v23.0/${phoneNumber.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${phoneNumber.account.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        console.error('WhatsApp API error:', result);
        return false;
      }

      // Save message to database
      const recipient = await prisma.whatsAppRecipient.findFirst({
        where: {
          phoneNumber: recipientPhoneNumber,
          whatsAppPhoneNumberId: phoneNumberId
        }
      });

      if (recipient) {
        await prisma.whatsAppMessage.create({
          data: {
            wamid: result.messages?.[0]?.id,
            status: 'SENT',
            message: `Template: ${templateName}`,
            isOutbound: true,
            phoneNumber: recipientPhoneNumber,
            whatsAppPhoneNumberId: phoneNumberId,
            recipientId: recipient.id
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error sending template message:', error);
      return false;
    }
  }

  // Send message via WhatsApp API
  private async sendWhatsAppMessage(
    phoneNumberId: string,
    recipientPhoneNumber: string,
    message: string,
    mediaUrl?: string,
    mediaType?: string,
    buttons?: { label: string; next: string | null }[]
  ): Promise<boolean> {
    try {
      // Get account details
      const phoneNumber = await prisma.whatsAppPhoneNumber.findUnique({
        where: { id: phoneNumberId },
        include: {
          account: true
        }
      });

      if (!phoneNumber) {
        console.error('Phone number not found');
        return false;
      }

      // Prepare message data
      let messageData: any;
      
      if (mediaUrl && mediaType) {
        // Media message
        messageData = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhoneNumber,
          type: mediaType,
          [mediaType]: {
            id: mediaUrl,
            caption: message
          }
        };
      } else if (buttons && buttons.length > 0) {
        messageData = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhoneNumber,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: message
            },
            action: {
              buttons: buttons.map(button => ({
                type: 'reply',
                reply: { id: button.next, title: button.label }
              }))
            }
          }
        };
      } else {
        // Text message
        messageData = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhoneNumber,
          type: 'text',
          text: {
            body: message
          }
        };
      }
      console.log("messageData", messageData);
      // Send via WhatsApp API
      const response = await fetch(
        `https://graph.facebook.com/v23.0/${phoneNumber.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${phoneNumber.account.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        console.error('WhatsApp API error:', result);
        return false;
      }

      // Save message to database
      const recipient = await prisma.whatsAppRecipient.findFirst({
        where: {
          phoneNumber: recipientPhoneNumber,
          whatsAppPhoneNumberId: phoneNumberId
        }
      });

      if (recipient) {
        // await storeWhatsAppMessage({
        //     wamid: result.messages?.[0]?.id,
        //     status: 'SENT',
        //     message,
        //     isOutbound: true,
        //     phoneNumber: recipientPhoneNumber,
        //     whatsAppPhoneNumberId: phoneNumberId,
        //     recipientId: recipient.id,
        //     mediaIds: mediaUrl ? [mediaUrl] : [],
        //     timestamp: Date.now()
        // })
        await prisma.whatsAppMessage.create({
          data: {
            wamid: result.messages?.[0]?.id,
            status: 'SENT',
            message,
            isOutbound: true,
            phoneNumber: recipientPhoneNumber,
            whatsAppPhoneNumberId: phoneNumberId,
            recipientId: recipient.id,
            mediaIds: mediaUrl ? [mediaUrl] : [],
            interactiveJson: buttons ? buttons.map(button => ({
              type: 'button',
              label: button.label
            })) : undefined
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  // Execute a single step
  private async executeStep(
    step: FlowStep,
    recipientPhoneNumber: string,
    phoneNumberId: string,
    userId: string,
    recipientId: string,
  ): Promise<{ success: boolean; shouldWait?: boolean }> {
    try {
      switch (step.type) {
        case 'ImageMessage':
        case 'VideoMessage':
        case 'AudioMessage':
        case 'DocumentMessage':
          const message = step.message || '';
          const mediaUrl = step.file || '';
          const mediaType = step.type.replace('Message', '').toLowerCase();
          
          const success = await this.sendWhatsAppMessage(
            phoneNumberId,
            recipientPhoneNumber,
            message,
            mediaUrl || undefined,
            mediaType
          );
          
          return { success };

        case 'MessageAction':
          // Send message with buttons and wait for response
          const actionSuccess = await this.sendWhatsAppMessage(
            phoneNumberId,
            recipientPhoneNumber,
            step.message || '',
            undefined,
            undefined,
            step.buttons || []
          );

          if (step.buttons && step.buttons.length === 0) {
            return { success: actionSuccess, shouldWait: false };
          }

          return { success: actionSuccess, shouldWait: true };

        case 'ConnectFlowAction':
          // Handle flow connection (could trigger another flow)
          console.log('ConnectFlowAction executed:', step.flowId);
          const flow = await prisma.whatsAppFlow.findUnique({
            where: { id: step.flowId }
          });
          console.log("flow from ConnectFlowAction", JSON.stringify(flow, null, 2))
          if (flow) {
            const updatedFlow = {
              ...flow,
              steps: (flow.automationJson as unknown) as FlowStep[]
            }
            await this.startFlow(userId, recipientId, updatedFlow, recipientPhoneNumber, phoneNumberId);
            return { success: true };
          }
          return { success: false };

        case 'CallSupport':
        case 'WhatsAppSupport':
          // Handle support nodes - send template message to support agent
          const supportSuccess = await this.sendSupportMessage(
            phoneNumberId,
            step.phoneNumber || '',
            step.type,
            recipientPhoneNumber,
            userId
          );
          return { success: supportSuccess };

        default:
          console.warn('Unknown step type:', step.type);
          return { success: false };
      }
    } catch (error) {
      console.error('Error executing step:', error);
      return { success: false };
    }
  }

  // Process incoming message and execute flow
  async processMessage(
    userId: string,
    recipientId: string,
    message: string,
    phoneNumberId: string
  ): Promise<void> {
    try {
      // Get recipient details
      const recipient = await prisma.whatsAppRecipient.findUnique({
        where: { id: recipientId }
      });

      if (!recipient) {
        console.error('Recipient not found');
        return;
      }

      // Check for existing flow session
      const session = await this.getFlowSession(userId, recipientId);
      
      if (session) {
        // Continue existing flow
        await this.continueFlow(session, message, recipient.phoneNumber, phoneNumberId);
      } else {
        // Check for new flow trigger
        const flow = await this.findFlowByTrigger(userId, message);
        console.log("Flow found:", flow);
        
        if (flow) {
          // Start new flow
          await this.startFlow(userId, recipientId, flow, recipient.phoneNumber, phoneNumberId);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  // Start a new flow
  private async startFlow(
    userId: string,
    recipientId: string,
    flow: any,
    recipientPhoneNumber: string,
    phoneNumberId: string
  ): Promise<void> {
    try {
      // Create new session
      const session: FlowSession = {
        userId,
        recipientId,
        flowId: flow.id,
        currentStepId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Execute first step
      if (flow.steps.length > 0) {
        const firstStep = flow.steps[0].steps[0];
        session.currentStepId = firstStep.id;
        console.log("First step:", firstStep);
        
        const result = await this.executeStep(firstStep, recipientPhoneNumber, phoneNumberId, userId, recipientId);
        console.log("Result:", result);
        
        if (result.success) {
          // Update session with next step
          if (firstStep.next && !result.shouldWait) {
            session.currentStepId = firstStep.next;
          }
          
          await this.saveFlowSession(session);
          
          // Continue executing steps until we hit a MessageAction
          if (!result.shouldWait) {
            await this.continueFlowExecution(session, recipientPhoneNumber, phoneNumberId, userId, recipientId);
          }
        }
      }
    } catch (error) {
      console.error('Error starting flow:', error);
    }
  }

  // Continue existing flow
  private async continueFlow(
    session: FlowSession,
    message: string,
    recipientPhoneNumber: string,
    phoneNumberId: string
  ): Promise<void> {
    try {
      // Get flow details
      const flow = await prisma.whatsAppFlow.findUnique({
        where: { id: session.flowId }
      });

      if (!flow) {
        console.error('Flow not found');
        await this.deleteFlowSession(session.userId, session.recipientId);
        return;
      }

      //@ts-expect-error - Facebook SDK
      const flowSteps = (flow.automationJson[0]?.steps as unknown) as FlowStep[];
      const currentStep = flowSteps.find(step => step.id === session.currentStepId);

      if (!currentStep) {
        console.error('Current step not found');
        await this.deleteFlowSession(session.userId, session.recipientId);
        return;
      }

      // Handle MessageAction response
      if (currentStep.type === 'MessageAction' && currentStep.buttons) {
        const buttonIndex = currentStep.buttons.findIndex(button => 
          message.toLowerCase().includes(button.label.toLowerCase())
        );

        if (buttonIndex !== -1) {
          const selectedButton = currentStep.buttons[buttonIndex];
          
          if (selectedButton.next) {
            session.currentStepId = selectedButton.next;
            session.updatedAt = new Date();
            
            await this.saveFlowSession(session);
            await this.continueFlowExecution(session, recipientPhoneNumber, phoneNumberId, session.userId, session.recipientId);
          } else {
            // End of flow
            await this.deleteFlowSession(session.userId, session.recipientId);
          }
        } else {
          // Invalid response, send error message or repeat options
          await this.sendWhatsAppMessage(
            phoneNumberId,
            recipientPhoneNumber,
            'Please select a valid option from the buttons above.'
          );
        }
      }
    } catch (error) {
      console.error('Error continuing flow:', error);
    }
  }

  // Continue flow execution until hitting a MessageAction
  private async continueFlowExecution(
    session: FlowSession,
    recipientPhoneNumber: string,
    phoneNumberId: string,
    userId: string,
    recipientId: string
  ): Promise<void> {
    try {
      const flow = await prisma.whatsAppFlow.findUnique({
        where: { id: session.flowId }
      });
      console.log("flow from continueFlowExecution", flow)

      if (!flow) return;

      //@ts-expect-error - Facebook SDK
      const flowSteps = (flow.automationJson[0]?.steps as unknown) as FlowStep[];
      
      while (session.currentStepId) {
        console.log("session.currentStepId", session.currentStepId)
        console.log("flowSteps", flowSteps)
        const currentStep = flowSteps.find(step => step.id === session.currentStepId);
        console.log("currentStep", currentStep)
        if (!currentStep) break;

        const result = await this.executeStep(currentStep, recipientPhoneNumber, phoneNumberId, userId, recipientId);
        
        if (!result.success) break;

        if (result.shouldWait) {
          // Stop execution and wait for user response
          session.updatedAt = new Date();
          await this.saveFlowSession(session);
          break;
        }

        // Move to next step
        if (currentStep.next) {
          session.currentStepId = currentStep.next;
          session.updatedAt = new Date();
        } else {
          // End of flow
          session.currentStepId = null;
          session.updatedAt = new Date();
          await this.saveFlowSession(session);
          await this.deleteFlowSession(session.userId, session.recipientId);
          break;
        }
      }
    } catch (error) {
      console.error('Error continuing flow execution:', error);
    }
  }

  // Clean up expired sessions
  async cleanupExpiredSessions(): Promise<void> {
    try {
      // This would typically be done with a scheduled job
      // For now, we'll rely on Redis TTL
      console.log('Session cleanup completed');
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
    }
  }
}

// Export singleton instance
export const flowRunner = new FlowRunner();
