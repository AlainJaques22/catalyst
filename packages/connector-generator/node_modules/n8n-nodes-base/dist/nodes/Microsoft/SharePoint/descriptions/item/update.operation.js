"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../../helpers/utils");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        ...common_descriptions_1.siteRLC,
        description: 'Select the site to retrieve lists from',
    },
    {
        ...common_descriptions_1.listRLC,
        description: 'Select the list you want to update an item in',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
            },
        },
    },
    {
        displayName: 'Due to API restrictions, the following column types cannot be updated: Hyperlink, Location, Metadata',
        name: 'noticeUnsupportedFields',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
                ...common_descriptions_1.untilListSelected,
            },
        },
        type: 'notice',
        default: '',
    },
    {
        displayName: 'Columns',
        name: 'columns',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
                ...common_descriptions_1.untilListSelected,
            },
        },
        noDataExpression: true,
        required: true,
        routing: {
            send: {
                preSend: [utils_1.itemColumnsPreSend],
            },
        },
        type: 'resourceMapper',
        typeOptions: {
            loadOptionsDependsOn: ['site.value', 'list.value'],
            resourceMapper: {
                resourceMapperMethod: 'getMappingColumns',
                mode: 'update',
                fieldWords: {
                    singular: 'column',
                    plural: 'columns',
                },
                addAllFields: true,
                multiKeyMatch: false,
            },
        },
    },
];
const displayOptions = {
    show: {
        resource: ['item'],
        operation: ['update'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=update.operation.js.map