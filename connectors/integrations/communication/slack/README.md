# Catalyst Slack Send Message Connector

Sends a Slack message to a Slack Channel

# View this Youtube video on how to configure the Slack API for n8n integrations

https://youtu.be/kbjdC9oL6Ak?si=J0KjmYSg2IO4npHv

## Installation

### 1. Import n8n Workflow

1. Open your n8n instance
2. Click **Workflows** > **Import from File**
3. Select `slack-send-message.n8n.json`
4. **Activate** the workflow

Webhook URL: `http://catalyst-n8n:5678/webhook/catalyst-slack-send-message`

### 2. Deploy Element Template

Copy `slack-send-message.element.json` to your Camunda Modeler templates directory.

## Input Parameters

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `slackMessage` | String | Yes | Slack message to post to the Channel |
| `slackChannel` | String | Yes | Slack Channel |

## Output Variables

| Variable | Type | Description |
|----------|------|-------------|
| `success` | Boolean | Whether the request succeeded |
| `statusCode` | Number | HTTP status code |
| (from API) | - | See API documentation |
| `error` | String | Error message if failed |

## Files

- `slack-send-message.n8n.json` - n8n webhook workflow
- `slack-send-message.element.json` - Camunda Modeler template
- `slack-send-message.bpmn` - Example BPMN process
- `README.md` - This documentation
