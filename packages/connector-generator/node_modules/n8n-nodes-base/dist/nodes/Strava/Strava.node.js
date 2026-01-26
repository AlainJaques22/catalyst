"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strava = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const ActivityDescription_1 = require("./ActivityDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class Strava {
    description = {
        displayName: 'Strava',
        name: 'strava',
        icon: 'file:strava.svg',
        group: ['input'],
        version: [1, 1.1],
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Strava API',
        defaults: {
            name: 'Strava',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'stravaOAuth2Api',
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
                        name: 'Activity',
                        value: 'activity',
                    },
                ],
                default: 'activity',
            },
            ...ActivityDescription_1.activityOperations,
            ...ActivityDescription_1.activityFields,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        const qs = {};
        let responseData;
        const nodeVersion = this.getNode().typeVersion;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < length; i++) {
            try {
                if (resource === 'activity') {
                    //https://developers.strava.com/docs/reference/#api-Activities-createActivity
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i);
                        const startDate = this.getNodeParameter('startDate', i);
                        const elapsedTime = this.getNodeParameter('elapsedTime', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.trainer === true) {
                            additionalFields.trainer = 1;
                        }
                        if (additionalFields.commute === true) {
                            additionalFields.commute = 1;
                        }
                        const body = {
                            name,
                            start_date_local: (0, moment_timezone_1.default)(startDate).toISOString(),
                            elapsed_time: elapsedTime,
                        };
                        if (nodeVersion === 1) {
                            const type = this.getNodeParameter('type', i);
                            body.type = type;
                        }
                        else {
                            const sportType = this.getNodeParameter('sport_type', i);
                            body.sport_type = sportType;
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.stravaApiRequest.call(this, 'POST', '/activities', body);
                    }
                    //https://developers.strava.com/docs/reference/#api-Activities-getActivityById
                    if (operation === 'get') {
                        const activityId = this.getNodeParameter('activityId', i);
                        responseData = await GenericFunctions_1.stravaApiRequest.call(this, 'GET', `/activities/${activityId}`);
                    }
                    if (['getLaps', 'getZones', 'getKudos', 'getComments'].includes(operation)) {
                        const path = {
                            getComments: 'comments',
                            getZones: 'zones',
                            getKudos: 'kudos',
                            getLaps: 'laps',
                        };
                        const activityId = this.getNodeParameter('activityId', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        responseData = await GenericFunctions_1.stravaApiRequest.call(this, 'GET', `/activities/${activityId}/${path[operation]}`);
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i);
                            responseData = responseData.splice(0, limit);
                        }
                    }
                    //https://developers.strava.com/docs/reference/#api-Streams-getActivityStreams
                    if (operation === 'getStreams') {
                        const activityId = this.getNodeParameter('activityId', i);
                        const keys = this.getNodeParameter('keys', i);
                        qs.keys = keys.toString();
                        qs.key_by_type = true;
                        responseData = await GenericFunctions_1.stravaApiRequest.call(this, 'GET', `/activities/${activityId}/streams`, {}, qs);
                    }
                    //https://developers.mailerlite.com/reference#subscribers
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = await GenericFunctions_1.stravaApiRequestAllItems.call(this, 'GET', '/activities', {}, qs);
                        }
                        else {
                            qs.per_page = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.stravaApiRequest.call(this, 'GET', '/activities', {}, qs);
                        }
                    }
                    //https://developers.strava.com/docs/reference/#api-Activities-updateActivityById
                    if (operation === 'update') {
                        const activityId = this.getNodeParameter('activityId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        Object.assign(body, updateFields);
                        responseData = await GenericFunctions_1.stravaApiRequest.call(this, 'PUT', `/activities/${activityId}`, body);
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Strava = Strava;
//# sourceMappingURL=Strava.node.js.map