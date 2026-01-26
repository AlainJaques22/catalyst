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
        description: 'Select the list you want to retrieve an item from',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
            },
        },
    },
    {
        ...common_descriptions_1.itemRLC,
        description: 'Select the item you want to get',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
                ...common_descriptions_1.untilListSelected,
            },
        },
    },
    {
        displayName: 'Simplify',
        name: 'simplify',
        default: true,
        routing: {
            send: {
                preSend: [
                    async function (requestOptions) {
                        const simplify = this.getNodeParameter('simplify', false);
                        if (simplify) {
                            requestOptions.qs ??= {};
                            requestOptions.qs.$select = 'id,createdDateTime,lastModifiedDateTime,webUrl';
                            requestOptions.qs.$expand = 'fields(select=Title)';
                        }
                        return requestOptions;
                    },
                ],
            },
        },
        type: 'boolean',
    },
];
const displayOptions = {
    show: {
        resource: ['item'],
        operation: ['get'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=get.operation.js.map