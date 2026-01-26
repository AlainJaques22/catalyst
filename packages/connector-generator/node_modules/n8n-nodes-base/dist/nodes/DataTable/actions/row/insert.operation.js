"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.FIELD = void 0;
exports.execute = execute;
exports.executeBulk = executeBulk;
const addRow_1 = require("../../common/addRow");
const utils_1 = require("../../common/utils");
exports.FIELD = 'insert';
const displayOptions = {
    show: {
        resource: ['row'],
        operation: [exports.FIELD],
    },
};
exports.description = [
    (0, addRow_1.makeAddRow)(exports.FIELD, displayOptions),
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
            {
                displayName: 'Optimize Bulk',
                name: 'optimizeBulk',
                type: 'boolean',
                default: false,
                noDataExpression: true, // bulk inserts don't support expressions so this is a bit paradoxical
                description: 'Whether to improve bulk insert performance 5x by not returning inserted data',
            },
        ],
        displayOptions,
    },
];
async function execute(index) {
    const optimizeBulkEnabled = this.getNodeParameter('options.optimizeBulk', index, false);
    const dataTableProxy = await (0, utils_1.getDataTableProxyExecute)(this, index);
    const row = (0, addRow_1.getAddRow)(this, index);
    if (optimizeBulkEnabled) {
        // This function is always called by index, so we inherently cannot operate in bulk
        this.addExecutionHints({
            message: 'Unable to optimize bulk insert due to expression in Data table ID ',
            location: 'outputPane',
        });
        const json = await dataTableProxy.insertRows([row], 'count');
        return [{ json }];
    }
    else {
        const insertedRows = await dataTableProxy.insertRows([row], 'all');
        return insertedRows.map((json, item) => ({ json, pairedItem: { item } }));
    }
}
async function executeBulk(proxy) {
    const optimizeBulkEnabled = this.getNodeParameter('options.optimizeBulk', 0, false);
    const rows = this.getInputData().flatMap((_, i) => [(0, addRow_1.getAddRow)(this, i)]);
    if (optimizeBulkEnabled) {
        const json = await proxy.insertRows(rows, 'count');
        return [{ json }];
    }
    else {
        const insertedRows = await proxy.insertRows(rows, 'all');
        return insertedRows.map((json, item) => ({ json, pairedItem: { item } }));
    }
}
//# sourceMappingURL=insert.operation.js.map