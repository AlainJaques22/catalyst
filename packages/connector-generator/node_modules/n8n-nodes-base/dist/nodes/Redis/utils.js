"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRedisClient = setupRedisClient;
exports.redisConnectionTest = redisConnectionTest;
exports.convertInfoToObject = convertInfoToObject;
exports.getValue = getValue;
exports.setValue = setValue;
const n8n_workflow_1 = require("n8n-workflow");
const redis_1 = require("redis");
function setupRedisClient(credentials, isTest = false) {
    const socketConfig = {
        host: credentials.host,
        port: credentials.port,
        tls: credentials.ssl === true,
        connectTimeout: 10000,
        // Disable reconnection for tests to prevent hanging
        reconnectStrategy: isTest ? false : undefined,
    };
    // If SSL is enabled and TLS verification should be disabled
    if (credentials.ssl === true && credentials.disableTlsVerification === true) {
        socketConfig.rejectUnauthorized = false;
    }
    return (0, redis_1.createClient)({
        socket: socketConfig,
        database: credentials.database,
        username: credentials.user ?? undefined,
        password: credentials.password ?? undefined,
        // Disable automatic error retry for tests
        ...(isTest && {
            disableOfflineQueue: true,
            enableOfflineQueue: false,
        }),
    });
}
async function redisConnectionTest(credential) {
    const credentials = credential.data;
    let client;
    try {
        client = setupRedisClient(credentials, true);
        // Add error event handler to catch connection errors
        const errorPromise = new Promise((_, reject) => {
            client.on('error', (err) => {
                reject(err);
            });
        });
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Connection timeout: Unable to connect to Redis server'));
            }, 10000); // 10 seconds timeout
        });
        // Race between connecting and error/timeout
        await Promise.race([client.connect(), errorPromise, timeoutPromise]);
        await client.ping();
        return {
            status: 'OK',
            message: 'Connection successful!',
        };
    }
    catch (error) {
        // Handle specific error types for better user feedback
        let errorMessage = error.message;
        if (error.code === 'ECONNRESET') {
            errorMessage =
                'Connection reset: The Redis server rejected the connection. This often happens when trying to connect without SSL to an SSL-only server.';
        }
        else if (error.code === 'ECONNREFUSED') {
            errorMessage =
                'Connection refused: Unable to connect to the Redis server. Please check the host and port.';
        }
        return {
            status: 'Error',
            message: errorMessage,
        };
    }
    finally {
        // Ensure the Redis client is always closed to prevent leaked connections
        if (client) {
            try {
                await client.quit();
            }
            catch {
                // If quit fails, forcefully disconnect
                try {
                    await client.disconnect();
                }
                catch {
                    // Ignore disconnect errors in cleanup
                }
            }
        }
    }
}
/** Parses the given value in a number if it is one else returns a string */
function getParsedValue(value) {
    if (value.match(/^[\d.]+$/) === null) {
        // Is a string
        return value;
    }
    else {
        // Is a number
        return parseFloat(value);
    }
}
/** Converts the Redis Info String into an object */
function convertInfoToObject(stringData) {
    const returnData = {};
    let key, value;
    for (const line of stringData.split('\n')) {
        if (['#', ''].includes(line.charAt(0))) {
            continue;
        }
        [key, value] = line.split(':');
        if (key === undefined || value === undefined) {
            continue;
        }
        value = value.trim();
        if (value.includes('=')) {
            returnData[key] = {};
            let key2, value2;
            for (const keyValuePair of value.split(',')) {
                [key2, value2] = keyValuePair.split('=');
                returnData[key][key2] = getParsedValue(value2);
            }
        }
        else {
            returnData[key] = getParsedValue(value);
        }
    }
    return returnData;
}
async function getValue(client, keyName, type) {
    if (type === undefined || type === 'automatic') {
        // Request the type first
        type = await client.type(keyName);
    }
    if (type === 'string') {
        return await client.get(keyName);
    }
    else if (type === 'hash') {
        return await client.hGetAll(keyName);
    }
    else if (type === 'list') {
        return await client.lRange(keyName, 0, -1);
    }
    else if (type === 'sets') {
        return await client.sMembers(keyName);
    }
}
async function setValue(client, keyName, value, expire, ttl, type, valueIsJSON) {
    if (type === undefined || type === 'automatic') {
        // Request the type first
        if (typeof value === 'string') {
            type = 'string';
        }
        else if (Array.isArray(value)) {
            type = 'list';
        }
        else if (typeof value === 'object') {
            type = 'hash';
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Could not identify the type to set. Please set it manually!');
        }
    }
    if (type === 'string') {
        await client.set(keyName, value.toString());
    }
    else if (type === 'hash') {
        if (valueIsJSON) {
            let values;
            if (typeof value === 'string') {
                try {
                    values = JSON.parse(value);
                }
                catch {
                    // This is how we originally worked and prevents a breaking change
                    values = value;
                }
            }
            else {
                values = value;
            }
            for (const key of Object.keys(values)) {
                await client.hSet(keyName, key, values[key].toString());
            }
        }
        else {
            const values = value.toString().split(' ');
            await client.hSet(keyName, values);
        }
    }
    else if (type === 'list') {
        for (let index = 0; index < value.length; index++) {
            await client.lSet(keyName, index, value[index].toString());
        }
    }
    else if (type === 'sets') {
        //@ts-ignore
        await client.sAdd(keyName, value);
    }
    if (expire) {
        await client.expire(keyName, ttl);
    }
    return;
}
//# sourceMappingURL=utils.js.map