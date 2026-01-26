"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cortexApiRequest = cortexApiRequest;
exports.getEntityLabel = getEntityLabel;
exports.splitTags = splitTags;
exports.prepareParameters = prepareParameters;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
async function cortexApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    const credentials = await this.getCredentials('cortexApi');
    let options = {
        headers: {},
        method,
        qs: query,
        uri: uri || `${credentials.host}/api${resource}`,
        body,
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
    return await this.helpers.requestWithAuthentication.call(this, 'cortexApi', options);
}
function getEntityLabel(entity) {
    let label = '';
    switch (entity._type) {
        case 'case':
            label = `#${entity.caseId} ${entity.title}`;
            break;
        case 'case_artifact':
            //@ts-ignore
            label = `[${entity.dataType}] ${entity.data ? entity.data : entity.attachment.name}`;
            break;
        case 'alert':
            label = `[${entity.source}:${entity.sourceRef}] ${entity.title}`;
            break;
        case 'case_task_log':
            label = `${entity.message} from ${entity.createdBy}`;
            break;
        case 'case_task':
            label = `${entity.title} (${entity.status})`;
            break;
        case 'job':
            label = `${entity.analyzerName} (${entity.status})`;
            break;
        default:
            break;
    }
    return label;
}
function splitTags(tags) {
    return tags.split(',').filter((tag) => tag !== ' ' && tag);
}
function prepareParameters(values) {
    const response = {};
    for (const key in values) {
        if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
            if ((0, moment_timezone_1.default)(values[key], moment_timezone_1.default.ISO_8601).isValid()) {
                response[key] = Date.parse(values[key]);
            }
            else if (key === 'tags') {
                response[key] = splitTags(values[key]);
            }
            else {
                response[key] = values[key];
            }
        }
    }
    return response;
}
//# sourceMappingURL=GenericFunctions.js.map