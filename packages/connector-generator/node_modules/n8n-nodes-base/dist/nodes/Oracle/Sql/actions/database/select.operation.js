"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
            show: {
                resource: ['database'],
                operation: ['select'],
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                resource: ['database'],
                operation: ['select'],
                returnAll: [false],
            },
        },
    },
    common_descriptions_1.whereFixedCollection,
    common_descriptions_1.combineConditionsCollection,
    common_descriptions_1.sortFixedCollection,
    ...common_descriptions_1.optionsCollection,
];
const displayOptions = {
    show: {
        resource: ['database'],
        operation: ['select'],
    },
    hide: {
        table: [''],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(runQueries, items, nodeOptions, pool) {
    const queries = [];
    for (let i = 0; i < items.length; i++) {
        const schema = this.getNodeParameter('schema', i, undefined, {
            extractValue: true,
        });
        const table = this.getNodeParameter('table', i, undefined, {
            extractValue: true,
        });
        const tableSchema = await (0, utils_1.getColumnMetaData)(this.getNode(), pool, schema, table, i);
        const columnMetaDataObject = (0, utils_1.getColumnMap)(tableSchema);
        let values = [];
        const outputColumns = this.getNodeParameter('options.outputColumns', i, ['*']);
        let query = '';
        if (outputColumns.includes('*')) {
            query = `SELECT * FROM ${(0, utils_1.quoteSqlIdentifier)(schema)}.${(0, utils_1.quoteSqlIdentifier)(table)}`;
        }
        else {
            const quotedColumns = outputColumns.map(utils_1.quoteSqlIdentifier).join(',');
            query = `SELECT ${quotedColumns} FROM ${(0, utils_1.quoteSqlIdentifier)(schema)}.${(0, utils_1.quoteSqlIdentifier)(table)}`;
        }
        const whereClauses = this.getNodeParameter('where', i, []).values || [];
        const combineConditions = this.getNodeParameter('combineConditions', i, 'AND');
        [query, values] = (0, utils_1.addWhereClauses)(query, whereClauses, combineConditions, columnMetaDataObject);
        const sortRules = this.getNodeParameter('sort', i, []).values || [];
        query = (0, utils_1.addSortRules)(query, sortRules);
        const returnAll = this.getNodeParameter('returnAll', i, false);
        if (!returnAll) {
            const limit = this.getNodeParameter('limit', i, 50);
            query += ` FETCH FIRST ${limit} ROWS ONLY`;
        }
        const queryWithValues = { query, values };
        queries.push(queryWithValues);
    }
    return await runQueries(queries, items, nodeOptions);
}
//# sourceMappingURL=select.operation.js.map