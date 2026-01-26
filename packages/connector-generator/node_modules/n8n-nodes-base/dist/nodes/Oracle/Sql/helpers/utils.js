"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureTableSchemaUpdater = void 0;
exports.mapDbType = mapDbType;
exports.getCompatibleValue = getCompatibleValue;
exports.quoteSqlIdentifier = quoteSqlIdentifier;
exports.addSortRules = addSortRules;
exports.getColumnMetaData = getColumnMetaData;
exports.prepareErrorItem = prepareErrorItem;
exports.configureQueryRunner = configureQueryRunner;
exports.getColumnMap = getColumnMap;
exports.addWhereClauses = addWhereClauses;
exports.checkItemAgainstSchema = checkItemAgainstSchema;
exports.getBindParameters = getBindParameters;
exports.getInBindParametersForSourceSelect = getInBindParametersForSourceSelect;
exports.getOnClauseFromColumns = getOnClauseFromColumns;
exports.getUpdateSetClause = getUpdateSetClause;
exports.getInsertClauseAndBinds = getInsertClauseAndBinds;
exports.getInBindParametersForExecute = getInBindParametersForExecute;
exports.getOutBindDefsForExecute = getOutBindDefsForExecute;
exports.getBindDefsForExecuteMany = getBindDefsForExecuteMany;
exports.formatItemValues = formatItemValues;
const crypto_1 = require("crypto");
const luxon_1 = require("luxon");
const n8n_workflow_1 = require("n8n-workflow");
const oracledb_1 = __importDefault(require("oracledb"));
const utilities_1 = require("../../../../utils/utilities");
const n8nTypetoDBType = {
    boolean: oracledb_1.default.DB_TYPE_BOOLEAN,
    date: oracledb_1.default.DATE,
    dateTime: oracledb_1.default.DB_TYPE_TIMESTAMP,
    json: oracledb_1.default.DB_TYPE_JSON,
    number: oracledb_1.default.NUMBER,
    sparse: oracledb_1.default.DB_TYPE_VECTOR,
    vector: oracledb_1.default.DB_TYPE_VECTOR,
    string: oracledb_1.default.STRING,
    blob: oracledb_1.default.BLOB,
};
function isDateType(type) {
    return /^(timestamp(\(\d+\))?( with(?: local)? time zone)?|date)$/i.test(type);
}
function mapDbType(dbType) {
    const type = dbType.toLowerCase().trim();
    switch (true) {
        // Date & Time
        case /^timestamp(\(\d+\))?$/.test(type):
            return { oracledbType: oracledb_1.default.DB_TYPE_TIMESTAMP, n8nType: 'dateTime' };
        case /^timestamp(\(\d+\))? with time zone$/.test(type):
            return { oracledbType: oracledb_1.default.DB_TYPE_TIMESTAMP_TZ, n8nType: 'dateTime' };
        case /^timestamp(\(\d+\))? with local time zone$/.test(type):
            return { oracledbType: oracledb_1.default.DB_TYPE_TIMESTAMP_LTZ, n8nType: 'dateTime' };
        case type === 'date':
            return { oracledbType: oracledb_1.default.DATE, n8nType: 'dateTime' };
        // Numbers
        case type === 'number':
        case /^(binary_double|binary_float|decimal|float|int|integer|smallint)$/.test(type):
            return { oracledbType: oracledb_1.default.DB_TYPE_NUMBER, n8nType: 'number' };
        // Strings
        case /^(char|clob|long|nchar|nclob|nvarchar2|rowid|urowid|varchar|varchar2|xmltype)$/.test(type):
            return { oracledbType: oracledb_1.default.STRING, n8nType: 'string' };
        // Boolean
        case type === 'boolean':
            return { oracledbType: oracledb_1.default.DB_TYPE_BOOLEAN, n8nType: 'boolean' };
        // Binary / LOB
        case /^(raw|long raw)$/.test(type):
            return { oracledbType: oracledb_1.default.BUFFER, n8nType: 'json' };
        case type === 'blob':
            return { oracledbType: oracledb_1.default.BLOB, n8nType: 'json' };
        // JSON
        case type === 'json':
            return { oracledbType: oracledb_1.default.DB_TYPE_JSON, n8nType: 'object' };
        // Vector
        case /^vector(\([^)]*\))?$/.test(type):
            return { oracledbType: oracledb_1.default.DB_TYPE_VECTOR, n8nType: 'array' };
        // Fallback
        default:
            return { oracledbType: oracledb_1.default.STRING, n8nType: 'string' };
    }
}
/*
 * It returns the value compatible based on input
 * sql types (VARCHAR2, TIMESTAMP, NUMBER..)
 */
function getCompatibleValue(type, value) {
    if (value === null || value === undefined)
        return value;
    if (isDateType(type)) {
        if (value instanceof luxon_1.DateTime) {
            return value.isValid ? value.toJSDate() : null;
        }
        if (value instanceof Date) {
            return isNaN(value.getTime()) ? null : value;
        }
        else if (typeof value === 'string') {
            return new Date(value);
        }
    }
    if (type === 'BOOLEAN') {
        if (typeof value === 'string')
            return value === 'true';
        return Boolean(value);
    }
    if (type === 'NUMBER' && typeof value === 'string') {
        return Number(value);
    }
    if ((type === 'BLOB' || type === 'RAW' || type === 'LONG RAW') && !Buffer.isBuffer(value)) {
        // User enters an array or string(For BLOB) manually, we convert to buffer.
        return Buffer.from(value);
    }
    return value;
}
function getExecuteOptions(options = {}) {
    const execOptions = {
        autoCommit: options.autoCommit,
        fetchArraySize: options.fetchArraySize,
        maxRows: options.maxRows,
        prefetchRows: options.prefetchRows,
        stmtCacheSize: options.stmtCacheSize,
        keepInStmtCache: options.keepInStmtCache,
        bindDefs: options.bindDefs,
    };
    return execOptions;
}
function getExecuteManyOptions(options = {}) {
    const execOptions = {
        autoCommit: options.autoCommit,
        keepInStmtCache: options.keepInStmtCache,
        stmtCacheSize: options.stmtCacheSize,
        bindDefs: options.bindDefs,
    };
    return execOptions;
}
function addBindParam(colInfo, value, bindParameters, bindDefs = null) {
    const obj = {};
    const { type, maxSize } = colInfo;
    obj.type = mapDbType(type).oracledbType;
    if (bindDefs) {
        if (obj.type === oracledb_1.default.STRING) {
            obj.maxSize = maxSize;
        }
        else if (obj.type === oracledb_1.default.DB_TYPE_RAW) {
            obj.maxSize = maxSize;
        }
        bindDefs.push(obj);
    }
    else {
        value = getCompatibleValue(type, value);
        obj.val = value;
        bindParameters.push(obj);
    }
}
function quoteSqlIdentifier(name) {
    name = name.trim();
    /*
     * This regex ensures the identifier is valid.
     *  It allows:
     *	  Quoted identifiers: "MyColumn"
     *	  Unquoted identifiers without . or " inside: my_column
     *	  Dot-separated identifiers (like schema.table.column), each part following the rules above.
     *
     *  Invalid examples:
     * 	 my"column → contains an illegal ".
     *	 my..column → double dot not allowed.
     */
    const validateRegex = /^(?:"[^"]+"|[^".]+)(?:\.(?:"[^"]+"|[^".]+))*$/;
    if (!validateRegex.test(name)) {
        throw new Error(`Identifier name ${name} is not valid.`);
    }
    // Extract each part.
    const matchRegex = /"([^"]+)"|([^".]+)/g;
    const groups = [];
    let match;
    while ((match = matchRegex.exec(name)) !== null) {
        groups.push(match[1] || match[2]); // match[1] = quoted, match[2] = unquoted
    }
    // Re-quote each part
    const quotedParts = groups.map((g) => `"${g}"`);
    return quotedParts.join('.');
}
function addSortRules(query, rules) {
    if (rules.length === 0)
        return query;
    let orderByQuery = ' ORDER BY';
    rules.forEach((rule, index) => {
        const endWith = index === rules.length - 1 ? '' : ',';
        const sortDirection = rule.direction === 'DESC' ? 'DESC' : 'ASC';
        orderByQuery += ` ${quoteSqlIdentifier(rule.column)} ${sortDirection}${endWith}`;
    });
    return `${query}${orderByQuery}`;
}
async function getColumnMetaData(node, pool, schema, table, index = 0) {
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = `WITH constraint_info AS (
  SELECT
    acc.owner,
    acc.table_name,
    acc.column_name,
    LISTAGG(ac.constraint_type, ',')
      WITHIN GROUP (ORDER BY ac.constraint_type) AS constraint_types
  FROM all_cons_columns acc
  JOIN all_constraints ac
    ON acc.constraint_name = ac.constraint_name
   AND acc.owner = ac.owner
  GROUP BY acc.owner, acc.table_name, acc.column_name
)
SELECT
  atc.COLUMN_NAME,
  atc.DATA_TYPE,
  atc.DATA_LENGTH,
  atc.CHAR_LENGTH,
  atc.DEFAULT_LENGTH,
  atc.NULLABLE,
  atc.IDENTITY_COLUMN,
  CASE WHEN atc.DATA_DEFAULT IS NOT NULL THEN 'YES' ELSE 'NO' END AS HAS_DEFAULT,
  ci.constraint_types
FROM all_tab_columns atc
LEFT JOIN constraint_info ci
  ON atc.owner = ci.owner
 AND atc.table_name = ci.table_name
 AND atc.column_name = ci.column_name
WHERE atc.owner = :schema_name
  AND atc.table_name = :table_name
ORDER BY atc.COLUMN_NAME`;
        const result = await conn.execute(sql, { table_name: table, schema_name: schema }, { outFormat: oracledb_1.default.OUT_FORMAT_OBJECT });
        // If schema is not available, throw error.
        if (!result.rows || result.rows.length === 0) {
            throw new n8n_workflow_1.NodeOperationError(node, 'Schema Information does not exist for selected table', {
                itemIndex: index,
            });
        }
        return (result.rows?.map((row) => ({
            columnName: row.COLUMN_NAME,
            isGenerated: row.IDENTITY_COLUMN === 'YES' ? 'ALWAYS' : 'NEVER',
            columnDefault: row.HAS_DEFAULT,
            dataType: row.DATA_TYPE,
            isNullable: row.NULLABLE === 'Y',
            maxSize: row.DATA_LENGTH,
        })) ?? []);
    }
    finally {
        if (conn) {
            await conn.close(); // Ensure connection is closed
        }
    }
}
function prepareErrorItem(items, error, index) {
    return {
        json: { message: error.message, item: { ...items[index].json }, error: { ...error } },
        pairedItem: { item: index },
    };
}
function parseOracleError(node, error, itemIndex = 0) {
    return new n8n_workflow_1.NodeOperationError(node, error, {
        message: error.message,
        itemIndex,
    });
}
/*
 * The outbinds returned in result.outBinds will be returned as batch of rows in case
 * of executeMany and a single row for execute.
 * This function would return the rows of output columns in an array for both cases.
 */
function normalizeOutBinds(outBinds, stmtBatching, outputColumns) {
    if (!Array.isArray(outBinds))
        return [];
    const rows = [];
    // executeMany case outBinds-> [ [[col1Row1Val], [col2Row1Val]], [[col1Row2Val], [col2Row2Val]], ...]
    if (stmtBatching === 'single') {
        for (const batch of outBinds) {
            rows.push(Object.fromEntries(outputColumns.map((col, i) => [col, batch[i][0]])));
        }
        return rows;
    }
    // execute case outBinds-> [[col1Row1Val], [col2Row1Val]]
    const row = {};
    for (let i = 0; i < outBinds.length; i++) {
        row[`${outputColumns[i]}`] = outBinds[i][0];
    }
    rows.push(row);
    return rows;
}
function _getResponseForOutbinds(results, stmtBatching, outputColumns = [], returnData = []) {
    if (results.outBinds) {
        const normalizedRows = normalizeOutBinds(results.outBinds, stmtBatching, outputColumns);
        for (let j = 0; j < normalizedRows.length; j++) {
            const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(normalizedRows[j]), {
                itemData: { item: j },
            });
            if (executionData) {
                returnData.push(...executionData);
            }
        }
    }
}
/*
 * Returns true, if update sql is tried and either row does not
 * exist or could not find row with matching values.
 */
function doesRowExist(query, results) {
    if (/^\s*UPDATE\b/i.test(query) && results.rowsAffected === 0) {
        throw new Error("The row you are trying to update doesn't exist");
    }
}
function configureQueryRunner(node, continueOnFail, pool) {
    return async (queries, items, options) => {
        let returnData = [];
        const emptyRowData = { success: true };
        let execOptions = {};
        const defaultBatching = options.operation === 'insert' ||
            options.operation === 'update' ||
            options.operation === 'upsert'
            ? 'single'
            : 'independently';
        const stmtBatching = options.stmtBatching || defaultBatching;
        if (stmtBatching === 'transaction' || stmtBatching === 'independently') {
            // setup fetch Handler for specific types.
            const executeFetchHandler = function (metaData) {
                if (metaData.dbType &&
                    [
                        oracledb_1.default.DB_TYPE_DATE,
                        oracledb_1.default.DB_TYPE_TIMESTAMP_TZ,
                        oracledb_1.default.DB_TYPE_TIMESTAMP_LTZ,
                    ].includes(metaData.dbType)) {
                    return {
                        converter: (val) => {
                            if (!(val instanceof Date))
                                return val;
                            return val.toISOString();
                        },
                    };
                }
                if (metaData.dbType === oracledb_1.default.CLOB) {
                    return { type: oracledb_1.default.STRING };
                }
                if (metaData.dbType === oracledb_1.default.DB_TYPE_BLOB) {
                    return { type: oracledb_1.default.BUFFER };
                }
                if (options.largeNumbersOutputAsString) {
                    if (metaData.dbType === oracledb_1.default.NUMBER) {
                        return { type: oracledb_1.default.STRING };
                    }
                }
                if (metaData.dbType === oracledb_1.default.DB_TYPE_VECTOR) {
                    const myConverter = (v) => {
                        if (v !== null) {
                            return Array.from(v);
                        }
                        return v;
                    };
                    return { converter: myConverter };
                }
                return undefined;
            };
            execOptions = getExecuteOptions(options);
            execOptions.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT; // used for execute operation.
            execOptions.fetchTypeHandler = executeFetchHandler;
        }
        if (stmtBatching === 'single' && queries[0].executeManyValues) {
            const connection = await pool.getConnection();
            try {
                execOptions = getExecuteManyOptions(options);
                if (continueOnFail) {
                    execOptions.batchErrors = true;
                }
                const results = await connection.executeMany(queries[0].query, queries[0].executeManyValues, execOptions);
                doesRowExist(queries[0].query, results);
                if (results.batchErrors) {
                    // If there are batch errors, we just show them but not the
                    // partial outbinds.
                    const batchErrors = results.batchErrors;
                    for (let i = 0; i < batchErrors.length; i++) {
                        const failedIndex = batchErrors[i].offset;
                        const error = parseOracleError(node, batchErrors[i], failedIndex);
                        const pairedItem = { item: failedIndex };
                        returnData.push({ json: { message: error.message }, pairedItem });
                    }
                }
                else {
                    _getResponseForOutbinds.call(this, results, stmtBatching, queries[0].outputColumns, returnData);
                }
                if (!returnData.length) {
                    // returning Clause is not given.
                    const pairedItem = (0, utilities_1.generatePairedItemData)(queries.length);
                    returnData = [{ json: emptyRowData, pairedItem }];
                }
            }
            catch (caughtError) {
                const error = parseOracleError(node, caughtError);
                if (!continueOnFail)
                    throw error;
                return [{ json: { message: error.message, error } }];
            }
            finally {
                if (connection) {
                    await connection.close();
                }
            }
        }
        else if (stmtBatching === 'transaction') {
            execOptions.autoCommit = false; // for transaction mode forcefully overwrite it.
            const connection = await pool.getConnection();
            try {
                for (let i = 0; i < queries.length; i++) {
                    try {
                        const { query, values, outputColumns } = queries[i];
                        let transactionResults;
                        if (values) {
                            transactionResults = await connection.execute(query, values, execOptions);
                        }
                        else {
                            transactionResults = await connection.execute(query, [], execOptions);
                        }
                        doesRowExist(query, transactionResults);
                        const resultOutBinds = [];
                        _getResponseForOutbinds.call(this, transactionResults, stmtBatching, outputColumns, resultOutBinds);
                        if (!resultOutBinds.length) {
                            let rowData = transactionResults.rows ?? [];
                            if (!rowData.length) {
                                rowData = [emptyRowData];
                            }
                            const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(rowData), { itemData: { item: i } });
                            returnData.push.apply(returnData, executionData);
                        }
                        else {
                            returnData.push.apply(returnData, resultOutBinds);
                        }
                    }
                    catch (caughtError) {
                        const error = parseOracleError(node, caughtError, i);
                        if (!continueOnFail)
                            throw error;
                        returnData.push(prepareErrorItem(items, error, i));
                        // The rollback happens automatically, so just return.
                        return returnData;
                    }
                }
                // All succeeded, commit
                await connection.commit();
            }
            finally {
                await connection.close();
            }
        }
        else if (stmtBatching === 'independently') {
            const connection = await pool.getConnection();
            try {
                for (let i = 0; i < queries.length; i++) {
                    try {
                        const { query, values, outputColumns } = queries[i];
                        let taskResults;
                        if (values) {
                            taskResults = await connection.execute(query, values, execOptions);
                        }
                        else {
                            taskResults = await connection.execute(query, [], execOptions);
                        }
                        doesRowExist(query, taskResults);
                        const resultOutBinds = [];
                        _getResponseForOutbinds.call(this, taskResults, stmtBatching, outputColumns, resultOutBinds);
                        if (!resultOutBinds.length) {
                            // select query or no returning clause in DML
                            let rowData = taskResults.rows ?? [];
                            if (!rowData.length) {
                                rowData = [emptyRowData];
                            }
                            const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(rowData), { itemData: { item: i } });
                            returnData.push.apply(returnData, executionData);
                        }
                        else {
                            returnData.push.apply(returnData, resultOutBinds);
                        }
                    }
                    catch (caughtError) {
                        const error = parseOracleError(node, caughtError, i);
                        if (!continueOnFail)
                            throw error;
                        returnData.push(prepareErrorItem(items, error, i));
                    }
                }
            }
            finally {
                await connection.close();
            }
        }
        return returnData;
    };
}
// Returns a function which returns updated table schema, if the schema
// or table name has changed.
const configureTableSchemaUpdater = (node, initialSchema, initialTable) => {
    let currentSchema = initialSchema;
    let currentTable = initialTable;
    return async (pool, tableSchema, schema, table, index = 0) => {
        if (currentSchema !== schema || currentTable !== table) {
            currentSchema = schema;
            currentTable = table;
            tableSchema = await getColumnMetaData(node, pool, schema, table, index);
        }
        return tableSchema;
    };
};
exports.configureTableSchemaUpdater = configureTableSchemaUpdater;
function getColumnMap(tableSchema) {
    const columnMetaDataObject = tableSchema.reduce((acc, { columnName, dataType, isNullable, maxSize }) => {
        acc[columnName] = {
            type: dataType.toUpperCase(),
            nullable: isNullable,
            maxSize,
        };
        return acc;
    }, {});
    return columnMetaDataObject;
}
function addWhereClauses(query, clauses, combineConditions, schema, isExecuteMany = false) {
    if (clauses.length === 0)
        return [query, []];
    const combineWith = combineConditions === 'OR' ? 'OR' : 'AND';
    let whereQuery = ' WHERE';
    const bindParameters = [];
    const bindDefs = isExecuteMany ? [] : null;
    let posIndex = 0;
    clauses.forEach((clause, index) => {
        if (clause.condition === 'equal') {
            clause.condition = '=';
        }
        // The condition value is json type, so convert to required type only
        // if fixed expression is used instead of n8n expressions.
        if (typeof clause.value === 'string') {
            try {
                clause.value = JSON.parse(clause.value); // "2" → 2 (number)
            }
            catch {
                // if it wasn't valid JSON, keep original string
            }
        }
        const quotedColumnName = quoteSqlIdentifier(clause.column); // escape column name
        let conditionExpr;
        if (clause.condition === 'IS NULL' || clause.condition === 'IS NOT NULL') {
            conditionExpr = `${quotedColumnName} ${clause.condition}`;
        }
        else {
            conditionExpr = `${quotedColumnName} ${clause.condition} :${posIndex++}`;
            addBindParam(schema[clause.column], clause.value, bindParameters, bindDefs);
        }
        whereQuery += (index > 0 ? ` ${combineWith}` : '') + ` ${conditionExpr}`;
    });
    return [`${query}${whereQuery}`, bindDefs ?? bindParameters];
}
/*
Verifies all provided keys (item fields) exist in the table schema.
Ensures that non-nullable columns aren't being given null values.
*/
function checkItemAgainstSchema(node, columns, schema, item, index = 0) {
    for (const key of columns) {
        const columnDef = schema[key];
        if (!columnDef) {
            throw new n8n_workflow_1.NodeOperationError(node, `Column '${key}' does not exist in selected table`, {
                itemIndex: index,
            });
        }
        if (item[key] === null && !columnDef.nullable) {
            throw new n8n_workflow_1.NodeOperationError(node, `Column '${key}' is not nullable`, {
                itemIndex: index,
            });
        }
    }
}
/*
 * Given a query with bindname which accepts string(comma separated values) for IN clause, It
 * generates multiple unique bindnames separated by comma. This bindname should be only used in IN clause.
 *
 * Ex: For input: SELECT * from dual where DUMMY in :param1
 *     It generates
 * 		"SELECT * from dual where DUMMY in (:param1f8b29e29_edef_454a_b003_18fa1debff55,:param1bc8a5a46_5bfd_4ddb_851e_2ac4c243a26b)"
 *
 *  The logic is taken from here
 *  https://github.com/jgriffin1/n8n-nodes-oracle-database-parameterization
 *
 */
function generateBindVariablesList(item, bindParameters, query) {
    if (item.datatype !== 'string') {
        throw new n8n_workflow_1.UserError(`Unsupported datatype '${item.datatype}' for IN clause expansion. Only 'string' of comma-separated values is allowed. `);
    }
    const valList = item.valueString.split(',');
    // Escape bind name for regex safely
    const escapedName = item.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    let generatedSqlString = '(';
    for (let i = 0; i < valList.length; i++) {
        // replace parameters with Dashes to underscore
        const uniqueId = (0, crypto_1.randomUUID)().replace(/-/g, '_');
        const newParamName = `${item.name}${uniqueId}`;
        bindParameters[newParamName] = {
            type: mapDbType(item.datatype).oracledbType,
            val: getCompatibleValue(item.datatype, valList[i]),
        };
        generatedSqlString += `:${newParamName},`;
    }
    // replace :bindname
    const regex = new RegExp(`:${escapedName}(?![A-Za-z0-9_$#])`, 'g');
    generatedSqlString = generatedSqlString.slice(0, -1) + ')'; //replace trailing comma with closing parenthesis.
    return query.replace(regex, generatedSqlString);
}
function getBindParameters(query, parameterList) {
    const bindParameters = {};
    for (const item of parameterList) {
        if (!item.parseInStatement) {
            let bindVal = null;
            const type = item.datatype;
            switch (type) {
                case 'number':
                    bindVal = item.valueNumber;
                    break;
                case 'string':
                    bindVal = item.valueString;
                    break;
                case 'boolean':
                    bindVal = item.valueBoolean;
                    break;
                case 'blob':
                    bindVal = item.valueBlob;
                    break;
                case 'date': {
                    const val = item.valueDate;
                    if (typeof val === 'string') {
                        bindVal = new Date(val); // string → Date
                    }
                    else if (val instanceof Date) {
                        bindVal = val; // already a Date
                    }
                    else {
                        // Luxon DateTime
                        if (val instanceof luxon_1.DateTime) {
                            bindVal = val.isValid ? val.toJSDate() : null;
                        }
                    }
                    break;
                }
                case 'sparse': {
                    const val = item.valueSparse;
                    let indices = val.indices;
                    let values = val.values;
                    const dims = val.dimensions;
                    if (typeof indices === 'string') {
                        try {
                            indices = JSON.parse(indices);
                        }
                        catch (caughtError) {
                            throw new n8n_workflow_1.UserError(`Indices field must be a valid JSON array or use an expression like {{ [1, 2, 3] }}, Err:${caughtError}`);
                        }
                    }
                    if (typeof values === 'string') {
                        try {
                            values = JSON.parse(values);
                        }
                        catch (caughtError) {
                            throw new n8n_workflow_1.UserError(`Values field must be a valid JSON array or use an expression like {{ [1, 2, 3] }}, Err:${caughtError} `);
                        }
                    }
                    bindVal = new oracledb_1.default.SparseVector({
                        indices,
                        values,
                        numDimensions: dims,
                    });
                    break;
                }
                case 'vector':
                    {
                        const val = item.valueVector;
                        bindVal = val;
                        if (typeof val === 'string') {
                            try {
                                bindVal = JSON.parse(val);
                            }
                            catch (caughtError) {
                                throw new n8n_workflow_1.UserError(`Value field must be a valid JSON array or use an expression like {{ [1, 2, 3] }}, Err: ${caughtError}`);
                            }
                        }
                    }
                    break;
                case 'json':
                    {
                        const val = item.valueJson;
                        bindVal = val;
                        if (typeof val === 'string') {
                            try {
                                bindVal = JSON.parse(val);
                            }
                            catch {
                                throw new n8n_workflow_1.UserError('Value must be a valid JSON ');
                            }
                        }
                    }
                    break;
                default:
                    throw new n8n_workflow_1.UserError(`Unsupported Bind type: ${type}`);
            }
            const dir = item.bindDirection === 'in'
                ? oracledb_1.default.BIND_IN
                : item.bindDirection === 'out'
                    ? oracledb_1.default.BIND_OUT
                    : oracledb_1.default.BIND_INOUT;
            bindParameters[item.name] = {
                type: n8nTypetoDBType[item.datatype],
                val: bindVal,
                dir,
            };
        }
        else {
            query = generateBindVariablesList(item, bindParameters, query);
        }
    }
    return { updatedQuery: query, bindParameters };
}
function getInBindParametersForSourceSelect(inputColumns, schema, valData, bindParameters, bindDefs, posIndex = 0) {
    const quotedColsArray = [];
    let index = posIndex;
    for (const col of inputColumns) {
        const quotedCol = quoteSqlIdentifier(col);
        quotedColsArray.push(`:${index++} as ${quotedCol}`);
        addBindParam(schema[col], valData[col], bindParameters, bindDefs);
    }
    return [quotedColsArray.join(','), index];
}
function getOnClauseFromColumns(columns) {
    return columns
        .map((col) => {
        const quoted = quoteSqlIdentifier(col);
        return `t.${quoted} = s.${quoted}`;
    })
        .join(' AND ');
}
function getUpdateSetClause(updateCols, schema, valData, bindParameters, bindDefs, posIndex) {
    const setClauses = [];
    let index = posIndex;
    for (const col of updateCols) {
        const quoted = quoteSqlIdentifier(col);
        setClauses.push(`t.${quoted} = :${index}`);
        addBindParam(schema[col], valData[col], bindParameters, bindDefs);
        index++;
    }
    return [setClauses.join(', '), index];
}
function getInsertClauseAndBinds(insertCols, schema, valData, bindParameters, bindDefs, posIndex) {
    const quotedCols = [];
    const placeholders = [];
    let index = posIndex;
    for (const col of insertCols) {
        const quoted = quoteSqlIdentifier(col);
        quotedCols.push(quoted);
        placeholders.push(`:${index}`);
        addBindParam(schema[col], valData[col], bindParameters, bindDefs);
        index++;
    }
    return [quotedCols.join(', '), placeholders.join(', '), index];
}
function getInBindParametersForExecute(inputColumns, schema, valData, operation, bindParameters, posIndex = 0) {
    const quotedColsArray = [];
    const replacementsArray = [];
    let index = posIndex;
    for (const col of inputColumns) {
        const quotedCol = quoteSqlIdentifier(col);
        if (operation === 'insert') {
            quotedColsArray.push(quotedCol);
            replacementsArray.push(`:${index++}`);
        }
        else if (operation === 'update') {
            quotedColsArray.push(`${quotedCol}=:${index++}`);
        }
        addBindParam(schema[col], valData[col], bindParameters);
    }
    const replacements = replacementsArray.join(',');
    return [quotedColsArray, replacements, index];
}
function getInBindDefsForExecuteMany(query, columnMetaDataObject, columns, bindInfo, posIndex = 0, operation = 'insert') {
    const quotedColsArray = [];
    const replacementsArray = [];
    let resultIndex = posIndex;
    for (const col of columns) {
        const quotedCol = quoteSqlIdentifier(col);
        if (operation === 'update' || operation === 'updatewhere') {
            quotedColsArray.push(`${quotedCol}=:${resultIndex++}`);
        }
        else {
            // insert case.
            quotedColsArray.push(quotedCol);
            replacementsArray.push(`:${resultIndex++}`);
        }
        addBindParam(columnMetaDataObject[col], null, [], bindInfo);
    }
    const quotedCols = quotedColsArray.join(operation === 'updatewhere' ? ' AND ' : ',');
    switch (operation) {
        case 'insert':
            query += ` (${quotedCols}) VALUES (${replacementsArray.join(',')})`;
            break;
        case 'update':
            query += ` SET ${quotedCols}`;
            break;
        case 'updatewhere':
            query += ` WHERE ${quotedCols}`;
            break;
    }
    return [query, resultIndex];
}
function getOutBindDefsForExecute(query, columnMetaDataObject, outputColumns, bindInfo, bindIndex = 0) {
    let returningClause = 'RETURNING ';
    let intoClause = 'INTO ';
    let posIndex = bindIndex;
    for (const [i, col] of outputColumns.entries()) {
        if (i > 0) {
            returningClause += ', ';
            intoClause += ', ';
        }
        const obj = {};
        obj.type = mapDbType(columnMetaDataObject[col].type).oracledbType;
        obj.dir = oracledb_1.default.BIND_OUT;
        if (obj.type === oracledb_1.default.STRING) {
            obj.maxSize = columnMetaDataObject[col].maxSize;
        }
        else if (obj.type === oracledb_1.default.DB_TYPE_RAW) {
            obj.maxSize = columnMetaDataObject[col].maxSize;
        }
        bindInfo.push(obj);
        returningClause += `${quoteSqlIdentifier(col)}`;
        intoClause += `:${posIndex++}`;
    }
    query = `${query} ${returningClause} ${intoClause}`;
    return query;
}
function getBindDefsForExecuteMany(node, query, columnMetaDataObject, inputColumns, outputColumns, item, options, operation = 'insert', columnsToMatchOn = []) {
    checkItemAgainstSchema(node, inputColumns, columnMetaDataObject, item);
    let posIndex = 0;
    const bindDefs = [];
    [query, posIndex] = getInBindDefsForExecuteMany(query, columnMetaDataObject, inputColumns, bindDefs, posIndex, operation);
    if (columnsToMatchOn.length) {
        [query, posIndex] = getInBindDefsForExecuteMany(query, columnMetaDataObject, columnsToMatchOn, bindDefs, posIndex, 'updatewhere');
    }
    if (outputColumns.length > 0) {
        const updatedQuery = getOutBindDefsForExecute(query, columnMetaDataObject, outputColumns, bindDefs, posIndex);
        query = updatedQuery;
    }
    options.bindDefs = bindDefs;
    return query;
}
// It will convert the n8n values to compatible bind values.
function formatItemValues(item, col) {
    const result = [];
    for (const key of Object.keys(item)) {
        const type = col[key].type;
        const value = getCompatibleValue(type, item[key]);
        result.push(value);
    }
    return result;
}
//# sourceMappingURL=utils.js.map