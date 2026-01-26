"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftEntra = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class MicrosoftEntra {
    description = {
        displayName: 'Microsoft Entra ID',
        name: 'microsoftEntra',
        icon: {
            light: 'file:microsoftEntra.svg',
            dark: 'file:microsoftEntra.dark.svg',
        },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with Microsoft Entra ID API',
        defaults: {
            name: 'Microsoft Entra ID',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'microsoftEntraOAuth2Api',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://graph.microsoft.com/v1.0',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Group',
                        value: 'group',
                    },
                    {
                        name: 'User',
                        value: 'user',
                    },
                ],
                default: 'user',
            },
            ...descriptions_1.groupOperations,
            ...descriptions_1.groupFields,
            ...descriptions_1.userOperations,
            ...descriptions_1.userFields,
        ],
    };
    methods = {
        loadOptions: {
            getGroupProperties: GenericFunctions_1.getGroupProperties,
            async getGroupPropertiesGetAll() {
                // Filter items not supported for list endpoint
                return (await GenericFunctions_1.getGroupProperties.call(this)).filter((x) => ![
                    'allowExternalSenders',
                    'autoSubscribeNewMembers',
                    'hideFromAddressLists',
                    'hideFromOutlookClients',
                    'isSubscribedByMail',
                    'unseenCount',
                ].includes(x.value));
            },
            getUserProperties: GenericFunctions_1.getUserProperties,
            async getUserPropertiesGetAll() {
                // Filter items not supported for list endpoint
                return (await GenericFunctions_1.getUserProperties.call(this)).filter((x) => ![
                    'aboutMe',
                    'birthday',
                    'hireDate',
                    'interests',
                    'mySite',
                    'pastProjects',
                    'preferredName',
                    'responsibilities',
                    'schools',
                    'skills',
                    'mailboxSettings',
                ].includes(x.value));
            },
        },
        listSearch: {
            getGroups: GenericFunctions_1.getGroups,
            getUsers: GenericFunctions_1.getUsers,
        },
    };
}
exports.MicrosoftEntra = MicrosoftEntra;
//# sourceMappingURL=MicrosoftEntra.node.js.map