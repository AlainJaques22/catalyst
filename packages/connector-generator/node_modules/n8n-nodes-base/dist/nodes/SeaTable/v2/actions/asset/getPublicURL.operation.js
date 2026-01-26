"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
const properties = [
    {
        displayName: 'Asset Path',
        name: 'assetPath',
        type: 'string',
        placeholder: '/images/2023-09/logo.png',
        required: true,
        default: '',
    },
];
const displayOptions = {
    show: {
        resource: ['asset'],
        operation: ['getPublicURL'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
async function execute(index) {
    const assetPath = this.getNodeParameter('assetPath', index);
    let responseData = [];
    if (assetPath) {
        responseData = await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'GET', `/api/v2.1/dtable/app-download-link/?path=${assetPath}`);
    }
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=getPublicURL.operation.js.map