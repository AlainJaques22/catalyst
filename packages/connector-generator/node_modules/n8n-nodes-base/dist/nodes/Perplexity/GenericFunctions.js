"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorPostReceive = sendErrorPostReceive;
const n8n_workflow_1 = require("n8n-workflow");
async function sendErrorPostReceive(data, response) {
    if (String(response.statusCode).startsWith('4') || String(response.statusCode).startsWith('5')) {
        const errorBody = response.body;
        const error = (errorBody?.error ?? {});
        const errorMessage = typeof error.message === 'string'
            ? error.message
            : (response.statusMessage ?? 'An unexpected issue occurred');
        const errorType = typeof error.type === 'string' ? error.type : 'UnknownError';
        const itemIndex = typeof error.itemIndex === 'number' ? `[Item ${error.itemIndex}]` : '';
        if (errorType === 'invalid_model') {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), errorBody, {
                message: 'Invalid model',
                description: 'The model is not valid. Permitted models can be found in the documentation at https://docs.perplexity.ai/guides/model-cards.',
            });
        }
        // Fallback for other errors
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
            message: `${errorMessage}${itemIndex ? ' ' + itemIndex : ''}.`,
            description: 'Any optional system messages must be sent first, followed by alternating user and assistant messages. For more details, refer to the API documentation: https://docs.perplexity.ai/api-reference/chat-completions',
        });
    }
    return data;
}
//# sourceMappingURL=GenericFunctions.js.map