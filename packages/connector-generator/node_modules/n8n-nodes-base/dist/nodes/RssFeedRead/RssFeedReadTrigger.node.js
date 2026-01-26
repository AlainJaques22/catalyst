"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedReadTrigger = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const rss_parser_1 = __importDefault(require("rss-parser"));
class RssFeedReadTrigger {
    description = {
        displayName: 'RSS Feed Trigger',
        name: 'rssFeedReadTrigger',
        icon: 'fa:rss',
        iconColor: 'orange-red',
        group: ['trigger'],
        version: 1,
        description: 'Starts a workflow when an RSS feed is updated',
        subtitle: '={{$parameter["event"]}}',
        defaults: {
            name: 'RSS Feed Trigger',
            color: '#b02020',
        },
        polling: true,
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Feed URL',
                name: 'feedUrl',
                type: 'string',
                default: 'https://blog.n8n.io/rss/',
                required: true,
                description: 'URL of the RSS feed to poll',
            },
        ],
    };
    async poll() {
        const pollData = this.getWorkflowStaticData('node');
        const feedUrl = this.getNodeParameter('feedUrl');
        const dateToCheck = Date.parse(pollData.lastItemDate ?? pollData.lastTimeChecked ?? (0, moment_timezone_1.default)().utc().format());
        if (!feedUrl) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The parameter "URL" has to be set!');
        }
        const parser = new rss_parser_1.default();
        let feed;
        try {
            feed = await parser.parseURL(feedUrl);
        }
        catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `It was not possible to connect to the URL. Please make sure the URL "${feedUrl}" it is valid!`);
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
        }
        const returnData = [];
        if (feed.items) {
            if (this.getMode() === 'manual') {
                return [this.helpers.returnJsonArray(feed.items[0])];
            }
            feed.items.forEach((item) => {
                if (item.isoDate && Date.parse(item.isoDate) > dateToCheck) {
                    returnData.push(item);
                }
            });
            if (feed.items.length) {
                pollData.lastItemDate = feed.items.reduce((a, b) => new Date(a.isoDate) > new Date(b.isoDate) ? a : b).isoDate;
            }
        }
        if (Array.isArray(returnData) && returnData.length !== 0) {
            return [this.helpers.returnJsonArray(returnData)];
        }
        return null;
    }
}
exports.RssFeedReadTrigger = RssFeedReadTrigger;
//# sourceMappingURL=RssFeedReadTrigger.node.js.map