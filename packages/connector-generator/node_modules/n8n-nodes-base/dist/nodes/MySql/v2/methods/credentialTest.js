"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlConnectionTest = mysqlConnectionTest;
const transport_1 = require("../transport");
async function mysqlConnectionTest(credential) {
    const credentials = credential.data;
    const pool = await transport_1.createPool.call(this, credentials);
    try {
        const connection = await pool.getConnection();
        connection.release();
    }
    catch (error) {
        return {
            status: 'Error',
            message: error.message,
        };
    }
    finally {
        await pool.end();
    }
    return {
        status: 'OK',
        message: 'Connection successful!',
    };
}
//# sourceMappingURL=credentialTest.js.map