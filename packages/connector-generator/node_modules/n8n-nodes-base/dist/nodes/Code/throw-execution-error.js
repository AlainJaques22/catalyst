"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwExecutionError = throwExecutionError;
const n8n_workflow_1 = require("n8n-workflow");
const WrappedExecutionError_1 = require("./errors/WrappedExecutionError");
function throwExecutionError(error) {
    if (error instanceof Error) {
        throw error;
    }
    else if ((0, WrappedExecutionError_1.isWrappableError)(error)) {
        // The error coming from task runner is not an instance of error,
        // so we need to wrap it in an error instance.
        throw new WrappedExecutionError_1.WrappedExecutionError(error);
    }
    throw new n8n_workflow_1.ApplicationError(`Unknown error: ${JSON.stringify(error)}`);
}
//# sourceMappingURL=throw-execution-error.js.map