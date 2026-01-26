"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Perplexity = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
class Perplexity {
    description = {
        displayName: 'Perplexity',
        name: 'perplexity',
        icon: {
            light: 'file:perplexity.svg',
            dark: 'file:perplexity.dark.svg',
        },
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with the Perplexity API to generate AI responses with citations',
        defaults: {
            name: 'Perplexity',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'perplexityApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.perplexity.ai',
            ignoreHttpStatusErrors: true,
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'hidden',
                noDataExpression: true,
                options: [
                    {
                        name: 'Chat',
                        value: 'chat',
                    },
                ],
                default: 'chat',
            },
            ...descriptions_1.chat.description,
        ],
    };
}
exports.Perplexity = Perplexity;
//# sourceMappingURL=Perplexity.node.js.map