"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequest = awsApiRequest;
exports.awsApiRequestREST = awsApiRequestREST;
exports.awsApiRequestRESTAllItems = awsApiRequestRESTAllItems;
const get_1 = __importDefault(require("lodash/get"));
const xml2js_1 = require("xml2js");
const GenericFunctions_1 = require("../../GenericFunctions");
async function awsApiRequest(service, method, path, body, query = {}, headers, option = {}, _region) {
    const requestOptions = {
        qs: {
            ...query,
            service,
            path,
            query,
            _region,
        },
        method,
        body,
        url: '',
        headers,
    };
    if (Object.keys(option).length !== 0) {
        Object.assign(requestOptions, option);
    }
    const { credentialsType } = await (0, GenericFunctions_1.getAwsCredentials)(this);
    return await this.helpers.requestWithAuthentication.call(this, credentialsType, requestOptions);
}
async function awsApiRequestREST(service, method, path, body, query = {}, headers, options = {}, region) {
    const response = await awsApiRequest.call(this, service, method, path, body, query, headers, options, region);
    try {
        if (response.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
            return await new Promise((resolve, reject) => {
                (0, xml2js_1.parseString)(response, { explicitArray: false }, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            });
        }
        return JSON.parse(response);
    }
    catch (error) {
        return response;
    }
}
async function awsApiRequestRESTAllItems(propertyName, service, method, path, body, query = {}, headers, option = {}, region) {
    const returnData = [];
    let responseData;
    do {
        responseData = await awsApiRequestREST.call(this, service, method, path, body, query, headers, option, region);
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
//# sourceMappingURL=GenericFunctions.js.map