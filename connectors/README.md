# Catalyst Connectors

This directory contains all Catalyst connectors organized by type and category.

## Directory Structure

```
connectors/
├── integrations/           # Single-service building blocks
│   ├── communication/      # Chat, email, messaging platforms
│   ├── data-storage/       # Databases, spreadsheets, file storage
│   ├── developer-tools/    # Version control, CI/CD, APIs
│   ├── productivity/       # Tasks, calendars, notes
│   ├── marketing/          # Email marketing, analytics, social media
│   ├── sales-crm/          # Customer relationship management
│   ├── ecommerce/          # Online stores, payments
│   ├── ai-ml/              # AI and machine learning services
│   ├── finance/            # Financial tools, invoicing
│   └── it-infrastructure/  # Cloud services, monitoring, DevOps
│
├── templates/              # Multi-step workflow templates
│   ├── customer-onboarding/
│   ├── invoice-processing/
│   ├── approval-workflows/
│   ├── data-sync/
│   ├── notification/
│   ├── lead-management/
│   ├── content-publishing/
│   ├── monitoring-alerts/
│   ├── data-collection/
│   ├── ai-analysis/
│   └── reporting/
│
└── community/              # Community-contributed connectors
```

## Integration vs Template

**Integrations** are single-service connectors that provide building blocks:
- Connect to one specific service (Slack, Gmail, Salesforce, etc.)
- Reusable across many workflows
- Focus on API integration and authentication

**Templates** are pre-built workflow patterns that solve specific use cases:
- Multi-step workflows combining multiple services
- End-to-end solutions for common business processes
- Focus on solving a specific problem or use case

## Adding a New Connector

### 1. Choose Type and Category

Determine if your connector is an **integration** (single service) or **template** (workflow pattern), then select the appropriate category.

### 2. Create Connector Folder

Create a folder in the appropriate category:

```bash
# For an integration
mkdir -p connectors/integrations/{category}/{connector-name}

# For a template
mkdir -p connectors/templates/{category}/{connector-name}
```

**Example:**
```bash
mkdir -p connectors/integrations/communication/microsoft-teams
```

### 3. Create connector.json

Every connector must have a `connector.json` metadata file:

```json
{
  "id": "microsoft-teams",
  "name": "Microsoft Teams",
  "description": "Send messages to Microsoft Teams channels",
  "version": "1.0.0",
  "type": "integration",
  "category": "communication",
  "icon": "ph-microsoft-teams-logo",
  "color": "#5558AF",
  "tags": ["teams", "chat", "messaging", "microsoft"],
  "author": {
    "name": "Your Name"
  },
  "files": {
    "readme": "README.md",
    "n8nWorkflow": "microsoft-teams.n8n.json",
    "elementTemplate": "microsoft-teams.element.json",
    "exampleBpmn": "microsoft-teams.bpmn"
  },
  "authentication": "oauth2",
  "featured": false,
  "createdAt": "2025-01-03T00:00:00Z",
  "updatedAt": "2025-01-03T00:00:00Z"
}
```

**Required Fields:**
- `id`: Unique identifier (kebab-case)
- `name`: Display name
- `description`: Short description (max 150 chars)
- `version`: Semantic version (1.0.0)
- `type`: "integration" or "template"
- `category`: Category slug (must match folder name)
- `icon`: Phosphor icon class (e.g., "ph-chats-circle")
- `color`: Hex color code for visual identity

**Optional Fields:**
- `tags`: Array of searchable keywords
- `author`: Creator information
- `files`: Paths to connector files
- `authentication`: Auth type (oauth2, api-key, basic, etc.)
- `featured`: Boolean to highlight in gallery
- `createdAt`, `updatedAt`: ISO timestamps

### 4. Add Connector Files

Add your connector implementation files:

```
microsoft-teams/
├── connector.json              # Metadata (required)
├── README.md                   # Documentation
├── microsoft-teams.n8n.json    # n8n webhook workflow
├── microsoft-teams.element.json # Camunda element template
└── microsoft-teams.bpmn        # Example BPMN process
```

See [CONNECTOR_SPEC.md](../CONNECTOR_SPEC.md) for detailed file format specifications.

### 5. Generate Manifest

Run the build script to regenerate the connector manifest:

```bash
npm run build:manifest
```

This scans all connector folders and generates `packages/control-panel/connectors-manifest.json`.

### 6. Test in Control Panel

Open the Catalyst Control Panel (`http://localhost/`) and verify:
- Your connector appears in the correct category
- Metadata is displayed correctly
- Links to documentation work
- Icon and color are correct

## Category Guidelines

### Integration Categories

1. **Communication** - Chat, email, messaging platforms
   - Examples: Slack, Gmail, Microsoft Teams, Discord

2. **Data & Storage** - Databases, spreadsheets, file storage
   - Examples: Google Sheets, Airtable, PostgreSQL, AWS S3

3. **Developer Tools** - Version control, CI/CD, development platforms
   - Examples: GitHub, GitLab, Jira, HTTP Request

4. **Productivity** - Task management, calendars, notes
   - Examples: Notion, Asana, Trello, Google Calendar

5. **Marketing** - Email marketing, analytics, social media
   - Examples: Mailchimp, HubSpot, Google Analytics

6. **Sales & CRM** - Customer relationship management
   - Examples: Salesforce, Pipedrive, HubSpot CRM

7. **E-commerce** - Online stores, payments
   - Examples: Shopify, WooCommerce, Stripe, PayPal

8. **AI/ML** - Artificial intelligence and machine learning
   - Examples: OpenAI, Google AI, Anthropic Claude

9. **Finance & Accounting** - Financial tools, invoicing
   - Examples: QuickBooks, Xero, Stripe

10. **IT & Infrastructure** - Cloud services, monitoring, DevOps
    - Examples: AWS, Azure, Google Cloud, Datadog

### Template Categories

1. **Customer Onboarding** - New user setup, account creation
2. **Invoice Processing** - Billing and payment workflows
3. **Approval Workflows** - Multi-step approval processes
4. **Data Synchronization** - Keep systems in sync
5. **Notification Workflows** - Alerts and notifications
6. **Lead Management** - Sales pipeline automation
7. **Content Publishing** - Automated content workflows
8. **Monitoring & Alerts** - System monitoring and incident response
9. **Data Collection** - Forms, surveys, data aggregation
10. **AI & Analysis** - AI-powered workflows, text analysis
11. **Reporting** - Automated report generation

## Icons

Connectors use [Phosphor Icons](https://phosphoricons.com/). Browse the icon library and use the icon class name in your `connector.json`:

```json
"icon": "ph-chats-circle"
```

Common icons:
- Communication: `ph-chats-circle`, `ph-paper-plane-tilt`, `ph-chat-dots`
- Data: `ph-database`, `ph-table`, `ph-file-text`
- Tools: `ph-wrench`, `ph-code`, `ph-terminal`
- Cloud: `ph-cloud`, `ph-cloud-arrow-up`
- AI: `ph-brain`, `ph-robot`, `ph-magic-wand`

## Colors

Choose a brand color that represents the service or workflow. Use hex format:

```json
"color": "#5558AF"
```

Tips:
- Use the official brand color if integrating with a service
- Ensure good contrast with light and dark backgrounds
- Avoid overly bright or saturated colors

## Build System

The connector manifest is generated automatically from the folder structure.

**Build Script:** `scripts/generate-connector-manifest.js`

**How it works:**
1. Scans `connectors/integrations/` and `connectors/templates/`
2. For each category folder, finds all connector folders
3. Reads `connector.json` from each connector
4. Validates required fields
5. Generates `packages/control-panel/connectors-manifest.json`

**Run manually:**
```bash
npm run build:manifest
```

**Automatic builds:**
The manifest should be regenerated:
- After adding a new connector
- After updating connector metadata
- Before committing changes
- As part of the build pipeline

## Troubleshooting

### Connector not appearing in gallery

1. Check `connector.json` exists and is valid JSON
2. Verify required fields are present
3. Run `npm run build:manifest` and check for errors
4. Check browser console for errors loading manifest
5. Clear browser cache and reload

### Wrong category or missing metadata

1. Verify folder is in correct category path
2. Check `category` field in `connector.json` matches folder name
3. Regenerate manifest with `npm run build:manifest`

### Icons not showing

1. Verify icon class name is correct (e.g., `ph-chats-circle`)
2. Check Phosphor Icons documentation for available icons
3. Ensure Phosphor Icons library is loaded in control panel

## Best Practices

1. **Use descriptive names** - Connector name should clearly indicate what it does
2. **Write good descriptions** - Keep under 150 characters, focus on value
3. **Choose relevant tags** - Help users find your connector through search
4. **Test thoroughly** - Verify connector works in both n8n and Camunda
5. **Document well** - Include clear README with setup instructions
6. **Follow conventions** - Use kebab-case for IDs, follow folder structure
7. **Keep it simple** - Start with core functionality, iterate based on feedback

## Examples

See existing connectors for reference:
- **Integration**: `integrations/communication/slack/`
- **Template**: `templates/data-collection/ip-geolocation/`

## Support

For questions or issues:
- GitHub Issues: https://github.com/AlainJaques22/catalyst-connector/issues
- Documentation: See [CONNECTOR_SPEC.md](../CONNECTOR_SPEC.md)
