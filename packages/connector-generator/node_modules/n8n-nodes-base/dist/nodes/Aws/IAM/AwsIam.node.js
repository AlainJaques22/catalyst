"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsIam = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const constants_1 = require("./helpers/constants");
const utils_1 = require("./helpers/utils");
const listSearch_1 = require("./methods/listSearch");
class AwsIam {
    description = {
        displayName: 'AWS IAM',
        name: 'awsIam',
        icon: 'file:AwsIam.svg',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interacts with Amazon IAM',
        defaults: { name: 'AWS IAM' },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'aws',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: constants_1.BASE_URL,
            json: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                default: 'user',
                options: [
                    {
                        name: 'User',
                        value: 'user',
                    },
                    {
                        name: 'Group',
                        value: 'group',
                    },
                ],
                routing: {
                    send: {
                        preSend: [utils_1.encodeBodyAsFormUrlEncoded],
                    },
                },
            },
            ...descriptions_1.user.description,
            ...descriptions_1.group.description,
        ],
    };
    methods = {
        listSearch: {
            searchGroups: listSearch_1.searchGroups,
            searchUsers: listSearch_1.searchUsers,
            searchGroupsForUser: listSearch_1.searchGroupsForUser,
        },
    };
}
exports.AwsIam = AwsIam;
//# sourceMappingURL=AwsIam.node.js.map