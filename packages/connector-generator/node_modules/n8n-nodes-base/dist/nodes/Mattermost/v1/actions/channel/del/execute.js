"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = del;
const transport_1 = require("../../../transport");
async function del(index) {
    const channelId = this.getNodeParameter('channelId', index);
    const body = {};
    const qs = {};
    const requestMethod = 'DELETE';
    const endpoint = `channels/${channelId}`;
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=execute.js.map