"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionDescription = void 0;
/* eslint-disable n8n-nodes-base/node-filename-against-convention */
const n8n_workflow_1 = require("n8n-workflow");
const BlockDescription_1 = require("../shared/descriptions/BlockDescription");
const DatabaseDescription_1 = require("../shared/descriptions/DatabaseDescription");
const DatabasePageDescription_1 = require("../shared/descriptions/DatabasePageDescription");
const PageDescription_1 = require("../shared/descriptions/PageDescription");
const UserDescription_1 = require("../shared/descriptions/UserDescription");
exports.versionDescription = {
    displayName: 'Notion',
    name: 'notion',
    icon: { light: 'file:notion.svg', dark: 'file:notion.dark.svg' },
    group: ['output'],
    version: [2, 2.1, 2.2],
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume Notion API',
    defaults: {
        name: 'Notion',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
        {
            name: 'notionApi',
            required: true,
            // displayOptions: {
            // 	show: {
            // 		authentication: [
            // 			'apiKey',
            // 		],
            // 	},
            // },
        },
        // {
        // 	name: 'notionOAuth2Api',
        // 	required: true,
        // 	displayOptions: {
        // 		show: {
        // 			authentication: [
        // 				'oAuth2',
        // 			],
        // 		},
        // 	},
        // },
    ],
    properties: [
        // {
        // 	displayName: 'Authentication',
        // 	name: 'authentication',
        // 	type: 'options',
        // 	options: [
        // 		{
        // 			name: 'API Key',
        // 			value: 'apiKey',
        // 		},
        // 		{
        // 			name: 'OAuth2',
        // 			value: 'oAuth2',
        // 		},
        // 	],
        // 	default: 'apiKey',
        // 	description: 'The resource to operate on.',
        // },
        {
            displayName: 'In Notion, make sure to <a href="https://www.notion.so/help/add-and-manage-connections-with-the-api" target="_blank">add your connection</a> to the pages you want to access.',
            name: 'notionNotice',
            type: 'notice',
            default: '',
        },
        {
            displayName: '',
            name: 'Credentials',
            type: 'credentials',
            default: '',
        },
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Block',
                    value: 'block',
                },
                {
                    name: 'Database',
                    value: 'database',
                },
                {
                    name: 'Database Page',
                    value: 'databasePage',
                },
                {
                    name: 'Page',
                    value: 'page',
                },
                {
                    name: 'User',
                    value: 'user',
                },
            ],
            default: 'page',
        },
        ...BlockDescription_1.blockOperations,
        ...BlockDescription_1.blockFields,
        ...DatabaseDescription_1.databaseOperations,
        ...DatabaseDescription_1.databaseFields,
        ...DatabasePageDescription_1.databasePageOperations,
        ...DatabasePageDescription_1.databasePageFields,
        ...PageDescription_1.pageOperations,
        ...PageDescription_1.pageFields,
        ...UserDescription_1.userOperations,
        ...UserDescription_1.userFields,
    ],
};
//# sourceMappingURL=VersionDescription.js.map