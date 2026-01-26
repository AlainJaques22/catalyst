"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFilterOperationToJSONRPC = exports.mapOdooResources = exports.mapOperationToJSONRPC = void 0;
exports.odooGetDBName = odooGetDBName;
exports.processNameValueFields = processNameValueFields;
exports.odooJSONRPCRequest = odooJSONRPCRequest;
exports.odooGetModelFields = odooGetModelFields;
exports.odooCreate = odooCreate;
exports.odooGet = odooGet;
exports.odooGetAll = odooGetAll;
exports.odooUpdate = odooUpdate;
exports.odooDelete = odooDelete;
exports.odooGetUserID = odooGetUserID;
exports.odooGetServerVersion = odooGetServerVersion;
const n8n_workflow_1 = require("n8n-workflow");
const serviceJSONRPC = 'object';
const methodJSONRPC = 'execute';
exports.mapOperationToJSONRPC = {
    create: 'create',
    get: 'read',
    getAll: 'search_read',
    update: 'write',
    delete: 'unlink',
};
exports.mapOdooResources = {
    contact: 'res.partner',
    opportunity: 'crm.lead',
    note: 'note.note',
};
exports.mapFilterOperationToJSONRPC = {
    equal: '=',
    notEqual: '!=',
    greaterThen: '>',
    lesserThen: '<',
    greaterOrEqual: '>=',
    lesserOrEqual: '<=',
    like: 'like',
    in: 'in',
    notIn: 'not in',
    childOf: 'child_of',
};
function odooGetDBName(databaseName, url) {
    if (databaseName)
        return databaseName;
    const odooURL = new URL(url);
    const hostname = odooURL.hostname;
    if (!hostname)
        return '';
    return odooURL.hostname.split('.')[0];
}
function processFilters(value) {
    return value.filter?.map((item) => {
        const operator = item.operator;
        item.operator = exports.mapFilterOperationToJSONRPC[operator];
        return Object.values(item);
    });
}
function processNameValueFields(value) {
    const data = value;
    return data?.fields?.reduce((acc, record) => {
        return Object.assign(acc, { [record.fieldName]: record.fieldValue });
    }, {});
}
// function processResponseFields(value: IDataObject) {
// 	const data = value as unknown as IOdooResponseFields;
// 	return data?.fields?.map((entry) => entry.field);
// }
async function odooJSONRPCRequest(body, url) {
    try {
        const options = {
            headers: {
                'User-Agent': 'n8n',
                Connection: 'keep-alive',
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body,
            uri: `${url}/jsonrpc`,
            json: true,
        };
        const response = await this.helpers.request(options);
        if (response.error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response.error.data, {
                message: response.error.data.message,
            });
        }
        return response.result;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function odooGetModelFields(db, userID, password, resource, url) {
    try {
        const body = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: serviceJSONRPC,
                method: methodJSONRPC,
                args: [
                    db,
                    userID,
                    password,
                    exports.mapOdooResources[resource] || resource,
                    'fields_get',
                    [],
                    ['string', 'type', 'help', 'required', 'name'],
                ],
            },
            id: (0, n8n_workflow_1.randomInt)(100),
        };
        const result = await odooJSONRPCRequest.call(this, body, url);
        return result;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function odooCreate(db, userID, password, resource, operation, url, newItem) {
    try {
        const body = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: serviceJSONRPC,
                method: methodJSONRPC,
                args: [
                    db,
                    userID,
                    password,
                    exports.mapOdooResources[resource] || resource,
                    exports.mapOperationToJSONRPC[operation],
                    newItem || {},
                ],
            },
            id: (0, n8n_workflow_1.randomInt)(100),
        };
        const result = await odooJSONRPCRequest.call(this, body, url);
        return { id: result };
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function odooGet(db, userID, password, resource, operation, url, itemsID, fieldsToReturn) {
    try {
        if (!/^\d+$/.test(itemsID) || !parseInt(itemsID, 10)) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                status: 'Error',
                message: `Please specify a valid ID: ${itemsID}`,
            });
        }
        const body = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: serviceJSONRPC,
                method: methodJSONRPC,
                args: [
                    db,
                    userID,
                    password,
                    exports.mapOdooResources[resource] || resource,
                    exports.mapOperationToJSONRPC[operation],
                    itemsID ? [+itemsID] : [],
                    fieldsToReturn || [],
                ],
            },
            id: (0, n8n_workflow_1.randomInt)(100),
        };
        const result = await odooJSONRPCRequest.call(this, body, url);
        return result;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function odooGetAll(db, userID, password, resource, operation, url, filters, fieldsToReturn, limit = 0) {
    try {
        const body = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: serviceJSONRPC,
                method: methodJSONRPC,
                args: [
                    db,
                    userID,
                    password,
                    exports.mapOdooResources[resource] || resource,
                    exports.mapOperationToJSONRPC[operation],
                    (filters && processFilters(filters)) || [],
                    fieldsToReturn || [],
                    0, // offset
                    limit,
                ],
            },
            id: (0, n8n_workflow_1.randomInt)(100),
        };
        const result = await odooJSONRPCRequest.call(this, body, url);
        return result;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function odooUpdate(db, userID, password, resource, operation, url, itemsID, fieldsToUpdate) {
    try {
        if (!Object.keys(fieldsToUpdate).length) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                status: 'Error',
                message: 'Please specify at least one field to update',
            });
        }
        if (!/^\d+$/.test(itemsID) || !parseInt(itemsID, 10)) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                status: 'Error',
                message: `Please specify a valid ID: ${itemsID}`,
            });
        }
        const body = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: serviceJSONRPC,
                method: methodJSONRPC,
                args: [
                    db,
                    userID,
                    password,
                    exports.mapOdooResources[resource] || resource,
                    exports.mapOperationToJSONRPC[operation],
                    itemsID ? [+itemsID] : [],
                    fieldsToUpdate,
                ],
            },
            id: (0, n8n_workflow_1.randomInt)(100),
        };
        await odooJSONRPCRequest.call(this, body, url);
        return { id: itemsID };
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function odooDelete(db, userID, password, resource, operation, url, itemsID) {
    if (!/^\d+$/.test(itemsID) || !parseInt(itemsID, 10)) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            status: 'Error',
            message: `Please specify a valid ID: ${itemsID}`,
        });
    }
    try {
        const body = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: serviceJSONRPC,
                method: methodJSONRPC,
                args: [
                    db,
                    userID,
                    password,
                    exports.mapOdooResources[resource] || resource,
                    exports.mapOperationToJSONRPC[operation],
                    itemsID ? [+itemsID] : [],
                ],
            },
            id: (0, n8n_workflow_1.randomInt)(100),
        };
        await odooJSONRPCRequest.call(this, body, url);
        return { success: true };
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function odooGetUserID(db, username, password, url) {
    try {
        const body = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: 'common',
                method: 'login',
                args: [db, username, password],
            },
            id: (0, n8n_workflow_1.randomInt)(100),
        };
        const loginResult = await odooJSONRPCRequest.call(this, body, url);
        return loginResult;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function odooGetServerVersion(url) {
    try {
        const body = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: 'common',
                method: 'version',
                args: [],
            },
            id: (0, n8n_workflow_1.randomInt)(100),
        };
        const result = await odooJSONRPCRequest.call(this, body, url);
        return result;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map