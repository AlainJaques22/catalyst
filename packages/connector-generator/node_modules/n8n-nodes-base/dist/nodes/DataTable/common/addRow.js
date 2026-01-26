"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddRow = makeAddRow;
exports.getAddRow = getAddRow;
const n8n_workflow_1 = require("n8n-workflow");
const fields_1 = require("./fields");
const utils_1 = require("./utils");
function makeAddRow(operation, displayOptions) {
    return {
        displayName: 'Columns',
        name: 'columns',
        type: 'resourceMapper',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        noDataExpression: true,
        required: true,
        typeOptions: {
            loadOptionsDependsOn: [`${fields_1.DATA_TABLE_ID_FIELD}.value`],
            resourceMapper: {
                valuesLabel: `Values to ${operation}`,
                resourceMapperMethod: 'getDataTables',
                mode: 'add',
                fieldWords: {
                    singular: 'column',
                    plural: 'columns',
                },
                addAllFields: true,
                multiKeyMatch: true,
                hideNoDataError: true,
            },
        },
        displayOptions,
    };
}
function getAddRow(ctx, index) {
    const items = ctx.getInputData();
    const dataMode = ctx.getNodeParameter('columns.mappingMode', index);
    let data;
    if (dataMode === 'autoMapInputData') {
        data = { ...items[index].json };
        // We automatically remove our system columns for better UX when feeding data table outputs
        // into another data table node
        for (const systemColumn of n8n_workflow_1.DATA_TABLE_SYSTEM_COLUMNS) {
            delete data[systemColumn];
        }
    }
    else {
        const fields = ctx.getNodeParameter('columns.value', index, {});
        data = fields;
    }
    return (0, utils_1.dataObjectToApiInput)(data, ctx.getNode(), index);
}
//# sourceMappingURL=addRow.js.map