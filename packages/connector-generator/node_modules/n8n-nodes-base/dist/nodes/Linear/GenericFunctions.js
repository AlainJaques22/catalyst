"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = void 0;
exports.linearApiRequest = linearApiRequest;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.linearApiRequestAllItems = linearApiRequestAllItems;
exports.validateCredentials = validateCredentials;
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
const Queries_1 = require("./Queries");
async function linearApiRequest(body = {}, option = {}) {
    const endpoint = 'https://api.linear.app/graphql';
    const authenticationMethod = this.getNodeParameter('authentication', 0, 'apiToken');
    let options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body,
        url: endpoint,
        json: true,
    };
    options = Object.assign({}, options, option);
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(this, authenticationMethod === 'apiToken' ? 'linearApi' : 'linearOAuth2Api', options);
        if (response?.errors) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response.errors, {
                message: response.errors[0].message ?? 'Unknown API Error',
            });
        }
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {}, {
            message: error.errorResponse?.[0]?.message ||
                error.context.data.errors[0]?.message ||
                'Unknown API error',
            description: error.errorResponse?.[0]?.extensions?.userPresentableMessage ||
                error.context.data.errors[0]?.extensions?.userPresentableMessage,
        });
    }
}
function capitalizeFirstLetter(data) {
    return data.charAt(0).toUpperCase() + data.slice(1);
}
async function linearApiRequestAllItems(propertyName, body = {}, limit) {
    const returnData = [];
    let responseData;
    body.variables.first = limit && limit < 50 ? limit : 50;
    body.variables.after = null;
    const propertyPath = propertyName.split('.');
    const nodesPath = [...propertyPath, 'nodes'];
    const endCursorPath = [...propertyPath, 'pageInfo', 'endCursor'];
    const hasNextPagePath = [...propertyPath, 'pageInfo', 'hasNextPage'];
    do {
        responseData = await linearApiRequest.call(this, body);
        const nodes = (0, get_1.default)(responseData, nodesPath);
        returnData.push(...nodes);
        body.variables.after = (0, get_1.default)(responseData, endCursorPath);
        if (limit && returnData.length >= limit) {
            return returnData;
        }
    } while ((0, get_1.default)(responseData, hasNextPagePath));
    return returnData;
}
async function validateCredentials(decryptedCredentials) {
    const credentials = decryptedCredentials;
    const options = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: credentials.apiKey,
        },
        method: 'POST',
        body: {
            query: Queries_1.query.getIssues(),
            variables: {
                first: 1,
            },
        },
        url: 'https://api.linear.app/graphql',
        json: true,
    };
    return await this.helpers.request(options);
}
//@ts-ignore
const sort = (a, b) => {
    if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        return -1;
    }
    if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        return 1;
    }
    return 0;
};
exports.sort = sort;
//# sourceMappingURL=GenericFunctions.js.map