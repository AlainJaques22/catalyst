"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoles = getRoles;
const transport_1 = require("../transport");
async function getRoles() {
    const endpoint = '/services/authorization/roles';
    const responseData = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint);
    return responseData.map((entry) => ({
        name: entry.id,
        value: entry.id,
    }));
}
//# sourceMappingURL=loadOptions.js.map