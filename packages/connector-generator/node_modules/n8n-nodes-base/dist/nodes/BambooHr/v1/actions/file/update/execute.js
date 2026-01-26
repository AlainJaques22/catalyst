"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = update;
const transport_1 = require("../../../transport");
async function update(index) {
    const body = {};
    const requestMethod = 'POST';
    //meta data
    const fileId = this.getNodeParameter('fileId', index);
    //endpoint
    const endpoint = `files/${fileId}`;
    //body parameters
    const shareWithEmployee = this.getNodeParameter('updateFields.shareWithEmployee', index, true);
    body.shareWithEmployee = shareWithEmployee ? 'yes' : 'no';
    //response
    await transport_1.apiRequest.call(this, requestMethod, endpoint, body);
    //return
    return this.helpers.returnJsonArray({ success: true });
}
//# sourceMappingURL=execute.js.map