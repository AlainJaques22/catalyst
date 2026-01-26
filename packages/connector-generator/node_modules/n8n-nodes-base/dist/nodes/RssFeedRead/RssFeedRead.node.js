"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssFeedRead = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const rss_parser_1 = __importDefault(require("rss-parser"));
const url_1 = require("url");
const utilities_1 = require("../../utils/utilities");
// Utility function
function validateURL(url) {
    try {
        new url_1.URL(url);
        return true;
    }
    catch (err) {
        return false;
    }
}
class RssFeedRead {
    description = {
        displayName: 'RSS Read',
        name: 'rssFeedRead',
        icon: 'fa:rss',
        iconColor: 'orange-red',
        group: ['input'],
        version: [1, 1.1, 1.2],
        description: 'Reads data from an RSS Feed',
        defaults: {
            name: 'RSS Read',
            color: '#b02020',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                required: true,
                description: 'URL of the RSS feed',
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add option',
                default: {},
                options: [
                    {
                        displayName: 'Custom Fields',
                        name: 'customFields',
                        type: 'string',
                        default: '',
                        description: 'A comma-separated list of custom fields to include in the output. For example, "author, contentSnippet".',
                    },
                    {
                        displayName: 'Ignore SSL Issues (Insecure)',
                        name: 'ignoreSSL',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to ignore SSL/TLS certificate issues or not',
                    },
                ],
            },
        ],
    };
    async execute() {
        const returnData = [];
        const nodeVersion = this.getNode().typeVersion;
        const items = this.getInputData();
        let itemsLength = items.length ? 1 : 0;
        let fallbackPairedItems;
        if (nodeVersion >= 1.1) {
            itemsLength = items.length;
        }
        else {
            fallbackPairedItems = (0, utilities_1.generatePairedItemData)(items.length);
        }
        for (let i = 0; i < itemsLength; i++) {
            try {
                const url = this.getNodeParameter('url', i);
                const options = this.getNodeParameter('options', i);
                const ignoreSSL = Boolean(options.ignoreSSL);
                if (!url) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The parameter "URL" has to be set!', {
                        itemIndex: i,
                    });
                }
                if (!validateURL(url)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The provided "URL" is not valid!', {
                        itemIndex: i,
                    });
                }
                const parserOptions = {
                    requestOptions: {
                        rejectUnauthorized: !ignoreSSL,
                    },
                };
                if (nodeVersion >= 1.2) {
                    parserOptions.headers = {
                        Accept: 'application/rss+xml, application/rdf+xml;q=0.8, application/atom+xml;q=0.6, application/xml;q=0.4, text/xml;q=0.4',
                    };
                }
                if (options.customFields) {
                    const customFields = options.customFields;
                    parserOptions.customFields = {
                        item: customFields.split(',').map((field) => field.trim()),
                    };
                }
                const parser = new rss_parser_1.default(parserOptions);
                let feed;
                try {
                    feed = await parser.parseURL(url);
                }
                catch (error) {
                    if (error.code === 'ECONNREFUSED') {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `It was not possible to connect to the URL. Please make sure the URL "${url}" it is valid!`, {
                            itemIndex: i,
                        });
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex: i,
                    });
                }
                if (feed.items) {
                    const feedItems = feed.items.map((item) => ({
                        json: item,
                    }));
                    const itemData = fallbackPairedItems ?? [{ item: i }];
                    const executionData = this.helpers.constructExecutionMetaData(feedItems, {
                        itemData,
                    });
                    returnData.push(...executionData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
                        pairedItem: fallbackPairedItems ?? [{ item: i }],
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.RssFeedRead = RssFeedRead;
//# sourceMappingURL=RssFeedRead.node.js.map