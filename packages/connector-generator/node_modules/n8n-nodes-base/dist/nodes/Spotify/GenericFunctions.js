"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spotifyApiRequest = spotifyApiRequest;
exports.spotifyApiRequestAllItems = spotifyApiRequestAllItems;
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an API request to Spotify
 *
 */
async function spotifyApiRequest(method, endpoint, body, query, uri) {
    const options = {
        method,
        headers: {
            'User-Agent': 'n8n',
            'Content-Type': 'text/plain',
            Accept: ' application/json',
        },
        qs: query,
        url: uri ?? `https://api.spotify.com/v1${endpoint}`,
        json: true,
    };
    if (Object.keys(body).length > 0) {
        options.body = body;
    }
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'spotifyOAuth2Api', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function spotifyApiRequestAllItems(propertyName, method, endpoint, body, query) {
    const returnData = [];
    let responseData;
    let uri;
    do {
        responseData = await spotifyApiRequest.call(this, method, endpoint, body, query, uri);
        returnData.push.apply(returnData, (0, get_1.default)(responseData, propertyName));
        uri = responseData.next || responseData[propertyName.split('.')[0]].next;
        //remove the query as the query parameters are already included in the next, else api throws error.
        query = {};
        if (uri?.includes('offset=1000') && endpoint === '/search') {
            // The search endpoint has a limit of 1000 so step before it returns a 404
            return returnData;
        }
    } while ((responseData.next !== null && responseData.next !== undefined) ||
        (responseData[propertyName.split('.')[0]].next !== null &&
            responseData[propertyName.split('.')[0]].next !== undefined));
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map