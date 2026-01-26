"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const session_utils_1 = require("../common/session.utils");
async function execute(index) {
    const result = await session_utils_1.executeRequestWithSessionManagement.call(this, index, {
        method: 'POST',
        path: '/sessions/{sessionId}/windows/{windowId}/scrape-content',
        body: {},
    });
    return this.helpers.returnJsonArray({ ...result });
}
//# sourceMappingURL=scrape.operation.js.map