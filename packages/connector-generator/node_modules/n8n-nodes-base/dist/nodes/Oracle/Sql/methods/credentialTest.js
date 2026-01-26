"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oracleDBConnectionTest = oracleDBConnectionTest;
const transport_1 = require("../transport");
async function oracleDBConnectionTest(credential) {
    const credentials = credential.data;
    let pool;
    try {
        pool = await transport_1.configureOracleDB.call(this, credentials, {});
        const conn = await pool.getConnection();
        await conn.close();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            status: 'Error',
            message,
        };
    }
    return {
        status: 'OK',
        message: 'Connection successful!',
    };
}
//# sourceMappingURL=credentialTest.js.map