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
async function awsApiRequest(service, method, path, body, headers) {
    const { credentials, credentialsType } = await (0, GenericFunctions_1.getAwsCredentials)(this);
    const requestOptions = {
        qs: {
            service,
            path,
        },
        method,
        body: JSON.stringify(body),
        url: '',
        headers,
        region: credentials?.region,
    };
    try {
        return await this.helpers.requestWithAuthentication.call(this, credentialsType, requestOptions);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { parseXml: true });
    }
}
async function awsApiRequestREST(service, method, path, body, headers) {
    const response = await awsApiRequest.call(this, service, method, path, body, headers);
    try {
        return JSON.parse(response);
    }
    catch (error) {
        return response;
    }
}
async function awsApiRequestSOAP(service, method, path, body, headers) {
    const response = await awsApiRequest.call(this, service, method, path, body, headers);
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
    catch (error) {
        return response;
    }
}
async function awsApiRequestSOAPAllItems(propertyName, service, method, path, body, query = {}, _headers = {}, _option = {}, _region) {
    const returnData = [];
    let responseData;
    const propertyNameArray = propertyName.split('.');
    do {
        responseData = await awsApiRequestSOAP.call(this, service, method, path, body, query);
        if ((0, get_1.default)(responseData, [propertyNameArray[0], propertyNameArray[1], 'NextToken'])) {
            query.NextToken = (0, get_1.default)(responseData, [
                propertyNameArray[0],
                propertyNameArray[1],
                'NextToken',
            ]);
        }
        if ((0, get_1.default)(responseData, propertyName)) {
            if (Array.isArray((0, get_1.default)(responseData, propertyName))) {
                returnData.push.apply(returnData, (0, get_1.default)(responseData, propertyName));
            }
            else {
                returnData.push((0, get_1.default)(responseData, propertyName));
            }
        }
    } while ((0, get_1.default)(responseData, [propertyNameArray[0], propertyNameArray[1], 'NextToken']) !== undefined);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map