"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTables = searchTables;
const transport_1 = require("../transport");
async function searchTables() {
    const credentials = await this.getCredentials('mySql');
    const nodeOptions = this.getNodeParameter('options', 0);
    const pool = await transport_1.createPool.call(this, credentials, nodeOptions);
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = ?';
        const values = [credentials.database];
        const formatedQuery = connection.format(query, values);
        const response = (await connection.query(formatedQuery))[0];
        connection.release();
        const results = response.map((table) => ({
            name: table.table_name || table.TABLE_NAME,
            value: table.table_name || table.TABLE_NAME,
        }));
        return { results };
    }
    finally {
        await pool.end();
    }
}
//# sourceMappingURL=listSearch.js.map