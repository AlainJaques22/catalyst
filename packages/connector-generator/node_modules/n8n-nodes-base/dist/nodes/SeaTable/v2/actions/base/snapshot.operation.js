"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
exports.properties = [];
const displayOptions = {
    show: {
        resource: ['base'],
        operation: ['snapshot'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute() {
    const responseData = await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'POST', '/api-gateway/api/v2/dtables/{{dtable_uuid}}/snapshot/', { dtable_name: 'snapshot' });
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=snapshot.operation.js.map