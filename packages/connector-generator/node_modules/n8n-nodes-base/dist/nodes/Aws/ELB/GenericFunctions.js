"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequest = awsApiRequest;
exports.awsApiRequestREST = awsApiRequestREST;
exports.awsApiRequestSOAP = awsApiRequestSOAP;
exports.awsApiRequestSOAPAllItems = awsApiRequestSOAPAllItems;
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
const xml2js_1 = require("xml2js");
const GenericFunctions_1 = require("../GenericFunctions");
async function awsApiRequest(service, method, path, body, query = {}, headers, _option = {}, _region) {
    const { credentials, credentialsType } = await (0, GenericFunctions_1.getAwsCredentials)(this);
    const requestOptions = {
        qs: {
            ...query,
            service,
            path,
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
async function awsApiRequestREST(service, method, path, body, query = {}, headers, options = {}, region) {
    const response = await awsApiRequest.call(this, service, method, path, body, query, headers, options, region);
    try {
        return JSON.parse(response);
    }
    catch (e) {
        return response;
    }
}
async function awsApiRequestSOAP(service, method, path, body, query = {}, headers, option = {}, region) {
    const response = await awsApiRequest.call(this, service, method, path, body, query, headers, option, region);
    try {
        return await new Promise((resolve, reject) => {
            (0, xml2js_1.parseString)(response, { explicitArray: false }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    catch (e) {
        return e;
    }
}
async function awsApiRequestSOAPAllItems(propertyName, service, method, path, body, query = {}, headers = {}, option = {}, region) {
    const returnData = [];
    let responseData;
    const propertyNameArray = propertyName.split('.');
    do {
        responseData = await awsApiRequestSOAP.call(this, service, method, path, body, query, headers, option, region);
        if ((0, get_1.default)(responseData, [propertyNameArray[0], propertyNameArray[1], 'NextMarker'])) {
            query.Marker = (0, get_1.default)(responseData, [propertyNameArray[0], propertyNameArray[1], 'NextMarker']);
        }
        if ((0, get_1.default)(responseData, propertyName)) {
            if (Array.isArray((0, get_1.default)(responseData, propertyName))) {
                returnData.push.apply(returnData, (0, get_1.default)(responseData, propertyName));
            }
            else {
                returnData.push((0, get_1.default)(responseData, propertyName));
            }
        }
    } while ((0, get_1.default)(responseData, [propertyNameArray[0], propertyNameArray[1], 'NextMarker']) !== undefined);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map