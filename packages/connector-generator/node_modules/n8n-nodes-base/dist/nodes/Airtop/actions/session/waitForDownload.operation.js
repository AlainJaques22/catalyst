"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const constants_1 = require("../../constants");
const GenericFunctions_1 = require("../../GenericFunctions");
const fields_1 = require("../common/fields");
const displayOptions = {
    show: {
        resource: ['session'],
        operation: ['waitForDownload'],
    },
};
exports.description = [
    {
        ...fields_1.sessionIdField,
        displayOptions,
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions,
        options: [
            {
                displayName: 'Timeout',
                description: 'Time in seconds to wait for the download to become available',
                name: 'timeout',
                type: 'number',
                default: constants_1.DEFAULT_DOWNLOAD_TIMEOUT_SECONDS,
            },
        ],
    },
];
async function execute(index) {
    const sessionId = GenericFunctions_1.validateSessionId.call(this, index);
    const timeout = this.getNodeParameter('timeout', index, constants_1.DEFAULT_DOWNLOAD_TIMEOUT_SECONDS);
    // Wait for a file_status event with status 'available'
    const event = await GenericFunctions_1.waitForSessionEvent.call(this, sessionId, (sessionEvent) => sessionEvent.event === 'file_status' && sessionEvent.status === 'available', timeout);
    // Extract fileId and downloadUrl from the event
    const result = {
        fileId: event.fileId,
        downloadUrl: event.downloadUrl,
    };
    return this.helpers.returnJsonArray({
        sessionId,
        data: result,
    });
}
//# sourceMappingURL=waitForDownload.operation.js.map