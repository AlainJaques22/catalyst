"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftSharePoint = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const methods_1 = require("./methods");
class MicrosoftSharePoint {
    description = {
        displayName: 'Microsoft SharePoint',
        name: 'microsoftSharePoint',
        icon: {
            light: 'file:microsoftSharePoint.svg',
            dark: 'file:microsoftSharePoint.svg',
        },
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with Microsoft SharePoint API',
        defaults: {
            name: 'Microsoft SharePoint',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'microsoftSharePointOAuth2Api',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: '=https://{{ $credentials.subdomain }}.sharepoint.com/_api/v2.0/',
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'File',
                        value: 'file',
                    },
                    {
                        name: 'Item',
                        value: 'item',
                    },
                    {
                        name: 'List',
                        value: 'list',
                    },
                ],
                default: 'file',
            },
            ...descriptions_1.file.description,
            ...descriptions_1.item.description,
            ...descriptions_1.list.description,
        ],
    };
    methods = {
        listSearch: methods_1.listSearch,
        resourceMapping: methods_1.resourceMapping,
    };
}
exports.MicrosoftSharePoint = MicrosoftSharePoint;
//# sourceMappingURL=MicrosoftSharePoint.node.js.map