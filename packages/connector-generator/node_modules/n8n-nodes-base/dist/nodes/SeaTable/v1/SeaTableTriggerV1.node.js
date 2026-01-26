"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeaTableTriggerV1 = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class SeaTableTriggerV1 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            defaults: {
                name: 'SeaTable Trigger',
            },
            credentials: [
                {
                    name: 'seaTableApi',
                    required: true,
                },
            ],
            polling: true,
            inputs: [],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            properties: [
                {
                    displayName: 'Table Name or ID',
                    name: 'tableName',
                    type: 'options',
                    required: true,
                    typeOptions: {
                        loadOptionsMethod: 'getTableNames',
                    },
                    default: '',
                    description: 'The name of SeaTable table to access. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                },
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    options: [
                        {
                            name: 'Row Created',
                            value: 'rowCreated',
                            description: 'Trigger on newly created rows',
                        },
                        // {
                        // 	name: 'Row Modified',
                        // 	value: 'rowModified',
                        // 	description: 'Trigger has recently modified rows',
                        // },
                    ],
                    default: 'rowCreated',
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
            ],
        };
    }
    methods = {
        loadOptions: {
            async getTableNames() {
                const returnData = [];
                const { metadata: { tables }, } = await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'GET', '/dtable-server/api/v1/dtables/{{dtable_uuid}}/metadata');
                for (const table of tables) {
                    returnData.push({
                        name: table.name,
                        value: table.name,
                    });
                }
                return returnData;
            },
        },
    };
    async poll() {
        const webhookData = this.getWorkflowStaticData('node');
        const tableName = this.getNodeParameter('tableName');
        const simple = this.getNodeParameter('simple');
        const event = this.getNodeParameter('event');
        const ctx = {};
        const credentials = await this.getCredentials('seaTableApi');
        const timezone = credentials.timezone || 'Europe/Berlin';
        const now = (0, moment_timezone_1.default)().utc().format();
        const startDate = webhookData.lastTimeChecked || now;
        const endDate = now;
        webhookData.lastTimeChecked = endDate;
        let rows;
        const filterField = event === 'rowCreated' ? '_ctime' : '_mtime';
        const endpoint = '/dtable-db/api/v1/query/{{dtable_uuid}}/';
        if (this.getMode() === 'manual') {
            rows = (await GenericFunctions_1.seaTableApiRequest.call(this, ctx, 'POST', endpoint, {
                sql: `SELECT * FROM ${tableName} LIMIT 1`,
            }));
        }
        else {
            rows = (await GenericFunctions_1.seaTableApiRequest.call(this, ctx, 'POST', endpoint, {
                sql: `SELECT * FROM ${tableName}
					WHERE ${filterField} BETWEEN "${(0, moment_timezone_1.default)(startDate).tz(timezone).format('YYYY-MM-D HH:mm:ss')}"
					AND "${(0, moment_timezone_1.default)(endDate).tz(timezone).format('YYYY-MM-D HH:mm:ss')}"`,
            }));
        }
        let response;
        if (rows.metadata && rows.results) {
            const columns = (0, GenericFunctions_1.getColumns)(rows);
            if (simple) {
                response = (0, GenericFunctions_1.simplify)(rows, columns);
            }
            else {
                response = rows.results;
            }
            const allColumns = rows.metadata.map((meta) => meta.name);
            response = response
                //@ts-ignore
                .map((row) => (0, GenericFunctions_1.rowFormatColumns)(row, allColumns))
                .map((row) => ({ json: row }));
        }
        if (Array.isArray(response) && response.length) {
            return [response];
        }
        return null;
    }
}
exports.SeaTableTriggerV1 = SeaTableTriggerV1;
//# sourceMappingURL=SeaTableTriggerV1.node.js.map