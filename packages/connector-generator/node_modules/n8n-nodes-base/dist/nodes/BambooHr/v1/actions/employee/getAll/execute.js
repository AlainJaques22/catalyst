"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
const transport_1 = require("../../../transport");
async function getAll(_index) {
    const body = {};
    const requestMethod = 'GET';
    const endpoint = 'employees/directory';
    //limit parameters
    const returnAll = this.getNodeParameter('returnAll', 0, false);
    const limit = this.getNodeParameter('limit', 0, 0);
    //response
    const responseData = await transport_1.apiRequest.call(this, requestMethod, endpoint, body);
    //return limited result
    if (!returnAll && responseData.employees.length > limit) {
        return this.helpers.returnJsonArray(responseData.employees.slice(0, limit));
    }
    //return all result
    return this.helpers.returnJsonArray(responseData.employees);
}
//# sourceMappingURL=execute.js.map