import { ApplicationError } from '@n8n/errors';
export declare class WebhookAuthorizationError extends ApplicationError {
    readonly responseCode: number;
    constructor(responseCode: number, message?: string);
}
//# sourceMappingURL=error.d.ts.map