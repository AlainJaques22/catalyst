"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spontit = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const PushDescription_1 = require("./PushDescription");
class Spontit {
    description = {
        displayName: 'Spontit',
        name: 'spontit',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:spontit.png',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Spontit API',
        defaults: {
            name: 'Spontit',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'spontitApi',
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
                        name: 'Push',
                        value: 'push',
                    },
                ],
                default: 'push',
            },
            ...PushDescription_1.pushOperations,
            ...PushDescription_1.pushFields,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const timezone = this.getTimezone();
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'push') {
                    if (operation === 'create') {
                        const content = this.getNodeParameter('content', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            content,
                        };
                        Object.assign(body, additionalFields);
                        if (body.pushToFollowers) {
                            body.pushToFollowers = body.pushToFollowers.split(',');
                        }
                        if (body.pushToPhoneNumbers) {
                            body.pushToPhoneNumbers = body.pushToPhoneNumbers.split(',');
                        }
                        if (body.pushToEmails) {
                            body.pushToEmails = body.pushToEmails.split(',');
                        }
                        if (body.schedule) {
                            body.scheduled = moment_timezone_1.default.tz(body.schedule, timezone).unix();
                        }
                        if (body.expirationStamp) {
                            body.expirationStamp = moment_timezone_1.default.tz(body.expirationStamp, timezone).unix();
                        }
                        responseData = await GenericFunctions_1.spontitApiRequest.call(this, 'POST', '/push', body);
                        responseData = responseData.data;
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else if (responseData !== undefined) {
                    returnData.push(responseData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.Spontit = Spontit;
//# sourceMappingURL=Spontit.node.js.map