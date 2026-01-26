"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gristApiRequest = gristApiRequest;
exports.parseSortProperties = parseSortProperties;
exports.isSafeInteger = isSafeInteger;
exports.parseFilterProperties = parseFilterProperties;
exports.parseDefinedFields = parseDefinedFields;
exports.parseAutoMappedInputs = parseAutoMappedInputs;
exports.throwOnZeroDefinedFields = throwOnZeroDefinedFields;
const n8n_workflow_1 = require("n8n-workflow");
async function gristApiRequest(method, endpoint, body = {}, qs = {}) {
    const { apiKey, planType, customSubdomain, selfHostedUrl } = await this.getCredentials('gristApi');
    const gristapiurl = planType === 'free'
        ? `https://docs.getgrist.com/api${endpoint}`
        : planType === 'paid'
            ? `https://${customSubdomain}.getgrist.com/api${endpoint}`
            : `${selfHostedUrl}/api${endpoint}`;
    const options = {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
        method,
        uri: gristapiurl,
        qs,
        body,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
function parseSortProperties(sortProperties) {
    return sortProperties.reduce((acc, cur, curIdx) => {
        if (cur.direction === 'desc')
            acc += '-';
        acc += cur.field;
        if (curIdx !== sortProperties.length - 1)
            acc += ',';
        return acc;
    }, '');
}
function isSafeInteger(val) {
    //used MIN_SAFE_INTEGER and MAX_SAFE_INTEGER instead of MIN_VALUE and MAX_VALUE to avoid edge cases
    return !isNaN(val) && val > Number.MIN_SAFE_INTEGER && val < Number.MAX_SAFE_INTEGER;
}
function parseFilterProperties(filterProperties) {
    return filterProperties.reduce((acc, cur) => {
        acc[cur.field] = acc[cur.field] ?? [];
        const values = isSafeInteger(Number(cur.values)) ? Number(cur.values) : cur.values;
        acc[cur.field].push(values);
        return acc;
    }, {});
}
function parseDefinedFields(fieldsToSendProperties) {
    return fieldsToSendProperties.reduce((acc, cur) => {
        acc[cur.fieldId] = cur.fieldValue;
        return acc;
    }, {});
}
function parseAutoMappedInputs(incomingKeys, inputsToIgnore, item) {
    return incomingKeys.reduce((acc, curKey) => {
        if (inputsToIgnore.includes(curKey))
            return acc;
        acc = { ...acc, [curKey]: item[curKey] };
        return acc;
    }, {});
}
function throwOnZeroDefinedFields(fields) {
    if (!fields?.length) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), "No defined data found. Please specify the data to send in 'Fields to Send'.");
    }
}
//# sourceMappingURL=GenericFunctions.js.map