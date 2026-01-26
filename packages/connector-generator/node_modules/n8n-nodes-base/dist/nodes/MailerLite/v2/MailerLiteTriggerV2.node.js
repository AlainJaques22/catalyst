"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerLiteTriggerV2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../GenericFunctions");
class MailerLiteTriggerV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            displayName: 'MailerLite Trigger',
            name: 'mailerLiteTrigger',
            group: ['trigger'],
            version: [2],
            description: 'Starts the workflow when MailerLite events occur',
            defaults: {
                name: 'MailerLite Trigger',
            },
            inputs: [],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'mailerLiteApi',
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
                            name: 'Campaign Sent',
                            value: 'campaign.sent',
                            description: 'Fired when campaign is sent',
                        },
                        {
                            name: 'Subscriber Added to Group',
                            value: 'subscriber.added_to_group',
                            description: 'Fired when a subscriber is added to a group',
                        },
                        {
                            name: 'Subscriber Automation Completed',
                            value: 'subscriber.automation_completed',
                            description: 'Fired when subscriber finishes automation',
                        },
                        {
                            name: 'Subscriber Automation Triggered',
                            value: 'subscriber.automation_triggered',
                            description: 'Fired when subscriber starts automation',
                        },
                        {
                            name: 'Subscriber Bounced',
                            value: 'subscriber.bounced',
                            description: 'Fired when an email address bounces',
                        },
                        {
                            name: 'Subscriber Created',
                            value: 'subscriber.created',
                            description: 'Fired when a new subscriber is added to an account',
                        },
                        {
                            name: 'Subscriber Removed From Group',
                            value: 'subscriber.removed_from_group',
                            description: 'Fired when a subscriber is removed from a group',
                        },
                        {
                            name: 'Subscriber Spam Reported',
                            value: 'subscriber.spam_reported',
                            description: 'Fired when subscriber marks a campaign as a spam',
                        },
                        {
                            name: 'Subscriber Unsubscribe',
                            value: 'subscriber.unsubscribed',
                            description: 'Fired when a subscriber becomes unsubscribed',
                        },
                        {
                            name: 'Subscriber Updated',
                            value: 'subscriber.updated',
                            description: "Fired when any of the subscriber's custom fields are updated",
                        },
                    ],
                    required: true,
                    default: [],
                    description: 'The events to listen to',
                },
            ],
        };
    }
    webhookMethods = {
        default: {
            async checkExists() {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                const events = this.getNodeParameter('events');
                // Check all the webhooks which exist already if it is identical to the
                // one that is supposed to get created.
                const endpoint = '/webhooks';
                const { data } = await GenericFunctions_1.mailerliteApiRequest.call(this, 'GET', endpoint, {});
                for (const webhook of data) {
                    if (webhook.url === webhookUrl && webhook.events === events) {
                        // Set webhook-id to be sure that it can be deleted
                        webhookData.webhookId = webhook.id;
                        return true;
                    }
                }
                return false;
            },
            async create() {
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
                const events = this.getNodeParameter('events');
                const endpoint = '/webhooks';
                const body = {
                    url: webhookUrl,
                    events,
                };
                const { data } = await GenericFunctions_1.mailerliteApiRequest.call(this, 'POST', endpoint, body);
                if (data.id === undefined) {
                    // Required data is missing so was not successful
                    return false;
                }
                webhookData.webhookId = data.id;
                return true;
            },
            async delete() {
                const webhookData = this.getWorkflowStaticData('node');
                if (webhookData.webhookId !== undefined) {
                    const endpoint = `/webhooks/${webhookData.webhookId}`;
                    try {
                        await GenericFunctions_1.mailerliteApiRequest.call(this, 'DELETE', endpoint);
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
        const body = this.getBodyData();
        const data = body.fields;
        return {
            workflowData: [this.helpers.returnJsonArray(data)],
        };
    }
}
exports.MailerLiteTriggerV2 = MailerLiteTriggerV2;
//# sourceMappingURL=MailerLiteTriggerV2.node.js.map