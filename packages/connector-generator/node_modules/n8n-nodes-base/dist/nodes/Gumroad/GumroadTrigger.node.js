"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GumroadTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class GumroadTrigger {
    // eslint-disable-next-line n8n-nodes-base/node-class-description-missing-subtitle
    description = {
        displayName: 'Gumroad Trigger',
        name: 'gumroadTrigger',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:gumroad.png',
        group: ['trigger'],
        version: 1,
        description: 'Handle Gumroad events via webhooks',
        defaults: {
            name: 'Gumroad Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'gumroadApi',
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
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                required: true,
                default: '',
                options: [
                    {
                        name: 'Cancellation',
                        value: 'cancellation',
                        description: "When subscribed to this resource, you will be notified of cancellations of the user's subscribers",
                    },
                    {
                        name: 'Dispute',
                        value: 'dispute',
                        description: "When subscribed to this resource, you will be notified of the disputes raised against user's sales",
                    },
                    {
                        name: 'Dispute Won',
                        value: 'dispute_won',
                        description: 'When subscribed to this resource, you will be notified of the sale disputes won',
                    },
                    {
                        name: 'Refund',
                        value: 'refund',
                        description: "When subscribed to this resource, you will be notified of refunds to the user's sales",
                    },
                    {
                        name: 'Sale',
                        value: 'sale',
                        description: "When subscribed to this resource, you will be notified of the user's sales",
                    },
                ],
                description: 'The resource is gonna fire the event',
            },
        ],
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const webhookData = this.getWorkflowStaticData('node');
                if (webhookData.webhookId === undefined) {
                    return false;
                }
                const endpoint = '/resource_subscriptions';
                const { resource_subscriptions } = await GenericFunctions_1.gumroadApiRequest.call(this, 'GET', endpoint);
                if (Array.isArray(resource_subscriptions)) {
                    for (const resource of resource_subscriptions) {
                        if (resource.id === webhookData.webhookId) {
                            return true;
                        }
                    }
                }
                return false;
            },
            async create() {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                const resource = this.getNodeParameter('resource');
                const endpoint = '/resource_subscriptions';
                const body = {
                    post_url: webhookUrl,
                    resource_name: resource,
                };
                const { resource_subscription } = await GenericFunctions_1.gumroadApiRequest.call(this, 'PUT', endpoint, body);
                webhookData.webhookId = resource_subscription.id;
                return true;
            },
            async delete() {
                let responseData;
                const webhookData = this.getWorkflowStaticData('node');
                const endpoint = `/resource_subscriptions/${webhookData.webhookId}`;
                try {
                    responseData = await GenericFunctions_1.gumroadApiRequest.call(this, 'DELETE', endpoint);
                }
                catch (error) {
                    return false;
                }
                if (!responseData.success) {
                    return false;
                }
                delete webhookData.webhookId;
                return true;
            },
        },
    };
    async webhook() {
        const req = this.getRequestObject();
        return {
            workflowData: [this.helpers.returnJsonArray(req.body)],
        };
    }
}
exports.GumroadTrigger = GumroadTrigger;
//# sourceMappingURL=GumroadTrigger.node.js.map