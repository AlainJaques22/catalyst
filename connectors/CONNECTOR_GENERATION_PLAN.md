# Catalyst Connector Auto-Generation Plan

## Executive Summary

Create an automated system to generate ~2,000+ Catalyst connectors from n8n's 303+ official node integrations, following a similar developer experience to n8n's `n8n-node` CLI tool.

---

## Part 1: Analysis Findings

### n8n Node Structure (Source)

**Repository:** `n8n-io/n8n` → `packages/nodes-base/nodes/`

**Organization:**
- 303 node directories (Slack, Google Sheets, Discord, etc.)
- Each node contains:
  - `{Node}.node.ts` - Main implementation (INodeType interface)
  - `{Node}.node.json` - Codex metadata file
  - `{Node}.credentials.ts` - Authentication definitions
  - Version subdirectories (`V1/`, `V2/`) for breaking changes
  - Optional trigger files (`{Node}Trigger.node.ts`)

**Node Definition Schema (INodeType):**
```typescript
{
  displayName: 'Slack',           // User-facing name
  name: 'slack',                  // Internal identifier
  icon: 'file:slack.svg',         // Icon reference
  group: ['transform'],           // Category
  version: 1,                     // Schema version
  description: '...',             // Long description
  defaults: { name: 'Slack' },    // Default node name
  inputs: ['main'],
  outputs: ['main'],
  credentials: [{ name: 'slackApi', required: true }],
  properties: [
    // Resource selection (e.g., "Channel", "Message", "User")
    // Operations per resource (e.g., "Send", "Update", "Delete")
    // Parameters per operation (e.g., "channel", "text", "attachments")
  ]
}
```

**Property Types:**
- `string` - Text input
- `number` - Numeric input
- `boolean` - Toggle/checkbox
- `options` - Dropdown select
- `fixedCollection` - Repeatable nested fields
- `collection` - Optional grouped fields
- `dateTime` - Date picker

**Conditional Display:**
```typescript
displayOptions: {
  show: {
    resource: ['message'],
    operation: ['send']
  }
}
```

### Catalyst Connector Structure (Target)

**Directory:** `connectors/integrations/{category}/{connector-name}/`

**Required Files (4):**
1. `{connector}.element.json` - Camunda element template
2. `{connector}.n8n.json` - n8n workflow definition
3. `{connector}.bpmn` - Example BPMN process
4. `README.md` - Documentation

**Optional Files:**
5. `connector.json` - Metadata for Studio gallery
6. `{connector}.html` - Interactive test page

**Element Template Structure:**
```json
{
  "$schema": "https://unpkg.com/@camunda/element-templates-json-schema/resources/schema.json",
  "name": "Catalyst - Slack Send Message",
  "id": "io.catalyst.template.slack-send-message",
  "appliesTo": ["bpmn:ServiceTask"],
  "groups": [
    { "id": "connection", "label": "Connection" },
    { "id": "input", "label": "Input" },
    { "id": "output", "label": "Output" }
  ],
  "properties": [
    // Implementation (hardcoded to CatalystBridge)
    // Webhook URL
    // Timeout
    // Input parameters (mapped from n8n operation parameters)
    // Payload template
    // Output mapping
  ]
}
```

---

## Part 2: Generation Strategy

### Strategy: One Connector Per Operation

**Rationale:** Instead of one Catalyst connector per n8n node (with all operations), create one connector per operation:
- `slack-send-message` (not just `slack`)
- `slack-update-message`
- `slack-add-reaction`
- etc.

**Benefits:**
- Simpler element templates (fewer parameters)
- Better UX (users pick specific action, not browse operations)
- Easier curation in Studio gallery
- More granular quality tiers

**Math:**
- 303 n8n nodes × ~5-10 operations average = ~2,000-3,000 connectors

### Three-Phase Approach

#### Phase A: Schema Extraction
Parse n8n node definitions to extract structured metadata.

**Input:** n8n-nodes-base package (npm or GitHub)
**Output:** JSON schema per operation

```json
{
  "node": "slack",
  "resource": "message",
  "operation": "send",
  "displayName": "Slack - Send Message",
  "description": "Send a message to a Slack channel",
  "icon": "slack.svg",
  "credentials": ["slackApi", "slackOAuth2Api"],
  "parameters": [
    {
      "name": "channel",
      "displayName": "Channel",
      "type": "string",
      "required": true,
      "description": "Channel to send message to"
    },
    {
      "name": "text",
      "displayName": "Message Text",
      "type": "string",
      "required": true,
      "description": "Message content"
    }
  ],
  "category": "communication",
  "tags": ["slack", "messaging", "chat"]
}
```

#### Phase B: Connector Generation
Transform extracted schemas into Catalyst connector files.

**Generator outputs per operation:**
1. Element template with mapped parameters
2. n8n workflow (webhook → node → response)
3. Example BPMN process
4. README documentation
5. Metadata JSON

#### Phase C: Quality Classification
Automatically classify generated connectors by quality tier.

**Tier 1 - Fully Automated (Target: 80%+):**
- Simple string/number/boolean parameters
- Single resource operations
- Standard authentication patterns

**Tier 2 - Needs Review (Target: 15%):**
- Complex nested objects (fixedCollection)
- Dynamic dropdown dependencies
- Multiple credential options

**Tier 3 - Manual Required (Target: 5%):**
- Trigger nodes (event-based)
- Binary data handling
- Multi-step workflows

---

## Part 3: CLI Tool Design

### Mirroring n8n's Developer Experience

Create `catalyst-connector` CLI similar to `n8n-node`:

```bash
# Interactive creation
npx catalyst-connector new

# Generate from n8n node
npx catalyst-connector generate slack --operation sendMessage

# Bulk generate
npx catalyst-connector generate-all --tier 1

# Validate connector
npx catalyst-connector lint slack-send-message

# Build (copy to modeler templates)
npx catalyst-connector build
```

### CLI Commands

| Command | Description |
|---------|-------------|
| `new` | Interactive scaffold for manual connector |
| `generate <node>` | Generate connector from n8n node schema |
| `generate-all` | Bulk generate all connectors |
| `lint` | Validate connector files |
| `build` | Deploy to modeler templates directory |
| `list-nodes` | Show available n8n nodes |
| `list-operations` | Show operations for a node |

---

## Part 4: Technical Implementation

### Directory Structure

```
packages/
└── connector-generator/
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── cli.ts              # CLI entry point
    │   ├── commands/
    │   │   ├── new.ts          # Interactive creation
    │   │   ├── generate.ts     # Single connector generation
    │   │   ├── generate-all.ts # Bulk generation
    │   │   ├── lint.ts         # Validation
    │   │   └── build.ts        # Deployment
    │   ├── extractors/
    │   │   ├── n8n-schema-extractor.ts  # Parse n8n nodes
    │   │   └── operation-extractor.ts   # Extract operations
    │   ├── generators/
    │   │   ├── element-template.ts      # Generate .element.json
    │   │   ├── n8n-workflow.ts          # Generate .n8n.json
    │   │   ├── bpmn-example.ts          # Generate .bpmn
    │   │   ├── readme.ts                # Generate README.md
    │   │   └── metadata.ts              # Generate connector.json
    │   ├── templates/
    │   │   ├── element-template.hbs     # Handlebars template
    │   │   ├── n8n-workflow.hbs
    │   │   ├── bpmn-example.hbs
    │   │   └── readme.hbs
    │   ├── classifiers/
    │   │   └── quality-tier.ts          # Classify by complexity
    │   └── utils/
    │       ├── type-mapper.ts           # n8n types → element types
    │       └── naming.ts                # Consistent naming
    └── tests/
```

### Type Mapping: n8n → Catalyst Element Template

| n8n Type | Element Template Type | Notes |
|----------|----------------------|-------|
| `string` | `String` | Direct mapping |
| `number` | `String` | Camunda uses strings |
| `boolean` | `Dropdown` | Options: true/false |
| `options` | `Dropdown` | Map choices |
| `dateTime` | `String` | ISO format |
| `fixedCollection` | `Text` (JSON) | Complex → JSON string |
| `collection` | Multiple properties | Flatten optional fields |

### n8n Workflow Template Pattern

**Note:** Credentials are NOT included in generated workflows. Users configure credentials directly in n8n after importing the workflow.

```json
{
  "name": "{{displayName}}",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "catalyst-{{connectorId}}",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "{{nodeName}}",
      "type": "n8n-nodes-base.{{n8nNodeName}}",
      "parameters": {
        "resource": "{{resource}}",
        "operation": "{{operation}}",
        {{#each parameters}}
        "{{name}}": "={{ $json.body.{{name}} }}"{{#unless @last}},{{/unless}}
        {{/each}}
      }
      // Credentials configured by user in n8n after import
    },
    {
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { success: true, statusCode: 200, responseBody: $json, error: null } }}"
      }
    }
  ],
  "connections": { /* auto-generated */ }
}
```

---

## Part 5: Quality Classification Logic

### Tier 1 Criteria (Fully Automated)
- All parameters are `string`, `number`, `boolean`, or simple `options`
- No `fixedCollection` or complex nested types
- Single credential requirement
- No file/binary operations
- No pagination/batch operations

### Tier 2 Criteria (Needs Review)
- Contains `fixedCollection` (arrays of objects)
- Multiple credential options (OAuth2 vs API key)
- Dynamic dropdowns (loadOptionsMethod)
- Parameters with dependencies (displayOptions with multiple conditions)

### Tier 3 Criteria (Manual Required)
- Trigger nodes (require webhook setup in reverse)
- Binary/file operations
- Multi-resource operations in single call
- Complex authentication flows

### Classification Output

```json
{
  "connectorId": "slack-send-message",
  "tier": 1,
  "confidence": 0.95,
  "issues": [],
  "warnings": ["Optional 'attachments' parameter simplified to JSON string"]
}
```

---

## Part 6: Metadata Schema for Studio

### connector.json Structure

```json
{
  "id": "slack-send-message",
  "name": "Slack - Send Message",
  "description": "Send a message to a Slack channel",
  "version": "1.0.0",
  "type": "integration",
  "category": "communication",
  "subcategory": "messaging",
  "icon": "slack.svg",
  "color": "#4A154B",
  "tags": ["slack", "message", "chat", "notification"],
  "source": {
    "type": "n8n",
    "node": "slack",
    "resource": "message",
    "operation": "send",
    "version": "2.1"
  },
  "quality": {
    "tier": 1,
    "generated": true,
    "reviewed": false,
    "tested": false
  },
  "authentication": "oauth2",
  "featured": false,
  "createdAt": "2026-01-24T00:00:00Z",
  "files": {
    "readme": "README.md",
    "n8nWorkflow": "slack-send-message.n8n.json",
    "elementTemplate": "slack-send-message.element.json",
    "exampleBpmn": "slack-send-message.bpmn"
  }
}
```

### Category Mapping

| n8n Category | Catalyst Category | Subcategory |
|--------------|-------------------|-------------|
| Communication | communication | messaging, email |
| Sales/CRM | business | crm, sales |
| Project Management | productivity | project-management |
| Data/Databases | data | database, storage |
| Developer Tools | developer-tools | api, utilities |
| Marketing | marketing | email, analytics |
| Finance | finance | payment, accounting |

---

## Part 7: Data Sources for n8n Schemas

### Option A: npm Package (Recommended)
```bash
npm install n8n-nodes-base --save-dev
```
- Parse TypeScript files directly
- Access to all 303 nodes
- Requires TypeScript parser (ts-morph)

### Option B: GitHub Raw Files
```bash
curl https://raw.githubusercontent.com/n8n-io/n8n/master/packages/nodes-base/nodes/Slack/Slack.node.ts
```
- No npm installation needed
- Can fetch specific nodes
- Rate limited

### Option C: n8n API (Runtime)
```bash
# If n8n instance is running
curl http://localhost:5678/types/nodes.json
```
- Already parsed/structured
- Requires running n8n
- Best for validation

**Recommendation:** Use Option A (npm) for extraction, Option C for validation against running n8n.

---

## Part 8: Implementation Phases

### Priority Integrations (Popular Services First)

**Tier A - Generate First (~50 nodes):**
- Communication: Slack, Discord, Telegram, Microsoft Teams, WhatsApp
- Productivity: Google Sheets, Google Drive, Notion, Airtable, Trello
- CRM: Salesforce, HubSpot, Pipedrive, Zoho
- Email: Gmail, Outlook, SendGrid, Mailchimp
- Developer: GitHub, GitLab, Jira, Linear

**Tier B - High Value (~100 nodes):**
- Cloud: AWS, Google Cloud, Azure
- Database: PostgreSQL, MySQL, MongoDB, Supabase
- E-commerce: Shopify, Stripe, PayPal, WooCommerce
- AI: OpenAI, Anthropic, Google AI
- Files: Dropbox, Box, OneDrive

**Tier C - Full Coverage (~150+ nodes):**
- All remaining Tier 1 quality nodes

### Phase 1: Foundation
- [ ] Set up `packages/connector-generator` project structure
- [ ] Implement schema extractor for n8n-nodes-base
- [ ] Create type mapping utilities
- [ ] Build basic CLI scaffolding

### Phase 2: Core Generators
- [ ] Element template generator
- [ ] n8n workflow generator
- [ ] BPMN example generator
- [ ] README generator
- [ ] Metadata generator

### Phase 3: Quality & Classification
- [ ] Implement quality tier classifier
- [ ] Add validation/linting
- [ ] Create test suite for generators
- [ ] Generate sample connectors for review

### Phase 4: Bulk Generation
- [ ] Implement generate-all command
- [ ] Create category mapping
- [ ] Build deployment pipeline
- [ ] Generate Tier 1 connectors (~80%)

### Phase 5: Polish & Documentation
- [ ] Review Tier 2 connectors
- [ ] Create developer documentation
- [ ] Integration with Catalyst Studio
- [ ] Performance optimization

---

## Part 9: Verification Plan

### Unit Tests
- Schema extraction correctness
- Type mapping accuracy
- Template generation validity

### Integration Tests
- Generated element templates load in Camunda Modeler
- Generated n8n workflows import successfully
- End-to-end: Camunda → Bridge → n8n → Response

### Sample Validation (Manual)
1. Generate 5 connectors across different categories
2. Deploy to local Catalyst stack
3. Run example BPMN processes
4. Verify responses match expected output

### Success Metrics
- 80%+ of nodes generate Tier 1 connectors
- All generated element templates validate against schema
- All generated n8n workflows import without errors
- 10 sample connectors pass end-to-end testing

---

## Part 10: User Decisions

Based on user input:

1. **n8n Version Target:** Latest stable n8n-nodes-base from npm

2. **Priority Integrations:** Popular services first (Slack, Google, Microsoft, Notion, Airtable, etc.)

3. **Credential Handling:** Keep clear of credentials - users configure credentials directly in n8n after importing workflows. Generated workflows will NOT include credential configuration.

4. **Icon Strategy:** Extract n8n SVGs for service logos to maintain brand recognition

5. **Studio Integration:** Generate files only (connector.json metadata for future Studio gallery)

---

## Files to Create/Modify

### New Files
- `packages/connector-generator/` - Entire new package
- `connectors/generated/` - Output directory for auto-generated connectors

### Modified Files
- `packages/web-modeler/server/` - Update template discovery to include generated connectors
- `packages/control-panel/` - Update connector gallery for new categories

---

## Summary

This plan establishes a systematic approach to auto-generate Catalyst connectors from n8n node definitions, mirroring n8n's own developer experience with their `n8n-node` CLI tool. The key innovations are:

1. **One connector per operation** - Simpler, more focused connectors
2. **Quality tiers** - Automatic classification for curation
3. **CLI-first approach** - Developer-friendly tooling
4. **Metadata schema** - Rich categorization for Studio gallery

The expected output is ~2,000+ connectors with 80%+ being fully automated (Tier 1).

---

## References

- [n8n Node File Structure](https://docs.n8n.io/integrations/creating-nodes/build/reference/node-file-structure/)
- [n8n Declarative Node Guide](https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/)
- [n8n-nodes-base npm](https://www.npmjs.com/package/n8n-nodes-base)
- [n8n GitHub Repository](https://github.com/n8n-io/n8n)
- [Catalyst CONNECTOR_SPEC.md](../CONNECTOR_SPEC.md)
