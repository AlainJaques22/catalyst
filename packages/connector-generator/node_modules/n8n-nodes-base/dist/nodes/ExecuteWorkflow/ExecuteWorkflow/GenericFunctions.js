"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkflowInfo = getWorkflowInfo;
const promises_1 = require("fs/promises");
const n8n_workflow_1 = require("n8n-workflow");
async function getWorkflowInfo(source, itemIndex = 0) {
    const workflowInfo = {};
    const nodeVersion = this.getNode().typeVersion;
    if (source === 'database') {
        // Read workflow from database
        if (nodeVersion === 1) {
            workflowInfo.id = this.getNodeParameter('workflowId', itemIndex);
        }
        else {
            const { value } = this.getNodeParameter('workflowId', itemIndex, {});
            workflowInfo.id = value;
        }
    }
    else if (source === 'localFile') {
        // Read workflow from filesystem
        const workflowPath = this.getNodeParameter('workflowPath', itemIndex);
        let workflowJson;
        try {
            workflowJson = await (0, promises_1.readFile)(workflowPath, { encoding: 'utf8' });
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The file "${workflowPath}" could not be found, [item ${itemIndex}]`);
            }
            throw error;
        }
        workflowInfo.code = (0, n8n_workflow_1.jsonParse)(workflowJson, {
            errorMessage: 'The file content is not valid JSON', // pass a custom error message to not expose the file contents
        });
    }
    else if (source === 'parameter') {
        // Read workflow from parameter
        const workflowJson = this.getNodeParameter('workflowJson', itemIndex);
        workflowInfo.code = (0, n8n_workflow_1.jsonParse)(workflowJson);
    }
    else if (source === 'url') {
        // Read workflow from url
        const workflowUrl = this.getNodeParameter('workflowUrl', itemIndex);
        const requestOptions = {
            headers: {
                accept: 'application/json,text/*;q=0.99',
            },
            method: 'GET',
            uri: workflowUrl,
            json: true,
            gzip: true,
        };
        const response = await this.helpers.request(requestOptions);
        workflowInfo.code = response;
    }
    return workflowInfo;
}
//# sourceMappingURL=GenericFunctions.js.map