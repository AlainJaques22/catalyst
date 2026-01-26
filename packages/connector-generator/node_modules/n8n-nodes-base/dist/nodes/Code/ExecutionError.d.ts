import { ApplicationError } from '@n8n/errors';
export declare class ExecutionError extends ApplicationError {
    description: string | null;
    itemIndex: number | undefined;
    context: {
        itemIndex: number;
    } | undefined;
    stack: string;
    lineNumber: number | undefined;
    constructor(error: Error & {
        stack?: string;
    }, itemIndex?: number);
    /**
     * Populate error `message` and `description` from error `stack`.
     */
    private populateFromStack;
    private toLineNumberDisplay;
    private toErrorDetailsAndType;
}
//# sourceMappingURL=ExecutionError.d.ts.map