"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildParameterizedConnString = buildParameterizedConnString;
exports.buildMongoConnectionParams = buildMongoConnectionParams;
exports.validateAndResolveMongoCredentials = validateAndResolveMongoCredentials;
exports.prepareItems = prepareItems;
exports.prepareFields = prepareFields;
exports.stringifyObjectIDs = stringifyObjectIDs;
exports.connectMongoClient = connectMongoClient;
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const mongodb_1 = require("mongodb");
const n8n_workflow_1 = require("n8n-workflow");
const tls_1 = require("tls");
const utilities_1 = require("../../utils/utilities");
/**
 * Standard way of building the MongoDB connection string, unless overridden with a provided string
 *
 * @param {ICredentialDataDecryptedObject} credentials MongoDB credentials to use, unless conn string is overridden
 */
function buildParameterizedConnString(credentials) {
    if (credentials.port) {
        return `mongodb://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}`;
    }
    else {
        return `mongodb+srv://${credentials.user}:${credentials.password}@${credentials.host}`;
    }
}
/**
 * Build mongoDb connection string and resolve database name.
 * If a connection string override value is provided, that will be used in place of individual args
 *
 * @param {ICredentialDataDecryptedObject} credentials raw/input MongoDB credentials to use
 */
function buildMongoConnectionParams(node, credentials) {
    const sanitizedDbName = credentials.database && credentials.database.trim().length > 0
        ? credentials.database.trim()
        : '';
    if (credentials.configurationType === 'connectionString') {
        if (credentials.connectionString && credentials.connectionString.trim().length > 0) {
            return {
                connectionString: credentials.connectionString.trim(),
                database: sanitizedDbName,
            };
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(node, 'Cannot override credentials: valid MongoDB connection string not provided ');
        }
    }
    else {
        return {
            connectionString: buildParameterizedConnString(credentials),
            database: sanitizedDbName,
        };
    }
}
/**
 * Verify credentials. If ok, build mongoDb connection string and resolve database name.
 *
 * @param {ICredentialDataDecryptedObject} credentials raw/input MongoDB credentials to use
 */
function validateAndResolveMongoCredentials(node, credentials) {
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeOperationError(node, 'No credentials got returned!');
    }
    else {
        return buildMongoConnectionParams(node, credentials);
    }
}
function prepareItems({ items, fields, updateKey = '', useDotNotation = false, dateFields = [], isUpdate = false, }) {
    let data = items;
    if (updateKey) {
        if (!fields.includes(updateKey)) {
            fields.push(updateKey);
        }
        data = items.filter((item) => item.json[updateKey] !== undefined);
    }
    const preparedItems = data.map(({ json }) => {
        const updateItem = {};
        for (const field of fields) {
            let fieldData;
            if (useDotNotation) {
                fieldData = (0, get_1.default)(json, field, null);
            }
            else {
                fieldData = json[field] !== undefined ? json[field] : null;
            }
            if (fieldData && dateFields.includes(field)) {
                fieldData = new Date(fieldData);
            }
            if (useDotNotation && !isUpdate) {
                (0, set_1.default)(updateItem, field, fieldData);
            }
            else {
                updateItem[field] = fieldData;
            }
        }
        return updateItem;
    });
    return preparedItems;
}
function prepareFields(fields) {
    return fields
        .split(',')
        .map((field) => field.trim())
        .filter((field) => !!field);
}
function stringifyObjectIDs(items) {
    items.forEach((item) => {
        if (item._id instanceof mongodb_1.ObjectId) {
            item.json._id = item._id.toString();
        }
        if (item.id instanceof mongodb_1.ObjectId) {
            item.json.id = item.id.toString();
        }
    });
    return items;
}
async function connectMongoClient(connectionString, nodeVersion, credentials = {}) {
    let client;
    const driverInfo = {
        name: 'n8n_crud',
        version: nodeVersion > 0 ? nodeVersion.toString() : 'unknown',
    };
    if (credentials.tls) {
        const ca = credentials.ca ? (0, utilities_1.formatPrivateKey)(credentials.ca) : undefined;
        const cert = credentials.cert ? (0, utilities_1.formatPrivateKey)(credentials.cert) : undefined;
        const key = credentials.key ? (0, utilities_1.formatPrivateKey)(credentials.key) : undefined;
        const passphrase = credentials.passphrase || undefined;
        const secureContext = (0, tls_1.createSecureContext)({
            ca,
            cert,
            key,
            passphrase,
        });
        client = await mongodb_1.MongoClient.connect(connectionString, {
            tls: true,
            secureContext,
            driverInfo,
        });
    }
    else {
        client = await mongodb_1.MongoClient.connect(connectionString, { driverInfo });
    }
    return client;
}
//# sourceMappingURL=GenericFunctions.js.map