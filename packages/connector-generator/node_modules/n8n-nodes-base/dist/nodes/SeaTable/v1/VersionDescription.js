"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionDescription = void 0;
/* eslint-disable n8n-nodes-base/node-filename-against-convention */
const n8n_workflow_1 = require("n8n-workflow");
const RowDescription_1 = require("./RowDescription");
exports.versionDescription = {
    displayName: 'SeaTable',
    name: 'seaTable',
    icon: 'file:seaTable.svg',
    group: ['input'],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description: 'Consume the SeaTable API',
    defaults: {
        name: 'SeaTable',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'seaTableApi',
            required: true,
        },
    ],
    properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Row',
                    value: 'row',
                },
            ],
            default: 'row',
        },
        ...RowDescription_1.rowOperations,
        ...RowDescription_1.rowFields,
    ],
};
//# sourceMappingURL=VersionDescription.js.map