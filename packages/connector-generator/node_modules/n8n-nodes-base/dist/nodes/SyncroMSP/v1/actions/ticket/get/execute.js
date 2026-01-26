"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicket = getTicket;
const transport_1 = require("../../../transport");
async function getTicket(index) {
    const id = this.getNodeParameter('ticketId', index);
    const qs = {};
    const requestMethod = 'GET';
    const endpoint = `tickets/${id}`;
    const body = {};
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    return this.helpers.returnJsonArray(responseData.ticket);
}
//# sourceMappingURL=execute.js.map