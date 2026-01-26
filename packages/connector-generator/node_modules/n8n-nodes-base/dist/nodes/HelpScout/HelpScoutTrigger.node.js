"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpScoutTrigger = void 0;
const crypto_1 = require("crypto");
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class HelpScoutTrigger {
    description = {
        displayName: 'Help Scout Trigger',
        name: 'helpScoutTrigger',
        icon: 'file:helpScout.svg',
        group: ['trigger'],
        version: 1,
        description: 'Starts the workflow when Help Scout events occur',
        defaults: {
            name: 'Help Scout Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'helpScoutOAuth2Api',
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
                        name: 'Conversation - Assigned',
                        value: 'convo.assigned',
                    },
                    {
                        name: 'Conversation - Created',
                        value: 'convo.created',
                    },
                    {
                        name: 'Conversation - Deleted',
                        value: 'convo.deleted',
                    },
                    {
                        name: 'Conversation - Merged',
                        value: 'convo.merged',
                    },
                    {
                        name: 'Conversation - Moved',
                        value: 'convo.moved',
                    },
                    {
                        name: 'Conversation - Status',
                        value: 'convo.status',
                    },
                    {
                        name: 'Conversation - Tags',
                        value: 'convo.tags',
                    },
                    {
                        name: 'Conversation Agent Reply - Created',
                        value: 'convo.agent.reply.created',
                    },
                    {
                        name: 'Conversation Customer Reply - Created',
                        value: 'convo.customer.reply.created',
                    },
                    {
                        name: 'Conversation Note - Created',
                        value: 'convo.note.created',
                    },
                    {
                        name: 'Customer - Created',
                        value: 'customer.created',
                    },
                    {
                        name: 'Rating - Received',
                        value: 'satisfaction.ratings',
                    },
                ],
                default: [],
                required: true,
            },
        ],
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                const events = this.getNodeParameter('events');
                // Check all the webhooks which exist already if it is identical to the
                // one that is supposed to get created.
                const endpoint = '/v2/webhooks';
                const data = await GenericFunctions_1.helpscoutApiRequestAllItems.call(this, '_embedded.webhooks', 'GET', endpoint, {});
                for (const webhook of data) {
                    if (webhook.url === webhookUrl) {
                        for (const event of events) {
                            if (!webhook.events.includes(event) && webhook.state === 'enabled') {
                                return false;
                            }
                        }
                    }
                    // Set webhook-id to be sure that it can be deleted
                    webhookData.webhookId = webhook.id;
                    return true;
                }
                return false;
            },
            async create() {
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
                const events = this.getNodeParameter('events');
                const endpoint = '/v2/webhooks';
                const body = {
                    url: webhookUrl,
                    events,
                    secret: (0, n8n_workflow_1.randomString)(10).toLowerCase(),
                };
                const responseData = await GenericFunctions_1.helpscoutApiRequest.call(this, 'POST', endpoint, body, {}, undefined, { resolveWithFullResponse: true });
                if (responseData.headers['resource-id'] === undefined) {
                    // Required data is missing so was not successful
                    return false;
                }
                webhookData.webhookId = responseData.headers['resource-id'];
                webhookData.secret = body.secret;
                return true;
            },
            async delete() {
                const webhookData = this.getWorkflowStaticData('node');
                if (webhookData.webhookId !== undefined) {
                    const endpoint = `/v2/webhooks/${webhookData.webhookId}`;
                    try {
                        await GenericFunctions_1.helpscoutApiRequest.call(this, 'DELETE', endpoint);
                    }
                    catch (error) {
                        return false;
                    }
                    // Remove from the static workflow data so that it is clear
                    // that no webhooks are registered anymore
                    delete webhookData.webhookId;
                    delete webhookData.secret;
                }
                return true;
            },
        },
    };
    async webhook() {
        const req = this.getRequestObject();
        const bodyData = this.getBodyData();
        const headerData = this.getHeaderData();
        const webhookData = this.getWorkflowStaticData('node');
        if (headerData['x-helpscout-signature'] === undefined) {
            return {};
        }
        const computedSignature = (0, crypto_1.createHmac)('sha1', webhookData.secret)
            .update(req.rawBody)
            .digest('base64');
        if (headerData['x-helpscout-signature'] !== computedSignature) {
            return {};
        }
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.HelpScoutTrigger = HelpScoutTrigger;
//# sourceMappingURL=HelpScoutTrigger.node.js.map