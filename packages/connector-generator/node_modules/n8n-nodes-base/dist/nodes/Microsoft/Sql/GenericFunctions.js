"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyInputItem = copyInputItem;
exports.createTableStruct = createTableStruct;
exports.executeQueryQueue = executeQueryQueue;
exports.formatColumns = formatColumns;
exports.configurePool = configurePool;
exports.mssqlChunk = mssqlChunk;
exports.insertOperation = insertOperation;
exports.updateOperation = updateOperation;
exports.deleteOperation = deleteOperation;
exports.executeSqlQueryAndPrepareResults = executeSqlQueryAndPrepareResults;
const mssql_1 = __importDefault(require("mssql"));
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../utils/utilities");
/**
 * Returns a copy of the item which only contains the json data and
 * of that only the defined properties
 *
 * @param {INodeExecutionData} item The item to copy
 * @param {string[]} properties The properties it should include
 */
function copyInputItem(item, properties) {
    // Prepare the data to insert and copy it to be returned
    const newItem = {};
    for (const property of properties) {
        if (item.json[property] === undefined) {
            newItem[property] = null;
        }
        else {
            newItem[property] = (0, n8n_workflow_1.deepCopy)(item.json[property]);
        }
    }
    return newItem;
}
/**
 * Creates an ITables with the columns for the operations
 *
 * @param {INodeExecutionData[]} items The items to extract the tables/columns for
 * @param {function} getNodeParam getter for the Node's Parameters
 */
function createTableStruct(
// eslint-disable-next-line @typescript-eslint/no-restricted-types
getNodeParam, items, additionalProperties = [], keyName) {
    return items.reduce((tables, item, index) => {
        const table = getNodeParam('table', index);
        const columnString = getNodeParam('columns', index);
        const columns = columnString.split(',').map((column) => column.trim());
        const itemCopy = copyInputItem(item, columns.concat(additionalProperties));
        const keyParam = keyName ? getNodeParam(keyName, index) : undefined;
        if (tables[table] === undefined) {
            tables[table] = {};
        }
        if (tables[table][columnString] === undefined) {
            tables[table][columnString] = [];
        }
        if (keyName) {
            itemCopy[keyName] = keyParam;
        }
        tables[table][columnString].push(itemCopy);
        return tables;
    }, {});
}
/**
 * Executes a queue of queries on given ITables.
 *
 * @param {ITables} tables The ITables to be processed.
 * @param {function} buildQueryQueue function that builds the queue of promises
 */
async function executeQueryQueue(tables, buildQueryQueue) {
    return await Promise.all(Object.keys(tables).map(async (table) => {
        const columnsResults = Object.keys(tables[table]).map(async (columnString) => {
            return await Promise.all(buildQueryQueue({
                table,
                columnString,
                items: tables[table][columnString],
            }));
        });
        return await Promise.all(columnsResults);
    }));
}
function formatColumns(columns) {
    return columns
        .split(',')
        .map((column) => `[${column.trim()}]`)
        .join(', ');
}
function configurePool(credentials) {
    const config = {
        server: credentials.server,
        port: credentials.port,
        database: credentials.database,
        user: credentials.user,
        password: credentials.password,
        domain: credentials.domain ? credentials.domain : undefined,
        connectionTimeout: credentials.connectTimeout,
        requestTimeout: credentials.requestTimeout,
        options: {
            encrypt: credentials.tls,
            enableArithAbort: false,
            tdsVersion: credentials.tdsVersion,
            trustServerCertificate: credentials.allowUnauthorizedCerts,
        },
    };
    return new mssql_1.default.ConnectionPool(config);
}
const escapeTableName = (table) => {
    table = table.trim();
    if (table.startsWith('[') && table.endsWith(']')) {
        return table;
    }
    else {
        return `[${table}]`;
    }
};
const MSSQL_PARAMETER_LIMIT = 2100;
function mssqlChunk(rows) {
    const chunked = [[]];
    let currentParamCount = 0;
    for (const row of rows) {
        const rowValues = Object.values(row);
        const valueCount = rowValues.length;
        if (currentParamCount + valueCount >= MSSQL_PARAMETER_LIMIT) {
            chunked.push([]);
            currentParamCount = 0;
        }
        chunked[chunked.length - 1].push(row);
        currentParamCount += valueCount;
    }
    return chunked;
}
async function insertOperation(tables, pool) {
    return await executeQueryQueue(tables, ({ table, columnString, items }) => {
        return mssqlChunk(items).map(async (insertValues) => {
            const request = pool.request();
            const valuesPlaceholder = [];
            for (const [rIndex, entry] of insertValues.entries()) {
                const row = Object.values(entry);
                valuesPlaceholder.push(`(${row.map((_, vIndex) => `@r${rIndex}v${vIndex}`).join(', ')})`);
                for (const [vIndex, value] of row.entries()) {
                    request.input(`r${rIndex}v${vIndex}`, value);
                }
            }
            const query = `INSERT INTO ${escapeTableName(table)} (${formatColumns(columnString)}) VALUES ${valuesPlaceholder.join(', ')};`;
            return await request.query(query);
        });
    });
}
async function updateOperation(tables, pool) {
    return await executeQueryQueue(tables, ({ table, columnString, items }) => {
        return items.map(async (item) => {
            const request = pool.request();
            const columns = columnString.split(',').map((column) => column.trim());
            const setValues = [];
            const condition = `${item.updateKey} = @condition`;
            request.input('condition', item[item.updateKey]);
            for (const [index, col] of columns.entries()) {
                setValues.push(`[${col}] = @v${index}`);
                request.input(`v${index}`, item[col]);
            }
            const query = `UPDATE ${escapeTableName(table)} SET ${setValues.join(', ')} WHERE ${condition};`;
            return await request.query(query);
        });
    });
}
async function deleteOperation(tables, pool) {
    const queriesResults = await Promise.all(Object.keys(tables).map(async (table) => {
        const deleteKeyResults = Object.keys(tables[table]).map(async (deleteKey) => {
            const deleteItemsList = (0, utilities_1.chunk)(tables[table][deleteKey].map((item) => copyInputItem(item, [deleteKey])), 1000);
            const queryQueue = deleteItemsList.map(async (deleteValues) => {
                const request = pool.request();
                const valuesPlaceholder = [];
                for (const [index, entry] of deleteValues.entries()) {
                    valuesPlaceholder.push(`@v${index}`);
                    request.input(`v${index}`, entry[deleteKey]);
                }
                const query = `DELETE FROM ${escapeTableName(table)} WHERE [${deleteKey}] IN (${valuesPlaceholder.join(', ')});`;
                return await request.query(query);
            });
            return await Promise.all(queryQueue);
        });
        return await Promise.all(deleteKeyResults);
    }));
    return (0, utilities_1.flatten)(queriesResults).reduce((acc, resp) => (acc += resp.rowsAffected.reduce((sum, val) => (sum += val))), 0);
}
async function executeSqlQueryAndPrepareResults(pool, rawQuery, itemIndex) {
    const rawResult = await pool.request().query(rawQuery);
    const { recordsets, rowsAffected } = rawResult;
    if (Array.isArray(recordsets) && recordsets.length > 0) {
        const result = recordsets.length > 1 ? (0, utilities_1.flatten)(recordsets) : recordsets[0];
        return result.map((entry) => ({
            json: entry,
            pairedItem: [{ item: itemIndex }],
        }));
    }
    else if (rowsAffected && rowsAffected.length > 0) {
        // Handle non-SELECT queries (e.g., INSERT, UPDATE, DELETE)
        return rowsAffected.map((affectedRows, idx) => ({
            json: {
                message: `Query ${idx + 1} executed successfully`,
                rowsAffected: affectedRows,
            },
            pairedItem: [{ item: itemIndex }],
        }));
    }
    else {
        return [
            {
                json: { message: 'Query executed successfully, but no rows were affected' },
                pairedItem: [{ item: itemIndex }],
            },
        ];
    }
}
//# sourceMappingURL=GenericFunctions.js.map