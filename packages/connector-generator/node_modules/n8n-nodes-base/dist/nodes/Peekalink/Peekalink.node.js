"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peekalink = exports.apiUrl = void 0;
const n8n_workflow_1 = require("n8n-workflow");
exports.apiUrl = 'https://api.peekalink.io';
class Peekalink extends n8n_workflow_1.Node {
    description = {
        displayName: 'Peekalink',
        name: 'peekalink',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:peekalink.png',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"]',
        description: 'Consume the Peekalink API',
        defaults: {
            name: 'Peekalink',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'peekalinkApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Is Available',
                        value: 'isAvailable',
                        description: 'Check whether preview for a given link is available',
                        action: 'Check whether the preview for a given link is available',
                    },
                    {
                        name: 'Preview',
                        value: 'preview',
                        description: 'Return the preview for a link',
                        action: 'Return the preview for a link',
                    },
                ],
                default: 'preview',
            },
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                required: true,
            },
        ],
    };
    async execute(context) {
        const items = context.getInputData();
        const operation = context.getNodeParameter('operation', 0);
        const credentials = await context.getCredentials('peekalinkApi');
        const returnData = await Promise.all(items.map(async (_, i) => {
            try {
                const link = context.getNodeParameter('url', i);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return await context.helpers.request({
                    method: 'POST',
                    uri: operation === 'preview' ? exports.apiUrl : `${exports.apiUrl}/is-available/`,
                    body: { link },
                    headers: { 'X-API-Key': credentials.apiKey },
                    json: true,
                });
            }
            catch (error) {
                if (context.continueOnFail()) {
                    return { error: error.message };
                }
                throw new n8n_workflow_1.NodeApiError(context.getNode(), error);
            }
        }));
        return [context.helpers.returnJsonArray(returnData)];
    }
}
exports.Peekalink = Peekalink;
//# sourceMappingURL=Peekalink.node.js.map