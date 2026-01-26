"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostHog = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const AliasDescription_1 = require("./AliasDescription");
const EventDescription_1 = require("./EventDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const IdentityDescription_1 = require("./IdentityDescription");
const TrackDescription_1 = require("./TrackDescription");
class PostHog {
    description = {
        displayName: 'PostHog',
        name: 'postHog',
        icon: 'file:postHog.svg',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume PostHog API',
        defaults: {
            name: 'PostHog',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'postHogApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Alias',
                        value: 'alias',
                    },
                    {
                        name: 'Event',
                        value: 'event',
                    },
                    {
                        name: 'Identity',
                        value: 'identity',
                    },
                    {
                        name: 'Track',
                        value: 'track',
                    },
                ],
                default: 'event',
            },
            ...AliasDescription_1.aliasOperations,
            ...AliasDescription_1.aliasFields,
            ...EventDescription_1.eventOperations,
            ...EventDescription_1.eventFields,
            ...IdentityDescription_1.identityOperations,
            ...IdentityDescription_1.identityFields,
            ...TrackDescription_1.trackOperations,
            ...TrackDescription_1.trackFields,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        if (resource === 'alias') {
            if (operation === 'create') {
                for (let i = 0; i < length; i++) {
                    try {
                        const distinctId = this.getNodeParameter('distinctId', i);
                        const alias = this.getNodeParameter('alias', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const context = additionalFields.contextUi?.contextValues || [];
                        const event = {
                            type: 'alias',
                            event: '$create_alias',
                            context: context.reduce((obj, value) => Object.assign(obj, { [`${value.key}`]: value.value }), {}),
                            properties: {
                                distinct_id: distinctId,
                                alias,
                            },
                        };
                        Object.assign(event, additionalFields);
                        if (additionalFields.timestamp) {
                            additionalFields.timestamp = (0, moment_timezone_1.default)(additionalFields.timestamp).toISOString();
                        }
                        responseData = await GenericFunctions_1.posthogApiRequest.call(this, 'POST', '/batch', event);
                        returnData.push(responseData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                            continue;
                        }
                        throw error;
                    }
                }
            }
        }
        if (resource === 'event') {
            if (operation === 'create') {
                try {
                    const events = [];
                    for (let i = 0; i < length; i++) {
                        const eventName = this.getNodeParameter('eventName', i);
                        const distinctId = this.getNodeParameter('distinctId', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const properties = additionalFields.propertiesUi?.propertyValues ||
                            [];
                        const event = {
                            event: eventName,
                            properties: properties.reduce((obj, value) => Object.assign(obj, { [`${value.key}`]: value.value }), {}),
                        };
                        event.properties.distinct_id = distinctId;
                        Object.assign(event, additionalFields);
                        if (additionalFields.timestamp) {
                            additionalFields.timestamp = (0, moment_timezone_1.default)(additionalFields.timestamp).toISOString();
                        }
                        //@ts-ignore
                        delete event.propertiesUi;
                        events.push(event);
                    }
                    responseData = await GenericFunctions_1.posthogApiRequest.call(this, 'POST', '/capture', { batch: events });
                    returnData.push(responseData);
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                    }
                    else {
                        throw error;
                    }
                }
            }
        }
        if (resource === 'identity') {
            if (operation === 'create') {
                for (let i = 0; i < length; i++) {
                    try {
                        const distinctId = this.getNodeParameter('distinctId', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const properties = additionalFields.propertiesUi?.propertyValues ||
                            [];
                        const event = {
                            event: '$identify',
                            properties: properties.reduce((obj, value) => Object.assign(obj, { [`${value.key}`]: value.value }), {}),
                            distinct_id: distinctId,
                        };
                        Object.assign(event, additionalFields);
                        if (additionalFields.timestamp) {
                            additionalFields.timestamp = (0, moment_timezone_1.default)(additionalFields.timestamp).toISOString();
                        }
                        //@ts-ignore
                        delete event.propertiesUi;
                        responseData = await GenericFunctions_1.posthogApiRequest.call(this, 'POST', '/batch', event);
                        returnData.push(responseData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                            continue;
                        }
                        throw error;
                    }
                }
            }
        }
        if (resource === 'track') {
            if (operation === 'page' || operation === 'screen') {
                for (let i = 0; i < length; i++) {
                    try {
                        const distinctId = this.getNodeParameter('distinctId', i);
                        const name = this.getNodeParameter('name', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const context = additionalFields.contextUi?.contextValues || [];
                        const properties = additionalFields.propertiesUi?.propertyValues ||
                            [];
                        const event = {
                            name,
                            type: operation,
                            event: `$${operation}`,
                            context: context.reduce((obj, value) => Object.assign(obj, { [`${value.key}`]: value.value }), {}),
                            distinct_id: distinctId,
                            properties: properties.reduce((obj, value) => Object.assign(obj, { [`${value.key}`]: value.value }), {}),
                        };
                        Object.assign(event, additionalFields);
                        if (additionalFields.timestamp) {
                            additionalFields.timestamp = (0, moment_timezone_1.default)(additionalFields.timestamp).toISOString();
                        }
                        //@ts-ignore
                        delete event.propertiesUi;
                        responseData = await GenericFunctions_1.posthogApiRequest.call(this, 'POST', '/batch', event);
                        returnData.push(responseData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ error: error.message });
                            continue;
                        }
                        throw error;
                    }
                }
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.PostHog = PostHog;
//# sourceMappingURL=PostHog.node.js.map