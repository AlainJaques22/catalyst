"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumns = getColumns;
exports.getColumnsMultiOptions = getColumnsMultiOptions;
exports.getColumnsWithoutColumnToMatchOn = getColumnsWithoutColumnToMatchOn;
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function getColumns() {
    const credentials = await this.getCredentials('mySql');
    const nodeOptions = this.getNodeParameter('options', 0);
    const pool = await transport_1.createPool.call(this, credentials, nodeOptions);
    try {
        const connection = await pool.getConnection();
        const table = this.getNodeParameter('table', 0, {
            extractValue: true,
        });
        const columns = (await connection.query(`SHOW COLUMNS FROM ${(0, utils_1.escapeSqlIdentifier)(table)} FROM ${(0, utils_1.escapeSqlIdentifier)(credentials.database)}`))[0];
        connection.release();
        return (columns || []).map((column) => ({
            name: column.Field,
            value: column.Field,
            // eslint-disable-next-line n8n-nodes-base/node-param-description-lowercase-first-char
            description: `type: ${column.Type.toUpperCase()}, nullable: ${column.Null}`,
        }));
    }
    finally {
        await pool.end();
    }
}
async function getColumnsMultiOptions() {
    const returnData = await getColumns.call(this);
    const returnAll = { name: '*', value: '*', description: 'All columns' };
    return [returnAll, ...returnData];
}
async function getColumnsWithoutColumnToMatchOn() {
    const columnToMatchOn = this.getNodeParameter('columnToMatchOn');
    const returnData = await getColumns.call(this);
    return returnData.filter((column) => column.value !== columnToMatchOn);
}
//# sourceMappingURL=loadOptions.js.map