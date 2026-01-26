"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequest = awsApiRequest;
exports.awsApiRequestREST = awsApiRequestREST;
exports.awsApiRequestSOAP = awsApiRequestSOAP;
exports.awsApiRequestSOAPAllItems = awsApiRequestSOAPAllItems;
exports.keysTPascalCase = keysTPascalCase;
const change_case_1 = require("change-case");
const get_1 = __importDefault(require("lodash/get"));
const xml2js_1 = require("xml2js");
const GenericFunctions_1 = require("../GenericFunctions");
async function awsApiRequest(service, method, path, body, _query = {}, headers, option = {}, _region) {
    const { credentials, credentialsType } = await (0, GenericFunctions_1.getAwsCredentials)(this);
    const requestOptions = {
        qs: {
            service,
            path,
        },
        method,
        body,
        url: '',
        headers,
        region: credentials?.region,
    };
    if (Object.keys(option).length !== 0) {
        Object.assign(requestOptions, option);
    }
    return await this.helpers.requestWithAuthentication.call(this, credentialsType, requestOptions);
}
async function awsApiRequestREST(service, method, path, body, query = {}, headers, options = {}, region) {
    const response = await awsApiRequest.call(this, service, method, path, body, query, headers, options, region);
    try {
        return JSON.parse(response);
    }
    catch (error) {
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
    catch (error) {
        return error;
    }
}
async function awsApiRequestSOAPAllItems(propertyName, service, method, path, body, query = {}, headers = {}, option = {}, region) {
    const returnData = [];
    let responseData;
    do {
        responseData = await awsApiRequestSOAP.call(this, service, method, path, body, query, headers, option, region);
        //https://forums.aws.amazon.com/thread.jspa?threadID=55746
        if ((0, get_1.default)(responseData, [propertyName.split('.')[0], 'NextContinuationToken'])) {
            query['continuation-token'] = (0, get_1.default)(responseData, [
                propertyName.split('.')[0],
                'NextContinuationToken',
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
        const limit = query.limit;
        if (limit && limit <= returnData.length) {
            return returnData;
        }
    } while ((0, get_1.default)(responseData, [propertyName.split('.')[0], 'IsTruncated']) !== undefined &&
        (0, get_1.default)(responseData, [propertyName.split('.')[0], 'IsTruncated']) !== 'false');
    return returnData;
}
function keysTPascalCase(object) {
    const data = {};
    for (const key of Object.keys(object)) {
        data[(0, change_case_1.pascalCase)(key)] = object[key];
    }
    return data;
}
//# sourceMappingURL=GenericFunctions.js.map