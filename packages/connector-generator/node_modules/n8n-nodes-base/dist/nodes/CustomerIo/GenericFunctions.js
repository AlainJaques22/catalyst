"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerIoApiRequest = customerIoApiRequest;
exports.eventExists = eventExists;
exports.validateJSON = validateJSON;
const get_1 = __importDefault(require("lodash/get"));
async function customerIoApiRequest(method, endpoint, body, baseApi, _query) {
    const credentials = await this.getCredentials('customerIoApi');
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        url: '',
        json: true,
    };
    if (baseApi === 'tracking') {
        const region = credentials.region;
        options.url = `https://${region}/api/v1${endpoint}`;
    }
    else if (baseApi === 'api') {
        const region = credentials.region;
        // Special handling for EU region
        if (region === 'track-eu.customer.io') {
            options.url = `https://api-eu.customer.io/v1/api${endpoint}`;
        }
        else {
            options.url = `https://api.customer.io/v1/api${endpoint}`;
        }
    }
    else if (baseApi === 'beta') {
        options.url = `https://beta-api.customer.io/v1/api${endpoint}`;
    }
    return await this.helpers.requestWithAuthentication.call(this, 'customerIoApi', options);
}
function eventExists(currentEvents, webhookEvents) {
    for (const currentEvent of currentEvents) {
        if ((0, get_1.default)(webhookEvents, [currentEvent.split('.')[0], currentEvent.split('.')[1]]) !== true) {
            return false;
        }
    }
    return true;
}
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = undefined;
    }
    return result;
}
//# sourceMappingURL=GenericFunctions.js.map