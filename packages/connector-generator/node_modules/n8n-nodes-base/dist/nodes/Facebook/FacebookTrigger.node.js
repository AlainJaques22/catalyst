"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookTrigger = void 0;
const change_case_1 = require("change-case");
const crypto_1 = require("crypto");
const n8n_workflow_1 = require("n8n-workflow");
const uuid_1 = require("uuid");
const GenericFunctions_1 = require("./GenericFunctions");
class FacebookTrigger {
    description = {
        displayName: 'Facebook Trigger',
        name: 'facebookTrigger',
        icon: 'file:facebook.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["appId"] +"/"+ $parameter["object"]}}',
        description: 'Starts the workflow when Facebook events occur',
        defaults: {
            name: 'Facebook Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'facebookGraphAppApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'setup',
                httpMethod: 'GET',
                responseMode: 'onReceived',
                path: 'webhook',
            },
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'APP ID',
                name: 'appId',
                type: 'string',
                required: true,
                default: '',
                description: 'Facebook APP ID',
            },
            {
                displayName: 'To watch Whatsapp business account events use the Whatsapp trigger node',
                name: 'whatsappBusinessAccountNotice',
                type: 'notice',
                default: '',
                displayOptions: {
                    show: {
                        object: ['whatsappBusinessAccount'],
                    },
                },
            },
            {
                displayName: 'Object',
                name: 'object',
                type: 'options',
                options: [
                    {
                        name: 'Ad Account',
                        value: 'adAccount',
                        description: 'Get updates about Ad Account',
                    },
                    {
                        name: 'Application',
                        value: 'application',
                        description: 'Get updates about the app',
                    },
                    {
                        name: 'Certificate Transparency',
                        value: 'certificateTransparency',
                        description: 'Get updates about Certificate Transparency',
                    },
                    {
                        name: 'Group',
                        value: 'group',
                        description: 'Get updates about activity in groups and events in groups for Workplace',
                    },
                    {
                        name: 'Instagram',
                        value: 'instagram',
                        description: 'Get updates about comments on your media',
                    },
                    {
                        name: 'Link',
                        value: 'link',
                        description: 'Get updates about links for rich previews by an external provider',
                    },
                    {
                        name: 'Page',
                        value: 'page',
                        description: 'Page updates',
                    },
                    {
                        name: 'Permissions',
                        value: 'permissions',
                        description: 'Updates regarding granting or revoking permissions',
                    },
                    {
                        name: 'User',
                        value: 'user',
                        description: 'User profile updates',
                    },
                    {
                        name: 'Whatsapp Business Account',
                        value: 'whatsappBusinessAccount',
                        description: 'Get updates about Whatsapp business account',
                    },
                    {
                        name: 'Workplace Security',
                        value: 'workplaceSecurity',
                        description: 'Get updates about Workplace Security',
                    },
                ],
                required: true,
                default: 'user',
                description: 'The object to subscribe to',
            },
            //https://developers.facebook.com/docs/graph-api/webhooks/reference/page
            {
                displayName: 'Field Names or IDs',
                name: 'fields',
                type: 'multiOptions',
                typeOptions: {
                    loadOptionsMethod: 'getObjectFields',
                    loadOptionsDependsOn: ['object'],
                },
                default: [],
                description: 'The set of fields in this object that are subscribed to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                default: {},
                placeholder: 'Add option',
                options: [
                    {
                        displayName: 'Include Values',
                        name: 'includeValues',
                        type: 'boolean',
                        default: true,
                        description: 'Whether change notifications should include the new values',
                    },
                ],
            },
        ],
    };
    methods = {
        loadOptions: {
            // Get all the available organizations to display them to user so that they can
            // select them easily
            async getObjectFields() {
                const object = this.getCurrentNodeParameter('object');
                return (0, GenericFunctions_1.getFields)(object);
            },
        },
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const object = this.getNodeParameter('object');
                const appId = this.getNodeParameter('appId');
                const { data } = (await GenericFunctions_1.facebookApiRequest.call(this, 'GET', `/${appId}/subscriptions`, {}));
                const subscription = data.find((webhook) => webhook.object === object && webhook.status);
                if (!subscription) {
                    return false;
                }
                if (subscription.callback_url !== webhookUrl) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The Facebook App ID ${appId} already has a webhook subscription. Delete it or use another App before executing the trigger. Due to Facebook API limitations, you can have just one trigger per App.`, { level: 'warning' });
                }
                return true;
            },
            async create() {
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
                const object = this.getNodeParameter('object');
                const appId = this.getNodeParameter('appId');
                const fields = this.getNodeParameter('fields');
                const options = this.getNodeParameter('options');
                const body = {
                    object: (0, change_case_1.snakeCase)(object),
                    callback_url: webhookUrl,
                    verify_token: (0, uuid_1.v4)(),
                    fields: fields.includes('*') ? (0, GenericFunctions_1.getAllFields)(object) : fields,
                };
                if (options.includeValues !== undefined) {
                    body.include_values = options.includeValues;
                }
                const responseData = await GenericFunctions_1.facebookApiRequest.call(this, 'POST', `/${appId}/subscriptions`, body);
                webhookData.verifyToken = body.verify_token;
                if (responseData.success !== true) {
                    // Facebook did not return success, so something went wrong
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData, {
                        message: 'Facebook webhook creation response did not contain the expected data.',
                    });
                }
                return true;
            },
            async delete() {
                const appId = this.getNodeParameter('appId');
                const object = this.getNodeParameter('object');
                try {
                    await GenericFunctions_1.facebookApiRequest.call(this, 'DELETE', `/${appId}/subscriptions`, {
                        object: (0, change_case_1.snakeCase)(object),
                    });
                }
                catch (error) {
                    return false;
                }
                return true;
            },
        },
    };
    async webhook() {
        const bodyData = this.getBodyData();
        const query = this.getQueryData();
        const res = this.getResponseObject();
        const req = this.getRequestObject();
        const headerData = this.getHeaderData();
        const credentials = await this.getCredentials('facebookGraphAppApi');
        // Check if we're getting facebook's challenge request (https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
        if (this.getWebhookName() === 'setup') {
            if (query['hub.challenge']) {
                //TODO
                //compare hub.verify_token with the saved token
                //const webhookData = this.getWorkflowStaticData('node');
                // if (webhookData.verifyToken !== query['hub.verify_token']) {
                // 	return {};
                // }
                res.status(200).send(query['hub.challenge']).end();
                return {
                    noWebhookResponse: true,
                };
            }
        }
        // validate signature if app secret is set
        if (credentials.appSecret !== '') {
            const computedSignature = (0, crypto_1.createHmac)('sha1', credentials.appSecret)
                .update(req.rawBody)
                .digest('hex');
            if (headerData['x-hub-signature'] !== `sha1=${computedSignature}`) {
                return {};
            }
        }
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData.entry)],
        };
    }
}
exports.FacebookTrigger = FacebookTrigger;
//# sourceMappingURL=FacebookTrigger.node.js.map