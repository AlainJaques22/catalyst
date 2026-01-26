"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
const transport_1 = require("../../../transport");
async function getAll(index) {
    const postId = this.getNodeParameter('postId', index);
    const limit = this.getNodeParameter('limit', 0, 0);
    const qs = {};
    const requestMethod = 'GET';
    const endpoint = `posts/${postId}/reactions`;
    const body = {};
    let responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    if (responseData === null) {
        return [];
    }
    if (limit > 0) {
        responseData = responseData.slice(0, limit);
    }
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=execute.js.map