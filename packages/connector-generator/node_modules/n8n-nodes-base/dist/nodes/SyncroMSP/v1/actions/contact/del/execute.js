"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = deleteContact;
const transport_1 = require("../../../transport");
async function deleteContact(index) {
    const id = this.getNodeParameter('contactId', index);
    const qs = {};
    const requestMethod = 'DELETE';
    const endpoint = `contacts/${id}`;
    const body = {};
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=execute.js.map