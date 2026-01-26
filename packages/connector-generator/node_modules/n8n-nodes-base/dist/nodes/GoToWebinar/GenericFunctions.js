"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goToWebinarApiRequest = goToWebinarApiRequest;
exports.goToWebinarApiRequestAllItems = goToWebinarApiRequestAllItems;
exports.handleGetAll = handleGetAll;
exports.loadWebinars = loadWebinars;
exports.loadWebinarSessions = loadWebinarSessions;
exports.loadRegistranSimpleQuestions = loadRegistranSimpleQuestions;
exports.loadAnswers = loadAnswers;
exports.loadRegistranMultiChoiceQuestions = loadRegistranMultiChoiceQuestions;
const losslessJSON = __importStar(require("lossless-json"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
function convertLosslessNumber(_, value) {
    if (value?.isLosslessNumber) {
        return value.toString();
    }
    else {
        return value;
    }
}
/**
 * Make an authenticated API request to GoToWebinar.
 */
async function goToWebinarApiRequest(method, endpoint, qs, body, option = {}) {
    const operation = this.getNodeParameter('operation', 0);
    const resource = this.getNodeParameter('resource', 0);
    const options = {
        headers: {
            'user-agent': 'n8n',
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method,
        uri: `https://api.getgo.com/G2W/rest/v2/${endpoint}`,
        qs,
        body: JSON.stringify(body),
        json: false,
    };
    if (resource === 'session' && operation === 'getAll') {
        options.headers.Accept = 'application/vnd.citrix.g2wapi-v1.1+json';
    }
    if (['GET', 'DELETE'].includes(method)) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    if (Object.keys(option)) {
        Object.assign(options, option);
    }
    try {
        const response = await this.helpers.requestOAuth2.call(this, 'goToWebinarOAuth2Api', options, {
            tokenExpiredStatusCode: 403,
        });
        if (response === '') {
            return {};
        }
        // https://stackoverflow.com/questions/62190724/getting-gotowebinar-registrant
        return losslessJSON.parse(response, convertLosslessNumber);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
/**
 * Make an authenticated API request to GoToWebinar and return all results.
 */
async function goToWebinarApiRequestAllItems(method, endpoint, query, body, resource) {
    const resourceToResponseKey = {
        session: 'sessionInfoResources',
        webinar: 'webinars',
    };
    const key = resourceToResponseKey[resource];
    let returnData = [];
    let responseData;
    do {
        responseData = await goToWebinarApiRequest.call(this, method, endpoint, query, body);
        if (responseData.page && parseInt(responseData.page.totalElements, 10) === 0) {
            return [];
        }
        else if (responseData._embedded?.[key]) {
            returnData.push(...responseData._embedded[key]);
        }
        else {
            returnData.push(...responseData);
        }
        const limit = query.limit;
        if (limit && returnData.length >= limit) {
            returnData = returnData.splice(0, limit);
            return returnData;
        }
    } while (responseData.totalElements &&
        parseInt(responseData.totalElements, 10) > returnData.length);
    return returnData;
}
async function handleGetAll(endpoint, qs, body, resource) {
    const returnAll = this.getNodeParameter('returnAll', 0);
    if (!returnAll) {
        qs.limit = this.getNodeParameter('limit', 0);
    }
    return await goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, qs, body, resource);
}
async function loadWebinars() {
    const { oauthTokenData } = await this.getCredentials('goToWebinarOAuth2Api');
    const endpoint = `accounts/${oauthTokenData.account_key}/webinars`;
    const qs = {
        fromTime: (0, moment_timezone_1.default)().subtract(1, 'years').format(),
        toTime: (0, moment_timezone_1.default)().add(1, 'years').format(),
    };
    const resourceItems = await goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, qs, {}, 'webinar');
    const returnData = [];
    resourceItems.forEach((item) => {
        returnData.push({
            name: item.subject,
            value: item.webinarKey,
        });
    });
    return returnData;
}
async function loadWebinarSessions() {
    const { oauthTokenData } = await this.getCredentials('goToWebinarOAuth2Api');
    const webinarKey = this.getCurrentNodeParameter('webinarKey');
    const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarKey}/sessions`;
    const resourceItems = await goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, {}, {}, 'session');
    const returnData = [];
    resourceItems.forEach((item) => {
        returnData.push({
            name: `Date: ${(0, moment_timezone_1.default)(item.startTime).format('MM-DD-YYYY')} | From: ${(0, moment_timezone_1.default)(item.startTime).format('LT')} - To: ${(0, moment_timezone_1.default)(item.endTime).format('LT')}`,
            value: item.sessionKey,
        });
    });
    return returnData;
}
async function loadRegistranSimpleQuestions() {
    const { oauthTokenData } = await this.getCredentials('goToWebinarOAuth2Api');
    const webinarkey = this.getNodeParameter('webinarKey');
    const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarkey}/registrants/fields`;
    const { questions } = await goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
    const returnData = [];
    questions.forEach((item) => {
        if (item.type === 'shortAnswer') {
            returnData.push({
                name: item.question,
                value: item.questionKey,
            });
        }
    });
    return returnData;
}
async function loadAnswers() {
    const { oauthTokenData } = await this.getCredentials('goToWebinarOAuth2Api');
    const webinarKey = this.getCurrentNodeParameter('webinarKey');
    const questionKey = this.getCurrentNodeParameter('questionKey');
    const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarKey}/registrants/fields`;
    const { questions } = await goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
    const returnData = [];
    questions.forEach((item) => {
        if (item.type === 'multiChoice' && item.questionKey === questionKey) {
            for (const answer of item.answers) {
                returnData.push({
                    name: answer.answer,
                    value: answer.answerKey,
                });
            }
        }
    });
    return returnData;
}
async function loadRegistranMultiChoiceQuestions() {
    const { oauthTokenData } = await this.getCredentials('goToWebinarOAuth2Api');
    const webinarkey = this.getNodeParameter('webinarKey');
    const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarkey}/registrants/fields`;
    const { questions } = await goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});
    const returnData = [];
    questions.forEach((item) => {
        if (item.type === 'multipleChoice') {
            returnData.push({
                name: item.question,
                value: item.questionKey,
            });
        }
    });
    return returnData;
}
//# sourceMappingURL=GenericFunctions.js.map