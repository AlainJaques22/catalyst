"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostBin = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BinDescription_1 = require("./BinDescription");
const RequestDescription_1 = require("./RequestDescription");
class PostBin {
    description = {
        displayName: 'PostBin',
        name: 'postBin',
        icon: 'file:postbin.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Consume PostBin API',
        defaults: {
            name: 'PostBin',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [],
        requestDefaults: {
            baseURL: 'https://www.postb.in',
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Bin',
                        value: 'bin',
                    },
                    {
                        name: 'Request',
                        value: 'request',
                    },
                ],
                default: 'bin',
                required: true,
            },
            ...BinDescription_1.binOperations,
            ...BinDescription_1.binFields,
            ...RequestDescription_1.requestOperations,
            ...RequestDescription_1.requestFields,
        ],
    };
}
exports.PostBin = PostBin;
//# sourceMappingURL=PostBin.node.js.map