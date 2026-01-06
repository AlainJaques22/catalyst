# Slack Connector Implementation Plan

## Overview
Build a Slack connector for Catalyst that allows Camunda BPMN processes to send messages to Slack channels and users. This will use the Connector Builder tool to auto-generate all required files.

## Connector Requirements

### Features (v1 - Simple Scope)
- Send message to Slack channel (by ID or #name)
- Send direct message to user (by user ID)
- Support Slack markdown formatting (bold, italic, links, code blocks)
- Process variable substitution using ${variableName} syntax

### Future Enhancements (NOT in v1)
- Thread reply support (thread_ts parameter)
- Custom bot username per message
- Slack Block Kit for rich formatting (buttons, images, etc.)

### Slack API Details
- **Endpoint**: POST https://slack.com/api/chat.postMessage
- **Authentication**: Bearer token (Bot User OAuth Token stored in n8n)
- **Required Scopes**: `chat:write`, `chat:write.public`
- **Key Parameters**:
  - `channel` - Channel ID (e.g., C1234567890) or name (e.g., #general)
  - `text` - Message text (supports Slack markdown: mrkdwn)
  - `thread_ts` (optional) - Thread timestamp for replies

## Implementation Workflow

### Step 1: Build n8n Workflow with Form Trigger
**File**: `slack-form.n8n.json` (temporary - for builder input)

Create workflow in n8n UI with these nodes:

1. **Form Trigger Node**
   - Form Title: "Slack Message"
   - Form Fields:
     - `channel` (String, required, placeholder: "#general or C1234567890")
     - `message` (Text Area, required, placeholder: "Your message here. Supports *bold*, _italic_, `code`")

2. **Validation Node** (Code node)
   - Validate channel is not empty
   - Validate message is not empty
   - Format channel name (ensure # prefix if not ID)

3. **Slack API Call** (HTTP Request node)
   - Method: POST
   - URL: https://slack.com/api/chat.postMessage
   - Authentication: Predefined Credential (Slack Bot OAuth Token)
   - Headers:
     - `Content-Type`: application/json; charset=utf-8
   - Body (JSON):
     ```json
     {
       "channel": "={{ $json.channel }}",
       "text": "={{ $json.message }}"
     }
     ```

4. **Response Formatting Node** (Code node)
   - Check if Slack response is ok
   - Extract messageId (ts field from Slack response)
   - Format standard Catalyst response:
     ```javascript
     {
       success: $json.ok,
       statusCode: $json.ok ? 200 : 400,
       responseBody: {
         messageId: $json.ts,
         channel: $json.channel
       },
       error: $json.ok ? null : $json.error
     }
     ```

5. **Form Completion Node**
   - Display success/error message
   - Show messageId on success

**Test the form version** in n8n before proceeding.

### Step 2: Export Form Workflow
- Export the working form workflow from n8n as `slack-form.n8n.json`
- Save to local computer for upload to Connector Builder

### Step 3: Use Connector Builder
**URL**: `packages/dashboard/connector-builder.html`

1. Open Connector Builder in browser
2. Upload `slack-form.n8n.json`
3. Builder will auto-detect:
   - **Inputs**: channel, message
   - **Outputs**: messageId, channel
4. Configure connector:
   - **Connector Name**: "Slack Message"
   - **Connector ID**: "slack" (auto-generated from name)
   - **Description**: "Send messages to Slack channels or users with markdown support"
5. Click "Generate Connector"
6. Download all generated files:
   - `slack.n8n.json` - Webhook version
   - `slack.element.json` - Camunda template
   - `slack.bpmn` - Example process
   - `README.md` - Documentation

### Step 4: Deploy Generated Files

#### 4a. Deploy n8n Webhook Workflow
1. Open n8n instance (http://localhost:5678)
2. Import `slack.n8n.json` (the webhook version)
3. Configure Slack credentials:
   - Add new Slack OAuth2 credential
   - Add Bot User OAuth Token
   - Scopes: `chat:write`, `chat:write.public`
4. **Activate** the workflow
5. Verify webhook is available at: `http://catalyst-n8n:5678/webhook/catalyst-slack`

#### 4b. Deploy Element Template
Copy `slack.element.json` to:
- **Bundled modeler**: `C:\Git Repos\catalyst-connector\modeler\resources\element-templates\slack.element.json`

#### 4c. Save Connector Files
Create directory and save all files:
```
C:\Git Repos\catalyst-connector\connectors\official\slack\
├── slack.n8n.json          (webhook version)
├── slack-form.n8n.json     (form version for testing)
├── slack.element.json      (element template)
├── slack.bpmn              (example process)
└── README.md               (documentation)
```

### Step 5: Test the Connector

1. **Open Camunda Modeler** (bundled version in `modeler/` directory)
2. **Restart modeler** to load new element template
3. **Open** `slack.bpmn` example process
4. **Verify** template is applied to Service Task
5. **Deploy** BPMN to Camunda (http://localhost:8080)
6. **Start process instance** in Camunda Cockpit
7. **Fill in form**:
   - Channel: #general (or test channel)
   - Message: "Test from Catalyst!"
8. **Verify** message appears in Slack
9. **Check** process variables: success, messageId, statusCode

### Step 6: Documentation Updates

#### Update README.md (if needed)
Add Slack-specific details:
- How to get Slack Bot Token (https://api.slack.com/apps)
- Required scopes and permissions
- Channel ID vs channel name format
- Thread reply examples
- Markdown formatting examples

## Critical Files

- **Connector Builder**: `C:\Git Repos\catalyst-connector\packages\dashboard\connector-builder.html`
- **n8n Instance**: http://localhost:5678
- **Camunda Modeler**: `C:\Git Repos\catalyst-connector\modeler\`
- **Element Templates Dir**: `C:\Git Repos\catalyst-connector\modeler\resources\element-templates\`
- **Connectors Dir**: `C:\Git Repos\catalyst-connector\connectors\official\slack\`
- **Spec Reference**: `C:\Git Repos\catalyst-connector\CONNECTOR_SPEC.md`

## Technical Constraints (from CONNECTOR_SPEC.md)

✅ **Must Do:**
- Use plain JSON with `${variableName}` syntax (NOT FEEL)
- Keep Slack Bot Token in n8n (NOT in Camunda)
- Use `type: "Text"` for multi-line fields
- Return standard response: `{success, statusCode, responseBody, error}`
- Webhook path: `catalyst-slack`
- Implementation class: `io.catalyst.bridge.CatalystBridge`

❌ **Must NOT:**
- Use FEEL expressions (`scriptFormat: "feel"`)
- Store API credentials in Camunda
- Use `type: "String"` for JSON payload fields

## Validation Checklist

Before marking complete:
- [ ] Form version tested in n8n and working
- [ ] Webhook version imported to n8n
- [ ] Slack credentials configured in n8n
- [ ] Webhook workflow activated in n8n
- [ ] Element template copied to modeler directory
- [ ] Example BPMN deploys successfully to Camunda
- [ ] Test message sent to Slack channel successfully
- [ ] Process variables (success, messageId) populated correctly
- [ ] All 4 files saved to `connectors/official/slack/`
- [ ] README documents Slack authentication setup
- [ ] No FEEL expressions in any file
- [ ] Webhook URL matches pattern: `catalyst-slack`

## Expected Output

### File Structure
```
connectors/official/slack/
├── slack.n8n.json          # Webhook workflow (production)
├── slack-form.n8n.json     # Form workflow (testing)
├── slack.element.json      # Camunda Modeler template
├── slack.bpmn              # Example BPMN process
└── README.md               # Documentation with Slack setup
```

### Payload Example (in BPMN)
```json
{
  "channel": "${slackChannel}",
  "message": "${slackMessage}"
}
```

### Output Variables
- `success` → `$.success` (Boolean)
- `statusCode` → `$.statusCode` (Number)
- `messageId` → `$.responseBody.messageId` (Slack message timestamp)
- `channel` → `$.responseBody.channel` (Channel where message was sent)
- `error` → `$.error` (Error message if failed)

### Slack Markdown Examples (in message text)
- **Bold**: `*bold text*`
- **Italic**: `_italic text_`
- **Code**: `` `code` `` or ``` ```multiline code``` ```
- **Links**: `<https://example.com|Link Text>`
- **Mentions**: `<@U1234567890>` (user) or `<!channel>` (everyone in channel)

## Notes

- The Connector Builder automates most of the manual work
- Form Trigger version is easier to test before converting to webhook
- Slack markdown (mrkdwn) is supported automatically in the `text` field
- Thread replies work by passing `thread_ts` parameter
- Direct messages work by using user ID as channel (e.g., U1234567890)
