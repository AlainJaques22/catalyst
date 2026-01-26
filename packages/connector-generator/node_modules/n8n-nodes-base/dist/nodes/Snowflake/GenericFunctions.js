"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionOptions = void 0;
exports.connect = connect;
exports.destroy = destroy;
exports.execute = execute;
const crypto_1 = require("crypto");
const pick_1 = __importDefault(require("lodash/pick"));
const utilities_1 = require("../../utils/utilities");
const commonConnectionFields = [
    'account',
    'database',
    'schema',
    'warehouse',
    'role',
    'clientSessionKeepAlive',
];
const extractPrivateKey = (credential) => {
    const key = (0, utilities_1.formatPrivateKey)(credential.privateKey);
    if (!credential.passphrase)
        return key;
    const privateKeyObject = (0, crypto_1.createPrivateKey)({
        key,
        format: 'pem',
        passphrase: credential.passphrase,
    });
    return privateKeyObject.export({
        format: 'pem',
        type: 'pkcs8',
    });
};
const getConnectionOptions = (credential) => {
    const connectionOptions = (0, pick_1.default)(credential, commonConnectionFields);
    if (credential.authentication === 'keyPair') {
        connectionOptions.authenticator = 'SNOWFLAKE_JWT';
        connectionOptions.username = credential.username;
        connectionOptions.privateKey = extractPrivateKey(credential);
    }
    else {
        connectionOptions.username = credential.username;
        connectionOptions.password = credential.password;
    }
    return connectionOptions;
};
exports.getConnectionOptions = getConnectionOptions;
async function connect(conn) {
    return await new Promise((resolve, reject) => {
        conn.connect((error) => (error ? reject(error) : resolve()));
    });
}
async function destroy(conn) {
    return await new Promise((resolve, reject) => {
        conn.destroy((error) => (error ? reject(error) : resolve()));
    });
}
async function execute(conn, sqlText, binds) {
    return await new Promise((resolve, reject) => {
        conn.execute({
            sqlText,
            binds,
            complete: (error, _, rows) => (error ? reject(error) : resolve(rows)),
        });
    });
}
//# sourceMappingURL=GenericFunctions.js.map