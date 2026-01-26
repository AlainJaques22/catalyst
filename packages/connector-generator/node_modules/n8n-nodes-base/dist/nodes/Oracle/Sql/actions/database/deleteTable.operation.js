"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        displayName: 'Command',
        name: 'deleteCommand',
        type: 'options',
        default: 'truncate',
        options: [
            {
                name: 'Truncate',
                value: 'truncate',
                description: "Only removes the table's data and preserves the table's structure",
            },
            {
                name: 'Delete',
                value: 'delete',
                description: "Delete the rows that match the 'Select Rows' conditions below. If no selection is made, all rows in the table are deleted.",
            },
            {
                name: 'Drop',
                value: 'drop',
                description: "Deletes the table's data and also the table's structure permanently",
            },
        ],
    },
    {
        ...common_descriptions_1.whereFixedCollection,
        displayOptions: {
            show: {
                deleteCommand: ['delete'],
            },
        },
    },
    {
        ...common_descriptions_1.combineConditionsCollection,
        displayOptions: {
            show: {
                deleteCommand: ['delete'],
            },
        },
    },
    ...common_descriptions_1.optionsCollection,
];
const displayOptions = {
    show: {
        resource: ['database'],
        operation: ['deleteTable'],
    },
    hide: {
        table: [''],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(runQueries, items, nodeOptions, pool) {
    const queries = [];
    const stmtBatching = nodeOptions.stmtBatching ?? 'independently';
    if (stmtBatching !== 'single') {
        for (let i = 0; i < items.length; i++) {
            const schema = this.getNodeParameter('schema', i, undefined, {
                extractValue: true,
            });
            const table = this.getNodeParameter('table', i, undefined, {
                extractValue: true,
            });
            const deleteCommand = this.getNodeParameter('deleteCommand', i);
            let query = '';
            let values = [];
            const quotedTableName = (0, utils_1.quoteSqlIdentifier)(schema) + '.' + (0, utils_1.quoteSqlIdentifier)(table);
            if (deleteCommand === 'drop') {
                query = `DECLARE
        					e_table_missing EXCEPTION;
        					PRAGMA EXCEPTION_INIT(e_table_missing, -942);
    					BEGIN
        				EXECUTE IMMEDIATE ('DROP TABLE ${quotedTableName} PURGE');
    					EXCEPTION
        				WHEN e_table_missing THEN NULL;
    					END;`;
            }
            else if (deleteCommand === 'truncate') {
                query = `TRUNCATE TABLE ${quotedTableName}`;
            }
            else if (deleteCommand === 'delete') {
                const whereClauses = this.getNodeParameter('where', i, []).values || [];
                const combineConditions = this.getNodeParameter('combineConditions', i, 'AND');
                const tableSchema = await (0, utils_1.getColumnMetaData)(this.getNode(), pool, schema, table, i);
                const columnMetaDataObject = (0, utils_1.getColumnMap)(tableSchema);
                [query, values] = (0, utils_1.addWhereClauses)(`DELETE FROM ${quotedTableName}`, whereClauses, combineConditions, columnMetaDataObject);
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid delete command, only drop, delete and truncate are supported ', { itemIndex: i });
            }
            const queryWithValues = { query, values };
            queries.push(queryWithValues);
        }
    }
    else {
        const deleteCommand = this.getNodeParameter('deleteCommand', 0);
        if (deleteCommand !== 'delete') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid command for single-mode batching: only DELETE statements are supported.', { itemIndex: 0 });
        }
        const schema = this.getNodeParameter('schema', 0, undefined, {
            extractValue: true,
        });
        const table = this.getNodeParameter('table', 0, undefined, {
            extractValue: true,
        });
        let query = '';
        let bindDefs = [];
        const quotedTableName = (0, utils_1.quoteSqlIdentifier)(schema) + '.' + (0, utils_1.quoteSqlIdentifier)(table);
        const whereClauses = this.getNodeParameter('where', 0, []).values || [];
        const combineConditions = this.getNodeParameter('combineConditions', 0, 'AND');
        const tableSchema = await (0, utils_1.getColumnMetaData)(this.getNode(), pool, schema, table);
        const columnMetaDataObject = (0, utils_1.getColumnMap)(tableSchema);
        [query, bindDefs] = (0, utils_1.addWhereClauses)(`DELETE FROM ${quotedTableName}`, whereClauses, combineConditions, columnMetaDataObject, true);
        const executeManyValues = [];
        for (let i = 0; i < items.length; i++) {
            const result = [];
            const whereClauses = this.getNodeParameter('where', i, []).values || [];
            for (const clause of whereClauses) {
                const type = columnMetaDataObject[clause.column].type;
                const value = (0, utils_1.getCompatibleValue)(type, clause.value);
                result.push(value);
            }
            executeManyValues.push(result);
        }
        nodeOptions.bindDefs = bindDefs;
        queries.push({ query, executeManyValues });
    }
    return await runQueries(queries, items, nodeOptions);
}
//# sourceMappingURL=deleteTable.operation.js.map