"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
exports.properties = [
    descriptions_1.messageRLC,
    ...descriptions_1.returnAllOrLimit,
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Fields',
                name: 'fields',
                type: 'multiOptions',
                description: 'The fields to add to the output',
                default: [],
                options: [
                    {
                        name: 'contentType',
                        value: 'contentType',
                    },
                    {
                        name: 'isInline',
                        value: 'isInline',
                    },
                    {
                        name: 'lastModifiedDateTime',
                        value: 'lastModifiedDateTime',
                    },
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                        name: 'name',
                        value: 'name',
                    },
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                        name: 'size',
                        value: 'size',
                    },
                ],
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['messageAttachment'],
        operation: ['getAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    let responseData;
    const qs = {};
    const messageId = this.getNodeParameter('messageId', index, undefined, {
        extractValue: true,
    });
    const returnAll = this.getNodeParameter('returnAll', index);
    const options = this.getNodeParameter('options', index);
    // Have sane defaults so we don't fetch attachment data in this operation
    qs.$select = 'id,lastModifiedDateTime,name,contentType,size,isInline';
    if (options.fields && options.fields.length) {
        qs.$select = options.fields.map((field) => field.trim()).join(',');
    }
    const endpoint = `/messages/${messageId}/attachments`;
    if (returnAll) {
        responseData = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', endpoint, undefined, qs);
    }
    else {
        qs.$top = this.getNodeParameter('limit', index);
        responseData = await transport_1.microsoftApiRequest.call(this, 'GET', endpoint, undefined, qs);
        responseData = responseData.value;
    }
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: index } });
    return executionData;
}
//# sourceMappingURL=getAll.operation.js.map