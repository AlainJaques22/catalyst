"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microsoftApiRequest = microsoftApiRequest;
exports.microsoftApiRequestAllItems = microsoftApiRequestAllItems;
exports.downloadAttachments = downloadAttachments;
exports.getMimeContent = getMimeContent;
exports.getSubfolders = getSubfolders;
const utils_1 = require("../helpers/utils");
async function microsoftApiRequest(method, resource, body = {}, qs = {}, uri, headers = {}, option = { json: true }) {
    const credentials = await this.getCredentials('microsoftOutlookOAuth2Api');
    let apiUrl = `https://graph.microsoft.com/v1.0/me${resource}`;
    // If accessing shared mailbox
    if (credentials.useShared && credentials.userPrincipalName) {
        apiUrl = `https://graph.microsoft.com/v1.0/users/${credentials.userPrincipalName}${resource}`;
    }
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: uri || apiUrl,
    };
    try {
        Object.assign(options, option);
        if (Object.keys(headers).length !== 0) {
            options.headers = Object.assign({}, options.headers, headers);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.requestWithAuthentication.call(this, 'microsoftOutlookOAuth2Api', options);
    }
    catch (error) {
        if (((error.message || '').toLowerCase().includes('bad request') ||
            (error.message || '').toLowerCase().includes('unknown error')) &&
            error.description) {
            let updatedError;
            // Try to return the error prettier, otherwise return the original one replacing the message with the description
            try {
                updatedError = utils_1.prepareApiError.call(this, error);
            }
            catch (e) { }
            if (updatedError)
                throw updatedError;
            error.message = error.description;
            error.description = '';
        }
        throw error;
    }
}
async function microsoftApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}, headers = {}) {
    const returnData = [];
    let responseData;
    let nextLink;
    query.$top = 100;
    do {
        responseData = await microsoftApiRequest.call(this, method, endpoint, body, nextLink ? undefined : query, // Do not add query parameters as nextLink already contains them
        nextLink, headers);
        nextLink = responseData['@odata.nextLink'];
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData['@odata.nextLink'] !== undefined);
    return returnData;
}
async function downloadAttachments(messages, prefix) {
    const elements = [];
    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    for (const message of messages) {
        const element = {
            json: message,
            binary: {},
        };
        if (message.hasAttachments === true) {
            const attachments = await microsoftApiRequestAllItems.call(this, 'value', 'GET', `/messages/${message.id}/attachments`, {});
            for (const [index, attachment] of attachments.entries()) {
                const response = await microsoftApiRequest.call(this, 'GET', `/messages/${message.id}/attachments/${attachment.id}/$value`, undefined, {}, undefined, {}, { encoding: null, resolveWithFullResponse: true });
                const data = Buffer.from(response.body, 'utf8');
                element.binary[`${prefix}${index}`] = await this.helpers.prepareBinaryData(data, attachment.name, attachment.contentType);
            }
        }
        if (Object.keys(element.binary).length === 0) {
            delete element.binary;
        }
        elements.push(element);
    }
    return elements;
}
async function getMimeContent(messageId, binaryPropertyName, outputFileName) {
    const response = await microsoftApiRequest.call(this, 'GET', `/messages/${messageId}/$value`, undefined, {}, undefined, {}, { encoding: null, resolveWithFullResponse: true });
    let mimeType;
    if (response.headers['content-type']) {
        mimeType = response.headers['content-type'];
    }
    const fileName = `${outputFileName || messageId}.eml`;
    const data = Buffer.from(response.body, 'utf8');
    const binary = {};
    binary[binaryPropertyName] = await this.helpers.prepareBinaryData(data, fileName, mimeType);
    return binary;
}
async function getSubfolders(folders, addPathToDisplayName = false) {
    const returnData = [...folders];
    for (const folder of folders) {
        if (folder.childFolderCount > 0) {
            let subfolders = await microsoftApiRequest.call(this, 'GET', `/mailFolders/${folder.id}/childFolders`);
            if (addPathToDisplayName) {
                subfolders = subfolders.value.map((subfolder) => {
                    return {
                        ...subfolder,
                        displayName: `${folder.displayName}/${subfolder.displayName}`,
                    };
                });
            }
            else {
                subfolders = subfolders.value;
            }
            returnData.push(...(await getSubfolders.call(this, subfolders, addPathToDisplayName)));
        }
    }
    return returnData;
}
//# sourceMappingURL=index.js.map