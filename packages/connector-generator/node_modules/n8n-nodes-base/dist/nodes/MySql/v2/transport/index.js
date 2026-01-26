"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = createPool;
const promise_1 = __importDefault(require("mysql2/promise"));
const node_net_1 = require("node:net");
const constants_1 = require("../../../../utils/constants");
const utilities_1 = require("../../../../utils/utilities");
async function createPool(credentials, options) {
    const connectionOptions = {
        host: credentials.host,
        port: credentials.port,
        database: credentials.database,
        user: credentials.user,
        password: credentials.password,
        multipleStatements: true,
        supportBigNumbers: true,
        decimalNumbers: false,
    };
    if (credentials.ssl) {
        connectionOptions.ssl = {};
        if (credentials.caCertificate) {
            connectionOptions.ssl.ca = (0, utilities_1.formatPrivateKey)(credentials.caCertificate);
        }
        if (credentials.clientCertificate || credentials.clientPrivateKey) {
            connectionOptions.ssl.cert = (0, utilities_1.formatPrivateKey)(credentials.clientCertificate);
            connectionOptions.ssl.key = (0, utilities_1.formatPrivateKey)(credentials.clientPrivateKey);
        }
    }
    if (options?.nodeVersion && options.nodeVersion >= 2.1) {
        connectionOptions.dateStrings = true;
    }
    if (options?.connectionLimit) {
        connectionOptions.connectionLimit = options.connectionLimit;
    }
    if (options?.connectTimeout) {
        connectionOptions.connectTimeout = options.connectTimeout;
    }
    if (options?.largeNumbersOutput === 'text') {
        connectionOptions.bigNumberStrings = true;
    }
    if (options?.decimalNumbers === true) {
        connectionOptions.decimalNumbers = true;
    }
    if (!credentials.sshTunnel) {
        return promise_1.default.createPool(connectionOptions);
    }
    else {
        if (credentials.sshAuthenticateWith === 'privateKey' && credentials.privateKey) {
            credentials.privateKey = (0, utilities_1.formatPrivateKey)(credentials.privateKey);
        }
        const sshClient = await this.helpers.getSSHClient(credentials);
        // Find a free TCP port
        const localPort = await new Promise((resolve) => {
            const tempServer = (0, node_net_1.createServer)();
            tempServer.listen(0, constants_1.LOCALHOST, () => {
                resolve(tempServer.address().port);
                tempServer.close();
            });
        });
        const stream = await new Promise((resolve, reject) => {
            sshClient.forwardOut(constants_1.LOCALHOST, localPort, credentials.host, credentials.port, (err, clientChannel) => {
                if (err)
                    return reject(err);
                resolve(clientChannel);
            });
        });
        return promise_1.default.createPool({
            ...connectionOptions,
            stream,
        });
    }
}
//# sourceMappingURL=index.js.map