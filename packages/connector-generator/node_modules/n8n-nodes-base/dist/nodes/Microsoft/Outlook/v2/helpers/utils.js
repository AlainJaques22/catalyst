"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeOutlookId = exports.encodeOutlookId = exports.contactFields = exports.eventfields = exports.messageFields = void 0;
exports.makeRecipient = makeRecipient;
exports.createMessage = createMessage;
exports.simplifyOutputMessages = simplifyOutputMessages;
exports.prepareContactFields = prepareContactFields;
exports.prepareFilterString = prepareFilterString;
exports.prepareApiError = prepareApiError;
const n8n_workflow_1 = require("n8n-workflow");
exports.messageFields = [
    'bccRecipients',
    'body',
    'bodyPreview',
    'categories',
    'ccRecipients',
    'changeKey',
    'conversationId',
    'createdDateTime',
    'flag',
    'from',
    'hasAttachments',
    'importance',
    'inferenceClassification',
    'internetMessageId',
    'isDeliveryReceiptRequested',
    'isDraft',
    'isRead',
    'isReadReceiptRequested',
    'lastModifiedDateTime',
    'parentFolderId',
    'receivedDateTime',
    'replyTo',
    'sender',
    'sentDateTime',
    'subject',
    'toRecipients',
    'webLink',
].map((field) => ({ name: field, value: field }));
exports.eventfields = [
    'allowNewTimeProposals',
    'attendees',
    'body',
    'bodyPreview',
    'categories',
    'changeKey',
    'createdDateTime',
    'end',
    'hasAttachments',
    'hideAttendees',
    'iCalUId',
    'importance',
    'isAllDay',
    'isCancelled',
    'isDraft',
    'isOnlineMeeting',
    'isOrganizer',
    'isReminderOn',
    'lastModifiedDateTime',
    'location',
    'locations',
    'onlineMeeting',
    'onlineMeetingProvider',
    'onlineMeetingUrl',
    'organizer',
    'originalEndTimeZone',
    'originalStartTimeZone',
    'recurrence',
    'reminderMinutesBeforeStart',
    'responseRequested',
    'responseStatus',
    'sensitivity',
    'seriesMasterId',
    'showAs',
    'start',
    'subject',
    'transactionId',
    'type',
    'webLink',
].map((field) => ({ name: field, value: field }));
exports.contactFields = [
    'createdDateTime',
    'lastModifiedDateTime',
    'changeKey',
    'categories',
    'parentFolderId',
    'birthday',
    'fileAs',
    'displayName',
    'givenName',
    'initials',
    'middleName',
    'nickName',
    'surname',
    'title',
    'yomiGivenName',
    'yomiSurname',
    'yomiCompanyName',
    'generation',
    'imAddresses',
    'jobTitle',
    'companyName',
    'department',
    'officeLocation',
    'profession',
    'businessHomePage',
    'assistantName',
    'manager',
    'homePhones',
    'mobilePhone',
    'businessPhones',
    'spouseName',
    'personalNotes',
    'children',
    'emailAddresses',
    'homeAddress',
    'businessAddress',
    'otherAddress',
].map((field) => ({ name: field, value: field }));
function makeRecipient(email) {
    return {
        emailAddress: {
            address: email,
        },
    };
}
function createMessage(fields) {
    const message = {};
    // Create body object
    if (fields.bodyContent || fields.bodyContentType) {
        const bodyObject = {
            content: fields.bodyContent,
            contentType: fields.bodyContentType,
        };
        message.body = bodyObject;
        delete fields.bodyContent;
        delete fields.bodyContentType;
    }
    // Handle custom headers
    if ('internetMessageHeaders' in fields &&
        'headers' in fields.internetMessageHeaders) {
        fields.internetMessageHeaders = fields.internetMessageHeaders.headers;
    }
    for (const [key, value] of Object.entries(fields)) {
        if (['bccRecipients', 'ccRecipients', 'replyTo', 'sender', 'toRecipients'].includes(key)) {
            if (Array.isArray(value)) {
                message[key] = value.map((email) => makeRecipient(email));
            }
            else if (typeof value === 'string') {
                message[key] = value.split(',').map((recipient) => makeRecipient(recipient.trim()));
            }
            else {
                throw new n8n_workflow_1.ApplicationError(`The "${key}" field must be a string or an array of strings`, {
                    level: 'warning',
                });
            }
            continue;
        }
        if (['from', 'sender'].includes(key)) {
            if (value) {
                message[key] = makeRecipient(value);
            }
            continue;
        }
        message[key] = value;
    }
    return message;
}
function simplifyOutputMessages(data) {
    return data.map((item) => {
        return {
            id: item.id,
            conversationId: item.conversationId,
            subject: item.subject,
            bodyPreview: item.bodyPreview,
            from: item.from?.emailAddress?.address,
            to: item.toRecipients.map((recipient) => recipient.emailAddress?.address),
            categories: item.categories,
            hasAttachments: item.hasAttachments,
        };
    });
}
function prepareContactFields(fields) {
    const returnData = {};
    const typeStringCollection = [
        'businessPhones',
        'categories',
        'children',
        'homePhones',
        'imAddresses',
    ];
    const typeValuesToExtract = ['businessAddress', 'emailAddresses', 'homePhones', 'otherAddress'];
    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined || value === '') {
            continue;
        }
        if (typeStringCollection.includes(key) && !Array.isArray(value)) {
            returnData[key] = value.split(',').map((item) => item.trim());
            continue;
        }
        if (typeValuesToExtract.includes(key)) {
            if (value.values === undefined)
                continue;
            returnData[key] = value.values;
            continue;
        }
        returnData[key] = value;
    }
    return returnData;
}
function prepareFilterString(filters) {
    const selectedFilters = filters.filters;
    const filterString = [];
    if (selectedFilters.foldersToInclude) {
        const folders = selectedFilters.foldersToInclude
            .filter((folder) => folder !== '')
            .map((folder) => `parentFolderId eq '${folder}'`)
            .join(' or ');
        filterString.push(folders);
    }
    if (selectedFilters.foldersToExclude) {
        for (const folder of selectedFilters.foldersToExclude) {
            filterString.push(`parentFolderId ne '${folder}'`);
        }
    }
    if (selectedFilters.sender) {
        const sender = selectedFilters.sender;
        const byMailAddress = `from/emailAddress/address eq '${sender}'`;
        const byName = `from/emailAddress/name eq '${sender}'`;
        filterString.push(`(${byMailAddress} or ${byName})`);
    }
    if (selectedFilters.hasAttachments) {
        filterString.push(`hasAttachments eq ${selectedFilters.hasAttachments}`);
    }
    if (selectedFilters.readStatus && selectedFilters.readStatus !== 'both') {
        filterString.push(`isRead eq ${selectedFilters.readStatus === 'read'}`);
    }
    if (selectedFilters.receivedAfter) {
        filterString.push(`receivedDateTime ge ${selectedFilters.receivedAfter}`);
    }
    if (selectedFilters.receivedBefore) {
        filterString.push(`receivedDateTime le ${selectedFilters.receivedBefore}`);
    }
    if (selectedFilters.custom) {
        filterString.push(selectedFilters.custom);
    }
    return filterString.length ? filterString.join(' and ') : undefined;
}
function prepareApiError(error, itemIndex = 0) {
    const [httpCode, err, message] = error.description.split(' - ');
    const json = (0, n8n_workflow_1.jsonParse)(err);
    return new n8n_workflow_1.NodeApiError(this.getNode(), json, {
        itemIndex,
        httpCode,
        //In UI we are replacing some of the field names to make them more user friendly, updating error message to reflect that
        message: message
            .replace(/toRecipients/g, 'toRecipients (To)')
            .replace(/bodyContent/g, 'bodyContent (Message)')
            .replace(/bodyContentType/g, 'bodyContentType (Message Type)'),
    });
}
const encodeOutlookId = (id) => {
    return id.replace(/-/g, '%2F').replace(/=/g, '%3D').replace(/\+/g, '%2B');
};
exports.encodeOutlookId = encodeOutlookId;
const decodeOutlookId = (id) => {
    return id.replace(/%2F/g, '-').replace(/%3D/g, '=').replace(/%2B/g, '+');
};
exports.decodeOutlookId = decodeOutlookId;
//# sourceMappingURL=utils.js.map