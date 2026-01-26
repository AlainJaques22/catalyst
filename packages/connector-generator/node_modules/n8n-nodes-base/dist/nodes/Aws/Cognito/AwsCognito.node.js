"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsCognito = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const utils_1 = require("./helpers/utils");
const methods_1 = require("./methods");
class AwsCognito {
    description = {
        displayName: 'AWS Cognito',
        name: 'awsCognito',
        icon: {
            light: 'file:cognito.svg',
            dark: 'file:cognito.svg',
        },
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Sends data to AWS Cognito',
        defaults: {
            name: 'AWS Cognito',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'aws',
                required: true,
            },
        ],
        requestDefaults: {
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
            },
            qs: {
                service: 'cognito-idp',
                _region: '={{$credentials.region}}',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                default: 'user',
                routing: {
                    send: {
                        preSend: [utils_1.preSendStringifyBody],
                    },
                },
                options: [
                    {
                        name: 'Group',
                        value: 'group',
                    },
                    {
                        name: 'User',
                        value: 'user',
                    },
                    {
                        name: 'User Pool',
                        value: 'userPool',
                    },
                ],
            },
            ...descriptions_1.group.description,
            ...descriptions_1.user.description,
            ...descriptions_1.userPool.description,
        ],
    };
    methods = {
        listSearch: methods_1.listSearch,
    };
}
exports.AwsCognito = AwsCognito;
//# sourceMappingURL=AwsCognito.node.js.map