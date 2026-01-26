"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionTrigger = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("./shared/constants");
const GenericFunctions_1 = require("./shared/GenericFunctions");
const methods_1 = require("./shared/methods");
class NotionTrigger {
    description = {
        displayName: 'Notion Trigger',
        name: 'notionTrigger',
        icon: { light: 'file:notion.svg', dark: 'file:notion.dark.svg' },
        group: ['trigger'],
        version: 1,
        description: 'Starts the workflow when Notion events occur',
        subtitle: '={{$parameter["event"]}}',
        defaults: {
            name: 'Notion Trigger',
        },
        credentials: [
            {
                name: 'notionApi',
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
                        name: 'Page Added to Database',
                        value: 'pageAddedToDatabase',
                    },
                    {
                        name: 'Page Updated in Database',
                        value: 'pagedUpdatedInDatabase',
                    },
                ],
                required: true,
                default: 'pageAddedToDatabase',
            },
            {
                displayName: 'In Notion, make sure to <a href="https://www.notion.so/help/add-and-manage-connections-with-the-api" target="_blank">add your connection</a> to the pages you want to access.',
                name: 'notionNotice',
                type: 'notice',
                default: '',
            },
            {
                displayName: 'Database',
                name: 'databaseId',
                type: 'resourceLocator',
                default: { mode: 'list', value: '' },
                required: true,
                modes: [
                    {
                        displayName: 'Database',
                        name: 'list',
                        type: 'list',
                        placeholder: 'Select a Database...',
                        typeOptions: {
                            searchListMethod: 'getDatabases',
                            searchable: true,
                        },
                    },
                    {
                        displayName: 'Link',
                        name: 'url',
                        type: 'string',
                        placeholder: 'https://www.notion.so/0fe2f7de558b471eab07e9d871cdf4a9?v=f2d424ba0c404733a3f500c78c881610',
                        validation: [
                            {
                                type: 'regex',
                                properties: {
                                    regex: constants_1.databaseUrlValidationRegexp,
                                    errorMessage: 'Not a valid Notion Database URL',
                                },
                            },
                        ],
                        extractValue: {
                            type: 'regex',
                            regex: constants_1.databaseUrlExtractionRegexp,
                        },
                    },
                    {
                        displayName: 'ID',
                        name: 'id',
                        type: 'string',
                        placeholder: 'ab1545b247fb49fa92d6f4b49f4d8116',
                        validation: [
                            {
                                type: 'regex',
                                properties: {
                                    regex: constants_1.idValidationRegexp,
                                    errorMessage: 'Not a valid Notion Database ID',
                                },
                            },
                        ],
                        extractValue: {
                            type: 'regex',
                            regex: constants_1.idExtractionRegexp,
                        },
                        url: '=https://www.notion.so/{{$value.replace(/-/g, "")}}',
                    },
                ],
                displayOptions: {
                    show: {
                        event: ['pageAddedToDatabase', 'pagedUpdatedInDatabase'],
                    },
                },
                description: 'The Notion Database to operate on',
            },
            {
                displayName: 'Simplify',
                name: 'simple',
                type: 'boolean',
                displayOptions: {
                    show: {
                        event: ['pageAddedToDatabase', 'pagedUpdatedInDatabase'],
                    },
                },
                default: true,
                description: 'Whether to return a simplified version of the response instead of the raw data',
            },
        ],
    };
    methods = {
        listSearch: methods_1.listSearch,
    };
    async poll() {
        const webhookData = this.getWorkflowStaticData('node');
        const databaseId = this.getNodeParameter('databaseId', '', { extractValue: true });
        const event = this.getNodeParameter('event');
        const simple = this.getNodeParameter('simple');
        const lastTimeChecked = webhookData.lastTimeChecked
            ? (0, moment_timezone_1.default)(webhookData.lastTimeChecked)
            : (0, moment_timezone_1.default)().set({ second: 0, millisecond: 0 }); // Notion timestamp accuracy is only down to the minute
        // update lastTimeChecked to now
        webhookData.lastTimeChecked = (0, moment_timezone_1.default)().set({ second: 0, millisecond: 0 });
        // because Notion timestamp accuracy is only down to the minute some duplicates can be fetch
        const possibleDuplicates = webhookData.possibleDuplicates ?? [];
        const sortProperty = event === 'pageAddedToDatabase' ? 'created_time' : 'last_edited_time';
        const option = {
            headers: {
                'Notion-Version': '2022-02-22',
            },
        };
        const body = {
            page_size: 1,
            sorts: [
                {
                    timestamp: sortProperty,
                    direction: 'descending',
                },
            ],
            ...(this.getMode() !== 'manual' && {
                filter: {
                    timestamp: sortProperty,
                    [sortProperty]: {
                        on_or_after: lastTimeChecked.utc().format(),
                    },
                },
            }),
        };
        let records = [];
        let hasMore = true;
        //get last record
        let { results: data } = await GenericFunctions_1.notionApiRequest.call(this, 'POST', `/databases/${databaseId}/query`, body, {}, '', option);
        if (this.getMode() === 'manual') {
            if (simple) {
                data = (0, GenericFunctions_1.simplifyObjects)(data, false, 1);
            }
            if (Array.isArray(data) && data.length) {
                return [this.helpers.returnJsonArray(data)];
            }
        }
        // if something changed after the last check
        if (Array.isArray(data) && data.length && Object.keys(data[0]).length !== 0) {
            do {
                body.page_size = 10;
                const { results, has_more, next_cursor } = await GenericFunctions_1.notionApiRequest.call(this, 'POST', `/databases/${databaseId}/query`, body, {}, '', option);
                records.push(...results);
                hasMore = has_more;
                if (next_cursor !== null) {
                    body.start_cursor = next_cursor;
                }
                // Only stop when we reach records strictly before last recorded time to be sure we catch records from the same minute
            } while (!(0, moment_timezone_1.default)(records[records.length - 1][sortProperty]).isBefore(lastTimeChecked) &&
                hasMore);
            // Filter out already processed left over records:
            // with a time strictly before the last record processed
            // or from the same minute not present in the list of processed records
            records = records.filter((record) => !possibleDuplicates.includes(record.id));
            // Save the time of the most recent record processed
            if (records[0]) {
                const latestTimestamp = (0, moment_timezone_1.default)(records[0][sortProperty]);
                // Save record ids with the same timestamp as the latest processed records
                webhookData.possibleDuplicates = records
                    .filter((record) => (0, moment_timezone_1.default)(record[sortProperty]).isSame(latestTimestamp))
                    .map((record) => record.id);
            }
            else {
                webhookData.possibleDuplicates = undefined;
            }
            if (simple) {
                records = (0, GenericFunctions_1.simplifyObjects)(records, false, 1);
            }
            if (Array.isArray(records) && records.length) {
                return [this.helpers.returnJsonArray(records)];
            }
        }
        return null;
    }
}
exports.NotionTrigger = NotionTrigger;
//# sourceMappingURL=NotionTrigger.node.js.map