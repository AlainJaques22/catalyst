import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
import type { ICouponLine, IFeeLine, ILineItem, IShoppingLine } from './OrderInterface';
export declare function woocommerceApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function woocommerceApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
/**
 * Creates a secret from the credentials
 *
 */
export declare function getAutomaticSecret(credentials: ICredentialDataDecryptedObject): string;
export declare function setMetadata(data: IShoppingLine[] | IFeeLine[] | ILineItem[] | ICouponLine[]): void;
export declare function toSnakeCase(data: IShoppingLine[] | IFeeLine[] | ILineItem[] | ICouponLine[] | IDataObject): void;
export declare function setFields(fieldsToSet: IDataObject, body: IDataObject): void;
export declare function adjustMetadata(fields: IDataObject & Metadata): (IDataObject & Metadata) | {
    meta_data: {
        key: string;
        value: string;
    }[];
};
type Metadata = {
    meta_data?: {
        meta_data_fields: Array<{
            key: string;
            value: string;
        }>;
    };
};
export {};
//# sourceMappingURL=GenericFunctions.d.ts.map