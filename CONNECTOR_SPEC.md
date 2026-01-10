# Catalyst Connector Specification

This document defines the technical requirements for creating connectors for the Catalyst Bridge system.

## Overview

Catalyst Bridge is a **domain-agnostic** integration layer between Camunda 7 BPM and n8n automation. It has no knowledge of specific APIs or business domains - it simply forwards data between systems.

Connectors are configuration templates that make it easy to integrate specific APIs or services into Camunda processes.

## Core Principles

1. **Security First**: Never store sensitive data (API keys, passwords, tokens) in Camunda. Keep credentials in n8n workflows.

2. **Use plain JSON**: Use JSON strings with `${variableName}` syntax for process variable substitution. FEEL causes serialization issues.

3. **Domain Agnostic**: CatalystBridge has no domain knowledge. All API-specific logic lives in the connector configuration and n8n workflow.

4. **Simple JSON**: Connectors configure HTTP requests using simple JSON payloads.

## Connector Structure

Each connector consists of four files in `connectors/official/{connector-name}/`:

1. `{connector-name}.element.json` - Camunda Modeler element template
2. `{connector-name}.bpmn` - Example BPMN process demonstrating usage
3. `{connector-name}.n8n.json` - n8n workflow configuration
4. `README.md` - Documentation with examples and use cases

## Element Template Requirements

### Required Properties

Every element template MUST include these properties:

```json
{
  "$schema": "https://unpkg.com/@camunda/element-templates-json-schema/resources/schema.json",
  "name": "Catalyst - [Connector Name]",
  "id": "io.catalyst.template.[connector-id]",
  "description": "[Clear description of what this connector does]",
  "version": 1,
  "appliesTo": ["bpmn:ServiceTask"],
  "properties": [
    {
      "label": "Implementation",
      "type": "String",
      "value": "io.catalyst.bridge.CatalystBridge",
      "binding": {
        "type": "property",
        "name": "camunda:class"
      }
    }
  ]
}
```

### Connection Configuration

Include these standard connection properties in a "Connection" group:

```json
{
  "label": "n8n Webhook URL",
  "description": "Full URL to your n8n webhook",
  "type": "String",
  "value": "http://catalyst-n8n:5678/webhook/[unique-webhook-name]",
  "binding": {
    "type": "camunda:inputParameter",
    "name": "webhookUrl"
  },
  "group": "connection",
  "constraints": {
    "notEmpty": true
  }
},
{
  "label": "Timeout (seconds)",
  "description": "Request timeout in seconds",
  "type": "String",
  "value": "30",
  "binding": {
    "type": "camunda:inputParameter",
    "name": "timeout"
  },
  "group": "connection"
}
```

### Payload Configuration

The payload MUST be plain JSON with NO `scriptFormat` attribute:

```json
{
  "label": "Payload",
  "description": "HTTP request configuration as JSON string. Use ${variableName} syntax to reference process variables.",
  "type": "Text",
  "value": "{\n  \"method\": \"GET\",\n  \"url\": \"https://api.example.com/endpoint\",\n  \"headers\": {},\n  \"queryParams\": {\n    \"param1\": \"${variableName}\"\n  },\n  \"body\": {}\n}",
  "binding": {
    "type": "camunda:inputParameter",
    "name": "payload"
  }
}
```

**CRITICAL RULES:**
- ✅ Use `"type": "Text"` for multi-line text area
- ✅ Use `${variableName}` syntax for process variable substitution
- ✅ Use plain JSON strings with escaped quotes (`\"`)
- ❌ NEVER use `scriptFormat: "feel"` in the binding
- ❌ NEVER use FEEL expression syntax (e.g., `={...}` or unquoted variables)

### Output Mapping

Use JSONPath expressions to map response data to process variables:

```json
{
  "label": "Output Mapping",
  "description": "Maps API response to process variables using JSONPath",
  "type": "Text",
  "value": "{\n  \"success\": \"$.success\",\n  \"statusCode\": \"$.statusCode\",\n  \"responseData\": \"$.responseBody\",\n  \"error\": \"$.error\"\n}",
  "binding": {
    "type": "camunda:inputParameter",
    "name": "outputMapping"
  },
  "group": "response"
}
```

Standard n8n response structure:
- `$.success` - Boolean indicating success
- `$.statusCode` - HTTP status code
- `$.responseBody` - The actual API response data
- `$.error` - Error message if request failed

## Example BPMN Process

The example BPMN MUST use plain JSON (not FEEL):

```xml
<camunda:inputParameter name="payload">{
  "method": "GET",
  "url": "https://api.example.com/data",
  "headers": {},
  "queryParams": {
    "id": "${itemId}"
  },
  "body": {}
}</camunda:inputParameter>
```

**WRONG (Do NOT use FEEL):**
```xml
<!-- ❌ NEVER DO THIS -->
<camunda:inputParameter name="payload">
  <camunda:script scriptFormat="feel">={
    method: "GET",
    url: "https://api.example.com/data"
  }</camunda:script>
</camunda:inputParameter>
```

## README Documentation

Each connector README MUST include:

1. **Overview** - What the connector does
2. **Authentication** - Where to configure API keys (in n8n, NOT Camunda)
3. **Configuration** - How to set up the connector
4. **Example Usage** - Practical examples with real use cases
5. **Response Format** - What data the API returns
6. **Common Use Cases** - Real-world scenarios

## n8n Webhook Requirements

Each connector needs a unique n8n webhook with this structure:

1. **Webhook Trigger** - Receives data from Camunda
2. **Validation Node** - Validates required fields
3. **HTTP Request Node** - Makes the actual API call (stores credentials here)
4. **Response Node** - Returns formatted response to Camunda

The n8n workflow handles:
- Authentication (API keys, tokens, etc.)
- Request execution
- Error handling
- Response formatting

## Deployment Checklist

When creating a new connector:

- [ ] Create element template in `connectors/official/{connector-name}/{connector-name}.element.json`
- [ ] Create example BPMN in `connectors/official/{connector-name}/{connector-name}.bpmn`
- [ ] Create n8n workflow in `connectors/official/{connector-name}/{connector-name}.n8n.json`
- [ ] Create README in `connectors/official/{connector-name}/README.md`
- [ ] Copy element template to `modeler/resources/element-templates/{connector-name}.element.json`
- [ ] Use unique webhook URL (e.g., `http://catalyst-n8n:5678/webhook/catalyst-{connector-name}`)
- [ ] Verify webhook URL matches default allowlist or document custom requirements
- [ ] Verify NO FEEL syntax anywhere (no `scriptFormat: "feel"`)
- [ ] Test with real API calls
- [ ] Test webhook URL validation (valid and invalid URLs)
- [ ] Document authentication setup in README (credentials in n8n, not Camunda)
- [ ] Document any custom webhook URL allowlist requirements

## Variable Substitution

Use `${variableName}` syntax to reference Camunda process variables:

```json
{
  "method": "POST",
  "url": "https://api.example.com/users/${userId}",
  "queryParams": {
    "limit": "${maxResults}",
    "filter": "${searchTerm}"
  },
  "headers": {
    "X-Custom-Header": "${headerValue}"
  },
  "body": {
    "name": "${userName}",
    "email": "${userEmail}"
  }
}
```

The CatalystBridge performs string substitution before sending to n8n.

## Common Mistakes to Avoid

1. ❌ Using FEEL expressions (`scriptFormat: "feel"`)
2. ❌ Storing API keys in Camunda process variables
3. ❌ Using `"type": "String"` for multi-line fields (use `"type": "Text"`)
4. ❌ Forgetting to copy element template to modeler directory
5. ❌ Reusing webhook URLs between connectors
6. ❌ Hardcoding values that should be variables
7. ❌ Adding domain logic to CatalystBridge (it stays domain-agnostic)

## Security Guidelines

### Webhook URL Allowlist

The Catalyst Bridge validates all webhook URLs against an allowlist to prevent data exfiltration to unauthorized endpoints.

**Default allowed URL prefixes:**
- `http://localhost:5678/webhook/`
- `http://catalyst-n8n:5678/webhook/`
- `http://n8n:5678/webhook/`

**Custom configuration:**

Set the `CATALYST_WEBHOOK_ALLOWLIST` environment variable to customize allowed webhook URL prefixes:

```bash
CATALYST_WEBHOOK_ALLOWLIST=http://localhost:5678/webhook/,https://n8n.yourcompany.com/webhook/
```

**When creating connectors:**
- ✅ Use webhook URLs that match the default prefixes during development
- ✅ Document any custom URL requirements in your connector README
- ✅ Test webhook URL validation with valid and invalid URLs
- ❌ Don't hardcode webhook URLs that bypass the allowlist
- ❌ Don't assume the allowlist can be disabled

### Credential Security

**In n8n workflows:**
- ✅ Store API keys, tokens, passwords
- ✅ Configure authentication headers
- ✅ Handle sensitive credentials
- ✅ Use n8n's credential management system

**In Camunda processes:**
- ✅ Store business data (user IDs, search terms, configuration)
- ✅ Pass non-sensitive parameters to n8n
- ❌ NEVER store API keys, passwords, tokens
- ❌ NEVER include credentials in process variables
- ❌ NEVER put secrets in BPMN payloads

## Examples

See existing connectors for reference:
- `connectors/official/http-request/` - Generic HTTP request connector
- `connectors/official/http-request-weather-forecast/` - Weather API connector