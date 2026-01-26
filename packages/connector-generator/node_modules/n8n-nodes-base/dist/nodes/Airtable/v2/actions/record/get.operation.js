"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const properties = [
    {
        displayName: 'Record ID',
        name: 'id',
        type: 'string',
        default: '',
        placeholder: 'e.g. recf7EaZp707CEc8g',
        required: true,
        // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-id
        description: 'ID of the record to get. <a href="https://support.airtable.com/docs/record-id" target="_blank">More info</a>.',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        default: {},
        description: 'Additional options which decide which records should be returned',
        placeholder: 'Add option',
        options: [
            {
                // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
                displayName: 'Download Attachments',
                name: 'downloadFields',
                type: 'multiOptions',
                typeOptions: {
                    loadOptionsMethod: 'getAttachmentColumns',
                    loadOptionsDependsOn: ['base.value', 'table.value'],
                },
                default: [],
                // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
                description: "The fields of type 'attachment' that should be downloaded",
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['record'],
        operation: ['get'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(items, base, table) {
    const returnData = [];
    for (let i = 0; i < items.length; i++) {
        let id;
        try {
            id = this.getNodeParameter('id', i);
            const responseData = await transport_1.apiRequest.call(this, 'GET', `${base}/${table}/${id}`);
            const options = this.getNodeParameter('options', 0, {});
            if (options.downloadFields) {
                const itemWithAttachments = await transport_1.downloadRecordAttachments.call(this, [responseData], options.downloadFields);
                returnData.push(...itemWithAttachments);
                continue;
            }
            const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)((0, utils_1.flattenOutput)(responseData)), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        catch (error) {
            error = (0, utils_1.processAirtableError)(error, id, i);
            if (this.continueOnFail()) {
                returnData.push({ json: { error: error.message } });
                continue;
            }
            throw error;
        }
    }
    return returnData;
}
//# sourceMappingURL=get.operation.js.map