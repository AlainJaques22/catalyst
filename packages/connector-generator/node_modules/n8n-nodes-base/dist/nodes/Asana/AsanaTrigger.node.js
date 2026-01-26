"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsanaTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
// import {
// 	createHmac,
// } from 'crypto';
class AsanaTrigger {
    description = {
        displayName: 'Asana Trigger',
        name: 'asanaTrigger',
        icon: 'file:asana.svg',
        group: ['trigger'],
        version: 1,
        description: 'Starts the workflow when Asana events occur.',
        defaults: {
            name: 'Asana Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'asanaApi',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['accessToken'],
                    },
                },
            },
            {
                name: 'asanaOAuth2Api',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['oAuth2'],
                    },
                },
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
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                options: [
                    {
                        name: 'Access Token',
                        value: 'accessToken',
                    },
                    {
                        name: 'OAuth2',
                        value: 'oAuth2',
                    },
                ],
                default: 'accessToken',
            },
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'string',
                default: '',
                required: true,
                description: 'The resource ID to subscribe to. The resource can be a task or project.',
            },
            {
                displayName: 'Workspace Name or ID',
                name: 'workspace',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getWorkspaces',
                },
                options: [],
                default: '',
                description: 'The workspace ID the resource is registered under. This is only required if you want to allow overriding existing webhooks. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            },
        ],
    };
    methods = {
        loadOptions: {
            // Get all the available workspaces to display them to user so that they can
            // select them easily
            async getWorkspaces() {
                const workspaces = await GenericFunctions_1.getWorkspaces.call(this);
                workspaces.unshift({
                    name: '',
                    value: '',
                });
                return workspaces;
            },
        },
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
                const resource = this.getNodeParameter('resource');
                const workspace = this.getNodeParameter('workspace');
                const { data } = await GenericFunctions_1.asanaApiRequest.call(this, 'GET', '/webhooks', {}, { workspace });
                for (const webhook of data) {
                    if (webhook.resource.gid === resource && webhook.target === webhookUrl) {
                        webhookData.webhookId = webhook.gid;
                        return true;
                    }
                }
                // If it did not error then the webhook exists
                return false;
            },
            async create() {
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
                if (webhookUrl.includes('%20')) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The name of the Asana Trigger Node is not allowed to contain any spaces!');
                }
                const resource = this.getNodeParameter('resource');
                const body = {
                    resource,
                    target: webhookUrl,
                };
                const responseData = await GenericFunctions_1.asanaApiRequest.call(this, 'POST', '/webhooks', body);
                if (responseData.data === undefined || responseData.data.gid === undefined) {
                    // Required data is missing so was not successful
                    return false;
                }
                webhookData.webhookId = responseData.data.gid;
                return true;
            },
            async delete() {
                const webhookData = this.getWorkflowStaticData('node');
                if (webhookData.webhookId !== undefined) {
                    const body = {};
                    try {
                        await GenericFunctions_1.asanaApiRequest.call(this, 'DELETE', `/webhooks/${webhookData.webhookId}`, body);
                    }
                    catch (error) {
                        return false;
                    }
                    // Remove from the static workflow data so that it is clear
                    // that no webhooks are registered anymore
                    delete webhookData.webhookId;
                    delete webhookData.webhookEvents;
                    delete webhookData.hookSecret;
                }
                return true;
            },
        },
    };
    async webhook() {
        const bodyData = this.getBodyData();
        const headerData = this.getHeaderData();
        const req = this.getRequestObject();
        const webhookData = this.getWorkflowStaticData('node');
        if (headerData['x-hook-secret'] !== undefined) {
            // Is a create webhook confirmation request
            webhookData.hookSecret = headerData['x-hook-secret'];
            const res = this.getResponseObject();
            res.set('X-Hook-Secret', webhookData.hookSecret);
            res.status(200).end();
            return {
                noWebhookResponse: true,
            };
        }
        // Is regular webhook call
        // Check if it contains any events
        if (bodyData.events === undefined ||
            !Array.isArray(bodyData.events) ||
            bodyData.events.length === 0) {
            // Does not contain any event data so nothing to process so no reason to
            // start the workflow
            return {};
        }
        // TODO: Had to be deactivated as it is currently not possible to get the secret
        //       in production mode as the static data overwrites each other because the
        //       two exist at the same time (create webhook [with webhookId] and receive
        //       webhook [with secret])
        // // Check if the request is valid
        // // (if the signature matches to data and hookSecret)
        // const computedSignature = createHmac('sha256', webhookData.hookSecret as string).update(JSON.stringify(req.body)).digest('hex');
        // if (headerData['x-hook-signature'] !== computedSignature) {
        // 	// Signature is not valid so ignore call
        // 	return {};
        // }
        return {
            workflowData: [this.helpers.returnJsonArray(req.body.events)],
        };
    }
}
exports.AsanaTrigger = AsanaTrigger;
//# sourceMappingURL=AsanaTrigger.node.js.map