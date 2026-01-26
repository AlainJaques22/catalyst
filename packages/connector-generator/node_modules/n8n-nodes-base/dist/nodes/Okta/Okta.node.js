"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Okta = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const UserDescription_1 = require("./UserDescription");
const UserFunctions_1 = require("./UserFunctions");
class Okta {
    description = {
        displayName: 'Okta',
        name: 'okta',
        icon: { light: 'file:Okta.svg', dark: 'file:Okta.dark.svg' },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Use the Okta API',
        defaults: {
            name: 'Okta',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'oktaApi',
                required: true,
            },
        ],
        requestDefaults: {
            returnFullResponse: true,
            baseURL: '={{$credentials.url.replace(new RegExp("/$"), "")}}',
            headers: {},
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'User',
                        value: 'user',
                    },
                ],
                default: 'user',
            },
            // USER
            ...UserDescription_1.userOperations,
            ...UserDescription_1.userFields,
        ],
    };
    methods = {
        listSearch: {
            getUsers: UserFunctions_1.getUsers,
        },
    };
}
exports.Okta = Okta;
//# sourceMappingURL=Okta.node.js.map