"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpscoutApiRequest = helpscoutApiRequest;
exports.helpscoutApiRequestAllItems = helpscoutApiRequestAllItems;
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
async function helpscoutApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    let options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || `https://api.helpscout.net${resource}`,
        json: true,
    };
    try {
        if (Object.keys(option).length !== 0) {
            options = Object.assign({}, options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.requestOAuth2.call(this, 'helpScoutOAuth2Api', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function helpscoutApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri = undefined;
    do {
        responseData = await helpscoutApiRequest.call(this, method, endpoint, body, query, uri);
        uri = (0, get_1.default)(responseData, '_links.next.href');
        returnData.push.apply(returnData, (0, get_1.default)(responseData, propertyName));
        const limit = query.limit;
        if (limit && limit <= returnData.length) {
            return returnData;
        }
    } while (responseData._links?.next?.href !== undefined);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map