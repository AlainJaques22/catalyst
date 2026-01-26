"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theHiveApiRequest = theHiveApiRequest;
exports.mapResource = mapResource;
exports.splitTags = splitTags;
exports.prepareOptional = prepareOptional;
exports.prepareCustomFields = prepareCustomFields;
exports.buildCustomFieldSearch = buildCustomFieldSearch;
exports.prepareSortQuery = prepareSortQuery;
exports.prepareRangeQuery = prepareRangeQuery;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const QueryFunctions_1 = require("./QueryFunctions");
async function theHiveApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    const credentials = await this.getCredentials('theHiveApi');
    let options = {
        method,
        qs: query,
        uri: uri || `${credentials.url}/api${resource}`,
        body,
        rejectUnauthorized: !credentials.allowUnauthorizedCerts,
        json: true,
    };
    if (Object.keys(option).length !== 0) {
        options = Object.assign({}, options, option);
    }
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    if (Object.keys(query).length === 0) {
        delete options.qs;
    }
    return await this.helpers.requestWithAuthentication.call(this, 'theHiveApi', options);
}
// Helpers functions
function mapResource(resource) {
    switch (resource) {
        case 'alert':
            return 'alert';
        case 'case':
            return 'case';
        case 'observable':
            return 'case_artifact';
        case 'task':
            return 'case_task';
        case 'log':
            return 'case_task_log';
        default:
            return '';
    }
}
function splitTags(tags) {
    return tags.split(',').filter((tag) => tag !== ' ' && tag);
}
function prepareOptional(optionals) {
    const response = {};
    for (const key in optionals) {
        if (optionals[key] !== undefined && optionals[key] !== null && optionals[key] !== '') {
            if (['customFieldsJson', 'customFieldsUi'].indexOf(key) > -1) {
                continue; // Ignore customFields, they need special treatment
            }
            else if ((0, moment_timezone_1.default)(optionals[key], moment_timezone_1.default.ISO_8601).isValid()) {
                response[key] = Date.parse(optionals[key]);
            }
            else if (key === 'artifacts') {
                try {
                    response[key] = (0, n8n_workflow_1.jsonParse)(optionals[key]);
                }
                catch (error) {
                    throw new n8n_workflow_1.ApplicationError('Invalid JSON for artifacts', { level: 'warning' });
                }
            }
            else if (key === 'tags') {
                response[key] = splitTags(optionals[key]);
            }
            else {
                response[key] = optionals[key];
            }
        }
    }
    return response;
}
async function prepareCustomFields(additionalFields, jsonParameters = false) {
    // Check if the additionalFields object contains customFields
    if (jsonParameters) {
        let customFieldsJson = additionalFields.customFieldsJson;
        // Delete from additionalFields as some operations (e.g. alert:update) do not run prepareOptional
        // which would remove the extra fields
        delete additionalFields.customFieldsJson;
        if (typeof customFieldsJson === 'string') {
            try {
                customFieldsJson = (0, n8n_workflow_1.jsonParse)(customFieldsJson);
            }
            catch (error) {
                throw new n8n_workflow_1.ApplicationError('Invalid JSON for customFields', { level: 'warning' });
            }
        }
        if (typeof customFieldsJson === 'object') {
            const customFields = Object.keys(customFieldsJson).reduce((acc, curr) => {
                acc[`customFields.${curr}`] = customFieldsJson[curr];
                return acc;
            }, {});
            return customFields;
        }
        else if (customFieldsJson) {
            throw new n8n_workflow_1.ApplicationError('customFieldsJson value is invalid', { level: 'warning' });
        }
    }
    else if (additionalFields.customFieldsUi) {
        // Get Custom Field Types from TheHive
        const credentials = await this.getCredentials('theHiveApi');
        const version = credentials.apiVersion;
        const endpoint = version === 'v1' ? '/customField' : '/list/custom_fields';
        const requestResult = await theHiveApiRequest.call(this, 'GET', endpoint);
        // Convert TheHive3 response to the same format as TheHive 4
        // [{name, reference, type}]
        const hiveCustomFields = version === 'v1'
            ? requestResult
            : Object.keys(requestResult).map((key) => requestResult[key]);
        // Build reference to type mapping object
        const referenceTypeMapping = hiveCustomFields.reduce((acc, curr) => ((acc[curr.reference] = curr.type), acc), {});
        // Build "fieldName": {"type": "value"} objects
        const customFieldsUi = additionalFields.customFieldsUi;
        const customFields = (customFieldsUi?.customFields).reduce((acc, curr) => {
            const fieldName = curr.field;
            // Might be able to do some type conversions here if needed, TODO
            const updatedField = `customFields.${fieldName}.${[referenceTypeMapping[fieldName]]}`;
            acc[updatedField] = curr.value;
            return acc;
        }, {});
        delete additionalFields.customFieldsUi;
        return customFields;
    }
    return undefined;
}
function buildCustomFieldSearch(customFields) {
    const searchQueries = [];
    Object.keys(customFields).forEach((customFieldName) => {
        searchQueries.push((0, QueryFunctions_1.Eq)(customFieldName, customFields[customFieldName]));
    });
    return searchQueries;
}
function prepareSortQuery(sort, body) {
    if (sort) {
        const field = sort.substring(1);
        const value = sort.charAt(0) === '+' ? 'asc' : 'desc';
        const sortOption = {};
        sortOption[field] = value;
        body.query.push({
            _name: 'sort',
            _fields: [sortOption],
        });
    }
}
function prepareRangeQuery(range, body) {
    if (range && range !== 'all') {
        body.query.push({
            _name: 'page',
            from: parseInt(range.split('-')[0], 10),
            to: parseInt(range.split('-')[1], 10),
        });
    }
}
//# sourceMappingURL=GenericFunctions.js.map