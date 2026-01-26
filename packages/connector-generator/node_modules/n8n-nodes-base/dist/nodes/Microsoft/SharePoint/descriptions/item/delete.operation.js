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
        description: 'Select the list you want to delete an item in',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
            },
        },
    },
    {
        ...common_descriptions_1.itemRLC,
        description: 'Select the item you want to delete',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
                ...common_descriptions_1.untilListSelected,
            },
        },
    },
];
const displayOptions = {
    show: {
        resource: ['item'],
        operation: ['delete'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=delete.operation.js.map