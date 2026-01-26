"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesforceApiRequest = salesforceApiRequest;
exports.salesforceApiRequestAllItems = salesforceApiRequestAllItems;
exports.sortOptions = sortOptions;
exports.getValue = getValue;
exports.getConditions = getConditions;
exports.getDefaultFields = getDefaultFields;
exports.getQuery = getQuery;
exports.getPollStartDate = getPollStartDate;
exports.filterAndManageProcessedItems = filterAndManageProcessedItems;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const luxon_1 = require("luxon");
const n8n_workflow_1 = require("n8n-workflow");
function getOptions(method, endpoint, body, qs, instanceUrl) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: `${instanceUrl}/services/data/v59.0${endpoint}`,
        json: true,
    };
    if (!Object.keys(options.body).length) {
        delete options.body;
    }
    return options;
}
async function getAccessToken(credentials) {
    const now = (0, moment_timezone_1.default)().unix();
    const authUrl = credentials.environment === 'sandbox'
        ? 'https://test.salesforce.com'
        : 'https://login.salesforce.com';
    const signature = jsonwebtoken_1.default.sign({
        iss: credentials.clientId,
        sub: credentials.username,
        aud: authUrl,
        exp: now + 3 * 60,
    }, credentials.privateKey, {
        algorithm: 'RS256',
        header: {
            alg: 'RS256',
        },
    });
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: signature,
        },
        uri: `${authUrl}/services/oauth2/token`,
        json: true,
    };
    return await this.helpers.request(options);
}
async function salesforceApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    const authenticationMethod = this.getNodeParameter('authentication', 0, 'oAuth2');
    try {
        if (authenticationMethod === 'jwt') {
            // https://help.salesforce.com/articleView?id=remoteaccess_oauth_jwt_flow.htm&type=5
            const credentialsType = 'salesforceJwtApi';
            const credentials = await this.getCredentials(credentialsType);
            const response = await getAccessToken.call(this, credentials);
            const { instance_url, access_token } = response;
            const options = getOptions.call(this, method, uri || endpoint, body, qs, instance_url);
            this.logger.debug(`Authentication for "Salesforce" node is using "jwt". Invoking URI ${options.uri}`);
            options.headers.Authorization = `Bearer ${access_token}`;
            Object.assign(options, option);
            return await this.helpers.request(options);
        }
        else {
            // https://help.salesforce.com/articleView?id=remoteaccess_oauth_web_server_flow.htm&type=5
            const credentialsType = 'salesforceOAuth2Api';
            const credentials = await this.getCredentials(credentialsType);
            const options = getOptions.call(this, method, uri || endpoint, body, qs, credentials.oauthTokenData.instance_url);
            this.logger.debug(`Authentication for "Salesforce" node is using "OAuth2". Invoking URI ${options.uri}`);
            Object.assign(options, option);
            return await this.helpers.requestOAuth2.call(this, credentialsType, options);
        }
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function salesforceApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    do {
        responseData = await salesforceApiRequest.call(this, method, endpoint, body, query, uri);
        uri = `${endpoint}/${responseData.nextRecordsUrl?.split('/')?.pop()}`;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.nextRecordsUrl !== undefined && responseData.nextRecordsUrl !== null);
    return returnData;
}
/**
 * Sorts the given options alphabetically
 *
 */
function sortOptions(options) {
    options.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
}
function getValue(value) {
    if ((0, moment_timezone_1.default)(value).isValid()) {
        return value;
    }
    else if (typeof value === 'string') {
        return `'${value}'`;
    }
    else {
        return value;
    }
}
function getConditions(options) {
    const conditions = options.conditionsUi?.conditionValues;
    let data = undefined;
    if (Array.isArray(conditions) && conditions.length !== 0) {
        data = conditions.map((condition) => `${condition.field} ${condition.operation === 'equal' ? '=' : condition.operation} ${getValue(condition.value)}`);
        data = `WHERE ${data.join(' AND ')}`;
    }
    return data;
}
function getDefaultFields(sobject) {
    return {
        Account: 'id,name,type',
        Lead: 'id,company,firstname,lastname,street,postalCode,city,email,status',
        Contact: 'id,firstname,lastname,email',
        Opportunity: 'id,accountId,amount,probability,type',
        Case: 'id,accountId,contactId,priority,status,subject,type',
        Task: 'id,subject,status,priority',
        Attachment: 'id,name',
        User: 'id,name,email',
    }[sobject];
}
function getQuery(options, sobject, returnAll, limit = 0) {
    const fields = [];
    if (options.fields) {
        // options.fields is comma separated in standard Salesforce objects and array in custom Salesforce objects -- handle both cases
        if (typeof options.fields === 'string') {
            fields.push.apply(fields, options.fields.split(','));
        }
        else {
            fields.push.apply(fields, options.fields);
        }
    }
    else {
        fields.push.apply(fields, (getDefaultFields(sobject) || 'id').split(','));
    }
    const conditions = getConditions(options);
    let query = `SELECT ${fields.join(',')} FROM ${sobject} ${conditions ? conditions : ''}`;
    if (!returnAll) {
        query = `SELECT ${fields.join(',')} FROM ${sobject} ${conditions ? conditions : ''} LIMIT ${limit}`;
    }
    return query;
}
/**
 * Calculates the polling start date with safety margin to account for Salesforce indexing delays
 */
function getPollStartDate(lastTimeChecked) {
    if (!lastTimeChecked) {
        return luxon_1.DateTime.now().toISO();
    }
    const safetyMarginMinutes = 15;
    return luxon_1.DateTime.fromISO(lastTimeChecked).minus({ minutes: safetyMarginMinutes }).toISO();
}
/**
 * Filters out already processed items and manages the processed IDs list
 */
function filterAndManageProcessedItems(responseData, processedIds) {
    const processedIdsSet = new Set(processedIds);
    const newItems = [];
    const newItemIds = [];
    for (const item of responseData) {
        if (typeof item.Id !== 'string')
            continue;
        const itemId = item.Id;
        if (!processedIdsSet.has(itemId)) {
            newItems.push(item);
            newItemIds.push(itemId);
        }
    }
    const remainingProcessedIds = Array.from(processedIdsSet);
    const updatedProcessedIds = remainingProcessedIds.concat(newItemIds);
    const MAX_IDS = 10000;
    const trimmedProcessedIds = updatedProcessedIds.slice(-MAX_IDS);
    return { newItems, updatedProcessedIds: trimmedProcessedIds };
}
//# sourceMappingURL=GenericFunctions.js.map