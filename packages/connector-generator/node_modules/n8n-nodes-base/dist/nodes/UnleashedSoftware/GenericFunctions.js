"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unleashedApiRequest = unleashedApiRequest;
exports.unleashedApiRequestAllItems = unleashedApiRequestAllItems;
exports.convertNETDates = convertNETDates;
const crypto_1 = require("crypto");
const n8n_workflow_1 = require("n8n-workflow");
const qs_1 = __importDefault(require("qs"));
async function unleashedApiRequest(method, path, body = {}, query = {}, pageNumber, headers) {
    const paginatedPath = pageNumber ? `/${path}/${pageNumber}` : `/${path}`;
    const options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method,
        qs: query,
        body,
        url: `https://api.unleashedsoftware.com/${paginatedPath}`,
        json: true,
    };
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    const credentials = await this.getCredentials('unleashedSoftwareApi');
    const signature = (0, crypto_1.createHmac)('sha256', credentials.apiKey)
        .update(qs_1.default.stringify(query))
        .digest('base64');
    options.headers = Object.assign({}, headers, {
        'api-auth-id': credentials.apiId,
        'api-auth-signature': signature,
    });
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function unleashedApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let pageNumber = 1;
    query.pageSize = 1000;
    do {
        responseData = await unleashedApiRequest.call(this, method, endpoint, body, query, pageNumber);
        returnData.push.apply(returnData, responseData[propertyName]);
        pageNumber++;
    } while (responseData.Pagination.PageNumber <
        responseData.Pagination.NumberOfPages);
    return returnData;
}
//.NET code is serializing dates in the following format: "/Date(1586833770780)/"
//which is useless on JS side and could not treated as a date for other nodes
//so we need to convert all of the fields that has it.
function convertNETDates(item) {
    Object.keys(item).forEach((path) => {
        const type = typeof item[path];
        if (type === 'string') {
            const value = item[path];
            const a = /\/Date\((\d*)\)\//.exec(value);
            if (a) {
                item[path] = new Date(+a[1]);
            }
        }
        if (type === 'object' && item[path]) {
            convertNETDates(item[path]);
        }
    });
}
//# sourceMappingURL=GenericFunctions.js.map