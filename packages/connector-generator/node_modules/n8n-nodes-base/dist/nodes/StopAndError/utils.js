"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorFromParameters = createErrorFromParameters;
const n8n_workflow_1 = require("n8n-workflow");
function isString(value) {
    return typeof value === 'string' && value.length > 0;
}
function createErrorFromParameters(errorType, errorParameter) {
    if (errorType === 'errorMessage') {
        return {
            message: errorParameter,
        };
    }
    else {
        const errorObject = (0, n8n_workflow_1.jsonParse)(errorParameter);
        const errorMessage = (isString(errorObject.message) ? errorObject.message : '') ||
            (isString(errorObject.description) ? errorObject.description : '') ||
            (isString(errorObject.error) ? errorObject.error : '') ||
            `Error: ${JSON.stringify(errorObject)}`;
        return {
            message: errorMessage,
            options: {
                description: isString(errorObject.description) ? errorObject.description : undefined,
                type: isString(errorObject.type) ? errorObject.type : undefined,
                level: 'error',
                metadata: errorObject,
            },
        };
    }
}
//# sourceMappingURL=utils.js.map