"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = createConnection;
exports.searchTables = searchTables;
const promise_1 = __importDefault(require("mysql2/promise"));
async function createConnection(credentials) {
    const { ssl, caCertificate, clientCertificate, clientPrivateKey, ...baseCredentials } = credentials;
    if (ssl) {
        baseCredentials.ssl = {};
        if (caCertificate) {
            baseCredentials.ssl.ca = caCertificate;
        }
        if (clientCertificate || clientPrivateKey) {
            baseCredentials.ssl.cert = clientCertificate;
            baseCredentials.ssl.key = clientPrivateKey;
        }
    }
    return await promise_1.default.createConnection(baseCredentials);
}
async function searchTables(tableName) {
    const credentials = await this.getCredentials('mySql');
    const connection = await createConnection(credentials);
    const sql = `SELECT table_name
FROM   information_schema.tables
WHERE  table_schema = ?
AND table_name LIKE ?
ORDER  BY table_name`;
    const values = [credentials.database, `%${tableName ?? ''}%`];
    const [rows] = await connection.query(sql, values);
    const results = rows.map((table) => ({
        name: table.table_name || table.TABLE_NAME,
        value: table.table_name || table.TABLE_NAME,
    }));
    await connection.end();
    return { results };
}
//# sourceMappingURL=GenericFunctions.js.map