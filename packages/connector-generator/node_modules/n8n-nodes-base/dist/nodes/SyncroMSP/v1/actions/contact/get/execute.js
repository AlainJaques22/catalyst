"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContact = getContact;
const transport_1 = require("../../../transport");
async function getContact(index) {
    const id = this.getNodeParameter('contactId', index);
    const qs = {};
    const requestMethod = 'GET';
    const endpoint = `contacts/${id}`;
    const body = {};
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=execute.js.map