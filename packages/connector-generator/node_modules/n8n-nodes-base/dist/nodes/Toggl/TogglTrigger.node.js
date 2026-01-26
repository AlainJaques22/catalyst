"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TogglTrigger = void 0;
const luxon_1 = require("luxon");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class TogglTrigger {
    description = {
        displayName: 'Toggl Trigger',
        name: 'togglTrigger',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:toggl.png',
        group: ['trigger'],
        version: 1,
        description: 'Starts the workflow when Toggl events occur',
        defaults: {
            name: 'Toggl Trigger',
        },
        credentials: [
            {
                name: 'togglApi',
                required: true,
            },
        ],
        polling: true,
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Event',
                name: 'event',
                type: 'options',
                options: [
                    {
                        name: 'New Time Entry',
                        value: 'newTimeEntry',
                    },
                ],
                required: true,
                default: 'newTimeEntry',
            },
        ],
    };
    async poll() {
        const webhookData = this.getWorkflowStaticData('node');
        const event = this.getNodeParameter('event');
        let endpoint;
        if (event === 'newTimeEntry') {
            endpoint = '/time_entries';
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The defined event "${event}" is not supported`);
        }
        const qs = {};
        let timeEntries = [];
        qs.start_date = webhookData.lastTimeChecked ?? luxon_1.DateTime.now().toISODate();
        qs.end_date = (0, moment_timezone_1.default)().format();
        try {
            timeEntries = await GenericFunctions_1.togglApiRequest.call(this, 'GET', endpoint, {}, qs);
            webhookData.lastTimeChecked = qs.end_date;
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
        if (Array.isArray(timeEntries) && timeEntries.length !== 0) {
            return [this.helpers.returnJsonArray(timeEntries)];
        }
        return null;
    }
}
exports.TogglTrigger = TogglTrigger;
//# sourceMappingURL=TogglTrigger.node.js.map