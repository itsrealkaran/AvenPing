# Flow Runner System

This document explains how the WhatsApp Flow Runner system works and how to use it.

## Overview

The Flow Runner is an automated system that executes WhatsApp message flows based on incoming messages. It uses Redis to maintain session state and can handle complex multi-step flows with user interactions.

## Architecture

### Components

1. **FlowRunner Class** (`lib/flow-runner.ts`)
   - Main orchestrator for flow execution
   - Manages Redis sessions
   - Handles message processing and flow triggering

2. **Redis Session Management**
   - Stores active flow sessions with 15 minute TTL
   - Tracks current step for each user-recipient pair
   - Enables conversation continuity

3. **Webhook Integration** (`app/api/whatsapp/messages/webhook/route.ts`)
   - Automatically processes incoming messages
   - Triggers flow execution based on message content
   - Handles both new conversations and existing sessions

## Flow Structure

### Flow JSON Format

```json
{
  "id": "1750792206272",
  "name": "Test",
  "status": "active",
  "date": "2025-06-24T19:10:06.272Z",
  "triggers": ["testing", "test"],
  "steps": [
    {
      "id": "1750791963173",
      "type": "MessageAction",
      "message": "Choose one reply?",
      "buttons": [
        {
          "label": "message",
          "next": "1750791983386"
        },
        {
          "label": "image1",
          "next": "1750791978085"
        }
      ],
      "position": { "x": 0, "y": 0 }
    },
    {
      "id": "1750791978085",
      "type": "ImageMessage",
      "file": "https://example.com/image.jpg",
      "message": "Here's your image",
      "next": "1750792159035",
      "position": { "x": 0, "y": 0 }
    }
  ]
}
```

### Step Types

1. **MessageAction**
   - Sends a message with interactive buttons
   - **Stops execution** and waits for user response
   - Only step type that requires user interaction

2. **ImageMessage**
   - Sends an image with optional caption
   - Continues to next step automatically

3. **VideoMessage**
   - Sends a video with optional caption
   - Continues to next step automatically

4. **AudioMessage**
   - Sends an audio file
   - Continues to next step automatically

5. **DocumentMessage**
   - Sends a document/file
   - Continues to next step automatically

6. **TemplateMessage**
   - Sends a WhatsApp template message
   - Continues to next step automatically

7. **ConnectFlowAction**
   - Connects to another flow
   - Continues to next step automatically

## How It Works

### 1. Message Reception
When a message arrives via webhook:
1. System checks if recipient exists in database
2. Creates recipient if new
3. Saves message to database
4. Triggers flow processing

### 2. Flow Triggering
For each incoming message:
1. Check Redis for existing session
2. If session exists → continue flow
3. If no session → check for trigger keywords
4. If trigger matches → start new flow

### 3. Flow Execution
1. **Start Flow**: Execute first step, create session
2. **Continue Flow**: Execute next step based on current session
3. **Wait for Response**: Stop at MessageAction steps
4. **Handle Button Clicks**: Match user response to button labels
5. **End Flow**: When no more steps or explicit end

### 4. Session Management
- **Redis Key**: `flow_session:{userId}:{recipientId}`
- **TTL**: 24 hours
- **Data**: Current step ID, flow ID, timestamps

## Usage Examples

### Basic Flow Execution

```typescript
import { flowRunner } from '@/lib/flow-runner';

// Process incoming message
await flowRunner.processMessage(
  'user123',           // User ID
  'recipient456',      // Recipient ID
  'testing',           // Message content
  'phoneNumber789'     // Phone number ID
);
```

### Manual Session Management

```typescript
// Get current session
const session = await flowRunner.getFlowSession('user123', 'recipient456');

// Save session
await flowRunner.saveFlowSession(session);

// Delete session
await flowRunner.deleteFlowSession('user123', 'recipient456');
```

## Database Schema

### WhatsAppFlow Table
```sql
CREATE TABLE "WhatsAppFlow" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "trigger" TEXT NOT NULL,           -- JSON array of trigger keywords
  "automationJson" JSON[] NOT NULL,  -- Array of flow steps
  "recipientArray" JSON[] NOT NULL,  -- Array of recipients
  "status" TEXT NOT NULL DEFAULT 'INACTIVE',
  "accountId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id")
);
```

## API Endpoints

### GET /api/whatsapp/flow
- Get all flows for the authenticated user

### POST /api/whatsapp/flow
- Create a new flow
- Body: `{ name, trigger, automationJson, status }`

### PUT /api/whatsapp/flow
- Update an existing flow
- Body: `{ id, name, trigger, automationJson, status }`

### DELETE /api/whatsapp/flow
- Delete a flow
- Body: `{ id }`

## Environment Variables

```env
# Redis connection
REDIS_URL=redis://localhost:6379

# WhatsApp API
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_token
```

## Error Handling

The flow runner includes comprehensive error handling:
- Invalid flow data
- Missing recipients
- WhatsApp API failures
- Redis connection issues
- Database errors

All errors are logged but don't break the flow execution.

## Testing

Use the example script to test the flow runner:

```typescript
import { demonstrateFlowRunner } from '@/lib/flow-runner-example';

// Run demonstration
await demonstrateFlowRunner();
```

## Flow Builder Integration

The flow builder (`components/flows/flow-builder.tsx`) creates flows in the correct format:

```typescript
// Save flow from builder
const flowJson = buildFlowJson({
  nodes,
  edges,
  flowId,
  flowName,
  status,
  date
});

// Send to API
await fetch('/api/whatsapp/flow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: flowJson.name,
    trigger: JSON.stringify(flowJson.triggers),
    automationJson: flowJson.steps,
    status: 'ACTIVE'
  })
});
```

## Best Practices

1. **Trigger Keywords**: Use specific, unique keywords
2. **Button Labels**: Make them clear and distinct
3. **Flow Length**: Keep flows under 10 steps for better UX
4. **Error Handling**: Always provide fallback messages
5. **Testing**: Test flows thoroughly before activation
6. **Monitoring**: Monitor flow performance and user engagement

## Troubleshooting

### Common Issues

1. **Flow not triggering**
   - Check trigger keywords match exactly
   - Verify flow status is 'ACTIVE'
   - Check Redis connection

2. **Session not persisting**
   - Verify Redis is running
   - Check session TTL settings
   - Review session key format

3. **Messages not sending**
   - Check WhatsApp API credentials
   - Verify phone number registration
   - Review message format

4. **Button responses not working**
   - Ensure button labels match exactly
   - Check case sensitivity
   - Verify next step IDs exist

### Debug Mode

Enable debug logging:

```typescript
// Add to flow-runner.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Flow execution:', { step, session, message });
}
``` 