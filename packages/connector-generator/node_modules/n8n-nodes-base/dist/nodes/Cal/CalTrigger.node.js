"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class CalTrigger {
    description = {
        displayName: 'Cal.com Trigger',
        name: 'calTrigger',
        icon: { light: 'file:cal.svg', dark: 'file:cal.dark.svg' },
        group: ['trigger'],
        version: [1, 2],
        subtitle: '=Events: {{$parameter["events"].join(", ")}}',
        description: 'Handle Cal.com events via webhooks',
        defaults: {
            name: 'Cal.com Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'calApi',
                required: true,
            },
        ],
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
                displayName: 'Events',
                name: 'events',
                type: 'multiOptions',
                options: [
                    {
                        name: 'Booking Cancelled',
                        value: 'BOOKING_CANCELLED',
                        description: 'Receive notifications when a Cal event is canceled',
                    },
                    {
                        name: 'Booking Created',
                        value: 'BOOKING_CREATED',
                        description: 'Receive notifications when a new Cal event is created',
                    },
                    {
                        name: 'Booking Rescheduled',
                        value: 'BOOKING_RESCHEDULED',
                        description: 'Receive notifications when a Cal event is rescheduled',
                    },
                    {
                        name: 'Meeting Ended',
                        value: 'MEETING_ENDED',
                        description: 'Receive notifications when a Cal event or meeting has ended',
                    },
                ],
                default: [],
                required: true,
            },
            {
                displayName: 'API Version',
                name: 'version',
                type: 'options',
                displayOptions: {
                    show: {
                        '@version': [1],
                    },
                },
                isNodeSetting: true,
                options: [
                    {
                        name: 'Before v2.0',
                        value: 1,
                    },
                    {
                        name: 'v2.0 Onwards',
                        value: 2,
                    },
                ],
                default: 1,
            },
            {
                displayName: 'API Version',
                name: 'version',
                type: 'options',
                displayOptions: {
                    show: {
                        '@version': [2],
                    },
                },
                isNodeSetting: true,
                options: [
                    {
                        name: 'Before v2.0',
                        value: 1,
                    },
                    {
                        name: 'v2.0 Onwards',
                        value: 2,
                    },
                ],
                default: 2,
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                options: [
                    {
                        displayName: 'App ID',
                        name: 'appId',
                        type: 'string',
                        description: 'The ID of the App to monitor',
                        default: '',
                    },
                    {
                        displayName: 'EventType Name or ID',
                        name: 'eventTypeId',
                        type: 'options',
                        typeOptions: {
                            loadOptionsMethod: 'getEventTypes',
                        },
                        description: 'The EventType to monitor. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                        default: '',
                    },
                    {
                        displayName: 'Payload Template',
                        name: 'payloadTemplate',
                        type: 'string',
                        description: 'Template to customize the webhook payload',
                        default: '',
                        typeOptions: {
                            rows: 4,
                        },
                    },
                ],
            },
        ],
    };
    methods = {
        loadOptions: {
            async getEventTypes() {
                const returnData = [];
                const data = await GenericFunctions_1.calApiRequest.call(this, 'GET', '/event-types', {});
                for (const item of data.event_types) {
                    returnData.push({
                        name: item.title,
                        value: item.id,
                    });
                }
                return (0, GenericFunctions_1.sortOptionParameters)(returnData);
            },
        },
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const version = this.getNodeParameter('version', 0);
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                const events = this.getNodeParameter('events');
                // Check all the webhooks which exist already if it is identical to the
                // one that is supposed to get created.
                const data = version === 2
                    ? await GenericFunctions_1.calApiRequest.call(this, 'GET', '/webhooks', {})
                    : await GenericFunctions_1.calApiRequest.call(this, 'GET', '/hooks', {});
                for (const webhook of data.webhooks) {
                    if (webhook.subscriberUrl === webhookUrl) {
                        for (const event of events) {
                            if (!webhook.eventTriggers.includes(event)) {
                                return false;
                            }
                        }
                        // Set webhook-id to be sure that it can be deleted
                        webhookData.webhookId = webhook.id;
                        return true;
                    }
                }
                return false;
            },
            async create() {
                const version = this.getNodeParameter('version', 0);
                const webhookData = this.getWorkflowStaticData('node');
                const subscriberUrl = this.getNodeWebhookUrl('default');
                const eventTriggers = this.getNodeParameter('events');
                const options = this.getNodeParameter('options');
                const active = true;
                const body = {
                    subscriberUrl,
                    eventTriggers,
                    active,
                    ...options,
                };
                const responseData = version === 2
                    ? await GenericFunctions_1.calApiRequest.call(this, 'POST', '/webhooks', body)
                    : await GenericFunctions_1.calApiRequest.call(this, 'POST', '/hooks', body);
                if (responseData.webhook.id === undefined) {
                    // Required data is missing so was not successful
                    return false;
                }
                webhookData.webhookId = responseData.webhook.id;
                return true;
            },
            async delete() {
                const version = this.getNodeParameter('version', 0);
                const webhookData = this.getWorkflowStaticData('node');
                if (webhookData.webhookId !== undefined) {
                    const endpoint = version === 2
                        ? `/webhooks/${webhookData.webhookId}`
                        : `/hooks/${webhookData.webhookId}`;
                    try {
                        await GenericFunctions_1.calApiRequest.call(this, 'DELETE', endpoint);
                    }
                    catch (error) {
                        return false;
                    }
                    // Remove from the static workflow data so that it is clear
                    // that no webhooks are registered anymore
                    delete webhookData.webhookId;
                }
                return true;
            },
        },
    };
    async webhook() {
        const req = this.getRequestObject();
        return {
            workflowData: [
                this.helpers.returnJsonArray({
                    triggerEvent: req.body.triggerEvent,
                    createdAt: req.body.createdAt,
                    ...req.body.payload,
                }),
            ],
        };
    }
}
exports.CalTrigger = CalTrigger;
//# sourceMappingURL=CalTrigger.node.js.map