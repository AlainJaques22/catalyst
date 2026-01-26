"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataTableProxyExecute = getDataTableProxyExecute;
exports.getDataTableProxyLoadOptions = getDataTableProxyLoadOptions;
exports.getDataTableAggregateProxy = getDataTableAggregateProxy;
exports.isFieldEntry = isFieldEntry;
exports.isMatchType = isMatchType;
exports.buildGetManyFilter = buildGetManyFilter;
exports.isFieldArray = isFieldArray;
exports.dataObjectToApiInput = dataObjectToApiInput;
exports.getDryRunParameter = getDryRunParameter;
const luxon_1 = require("luxon");
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("./constants");
const fields_1 = require("./fields");
function isDateLike(v) {
    return (v !== null && typeof v === 'object' && 'toISOString' in v && typeof v.toISOString === 'function');
}
// We need two functions here since the available getNodeParameter
// overloads vary with the index
async function getDataTableProxyExecute(ctx, index = 0) {
    if (ctx.helpers.getDataTableProxy === undefined)
        throw new n8n_workflow_1.NodeOperationError(ctx.getNode(), 'Attempted to use Data table node but the module is disabled');
    const dataTableId = ctx.getNodeParameter(fields_1.DATA_TABLE_ID_FIELD, index, undefined, {
        extractValue: true,
    });
    return await ctx.helpers.getDataTableProxy(dataTableId);
}
async function getDataTableProxyLoadOptions(ctx) {
    if (ctx.helpers.getDataTableProxy === undefined)
        throw new n8n_workflow_1.NodeOperationError(ctx.getNode(), 'Attempted to use Data table node but the module is disabled');
    const dataTableId = ctx.getNodeParameter(fields_1.DATA_TABLE_ID_FIELD, undefined, {
        extractValue: true,
    });
    if (!dataTableId) {
        return;
    }
    return await ctx.helpers.getDataTableProxy(dataTableId);
}
async function getDataTableAggregateProxy(ctx) {
    if (ctx.helpers.getDataTableAggregateProxy === undefined)
        throw new n8n_workflow_1.NodeOperationError(ctx.getNode(), 'Attempted to use Data table node but the module is disabled');
    return await ctx.helpers.getDataTableAggregateProxy();
}
function isFieldEntry(obj) {
    if (obj === null || typeof obj !== 'object')
        return false;
    return 'keyName' in obj; // keyValue and condition are optional
}
function isMatchType(obj) {
    return typeof obj === 'string' && (obj === constants_1.ANY_CONDITION || obj === constants_1.ALL_CONDITIONS);
}
function buildGetManyFilter(fieldEntries, matchType, columnTypeMap, node) {
    const filters = fieldEntries.map((x) => {
        switch (x.condition) {
            case 'isEmpty':
                return {
                    columnName: x.keyName,
                    condition: 'eq',
                    value: null,
                };
            case 'isNotEmpty':
                return {
                    columnName: x.keyName,
                    condition: 'neq',
                    value: null,
                };
            case 'isTrue':
                return {
                    columnName: x.keyName,
                    condition: 'eq',
                    value: true,
                };
            case 'isFalse':
                return {
                    columnName: x.keyName,
                    condition: 'eq',
                    value: false,
                };
            default: {
                let value = x.keyValue;
                const columnType = columnTypeMap[x.keyName];
                // Convert ISO date strings to Date objects for date columns
                if (columnType === 'date' && typeof value === 'string') {
                    const parsed = new Date(value);
                    if (isNaN(parsed.getTime())) {
                        throw new n8n_workflow_1.NodeOperationError(node, `Invalid date string '${value}' for column '${x.keyName}'`);
                    }
                    value = parsed;
                }
                return {
                    columnName: x.keyName,
                    condition: x.condition ?? 'eq',
                    value,
                };
            }
        }
    });
    return { type: matchType === constants_1.ALL_CONDITIONS ? 'and' : 'or', filters };
}
function isFieldArray(value) {
    return (value !== null && typeof value === 'object' && Array.isArray(value) && value.every(isFieldEntry));
}
function dataObjectToApiInput(data, node, row) {
    return Object.fromEntries(Object.entries(data).map(([k, v]) => {
        if (v === undefined || v === null)
            return [k, null];
        if (Array.isArray(v)) {
            throw new n8n_workflow_1.NodeOperationError(node, `unexpected array input '${JSON.stringify(v)}' in row ${row}`);
        }
        if (v instanceof Date) {
            return [k, v];
        }
        if (typeof v === 'object') {
            // Luxon DateTime
            if (luxon_1.DateTime.isDateTime(v)) {
                return [k, v.toJSDate()];
            }
            if (isDateLike(v)) {
                try {
                    const dateObj = new Date(v.toISOString());
                    if (isNaN(dateObj.getTime())) {
                        throw new Error('Invalid date');
                    }
                    return [k, dateObj];
                }
                catch {
                    // Fall through
                }
            }
            throw new n8n_workflow_1.NodeOperationError(node, `unexpected object input '${JSON.stringify(v)}' in row ${row}`);
        }
        return [k, v];
    }));
}
function getDryRunParameter(ctx, index) {
    const dryRun = ctx.getNodeParameter(`options.${fields_1.DRY_RUN.name}`, index, false);
    if (typeof dryRun !== 'boolean') {
        throw new n8n_workflow_1.NodeOperationError(ctx.getNode(), `unexpected input ${JSON.stringify(dryRun)} for boolean dryRun`);
    }
    return dryRun;
}
//# sourceMappingURL=utils.js.map