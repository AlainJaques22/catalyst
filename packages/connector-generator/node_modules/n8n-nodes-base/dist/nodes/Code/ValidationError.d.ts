import { ApplicationError } from '@n8n/errors';
export declare class ValidationError extends ApplicationError {
    description: string;
    itemIndex: number | undefined;
    context: {
        itemIndex: number;
    } | undefined;
    lineNumber: number | undefined;
    constructor({ message, description, itemIndex, lineNumber, }: {
        message: string;
        description: string;
        itemIndex?: number;
        lineNumber?: number;
    });
}
//# sourceMappingURL=ValidationError.d.ts.map