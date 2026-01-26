"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const helpers_1 = require("./helpers");
const utilities_1 = require("../../../../utils/utilities");
const transport_1 = require("../../transport");
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['getMany'],
    },
};
exports.description = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions,
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['file'],
                operation: ['getMany'],
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        default: 10,
        description: 'Max number of results to return',
    },
    {
        displayName: 'Session IDs',
        name: 'sessionIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of <a href="https://docs.airtop.ai/api-reference/airtop-api/sessions/create" target="_blank">Session IDs</a> to filter files by. When empty, all files from all sessions will be returned.',
        placeholder: 'e.g. 6aac6f73-bd89-4a76-ab32-5a6c422e8b0b, a13c6f73-bd89-4a76-ab32-5a6c422e8224',
        displayOptions,
    },
    {
        displayName: 'Output Files in Single Item',
        name: 'outputSingleItem',
        type: 'boolean',
        default: true,
        description: 'Whether to output one item containing all files or output each file as a separate item',
        displayOptions,
    },
];
async function execute(index) {
    const returnAll = this.getNodeParameter('returnAll', index, false);
    const limit = this.getNodeParameter('limit', index, 10);
    const sessionIds = this.getNodeParameter('sessionIds', index, '');
    const outputSingleItem = this.getNodeParameter('outputSingleItem', index, true);
    const endpoint = '/files';
    let files = [];
    const responseData = returnAll
        ? await helpers_1.requestAllFiles.call(this, sessionIds)
        : await transport_1.apiRequest.call(this, 'GET', endpoint, {}, { sessionIds, limit });
    if (responseData.data?.files && Array.isArray(responseData.data?.files)) {
        files = responseData.data.files;
    }
    /**
     * Returns the files in one of two formats:
     * - A single JSON item containing an array of all files (when outputSingleItem = true)
     * - Multiple JSON items, one per file
     * Data structure reference: https://docs.n8n.io/courses/level-two/chapter-1/#data-structure-of-n8n
     */
    if (outputSingleItem) {
        return this.helpers.returnJsonArray({ ...responseData });
    }
    return (0, utilities_1.wrapData)(files);
}
//# sourceMappingURL=getMany.operation.js.map