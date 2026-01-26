"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const fields_1 = require("../common/fields");
const output_utils_1 = require("../common/output.utils");
const session_utils_1 = require("../common/session.utils");
exports.description = [
    {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: '',
        placeholder: 'e.g. Is there a login form in this page?',
        displayOptions: {
            show: {
                resource: ['extraction'],
                operation: ['query'],
            },
        },
        description: 'The prompt to query the page content',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['extraction'],
                operation: ['query'],
            },
        },
        options: [
            {
                ...fields_1.outputSchemaField,
            },
            {
                ...fields_1.parseJsonOutputField,
            },
            {
                displayName: 'Include Visual Analysis',
                name: 'includeVisualAnalysis',
                type: 'boolean',
                default: false,
                description: 'Whether to analyze the web page visually when fulfilling the request',
            },
        ],
    },
];
async function execute(index) {
    const prompt = this.getNodeParameter('prompt', index, '');
    const additionalFields = this.getNodeParameter('additionalFields', index, {});
    const outputSchema = additionalFields.outputSchema;
    const includeVisualAnalysis = additionalFields.includeVisualAnalysis;
    const result = await session_utils_1.executeRequestWithSessionManagement.call(this, index, {
        method: 'POST',
        path: '/sessions/{sessionId}/windows/{windowId}/page-query',
        body: {
            prompt,
            configuration: {
                experimental: {
                    includeVisualAnalysis: includeVisualAnalysis ? 'enabled' : 'disabled',
                },
                ...(outputSchema ? { outputSchema } : {}),
            },
        },
    });
    const nodeOutput = output_utils_1.parseJsonIfPresent.call(this, index, result);
    return this.helpers.returnJsonArray(nodeOutput);
}
//# sourceMappingURL=query.operation.js.map