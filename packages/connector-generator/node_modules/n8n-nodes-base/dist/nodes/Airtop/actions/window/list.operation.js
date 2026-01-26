"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
exports.description = [];
async function execute(index) {
    const sessionId = GenericFunctions_1.validateSessionId.call(this, index);
    const response = await transport_1.apiRequest.call(this, 'GET', `/sessions/${sessionId}/windows`, undefined);
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    return this.helpers.returnJsonArray({ sessionId, ...response });
}
//# sourceMappingURL=list.operation.js.map