"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microsoftApiRequest = microsoftApiRequest;
exports.microsoftApiRequestAllItems = microsoftApiRequestAllItems;
exports.microsoftApiRequestAllItemsSkip = microsoftApiRequestAllItemsSkip;
exports.microsoftApiRequestAllItemsDelta = microsoftApiRequestAllItemsDelta;
exports.getPath = getPath;
const luxon_1 = require("luxon");
const n8n_workflow_1 = require("n8n-workflow");
async function microsoftApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}, option = { json: true }) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || `https://graph.microsoft.com/v1.0/me${resource}`,
    };
    try {
        Object.assign(options, option);
        if (Object.keys(headers).length !== 0) {
            options.headers = Object.assign({}, options.headers, headers);
        }
        if (Object.keys(qs).length === 0) {
            delete options.qs;
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.requestOAuth2.call(this, 'microsoftOneDriveOAuth2Api', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function microsoftApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    query.$top = 100;
    do {
        responseData = await microsoftApiRequest.call(this, method, endpoint, body, query, uri);
        uri = responseData['@odata.nextLink'];
        if (uri?.includes('$top')) {
            delete query.$top;
        }
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData['@odata.nextLink'] !== undefined);
    return returnData;
}
async function microsoftApiRequestAllItemsSkip(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    query.$top = 100;
    query.$skip = 0;
    do {
        responseData = await microsoftApiRequest.call(this, method, endpoint, body, query);
        query.$skip += query.$top;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.value.length !== 0);
    return returnData;
}
async function microsoftApiRequestAllItemsDelta(link, lastDate, eventType) {
    const returnData = [];
    let responseData;
    let deltaLink = '';
    let uri = link;
    do {
        responseData = (await microsoftApiRequest.call(this, 'GET', '', {}, {}, uri));
        uri = responseData['@odata.nextLink'];
        for (const value of responseData.value) {
            if (value.fileSystemInfo) {
                const updatedTimeStamp = value.fileSystemInfo
                    ?.lastModifiedDateTime;
                const createdTimeStamp = value.fileSystemInfo?.createdDateTime;
                if (eventType === 'created') {
                    if (luxon_1.DateTime.fromISO(createdTimeStamp) >= lastDate) {
                        returnData.push(value);
                    }
                }
                if (eventType === 'updated') {
                    if (luxon_1.DateTime.fromISO(updatedTimeStamp) >= lastDate &&
                        luxon_1.DateTime.fromISO(createdTimeStamp) < lastDate) {
                        returnData.push(value);
                    }
                }
            }
        }
        //returnData.push.apply(returnData, responseData.value as IDataObject[]);
        deltaLink = responseData['@odata.deltaLink'] || '';
    } while (responseData['@odata.nextLink'] !== undefined);
    return { deltaLink, returnData };
}
async function getPath(itemId) {
    const responseData = (await microsoftApiRequest.call(this, 'GET', '', {}, {}, `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}`));
    if (responseData.folder) {
        return responseData?.parentReference?.path + `/${responseData?.name}`;
    }
    else {
        const workflow = this.getWorkflow();
        const node = this.getNode();
        this.logger.error(`There was a problem in '${node.name}' node in workflow '${workflow.id}': 'Item to watch is not a folder'`, {
            node: node.name,
            workflowId: workflow.id,
            error: 'Item to watch is not a folder',
        });
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            error: 'Item to watch is not a folder',
        });
    }
}
//# sourceMappingURL=GenericFunctions.js.map