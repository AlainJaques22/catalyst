"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushbulletApiRequest = pushbulletApiRequest;
exports.pushbulletApiRequestAllItems = pushbulletApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function pushbulletApiRequest(method, path, body = {}, qs = {}, uri, option = {}) {
    const options = {
        method,
        body,
        qs,
        uri: uri || `https://api.pushbullet.com/v2${path}`,
        json: true,
    };
    try {
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(option).length !== 0) {
            Object.assign(options, option);
        }
        return await this.helpers.requestOAuth2.call(this, 'pushbulletOAuth2Api', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function pushbulletApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    do {
        responseData = await pushbulletApiRequest.call(this, method, endpoint, body, query);
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.cursor !== undefined);
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map