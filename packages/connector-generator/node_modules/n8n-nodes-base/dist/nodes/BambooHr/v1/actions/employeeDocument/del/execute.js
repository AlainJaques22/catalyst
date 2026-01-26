"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = del;
const transport_1 = require("../../../transport");
async function del(index) {
    const body = {};
    const requestMethod = 'DELETE';
    //meta data
    const id = this.getNodeParameter('employeeId', index);
    const fileId = this.getNodeParameter('fileId', index);
    //endpoint
    const endpoint = `employees/${id}/files/${fileId}`;
    //response
    await transport_1.apiRequest.call(this, requestMethod, endpoint, body);
    //return
    return this.helpers.returnJsonArray({ success: true });
}
//# sourceMappingURL=execute.js.map