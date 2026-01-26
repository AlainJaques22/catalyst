"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAble = exports.dtableSchemaColumns = exports.dtableSchemaIsColumn = exports.split = exports.nameOfPredicate = void 0;
exports.resolveBaseUri = resolveBaseUri;
exports.getBaseAccessToken = getBaseAccessToken;
exports.seaTableApiRequest = seaTableApiRequest;
exports.setableApiRequestAllItems = setableApiRequestAllItems;
exports.getTableColumns = getTableColumns;
exports.getTableViews = getTableViews;
exports.simplify = simplify;
exports.getColumns = getColumns;
exports.getDownloadableColumns = getDownloadableColumns;
exports.columnNamesToArray = columnNamesToArray;
exports.columnNamesGlob = columnNamesGlob;
exports.rowsSequence = rowsSequence;
exports.rowDeleteInternalColumns = rowDeleteInternalColumns;
exports.rowFormatColumns = rowFormatColumns;
exports.rowsFormatColumns = rowsFormatColumns;
exports.rowMapKeyToName = rowMapKeyToName;
exports.rowExport = rowExport;
const n8n_workflow_1 = require("n8n-workflow");
const Schema_1 = require("./Schema");
const userBaseUri = (uri) => {
    if (uri === undefined) {
        return uri;
    }
    if (uri.endsWith('/')) {
        return uri.slice(0, -1);
    }
    return uri;
};
function resolveBaseUri(ctx) {
    return ctx?.credentials?.environment === 'cloudHosted'
        ? 'https://cloud.seatable.io'
        : userBaseUri(ctx?.credentials?.domain);
}
async function getBaseAccessToken(ctx) {
    if (ctx?.base?.access_token !== undefined) {
        return;
    }
    const options = {
        headers: {
            Authorization: `Token ${ctx?.credentials?.token}`,
        },
        uri: `${resolveBaseUri(ctx)}/api/v2.1/dtable/app-access-token/`,
        json: true,
    };
    ctx.base = await this.helpers.request(options);
}
function endpointCtxExpr(ctx, endpoint) {
    const endpointVariables = {};
    endpointVariables.access_token = ctx?.base?.access_token;
    endpointVariables.dtable_uuid = ctx?.base?.dtable_uuid;
    return endpoint.replace(/{{ *(access_token|dtable_uuid|server) *}}/g, (match, name) => {
        return endpointVariables[name] || match;
    });
}
async function seaTableApiRequest(ctx, method, endpoint, body = {}, qs = {}, url = undefined, option = {}) {
    const credentials = await this.getCredentials('seaTableApi');
    ctx.credentials = credentials;
    await getBaseAccessToken.call(this, ctx);
    const options = {
        headers: {
            Authorization: `Token ${ctx?.base?.access_token}`,
        },
        method,
        qs,
        body,
        uri: url || `${resolveBaseUri(ctx)}${endpointCtxExpr(ctx, endpoint)}`,
        json: true,
    };
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    if (Object.keys(option).length !== 0) {
        Object.assign(options, option);
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function setableApiRequestAllItems(ctx, propertyName, method, endpoint, body, query) {
    if (query === undefined) {
        query = {};
    }
    const segment = Schema_1.schema.rowFetchSegmentLimit;
    query.start = 0;
    query.limit = segment;
    const returnData = [];
    let responseData;
    do {
        responseData = (await seaTableApiRequest.call(this, ctx, method, endpoint, body, query));
        //@ts-ignore
        returnData.push.apply(returnData, responseData[propertyName]);
        query.start = +query.start + segment;
    } while (responseData && responseData.length > segment - 1);
    return returnData;
}
async function getTableColumns(tableName, ctx = {}) {
    const { metadata: { tables }, } = await seaTableApiRequest.call(this, ctx, 'GET', '/dtable-server/api/v1/dtables/{{dtable_uuid}}/metadata');
    for (const table of tables) {
        if (table.name === tableName) {
            return table.columns;
        }
    }
    return [];
}
async function getTableViews(tableName, ctx = {}) {
    const { views } = await seaTableApiRequest.call(this, ctx, 'GET', '/dtable-server/api/v1/dtables/{{dtable_uuid}}/views', {}, { table_name: tableName });
    return views;
}
function simplify(data, metadata) {
    return data.results.map((row) => {
        for (const key of Object.keys(row)) {
            if (!key.startsWith('_')) {
                row[metadata[key]] = row[key];
                delete row[key];
            }
        }
        return row;
    });
}
function getColumns(data) {
    return data.metadata.reduce((obj, value) => Object.assign(obj, { [`${value.key}`]: value.name }), {});
}
function getDownloadableColumns(data) {
    return data.metadata.filter((row) => ['image', 'file'].includes(row.type)).map((row) => row.name);
}
const uniquePredicate = (current, index, all) => all.indexOf(current) === index;
const nonInternalPredicate = (name) => !Object.keys(Schema_1.schema.internalNames).includes(name);
const namePredicate = (name) => (named) => named.name === name;
const nameOfPredicate = (names) => (name) => names.find(namePredicate(name));
exports.nameOfPredicate = nameOfPredicate;
const normalize = (subject) => (subject ? subject.normalize() : '');
const split = (subject) => normalize(subject)
    .split(/\s*((?:[^\\,]*?(?:\\[\s\S])*)*?)\s*(?:,|$)/)
    .filter((s) => s.length)
    .map((s) => s.replace(/\\([\s\S])/gm, (_, $1) => $1));
exports.split = split;
function columnNamesToArray(columnNames) {
    return columnNames ? (0, exports.split)(columnNames).filter(nonInternalPredicate).filter(uniquePredicate) : [];
}
function columnNamesGlob(columnNames, dtableColumns) {
    const buffer = [];
    const names = dtableColumns.map((c) => c.name).filter(nonInternalPredicate);
    columnNames.forEach((columnName) => {
        if (columnName !== '*') {
            buffer.push(columnName);
            return;
        }
        buffer.push(...names);
    });
    return buffer.filter(uniquePredicate);
}
/**
 * sequence rows on _seq
 */
function rowsSequence(rows) {
    const l = rows.length;
    if (l) {
        const [first] = rows;
        if (first?._seq !== undefined) {
            return;
        }
    }
    for (let i = 0; i < l;) {
        rows[i]._seq = ++i;
    }
}
function rowDeleteInternalColumns(row) {
    Object.keys(Schema_1.schema.internalNames).forEach((columnName) => delete row[columnName]);
    return row;
}
function rowFormatColumn(input) {
    if (null === input || undefined === input) {
        return null;
    }
    if (typeof input === 'boolean' || typeof input === 'number' || typeof input === 'string') {
        return input;
    }
    if (Array.isArray(input) && input.every((i) => typeof i === 'string')) {
        return input;
    }
    else if (Array.isArray(input) && input.every((i) => typeof i === 'object')) {
        const returnItems = [];
        input.every((i) => returnItems.push(i.display_value));
        return returnItems;
    }
    return null;
}
function rowFormatColumns(row, columnNames) {
    const outRow = {};
    columnNames.forEach((c) => (outRow[c] = rowFormatColumn(row[c])));
    return outRow;
}
function rowsFormatColumns(rows, columnNames) {
    rows = rows.map((row) => rowFormatColumns(row, columnNames));
}
function rowMapKeyToName(row, columns) {
    const mappedRow = {};
    // move internal columns first
    Object.keys(Schema_1.schema.internalNames).forEach((key) => {
        if (row[key]) {
            mappedRow[key] = row[key];
            delete row[key];
        }
    });
    // pick each by its key for name
    Object.keys(row).forEach((key) => {
        const column = columns.find((c) => c.key === key);
        if (column) {
            mappedRow[column.name] = row[key];
        }
    });
    return mappedRow;
}
function rowExport(row, columns) {
    for (const columnName of Object.keys(columns)) {
        if (!columns.find(namePredicate(columnName))) {
            delete row[columnName];
        }
    }
    return row;
}
const dtableSchemaIsColumn = (column) => !!Schema_1.schema.columnTypes[column.type];
exports.dtableSchemaIsColumn = dtableSchemaIsColumn;
const dtableSchemaIsUpdateAbleColumn = (column) => !!Schema_1.schema.columnTypes[column.type] && !Schema_1.schema.nonUpdateAbleColumnTypes[column.type];
const dtableSchemaColumns = (columns) => columns.filter(exports.dtableSchemaIsColumn);
exports.dtableSchemaColumns = dtableSchemaColumns;
const updateAble = (columns) => columns.filter(dtableSchemaIsUpdateAbleColumn);
exports.updateAble = updateAble;
//# sourceMappingURL=GenericFunctions.js.map