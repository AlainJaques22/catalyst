import type { JsonObject } from 'n8n-workflow';
export interface ErrorHandlerResult {
    message: string;
    options?: {
        description?: string;
        type?: string;
        level: 'error';
        metadata?: JsonObject;
    };
}
export declare function createErrorFromParameters(errorType: 'errorMessage' | 'errorObject', errorParameter: string): ErrorHandlerResult;
//# sourceMappingURL=utils.d.ts.map