"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureTransport = configureTransport;
exports.smtpConnectionTest = smtpConnectionTest;
const nodemailer_1 = require("nodemailer");
function configureTransport(credentials, options) {
    const connectionOptions = {
        host: credentials.host,
        port: credentials.port,
        secure: credentials.secure,
    };
    if (credentials.secure === false) {
        connectionOptions.ignoreTLS = credentials.disableStartTls;
    }
    if (typeof credentials.hostName === 'string' && credentials.hostName) {
        connectionOptions.name = credentials.hostName;
    }
    if (credentials.user || credentials.password) {
        connectionOptions.auth = {
            user: credentials.user,
            pass: credentials.password,
        };
    }
    if (options.allowUnauthorizedCerts === true) {
        connectionOptions.tls = {
            rejectUnauthorized: false,
        };
    }
    return (0, nodemailer_1.createTransport)(connectionOptions);
}
async function smtpConnectionTest(credential) {
    const credentials = credential.data;
    const transporter = configureTransport(credentials, {});
    try {
        await transporter.verify();
        return {
            status: 'OK',
            message: 'Connection successful!',
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: error.message,
        };
    }
    finally {
        transporter.close();
    }
}
//# sourceMappingURL=utils.js.map