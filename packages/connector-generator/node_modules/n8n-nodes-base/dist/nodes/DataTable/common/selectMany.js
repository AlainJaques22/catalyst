"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectFields = getSelectFields;
exports.getSelectFilter = getSelectFilter;
exports.executeSelectMany = executeSelectMany;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("./constants");
const fields_1 = require("./fields");
const utils_1 = require("./utils");
function getSelectFields(displayOptions, requireCondition = false, skipOperator = false) {
    return [
        {
            displayName: 'Must Match',
            name: 'matchType',
            type: 'options',
            options: [
                {
                    name: 'Any Condition',
                    value: constants_1.ANY_CONDITION,
                },
                {
                    name: 'All Conditions',
                    value: constants_1.ALL_CONDITIONS,
                },
            ],
            displayOptions,
            default: constants_1.ANY_CONDITION,
        },
        {
            displayName: 'Conditions',
            name: 'filters',
            type: 'fixedCollection',
            typeOptions: {
                multipleValues: true,
                minRequiredFields: requireCondition ? 1 : 0,
            },
            displayOptions,
            default: {},
            placeholder: 'Add Condition',
            options: [
                {
                    displayName: 'Conditions',
                    name: 'conditions',
                    values: [
                        {
                            // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
                            displayName: 'Column',
                            name: 'keyName',
                            type: 'options',
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
                            description: 'Choose from the list, or specify using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                            typeOptions: {
                                loadOptionsDependsOn: [`${fields_1.DATA_TABLE_ID_FIELD}.value`],
                                loadOptionsMethod: 'getDataTableColumns',
                            },
                            default: 'id',
                        },
                        {
                            // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
                            displayName: 'Condition',
                            name: 'condition',
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-missing-from-dynamic-options
                            type: 'options',
                            typeOptions: {
                                loadOptionsDependsOn: ['&keyName'],
                                loadOptionsMethod: 'getConditionsForColumn',
                            },
                            default: 'eq',
                            displayOptions: skipOperator
                                ? {
                                    show: { '@version': [{ _cnd: { lt: 0 } }] },
                                }
                                : undefined,
                        },
                        {
                            displayName: 'Value',
                            name: 'keyValue',
                            type: 'string',
                            default: '',
                            displayOptions: {
                                hide: {
                                    condition: ['isEmpty', 'isNotEmpty', 'isTrue', 'isFalse'],
                                },
                            },
                        },
                    ],
                },
            ],
            description: 'Filter to decide which rows get',
        },
    ];
}
async function getSelectFilter(ctx, index) {
    const fields = ctx.getNodeParameter('filters.conditions', index, []);
    const matchType = ctx.getNodeParameter('matchType', index, constants_1.ANY_CONDITION);
    const node = ctx.getNode();
    if (!(0, utils_1.isMatchType)(matchType)) {
        throw new n8n_workflow_1.NodeOperationError(node, 'unexpected match type');
    }
    if (!(0, utils_1.isFieldArray)(fields)) {
        throw new n8n_workflow_1.NodeOperationError(node, 'unexpected fields input');
    }
    // Validate filter conditions against current table schema
    let allColumnsWithTypes = n8n_workflow_1.DATA_TABLE_SYSTEM_COLUMN_TYPE_MAP;
    if (fields.length > 0) {
        const dataTableProxy = await (0, utils_1.getDataTableProxyExecute)(ctx, index);
        const availableColumns = await dataTableProxy.getColumns();
        // Add system columns with their types
        allColumnsWithTypes = {
            ...n8n_workflow_1.DATA_TABLE_SYSTEM_COLUMN_TYPE_MAP,
            ...Object.fromEntries(availableColumns.map((col) => [col.name, col.type])),
        };
        const invalidConditions = fields.filter((field) => !allColumnsWithTypes[field.keyName]);
        if (invalidConditions.length > 0) {
            const invalidColumnNames = invalidConditions.map((c) => c.keyName).join(', ');
            throw new n8n_workflow_1.NodeOperationError(node, `Filter validation failed: Column(s) "${invalidColumnNames}" do not exist in the selected table. ` +
                'This often happens when switching between tables with different schemas. ' +
                'Please update your filter conditions.');
        }
    }
    return (0, utils_1.buildGetManyFilter)(fields, matchType, allColumnsWithTypes, node);
}
async function executeSelectMany(ctx, index, dataTableProxy, rejectEmpty = false, limit) {
    const filter = await getSelectFilter(ctx, index);
    if (rejectEmpty && filter.filters.length === 0) {
        throw new n8n_workflow_1.NodeOperationError(ctx.getNode(), 'At least one condition is required');
    }
    const PAGE_SIZE = 1000;
    const result = [];
    const returnAll = ctx.getNodeParameter('returnAll', index, false);
    limit = limit ?? (!returnAll ? ctx.getNodeParameter('limit', index, constants_1.ROWS_LIMIT_DEFAULT) : 0);
    let expectedTotal;
    let skip = 0;
    let take = PAGE_SIZE;
    while (true) {
        const { data, count } = await dataTableProxy.getManyRowsAndCount({
            skip,
            take: limit ? Math.min(take, limit - result.length) : take,
            filter,
        });
        const wrapped = data.map((json) => ({ json }));
        // Fast path: everything fits in a single page
        if (skip === 0 && count === data.length) {
            return wrapped;
        }
        // Ensure the total doesn't change mid-pagination
        if (expectedTotal !== undefined && count !== expectedTotal) {
            throw new n8n_workflow_1.NodeOperationError(ctx.getNode(), 'synchronization error: result count changed during pagination');
        }
        expectedTotal = count;
        result.push.apply(result, wrapped);
        // Stop if we've hit the limit
        if (limit && result.length >= limit)
            break;
        // Stop if we've collected everything
        if (result.length >= count)
            break;
        skip = result.length;
        take = Math.min(PAGE_SIZE, count - result.length);
    }
    return result;
}
//# sourceMappingURL=selectMany.js.map