"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
async function execute(index) {
    const { sessionId, windowId } = GenericFunctions_1.validateSessionAndWindowId.call(this, index);
    const response = await transport_1.apiRequest.call(this, 'DELETE', `/sessions/${sessionId}/windows/${windowId}`);
    // validate response
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ sessionId, windowId, ...response });
}
//# sourceMappingURL=close.operation.js.map