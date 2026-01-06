# Catalyst Send Email Connector

Sends an Email using Gmail and saved credentials in n8n

## Installation

### 1. Import n8n Workflow

1. Open your n8n instance
2. Click **Workflows** > **Import from File**
3. Select `send-email.n8n.json`
4. **Activate** the workflow

Webhook URL: `http://catalyst-n8n:5678/webhook/catalyst-send-email`

### 2. Deploy Element Template

Copy `send-email.element.json` to your Camunda Modeler templates directory.

## Input Parameters

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `toEmail` | String | Yes | To |
| `subject` | String | Yes | Subject |
| `message` | String | Yes | Message |
| `ccEmail` | String | Yes | CC (optional) |

## Output Variables

| Variable | Type | Description |
|----------|------|-------------|
| `success` | Boolean | Whether the request succeeded |
| `statusCode` | Number | HTTP status code |
| (from API) | - | See API documentation |
| `error` | String | Error message if failed |

## Files

- `send-email.n8n.json` - n8n webhook workflow
- `send-email.element.json` - Camunda Modeler template
- `send-email.bpmn` - Example BPMN process
- `README.md` - This documentation
