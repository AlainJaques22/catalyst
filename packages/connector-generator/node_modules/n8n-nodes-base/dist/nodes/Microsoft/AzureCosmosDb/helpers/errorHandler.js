"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMap = void 0;
exports.handleError = handleError;
const n8n_workflow_1 = require("n8n-workflow");
exports.ErrorMap = {
    Container: {
        Conflict: {
            getMessage: (id) => `Container "${id}" already exists.`,
            description: "Use a unique value for 'ID' and try again.",
        },
        NotFound: {
            getMessage: (id) => `Container "${id}" was not found.`,
            description: "Double-check the value in the parameter 'Container' and try again.",
        },
    },
    Item: {
        NotFound: {
            getMessage: (id) => `Item "${id}" was not found.`,
            description: "Double-check the values in the parameter 'Item' and 'Partition Key' (if applicable) and try again.",
        },
    },
};
async function handleError(data, response) {
    if (String(response.statusCode).startsWith('4') || String(response.statusCode).startsWith('5')) {
        const resource = this.getNodeParameter('resource');
        const error = response.body;
        let errorMessage = error.message;
        let errorDetails = undefined;
        if (resource === 'container') {
            if (error.code === 'Conflict') {
                const newContainerValue = this.getNodeParameter('containerCreate');
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                    message: exports.ErrorMap.Container.Conflict.getMessage(newContainerValue ?? 'Unknown'),
                    description: exports.ErrorMap.Container.Conflict.description,
                });
            }
            if (error.code === 'NotFound') {
                const containerValue = this.getNodeParameter('container', undefined, {
                    extractValue: true,
                });
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                    message: exports.ErrorMap.Container.NotFound.getMessage(containerValue ?? 'Unknown'),
                    description: exports.ErrorMap.Container.NotFound.description,
                });
            }
        }
        else if (resource === 'item') {
            if (error.code === 'NotFound') {
                const itemValue = this.getNodeParameter('item', undefined, {
                    extractValue: true,
                });
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                    message: exports.ErrorMap.Item.NotFound.getMessage(itemValue ?? 'Unknown'),
                    description: exports.ErrorMap.Item.NotFound.description,
                });
            }
        }
        try {
            // Certain error responses have nested Message
            errorMessage = (0, n8n_workflow_1.jsonParse)(errorMessage).message;
        }
        catch { }
        const match = errorMessage.match(/Message: ({.*?})/);
        if (match?.[1]) {
            try {
                errorDetails = (0, n8n_workflow_1.jsonParse)(match[1]).Errors;
            }
            catch { }
        }
        if (errorDetails && errorDetails.length > 0) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: error.code,
                description: errorDetails.join('\n'),
            });
        }
        else {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: error.code,
                description: error.message,
            });
        }
    }
    return data;
}
//# sourceMappingURL=errorHandler.js.map