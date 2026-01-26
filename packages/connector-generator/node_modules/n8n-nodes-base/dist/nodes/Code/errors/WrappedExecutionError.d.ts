import { ApplicationError } from '@n8n/errors';
export type WrappableError = Record<string, unknown>;
/**
 * Errors received from the task runner are not instances of Error.
 * This class wraps them in an Error instance and makes all their
 * properties available.
 */
export declare class WrappedExecutionError extends ApplicationError {
    [key: string]: unknown;
    constructor(error: WrappableError);
    private copyErrorProperties;
}
export declare function isWrappableError(error: unknown): error is WrappableError;
//# sourceMappingURL=WrappedExecutionError.d.ts.map