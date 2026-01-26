"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlert = deleteAlert;
const transport_1 = require("../../../transport");
async function deleteAlert(index) {
    const id = this.getNodeParameter('alertId', index);
    const qs = {};
    const requestMethod = 'DELETE';
    const endpoint = `rmm_alerts/${id}`;
    const body = {};
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=execute.js.map