"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
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
            loadOptionsDependsOn: ['table.value', 'operation'],
            resourceMapper: {
                resourceMapperMethod: 'getMappingColumns',
                mode: 'add',
                fieldWords: {
                    singular: 'column',
                    plural: 'columns',
                },
                addAllFields: true,
                multiKeyMatch: true,
            },
        },
    },
    ...common_descriptions_1.optionsCollection,
];
const displayOptions = {
    show: {
        resource: ['database'],
        operation: ['insert'],
    },
    hide: {
        table: [''],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
function getQueryBindParameters(node, query, values, columnMetaDataObject, inputColumns, outputColumns, item, index) {
    (0, utils_1.checkItemAgainstSchema)(node, inputColumns, columnMetaDataObject, item, index);
    const [quotedColsArray, replacements, posIndex] = (0, utils_1.getInBindParametersForExecute)(inputColumns, columnMetaDataObject, item, 'insert', values);
    const quotedCols = quotedColsArray.join(',');
    query = `${query} (${quotedCols}) VALUES (${replacements})`;
    if (outputColumns.length > 0) {
        const updatedQuery = (0, utils_1.getOutBindDefsForExecute)(query, columnMetaDataObject, outputColumns, values, posIndex);
        query = updatedQuery;
    }
    return query;
}
/*
 * Executes the Node.
 *
 * @param this Function context (accesses params, helpers).
 * @param runQueries Helper function that executes an array of queries.
 * @param items Array of input data items.
 * @param nodeOptions Node configuration (version, execute options).
 * @param pool Database pool object to get Connections to execute.
 * @returns Promise which has INodeExecutionData array capturing results.
 */
async function execute(runQueries, items, nodeOptions, pool) {
    let schema = this.getNodeParameter('schema', 0, undefined, {
        extractValue: true,
    });
    let table = this.getNodeParameter('table', 0, undefined, {
        extractValue: true,
    });
    let tableSchema = await (0, utils_1.getColumnMetaData)(this.getNode(), pool, schema, table);
    const queries = [];
    const stmtBatching = nodeOptions.stmtBatching || 'single';
    if (stmtBatching === 'single') {
        // We assume that the items passed have uniform keys.
        // Ex:
        // 	{ "id": 1, "name": "Alice" }
        // 	{ "id": 2, "name": "Bob" }
        // but not
        // 	{ "id": 1, "name": "Alice" }
        // 	{ "id": 2, "age": 25 }
        //
        // Also the schema and table are not changing in each item.
        const dataMode = this.getNodeParameter('columns.mappingMode', 0);
        let item = {};
        if (dataMode === 'autoMapInputData') {
            item = items[0].json;
        }
        else if (dataMode === 'defineBelow') {
            item = this.getNodeParameter('columns.value', 0);
        }
        const columnMetaDataObject = (0, utils_1.getColumnMap)(tableSchema);
        const inputColumns = Object.keys(item);
        let query = `INSERT INTO ${(0, utils_1.quoteSqlIdentifier)(schema)}.${(0, utils_1.quoteSqlIdentifier)(table)}`;
        let outputColumns = this.getNodeParameter('options.outputColumns', 0, []);
        if (outputColumns.includes('*'))
            outputColumns = Object.keys(columnMetaDataObject);
        query = (0, utils_1.getBindDefsForExecuteMany)(this.getNode(), query, columnMetaDataObject, inputColumns, outputColumns, item, nodeOptions);
        const executeManyValues = [];
        for (let i = 0; i < items.length; i++) {
            if (dataMode === 'autoMapInputData') {
                item = items[i].json;
            }
            if (dataMode === 'defineBelow') {
                item = this.getNodeParameter('columns.value', i);
            }
            const newItem = (0, utils_1.formatItemValues)(item, columnMetaDataObject);
            executeManyValues.push(newItem);
        }
        queries.push({ query, executeManyValues, outputColumns });
    }
    else {
        const updateTableSchema = (0, utils_1.configureTableSchemaUpdater)(this.getNode(), schema, table);
        for (let i = 0; i < items.length; i++) {
            schema = this.getNodeParameter('schema', i, undefined, {
                extractValue: true,
            });
            table = this.getNodeParameter('table', i, undefined, {
                extractValue: true,
            });
            const dataMode = this.getNodeParameter('columns.mappingMode', i);
            let item = {};
            if (dataMode === 'autoMapInputData') {
                item = items[i].json;
                // Column refresh is needed only for 'autoMapInputData'
                tableSchema = await updateTableSchema(pool, tableSchema, schema, table, i);
            }
            else if (dataMode === 'defineBelow') {
                item = this.getNodeParameter('columns.value', i);
            }
            const columnMetaDataObject = (0, utils_1.getColumnMap)(tableSchema);
            const inputColumns = Object.keys(item);
            let query = `INSERT INTO ${(0, utils_1.quoteSqlIdentifier)(schema)}.${(0, utils_1.quoteSqlIdentifier)(table)}`;
            let outputColumns = this.getNodeParameter('options.outputColumns', i, []);
            const bindParams = [];
            if (outputColumns.includes('*'))
                outputColumns = Object.keys(columnMetaDataObject);
            query = getQueryBindParameters(this.getNode(), query, bindParams, columnMetaDataObject, inputColumns, outputColumns, item, i);
            queries.push({ query, values: bindParams, outputColumns });
        }
    }
    return await runQueries(queries, items, nodeOptions);
}
//# sourceMappingURL=insert.operation.js.map