import type { IDataObject, IExecuteFunctions, IExecuteSingleFunctions, ILoadOptionsFunctions, IPollFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
export declare const messageFields: {
    name: string;
    value: string;
}[];
export declare const eventfields: {
    name: string;
    value: string;
}[];
export declare const contactFields: {
    name: string;
    value: string;
}[];
export declare function makeRecipient(email: string): {
    emailAddress: {
        address: string;
    };
};
export declare function createMessage(fields: IDataObject): IDataObject;
export declare function simplifyOutputMessages(data: IDataObject[]): {
    id: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    conversationId: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    subject: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    bodyPreview: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    from: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    to: (IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[])[];
    categories: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    hasAttachments: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
}[];
export declare function prepareContactFields(fields: IDataObject): IDataObject;
export declare function prepareFilterString(filters: IDataObject): string | undefined;
export declare function prepareApiError(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IPollFunctions, error: IDataObject, itemIndex?: number): NodeApiError;
export declare const encodeOutlookId: (id: string) => string;
export declare const decodeOutlookId: (id: string) => string;
//# sourceMappingURL=utils.d.ts.map