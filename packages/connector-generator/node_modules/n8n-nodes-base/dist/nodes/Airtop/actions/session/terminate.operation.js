"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
const fields_1 = require("../common/fields");
exports.description = [
    {
        ...fields_1.sessionIdField,
        displayOptions: {
            show: {
                resource: ['session'],
                operation: ['terminate'],
            },
        },
    },
];
async function execute(index) {
    const sessionId = GenericFunctions_1.validateSessionId.call(this, index);
    const response = await transport_1.apiRequest.call(this, 'DELETE', `/sessions/${sessionId}`);
    // validate response
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ success: true });
}
//# sourceMappingURL=terminate.operation.js.map