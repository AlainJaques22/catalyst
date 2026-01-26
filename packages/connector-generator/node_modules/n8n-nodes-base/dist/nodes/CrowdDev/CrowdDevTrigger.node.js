"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrowdDevTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const credsName = 'crowdDevApi';
const getCreds = async (hookFns) => hookFns.getCredentials(credsName);
const createRequest = (creds, opts) => {
    const defaults = {
        baseURL: `${creds.url}/api/tenant/${creds.tenantId}`,
        url: '',
        json: true,
        skipSslCertificateValidation: creds.allowUnauthorizedCerts,
    };
    return Object.assign(defaults, opts);
};
class CrowdDevTrigger {
    description = {
        displayName: 'crowd.dev Trigger',
        name: 'crowdDevTrigger',
        icon: { light: 'file:crowdDev.svg', dark: 'file:crowdDev.dark.svg' },
        group: ['trigger'],
        version: 1,
        description: 'Starts the workflow when crowd.dev events occur.',
        defaults: {
            name: 'crowd.dev Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'crowdDevApi',
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
                displayName: 'Trigger',
                name: 'trigger',
                description: 'What will trigger an automation',
                type: 'options',
                required: true,
                default: 'new_activity',
                options: [
                    {
                        name: 'New Activity',
                        value: 'new_activity',
                    },
                    {
                        name: 'New Member',
                        value: 'new_member',
                    },
                ],
            },
        ],
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const creds = await getCreds(this);
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
                if (webhookData.webhookId !== undefined) {
                    try {
                        const options = createRequest(creds, {
                            url: `/automation/${webhookData.webhookId}`,
                            method: 'GET',
                        });
                        const data = await this.helpers.httpRequestWithAuthentication.call(this, credsName, options);
                        if (data.settings.url === webhookUrl) {
                            return true;
                        }
                    }
                    catch (error) {
                        return false;
                    }
                }
                // If it did not error then the webhook exists
                return false;
            },
            async create() {
                const creds = await getCreds(this);
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
                const params = {
                    trigger: this.getNodeParameter('trigger'),
                };
                const options = createRequest(creds, {
                    url: '/automation',
                    method: 'POST',
                    body: {
                        data: {
                            settings: {
                                url: webhookUrl,
                            },
                            type: 'webhook',
                            trigger: params.trigger,
                        },
                    },
                });
                const responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'crowdDevApi', options);
                if (responseData === undefined || responseData.id === undefined) {
                    // Required data is missing so was not successful
                    return false;
                }
                webhookData.webhookId = responseData.id;
                return true;
            },
            async delete() {
                const creds = await getCreds(this);
                const webhookData = this.getWorkflowStaticData('node');
                if (webhookData.webhookId !== undefined) {
                    try {
                        const options = createRequest(creds, {
                            url: `/automation/${webhookData.webhookId}`,
                            method: 'DELETE',
                        });
                        await this.helpers.httpRequestWithAuthentication.call(this, credsName, options);
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
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.CrowdDevTrigger = CrowdDevTrigger;
//# sourceMappingURL=CrowdDevTrigger.node.js.map