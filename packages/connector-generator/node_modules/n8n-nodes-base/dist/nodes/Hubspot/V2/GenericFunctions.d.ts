import type { ICredentialDataDecryptedObject, ICredentialTestFunctions, IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function hubspotApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject, uri?: string): Promise<any>;
/**
 * Make an API request to paginated hubspot endpoint
 * and return all results
 */
export declare function hubspotApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
export declare function clean(obj: any): any;
export declare const propertyEvents: string[];
export declare const contactFields: {
    id: string;
    label: string;
}[];
export declare const companyFields: {
    id: string;
    label: string;
}[];
export declare const dealFields: {
    id: string;
    label: string;
}[];
export declare const getEmailMetadata: (meta: IDataObject) => {
    text?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    html?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    subject?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    from: {
        lastName?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
        firstName?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
        email?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    };
    cc: {
        email: never;
    }[];
    bcc: {
        email: never;
    }[];
};
export declare const getTaskMetadata: (meta: IDataObject) => {
    forObjectType?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    status?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    subject?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    body?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
};
export declare const getMeetingMetadata: (meta: IDataObject) => {
    internalMeetingNotes?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    title?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    endTime?: number | undefined;
    startTime?: number | undefined;
    body?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
};
export declare const getCallMetadata: (meta: IDataObject) => {
    body?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    recordingUrl?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    durationMilliseconds?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    status?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    fromNumber?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
    toNumber?: string | number | true | object | IDataObject | import("n8n-workflow").GenericValue[] | IDataObject[] | undefined;
};
export declare const getAssociations: (associations: {
    companyIds: string;
    dealIds: string;
    ownerIds: string;
    contactIds: string;
    ticketIds: string;
}) => {
    ticketIds?: string[] | undefined;
    ownerIds?: string[] | undefined;
    dealIds?: string[] | undefined;
    contactIds?: string[] | undefined;
    companyIds?: string[] | undefined;
};
export declare function validateCredentials(this: ICredentialTestFunctions, decryptedCredentials: ICredentialDataDecryptedObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map