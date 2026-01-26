"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_1 = require("../common");
const properties = [
    { ...common_1.containerResourceLocator, description: 'Select the container you want to use' },
    {
        displayName: 'Item Contents',
        name: 'customProperties',
        default: '{\n\t"id": "replace_with_new_document_id"\n}',
        description: 'The item contents as a JSON object',
        displayOptions: {
            hide: {
                ...utils_1.untilContainerSelected,
            },
        },
        hint: 'The item requires an ID and partition key value if a custom key is set',
        required: true,
        routing: {
            send: {
                preSend: [
                    async function (requestOptions) {
                        const rawCustomProperties = this.getNodeParameter('customProperties');
                        const customProperties = (0, utils_1.processJsonInput)(rawCustomProperties, 'Item Contents', undefined, ['id']);
                        requestOptions.body = customProperties;
                        return requestOptions;
                    },
                ],
            },
        },
        type: 'json',
    },
];
const displayOptions = {
    show: {
        resource: ['item'],
        operation: ['create'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=create.operation.js.map