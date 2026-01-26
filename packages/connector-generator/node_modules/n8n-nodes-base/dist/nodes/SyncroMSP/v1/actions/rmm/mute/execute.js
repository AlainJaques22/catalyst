"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.muteAlert = muteAlert;
const transport_1 = require("../../../transport");
async function muteAlert(index) {
    const id = this.getNodeParameter('alertId', index);
    const mute = this.getNodeParameter('muteFor', index);
    const qs = {};
    const requestMethod = 'POST';
    const endpoint = `rmm_alerts/${id}/mute`;
    const body = {};
    body.id = id;
    body.mute_for = mute;
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=execute.js.map