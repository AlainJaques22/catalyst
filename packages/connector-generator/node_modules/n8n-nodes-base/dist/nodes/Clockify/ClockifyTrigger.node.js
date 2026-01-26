"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockifyTrigger = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const EntryType_1 = require("./EntryType");
const GenericFunctions_1 = require("./GenericFunctions");
class ClockifyTrigger {
    description = {
        displayName: 'Clockify Trigger',
        icon: { light: 'file:clockify.svg', dark: 'file:clockify.dark.svg' },
        name: 'clockifyTrigger',
        group: ['trigger'],
        version: 1,
        description: 'Listens to Clockify events',
        defaults: {
            name: 'Clockify Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'clockifyApi',
                required: true,
            },
        ],
        polling: true,
        properties: [
            {
                displayName: 'Workspace Name or ID',
                name: 'workspaceId',
                type: 'options',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                typeOptions: {
                    loadOptionsMethod: 'listWorkspaces',
                },
                required: true,
                default: '',
            },
            // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
            {
                displayName: 'Trigger',
                name: 'watchField',
                type: 'options',
                options: [
                    {
                        name: 'New Time Entry',
                        value: EntryType_1.EntryTypes.NEW_TIME_ENTRY,
                    },
                ],
                required: true,
                default: EntryType_1.EntryTypes.NEW_TIME_ENTRY,
            },
        ],
    };
    methods = {
        loadOptions: {
            async listWorkspaces() {
                const rtv = [];
                const workspaces = await GenericFunctions_1.clockifyApiRequest.call(this, 'GET', 'workspaces');
                if (undefined !== workspaces) {
                    workspaces.forEach((value) => {
                        rtv.push({
                            name: value.name,
                            value: value.id,
                        });
                    });
                }
                return rtv;
            },
        },
    };
    async poll() {
        const webhookData = this.getWorkflowStaticData('node');
        const triggerField = this.getNodeParameter('watchField');
        const workspaceId = this.getNodeParameter('workspaceId');
        if (!webhookData.userId) {
            // Cache the user-id that we do not have to request it every time
            const userInfo = await GenericFunctions_1.clockifyApiRequest.call(this, 'GET', 'user');
            webhookData.userId = userInfo.id;
        }
        const qs = {};
        let resource;
        let result = null;
        switch (triggerField) {
            case EntryType_1.EntryTypes.NEW_TIME_ENTRY:
            default:
                const workflowTimezone = this.getTimezone();
                resource = `workspaces/${workspaceId}/user/${webhookData.userId}/time-entries`;
                qs.start = webhookData.lastTimeChecked;
                qs.end = (0, moment_timezone_1.default)().tz(workflowTimezone).format('YYYY-MM-DDTHH:mm:ss') + 'Z';
                qs.hydrated = true;
                qs['in-progress'] = false;
                break;
        }
        result = await GenericFunctions_1.clockifyApiRequest.call(this, 'GET', resource, {}, qs);
        webhookData.lastTimeChecked = qs.end;
        if (Array.isArray(result) && result.length !== 0) {
            return [this.helpers.returnJsonArray(result)];
        }
        return null;
    }
}
exports.ClockifyTrigger = ClockifyTrigger;
//# sourceMappingURL=ClockifyTrigger.node.js.map