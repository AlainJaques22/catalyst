"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statistics = statistics;
const transport_1 = require("../../../transport");
async function statistics(index) {
    const channelId = this.getNodeParameter('channelId', index);
    const body = {};
    const qs = {};
    const requestMethod = 'GET';
    const endpoint = `channels/${channelId}/stats`;
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=execute.js.map