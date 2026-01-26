"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kitemakerRequest = kitemakerRequest;
exports.kitemakerRequestAllItems = kitemakerRequestAllItems;
exports.createLoadOptions = createLoadOptions;
const n8n_workflow_1 = require("n8n-workflow");
async function kitemakerRequest(body = {}) {
    const { personalAccessToken } = await this.getCredentials('kitemakerApi');
    const options = {
        headers: {
            Authorization: `Bearer ${personalAccessToken}`,
        },
        method: 'POST',
        body,
        uri: 'https://toil.kitemaker.co/developers/graphql',
        json: true,
    };
    const responseData = await this.helpers.request.call(this, options);
    if (responseData.errors) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), responseData);
    }
    return responseData;
}
function getGroupAndItems(resource) {
    const map = {
        space: { group: 'organization', items: 'spaces' },
        user: { group: 'organization', items: 'users' },
        workItem: { group: 'workItems', items: 'workItems' },
    };
    return [map[resource].group, map[resource].items];
}
async function kitemakerRequestAllItems(body) {
    const resource = this.getNodeParameter('resource', 0);
    const [group, items] = getGroupAndItems(resource);
    const returnAll = this.getNodeParameter('returnAll', 0, false);
    const limit = this.getNodeParameter('limit', 0, 0);
    const returnData = [];
    let responseData;
    do {
        responseData = await kitemakerRequest.call(this, body);
        body.variables.cursor = responseData.data[group].cursor;
        returnData.push(...responseData.data[group][items]);
        if (!returnAll && returnData.length > limit) {
            return returnData.slice(0, limit);
        }
    } while (responseData.data[group].hasMore);
    return returnData;
}
function createLoadOptions(resources) {
    return resources.map((option) => {
        if (option.username)
            return { name: option.username, value: option.id };
        if (option.title)
            return { name: option.title, value: option.id };
        return { name: option.name ?? 'Unnamed', value: option.id };
    });
}
//# sourceMappingURL=GenericFunctions.js.map