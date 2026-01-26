"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.FIELD = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const fields_1 = require("../../common/fields");
const selectMany_1 = require("../../common/selectMany");
const utils_1 = require("../../common/utils");
// named `deleteRows` since `delete` is a reserved keyword
exports.FIELD = 'deleteRows';
const displayOptions = {
    show: {
        resource: ['row'],
        operation: [exports.FIELD],
    },
};
exports.description = [
    ...(0, selectMany_1.getSelectFields)(displayOptions),
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        default: {},
        placeholder: 'Add option',
        options: [fields_1.DRY_RUN],
        displayOptions,
    },
];
async function execute(index) {
    const dataTableProxy = await (0, utils_1.getDataTableProxyExecute)(this, index);
    const dryRun = (0, utils_1.getDryRunParameter)(this, index);
    const filter = await (0, selectMany_1.getSelectFilter)(this, index);
    if (filter.filters.length === 0) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one condition is required');
    }
    const result = await dataTableProxy.deleteRows({ filter, dryRun });
    return result.map((json) => ({ json }));
}
//# sourceMappingURL=delete.operation.js.map