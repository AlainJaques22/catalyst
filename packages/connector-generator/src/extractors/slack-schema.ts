/**
 * Static Slack node schema
 *
 * This represents the extracted schema from n8n's Slack node.
 * In production, this would be dynamically parsed from n8n-nodes-base.
 */

import { OperationSchema } from '../types';

/**
 * Slack Send Message operation schema
 * Extracted from n8n-nodes-base Slack node
 */
export const slackSendMessageSchema: OperationSchema = {
  nodeId: 'slack',
  nodeName: 'Slack',
  resource: 'message',
  resourceName: 'Message',
  operation: 'send',
  operationName: 'Send',
  displayName: 'Slack - Send Message',
  description: 'Send a message to a Slack channel',
  icon: 'file:slack.svg',
  color: '#4A154B',
  credentials: ['slackApi', 'slackOAuth2Api'],
  parameters: [
    {
      name: 'channel',
      displayName: 'Channel',
      type: 'string',
      required: true,
      description: 'The Slack channel to send the message to (e.g., #general or channel ID)',
      placeholder: '#general'
    },
    {
      name: 'text',
      displayName: 'Message Text',
      type: 'string',
      required: true,
      description: 'The text content of the message to send',
      placeholder: 'Hello from Catalyst!'
    }
  ],
  category: 'communication',
  subcategory: 'messaging',
  tags: ['slack', 'message', 'chat', 'notification', 'communication']
};

/**
 * Slack Post Message operation schema (alternative naming)
 */
export const slackPostMessageSchema: OperationSchema = {
  nodeId: 'slack',
  nodeName: 'Slack',
  resource: 'message',
  resourceName: 'Message',
  operation: 'postMessage',
  operationName: 'Post',
  displayName: 'Slack - Post Message',
  description: 'Post a message to a Slack channel or direct message',
  icon: 'file:slack.svg',
  color: '#4A154B',
  credentials: ['slackApi', 'slackOAuth2Api'],
  parameters: [
    {
      name: 'select',
      displayName: 'Send Message To',
      type: 'options',
      required: true,
      description: 'Whether to send to a channel or user',
      default: 'channel',
      options: [
        { name: 'Channel', value: 'channel' },
        { name: 'User', value: 'user' }
      ]
    },
    {
      name: 'channelId',
      displayName: 'Channel',
      type: 'string',
      required: true,
      description: 'The channel to send the message to',
      placeholder: '#general'
    },
    {
      name: 'text',
      displayName: 'Message Text',
      type: 'string',
      required: true,
      description: 'The message text to send'
    },
    {
      name: 'messageType',
      displayName: 'Message Type',
      type: 'options',
      required: false,
      default: 'text',
      options: [
        { name: 'Simple Text', value: 'text' },
        { name: 'Blocks', value: 'block' },
        { name: 'Attachments', value: 'attachment' }
      ]
    }
  ],
  category: 'communication',
  subcategory: 'messaging',
  tags: ['slack', 'message', 'chat', 'notification', 'communication']
};

/**
 * All available Slack operations
 */
export const slackOperations: OperationSchema[] = [
  slackSendMessageSchema,
  // Future: Add more operations
  // slackUpdateMessageSchema,
  // slackDeleteMessageSchema,
  // slackAddReactionSchema,
  // slackCreateChannelSchema,
  // etc.
];

/**
 * Get Slack operation schema by operation name
 */
export function getSlackOperation(operation: string): OperationSchema | undefined {
  return slackOperations.find(op =>
    op.operation.toLowerCase() === operation.toLowerCase() ||
    op.operationName.toLowerCase() === operation.toLowerCase()
  );
}

/**
 * Get all Slack operations
 */
export function getAllSlackOperations(): OperationSchema[] {
  return slackOperations;
}
