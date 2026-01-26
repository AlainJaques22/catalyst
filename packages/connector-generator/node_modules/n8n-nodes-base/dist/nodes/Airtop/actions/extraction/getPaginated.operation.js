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
        displayOptions: {
            show: {
                resource: ['extraction'],
                operation: ['getPaginated'],
            },
        },
        description: 'The prompt to extract data from the pages',
        placeholder: 'e.g. Extract all the product names and prices',
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
                operation: ['getPaginated'],
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
                displayName: 'Interaction Mode',
                name: 'interactionMode',
                type: 'options',
                default: 'auto',
                description: 'The strategy for interacting with the page',
                options: [
                    {
                        name: 'Auto',
                        description: 'Automatically choose the most cost-effective mode',
                        value: 'auto',
                    },
                    {
                        name: 'Accurate',
                        description: 'Prioritize accuracy over cost',
                        value: 'accurate',
                    },
                    {
                        name: 'Cost Efficient',
                        description: 'Minimize costs while ensuring effectiveness',
                        value: 'cost-efficient',
                    },
                ],
            },
            {
                displayName: 'Pagination Mode',
                name: 'paginationMode',
                type: 'options',
                default: 'auto',
                description: 'The pagination approach to use',
                options: [
                    {
                        name: 'Auto',
                        description: 'Look for pagination links first, then try infinite scrolling',
                        value: 'auto',
                    },
                    {
                        name: 'Paginated',
                        description: 'Only use pagination links',
                        value: 'paginated',
                    },
                    {
                        name: 'Infinite Scroll',
                        description: 'Scroll the page to load more content',
                        value: 'infinite-scroll',
                    },
                ],
            },
        ],
    },
];
async function execute(index) {
    const prompt = this.getNodeParameter('prompt', index, '');
    const additionalFields = this.getNodeParameter('additionalFields', index);
    const configFields = ['paginationMode', 'interactionMode', 'outputSchema'];
    const configuration = configFields.reduce((config, key) => (additionalFields[key] ? { ...config, [key]: additionalFields[key] } : config), {});
    const result = await session_utils_1.executeRequestWithSessionManagement.call(this, index, {
        method: 'POST',
        path: '/sessions/{sessionId}/windows/{windowId}/paginated-extraction',
        body: {
            prompt,
            configuration,
        },
    });
    const nodeOutput = output_utils_1.parseJsonIfPresent.call(this, index, result);
    return this.helpers.returnJsonArray(nodeOutput);
}
//# sourceMappingURL=getPaginated.operation.js.map