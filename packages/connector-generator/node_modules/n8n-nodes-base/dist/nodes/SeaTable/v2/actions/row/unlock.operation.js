"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const GenericFunctions_1 = require("../../GenericFunctions");
async function execute(index) {
    const tableName = this.getNodeParameter('tableName', index);
    const rowId = this.getNodeParameter('rowId', index);
    const responseData = await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'PUT', '/api-gateway/api/v2/dtables/{{dtable_uuid}}/unlock-rows/', {
        table_name: tableName,
        row_ids: [rowId],
    });
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=unlock.operation.js.map