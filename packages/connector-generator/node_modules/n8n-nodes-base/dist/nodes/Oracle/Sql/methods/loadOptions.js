"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumns = getColumns;
exports.getColumnsMultiOptions = getColumnsMultiOptions;
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function getColumns() {
    const credentials = await this.getCredentials('oracleDBApi');
    const options = { nodeVersion: this.getNode().typeVersion };
    const pool = await transport_1.configureOracleDB.call(this, credentials, options);
    const schema = this.getNodeParameter('schema', 0, {
        extractValue: true,
    });
    const table = this.getNodeParameter('table', 0, {
        extractValue: true,
    });
    const columns = await (0, utils_1.getColumnMetaData)(this.getNode(), pool, schema, table);
    return columns.map((column) => ({
        name: column.columnName,
        value: column.columnName,
        description: `Type: ${column.dataType.toUpperCase()}, Nullable: ${column.isNullable}`,
    }));
}
async function getColumnsMultiOptions() {
    const returnData = await getColumns.call(this);
    const returnAll = { name: '*', value: '*', description: 'All columns' };
    return [returnAll, ...returnData];
}
//# sourceMappingURL=loadOptions.js.map