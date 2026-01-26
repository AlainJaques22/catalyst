"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCursorPaginatorUsers = exports.getCursorPaginatorCalls = exports.extractUsers = exports.extractCalls = void 0;
exports.gongApiRequest = gongApiRequest;
exports.gongApiPaginateRequest = gongApiPaginateRequest;
exports.handleErrorPostReceive = handleErrorPostReceive;
exports.isValidNumberIds = isValidNumberIds;
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
async function gongApiRequest(method, endpoint, body = {}, query = {}) {
    const authentication = this.getNodeParameter('authentication', 0);
    const credentialsType = authentication === 'oAuth2' ? 'gongOAuth2Api' : 'gongApi';
    const { baseUrl } = await this.getCredentials(credentialsType);
    const options = {
        method,
        url: baseUrl.replace(new RegExp('/$'), '') + endpoint,
        json: true,
        headers: {
            'Content-Type': 'application/json',
        },
        body,
        qs: query,
    };
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    return await this.helpers.requestWithAuthentication.call(this, credentialsType, options);
}
async function gongApiPaginateRequest(method, endpoint, body = {}, query = {}, itemIndex = 0, rootProperty = undefined) {
    const authentication = this.getNodeParameter('authentication', 0);
    const credentialsType = authentication === 'oAuth2' ? 'gongOAuth2Api' : 'gongApi';
    const { baseUrl } = await this.getCredentials(credentialsType);
    const options = {
        method,
        url: baseUrl.replace(new RegExp('/$'), '') + endpoint,
        json: true,
        headers: {
            'Content-Type': 'application/json',
        },
        body,
        qs: query,
    };
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    const pages = await this.helpers.requestWithAuthenticationPaginated.call(this, options, itemIndex, {
        requestInterval: 340, // Rate limit 3 calls per second
        continue: '={{ $response.body.records.cursor }}',
        request: {
            [method === 'POST' ? 'body' : 'qs']: '={{ $if($response.body?.records.cursor, { cursor: $response.body.records.cursor }, {}) }}',
            url: options.url,
        },
    }, credentialsType);
    if (rootProperty) {
        let results = [];
        for (const page of pages) {
            const items = page.body[rootProperty];
            if (items) {
                results = results.concat(items);
            }
        }
        return results;
    }
    else {
        return pages.flat();
    }
}
const getCursorPaginator = (extractItems) => {
    return async function cursorPagination(requestOptions) {
        let executions = [];
        let responseData;
        let nextCursor = undefined;
        const returnAll = this.getNodeParameter('returnAll', true);
        do {
            requestOptions.options.body.cursor = nextCursor;
            responseData = await this.makeRoutingRequest(requestOptions);
            const lastItem = responseData[responseData.length - 1].json;
            nextCursor = lastItem.records?.cursor;
            executions = executions.concat(extractItems(responseData));
        } while (returnAll && nextCursor);
        return executions;
    };
};
const extractCalls = (items) => {
    const calls = items.flatMap((item) => (0, get_1.default)(item.json, 'calls'));
    return calls.map((call) => {
        const { metaData, ...rest } = call ?? {};
        return { json: { ...metaData, ...rest } };
    });
};
exports.extractCalls = extractCalls;
const extractUsers = (items) => {
    const users = items.flatMap((item) => (0, get_1.default)(item.json, 'users'));
    return users.map((user) => ({ json: user }));
};
exports.extractUsers = extractUsers;
const getCursorPaginatorCalls = () => {
    return getCursorPaginator(exports.extractCalls);
};
exports.getCursorPaginatorCalls = getCursorPaginatorCalls;
const getCursorPaginatorUsers = () => {
    return getCursorPaginator(exports.extractUsers);
};
exports.getCursorPaginatorUsers = getCursorPaginatorUsers;
async function handleErrorPostReceive(data, response) {
    if (String(response.statusCode).startsWith('4') || String(response.statusCode).startsWith('5')) {
        const { resource, operation } = this.getNode().parameters;
        if (resource === 'call') {
            if (operation === 'get') {
                if (response.statusCode === 404) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                        message: "The required call doesn't match any existing one",
                        description: "Double-check the value in the parameter 'Call to Get' and try again",
                    });
                }
            }
            else if (operation === 'getAll') {
                if (response.statusCode === 404) {
                    const primaryUserId = this.getNodeParameter('filters.primaryUserIds', {});
                    if (Object.keys(primaryUserId).length !== 0) {
                        return [{ json: {} }];
                    }
                }
                else if (response.statusCode === 400 || response.statusCode === 500) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                        description: 'Double-check the value(s) in the parameter(s)',
                    });
                }
            }
        }
        else if (resource === 'user') {
            if (operation === 'get') {
                if (response.statusCode === 404) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                        message: "The required user doesn't match any existing one",
                        description: "Double-check the value in the parameter 'User to Get' and try again",
                    });
                }
            }
            else if (operation === 'getAll') {
                if (response.statusCode === 404) {
                    const userIds = this.getNodeParameter('filters.userIds', '');
                    if (userIds) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                            message: "The Users IDs don't match any existing user",
                            description: "Double-check the values in the parameter 'Users IDs' and try again",
                        });
                    }
                }
            }
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response);
    }
    return data;
}
function isValidNumberIds(value) {
    if (typeof value === 'number') {
        return true;
    }
    if (Array.isArray(value) && value.every((item) => typeof item === 'number')) {
        return true;
    }
    if (typeof value === 'string') {
        const parts = value.split(',');
        return parts.every((part) => !isNaN(Number(part.trim())));
    }
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
        return true;
    }
    return false;
}
//# sourceMappingURL=GenericFunctions.js.map