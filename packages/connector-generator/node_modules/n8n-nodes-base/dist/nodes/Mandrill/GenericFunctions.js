"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mandrillApiRequest = mandrillApiRequest;
exports.getToEmailArray = getToEmailArray;
exports.getGoogleAnalyticsDomainsArray = getGoogleAnalyticsDomainsArray;
exports.getTags = getTags;
exports.validateJSON = validateJSON;
const map_1 = __importDefault(require("lodash/map"));
const n8n_workflow_1 = require("n8n-workflow");
async function mandrillApiRequest(resource, method, action, body = {}, headers) {
    const credentials = await this.getCredentials('mandrillApi');
    const data = Object.assign({}, body, { key: credentials.apiKey });
    const endpoint = 'mandrillapp.com/api/1.0';
    const options = {
        headers,
        method,
        uri: `https://${endpoint}${resource}${action}.json`,
        body: data,
        json: true,
    };
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
function getToEmailArray(toEmail) {
    let toEmailArray;
    if (toEmail.split(',').length > 0) {
        const array = toEmail.split(',');
        toEmailArray = (0, map_1.default)(array, (email) => {
            return {
                email,
                type: 'to',
            };
        });
    }
    else {
        toEmailArray = [
            {
                email: toEmail,
                type: 'to',
            },
        ];
    }
    return toEmailArray;
}
function getGoogleAnalyticsDomainsArray(s) {
    let array = [];
    if (s.split(',').length > 0) {
        array = s.split(',');
    }
    else {
        array = [s];
    }
    return array;
}
function getTags(s) {
    let array = [];
    if (s.split(',').length > 0) {
        array = s.split(',');
    }
    else {
        array = [s];
    }
    return array;
}
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = [];
    }
    return result;
}
//# sourceMappingURL=GenericFunctions.js.map