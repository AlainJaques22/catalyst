"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const mqtt_1 = require("mqtt");
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../utils/utilities");
const createClient = async (credentials) => {
    const { protocol, host, port, clean, clientId, username, password } = credentials;
    const clientOptions = {
        protocol,
        host,
        port,
        clean,
        clientId: clientId || `mqttjs_${(0, n8n_workflow_1.randomString)(8).toLowerCase()}`,
    };
    if (username && password) {
        clientOptions.username = username;
        clientOptions.password = password;
    }
    if (credentials.ssl) {
        clientOptions.ca = (0, utilities_1.formatPrivateKey)(credentials.ca);
        clientOptions.cert = (0, utilities_1.formatPrivateKey)(credentials.cert);
        clientOptions.key = (0, utilities_1.formatPrivateKey)(credentials.key);
        clientOptions.rejectUnauthorized = credentials.rejectUnauthorized;
    }
    return await new Promise((resolve, reject) => {
        const client = (0, mqtt_1.connect)(clientOptions);
        const onConnect = () => {
            client.removeListener('connect', onConnect);
            client.removeListener('error', onError);
            resolve(client);
        };
        const onError = (error) => {
            client.removeListener('connect', onConnect);
            client.removeListener('error', onError);
            // mqtt client has an automatic reconnect mechanism that will
            // keep trying to reconnect until it succeeds unless we
            // explicitly close the client
            client.end();
            reject(new n8n_workflow_1.ApplicationError(error.message));
        };
        client.once('connect', onConnect);
        client.once('error', onError);
    });
};
exports.createClient = createClient;
//# sourceMappingURL=GenericFunctions.js.map