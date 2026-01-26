"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresConnectionTest = postgresConnectionTest;
const transport_1 = require("../../transport");
async function postgresConnectionTest(credential) {
    const credentials = credential.data;
    let connection;
    try {
        const { db } = await transport_1.configurePostgres.call(this, credentials, {});
        connection = await db.connect();
    }
    catch (error) {
        let message = error.message;
        if (error.message.includes('ECONNREFUSED')) {
            message = 'Connection refused';
        }
        if (error.message.includes('ENOTFOUND')) {
            message = 'Host not found, please check your host name';
        }
        if (error.message.includes('ETIMEDOUT')) {
            message = 'Connection timed out';
        }
        return {
            status: 'Error',
            message,
        };
    }
    finally {
        if (connection) {
            await connection.done();
        }
    }
    return {
        status: 'OK',
        message: 'Connection successful!',
    };
}
//# sourceMappingURL=credentialTest.js.map