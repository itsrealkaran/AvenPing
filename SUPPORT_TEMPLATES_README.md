# Support Templates System

This system automatically creates and manages WhatsApp message templates for support nodes in your flows.

## Overview

When users connect their WhatsApp Business account through the embedded login, the system automatically creates two support templates:

1. **`call_support_alert`** - Notifies agents when a customer needs a call
2. **`whatsapp_support_alert`** - Notifies agents when a customer needs WhatsApp support

## How It Works

### Automatic Creation During Onboarding

When a user connects their WhatsApp Business account via embedded login (`/api/whatsapp/route.ts`), the system:

1. Creates the WhatsApp account in the database
2. Automatically calls `ensureSupportTemplates(userId)`
3. Creates the support templates via WhatsApp Business API
4. Templates are submitted to Meta for approval

### Support Node Execution

When a flow contains support nodes (`CallSupport` or `WhatsAppSupport`):

1. Flow runner identifies the support type
2. Retrieves customer details (name, phone number)
3. Sends template message to the specified support agent
4. Template includes all necessary information for the agent

## Template Messages

### Call Support Template

```
Support Alert - Call Required

Hello! A customer needs support and requires a call.

Customer Name: {{1}}
Customer Phone: {{2}}
Action Required: Call

Please contact the customer as soon as possible.

AvenPing Support System
```

**Sample Text:**

- Customer Name: John Doe
- Customer Phone: +1234567890

### WhatsApp Support Template

```
Support Alert - WhatsApp Message Required

Hello! A customer needs support and requires a WhatsApp message.

Customer Name: {{1}}
Customer Phone: {{2}}
Action Required: WhatsApp Message

Please contact the customer as soon as possible.

AvenPing Support System
```

**Sample Text:**

- Customer Name: Jane Smith
- Customer Phone: +1987654321

## Components

### `SupportTemplatesSetup`

Full onboarding component with status checking and template creation.

```tsx
import { SupportTemplatesSetup } from "@/components/onboarding/support-templates-setup";

<SupportTemplatesSetup
  onComplete={(success) => {
    if (success) {
      // Proceed to next step
    }
  }}
  autoCreate={true} // Optional: auto-create if missing
/>;
```

### `SupportTemplatesStatus`

Compact status component for dashboard integration.

```tsx
import { SupportTemplatesStatus } from '@/components/onboarding/support-templates-status';

// Compact version
<SupportTemplatesStatus compact={true} />

// Full version with create button
<SupportTemplatesStatus showCreateButton={true} />
```

## API Endpoints

### `POST /api/whatsapp/create-support-templates`

Creates support templates for the authenticated user.

### `GET /api/whatsapp/create-support-templates`

Checks if support templates exist for the authenticated user.

## React Hook

### `useSupportTemplates`

Hook for managing support templates in React components.

```tsx
import { useSupportTemplates } from "@/hooks/use-support-templates";

const {
  createSupportTemplates,
  checkSupportTemplates,
  isCreating,
  isChecking,
} = useSupportTemplates();

// Create templates
await createSupportTemplates();

// Check if templates exist
const exist = await checkSupportTemplates();
```

## Flow Integration

### Adding Support Nodes to Flows

1. In the flow builder, drag a support node from the sidebar
2. Configure the support agent's phone number in node details
3. The flow runner will automatically use the appropriate template

### Support Node Types

- **CallSupport**: Sends `call_support_alert` template
- **WhatsAppSupport**: Sends `whatsapp_support_alert` template

## Error Handling

- Template creation failures don't break the onboarding process
- Failed template creation is logged but doesn't prevent WhatsApp account setup
- Users can manually create templates later using the components

## Template Approval

- Templates are submitted to Meta for approval
- Approval typically takes a few minutes to hours
- Users can check template status in their WhatsApp Business Manager
- Templates work immediately after approval

## Database Schema

The system uses existing WhatsApp account and message tables:

- `whatsAppAccount`: Stores user's WhatsApp Business account
- `whatsAppMessage`: Stores sent template messages
- Templates are managed via WhatsApp Business API, not stored locally

## Troubleshooting

### Templates Not Created

1. Check if WhatsApp account is properly connected
2. Verify access token is valid
3. Check console logs for API errors
4. Manually create templates using the components

### Templates Not Working

1. Verify templates are approved in WhatsApp Business Manager
2. Check template names match exactly: `call_support_alert`, `whatsapp_support_alert`
3. Ensure support agent's phone number is correct
4. Check flow runner logs for execution errors

### Manual Template Creation

If automatic creation fails, users can:

1. Use the `SupportTemplatesSetup` component
2. Call the API endpoint directly
3. Use the React hook in their own components

## Future Enhancements

- Template customization options
- Multiple template versions
- Support for different languages
- Template usage analytics
- Custom template creation UI
