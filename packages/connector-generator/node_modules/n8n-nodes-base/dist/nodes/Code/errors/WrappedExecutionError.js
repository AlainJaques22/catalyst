"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedExecutionError = void 0;
exports.isWrappableError = isWrappableError;
const errors_1 = require("@n8n/errors");
/**
 * Errors received from the task runner are not instances of Error.
 * This class wraps them in an Error instance and makes all their
 * properties available.
 */
class WrappedExecutionError extends errors_1.ApplicationError {
    constructor(error) {
        const message = typeof error.message === 'string' ? error.message : 'Unknown error';
        super(message, {
            cause: error,
        });
        this.copyErrorProperties(error);
    }
    copyErrorProperties(error) {
        for (const key of Object.getOwnPropertyNames(error)) {
            this[key] = error[key];
        }
    }
}
exports.WrappedExecutionError = WrappedExecutionError;
function isWrappableError(error) {
    return typeof error === 'object' && error !== null;
}
//# sourceMappingURL=WrappedExecutionError.js.map