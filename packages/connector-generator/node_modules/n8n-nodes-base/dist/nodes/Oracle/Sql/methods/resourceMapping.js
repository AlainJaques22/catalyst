"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMappingColumns = getMappingColumns;
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function getMappingColumns() {
    const credentials = await this.getCredentials('oracleDBApi');
    const pool = await transport_1.configureOracleDB.call(this, credentials);
    const schema = this.getNodeParameter('schema', 0, {
        extractValue: true,
    });
    const table = this.getNodeParameter('table', 0, {
        extractValue: true,
    });
    const columns = await (0, utils_1.getColumnMetaData)(this.getNode(), pool, schema, table);
    const fields = columns.map((col) => {
        const type = (0, utils_1.mapDbType)(col.dataType).n8nType;
        const nullable = col.isNullable;
        const hasDefault = col.columnDefault === 'YES';
        const isGenerated = col.isGenerated === 'ALWAYS';
        return {
            id: col.columnName,
            displayName: col.columnName,
            required: !nullable && !hasDefault && !isGenerated,
            display: true,
            type,
            defaultMatch: true,
        };
    });
    return { fields };
}
//# sourceMappingURL=resourceMapping.js.map