"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        ...common_descriptions_1.siteRLC,
        description: 'Select the site to retrieve lists from',
    },
    {
        ...common_descriptions_1.listRLC,
        description: 'Select the list you want to retrieve',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
            },
        },
    },
    {
        displayName: 'Simplify',
        name: 'simplify',
        default: true,
        routing: {
            send: {
                property: '$select',
                type: 'query',
                value: '={{ $value ? "id,name,displayName,description,createdDateTime,lastModifiedDateTime,webUrl" : undefined }}',
            },
        },
        type: 'boolean',
    },
];
const displayOptions = {
    show: {
        resource: ['list'],
        operation: ['get'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=get.operation.js.map