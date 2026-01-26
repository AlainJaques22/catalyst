"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftTeamsTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_trigger_1 = require("./v2/helpers/utils-trigger");
const methods_1 = require("./v2/methods");
const transport_1 = require("./v2/transport");
class MicrosoftTeamsTrigger {
    description = {
        displayName: 'Microsoft Teams Trigger',
        name: 'microsoftTeamsTrigger',
        icon: 'file:teams.svg',
        group: ['trigger'],
        version: 1,
        description: 'Triggers workflows in n8n based on events from Microsoft Teams, such as new messages or team updates, using specified configurations.',
        subtitle: 'Microsoft Teams Trigger',
        defaults: {
            name: 'Microsoft Teams Trigger',
        },
        credentials: [
            {
                name: 'microsoftTeamsOAuth2Api',
                required: true,
            },
        ],
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Trigger On',
                name: 'event',
                type: 'options',
                default: 'newChannelMessage',
                options: [
                    {
                        name: 'New Channel',
                        value: 'newChannel',
                        description: 'A new channel is created',
                    },
                    {
                        name: 'New Channel Message',
                        value: 'newChannelMessage',
                        description: 'A message is posted to a channel',
                    },
                    {
                        name: 'New Chat',
                        value: 'newChat',
                        description: 'A new chat is created',
                    },
                    {
                        name: 'New Chat Message',
                        value: 'newChatMessage',
                        description: 'A message is posted to a chat',
                    },
                    {
                        name: 'New Team Member',
                        value: 'newTeamMember',
                        description: 'A new member is added to a team',
                    },
                ],
                description: 'Select the event to trigger the workflow',
            },
            {
                displayName: 'Watch All Teams',
                name: 'watchAllTeams',
                type: 'boolean',
                default: false,
                description: 'Whether to watch for the event in all the available teams',
                displayOptions: {
                    show: {
                        event: ['newChannel', 'newChannelMessage', 'newTeamMember'],
                    },
                },
            },
            {
                displayName: 'Team',
                name: 'teamId',
                type: 'resourceLocator',
                default: {
                    mode: 'list',
                    value: '',
                },
                required: true,
                description: 'Select a team from the list, enter an ID or a URL',
                modes: [
                    {
                        displayName: 'From List',
                        name: 'list',
                        type: 'list',
                        placeholder: 'Select a team...',
                        typeOptions: {
                            searchListMethod: 'getTeams',
                            searchable: true,
                        },
                    },
                    {
                        displayName: 'By ID',
                        name: 'id',
                        type: 'string',
                        placeholder: 'e.g., 61165b04-e4cc-4026-b43f-926b4e2a7182',
                    },
                    {
                        displayName: 'By URL',
                        name: 'url',
                        type: 'string',
                        placeholder: 'e.g., https://teams.microsoft.com/l/team/19%3A...groupId=your-team-id&tenantId=...',
                        extractValue: {
                            type: 'regex',
                            regex: /groupId=([0-9a-fA-F-]{36})/,
                        },
                    },
                ],
                displayOptions: {
                    show: {
                        event: ['newChannel', 'newChannelMessage', 'newTeamMember'],
                        watchAllTeams: [false],
                    },
                },
            },
            {
                displayName: 'Watch All Channels',
                name: 'watchAllChannels',
                type: 'boolean',
                default: false,
                description: 'Whether to watch for the event in all the available channels',
                displayOptions: {
                    show: {
                        event: ['newChannelMessage'],
                        watchAllTeams: [false],
                    },
                },
            },
            {
                displayName: 'Channel',
                name: 'channelId',
                type: 'resourceLocator',
                default: {
                    mode: 'list',
                    value: '',
                },
                required: true,
                description: 'Select a channel from the list, enter an ID or a URL',
                modes: [
                    {
                        displayName: 'From List',
                        name: 'list',
                        type: 'list',
                        placeholder: 'Select a channel...',
                        typeOptions: {
                            searchListMethod: 'getChannels',
                            searchable: true,
                        },
                    },
                    {
                        displayName: 'By ID',
                        name: 'id',
                        type: 'string',
                        placeholder: 'e.g., 19:-xlxyqXNSCxpI1SDzgQ_L9ZvzSR26pgphq1BJ9y7QJE1@thread.tacv2',
                    },
                    {
                        displayName: 'By URL',
                        name: 'url',
                        type: 'string',
                        placeholder: 'e.g., https://teams.microsoft.com/l/channel/19%3A...@thread.tacv2/...',
                        extractValue: {
                            type: 'regex',
                            regex: /channel\/([^\/?]+)/,
                        },
                    },
                ],
                displayOptions: {
                    show: {
                        event: ['newChannelMessage'],
                        watchAllTeams: [false],
                        watchAllChannels: [false],
                    },
                },
            },
            {
                displayName: 'Watch All Chats',
                name: 'watchAllChats',
                type: 'boolean',
                default: false,
                description: 'Whether to watch for the event in all the available chats',
                displayOptions: {
                    show: {
                        event: ['newChatMessage'],
                    },
                },
            },
            {
                displayName: 'Chat',
                name: 'chatId',
                type: 'resourceLocator',
                default: {
                    mode: 'list',
                    value: '',
                },
                required: true,
                description: 'Select a chat from the list, enter an ID or a URL',
                modes: [
                    {
                        displayName: 'From List',
                        name: 'list',
                        type: 'list',
                        placeholder: 'Select a chat...',
                        typeOptions: {
                            searchListMethod: 'getChats',
                            searchable: true,
                        },
                    },
                    {
                        displayName: 'By ID',
                        name: 'id',
                        type: 'string',
                        placeholder: '19:7e2f1174-e8ee-4859-b8b1-a8d1cc63d276@unq.gbl.spaces',
                    },
                    {
                        displayName: 'By URL',
                        name: 'url',
                        type: 'string',
                        placeholder: 'https://teams.microsoft.com/_#/conversations/CHAT_ID',
                        extractValue: {
                            type: 'regex',
                            regex: /conversations\/([^\/?]+)/i,
                        },
                    },
                ],
                displayOptions: {
                    show: {
                        event: ['newChatMessage'],
                        watchAllChats: [false],
                    },
                },
            },
        ],
    };
    methods = {
        listSearch: methods_1.listSearch,
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const event = this.getNodeParameter('event', 0);
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                try {
                    const subscriptions = (await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', '/v1.0/subscriptions'));
                    const matchingSubscriptions = subscriptions.filter((subscription) => subscription.notificationUrl === webhookUrl);
                    const now = new Date();
                    const thresholdMs = 5 * 60 * 1000;
                    const validSubscriptions = matchingSubscriptions.filter((subscription) => {
                        const expiration = new Date(subscription.expirationDateTime);
                        return expiration.getTime() - now.getTime() > thresholdMs;
                    });
                    const resourcePaths = await utils_trigger_1.getResourcePath.call(this, event);
                    const requiredResources = Array.isArray(resourcePaths) ? resourcePaths : [resourcePaths];
                    const subscribedResources = validSubscriptions.map((sub) => sub.resource);
                    const allResourcesSubscribed = requiredResources.every((resource) => subscribedResources.includes(resource));
                    if (allResourcesSubscribed) {
                        webhookData.subscriptionIds = validSubscriptions.map((sub) => sub.id);
                        return true;
                    }
                    return false;
                }
                catch (error) {
                    return false;
                }
            },
            async create() {
                const event = this.getNodeParameter('event', 0);
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                if (!webhookUrl?.startsWith('https://')) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                        message: 'Invalid Notification URL',
                        description: `The webhook URL "${webhookUrl}" is invalid. Microsoft Graph requires an HTTPS URL.`,
                    });
                }
                const resourcePaths = await utils_trigger_1.getResourcePath.call(this, event);
                const subscriptionIds = [];
                if (Array.isArray(resourcePaths)) {
                    await Promise.all(resourcePaths.map(async (resource) => {
                        const subscription = await utils_trigger_1.createSubscription.call(this, webhookUrl, resource);
                        subscriptionIds.push(subscription.id);
                        return subscription;
                    }));
                    webhookData.subscriptionIds = subscriptionIds;
                }
                else {
                    const subscription = await utils_trigger_1.createSubscription.call(this, webhookUrl, resourcePaths);
                    webhookData.subscriptionIds = [subscription.id];
                }
                return true;
            },
            async delete() {
                const webhookData = this.getWorkflowStaticData('node');
                const storedIds = webhookData.subscriptionIds;
                if (!Array.isArray(storedIds)) {
                    return false;
                }
                try {
                    await Promise.all(storedIds.map(async (subscriptionId) => {
                        try {
                            await transport_1.microsoftApiRequest.call(this, 'DELETE', `/v1.0/subscriptions/${subscriptionId}`);
                        }
                        catch (error) {
                            if (error.httpStatusCode !== 404) {
                                throw error;
                            }
                        }
                    }));
                    delete webhookData.subscriptionIds;
                    return true;
                }
                catch (error) {
                    return false;
                }
            },
        },
    };
    async webhook() {
        const req = this.getRequestObject();
        const res = this.getResponseObject();
        // Handle Microsoft Graph validation request
        if (req.query.validationToken) {
            res.status(200).send(req.query.validationToken);
            return { noWebhookResponse: true };
        }
        const eventNotifications = req.body.value;
        const response = {
            workflowData: eventNotifications.map((event) => [
                {
                    json: event.resourceData ?? event,
                },
            ]),
        };
        return response;
    }
}
exports.MicrosoftTeamsTrigger = MicrosoftTeamsTrigger;
//# sourceMappingURL=MicrosoftTeamsTrigger.node.js.map