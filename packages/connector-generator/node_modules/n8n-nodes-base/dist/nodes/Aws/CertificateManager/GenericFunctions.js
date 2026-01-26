"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequest = awsApiRequest;
exports.awsApiRequestREST = awsApiRequestREST;
exports.awsApiRequestAllItems = awsApiRequestAllItems;
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../GenericFunctions");
async function awsApiRequest(service, method, path, body, query = {}, headers) {
    const { credentials, credentialsType } = await (0, GenericFunctions_1.getAwsCredentials)(this);
    const requestOptions = {
        qs: {
            service,
            path,
            ...query,
        },
        headers,
        method,
        url: '',
        body,
        region: credentials?.region,
    };
    try {
        return await this.helpers.requestWithAuthentication.call(this, credentialsType, requestOptions);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function awsApiRequestREST(service, method, path, body, query = {}, headers) {
    const response = await awsApiRequest.call(this, service, method, path, body, query, headers);
    try {
        return JSON.parse(response);
    }
    catch (e) {
        return response;
    }
}
async function awsApiRequestAllItems(propertyName, service, method, path, body, query = {}, headers = {}) {
    const returnData = [];
    let responseData;
    do {
        responseData = await awsApiRequestREST.call(this, service, method, path, body, query, headers);
        if (responseData.NextToken) {
            const data = (0, n8n_workflow_1.jsonParse)(body, {
                errorMessage: 'Response body is not valid JSON',
            });
            data.NextToken = responseData.NextToken;
        }
        returnData.push.apply(returnData, (0, get_1.default)(responseData, propertyName));
    } while (responseData.NextToken !== undefined);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map