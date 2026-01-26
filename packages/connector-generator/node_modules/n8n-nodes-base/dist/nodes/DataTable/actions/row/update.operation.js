"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.FIELD = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const addRow_1 = require("../../common/addRow");
const fields_1 = require("../../common/fields");
const selectMany_1 = require("../../common/selectMany");
const utils_1 = require("../../common/utils");
exports.FIELD = 'update';
const displayOptions = {
    show: {
        resource: ['row'],
        operation: [exports.FIELD],
    },
};
exports.description = [
    ...(0, selectMany_1.getSelectFields)(displayOptions),
    (0, addRow_1.makeAddRow)(exports.FIELD, displayOptions),
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
    const row = (0, addRow_1.getAddRow)(this, index);
    const filter = await (0, selectMany_1.getSelectFilter)(this, index);
    if (filter.filters.length === 0) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one condition is required');
    }
    const updatedRows = await dataTableProxy.updateRows({
        data: row,
        filter,
        dryRun,
    });
    return updatedRows.map((json) => ({ json }));
}
//# sourceMappingURL=update.operation.js.map