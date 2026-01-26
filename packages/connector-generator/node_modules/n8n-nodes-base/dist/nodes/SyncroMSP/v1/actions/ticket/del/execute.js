"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = deleteTicket;
const transport_1 = require("../../../transport");
async function deleteTicket(index) {
    const id = this.getNodeParameter('ticketId', index);
    const qs = {};
    const requestMethod = 'DELETE';
    const endpoint = `tickets/${id}`;
    const body = {};
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=execute.js.map