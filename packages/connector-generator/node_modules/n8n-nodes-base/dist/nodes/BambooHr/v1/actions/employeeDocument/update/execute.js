"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = update;
const transport_1 = require("../../../transport");
async function update(index) {
    let body = {};
    const requestMethod = 'POST';
    //meta data
    const id = this.getNodeParameter('employeeId', index);
    const fileId = this.getNodeParameter('fileId', index);
    //endpoint
    const endpoint = `employees/${id}/files/${fileId}`;
    //body parameters
    body = this.getNodeParameter('updateFields', index);
    body.shareWithEmployee ? (body.shareWithEmployee = 'yes') : (body.shareWithEmployee = 'no');
    //response
    await transport_1.apiRequest.call(this, requestMethod, endpoint, body);
    //return
    return this.helpers.returnJsonArray({ success: true });
}
//# sourceMappingURL=execute.js.map